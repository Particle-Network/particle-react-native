//
//  ParticleBasePlugin.swift
//  ParticleBasePlugin
//
//  Created by link on 2022/9/28.
//

import Base58_swift
import Foundation
import ParticleNetworkBase
import RxSwift
import SwiftyJSON

typealias ParticleCallBack = RCTResponseSenderBlock

@objc(ParticleBasePlugin)
class ParticleBasePlugin: NSObject {
    let bag = DisposeBag()
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    public func initialize(_ json: String) {
        ShareBase.shared.initialize(json)
    }
    
    @objc
    public func setChainInfo(_ json: String, callback: @escaping ParticleCallBack) {
        let value = ShareBase.shared.setChainInfo(json)
        callback([value])
    }

    @objc
    public func getChainInfo(_ callback: @escaping ParticleCallBack) {
        let value = ShareBase.shared.getChainInfo
        callback([value])
    }
    
    @objc
    public func setAppearance(_ json: String) {
        ShareBase.shared.setAppearance(json)
    }
    
    @objc
    public func setFiatCoin(_ json: String) {
        ShareBase.shared.setFiatCoin(json)
    }

    @objc
    public func setLanguage(_ json: String) {
        ShareBase.shared.setLanguage(json)
    }
    
    @objc
    public func getLanguage(_ resolve: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        let value = ShareBase.shared.getLanguage
        resolve(value)
    }
    
    @objc
    public func setSecurityAccountConfig(_ json: String) {
        ShareBase.shared.setSecurityAccountConfig(json)
    }
}
