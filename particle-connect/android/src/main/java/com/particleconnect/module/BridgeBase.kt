package com.particleconnect.module;


import android.text.TextUtils
import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import com.particle.base.ChainInfo
import com.particle.base.Env
import com.particle.base.ParticleNetwork
import com.particleconnect.utils.ChainUtils
import com.particle.network.ParticleNetworkAuth.getUserInfo
import com.particle.network.ParticleNetworkAuth.isLogin
import com.particle.network.service.model.UserInfo
import com.particleconnect.model.ChainData;
import com.particleconnect.model.InitData;

class BridgeBase(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "BridgeBase"
    }

    @ReactMethod
    fun initialize(initParams: String) {
        LogUtils.d("BridgeBase initialize", initParams)
        val initData = GsonUtils.fromJson(initParams, InitData::class.java)
        val chainInfo = ChainUtils.getChainInfo(initData.chainName, initData.chainIdName)
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
    fun setChainInfo(chainParams: String) {
        setChainInfo(
            chainParams
        ) { }
    }

    @ReactMethod
    fun getChainInfo(callback: Callback) {
        val chainInfo: ChainInfo = ParticleNetwork.chainInfo
        val map: MutableMap<String, Any> = HashMap()
        map["chain_name"] = chainInfo.chainName.name
        map["chain_id_name"] = chainInfo.chainId.toString()
        map["chain_id"] = chainInfo.chainId.value()
        val result = Gson().toJson(map)
        LogUtils.d("BridgeBase getChainInfo", result)
        callback.invoke(result)
    }

    private fun setChainInfo(chainParams: String, callback: Callback) {
        LogUtils.d("setChainName", chainParams)
        val chainData: ChainData = GsonUtils.fromJson(
            chainParams,
            ChainData::class.java
        )
        try {
            val chainInfo = ChainUtils.getChainInfo(chainData.chainName, chainData.chainIdName)
            if (!ParticleNetwork.isLogin()) {
                ParticleNetwork.setChainInfo(chainInfo)
                callback.invoke(true)
            } else {
                val wallet = if (chainInfo.chain == "evm") {
                    ParticleNetwork.getUserInfo()?.getWallet(UserInfo.WalletChain.evm);
                } else {
                    ParticleNetwork.getUserInfo()?.getWallet(UserInfo.WalletChain.solana);
                }
                if (wallet == null) {
                    callback.invoke(false)
                    return
                }
                if (TextUtils.isEmpty(wallet.publicAddress)) {
                    callback.invoke(false)
                    return
                }
                ParticleNetwork.setChainInfo(chainInfo)
                callback.invoke(true)
            }
        } catch (e: Exception) {
            LogUtils.e("setChainName", e.message)
            callback.invoke(false)
        }
    }
}
