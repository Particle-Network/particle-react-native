#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ParticleBasePlugin, NSObject)

RCT_EXTERN_METHOD(initialize: (NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setChainInfo: (NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(getChainInfo: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(setInterfaceStyle:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setLanguage:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(getLanguage: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setAppearance:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setFiatCoin:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setSecurityAccountConfig:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(getSecurityAccount: (RCTResponseSenderBlock)callback)

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

@end

