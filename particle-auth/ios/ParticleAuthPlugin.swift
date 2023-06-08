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
        guard let chainInfo = ParticleNetwork.searchChainInfo(by: chainId) else {
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
        let chainId = data["chain_id"].intValue
        guard let chainInfo = ParticleNetwork.searchChainInfo(by: chainId) else {
            callback([false])
            return
        }
        ParticleNetwork.setChainInfo(chainInfo)
        callback([true])
    }
    
    @objc
    public func setChainInfoAsync(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)

        let chainId = data["chain_id"].intValue
        guard let chainInfo = ParticleNetwork.searchChainInfo(by: chainId) else {
            callback([false])
            return
        }
        if !ParticleAuthService.isLogin() {
            ParticleNetwork.setChainInfo(chainInfo)
            callback([true])
            return
        }
        
        ParticleAuthService.setChainInfo(chainInfo).subscribe { result in
            
            switch result {
            case .failure:
//                let response = self.ResponseFromError(error)
//                let statusModel = ReactStatusModel(status: false, data: response)
//                let data = try! JSONEncoder().encode(statusModel)
//                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([false])
            case .success:
//                guard let userInfo = userInfo else { return }
//                let statusModel = ReactStatusModel(status: true, data: userInfo)
//                let data = try! JSONEncoder().encode(statusModel)
//                guard let json = String(data: data, encoding: .utf8) else { return }
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
                if $0 == "email" {
                    supportAuthTypeArray.append(.email)
                } else if $0 == "phone" {
                    supportAuthTypeArray.append(.phone)
                } else if $0 == "apple" {
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
                } else if $0 == "twitter" {
                    supportAuthTypeArray.append(.twitter)
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
                let userInfoJsonString = userInfo.jsonStringFullSnake()
                let newUserInfo = JSON(parseJSON: userInfoJsonString)
                let statusModel = ReactStatusModel(status: true, data: newUserInfo)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            }
        }.disposed(by: bag)
    }
    
    @objc
    public func setUserInfo(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ParticleAuthService.setUserInfo(json: json).subscribe { result in
            switch result {
            case .failure:
                callback([false])
            case .success(let userInfo):
                guard let userInfo = userInfo else {
                    callback([false])
                    return
                }
                if !userInfo.token.isEmpty, !userInfo.uuid.isEmpty {
                    callback([true])
                } else {
                    callback([false])
                }
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
    public func fastLogout(_ callback: @escaping RCTResponseSenderBlock) {
        ParticleAuthService.fastLogout().subscribe { [weak self] result in
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
    public func isLoginAsync(_ callback: @escaping RCTResponseSenderBlock) {
        ParticleAuthService.isLoginAsync().subscribe { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .failure(let error):
                let response = self.ResponseFromError(error)
                let statusModel = ReactStatusModel(status: false, data: response)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            case .success(let userInfo):
                let statusModel = ReactStatusModel(status: true, data: userInfo)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            }
        }.disposed(by: bag)
    }
    
    @objc
    public func signMessage(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        var serializedMessage = ""
        switch ParticleNetwork.getChainInfo().chain {
        case .solana:
            serializedMessage = Base58.encode(message.data(using: .utf8)!)
        default:
            serializedMessage = message
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
    public func signMessageUnique(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        var serializedMessage = ""
        switch ParticleNetwork.getChainInfo().chain {
        case .solana:
            serializedMessage = Base58.encode(message.data(using: .utf8)!)
        default:
            serializedMessage = message
        }
        
        ParticleAuthService.signMessageUnique(serializedMessage).subscribe { [weak self] result in
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
        let data = JSON(parseJSON: message)
        let transaction = data["transaction"].stringValue
        let mode = data["fee_mode"]["option"].stringValue
        var feeMode: Biconomy.FeeMode = .auto
        if mode == "auto" {
            feeMode = .auto
        } else if mode == "gasless" {
            feeMode = .gasless
        } else if mode == "custom" {
            let feeQuoteJson = JSON(data["fee_mode"]["fee_quote"].dictionaryValue)
            let feeQuote = Biconomy.FeeQuote(json: feeQuoteJson)
            feeMode = .custom(feeQuote)
        }
        
        ParticleAuthService.signAndSendTransaction(transaction, feeMode: feeMode).subscribe { [weak self] result in
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
    public func batchSendTransactions(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: message)
        let transactions = data["transactions"].arrayValue.map {
            $0.stringValue
        }
        let mode = data["fee_mode"]["option"].stringValue
        var feeMode: Biconomy.FeeMode = .auto
        if mode == "auto" {
            feeMode = .auto
        } else if mode == "gasless" {
            feeMode = .gasless
        } else if mode == "custom" {
            let feeQuoteJson = JSON(data["fee_mode"]["fee_quote"].dictionaryValue)
            let feeQuote = Biconomy.FeeQuote(json: feeQuoteJson)
            feeMode = .custom(feeQuote)
        }
        
        guard let biconomy = ParticleNetwork.getBiconomyService() else {
            let response = ReactResponseError(code: nil, message: "biconomy is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard biconomy.isBiconomyModeEnable() else {
            let response = ReactResponseError(code: nil, message: "biconomy is not enable", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        biconomy.quickSendTransactions(transactions, feeMode: feeMode, messageSigner: self).subscribe {
            [weak self] result in
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
        var signTypedDataVersion: EVMSignTypedDataVersion?
        if version == "v1" {
            signTypedDataVersion = .v1
        } else if version == "v3" {
            signTypedDataVersion = .v3
        } else if version == "v4" {
            signTypedDataVersion = .v4
        } else if version == "v4unique" {
            signTypedDataVersion = .v4Unique
        }
        
        guard let signTypedDataVersion = signTypedDataVersion else {
            return
        }
       
        ParticleAuthService.signTypedData(message, version: signTypedDataVersion).subscribe { [weak self] result in
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
            ParticleNetwork.setInterfaceStyle(UIUserInterfaceStyle.unspecified)
        } else if json.lowercased() == "light" {
            ParticleNetwork.setInterfaceStyle(UIUserInterfaceStyle.light)
        } else if json.lowercased() == "dark" {
            ParticleNetwork.setInterfaceStyle(UIUserInterfaceStyle.dark)
        }
    }

    @objc
    public func setLanguage(_ json: String) {
        /*
         en,
         zh_hans,
         zh_hant,
         ja,
         ko
         */
        if json.lowercased() == "en" {
            ParticleNetwork.setLanguage(.en)
        } else if json.lowercased() == "zh_hans" {
            ParticleNetwork.setLanguage(.zh_Hans)
        } else if json.lowercased() == "zh_hant" {
            ParticleNetwork.setLanguage(.zh_Hant)
        } else if json.lowercased() == "ja" {
            ParticleNetwork.setLanguage(.ja)
        } else if json.lowercased() == "ko" {
            ParticleNetwork.setLanguage(.ko)
        }
    }
    
    @objc
    public func setDisplayWallet(_ displayWallet: Bool) {
        ParticleAuthService.setDisplayWallet(displayWallet)
    }
    
    @objc
    public func setMediumScreen(_ isMediumScreen: Bool) {
        if #available(iOS 15.0, *) {
            ParticleAuthService.setMediumScreen(isMediumScreen)
        } else {
            // Fallback on earlier versions
        }
    }
    
    @objc func openAccountAndSecurity() {
        ParticleAuthService.openAccountAndSecurity().subscribe { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .failure(let error):
                let response = self.ResponseFromError(error)
                let statusModel = ReactStatusModel(status: false, data: response)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                ParticleAuthEvent.emitter.sendEvent(withName: "securityFailedCallBack", body: [json])
            case .success():
                break
            }
        }.disposed(by: bag)
    }
    
    @objc
    public func openWebWallet() {
        ParticleAuthService.openWebWallet()
    }
    
    @objc
    public func setSecurityAccountConfig(_ json: String) {
        let data = JSON(parseJSON: json)
        let promptSettingWhenSign = data["prompt_setting_when_sign"].intValue
        let promptMasterPasswordSettingWhenLogin = data["prompt_master_password_setting_when_login"].intValue
        ParticleAuthService.setSecurityAccountConfig(config: .init(promptSettingWhenSign: promptSettingWhenSign, promptMasterPasswordSettingWhenLogin: promptMasterPasswordSettingWhenLogin))
    }
}

public extension Dictionary {
    /// - Parameter prettify: set true to prettify string (default is false).
    /// - Returns: optional JSON String (if applicable).
    func jsonString(prettify: Bool = false) -> String? {
        guard JSONSerialization.isValidJSONObject(self) else { return nil }
        let options = (prettify == true) ? JSONSerialization.WritingOptions.prettyPrinted : JSONSerialization.WritingOptions()
        guard let jsonData = try? JSONSerialization.data(withJSONObject: self, options: options) else { return nil }
        return String(data: jsonData, encoding: .utf8)
    }
}

@objc(ParticleAuthEvent)
class ParticleAuthEvent: RCTEventEmitter {
    public static var emitter: RCTEventEmitter!

    var hasListeners: Bool = false
    
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override init() {
        super.init()
        ParticleAuthEvent.emitter = self
    }

    override open func supportedEvents() -> [String] {
        ["securityFailedCallBack"]
    }
    
    override func startObserving() {
        hasListeners = true
        print("startObserving")
    }
    
    override func stopObserving() {
        hasListeners = false
        print("stopObserving")
    }
    
    override func addListener(_ eventName: String!) {
        super.addListener(eventName)
    }
    
    override func removeListeners(_ count: Double) {
        super.removeListeners(count)
    }
}

extension ParticleAuthPlugin: MessageSigner {
    public func signTypedData(_ message: String) -> RxSwift.Single<String> {
        return ParticleAuthService.signTypedData(message, version: .v4)
    }
    
    public func signMessage(_ message: String) -> RxSwift.Single<String> {
        return ParticleAuthService.signMessage(message)
    }
    
    public func getEoaAddress() -> String {
        ParticleAuthService.getAddress()
    }
}
