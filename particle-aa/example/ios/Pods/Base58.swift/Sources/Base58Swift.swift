import BigInt
import Foundation

public enum Base58String {
    public static let alphabet = [UInt8]("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz".utf8)
}

public enum Base58 {
    /// Encode data to base58 string
    /// - Parameter data: Data
    /// - Returns: Base58 string
    public static func encode(_ data: Data) -> String {
        String(base58Encoding: data)
    }

    /// Encode bytes to base58 string
    /// - Parameter bytes: Bytes
    /// - Returns: Base58 string
    public static func encode(_ bytes: [UInt8]) -> String {
        encode(Data(bytes))
    }

    /// Decode base58 string to data
    /// - Parameter base58: Base58 string
    /// - Returns: Data
    public static func decode(_ base58: String) -> Data {
        Data(base58Decoding: base58) ?? Data()
    }
}

public extension Data {
    func bytes() -> [UInt8] {
        [UInt8](self)
    }
}

extension String {
    init(base58Encoding bytes: Data, alphabet: [UInt8] = Base58String.alphabet) {
        var x = BigUInt(bytes)
        let radix = BigUInt(alphabet.count)

        var answer = [UInt8]()
        answer.reserveCapacity(bytes.count)

        while x > 0 {
            let (quotient, modulus) = x.quotientAndRemainder(dividingBy: radix)
            answer.append(alphabet[Int(modulus)])
            x = quotient
        }

        let prefix = Array(bytes.prefix(while: { $0 == 0 })).map { _ in alphabet[0] }
        answer.append(contentsOf: prefix)
        answer.reverse()

        self = String(bytes: answer, encoding: String.Encoding.utf8)!
    }
}

extension Data {
    init?(base58Decoding string: String, alphabet: [UInt8] = Base58String.alphabet) {
        var answer = BigUInt(0)
        var j = BigUInt(1)
        let radix = BigUInt(alphabet.count)
        let byteString = [UInt8](string.utf8)

        for ch in byteString.reversed() {
            if let index = alphabet.firstIndex(of: ch) {
                answer = answer + (j * BigUInt(index))
                j *= radix
            } else {
                return nil
            }
        }

        let bytes = answer.serialize()
        let leadingOnes = byteString.prefix(while: { value in value == alphabet[0] })
        let leadingZeros: [UInt8] = Array(repeating: 0, count: leadingOnes.count)
        self = leadingZeros + bytes
    }
}
