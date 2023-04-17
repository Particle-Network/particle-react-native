#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ParticleAuthEvent, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}


@end

@interface RCT_EXTERN_MODULE(ParticleAuthPlugin, NSObject)

RCT_EXTERN_METHOD(initialize: (NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setChainInfo: (NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(setChainInfoAsync: (NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(getChainInfo: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(login: (NSString* _Nonnull)json callback: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(logout: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(fastLogout: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(isLogin: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(isLoginAsync: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signMessage: (NSString* _Nonnull)message callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signTransaction: (NSString* _Nonnull)transaction callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signAllTransactions: (NSString* _Nonnull)transactions callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signAndSendTransaction: (NSString* _Nonnull)message callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(signTypedData: (NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(openAccountAndSecurity)

RCT_EXTERN_METHOD(getAddress: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getUserInfo: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setModalPresentStyle: (NSString* _Nonnull)style)

RCT_EXTERN_METHOD(setInterfaceStyle:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setLanguage:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setDisplayWallet:(BOOL)json)

RCT_EXTERN_METHOD(setMediumScreen:(BOOL)json)

RCT_EXTERN_METHOD(openWebWallet)

RCT_EXTERN_METHOD(setUserInfo:(NSString* _Nonnull)json callback: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(setSecurityAccountConfig:(NSString* _Nonnull)json)

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

@end

