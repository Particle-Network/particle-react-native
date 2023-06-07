#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ParticleBiconomyPlugin, NSObject)

RCT_EXTERN_METHOD(initialize: (NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setChainInfo: (NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)


+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
