//
//  ParticleWalletPlugin.swift
//  ParticleWallettExample
//
//  Created by link on 2022/9/28.
//

import Foundation

@objc(ParticleWalletPlugin)
public class ParticleWalletPlugin: NSObject {
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    public func setPayDisabled(_ disabled: Bool) {
        ShareWallet.shared.setPayDisabled(disabled)
    }
    
    @objc
    public func getPayDisabled(_ callback: @escaping RCTResponseSenderBlock) {
        let value = ShareWallet.shared.getPayDisabled()
        callback([value])
    }
    
    @objc
    public func setBridgeDisabled(_ disabled: Bool) {
        ShareWallet.shared.setBridgeDisabled(disabled)
    }
    
    @objc
    public func getBridgeDisabled(_ callback: @escaping RCTResponseSenderBlock) {
        let value = ShareWallet.shared.getBridgeDisabled()
        callback([value])
    }
    
    @objc
    public func navigatorWallet(_ display: Int) {
        ShareWallet.shared.navigatorWallet(display)
    }
    
    @objc
    public func navigatorTokenReceive(_ json: String?) {
        ShareWallet.shared.navigatorTokenReceive(json ?? "")
    }
    
    @objc
    public func navigatorTokenSend(_ json: String?) {
        ShareWallet.shared.navigatorTokenSend(json ?? "")
    }
    
    @objc
    public func navigatorTokenTransactionRecords(_ json: String?) {
        ShareWallet.shared.navigatorTokenTransactionRecords(json ?? "")
    }
    
    @objc
    public func navigatorNFTSend(_ json: String) {
        ShareWallet.shared.navigatorNFTSend(json)
    }
    
    @objc
    public func navigatorNFTDetails(_ json: String) {
        ShareWallet.shared.navigatorNFTDetails(json)
    }
    
    @objc
    public func navigatorBuyCrypto(_ json: String?) {
        ShareWallet.shared.navigatorBuyCrypto(json ?? "")
    }
    
    @objc
    public func navigatorSwap(_ json: String?) {
        ShareWallet.shared.navigatorSwap(json ?? "")
    }
    
    @objc
    public func navigatorDappBrowser(_ json: String?) {
        ShareWallet.shared.navigatorDappBrowser(json ?? "")
    }
    
    @objc
    public func setShowTestNetwork(_ show: Bool) {
        ShareWallet.shared.setShowTestNetwork(show)
    }
    
    @objc
    public func setShowSmartAccountSetting(_ show: Bool) {
        ShareWallet.shared.setShowSmartAccountSetting(show)
    }
    
    @objc
    public func setShowManageWallet(_ show: Bool) {
        ShareWallet.shared.setShowManageWallet(show)
    }
    
    @objc
    public func setSupportChain(_ json: String) {
        ShareWallet.shared.setSupportChain(json)
    }
    
    @objc
    public func setSwapDisabled(_ disabled: Bool) {
        ShareWallet.shared.setSwapDisabled(disabled)
    }
    
    @objc
    public func getSwapDisabled(_ callback: @escaping RCTResponseSenderBlock) {
        let value = ShareWallet.shared.getSwapDisabled()
        callback([value])
    }
    
    @objc
    public func switchWallet(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let value = ShareWallet.shared.switchWallet(json)
        callback([value])
    }
    
    @objc
    public func setSupportWalletConnect(_ enable: Bool) {
        ShareWallet.shared.setSupportWalletConnect(enable)
    }
    
    @objc
    public func setSupportDappBrowser(_ isShow: Bool) {
        ShareWallet.shared.setSupportDappBrowser(isShow)
    }
    
    @objc
    public func setDisplayTokenAddresses(_ json: String) {
        ShareWallet.shared.setDisplayTokenAddresses(json)
    }
    
    @objc
    public func setDisplayNFTContractAddresses(_ json: String) {
        ShareWallet.shared.setDisplayNFTContractAddresses(json)
    }

    @objc
    public func setPriorityTokenAddresses(_ json: String) {
        ShareWallet.shared.setPriorityTokenAddresses(json)
    }
    
    @objc
    public func setPriorityNFTContractAddresses(_ json: String) {
        ShareWallet.shared.setPriorityTokenAddresses(json)
    }
    
    @objc
    public func setShowLanguageSetting(_ isShow: Bool) {
        ShareWallet.shared.setShowLanguageSetting(isShow)
    }
    
    @objc
    public func setShowAppearanceSetting(_ isShow: Bool) {
        ShareWallet.shared.setShowAppearanceSetting(isShow)
    }
    
    @objc
    public func setSupportAddToken(_ isShow: Bool) {
        ShareWallet.shared.setSupportAddToken(isShow)
    }
    
    @objc
    func initializeWalletMetaData(_ json: String) {
        ShareWallet.shared.initializeWalletMetaData(json)
    }

    @objc
    func setCustomWalletName(_ json: String) {
        ShareWallet.shared.setCustomLocalizable(json)
    }

    @objc
    func setCustomLocalizable(_ json: String) {
        ShareWallet.shared.setCustomLocalizable(json)
    }
    
    @objc func setWalletConnectProjectId(_ json: String) {
        ShareWallet.shared.setWalletConnectProjectId(json)
    }
}
