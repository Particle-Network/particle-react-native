//
//  ParticleAuthPlugin.swift
//  ParticleAuthExample
//
//  Created by link on 2022/9/28.
//

import AuthCoreAdapter
import Base58_swift
import ConnectCommon
import Foundation
import ParticleAuthCore
import ParticleNetworkBase
import RxSwift
import SwiftyJSON

typealias RCTResponseSenderBlock = RCTResponseSenderBlock

@objc(ParticleAuthCorePlugin)
class ParticleAuthCorePlugin: NSObject {
    let bag = DisposeBag()
    let auth = Auth()

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
    public func initialize(_ json: String) {
        ShareAuthCore.shared.initialize()
    }

    @objc
    func setBlindEnable(_ enable: Bool) {
        ShareAuthCore.shared.setBlindEnable(enable)
    }

    @objc
    func getBlindEnable(_ resolve: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
        let value = ShareAuthCore.shared.getBlindEnable()
        resolve([value])
    }

    @objc
    func sendPhoneCode(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.sendPhoneCode(json) { value in
            callback([value])
        }
    }

    @objc
    func sendEmailCode(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.sendEmailCode(json) { value in
            callback([value])
        }
    }

    @objc
    public func switchChain(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.switchChain(json) { value in
            callback([value])
        }
    }

    @objc
    func connect(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.connect(json) { value in
            callback([value])
        }
    }

    @objc
    func connectWithCode(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.connectWithCode(json) { value in
            callback([value])
        }
    }

    @objc
    public func disconnect(_ callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.disconnect { value in
            callback([value])
        }
    }

    @objc
    public func isConnected(_ callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.isConnected { value in
            callback([value])
        }
    }

    @objc
    public func solanaSignMessage(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.solanaSignMessage(json) { value in
            callback([value])
        }
    }

    @objc
    public func solanaSignTransaction(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.solanaSignTransaction(json) { value in
            callback([value])
        }
    }

    @objc
    public func solanaSignAllTransactions(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.solanaSignAllTransactions(json) { value in
            callback([value])
        }
    }

    @objc
    public func solanaSignAndSendTransaction(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.solanaSignAndSendTransaction(json) { value in
            callback([value])
        }
    }

    @objc
    public func evmPersonalSign(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let chainInfo = ParticleNetwork.getChainInfo()
        ShareAuthCore.shared.evmPersonalSign(json) { value in
            callback([value])
        }
    }

    @objc
    public func evmPersonalSignUnique(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.evmPersonalSignUnique(json) { value in
            callback([value])
        }
    }

    @objc
    public func evmSignTypedData(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.evmSignTypedData(json) { value in
            callback([value])
        }
    }

    @objc
    public func evmSignTypedDataUnique(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.evmSignTypedDataUnique(json) { value in
            callback([value])
        }
    }

    @objc
    public func evmSendTransaction(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.evmSendTransaction(json) { value in
            callback([value])
        }
    }

    @objc
    func evmBatchSendTransactions(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.evmBatchSendTransactions(json) { value in
            callback([value])
        }
    }

    @objc
    public func solanaGetAddress(_ resolve: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
        let address = auth.solana.getAddress()
        resolve(address)
    }

    @objc
    public func evmGetAddress(_ resolve: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
        let address = auth.evm.getAddress()
        resolve(address)
    }

    @objc
    public func getUserInfo(_ resolve: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
        guard let userInfo = auth.getUserInfo() else {
            rejecter("", "user is not login", nil)
            return
        }

        let json = userInfo.jsonStringFullSnake()
        resolve(json)
    }

    @objc
    public func openAccountAndSecurity(_ callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.openAccountAndSecurity { value in
            callback([value])
        }
    }

    @objc
    public func hasPaymentPassword(_ callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.hasPaymentPassword { value in
            callback([value])
        }
    }

    @objc
    public func hasMasterPassword(_ callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.hasMasterPassword { value in
            callback([value])
        }
    }

    @objc
    public func changeMasterPassword(_ callback: @escaping RCTResponseSenderBlock) {
        ShareAuthCore.shared.changeMasterPassword { value in
            callback([value])
        }
    }
}
