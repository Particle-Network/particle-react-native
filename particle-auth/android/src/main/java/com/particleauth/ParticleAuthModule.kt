package com.particleauth

import android.app.Activity
import android.text.TextUtils
import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.particle.base.Env
import com.particle.base.LanguageEnum
import com.particle.base.ParticleNetwork
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
import com.particle.base.model.LoginType
import com.particle.base.model.ResultCallback
import com.particle.base.model.SecurityAccountConfig
import com.particle.base.model.SupportAuthType
import com.particle.base.model.UserInfo
import com.particle.network.ParticleNetworkAuth.fastLogout
import com.particle.network.ParticleNetworkAuth.getAddress
import com.particle.network.ParticleNetworkAuth.getSecurityAccount
import com.particle.network.ParticleNetworkAuth.getUserInfo
import com.particle.network.ParticleNetworkAuth.isLogin
import com.particle.network.ParticleNetworkAuth.isLoginAsync
import com.particle.network.ParticleNetworkAuth.login
import com.particle.network.ParticleNetworkAuth.logout
import com.particle.network.ParticleNetworkAuth.openAccountAndSecurity
import com.particle.network.ParticleNetworkAuth.openWebWallet
import com.particle.network.ParticleNetworkAuth.setWebAuthConfig
import com.particle.network.ParticleNetworkAuth.signAllTransactions
import com.particle.network.ParticleNetworkAuth.signAndSendTransaction
import com.particle.network.ParticleNetworkAuth.signMessage
import com.particle.network.ParticleNetworkAuth.signMessageUnique
import com.particle.network.ParticleNetworkAuth.signTransaction
import com.particle.network.ParticleNetworkAuth.signTypedData
import com.particle.network.ParticleNetworkAuth.switchChain
import com.particle.network.SignTypedDataVersion
import com.particle.network.service.*
import com.particle.network.service.model.*
import com.particleauth.model.*
import com.particleauth.utils.ChainUtils
import com.particleauth.utils.EncodeUtils
import com.particleauth.utils.MessageProcess
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import network.particle.chains.ChainInfo
import org.json.JSONObject


class ParticleAuthPlugin(val reactContext: ReactApplicationContext) :
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
    ParticleNetwork.login(
      LoginType.valueOf(loginData.loginType.uppercase()),
      account,
      supportAuthType, null,
      object : WebServiceCallback<UserInfo> {
        override fun success(output: UserInfo) {
//                     BridgeGUI.setPNWallet()
          callback.invoke(ReactCallBack.success(output).toGson())
        }

        override fun failure(errMsg: ErrorInfo) {
          callback.invoke(ReactCallBack.failed(errMsg).toGson())
        }


      })
  }

  @ReactMethod
  fun logout(callback: Callback) {
    LogUtils.d("logout")
    ParticleNetwork.logout(object : WebServiceCallback<WebOutput> {
      override fun success(output: WebOutput) {
        callback.invoke(ReactCallBack.success(output).toGson())
      }

      override fun failure(errMsg: ErrorInfo) {
        callback.invoke(ReactCallBack.failed(errMsg).toGson())
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
    ParticleNetwork.fastLogout(object : ResultCallback {

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
      MessageProcess.start(message),
      object : WebServiceCallback<SignOutput> {
        override fun success(output: SignOutput) {
          callback.invoke(ReactCallBack.success(output.signature).toGson())
        }

        override fun failure(errMsg: ErrorInfo) {
          callback.invoke(ReactCallBack.failed(errMsg).toGson())
        }
      })
  }

  @ReactMethod
  fun signMessageUnique(message: String, callback: Callback) {
    ParticleNetwork.signMessageUnique(
      MessageProcess.start(message),
      object : WebServiceCallback<SignOutput> {
        override fun success(output: SignOutput) {
          callback.invoke(ReactCallBack.success(output.signature).toGson())
        }

        override fun failure(errMsg: ErrorInfo) {
          callback.invoke(ReactCallBack.failed(errMsg).toGson())
        }
      })
  }

  @ReactMethod
  fun signTransaction(transaction: String, callback: Callback) {
    LogUtils.d("signTransaction", transaction)
    ParticleNetwork.signTransaction(transaction,
      object : WebServiceCallback<SignOutput> {
        override fun success(output: SignOutput) {
          callback.invoke(ReactCallBack.success(output.signature).toGson())
        }

        override fun failure(errMsg: ErrorInfo) {
          callback.invoke(ReactCallBack.failed(errMsg).toGson())
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
      override fun success(output: SignOutput) {
        callback.invoke(ReactCallBack.success(output.signature).toGson())
      }

      override fun failure(errMsg: ErrorInfo) {
        callback.invoke(ReactCallBack.failed(errMsg).toGson())
      }
    })
  }

  @ReactMethod
  fun signAndSendTransaction(transactionParams: String, callback: Callback) {
    LogUtils.d("signAndSendTransaction", transactionParams)
    val transParams =
      GsonUtils.fromJson<TransactionParams>(transactionParams, TransactionParams::class.java)
    var feeMode: FeeMode = FeeModeNative()
    if (transParams.feeMode != null && ParticleNetwork.isAAModeEnable()) {
      val option = transParams.feeMode.option
      if (option == "token") {
        val tokenPaymasterAddress = transParams.feeMode.tokenPaymasterAddress
        val feeQuote = transParams.feeMode.feeQuote!!
        feeMode = FeeModeToken(feeQuote,tokenPaymasterAddress!!)
      } else if (option == "gasless") {
        val verifyingPaymasterGasless = transParams.feeMode.wholeFeeQuote.verifyingPaymasterGasless
        feeMode = FeeModeGasless(verifyingPaymasterGasless)
      } else if (option == "native") {
        val verifyingPaymasterNative = transParams.feeMode.wholeFeeQuote.verifyingPaymasterNative
        feeMode = FeeModeNative(verifyingPaymasterNative)
      }
    }
    try {
      ParticleNetwork.signAndSendTransaction(
        transParams.transaction,
        object : WebServiceCallback<SignOutput> {

          override fun success(output: SignOutput) {
            callback.invoke(ReactCallBack.success(output.signature).toGson())
          }

          override fun failure(errMsg: ErrorInfo) {
            callback.invoke(ReactCallBack.failed(errMsg).toGson())
          }

        },
        feeMode
      )
    } catch (e: Exception) {
      callback.invoke(ReactCallBack.failed(e.message).toGson())
    }
  }

  @ReactMethod
  fun signTypedData(json: String, callback: Callback) {
    LogUtils.d("SignTypedData", json)
    val signTypedData = GsonUtils.fromJson(
      json,
      SignTypedData::class.java
    )
    val typedDataVersion = if (signTypedData.version.equals("v4Unique")) {
      SignTypedDataVersion.V4Unique
    } else {
      SignTypedDataVersion.valueOf(signTypedData.version.uppercase())
    }
    ParticleNetwork.signTypedData(
      MessageProcess.start(signTypedData.message),
      typedDataVersion,
      object : WebServiceCallback<SignOutput> {
        override fun success(output: SignOutput) {
          callback.invoke(ReactCallBack.success(output.signature).toGson())
        }

        override fun failure(errMsg: ErrorInfo) {
          callback.invoke(ReactCallBack.failed(errMsg).toGson())
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

    val chainInfo = ChainUtils.getChainInfo(chainData.chainId)
    ParticleNetwork.switchChain(chainInfo, object : ResultCallback {
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
  fun isLoginAsync(callback: Callback) {
    CoroutineScope(Dispatchers.IO).launch {
      val userInfo = ParticleNetwork.isLoginAsync()
      LogUtils.d("isLoginAsync", userInfo)
      if (userInfo == null) {
        callback.invoke(ReactCallBack.failed("failed").toGson())
        return@launch
      }
      callback.invoke(ReactCallBack.success(GsonUtils.toJson(userInfo)))
    }
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
  fun getSecurityAccount(callback: Callback) {
    LogUtils.d("getSecurityAccount")
    CoroutineScope(Dispatchers.IO).launch {
      try {
        val securityAccount = ParticleNetwork.getSecurityAccount()
        val result = ReactCallBack.success(securityAccount).toGson()
        LogUtils.d("getSecurityAccount:", result)
        callback.invoke(result)
      } catch (e: Exception) {
        e.printStackTrace()
        val result = ReactCallBack.failed(e.message).toGson()
        LogUtils.d("getSecurityAccount:", result)
        callback.invoke(result)
      }
    }
  }


  @ReactMethod
  fun setDisplayWallet(isDisplayWallet: Boolean) {
    ParticleNetwork.setWebAuthConfig(isDisplayWallet, ThemeEnum.SYSTEM)
  }

  @ReactMethod
  fun openWebWallet(jsonConfig: String?) {
    reactContext.currentActivity?.apply {
      ParticleNetwork.openWebWallet(this, jsonConfig)
    }
  }

  @ReactMethod
  fun openAccountAndSecurity() {
    ParticleNetwork.openAccountAndSecurity(object : WebServiceCallback<WebOutput> {


      override fun success(output: WebOutput) {
      }

      override fun failure(errMsg: ErrorInfo) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java) // <--- added
          .emit("securityFailedCallBack", ReactCallBack.failed(errMsg).toGson())
      }
    })


  }


  @ReactMethod
  fun setSecurityAccountConfig(configJson: String) {
    LogUtils.d("setSecurityAccountConfig", configJson)
    try {
      val jobj = JSONObject(configJson)
      val promptSettingWhenSign = jobj.getInt("prompt_setting_when_sign")
      val promptMasterPasswordSettingWhenLogin =
        jobj.getInt("prompt_master_password_setting_when_login")
      val config = SecurityAccountConfig(
        promptSettingWhenSign,
        promptMasterPasswordSettingWhenLogin
      )
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
    if (language.equals("zh_hans")) {
      ParticleNetwork.setLanguage(LanguageEnum.ZH_CN)
    } else if (language.equals("zh_hant")) {
      ParticleNetwork.setLanguage(LanguageEnum.ZH_TW)
    } else if (language.equals("ja")) {
      ParticleNetwork.setLanguage(LanguageEnum.JA)
    } else if (language.equals("ko")) {
      ParticleNetwork.setLanguage(LanguageEnum.KO)
    } else {
      ParticleNetwork.setLanguage(LanguageEnum.EN)
    }
  }

  fun batchSendTransactions(transactions: String, callback: Callback) {
    LogUtils.d("batchSendTransactions", transactions)
    val transParams = GsonUtils.fromJson(transactions, TransactionsParams::class.java)
    var feeMode: FeeMode = FeeModeNative()
    if (transParams.feeMode != null) {
      val option = transParams.feeMode.option
      if (option == "token") {
        val tokenPaymasterAddress = transParams.feeMode.tokenPaymasterAddress
        val feeQuote = transParams.feeMode.feeQuote!!
        feeMode = FeeModeToken(feeQuote,tokenPaymasterAddress!!)
      } else if (option == "gasless") {
        val verifyingPaymasterGasless = transParams.feeMode.wholeFeeQuote.verifyingPaymasterGasless
        feeMode = FeeModeGasless(verifyingPaymasterGasless)
      } else {
        val verifyingPaymasterNative = transParams.feeMode.wholeFeeQuote.verifyingPaymasterNative
        feeMode = FeeModeNative(verifyingPaymasterNative)
      }
    }
    CoroutineScope(Dispatchers.IO).launch {
      try {
        ParticleNetwork.getAAService()
          .quickSendTransaction(transParams.transactions, feeMode, object : MessageSigner {
            override fun signMessage(
              message: String,
              callback: WebServiceCallback<SignOutput>,
              chainId: Long?
            ) {
              ParticleNetwork.signMessage(message, object : WebServiceCallback<SignOutput> {
                override fun success(output: SignOutput) {
                  callback.success(output)
                }

                override fun failure(errMsg: ErrorInfo) {
                  callback.failure(errMsg)
                }
              })
            }

            override fun eoaAddress(): String {
              return ParticleNetwork.getAddress()
            }

          }, object : WebServiceCallback<SignOutput> {
            override fun success(output: SignOutput) {
              callback.invoke(ReactCallBack.success(output.signature!!).toGson())
            }

            override fun failure(errMsg: ErrorInfo) {
              callback.invoke(ReactCallBack.failed(errMsg).toGson())
            }


          })
      } catch (e: Exception) {
        e.printStackTrace()
        callback.invoke(ReactCallBack.failed("failed").toGson())
      }
    }
  }

  override fun getName(): String {
    return "ParticleAuthPlugin"
  }


}
