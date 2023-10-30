//
//  ParticleConnect.swift
//  ParticleConnectExample
//
//  Created by link on 2022/9/28.
//

import Base58_swift
import Foundation
import ParticleConnect
import ParticleNetworkBase
#if canImport(ConnectEVMAdapter)
import ConnectEVMAdapter
#endif

#if canImport(ConnectSolanaAdapter)
import ConnectSolanaAdapter
#endif

#if canImport(ConnectPhantomAdapter)
import ConnectPhantomAdapter
#endif

#if canImport(ConnectWalletConnectAdapter)
import ConnectWalletConnectAdapter
#endif

#if canImport(AuthCoreAdapter)
import AuthCoreAdapter
#endif

import ParticleAuthAdapter

import ConnectCommon
import RxSwift
import SwiftyJSON

@objc(ParticleConnectPlugin)
class ParticleConnectPlugin: NSObject {
    let bag = DisposeBag()
    
    var latestPublicAddress: String?
    var latestWalletType: WalletType?
    
    @objc
    public static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    public func initialize(_ json: String) {
        let data = JSON(parseJSON: json)
        let chainName = data["chain_name"].stringValue.lowercased()
        let chainId = data["chain_id"].intValue
        guard let chainInfo = ParticleNetwork.searchChainInfo(by: chainId) else {
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
        
        let dAppName = data["metadata"]["name"].stringValue
        let dAppIconString = data["metadata"]["icon"].stringValue
        let dAppUrlString = data["metadata"]["url"].stringValue
        let description = data["metadata"]["description"].stringValue
        let walletConnectProjectId = data["metadata"]["walletConnectProjectId"].stringValue
        
        let dAppIconUrl = URL(string: dAppIconString) != nil ? URL(string: dAppIconString)! : URL(string: "https://connect.particle.network/icons/512.png")!
        
        let dAppUrl = URL(string: dAppUrlString) != nil ? URL(string: dAppUrlString)! : URL(string: "https://connect.particle.network")!
        
        let dAppData = DAppMetaData(name: dAppName, icon: dAppIconUrl, url: dAppUrl, description: description)
        
        var adapters: [ConnectAdapter] = []
        
#if canImport(ParticleAuthAdapter)
        adapters.append(ParticleAuthAdapter())
#endif
#if canImport(ConnectEVMAdapter)
        let evmRpcUrl = data["rpc_url"]["evm_url"].stringValue
        if evmRpcUrl.isEmpty {
            adapters.append(EVMConnectAdapter())
        } else {
            adapters.append(EVMConnectAdapter(rpcUrl: evmRpcUrl))
        }
#endif
        
#if canImport(ConnectSolanaAdapter)
        let solanaRpcUrl = data["rpc_url"]["sol_url"].stringValue
        if solanaRpcUrl.isEmpty {
            adapters.append(SolanaConnectAdapter())
        } else {
            adapters.append(SolanaConnectAdapter(rpcUrl: solanaRpcUrl))
        }
#endif
        
#if canImport(ConnectPhantomAdapter)
        adapters.append(PhantomConnectAdapter())
#endif
        
#if canImport(AuthCoreAdapter)
        adapters.append(AuthCoreAdapter())
#endif
        
#if canImport(ConnectWalletConnectAdapter)
        adapters.append(MetaMaskConnectAdapter())
        adapters.append(RainbowConnectAdapter())
        adapters.append(BitkeepConnectAdapter())
        adapters.append(ImtokenConnectAdapter())
        adapters.append(WalletConnectAdapter())
        adapters.append(TrustConnectAdapter())
        
        let moreAdapterClasses: [WalletConnectAdapter.Type] =
            [ZerionConnectAdapter.self,
             MathConnectAdapter.self,
             OmniConnectAdapter.self,
             Inch1ConnectAdapter.self,
             ZengoConnectAdapter.self,
             AlphaConnectAdapter.self,
             OKXConnectAdapter.self]

        adapters.append(contentsOf: moreAdapterClasses.map {
            $0.init()
        })
#endif
        
        ParticleConnect.initialize(env: devEnv, chainInfo: chainInfo, dAppData: dAppData) {
            adapters
        }
        
        ParticleConnect.setWalletConnectV2ProjectId(walletConnectProjectId)
    }
    
    @objc
    public func getAccounts(_ json: String, resolve: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
        let walletTypeString = json
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed")
            rejecter("", "walletType \(walletTypeString) is not existed", nil)
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            rejecter("", "adapter for \(walletTypeString) is not init", nil)
            return
        }
        
        let accounts = adapter.getAccounts()
        let statusModel = ReactStatusModel(status: true, data: accounts)
        let data = try! JSONEncoder().encode(statusModel)
        let json = String(data: data, encoding: .utf8) ?? ""
        resolve(json)
    }
    
    @objc
    public func connect(_ json: String, configJson: String, callback: @escaping RCTResponseSenderBlock) {
        let walletTypeString = json
        
        var connectConfig: ParticleAuthConfig?
        if !configJson.isEmpty {
            let data = JSON(parseJSON: configJson)
            let loginType = LoginType(rawValue: data["login_type"].stringValue.lowercased()) ?? .email
            var supportAuthTypeArray: [SupportAuthType] = []
            
            let array = data["support_auth_type_values"].arrayValue.map {
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
            
            var account = data["account"].string
            
            if account != nil, account!.isEmpty {
                account = nil
            }
            
            let socialLoginPromptString = data["social_login_prompt"].stringValue.lowercased()
            let socialLoginPrompt: SocialLoginPrompt? = SocialLoginPrompt(rawValue: socialLoginPromptString)
            
            let message: String? = data["authorization"]["message"].string
            let isUnique: Bool = data["authorization"]["uniq"].bool ?? false

            var loginAuthorization: LoginAuthorization?
        
            if message != nil {
                loginAuthorization = .init(message: message!, isUnique: isUnique)
            }

            connectConfig = ParticleAuthConfig(loginType: loginType, supportAuthType: supportAuthTypeArray, phoneOrEmailAccount: account, socialLoginPrompt: socialLoginPrompt, authorization: loginAuthorization)
        }
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let vc = UIViewController.topMost else {
            return
        }
        
        var observable: Single<Account?>
        if walletType == .walletConnect {
            observable = (adapter as! WalletConnectAdapter).connectWithQrCode(from: vc)
        } else if walletType == .particle {
            observable = adapter.connect(connectConfig)
        } else {
            observable = adapter.connect(ConnectConfig.none)
        }
        
        subscribeAndCallback(observable: observable, callback: callback)
    }
    
    @objc
    public func disconnect(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        subscribeAndCallback(observable: adapter.disconnect(publicAddress: publicAddress), callback: callback)
    }
    
    @objc
    public func isConnected(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        callback([adapter.isConnected(publicAddress: publicAddress)])
    }
    
    @objc
    public func signAndSendTransaction(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        let transaction = data["transaction"].stringValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
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
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        let aaService = ParticleNetwork.getAAService()
        var sendObservable: Single<String>
        if aaService != nil, aaService!.isAAModeEnable() {
            latestPublicAddress = publicAddress
            latestWalletType = walletType
            sendObservable = aaService!.quickSendTransactions([transaction], feeMode: feeMode, messageSigner: self, wholeFeeQuote: wholeFeeQuote)
        } else {
            sendObservable = adapter.signAndSendTransaction(publicAddress: publicAddress, transaction: transaction, feeMode: feeMode)
        }
        
        subscribeAndCallback(observable: sendObservable, callback: callback)
    }

    @objc
    func batchSendTransactions(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let transactions = data["transactions"].arrayValue.map {
            $0.stringValue
        }
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
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
            let response = ReactResponseError(code: nil, message: "aa service is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        latestPublicAddress = publicAddress
        latestWalletType = walletType
        
        let sendObservable = aaService.quickSendTransactions(transactions, feeMode: feeMode, messageSigner: self, wholeFeeQuote: wholeFeeQuote)
        subscribeAndCallback(observable: sendObservable, callback: callback)
    }
    
    @objc
    public func signTransaction(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        let transaction = data["transaction"].stringValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        subscribeAndCallback(observable: adapter.signTransaction(publicAddress: publicAddress, transaction: transaction), callback: callback)
    }
    
    @objc
    public func signAllTransactions(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        let transactions = data["transactions"].arrayValue.map {
            $0.stringValue
        }
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        subscribeAndCallback(observable: adapter.signAllTransactions(publicAddress: publicAddress, transactions: transactions), callback: callback)
    }
    
    @objc
    public func signMessage(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        let message = data["message"].stringValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        subscribeAndCallback(observable: adapter.signMessage(publicAddress: publicAddress, message: message), callback: callback)
    }
    
    @objc
    public func signTypedData(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        let message = data["message"].stringValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        subscribeAndCallback(observable: adapter.signTypedData(publicAddress: publicAddress, data: message), callback: callback)
    }
    
    @objc
    public func importPrivateKey(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let privateKey = data["private_key"].stringValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard walletType == WalletType.evmPrivateKey || walletType == WalletType.solanaPrivateKey else {
            print("walletType \(walletTypeString) is not support import from private key")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not support import from private key", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            
            return
        }
        
        subscribeAndCallback(observable: (adapter as! LocalAdapter).importWalletFromPrivateKey(privateKey), callback: callback)
    }
    
    @objc
    public func importMnemonic(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let mnemonic = data["mnemonic"].stringValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard walletType == WalletType.evmPrivateKey || walletType == WalletType.solanaPrivateKey else {
            print("walletType \(walletTypeString) is not support import from private key")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not support import from private key", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            
            return
        }
        
        subscribeAndCallback(observable: (adapter as! LocalAdapter).importWalletFromMnemonic(mnemonic), callback: callback)
    }
    
    @objc
    public func exportPrivateKey(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard walletType == WalletType.evmPrivateKey || walletType == WalletType.solanaPrivateKey else {
            print("walletType \(walletTypeString) is not support import from private key")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not support import from private key", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            
            return
        }
        
        subscribeAndCallback(observable: (adapter as! LocalAdapter).exportWalletPrivateKey(publicAddress: publicAddress), callback: callback)
    }
    
    @objc
    public func login(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        let domain = data["domain"].stringValue
        let address = publicAddress
        guard let uri = URL(string: data["uri"].stringValue) else { return }
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        let siwe = try! SiweMessage(domain: domain, address: address, uri: uri)
        
        let observable = adapter.login(config: siwe, publicAddress: publicAddress).map { sourceMessage, signedMessage in
            ReactConnectLoginResult(message: sourceMessage, signature: signedMessage)
        }
        
        subscribeAndCallback(observable: observable, callback: callback)
    }
    
    @objc
    public func verify(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let message = data["message"].stringValue
        var signature = data["signature"].stringValue
        
        if ConnectManager.getChainType() == .solana {
            signature = Base58.encode(Data(base64Encoded: signature)!)
        }
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        let siwe = try! SiweMessage(message)
        
        subscribeAndCallback(observable: adapter.verify(message: siwe, against: signature), callback: callback)
    }
    
    @objc
    public func addEthereumChain(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        let chainId = data["chain_id"].intValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        subscribeAndCallback(observable: adapter.addEthereumChain(publicAddress: publicAddress, chainId: chainId, chainName: nil, nativeCurrency: nil, rpcUrl: nil, blockExplorerUrl: nil), callback: callback)
    }
    
    @objc
    public func switchEthereumChain(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        let chainId = data["chain_id"].intValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        subscribeAndCallback(observable: adapter.switchEthereumChain(publicAddress: publicAddress, chainId: chainId), callback: callback)
    }
    
    @objc public func reconnectIfNeeded(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        
        guard let walletType = map2WalletType(from: walletTypeString) else {
            print("walletType \(walletTypeString) is not existed ")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletTypeString) is not init")
            let response = ReactResponseError(code: nil, message: "adapter for \(walletTypeString) is not init", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
            return
        }
        
        (adapter as? WalletConnectAdapter)?.reconnectIfNeeded(publicAddress: publicAddress)
        let nullStr: String? = nil
        let statusModel = ReactStatusModel(status: true, data: nullStr)
        let nullData = try! JSONEncoder().encode(statusModel)
        guard let json = String(data: nullData, encoding: .utf8) else { return }
        callback([json])
    }
    
    @objc
    func setWalletConnectV2SupportChainInfos(_ json: String) {
        let chainInfos = JSON(parseJSON: json).arrayValue.map {
            $0["chain_id"].intValue
        }.compactMap {
            ParticleNetwork.searchChainInfo(by: $0)
        }
        ParticleConnect.setWalletConnectV2SupportChainInfos(chainInfos)
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

extension ParticleConnectPlugin {
    private func subscribeAndCallback<T: Codable>(observable: Single<T>, callback: @escaping RCTResponseSenderBlock) {
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

extension ParticleConnectPlugin: MessageSigner {
    public func signMessage(_ message: String) -> RxSwift.Single<String> {
        guard let walletType = latestWalletType else {
            print("walletType is nil")
            return .error(ParticleNetwork.ResponseError(code: nil, message: "walletType is nil"))
        }
        
        guard let adapter = map2ConnectAdapter(from: walletType) else {
            print("adapter for \(walletType) is not init")
            return .error(ParticleNetwork.ResponseError(code: nil, message: "adapter for \(walletType) is not init"))
        }
        return adapter.signMessage(publicAddress: getEoaAddress(), message: message)
    }
    
    public func getEoaAddress() -> String {
        return latestPublicAddress ?? ""
    }
}
