package com.particleauth

import android.text.TextUtils
import com.particleauth.utils.EncodeUtils
import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.facebook.react.bridge.*
import com.google.gson.reflect.TypeToken
import com.particle.base.ParticleNetwork
import com.particle.network.ParticleNetworkAuth.getAddress
import com.particle.network.ParticleNetworkAuth.getUserInfo
import com.particle.network.ParticleNetworkAuth.isLogin
import com.particle.network.ParticleNetworkAuth.login
import com.particle.network.ParticleNetworkAuth.logout
import com.particle.network.ParticleNetworkAuth.openWebWallet
import com.particle.network.ParticleNetworkAuth.setChainInfo
import com.particle.network.ParticleNetworkAuth.setDisplayWallet
import com.particle.network.ParticleNetworkAuth.signAllTransactions
import com.particle.network.ParticleNetworkAuth.signAndSendTransaction
import com.particle.network.ParticleNetworkAuth.signMessage
import com.particle.network.ParticleNetworkAuth.signTransaction
import com.particle.network.ParticleNetworkAuth.signTypedData
import com.particle.network.SignTypedDataVersion
import com.particle.network.service.ChainChangeCallBack
import com.particle.network.service.LoginType
import com.particle.network.service.SupportAuthType
import com.particle.network.service.WebServiceCallback
import com.particle.network.service.model.LoginOutput
import com.particle.network.service.model.SignOutput
import com.particle.network.service.model.WebOutput
import com.particle.network.service.model.WebServiceError
import com.particleauth.model.LoginData
import com.particleauth.model.ChainData
import com.particleauth.model.ReactCallBack
import com.particleauth.model.SignTypedData
import com.particleauth.utils.ChainUtils


class ParticleAuthPlugin(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////// AUTH //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////


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
                 val supportType = loginData.supportAuthTypeValues[i]
                 val authType = SupportAuthType.valueOf(supportType)
                 supportAuthType = supportAuthType or authType.value
             } catch (e: Exception) {
                 e.printStackTrace()
             }
         }
         ParticleNetwork.login(LoginType.valueOf(loginData.loginType.uppercase()),
             account,
             supportAuthType, false, object : WebServiceCallback<LoginOutput> {
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

    override fun getName(): String {
        return "ParticleAuthPlugin"
    }

}
