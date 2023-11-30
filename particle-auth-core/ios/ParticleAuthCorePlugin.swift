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

typealias ParticleCallback = RCTResponseSenderBlock

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
        ConnectManager.setMoreAdapters([AuthCoreAdapter()])
    }

    @objc
    public func switchChain(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let data = JSON(parseJSON: json)

        let chainId = data["chain_id"].intValue
        let chainName = data["chain_name"].stringValue.lowercased()
        let chainType: ChainType = chainName == "solana" ? .solana : .evm
        
        guard let chainInfo = ParticleNetwork.searchChainInfo(by: chainId, chainType: chainType) else {
            callback([false])
            return
        }

        Task {
            do {
                let flag = try await auth.switchChain(chainInfo: chainInfo)
                callback([flag])
            } catch {
                callback([false])
            }
        }
    }

    @objc
    public func connect(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        let jwt = json

        let observable = Single<String>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.connect(jwt: jwt)
        }.map { userInfo in
            let userInfoJsonString = userInfo.jsonStringFullSnake()
            let newUserInfo = JSON(parseJSON: userInfoJsonString)
            return newUserInfo
        }

        subscribeAndCallback(observable: observable, callback: callback)
    }

    @objc
    public func disconnect(_ callback: @escaping RCTResponseSenderBlock) {
        subscribeAndCallback(observable: Single<String>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.disconnect()
        }, callback: callback)
    }

    @objc
    public func isConnected(_ callback: @escaping RCTResponseSenderBlock) {
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.isConnected()
        }, callback: callback)
    }

    @objc
    public func solanaSignMessage(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        let serializedMessage = Base58.encode(message.data(using: .utf8)!)

        let chainInfo = ParticleNetwork.getChainInfo()
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.solana.signMessage(serializedMessage, chainInfo: chainInfo)
        }, callback: callback)
    }

    @objc
    public func solanaSignTransaction(_ transaction: String, callback: @escaping RCTResponseSenderBlock) {
        let chainInfo = ParticleNetwork.getChainInfo()
        
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.solana.signTransaction(transaction, chainInfo: chainInfo)
        }, callback: callback)
    }

    @objc
    public func solanaSignAllTransactions(_ transactions: String, callback: @escaping RCTResponseSenderBlock) {
        let transactions = JSON(parseJSON: transactions).arrayValue.map { $0.stringValue }
        let chainInfo = ParticleNetwork.getChainInfo()
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.solana.signAllTransactions(transactions, chainInfo: chainInfo)
        }, callback: callback)
    }

    @objc
    public func solanaSignAndSendTransaction(_ transaction: String, callback: @escaping RCTResponseSenderBlock) {
        let chainInfo = ParticleNetwork.getChainInfo()
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.solana.signAndSendTransaction(transaction, chainInfo: chainInfo)
        }, callback: callback)
    }

    @objc
    public func evmPersonalSign(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        let chainInfo = ParticleNetwork.getChainInfo()
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.evm.personalSign(message, chainInfo: chainInfo)
        }, callback: callback)
    }

    @objc
    public func evmPersonalSignUnique(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        let chainInfo = ParticleNetwork.getChainInfo()
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.evm.personalSignUnique(message, chainInfo: chainInfo)
        }, callback: callback)
    }

    @objc
    public func evmSignTypedData(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        let chainInfo = ParticleNetwork.getChainInfo()
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.evm.signTypedData(message, chainInfo: chainInfo)
        }, callback: callback)
    }

    @objc
    public func evmSignTypedDataUnique(_ message: String, callback: @escaping RCTResponseSenderBlock) {
        let chainInfo = ParticleNetwork.getChainInfo()
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.evm.signTypedDataUnique(message, chainInfo: chainInfo)
        }, callback: callback)
    }

    @objc
    public func evmSendTransaction(_ transaction: String, callback: @escaping RCTResponseSenderBlock) {
        let chainInfo = ParticleNetwork.getChainInfo()
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.evm.sendTransaction(transaction, chainInfo: chainInfo)
        }, callback: callback)
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

        let userInfoJsonString = userInfo.jsonStringFullSnake()
        let newUserInfo = JSON(parseJSON: userInfoJsonString)

        let data = try! JSONEncoder().encode(newUserInfo)
        let json = String(data: data, encoding: .utf8)
        resolve(json ?? "")
    }

    @objc
    public func openAccountAndSecurity(_ callback: @escaping RCTResponseSenderBlock) {
        let observable = Single<Void>.fromAsync {
            [weak self] in
                guard let self = self else {
                    throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
                }
                try self.auth.openAccountAndSecurity()
        }.map {
            ""
        }

        subscribeAndCallback(observable: observable, callback: callback)
    }

    @objc
    public func hasPaymentPassword(_ callback: @escaping RCTResponseSenderBlock) {
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try self.auth.hasPaymentPassword()
        }, callback: callback)
    }

    @objc
    public func hasMasterPassword(_ callback: @escaping RCTResponseSenderBlock) {
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try self.auth.hasMasterPassword()
        }, callback: callback)
    }

    @objc
    public func changeMasterPassword(_ callback: @escaping RCTResponseSenderBlock) {
        subscribeAndCallback(observable: Single<Bool>.fromAsync { [weak self] in
            guard let self = self else {
                throw ParticleNetwork.ResponseError(code: nil, message: "self is nil")
            }
            return try await self.auth.changeMasterPassword()
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

extension ParticleAuthCorePlugin {
    private func subscribeAndCallback<T: Codable>(observable: Single<T>, callback: @escaping ParticleCallback) {
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

extension Single {
    static func fromAsync<T>(_ fn: @escaping () async throws -> T) -> Single<T> {
        .create { observer in
            let task = Task {
                do { try await observer(.success(fn())) }
                catch { observer(.failure(error)) }
            }
            return Disposables.create { task.cancel() }
        }.observe(on: MainScheduler.instance)
    }
}
