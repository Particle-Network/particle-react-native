#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ParticleConnectEvent, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}


@end

@interface RCT_EXTERN_MODULE(ParticleConnectPlugin, NSObject)

RCT_EXTERN_METHOD(initialize:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(getAccounts: (NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(connect:(NSString* _Nonnull)json configJson:(NSString* _Nonnull)configJson callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(disconnect:(NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(isConnected:(NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signMessage:(NSString* _Nonnull)message callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signTransaction:(NSString* _Nonnull)transaction callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signAllTransactions:(NSString* _Nonnull)transactions callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signAndSendTransaction:(NSString* _Nonnull)message callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(batchSendTransactions: (NSString* _Nonnull)message callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signTypedData:(NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(login:(NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(verify:(NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(importPrivateKey:(NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(importMnemonic:(NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(exportPrivateKey:(NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(setWalletConnectV2SupportChainInfos:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(connectWalletConnect:(RCTResponseSenderBlock)callback)

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

@end
