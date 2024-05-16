//
//  ParticleWalletPlugin.swift
//  ParticleWallettExample
//
//  Created by link on 2022/9/28.
//

import ConnectCommon
import Foundation
import ParticleNetworkBase
import ParticleWalletConnect
import ParticleWalletGUI
import RxSwift
import SwiftyJSON

@objc(ParticleWalletPlugin)
public class ParticleWalletPlugin: NSObject {
    let bag = DisposeBag()
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    public func setPayDisabled(_ disabled: Bool) {
        ParticleWalletGUI.setPayDisabled(disabled)
    }
    
    @objc
    public func getPayDisabled(_ callback: @escaping RCTResponseSenderBlock) {
        callback([ParticleWalletGUI.getPayDisabled()])
    }
    
    @objc
    public func navigatorWallet(_ display: Int) {
        if display != 0 {
            PNRouter.navigatorWallet(display: .nft)
        } else {
            PNRouter.navigatorWallet(display: .token)
        }
    }
    
    @objc
    public func navigatorTokenReceive(_ json: String?) {
        PNRouter.navigatorTokenReceive(tokenReceiveConfig: TokenReceiveConfig(tokenAddress: json))
    }
    
    @objc
    public func navigatorTokenSend(_ json: String?) {
        if let json = json {
            let data = JSON(parseJSON: json)
            let tokenAddress = data["token_address"].string
            let toAddress = data["to_address"].string
            let amount = data["amount"].string
            let config = TokenSendConfig(tokenAddress: tokenAddress, toAddress: toAddress, amountString: amount)
            
            PNRouter.navigatorTokenSend(tokenSendConfig: config)
        } else {
            PNRouter.navigatorTokenSend()
        }
    }
    
    @objc
    public func navigatorTokenTransactionRecords(_ json: String?) {
        if let json = json {
            let config = TokenTransactionRecordsConfig(tokenAddress: json)
            PNRouter.navigatorTokenTransactionRecords(tokenTransactionRecordsConfig: config)
        } else {
            PNRouter.navigatorTokenTransactionRecords()
        }
    }
    
    @objc
    public func navigatorNFTSend(_ json: String) {
        let data = JSON(parseJSON: json)
        let address = data["mint"].stringValue
        let tokenId = data["token_id"].stringValue
        let toAddress = data["receiver_address"].string
        let amount = data["amount"].int
        let config = NFTSendConfig(address: address, toAddress: toAddress, tokenId: tokenId, amount: BInt(amount ?? 1))
        PNRouter.navigatorNFTSend(nftSendConfig: config)
    }
    
    @objc
    public func navigatorNFTDetails(_ json: String) {
        let data = JSON(parseJSON: json)
        let address = data["mint"].stringValue
        let tokenId = data["token_id"].stringValue
        let config = NFTDetailsConfig(address: address, tokenId: tokenId)
        PNRouter.navigatorNFTDetails(nftDetailsConfig: config)
    }
    
    @objc
    public func navigatorBuyCrypto(_ json: String?) {
        if json == nil {
            PNRouter.navigatorBuy()
        } else {
            let data = JSON(parseJSON: json!)
            let walletAddress = data["wallet_address"].string
            let networkString = data["network"].stringValue.lowercased()
            let chainInfo = ParticleNetwork.getChainInfo()
            
            let fiatCoin = data["fiat_coin"].string
            let fiatAmt = data["fiat_amt"].int
            let cryptoCoin = data["crypto_coin"].string
            let fixCryptoCoin = data["fix_crypto_coin"].boolValue
            let fixFiatAmt = data["fix_fiat_amt"].boolValue
            let fixFiatCoin = data["fix_fiat_coin"].boolValue
            let theme = data["theme"].stringValue.lowercased()
            let language = self.getLanguage(from: data["language"].stringValue.lowercased())

            var buyConfig = BuyCryptoConfig()
            buyConfig.network = chainInfo
            buyConfig.walletAddress = walletAddress
            buyConfig.cryptoCoin = cryptoCoin ?? chainInfo.nativeToken.symbol
            buyConfig.fiatAmt = fiatAmt
            if fiatCoin != nil {
                buyConfig.fiatCoin = fiatCoin!
            }
            buyConfig.fixCryptoCoin = fixCryptoCoin
            buyConfig.fixFiatCoin = fixFiatCoin
            buyConfig.fixFiatAmt = fixFiatAmt
            buyConfig.theme = theme
            buyConfig.language = language?.webString  ?? Language.en.webString

            PNRouter.navigatorBuy(buyCryptoConfig: buyConfig)
        }
    }
    
    @objc
    public func navigatorSwap(_ json: String?) {
        if let json = json {
            let data = JSON(parseJSON: json)
            let fromTokenAddress = data["from_token_address"].string
            let toTokenAddress = data["to_token_address"].string
            let amount = data["amount"].string
            let config = SwapConfig(fromTokenAddress: fromTokenAddress, toTokenAddress: toTokenAddress, fromTokenAmountString: amount)
            
            PNRouter.navigatorSwap(swapConfig: config)
        } else {
            PNRouter.navigatorSwap()
        }
    }
    
    @objc
    public func navigatorDappBrowser(_ json: String?) {
        if let json = json {
            let data = JSON(parseJSON: json)
            let urlStr = data["url"].stringValue
            if let url = URL(string: urlStr) {
                PNRouter.navigatorDappBrowser(url: url)
            } else {
                PNRouter.navigatorDappBrowser(url: nil)
            }
        } else {
            PNRouter.navigatorDappBrowser(url: nil)
        }
    }
    
    @objc
    public func setShowTestNetwork(_ show: Bool) {
        ParticleWalletGUI.setShowTestNetwork(show)
    }
    
    @objc
    public func setShowSmartAccountSetting(_ show: Bool) {
        ParticleWalletGUI.setShowSmartAccountSetting(show)
    }
    
    @objc
    public func setShowManageWallet(_ show: Bool) {
        ParticleWalletGUI.setShowManageWallet(show)
    }
    
    @objc
    public func setSupportChain(_ json: String) {
        let chains = JSON(parseJSON: json).arrayValue.compactMap {
            let chainId = $0["chain_id"].intValue
            let chainName = $0["chain_name"].stringValue.lowercased()
            let chainType: ChainType = chainName == "solana" ? .solana : .evm
            return ParticleNetwork.searchChainInfo(by: chainId, chainType: chainType)
        }
        ParticleWalletGUI.setSupportChain(chains)
    }
    
    @objc
    public func setSwapDisabled(_ disabled: Bool) {
        ParticleWalletGUI.setSwapDisabled(disabled)
    }
    
    @objc
    public func getSwapDisabled(_ callback: @escaping RCTResponseSenderBlock) {
        callback([ParticleWalletGUI.getSwapDisabled()])
    }
    
    @objc
    public func navigatorLoginList(_ callback: @escaping RCTResponseSenderBlock) {
        PNRouter.navigatorLoginList().subscribe { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .failure(let error):
                let response = self.ResponseFromError(error)
                let statusModel = ReactStatusModel(status: false, data: response)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            case .success(let (walletType, account)):
                guard let account = account else { return }
                
                let loginListModel = ReactLoginListModel(walletType: walletType.stringValue, account: account)
                let statusModel = ReactStatusModel(status: true, data: loginListModel)
                let data = try! JSONEncoder().encode(statusModel)
                guard let json = String(data: data, encoding: .utf8) else { return }
                callback([json])
            }
        }.disposed(by: self.bag)
    }
    
    @objc
    public func switchWallet(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)
        let walletTypeString = data["wallet_type"].stringValue
        let publicAddress = data["public_address"].stringValue
        
        if let walletType = map2WalletType(from: walletTypeString) {
            let result = ParticleWalletGUI.switchWallet(walletType: walletType, publicAddress: publicAddress)
            
            let statusModel = ReactStatusModel(status: true, data: result == true ? "success" : "failed")
            
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
        } else {
            print("walletType \(walletTypeString) is not existed")
            let response = ReactResponseError(code: nil, message: "walletType \(walletTypeString) is not existed", data: nil)
            let statusModel = ReactStatusModel(status: false, data: response)
            let data = try! JSONEncoder().encode(statusModel)
            guard let json = String(data: data, encoding: .utf8) else { return }
            callback([json])
        }
    }
    
    private func getLanguage(from json: String) -> Language? {
        /*
         en,
         zh_hans,
         zh_hant,
         ja,
         ko
         */
        var language: Language?
        if json.lowercased() == "en" {
            language = .en
        } else if json.lowercased() == "zh_hans" {
            language = .zh_Hans
        } else if json.lowercased() == "zh_hant" {
            language = .zh_Hant
        } else if json.lowercased() == "ja" {
            language = .ja
        } else if json.lowercased() == "ko" {
            language = .ko
        }
        return language
    }
    
    @objc
    public func setSupportWalletConnect(_ enable: Bool) {
        ParticleWalletGUI.setSupportWalletConnect(enable)
    }
    
    @objc
    public func setSupportDappBrowser(_ isShow: Bool) {
        ParticleWalletGUI.setSupportDappBrowser(isShow)
    }
    
    @objc
    public func setDisplayTokenAddresses(_ json: String) {
        let data = JSON(parseJSON: json)
        let tokenAddresses = data.arrayValue.map {
            $0.stringValue
        }
        ParticleWalletGUI.setDisplayTokenAddresses(tokenAddresses)
    }
    
    @objc
    public func setDisplayNFTContractAddresses(_ json: String) {
        let data = JSON(parseJSON: json)
        let nftContractAddresses = data.arrayValue.map {
            $0.stringValue
        }
        ParticleWalletGUI.setDisplayNFTContractAddresses(nftContractAddresses)
    }

    @objc
    public func setPriorityTokenAddresses(_ json: String) {
        let data = JSON(parseJSON: json)
        let tokenAddresses = data.arrayValue.map {
            $0.stringValue
        }
        ParticleWalletGUI.setPriorityTokenAddresses(tokenAddresses)
    }
    
    @objc
    public func setPriorityNFTContractAddresses(_ json: String) {
        let data = JSON(parseJSON: json)
        let nftContractAddresses = data.arrayValue.map {
            $0.stringValue
        }
        ParticleWalletGUI.setPriorityNFTContractAddresses(nftContractAddresses)
    }
    
    @objc
    public func setShowLanguageSetting(_ isShow: Bool) {
        ParticleWalletGUI.setShowLanguageSetting(isShow)
    }
    
    @objc
    public func setShowAppearanceSetting(_ isShow: Bool) {
        ParticleWalletGUI.setShowAppearanceSetting(isShow)
    }
    
    @objc
    public func setSupportAddToken(_ isShow: Bool) {
        ParticleWalletGUI.setSupportAddToken(isShow)
    }
    
    @objc
    func initializeWalletMetaData(_ json: String) {
        let data = JSON(parseJSON: json)

        let walletName = data["name"].stringValue
        let walletIconString = data["icon"].stringValue
        let walletUrlString = data["url"].stringValue
        let walletDescription = data["description"].stringValue
        
        let walletConnectV2ProjectId = data["walletConnectProjectId"].stringValue

        let walletIconUrl = URL(string: walletIconString) != nil ? URL(string: walletIconString)! : URL(string: "https://connect.particle.network/icons/512.png")!

        let walletUrl = URL(string: walletUrlString) != nil ? URL(string: walletUrlString)! : URL(string: "https://connect.particle.network")!

        ParticleWalletConnect.initialize(.init(name: walletName, icon: walletIconUrl, url: walletUrl, description: walletDescription, redirectUniversalLink: nil))
        ParticleWalletConnect.setWalletConnectV2ProjectId(walletConnectV2ProjectId)
    }

    @objc
    func setCustomWalletName(_ json: String) {
        let data = JSON(parseJSON: json)

        let name = data["name"].stringValue
        let icon = data["icon"].stringValue

        ConnectManager.setCustomWalletName(walletType: .particle, name: .init(name: name, icon: icon))
        ConnectManager.setCustomWalletName(walletType: .authCore, name: .init(name: name, icon: icon))
    }

    @objc
    func setCustomLocalizable(_ json: String) {
        let data = JSON(parseJSON: json).dictionaryValue

        var localizables: [Language: [String: String]] = [:]

        for (key, value) in data {
            let language = self.getLanguage(from: key.lowercased())
            if language == nil {
                continue
            }
            let itemLocalizables = value.dictionaryValue.mapValues { json in
                json.stringValue
            }
            localizables[language!] = itemLocalizables
        }

        ParticleWalletGUI.setCustomLocalizable(localizables)
    }
}
