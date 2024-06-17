#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "RNCSafeAreaContext.h"
#import "RNCSafeAreaProvider.h"
#import "RNCSafeAreaProviderManager.h"
#import "RNCSafeAreaShadowView.h"
#import "RNCSafeAreaUtils.h"
#import "RNCSafeAreaView.h"
#import "RNCSafeAreaViewEdgeMode.h"
#import "RNCSafeAreaViewEdges.h"
#import "RNCSafeAreaViewLocalData.h"
#import "RNCSafeAreaViewManager.h"
#import "RNCSafeAreaViewMode.h"

FOUNDATION_EXPORT double react_native_safe_area_contextVersionNumber;
FOUNDATION_EXPORT const unsigned char react_native_safe_area_contextVersionString[];

