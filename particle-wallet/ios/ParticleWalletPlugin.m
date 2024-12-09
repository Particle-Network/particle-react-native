#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ParticleWalletPlugin, NSObject)

RCT_EXTERN_METHOD(navigatorWallet:(int)json)

RCT_EXTERN_METHOD(navigatorTokenReceive:(NSString* _Nullable)json)

RCT_EXTERN_METHOD(navigatorTokenSend:(NSString* _Nullable)json)

RCT_EXTERN_METHOD(navigatorTokenTransactionRecords:(NSString* _Nullable)json)

RCT_EXTERN_METHOD(navigatorNFTSend:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(navigatorNFTDetails:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(navigatorBuyCrypto:(NSString* _Nullable)json)

RCT_EXTERN_METHOD(navigatorSwap:(NSString* _Nullable)json)

RCT_EXTERN_METHOD(navigatorDappBrowser:(NSString* _Nullable)json)

RCT_EXTERN_METHOD(setShowTestNetwork:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(setShowSmartAccountSetting:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(setShowManageWallet:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(setSupportChain:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setPayDisabled:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(getPayDisabled:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(setBridgeDisabled:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(getBridgeDisabled:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(setSwapDisabled:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(getSwapDisabled:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(switchWallet:(NSString* _Nonnull)json callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(setSupportWalletConnect:(BOOL _Nonnull)json)


RCT_EXTERN_METHOD(setDisplayTokenAddresses:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setDisplayNFTContractAddresses:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setPriorityTokenAddresses:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setPriorityNFTContractAddresses:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setShowLanguageSetting:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(setShowAppearanceSetting:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(setSupportAddToken:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(setSupportDappBrowser:(BOOL _Nonnull)json)

RCT_EXTERN_METHOD(setCustomWalletName:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setCustomLocalizable:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(initializeWalletMetaData:(NSString* _Nonnull)json)

RCT_EXTERN_METHOD(setWalletConnectProjectId:(NSString* _Nonnull)json)

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

@end

