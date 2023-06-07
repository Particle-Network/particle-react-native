//
//  Model.swift
//  reactnativeparticle
//
//  Created by link on 2022/9/23.
//

import Foundation
import ParticleNetworkBase

public extension NSObject {
    func ResponseFromError(_ error: Error) -> ReactResponseError {
        if let responseError = error as? ParticleNetwork.ResponseError {
            return ReactResponseError(code: responseError.code, message: responseError.message ?? "", data: responseError.data)
        } else {
            return ReactResponseError(code: nil, message: String(describing: error), data: nil)
        }
    }
}

public struct ReactResponseError: Codable {
    let code: Int?
    let message: String?
    let data: String?
}

public struct ReactStatusModel<T: Codable>: Codable {
    let status: Bool
    let data: T
}

public struct ReactConnectLoginResult: Codable {
    let message: String
    let signature: String
}
