package com.particleconnect.module;

import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import com.particle.base.Env
import com.particle.base.ParticleNetwork
import com.particle.base.model.ResultCallback
import com.particleconnect.utils.ChainUtils
import com.particle.network.ParticleNetworkAuth.switchChain
import com.particleconnect.model.ChainData;
import com.particleconnect.model.InitData;
import network.particle.chains.ChainInfo

class BridgeBase(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String {
    return "BridgeBase"
  }

  @ReactMethod
  fun initialize(initParams: String) {
    LogUtils.d("BridgeBase initialize", initParams)
    val initData = GsonUtils.fromJson(initParams, InitData::class.java)
    val chainInfo = ChainUtils.getChainInfo(initData.chainId)
    ParticleNetwork.init(
      reactApplicationContext,
      Env.valueOf(initData.env.uppercase()),
      chainInfo
    )
  }

  /**
   * {
   * "chain": "BscChain",
   * "chain_id": "Testnet",
   * "env": "PRODUCTION"
   * }
   */


  @ReactMethod
  fun getChainInfo(callback: Callback) {
    val chainInfo: ChainInfo = ParticleNetwork.chainInfo
    val map: MutableMap<String, Any> = HashMap()
    map["chain_name"] = chainInfo.name
    map["chain_id"] = chainInfo.id
    val result = Gson().toJson(map)
    LogUtils.d("BridgeBase getChainInfo", result)
    callback.invoke(result)
  }

  @ReactMethod
  fun setChainInfo(chainParams: String, callback: Callback) {
    LogUtils.d("setChainName", chainParams)
    val chainData: ChainData = GsonUtils.fromJson(
      chainParams,
      ChainData::class.java
    )
    val chainInfo = ChainUtils.getChainInfo(chainData.chainId)
    ParticleNetwork.switchChain(chainInfo, object : ResultCallback {
      override fun failure() {
        callback.invoke(false)
      }

      override fun success() {
        callback.invoke(true)
      }
    })
  }
}
