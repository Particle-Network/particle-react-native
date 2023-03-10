package com.particleauth

import android.text.TextUtils
import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.particle.base.ChainInfo
import com.particle.base.Env
import com.particle.base.LanguageEnum
import com.particle.base.ParticleNetwork
import com.particle.network.ParticleNetworkAuth.fastLogout
import com.particle.network.ParticleNetworkAuth.getAddress
import com.particle.network.ParticleNetworkAuth.getUserInfo
import com.particle.network.ParticleNetworkAuth.isLogin
import com.particle.network.ParticleNetworkAuth.login
import com.particle.network.ParticleNetworkAuth.logout
import com.particle.network.ParticleNetworkAuth.openAccountAndSecurity
import com.particle.network.ParticleNetworkAuth.openWebWallet
import com.particle.network.ParticleNetworkAuth.setChainInfo
import com.particle.network.ParticleNetworkAuth.setDisplayWallet
import com.particle.network.ParticleNetworkAuth.signAllTransactions
import com.particle.network.ParticleNetworkAuth.signAndSendTransaction
import com.particle.network.ParticleNetworkAuth.signMessage
import com.particle.network.ParticleNetworkAuth.signTransaction
import com.particle.network.ParticleNetworkAuth.signTypedData
import com.particle.network.SignTypedDataVersion
import com.particle.network.service.*
import com.particle.network.service.model.*
import com.particleauth.model.*
import com.particleauth.utils.ChainUtils
import com.particleauth.utils.EncodeUtils


class ParticleAuthPlugin(val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  @ReactMethod
  fun init(initParams: String) {
    LogUtils.d("ParticleAuthPlugin init", initParams)

    val initData = GsonUtils.fromJson(initParams, InitData::class.java)
    val chainInfo = ChainUtils.getChainInfo(initData.chainName, initData.chainIdName)
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
    map["chain_name"] = chainInfo.chainName.name
    map["chain_id_name"] = chainInfo.chainId.toString()
    map["chain_id"] = chainInfo.chainId.value()
    val result = Gson().toJson(map)
    LogUtils.d("BridgeBase getChainInfo", result)
    callback.invoke(result)
  }

  @ReactMethod
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

  /**
   * {
   * "loginType": "phone",
   * "account": "",
   * "supportAuthTypeValues": ["GOOGLE"]
   * }
   */
  @ReactMethod
  fun login(loginParams: String?, callback: Callback) {
    LogUtils.d("login", loginParams)
    val loginData = GsonUtils.fromJson(loginParams, LoginData::class.java)
    val account = if (TextUtils.isEmpty(loginData.account)) {
      ""
    } else {
      loginData.account
    }

    var loginFormMode = loginData.loginFormMode
    var supportAuthType = SupportAuthType.NONE.value
    if (loginData.supportAuthTypeValues.contains("All")) {
      supportAuthType = SupportAuthType.ALL.value
    }
    for (i in 0 until loginData.supportAuthTypeValues.size) {
      try {
        val supportType = loginData.supportAuthTypeValues[i].uppercase()
        val authType = SupportAuthType.valueOf(supportType)
        supportAuthType = supportAuthType or authType.value
      } catch (e: Exception) {
        e.printStackTrace()
      }
    }
    ParticleNetwork.login(LoginType.valueOf(loginData.loginType.uppercase()),
      account,
      supportAuthType, loginFormMode, null,
      object : WebServiceCallback<LoginOutput> {
        override fun success(output: LoginOutput) {
//                     BridgeGUI.setPNWallet()
          callback.invoke(ReactCallBack.success(output).toGson())
        }

        override fun failure(errMsg: WebServiceError) {
          callback.invoke(ReactCallBack.failed(errMsg).toGson())
        }
      })
  }

  @ReactMethod
  fun logout(callback: Callback) {
    LogUtils.d("logout")
    ParticleNetwork.logout(object : WebServiceCallback<WebOutput> {
      override fun failure(errMsg: WebServiceError) {
        callback.invoke(ReactCallBack.failed(errMsg).toGson())
      }

      override fun success(output: WebOutput) {
        callback.invoke(ReactCallBack.success(output).toGson())
      }
    })
  }

  @ReactMethod
  fun fastLogout(callback: Callback) {
    if (!ParticleNetwork.isLogin()) {
      callback.invoke(ReactCallBack.success("success").toGson())
      return
    }
    LogUtils.d("logout")
    ParticleNetwork.fastLogout(object : FastLogoutCallBack {

      override fun failure() {
        callback.invoke(ReactCallBack.failed("failed").toGson())
      }

      override fun success() {
        callback.invoke(ReactCallBack.success("success").toGson())
      }
    })
  }


  @ReactMethod
  fun signMessage(message: String, callback: Callback) {
    ParticleNetwork.signMessage(
      EncodeUtils.encode(message),
      object : WebServiceCallback<SignOutput> {

        override fun failure(errMsg: WebServiceError) {
          callback.invoke(ReactCallBack.failed(errMsg).toGson())
        }

        override fun success(output: SignOutput) {
          callback.invoke(ReactCallBack.success(output.signature).toGson())
        }
      })
  }

  @ReactMethod
  fun signTransaction(transaction: String, callback: Callback) {
    LogUtils.d("signTransaction", transaction)
    ParticleNetwork.signTransaction(transaction,
      object : WebServiceCallback<SignOutput> {

        override fun failure(errMsg: WebServiceError) {
          callback.invoke(ReactCallBack.failed(errMsg).toGson())
        }

        override fun success(output: SignOutput) {
          callback.invoke(ReactCallBack.success(output.signature).toGson())
        }
      })
  }

  @ReactMethod
  fun signAllTransactions(transactions: String, callback: Callback) {
    LogUtils.d("signAllTransactions", transactions)
    val trans = GsonUtils.fromJson<List<String>>(
      transactions,
      object : TypeToken<List<String>>() {}.type
    )
    ParticleNetwork.signAllTransactions(trans, object : WebServiceCallback<SignOutput> {
      override fun failure(errMsg: WebServiceError) {
        callback.invoke(ReactCallBack.failed(errMsg).toGson())
      }

      override fun success(output: SignOutput) {
        callback.invoke(ReactCallBack.success(output.signature).toGson())
      }
    })
  }

  @ReactMethod
  fun signAndSendTransaction(transaction: String, callback: Callback) {
    LogUtils.d("signAndSendTransaction", transaction)
    ParticleNetwork.signAndSendTransaction(transaction,
      object : WebServiceCallback<SignOutput> {

        override fun failure(errMsg: WebServiceError) {
          callback.invoke(ReactCallBack.failed(errMsg).toGson())
        }

        override fun success(output: SignOutput) {
          callback.invoke(ReactCallBack.success(output.signature).toGson())
        }
      })
  }

  @ReactMethod
  fun signTypedData(json: String, callback: Callback) {
    LogUtils.d("SignTypedData", json)
    val signTypedData = GsonUtils.fromJson(
      json,
      SignTypedData::class.java
    )
    ParticleNetwork.signTypedData(
      EncodeUtils.encode(signTypedData.message),
      SignTypedDataVersion.valueOf(signTypedData.version.uppercase()),
      object : WebServiceCallback<SignOutput> {
        override fun failure(errMsg: WebServiceError) {
          callback.invoke(ReactCallBack.failed(errMsg).toGson())
        }

        override fun success(output: SignOutput) {
          callback.invoke(ReactCallBack.success(output.signature).toGson())
        }
      })
  }

  /**
   * {
   * "chain_name": "",
   * "chain_id": ""
   * }
   */
  @ReactMethod
  fun setChainInfoAsync(chainParams: String, callback: Callback) {
    LogUtils.d("setChainName", chainParams)
    val chainData = GsonUtils.fromJson(
      chainParams,
      ChainData::class.java
    )

    val chainInfo = ChainUtils.getChainInfo(chainData.chainName, chainData.chainIdName)
    ParticleNetwork.setChainInfo(chainInfo, object : ChainChangeCallBack {
      override fun success() {
        callback.invoke(true)
      }

      override fun failure() {
        callback.invoke(false)
      }
    })
  }

  @ReactMethod
  fun isLogin(callback: Callback) {
    val isUserLogin = ParticleNetwork.isLogin()
    LogUtils.d("isUserLogin", isUserLogin)
    callback.invoke(isUserLogin)
  }

  @ReactMethod
  fun getAddress(promise: Promise) {
    val address = ParticleNetwork.getAddress()
    promise.resolve(address)
  }

  @ReactMethod
  fun getUserInfo(promise: Promise) {
    val userInfo = ParticleNetwork.getUserInfo()
    promise.resolve(GsonUtils.toJson(userInfo))
  }

  @ReactMethod
  fun setDisplayWallet(isDisplayWallet: Boolean) {
    ParticleNetwork.setDisplayWallet(isDisplayWallet)
  }

  @ReactMethod
  fun openWebWallet() {
    ParticleNetwork.openWebWallet()
  }

  @ReactMethod
  fun openAccountAndSecurity() {
    ParticleNetwork.openAccountAndSecurity(object : WebServiceCallback<WebOutput> {
      override fun failure(errMsg: WebServiceError) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java) // <--- added
          .emit("securityFailedCallBack", ReactCallBack.failed(errMsg).toGson())
      }

      override fun success(output: WebOutput) {
      }
    })


  }

  @ReactMethod
  fun setLanguage(language: String) {
    if (language.isEmpty()) {
      return
    }
    if (language.equals("zh_hans")) {
      ParticleNetwork.setAppliedLanguage(LanguageEnum.ZH_CN)
    } else if (language.equals("zh_hant")) {
      ParticleNetwork.setAppliedLanguage(LanguageEnum.ZH_TW)
    } else if (language.equals("ja")) {
      ParticleNetwork.setAppliedLanguage(LanguageEnum.JA)
    } else if (language.equals("ko")) {
      ParticleNetwork.setAppliedLanguage(LanguageEnum.KO)
    } else {
      ParticleNetwork.setAppliedLanguage(LanguageEnum.EN)
    }
  }


  override fun getName(): String {
    return "ParticleAuthPlugin"
  }

}
