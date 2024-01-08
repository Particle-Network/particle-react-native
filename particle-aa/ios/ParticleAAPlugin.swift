//
//  ParticleAAPlugin.swift
//  ParticleAAPlugin
//
//  Created by link on 2023/5/19.
//
import Foundation
import ParticleAA
import ParticleNetworkBase
import RxSwift
import SwiftyJSON

typealias ParticleCallBack = RCTResponseSenderBlock

@objc(ParticleAAPlugin)
class ParticleAAPlugin: NSObject {
    let bag = DisposeBag()
    let aaService = AAService()
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    public func initialize(_ json: String) {
        let data = JSON(parseJSON: json)
        
        let biconomyAppKeysDict = data["biconomy_app_keys"].dictionaryValue
        var biconomyAppKeys: [Int: String] = [:]

        for (key, value) in biconomyAppKeysDict {
            if let intKey = Int(key) {
                biconomyAppKeys[intKey] = value.stringValue
            }
        }
        
        let name = data["name"].stringValue.uppercased()
        let version = data["version"].stringValue.lowercased()
        let accountName = AA.AccountName(version: version, name: name)
       
        var finalAccountName: AA.AccountName
        let all: [AA.AccountName] = [.biconomyV1, .biconomyV2, .simple, .cyberConnect]
        if all.contains(accountName) {
            finalAccountName = accountName
        } else {
            finalAccountName = .biconomyV1
        }
        
        AAService.initialize(name: finalAccountName, biconomyApiKeys: biconomyAppKeys)
        ParticleNetwork.setAAService(aaService)
    }
    
    @objc
    public func isAAModeEnable(_ callback: @escaping RCTResponseSenderBlock) {
        callback([aaService.isAAModeEnable()])
    }
    
    @objc
    public func enableAAMode() {
        aaService.enableAAMode()
    }
    
    @objc
    public func disableAAMode() {
        aaService.disableAAMode()
    }
    
    @objc
    public func isDeploy(_ eoaAddress: String, callback: @escaping RCTResponseSenderBlock) {
        let chainInfo = ParticleNetwork.getChainInfo()
        subscribeAndCallback(observable: aaService.isDeploy(eoaAddress: eoaAddress, chainInfo: chainInfo), callback: callback)
    }
    
    @objc
    public func rpcGetFeeQuotes(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let eoaAddress = data["eoa_address"].stringValue
        let transactions = data["transactions"].arrayValue.map {
            $0.stringValue
        }
        let chainInfo = ParticleNetwork.getChainInfo()
        subscribeAndCallback(observable: aaService.rpcGetFeeQuotes(eoaAddress: eoaAddress, transactions: transactions, chainInfo: chainInfo), callback: callback)
    }
}

extension ParticleAAPlugin {
    private func subscribeAndCallback<T: Codable>(observable: Single<T>, callback: @escaping ParticleCallBack) {
        observable.subscribe { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .failure(let error):
                let response = self.ResponseFromError(error)
                let statusModel = ReactStatusModel(status: false, data: response)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            case .success(let signedMessage):
                let statusModel = ReactStatusModel(status: true, data: signedMessage)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            }
        }.disposed(by: bag)
    }
}
