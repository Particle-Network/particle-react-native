//
//  SchemeManager.swift
//  reactnativeparticle
//
//  Created by link on 2022/9/22.
//

import Foundation
import ParticleConnect

public class SchemeManager: NSObject {
    @objc public static func handlerUrl(_ url: URL) -> Bool {
        return ParticleConnect.handleUrl(url)
    }
}
