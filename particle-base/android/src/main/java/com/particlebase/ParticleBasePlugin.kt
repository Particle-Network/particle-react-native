package com.particlebase

import android.text.TextUtils
import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.particle.base.CurrencyEnum
import com.particle.base.Env
import com.particle.base.LanguageEnum
import com.particle.base.ParticleNetwork
import com.particle.base.ParticleNetwork.setFiatCoin
import com.particle.base.ThemeEnum
import com.particle.base.data.ErrorInfo
import com.particle.base.data.SignOutput
import com.particle.base.data.WebOutput
import com.particle.base.data.WebServiceCallback
import com.particle.base.iaa.FeeMode
import com.particle.base.iaa.FeeModeGasless
import com.particle.base.iaa.FeeModeNative
import com.particle.base.iaa.FeeModeToken
import com.particle.base.iaa.MessageSigner
import com.particle.base.model.SecurityAccountConfig
import com.particlebase.utils.ChainUtils
import com.particlebase.model.ChainData
import com.particlebase.model.InitData
import com.particlebase.model.ReactCallBack
import com.particlebase.model.TransactionsParams
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import network.particle.chains.ChainInfo
import org.json.JSONObject

class ParticleBasePlugin(val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    @ReactMethod
    fun init(initParams: String) {
        LogUtils.d("ParticleAuthPlugin init", initParams)
        val initData = GsonUtils.fromJson(initParams, InitData::class.java)
        val chainInfo = ChainUtils.getChainInfo(initData.chainId)
        ParticleNetwork.init(
            reactApplicationContext,
            Env.valueOf(initData.env.uppercase()),
            chainInfo
        )
    }

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
    private fun setChainInfo(chainParams: String, callback: Callback) {
        LogUtils.d("setChainName", chainParams)
        try {
            val chainData: ChainData = GsonUtils.fromJson(chainParams, ChainData::class.java)
            val chainInfo = ChainUtils.getChainInfo(chainData.chainId)
            ParticleNetwork.setChainInfo(chainInfo)
            callback.invoke(true)
        } catch (e: Exception) {
            LogUtils.e("setChainName", e.message)
            callback.invoke(false)
        }
    }

    @ReactMethod
    private fun setFiatCoin(fiatCoin: String, callback: Callback) {
        LogUtils.d("setFiatCoin", fiatCoin)
        ParticleNetwork.setFiatCoin(CurrencyEnum.valueOf(fiatCoin))
    }

    @ReactMethod
    fun setUnsupportCountries(countriesJson: String) {
        LogUtils.d("countriesJson", countriesJson)
        val listType = object : TypeToken<List<String>>() {}.type
        val list: List<String> =
            GsonUtils.fromJson<List<String>?>(countriesJson, listType).map { it.lowercase() }
        ParticleNetwork.setCountryFilter { countryInfo ->
            countryInfo.code !in list
        }
    }


    @ReactMethod
    fun setSecurityAccountConfig(configJson: String) {
        LogUtils.d("setSecurityAccountConfig", configJson)
        try {
            val jobj = JSONObject(configJson)
            val promptSettingWhenSign = jobj.getInt("prompt_setting_when_sign")
            val promptMasterPasswordSettingWhenLogin =
                jobj.getInt("prompt_master_password_setting_when_login")
            val config =
                SecurityAccountConfig(promptSettingWhenSign, promptMasterPasswordSettingWhenLogin)
            ParticleNetwork.setSecurityAccountConfig(config)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun setLanguage(language: String) {
        if (language.isEmpty()) {
            return
        }
        UiThreadUtil.runOnUiThread {
            if (language.equals("zh_hans")) {
                ParticleNetwork.setLanguage(LanguageEnum.ZH_CN, true)
            } else if (language.equals("zh_hant")) {
                ParticleNetwork.setLanguage(LanguageEnum.ZH_TW, true)
            } else if (language.equals("ja")) {
                ParticleNetwork.setLanguage(LanguageEnum.JA, true)
            } else if (language.equals("ko")) {
                ParticleNetwork.setLanguage(LanguageEnum.KO, true)
            } else {
                ParticleNetwork.setLanguage(LanguageEnum.EN, true)
            }
        }
    }

    @ReactMethod
    fun getLanguage(promise: Promise) {
        val language = ParticleNetwork.getLanguage()
        if (language == LanguageEnum.ZH_CN) {
            promise.resolve("zh_hans")
        } else if (language == LanguageEnum.ZH_TW) {
            promise.resolve("zh_hant")
        } else if (language == LanguageEnum.JA) {
            promise.resolve("ja")
        } else if (language == LanguageEnum.KO) {
            promise.resolve("ko")
        } else {
            promise.resolve("en")
        }
        LogUtils.d("getLanguage", language)
    }

//    @ReactMethod
//    fun batchSendTransactions(transactions: String, callback: Callback) {
//        LogUtils.d("batchSendTransactions", transactions)
//        val transParams = GsonUtils.fromJson(transactions, TransactionsParams::class.java)
//        var feeMode: FeeMode = FeeModeNative()
//        if (transParams.feeMode != null) {
//            val option = transParams.feeMode.option
//            if (option == "token") {
//                val tokenPaymasterAddress = transParams.feeMode.tokenPaymasterAddress
//                val feeQuote = transParams.feeMode.feeQuote!!
//                feeMode = FeeModeToken(feeQuote, tokenPaymasterAddress!!)
//            } else if (option == "gasless") {
//                val verifyingPaymasterGasless =
//                    transParams.feeMode.wholeFeeQuote.verifyingPaymasterGasless
//                feeMode = FeeModeGasless(verifyingPaymasterGasless)
//            } else {
//                val verifyingPaymasterNative =
//                    transParams.feeMode.wholeFeeQuote.verifyingPaymasterNative
//                feeMode = FeeModeNative(verifyingPaymasterNative)
//            }
//        }
//        CoroutineScope(Dispatchers.IO).launch {
//            try {
//                ParticleNetwork.getAAService()
//                    .quickSendTransaction(
//                        transParams.transactions,
//                        feeMode,
//                        object : MessageSigner {
//                            override fun signMessage(
//                                message: String,
//                                callback: WebServiceCallback<SignOutput>,
//                                chainId: Long?
//                            ) {
//                                ParticleNetwork.signMessage(
//                                    message,
//                                    object : WebServiceCallback<SignOutput> {
//                                        override fun success(output: SignOutput) {
//                                            callback.success(output)
//                                        }
//
//                                        override fun failure(errMsg: ErrorInfo) {
//                                            callback.failure(errMsg)
//                                        }
//                                    }
//                                )
//                            }
//
//                            override fun eoaAddress(): String {
//                                return ParticleNetwork.getAddress()
//                            }
//                        },
//                        object : WebServiceCallback<SignOutput> {
//                            override fun success(output: SignOutput) {
//                                callback.invoke(ReactCallBack.success(output.signature!!).toGson())
//                            }
//
//                            override fun failure(errMsg: ErrorInfo) {
//                                callback.invoke(ReactCallBack.failed(errMsg).toGson())
//                            }
//                        }
//                    )
//            } catch (e: Exception) {
//                e.printStackTrace()
//                callback.invoke(ReactCallBack.failed("failed").toGson())
//            }
//        }
//    }

    override fun getName(): String {
        return "ParticleBasePlugin"
    }
}
