//
//  ParticleAuthPlugin.swift
//  ParticleAuthExample
//
//  Created by link on 2022/9/28.
//

import Base58_swift
import Foundation
import ParticleAuthService
import ParticleNetworkBase
import RxSwift
import SwiftyJSON

typealias ParticleCallBack = RCTResponseSenderBlock

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
        
        let chainId = data["chain_id"].intValue
        let chainName = data["chain_name"].stringValue.lowercased()
        let chainType: ChainType = chainName == "solana" ? .solana : .evm
        
        guard let chainInfo = ParticleNetwork.searchChainInfo(by: chainId, chainType: chainType) else {
            return print("initialize error, can't find right chain for \(chainName), chainId \(chainId)")
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
        let chainName = data["chain_name"].stringValue.lowercased()
        let chainType: ChainType = chainName == "solana" ? .solana : .evm
        guard let chainInfo = ParticleNetwork.searchChainInfo(by: chainId, chainType: chainType) else {
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
        let chainName = data["chain_name"].stringValue.lowercased()
        let chainType: ChainType = chainName == "solana" ? .solana : .evm
        
        guard let chainInfo = ParticleNetwork.searchChainInfo(by: chainId, chainType: chainType) else {
            callback([false])
            return
        }
        if !ParticleAuthService.isLogin() {
            ParticleNetwork.setChainInfo(chainInfo)
            callback([true])
            return
        }
        
        ParticleAuthService.switchChain(chainInfo).subscribe { result in
            
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
        
        let jsonString = ["chain_name": chainInfo.name,
                          "chain_id": chainInfo.chainId].jsonString() ?? ""
        
        callback([jsonString])
    }
    
    @objc
    public func login(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let type = data["login_type"].stringValue.lowercased()
        let account = data["account"].string
        let supportAuthType = data["support_auth_type_values"].arrayValue
        
        let socialLoginPromptString = data["social_login_prompt"].stringValue.lowercased()
        let socialLoginPrompt: SocialLoginPrompt? = SocialLoginPrompt(rawValue: socialLoginPromptString)
        
        let message: String? = data["authorization"]["message"].string
        let isUnique: Bool = data["authorization"]["uniq"].bool ?? false
        
        var loginAuthorization: LoginAuthorization?
        
        if message != nil {
            loginAuthorization = .init(message: message!, isUnique: isUnique)
        }
        
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
        
        let observable = ParticleAuthService.login(type: loginType, account: acc, supportAuthType: supportAuthTypeArray, socialLoginPrompt: socialLoginPrompt, authorization: loginAuthorization).map { userInfo in
            let userInfoJsonString = userInfo?.jsonStringFullSnake()
            let newUserInfo = JSON(parseJSON: userInfoJsonString ?? "")
            return newUserInfo
        }
        
        subscribeAndCallback(observable: observable, callback: callback)
    }
    
    @objc
    public func logout(_ callback: @escaping RCTResponseSenderBlock) {
        subscribeAndCallback(observable: ParticleAuthService.logout(), callback: callback)
    }

    @objc
    public func fastLogout(_ callback: @escaping RCTResponseSenderBlock) {
        subscribeAndCallback(observable: ParticleAuthService.fastLogout(), callback: callback)
    }
    
    @objc
    public func isLogin(_ callback: RCTResponseSenderBlock) {
        let isLogin = ParticleAuthService.isLogin()
        callback([isLogin])
    }
    
    @objc
    public func isLoginAsync(_ callback: @escaping RCTResponseSenderBlock) {
        let observable = ParticleAuthService.isLoginAsync().map { userInfo in
            let userInfoJsonString = userInfo.jsonStringFullSnake()
            let newUserInfo = JSON(parseJSON: userInfoJsonString)
            return newUserInfo
        }
        
        subscribeAndCallback(observable: observable, callback: callback)
    }
    
    @objc
    public func signMessage(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        var serializedMessage = ""
        switch ParticleNetwork.getChainInfo().chainType {
        case .solana:
            serializedMessage = Base58.encode(message.data(using: .utf8)!)
        default:
            serializedMessage = message
        }
        
        subscribeAndCallback(observable: ParticleAuthService.signMessage(serializedMessage), callback: callback)
    }
    
    @objc
    public func signMessageUnique(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        var serializedMessage = ""
        switch ParticleNetwork.getChainInfo().chainType {
        case .solana:
            serializedMessage = Base58.encode(message.data(using: .utf8)!)
        default:
            serializedMessage = message
        }
        
        subscribeAndCallback(observable: ParticleAuthService.signMessageUnique(serializedMessage), callback: callback)
    }
    
    @objc
    public func signTransaction(_ transaction: String, callback: @escaping RCTResponseSenderBlock) {
        subscribeAndCallback(observable: ParticleAuthService.signTransaction(transaction), callback: callback)
    }
    
    @objc
    public func signAllTransactions(_ transactions: String, callback: @escaping RCTResponseSenderBlock) {
        let transactions = JSON(parseJSON: transactions).arrayValue.map { $0.stringValue }
        
        subscribeAndCallback(observable: ParticleAuthService.signAllTransactions(transactions), callback: callback)
    }
    
    @objc
    public func signAndSendTransaction(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let transaction = data["transaction"].stringValue
        let mode = data["fee_mode"]["option"].stringValue
        var feeMode: AA.FeeMode = .native
        if mode == "native" {
            feeMode = .native
        } else if mode == "gasless" {
            feeMode = .gasless
        } else if mode == "token" {
            let feeQuoteJson = JSON(data["fee_mode"]["fee_quote"].dictionaryValue)
            let tokenPaymasterAddress = data["fee_mode"]["token_paymaster_address"].stringValue
            let feeQuote = AA.FeeQuote(json: feeQuoteJson, tokenPaymasterAddress: tokenPaymasterAddress)

            feeMode = .token(feeQuote)
        }
               
        let wholeFeeQuoteData = (try? data["fee_mode"]["whole_fee_quote"].rawData()) ?? Data()
        let wholeFeeQuote = try? JSONDecoder().decode(AA.WholeFeeQuote.self, from: wholeFeeQuoteData)
               
        let chainInfo = ParticleNetwork.getChainInfo()
        let aaService = ParticleNetwork.getAAService()
        var sendObservable: Single<String>
        if aaService != nil, aaService!.isAAModeEnable() {
            sendObservable = aaService!.quickSendTransactions([transaction], feeMode: feeMode, messageSigner: self, wholeFeeQuote: wholeFeeQuote, chainInfo: chainInfo)
        } else {
            sendObservable = ParticleAuthService.signAndSendTransaction(transaction, feeMode: feeMode, chainInfo: chainInfo)
        }
                   
        subscribeAndCallback(observable: sendObservable, callback: callback)
    }
    
    @objc
    public func batchSendTransactions(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let transactions = data["transactions"].arrayValue.map {
            $0.stringValue
        }
        let mode = data["fee_mode"]["option"].stringValue
        var feeMode: AA.FeeMode = .native
        if mode == "native" {
            feeMode = .native
        } else if mode == "gasless" {
            feeMode = .gasless
        } else if mode == "token" {
            let feeQuoteJson = JSON(data["fee_mode"]["fee_quote"].dictionaryValue)
            let tokenPaymasterAddress = data["fee_mode"]["token_paymaster_address"].stringValue
            let feeQuote = AA.FeeQuote(json: feeQuoteJson, tokenPaymasterAddress: tokenPaymasterAddress)

            feeMode = .token(feeQuote)
        }
               
        let wholeFeeQuoteData = (try? data["fee_mode"]["whole_fee_quote"].rawData()) ?? Data()
        let wholeFeeQuote = try? JSONDecoder().decode(AA.WholeFeeQuote.self, from: wholeFeeQuoteData)
               
        guard let aaService = ParticleNetwork.getAAService() else {
            let response = ReactResponseError(code: nil, message: "aa service is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
               
        guard aaService.isAAModeEnable() else {
            let response = ReactResponseError(code: nil, message: "aa service is not enable", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        let chainInfo = ParticleNetwork.getChainInfo()
        let sendObservable: Single<String> = aaService.quickSendTransactions(transactions, feeMode: feeMode, messageSigner: self, wholeFeeQuote: wholeFeeQuote, chainInfo: chainInfo)
               
        subscribeAndCallback(observable: sendObservable, callback: callback)
    }
    
    @objc
    public func signTypedData(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let message = data["message"].stringValue
        
        let version = data["version"].stringValue.lowercased()
        var signTypedDataVersion: EVMSignTypedDataVersion = .v4
        if version == "v1" {
            signTypedDataVersion = .v1
        } else if version == "v3" {
            signTypedDataVersion = .v3
        } else if version == "v4" {
            signTypedDataVersion = .v4
        } else if version == "v4unique" {
            signTypedDataVersion = .v4Unique
        }
        
        subscribeAndCallback(observable: ParticleAuthService.signTypedData(message, version: signTypedDataVersion), callback: callback)
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
        let json = userInfo.jsonStringFullSnake()
        resolve(json)
    }
    
    @objc
    public func setModalPresentStyle(_ style: String) {
        if style == "fullScreen" {
            ParticleAuthService.setModalPresentStyle(.fullScreen)
        } else {
            ParticleAuthService.setModalPresentStyle(.pageSheet)
        }
    }
    
    @objc
    public func setAppearance(_ json: String) {
        /**
         SYSTEM,
         LIGHT,
         DARK,
         */
        if json.lowercased() == "system" {
            ParticleNetwork.setAppearance(UIUserInterfaceStyle.unspecified)
        } else if json.lowercased() == "light" {
            ParticleNetwork.setAppearance(UIUserInterfaceStyle.light)
        } else if json.lowercased() == "dark" {
            ParticleNetwork.setAppearance(UIUserInterfaceStyle.dark)
        }
    }
    
    @objc
    public func setFiatCoin(_ json: String) {
        /*
         USD,
         CNY,
         JPY,
         HKD,
         INR,
         KRW
         */
        ParticleNetwork.setFiatCoin(.init(rawValue: json) ?? .usd)
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
    public func getLanguage(_ resolve: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
        var language = ""
        
        switch ParticleNetwork.getLanguage() {
        case .en:
            language = "en"
        case .zh_Hans:
            language = "zh_hans"
        case .zh_Hant:
            language = "zh_hant"
        case .ja:
            language = "ja"
        case .ko:
            language = "ko"
        default:
            language = "en"
        }
        
        resolve(language)
    }
    
    @objc
    public func setWebAuthConfig(_ json: String) {
        let data = JSON(parseJSON: json)
        let isDisplayWallet = data["display_wallet"].boolValue
        let appearance = data["appearance"].stringValue.lowercased()
                
        var style: UIUserInterfaceStyle = .unspecified
        if appearance == "system" {
            style = UIUserInterfaceStyle.unspecified
        } else if appearance == "light" {
            style = UIUserInterfaceStyle.light
        } else if appearance == "dark" {
            style = UIUserInterfaceStyle.dark
        }
        
        ParticleAuthService.setWebAuthConfig(options: .init(isDisplayWallet: isDisplayWallet, appearance: style))
    }
    
    @objc
    public func setMediumScreen(_ isMediumScreen: Bool) {
        if #available(iOS 15.0, *) {
            ParticleAuthService.setMediumScreen(isMediumScreen)
        } else {
            // Fallback on earlier versions
        }
    }
    
    @objc
    public func openAccountAndSecurity() {
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
    public func setCustomStyle(_ json: String) {
        ParticleAuthService.setCustomStyle(string: json)
    }
    
    @objc
    public func openWebWallet(_ json: String) {
        ParticleAuthService.openWebWallet(styleJsonString: json)
    }
    
    @objc
    public func setSecurityAccountConfig(_ json: String) {
        let data = JSON(parseJSON: json)
        let promptSettingWhenSign = data["prompt_setting_when_sign"].intValue
        let promptMasterPasswordSettingWhenLogin = data["prompt_master_password_setting_when_login"].intValue
        ParticleNetwork.setSecurityAccountConfig(config: .init(promptSettingWhenSign: promptSettingWhenSign, promptMasterPasswordSettingWhenLogin: promptMasterPasswordSettingWhenLogin))
    }
        
    @objc
    public func getSecurityAccount(_ callback: @escaping RCTResponseSenderBlock) {
        subscribeAndCallback(observable: ParticleAuthService.getSecurityAccount().map { securityAccountInfo in
            let dict = ["phone": securityAccountInfo.phone,
                        "email": securityAccountInfo.email,
                        "has_set_master_password": securityAccountInfo.hasSetMasterPassword,
                        "has_set_payment_password": securityAccountInfo.hasSetPaymentPassword] as [String: Any?]
                   
            let json = JSON(dict)
            return json
        }, callback: callback)
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

extension ParticleAuthPlugin {
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

extension ParticleAuthPlugin: MessageSigner {
    func signMessage(_ message: String, chainInfo: ParticleNetworkBase.ParticleNetwork.ChainInfo?) -> RxSwift.Single<String> {
        return ParticleAuthService.signMessage(message, chainInfo: chainInfo)
    }
    
    func getEoaAddress() -> String {
        ParticleAuthService.getAddress()
    }
}
