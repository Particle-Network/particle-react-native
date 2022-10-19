#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ParticleAuth, NSObject)

RCT_EXTERN_METHOD(initialize: (NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setChainInfo: (NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(setChainInfoAsync: (NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(getChainInfo: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(login: (NSString* _Nonnull)json callback: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(logout: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(isLogin: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signMessage: (NSString* _Nonnull)message callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signTransaction: (NSString* _Nonnull)transaction callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signAllTransactions: (NSString* _Nonnull)transactions callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signAndSendTransaction: (NSString* _Nonnull)message callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signTypedData: (NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(getAddress: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getUserInfo: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setModalPresentStyle: (NSString* _Nonnull)style)

RCT_EXTERN_METHOD(setInterfaceStyle:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setDisplayWallet:(BOOL)json)

RCT_EXTERN_METHOD(openWebWallet)

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}


@end
