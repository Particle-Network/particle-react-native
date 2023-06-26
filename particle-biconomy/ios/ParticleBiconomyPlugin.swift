//
//  ParticleBiconomyPlugin.swift
//  ParticleBiconomyPlugin
//
//  Created by link on 2023/5/19.
//
import Foundation
import ParticleBiconomy
import ParticleNetworkBase
import RxSwift
import SwiftyJSON

@objc(ParticleBiconomyPlugin)
class ParticleBiconomyPlugin: NSObject {
    let bag = DisposeBag()
    let biconomy = BiconomyService()
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    public func initialize(_ json: String) {
        let data = JSON(parseJSON: json)
        
        let dictionary: [String: JSON] = data["dapp_app_keys"].dictionaryValue

        var dappApiKeys: [Int: String] = [:]

        for (key, value) in dictionary {
            if let intKey = Int(key) {
                dappApiKeys[intKey] = value.stringValue
            }
        }
        
        let version = data["version"].stringValue
        
        guard let biconomyVersion = Biconomy.Version(rawValue: version) else {
            return print("Biconomy initialize error, version is not existed, \(version)")
        }
        
        BiconomyService.initialize(version: biconomyVersion, dappApiKeys: dappApiKeys)
        ParticleNetwork.setBiconomyService(biconomy)
    }
    
    @objc
    public func isSupportChainInfo(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let chainId = data["chain_id"].intValue
        guard let chainInfo = ParticleNetwork.searchChainInfo(by: chainId) else {
            callback([false])
            return
        }
        let isSupport = biconomy.isSupportChainInfo(chainInfo)
        callback([isSupport])
    }
    
    @objc
    public func isBiconomyModeEnable(_ callback: @escaping RCTResponseSenderBlock) {
        callback([biconomy.isBiconomyModeEnable()])
    }
    
    @objc
    public func enableBiconomyMode() {
        biconomy.enableBiconomyMode()
    }
    
    @objc
    public func disableBiconomyMode() {
        biconomy.disableBiconomyMode()
    }
    
    @objc
    public func isDeploy(_ eoaAddress: String, callback: @escaping RCTResponseSenderBlock) {
        biconomy.isDeploy(eoaAddress: eoaAddress).subscribe { result in
                switch result {
                case .failure(let error):
                    let response = self.ResponseFromError(error)
                    let statusModel = ReactStatusModel(status: false, data: response)
                    let data = try! JSONEncoder().encode(statusModel)
                    guard let json = String(data: data, encoding: .utf8) else { return }
                    callback([json])
                case .success(let isDeploy):
                    let statusModel = ReactStatusModel(status: true, data: isDeploy)
                    let data = try! JSONEncoder().encode(statusModel)
                    guard let json = String(data: data, encoding: .utf8) else { return }
                    callback([json])
                }
        }.disposed(by: bag)
    }
    
    
    @objc
    public func rpcGetFeeQuotes(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        
        let data = JSON(parseJSON: json)
        let eoaAddress = data["eoa_address"].stringValue
        let transactions = data["transactions"].arrayValue.map {
            $0.stringValue
        }
        
        biconomy.rpcGetFeeQuotes(eoaAddress: eoaAddress, transactions: transactions).subscribe { result in
            switch result {
            case .failure(let error):
                let response = self.ResponseFromError(error)
                let statusModel = ReactStatusModel(status: false, data: response)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            case .success(let feeQuotes):
                let jsonArray = feeQuotes.map {
                    $0.jsonObject
                }
                let statusModel = ReactStatusModel(status: true, data: jsonArray)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            }
            
        }.disposed(by: bag)
    }
}
