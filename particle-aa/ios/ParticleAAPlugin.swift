//
//  ParticleAAPlugin.swift
//  ParticleAAPlugin
//
//  Created by link on 2023/5/19.
//
import Foundation

@objc(ParticleAAPlugin)
class ParticleAAPlugin: NSObject {
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    public func initialize(_ json: String) {
        ShareAA.shared.initialize(json)
    }
    
    @objc
    public func isAAModeEnable(_ callback: @escaping RCTResponseSenderBlock) {
        let value = ShareAA.shared.isAAModeEnable()
        callback([value])
    }
    
    @objc
    public func enableAAMode() {
        ShareAA.shared.enableAAMode()
    }
    
    @objc
    public func disableAAMode() {
        ShareAA.shared.disableAAMode()
    }
    
    @objc
    public func isDeploy(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAA.shared.isDeploy(json) { value in
            callback([value])
        }
    }
    
    @objc
    public func rpcGetFeeQuotes(_ json: String, callback: @escaping RCTResponseSenderBlock) {
        ShareAA.shared.rpcGetFeeQuotes(json) { value in
            callback([value])
        }
    }
}
