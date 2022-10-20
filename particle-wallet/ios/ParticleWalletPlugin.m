#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ParticleWalletPlugin, NSObject)


RCT_EXTERN_METHOD(enablePay:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(getEnablePay:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(navigatorWallet:(int)json)

RCT_EXTERN_METHOD(navigatorTokenReceive:(NSString* _Nullable)json)

RCT_EXTERN_METHOD(navigatorTokenSend:(NSString* _Nullable)json)

RCT_EXTERN_METHOD(navigatorTokenTransactionRecords:(NSString* _Nullable)json)

RCT_EXTERN_METHOD(navigatorNFTSend:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(navigatorNFTDetails:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(navigatorPay)

RCT_EXTERN_METHOD(navigatorSwap:(NSString* _Nullable)json)

RCT_EXTERN_METHOD(showTestNetwork:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(showManageWallet:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(supportChain:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(enableSwap:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(getEnableSwap:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(navigatorLoginList:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(switchWallet:(NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(setLanguage:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setInterfaceStyle:(NSString* _Nonnull)json)

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

@end

