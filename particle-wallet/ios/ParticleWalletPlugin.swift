//
//  ParticleWalletPlugin.swift
//  ParticleWallettExample
//
//  Created by link on 2022/9/28.
//


import Foundation
import ParticleWalletGUI
import SwiftyJSON
import RxSwift

@objc(ParticleWalletPlugin)
public class ParticleWalletPlugin: NSObject {
    let bag = DisposeBag()
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    public func enablePay(_ enable: Bool) {
        ParticleWalletGUI.enablePay(enable)
    }
    
    @objc
    public func getEnablePay(_ callback: @escaping RCTResponseSenderBlock){
        callback([ParticleWalletGUI.getEnablePay()])
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
        let toAddress = data["receiver_address"].stringValue
        let tokenId = data["token_id"].stringValue
        let config = NFTSendConfig(address: address, toAddress: toAddress.isEmpty ? nil : toAddress, tokenId: tokenId)
        PNRouter.navigatroNFTSend(nftSendConfig: config)
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
            var network: OpenBuyNetwork?
            /*
             Solana,
             Ethereum,
             BinanceSmartChain,
             Avalanche,
             Polygon,
             */
            if networkString == "solana" {
                network = .solana
            } else if networkString == "ethereum" {
                network = .ethereum
            } else if networkString == "binancesmartchain" {
                network = .binanceSmartChain
            } else if networkString == "avalanche" {
                network = .avalanche
            } else if networkString == "polygon" {
                network = .polygon
            } else {
                network = nil
            }
            let fiatCoin = data["fiat_coin"].string
            let fiatAmt = data["fiat_amt"].int
            let cryptoCoin = data["crypto_coin"].string
            PNRouter.navigatorBuy(walletAddress: walletAddress, network: network, cryptoCoin: cryptoCoin, fiatCoin: fiatCoin, fiatAmt: fiatAmt)
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
    public func showTestNetwork(_ show: Bool) {
        ParticleWalletGUI.showTestNetwork(show)
    }
    
    @objc
    public func showManageWallet(_ show: Bool) {
        ParticleWalletGUI.showManageWallet(show)
    }
    
    @objc
    public func supportChain(_ json: String) {
        let chains = JSON(parseJSON: json).arrayValue.map {
            $0["chain_name"].stringValue.lowercased()
        }.compactMap {
            self.matchChain(name: $0)
        }
        ParticleWalletGUI.supportChain(chains)
    }
    
    @objc
    public func enableSwap(_ enable: Bool) {
        ParticleWalletGUI.enableSwap(enable)
    }
    
    @objc
    public func getEnableSwap(_ callback: @escaping RCTResponseSenderBlock) {
        callback([ParticleWalletGUI.getEnableSwap()])
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
        }.disposed(by: bag)
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
    
    @objc
    public func setLanguage(_ json: String) {
        /**
         SYSTEM,
         EN,
         ZH_HANS,
         */
        if json.lowercased() == "system" {
            ParticleWalletGUI.setLanguage(Language.unspecified)
        } else if json.lowercased() == "en" {
            ParticleWalletGUI.setLanguage(Language.en)
        } else if json.lowercased() == "zh_hans" {
            ParticleWalletGUI.setLanguage(Language.zh_Hans)
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
            ParticleWalletGUI.setInterfaceStyle(UIUserInterfaceStyle.unspecified)
        } else if json.lowercased() == "light" {
            ParticleWalletGUI.setInterfaceStyle(UIUserInterfaceStyle.light)
        } else if json.lowercased() == "dark" {
            ParticleWalletGUI.setInterfaceStyle(UIUserInterfaceStyle.dark)
        }
    }

     @objc
    public func supportWalletConnect(_ enable: Bool) {
        ParticleWalletGUI.supportWalletConnect(enable)
    }
}
