//
//  ParticleConnect.swift
//  ParticleConnectExample
//
//  Created by link on 2022/9/28.
//

import Foundation

@objc(ParticleConnectPlugin)
class ParticleConnectPlugin: NSObject {
    @objc
    public static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    public func initialize(_ json: String) {
        ShareConnect.shared.initialize(json)
    }
    
    @objc
    public func getAccounts(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let value = ShareConnect.shared.getAccounts(json)
        callback([value])
    }
    
    @objc
    public func connect(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.connect(json) { value in
            callback([value])
        }
    }

    @objc
    public func connectWithConnectKitConfig(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.connectWithConnectKitConfig(json) { value in
            callback([value])
        }
    }

    @objc
    public func disconnect(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.disconnect(json) { value in
            callback([value])
        }
    }
    
    @objc
    public func isConnected(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let value = ShareConnect.shared.isConnected(json)
        callback([value])
    }
    
    @objc
    public func signAndSendTransaction(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.signAndSendTransaction(json) { value in
            callback([value])
        }
    }

    @objc
    func batchSendTransactions(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.batchSendTransactions(json) { value in
            callback([value])
        }
    }
    
    @objc
    public func signTransaction(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.signTransaction(json) { value in
            callback([value])
        }
    }
    
    @objc
    public func signAllTransactions(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.signAllTransactions(json) { value in
            callback([value])
        }
    }
    
    @objc
    public func signMessage(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.signMessage(json) { value in
            callback([value])
        }
    }
    
    @objc
    public func signTypedData(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.signTypedData(json) { value in
            callback([value])
        }
    }
    
    @objc
    public func importPrivateKey(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.importPrivateKey(json) { value in
            callback([value])
        }
    }
    
    @objc
    public func importMnemonic(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.importMnemonic(json) { value in
            callback([value])
        }
    }
    
    @objc
    public func exportPrivateKey(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.exportPrivateKey(json) { value in
            callback([value])
        }
    }
    
    @objc
    public func signInWithEthereum(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.signInWithEthereum(json) { value in
            callback([value])
        }
    }
    
    @objc
    public func verify(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.verify(json) { value in
            callback([value])
        }
    }
    
    @objc
    func setWalletConnectV2SupportChainInfos(_ json: String) {
        ShareConnect.shared.setWalletConnectV2SupportChainInfos(json)
    }
    
    @objc
    func connectWalletConnect(_ callback: @escaping RCTResponseSenderBlock) {
        ShareConnect.shared.connectWalletConnect { value in
            callback([value])
        } eventCallback: { uri in
            ParticleConnectEvent.emitter.sendEvent(withName: "qrCodeUri", body: uri)
        }
    }
    
    @objc func setWalletConnectProjectId(_ json: String) {
        ShareConnect.shared.setWalletConnectProjectId(json)
    }
}

@objc(ParticleConnectEvent)
class ParticleConnectEvent: RCTEventEmitter {
    public static var emitter: RCTEventEmitter!

    var hasListeners: Bool = false
    
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override init() {
        super.init()
        ParticleConnectEvent.emitter = self
    }

    override open func supportedEvents() -> [String] {
        ["qrCodeUri"]
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
