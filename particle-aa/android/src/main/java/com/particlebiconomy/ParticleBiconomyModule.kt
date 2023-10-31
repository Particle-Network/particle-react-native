package com.particlebiconomy

import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.facebook.react.bridge.*
import com.particle.base.ParticleNetwork
import com.particle.base.data.ErrorInfo
import com.particle.base.isSupportedERC4337
import com.particle.base.model.BiconomyVersion
import com.particle.erc4337.ParticleNetworkBiconomy.initBiconomyMode
import com.particle.erc4337.biconomy.BiconomyService
import com.particlebiconomy.model.BiconomyInitData
import com.particlebiconomy.model.ChainData
import com.particlebiconomy.model.FeeQuotesParams
import com.particlebiconomy.model.ReactCallBack
import com.particlebiconomy.utils.ChainUtils
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch


class ParticleAuthPlugin(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  @ReactMethod
  fun init(initParams: String) {
    LogUtils.d("init", initParams)
    val initData = GsonUtils.fromJson(initParams, BiconomyInitData::class.java)
    ParticleNetwork.initBiconomyMode(initData.dAppKeys, BiconomyVersion.V100)
    ParticleNetwork.setBiconomyService(BiconomyService)
  }


  @ReactMethod
  fun isSupportChainInfo(chainParams: String, callback: Callback) {
    LogUtils.d("setChainName", chainParams)
    val chainData: ChainData = GsonUtils.fromJson(
      chainParams, ChainData::class.java
    )
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
        val isDeploy = ParticleNetwork.getBiconomyService().isDeploy(eoaAddress)
        callback.invoke(ReactCallBack.success(isDeploy).toGson())
      } catch (e: Exception) {
        callback.invoke(ReactCallBack.failed(ErrorInfo(e.message ?: "failed", 10000)).toGson())
      }
    }
  }

  @ReactMethod
  fun isBiconomyModeEnable(callback: Callback) {
    try {
      val isBiconomyModeEnable = ParticleNetwork.getBiconomyService().isBiconomyModeEnable()
      callback.invoke(isBiconomyModeEnable)
    } catch (e: Exception) {
      callback.invoke(false)
    }
  }

  @ReactMethod
  fun enableBiconomyMode() {
    ParticleNetwork.getBiconomyService().enableBiconomyMode()
  }

  @ReactMethod
  fun disableBiconomyMode() {
    ParticleNetwork.getBiconomyService().disableBiconomyMode()
  }


  @ReactMethod
  fun rpcGetFeeQuotes(feeQuotesParams: String, callback: Callback) {
    LogUtils.d("rpcGetFeeQuotes", feeQuotesParams)
    val feeQuotesParams = GsonUtils.fromJson(feeQuotesParams, FeeQuotesParams::class.java)
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val resp = ParticleNetwork.getBiconomyService().rpcGetFeeQuotes(feeQuotesParams.eoaAddress, feeQuotesParams.transactions)
        LogUtils.d("rpcGetFeeQuotes", resp)
        if (resp.isSuccess()) {
          callback.invoke(ReactCallBack.success(resp.result).toGson())
        } else {
          callback.invoke(ReactCallBack.failed(ErrorInfo(resp.error?.message ?: "failed", resp.error?.code ?: 10000)).toGson())
        }
      } catch (e: Exception) {
        callback.invoke(ReactCallBack.failed(ErrorInfo(e.message ?: "failed", 10000)).toGson())
      }
    }
  }

  override fun getName(): String {
    return "ParticleBiconomyPlugin"
  }
}
