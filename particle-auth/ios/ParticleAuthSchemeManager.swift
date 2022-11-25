//
//  SchemeManager.swift
//  reactnativeparticle
//
//  Created by link on 2022/9/22.
//

import Foundation
import ParticleAuthService

public class ParticleAuthSchemeManager: NSObject {
    @objc public static func handleUrl(_ url: URL) -> Bool {
        return ParticleAuthService.handleUrl(url)
    }
}
