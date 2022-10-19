//
//  ParticleAuthPlugin.swift
//  ParticleAuthExample
//
//  Created by link on 2022/9/28.
//

import Foundation
import ParticleAuthService
import ParticleNetworkBase
import RxSwift
import SwiftyJSON

@objc(ParticleAuthPlugin)
class ParticleAuthPlugin: NSObject {
    let bag = DisposeBag()
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    public func initialize(_ json: String) {
        let data = JSON(parseJSON: json)
        let name = data["chain_name"].stringValue.lowercased()
        let chainId = data["chain_id"].intValue
        guard let chainInfo = matchChain(name: name, chainId: chainId) else {
            return print("initialize error, can't find right chain for \(name), chainId \(chainId)")
        }
        
        let env = data["env"].stringValue.lowercased()
        var devEnv: ParticleNetwork.DevEnvironment = .production
        
        if env == "dev" {
            devEnv = .debug
        } else if env == "staging" {
            devEnv = .staging
        } else if env == "production" {
            devEnv = .production
        }
        
        let config = ParticleNetworkConfiguration(chainInfo: chainInfo, devEnv: devEnv)
        ParticleNetwork.initialize(config: config)
    }
    
    @objc
    public func setChainInfo(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let name = data["chain_name"].stringValue.lowercased()
        let chainId = data["chain_id"].intValue
        guard let chainInfo = matchChain(name: name, chainId: chainId) else {
            callback([false])
            return
        }
        ParticleNetwork.setChainInfo(chainInfo)
        callback([true])
    }
    
    @objc
    public func setChainInfoAsync(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let name = data["chain_name"].stringValue.lowercased()
        let chainId = data["chain_id"].intValue
        guard let chainInfo = matchChain(name: name, chainId: chainId) else {
            callback([false])
            return
        }
        ParticleAuthService.setChainInfo(chainInfo).subscribe { [weak self] result in
            guard let self = self else { return }

            switch result {
            case .failure(let error):
                let response = self.ResponseFromError(error)
                let statusModel = ReactStatusModel(status: false, data: response)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([false])
            case .success(let userInfo):
                guard let userInfo = userInfo else { return }
                let statusModel = ReactStatusModel(status: true, data: userInfo)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([true])
            }
        }.disposed(by: bag)
    }
    
    @objc
    public func getChainInfo(_ callback: @escaping RCTResponseSenderBlock) {
        let chainInfo = ParticleNetwork.getChainInfo()
        
        let jsonString = ["chain_name": chainInfo.name, "chain_id": chainInfo.chainId, "chain_id_name": chainInfo.network].jsonString() ?? ""
        
        callback([jsonString])
    }
    
    @objc
    public func login(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let type = data["login_type"].stringValue.lowercased()
        let account = data["account"].string
        let supportAuthType = data["support_auth_type_values"].arrayValue
        let loginFormMode = data["login_form_mode"].bool ?? false
        
        let loginType = LoginType(rawValue: type) ?? .email
        var supportAuthTypeArray: [SupportAuthType] = []
        
        let array = supportAuthType.map {
            $0.stringValue.lowercased()
        }
        
        if array.contains("all") {
            supportAuthTypeArray = [.all]
        } else {
            array.forEach {
                if $0 == "apple" {
                    supportAuthTypeArray.append(.apple)
                } else if $0 == "google" {
                    supportAuthTypeArray.append(.google)
                } else if $0 == "facebook" {
                    supportAuthTypeArray.append(.facebook)
                } else if $0 == "github" {
                    supportAuthTypeArray.append(.github)
                } else if $0 == "twitch" {
                    supportAuthTypeArray.append(.twitch)
                } else if $0 == "microsoft" {
                    supportAuthTypeArray.append(.microsoft)
                } else if $0 == "linkedin" {
                    supportAuthTypeArray.append(.linkedin)
                } else if $0 == "discord" {
                    supportAuthTypeArray.append(.discord)
                }
            }
        }
        
        var acc = account
        if acc != nil, acc!.isEmpty {
            acc = nil
        }
        
        ParticleAuthService.login(type: loginType, account: acc, supportAuthType: supportAuthTypeArray, loginFormMode: loginFormMode).subscribe { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .failure(let error):
                let response = self.ResponseFromError(error)
                let statusModel = ReactStatusModel(status: false, data: response)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            case .success(let userInfo):
                guard let userInfo = userInfo else { return }
                let statusModel = ReactStatusModel(status: true, data: userInfo)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            }
        }.disposed(by: bag)
    }
    
    @objc
    public func logout(_ callback: @escaping RCTResponseSenderBlock) {
        ParticleAuthService.logout().subscribe { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .failure(let error):
                let response = self.ResponseFromError(error)
                let statusModel = ReactStatusModel(status: false, data: response)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            case .success(let success):
                let statusModel = ReactStatusModel(status: true, data: success)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            }
        }.disposed(by: bag)
    }
    
    @objc
    public func isLogin(_ callback: RCTResponseSenderBlock) {
        callback([ParticleAuthService.isLogin()])
    }
    
    @objc
    public func signMessage(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        var serializedMessage = ""
        switch ParticleNetwork.getChainInfo().chain {
        case .solana:
            serializedMessage = Base58.encode(message.data(using: .utf8)!)
        default:
            serializedMessage = "0x" + message.data(using: .utf8)!.map { String(format: "%02x", $0) }.joined()
        }
        
        ParticleAuthService.signMessage(serializedMessage).subscribe { [weak self] result in
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
    
    @objc
    public func signTransaction(_ transaction: String, callback: @escaping RCTResponseSenderBlock) {
        ParticleAuthService.signTransaction(transaction).subscribe { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .failure(let error):
                let response = self.ResponseFromError(error)
                let statusModel = ReactStatusModel(status: false, data: response)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            case .success(let signed):
                let statusModel = ReactStatusModel(status: true, data: signed)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            }
        }.disposed(by: bag)
    }
    
    @objc
    public func signAllTransactions(_ transactions: String, callback: @escaping RCTResponseSenderBlock) {
        let transactions = JSON(parseJSON: transactions).arrayValue.map { $0.stringValue }
        ParticleAuthService.signAllTransactions(transactions).subscribe { [weak self] result in
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
    
    @objc
    public func signAndSendTransaction(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        ParticleAuthService.signAndSendTransaction(message).subscribe { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .failure(let error):
                let response = self.ResponseFromError(error)
                let statusModel = ReactStatusModel(status: false, data: response)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            case .success(let signature):
                let statusModel = ReactStatusModel(status: true, data: signature)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            }
        }.disposed(by: bag)
    }
    
    @objc
    public func signTypedData(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let message = data["message"].stringValue
        let version = data["version"].stringValue.lowercased()
        
        let hexString = "0x" + message.data(using: .utf8)!.map { String(format: "%02x", $0) }.joined()
       
        ParticleAuthService.signTypedData(hexString, version: EVMSignTypedDataVersion(rawValue: version) ?? .v1).subscribe { [weak self] result in
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
    
    @objc
    public func getAddress(_ resolve: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
        resolve(ParticleAuthService.getAddress())
    }
    
    @objc
    public func getUserInfo(_ resolve: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
        guard let userInfo = ParticleAuthService.getUserInfo() else {
            rejecter("", "user is not login", nil)
            return
        }
        let data = try! JSONEncoder().encode(userInfo)
        let json = String(data: data, encoding: .utf8)
        resolve(json ?? "")
    }
    
    @objc
    public func setModalPresentStyle(_ style: String) {
        if style == "fullScreen" {
            ParticleAuthService.setModalPresentStyle(.fullScreen)
        } else {
            ParticleAuthService.setModalPresentStyle(.formSheet)
        }
    }
    
    @objc
    public func setInterfaceStyle(_ json: String) {
        /**
         SYSTEM,
         LIGHT,
         DARK,
         */
        if json.lowercased() == "system" {
            ParticleAuthService.setInterfaceStyle(UIUserInterfaceStyle.unspecified)
        } else if json.lowercased() == "light" {
            ParticleAuthService.setInterfaceStyle(UIUserInterfaceStyle.light)
        } else if json.lowercased() == "dark" {
            ParticleAuthService.setInterfaceStyle(UIUserInterfaceStyle.dark)
        }
    }
    
    @objc
    public func setDisplayWallet(_ displayWallet: Bool) {
        ParticleAuthService.setDisplayWallet(displayWallet)
    }
    
    @objc
    public func openWebWallet() {
        ParticleAuthService.openWebWallet()
    }
}

extension Dictionary {
    /// - Parameter prettify: set true to prettify string (default is false).
    /// - Returns: optional JSON String (if applicable).
    public func jsonString(prettify: Bool = false) -> String? {
        guard JSONSerialization.isValidJSONObject(self) else { return nil }
        let options = (prettify == true) ? JSONSerialization.WritingOptions.prettyPrinted : JSONSerialization.WritingOptions()
        guard let jsonData = try? JSONSerialization.data(withJSONObject: self, options: options) else { return nil }
        return String(data: jsonData, encoding: .utf8)
    }
}
