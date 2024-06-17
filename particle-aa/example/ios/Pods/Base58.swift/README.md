# Base58Swift

A description of this package.

## Usage

```swift
Base58.encode([131, 96, 57, 87, 20])
Base58.encode("hello world".data(using: .utf8)!)
```

```swift
Base58.decode("9qqWYaVHgxtasTFvWgQoiDATARC6a3ZyZ8vohmg77CJC")
```

## Installation

### Swift Package Manager

Add the following to the dependencies section of your Package.swift file:

```
.package(url: "https://github.com/SunZhiC/Base58Swift", from: "1.0.0")
```

### CocoaPods

Add the following to your Podfile:

```
pod 'Base58.swift'
```
