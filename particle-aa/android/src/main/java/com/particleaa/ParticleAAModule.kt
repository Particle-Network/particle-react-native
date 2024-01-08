package com.particleaa

import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.facebook.react.bridge.*
import com.particle.base.ParticleNetwork
import com.particle.base.data.ErrorInfo
import com.particle.base.isSupportedERC4337
import com.particle.erc4337.ParticleNetworkAA.initAAMode
import com.particleaa.model.BiconomyInitData
import com.particleaa.model.ChainData
import com.particleaa.model.FeeQuotesParams
import com.particleaa.model.ReactCallBack
import com.particleaa.utils.ChainUtils
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class ParticleAuthPlugin(val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  @ReactMethod
  fun init(initParams: String) {
    LogUtils.d("init", initParams)
    val initData = GsonUtils.fromJson(initParams, BiconomyInitData::class.java)
    ParticleNetwork.initAAMode(initData.dAppKeys)
    val providerName = initData.name
    val providerVersion = initData.version
    LogUtils.d("providerName", providerName)
    val aaService = ParticleNetwork.getRegisterAAServices().values.firstOrNull {
      it.getIAAProvider().apiName.equals(providerName, true) && it.getIAAProvider().version.equals(
        providerVersion,
        true
      )
    }
    aaService?.apply {
      ParticleNetwork.setAAService(aaService)
    }
  }

  @ReactMethod
  fun isSupportChainInfo(chainParams: String, callback: Callback) {
    LogUtils.d("setChainName", chainParams)
    val chainData: ChainData = GsonUtils.fromJson(chainParams, ChainData::class.java)
    try {
      val chainInfo = ChainUtils.getChainInfo(chainData.chainId)
      val isSupportedERC4337 = chainInfo.isSupportedERC4337()
      callback.invoke(isSupportedERC4337)
    } catch (e: Exception) {
      callback.invoke(false)
    }
  }

  @ReactMethod
  fun isDeploy(eoaAddress: String, callback: Callback) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val isDeploy = ParticleNetwork.getAAService().isDeploy(eoaAddress)
        callback.invoke(ReactCallBack.success(isDeploy).toGson())
      } catch (e: Exception) {
        callback.invoke(ReactCallBack.failed(ErrorInfo(e.message ?: "failed", 10000)).toGson())
      }
    }
  }

  @ReactMethod
  fun isAAModeEnable(callback: Callback) {
    try {
      val isAAModeEnable = ParticleNetwork.getAAService().isAAModeEnable()
      callback.invoke(isAAModeEnable)
    } catch (e: Exception) {
      callback.invoke(false)
    }
  }

  @ReactMethod
  fun enableAAMode() {
    ParticleNetwork.getAAService().enableAAMode()
  }

  @ReactMethod
  fun disableAAMode() {
    ParticleNetwork.getAAService().disableAAMode()
  }

  @ReactMethod
  fun rpcGetFeeQuotes(feeQuotesParams: String, callback: Callback) {
    LogUtils.d("rpcGetFeeQuotes", feeQuotesParams)
    val feeQuotesParams = GsonUtils.fromJson(feeQuotesParams, FeeQuotesParams::class.java)
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val resp =
          ParticleNetwork.getAAService()
            .rpcGetFeeQuotes(feeQuotesParams.eoaAddress, feeQuotesParams.transactions)
        LogUtils.d("rpcGetFeeQuotes", resp)
        if (resp.isSuccess()) {
          callback.invoke(ReactCallBack.success(resp.result).toGson())
        } else {
          callback.invoke(
            ReactCallBack.failed(
              ErrorInfo(resp.error?.message ?: "failed", resp.error?.code ?: 10000)
            )
              .toGson()
          )
        }
      } catch (e: Exception) {
        callback.invoke(ReactCallBack.failed(ErrorInfo(e.message ?: "failed", 10000)).toGson())
      }
    }
  }

  override fun getName(): String {
    return "ParticleAAPlugin"
  }
}
