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
    let biconomyService = BiconomyService()
    
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
        
        // for test to init ParticleNetwork
        ParticleNetwork.initialize(config: .init(chainInfo: .polygon(.mumbai), devEnv: .debug))
        
        BiconomyService.initialize(version: biconomyVersion, dappApiKeys: dappApiKeys)
    }
    
    @objc
    public func isSupportChainInfo(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let name = data["chain_name"].stringValue.lowercased()
        let chainId = data["chain_id"].intValue
        guard let chainInfo = matchChain(name: name, chainId: chainId) else {
            callback([false])
            return
        }
        let isSupport = BiconomyService().isSupportChainInfo(chainInfo)
        callback([isSupport])
    }
    
    @objc
    public func isBiconomyModeEnable(callback: @escaping RCTResponseSenderBlock) {
        callback([BiconomyService().isBiconomyModeEnable()])
    }
    
    @objc
    public func enableBiconomyMode() {
        biconomyService.enableBiconomyMode()
    }
    
    @objc
    public func disableBiconomyMode() {
        biconomyService.disableBiconomyMode()
    }
    
    @objc
    public func isDeploy(eoaAddress: String, callback: @escaping RCTResponseSenderBlock) {
        biconomyService.isDeploy(eoaAddress: eoaAddress).subscribe { result in
                switch result {
                case .failure(let error):
                    print("isDeploy rpc error, \(error)")
                    callback([false])
                case .success(let isDeploy):
                    callback([isDeploy])
                }
        }.disposed(by: bag)
    }
    
    @objc
    public func rpcGetFeeQuotes(eoaAddress: String, transactions: [String], callback: @escaping RCTResponseSenderBlock) {
        biconomyService.rpcGetFeeQuotes(eoaAddress: eoaAddress, transactions: transactions).subscribe { result in
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
