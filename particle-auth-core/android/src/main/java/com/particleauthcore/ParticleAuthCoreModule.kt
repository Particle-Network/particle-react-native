package com.particleauthcore

import android.os.Handler
import android.os.Looper
import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.google.gson.reflect.TypeToken
import com.particle.auth.AuthCore
import com.particle.auth.data.AuthCoreServiceCallback
import com.particle.auth.data.AuthCoreSignCallback
import com.particle.auth.data.MasterPwdServiceCallback
import com.particle.auth.data.req.LoginReq
import com.particle.base.ParticleNetwork
import com.particle.base.data.ErrorInfo
import com.particle.base.data.SignAllOutput
import com.particle.base.data.SignOutput
import com.particle.base.data.WebServiceCallback
import com.particle.base.iaa.FeeMode
import com.particle.base.iaa.FeeModeGasless
import com.particle.base.iaa.FeeModeNative
import com.particle.base.iaa.FeeModeToken
import com.particle.base.iaa.MessageSigner
import com.particle.base.model.CodeReq
import com.particle.base.model.LoginPrompt
import com.particle.base.model.LoginPrompt.ConSent
import com.particle.base.model.LoginPrompt.None
import com.particle.base.model.LoginPrompt.SelectAccount
import com.particle.base.model.LoginType
import com.particle.base.model.Result1Callback
import com.particle.base.model.ResultCallback
import com.particle.base.model.SupportLoginType
import com.particle.base.model.UserInfo
import com.particleauthcore.model.ChainData
import com.particleauthcore.model.ConnectData
import com.particleauthcore.model.ReactCallBack
import com.particleauthcore.utils.ChainUtils
import com.particleauthcore.utils.MessageProcess
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import network.particle.auth_flutter.bridge.model.TransactionParams
import network.particle.auth_flutter.bridge.model.TransactionsParams

class ParticleAuthCoreModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {


    override fun getName(): String {
        return "ParticleAuthCorePlugin"
    }

    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    fun multiply(a: Double, b: Double, promise: Promise) {
        promise.resolve(a * b)
    }

    private val mainHandler = Handler(Looper.getMainLooper())

    @ReactMethod
    fun init() {
        mainHandler.post {
            AuthCore.isConnected()
        }
    }
    fun loginPromptParse(value: String?): LoginPrompt? {
        if (value == null) return null
        if (value.equals("none", true)) return None
        if (value.equals("consent", true)) return ConSent
        if (value.equals("select_account", true) ||
            value.equals("SelectAccount", true)
        ) return SelectAccount
        return null
    }
    @ReactMethod
    fun connect(loginJson: String, callback: Callback) {
        LogUtils.d("connect", loginJson)
        val loginData = GsonUtils.fromJson(loginJson, ConnectData::class.java);
        val loginType = LoginType.valueOf(loginData.loginType.uppercase())
        val account = loginData.account ?: ""
        val prompt = loginPromptParse(loginData.prompt)
        val loginPageConfig = loginData.loginPageConfig
        val supportLoginTypes: List<SupportLoginType> = loginData.supportLoginTypes?.map {
            SupportLoginType.valueOf(it.uppercase())
        } ?: emptyList()
        LogUtils.d("connect", loginType, account, supportLoginTypes, prompt, loginPageConfig)
        try {
            AuthCore.connect(loginType,
                account,
                supportLoginTypes,
                prompt,
                loginPageConfig = loginPageConfig,
                object : AuthCoreServiceCallback<UserInfo> {
                    override fun success(output: UserInfo) {
                        try {
                            callback.invoke(ReactCallBack.success(output).toGson())
                        } catch (_: Exception) {

                        }
                    }

                    override fun failure(errMsg: ErrorInfo) {
                        try {
                            callback.invoke(ReactCallBack.failed(errMsg).toGson())
                        } catch (_: Exception) {

                        }
                    }
                })
        } catch (e: Exception) {
            callback.invoke(ReactCallBack.failed(ErrorInfo(e.message ?: "", 100000)).toGson())
        }

    }


    @ReactMethod
    fun sendEmailCode(email: String, callback: Callback) {
        AuthCore.sendCode(CodeReq(email = email), object : Result1Callback {
            override fun success() {
                callback.invoke(ReactCallBack.success(true).toGson())
            }

            override fun failure(error: ErrorInfo) {
                callback.invoke(ReactCallBack.failed(error).toGson())
            }
        })
    }

    @ReactMethod
    fun sendPhoneCode(phone: String, callback: Callback) {
        AuthCore.sendCode(CodeReq(phone = phone), object : Result1Callback {
            override fun success() {
                callback.invoke(ReactCallBack.success(true).toGson())
            }

            override fun failure(error: ErrorInfo) {
                callback.invoke(ReactCallBack.failed(error).toGson())
            }
        })
    }

    @ReactMethod
    fun connectWithCode(paramsJson: String, callback: Callback) {
        val params = GsonUtils.fromJson(paramsJson, LoginReq::class.java)
        AuthCore.connect(params, object : AuthCoreServiceCallback<UserInfo> {
            override fun success(output: UserInfo) {
                callback.invoke(ReactCallBack.success(output).toGson())
            }

            override fun failure(errMsg: ErrorInfo) {
                callback.invoke(ReactCallBack.failed(errMsg).toGson())
            }
        })
    }

    @ReactMethod
    fun setBlindEnable(enable: Boolean) {
        LogUtils.d("setBlindEnable", enable)
        AuthCore.setBlindEnable(enable)
    }

    @ReactMethod
    fun getBlindEnable(promise: Promise) {
        val isBlind = AuthCore.getBlindEnable()
        LogUtils.d("getBlindEnable", isBlind)
        promise.resolve(isBlind)
    }

    @ReactMethod
    fun disconnect(callback: Callback) {
        AuthCore.disconnect(object : ResultCallback {
            override fun failure() {
                callback.invoke(ReactCallBack.success("success").toGson())
            }

            override fun success() {
                callback.invoke(ReactCallBack.failed("failed").toGson())
            }
        })
    }

    @ReactMethod
    fun isConnected(callback: Callback) {
        callback.invoke(AuthCore.isConnected())
    }

    @ReactMethod
    fun getUserInfo(promise: Promise) {
        val userInfo = AuthCore.getUserInfo()
        promise.resolve(GsonUtils.toJson(userInfo))
    }

    @ReactMethod
    fun switchChain(chainInfo: String, callback: Callback) {
        val chainData: ChainData = GsonUtils.fromJson(
            chainInfo, ChainData::class.java
        )
        val chainInfo = ChainUtils.getChainInfo(chainData.chainId)
        AuthCore.switchChain(chainInfo, object : ResultCallback {
            override fun failure() {
                callback.invoke(false)
            }

            override fun success() {
                callback.invoke(true)
            }
        })
    }

    @ReactMethod
    fun changeMasterPassword(callback: Callback) {
        AuthCore.changeMasterPassword(object : MasterPwdServiceCallback {
            override fun failure(errMsg: ErrorInfo) {
                callback.invoke(ReactCallBack.failed(errMsg).toGson())
            }

            override fun success() {
                callback.invoke(ReactCallBack.success("success").toGson())
            }
        })
    }

    @ReactMethod
    fun hasMasterPassword(callback: Callback) {
        val hasMasterPassword = AuthCore.hasMasterPassword()
        if (hasMasterPassword) {
            callback.invoke(ReactCallBack.success(true).toGson())
        } else {
            callback.invoke(ReactCallBack.failed(false).toGson())
        }
    }

    @ReactMethod
    fun hasPaymentPassword(callback: Callback) {
        val hasPaymentPassword = AuthCore.hasPaymentPassword()
        if (hasPaymentPassword) {
            callback.invoke(ReactCallBack.success(true).toGson())
        } else {
            callback.invoke(ReactCallBack.failed(false).toGson())
        }
    }

    @ReactMethod
    fun openAccountAndSecurity(callback: Callback) {
        currentActivity?.apply {
            runOnUiThread(Runnable {
                AuthCore.openAccountAndSecurity(this)
            })
        }
        callback.invoke(ReactCallBack.success("success").toGson())
    }

    @ReactMethod
    fun openAccountAndSecurity() {

    }


    //evm
    @ReactMethod
    fun evmGetAddress(promise: Promise) {
        promise.resolve(AuthCore.evm.getAddress())
    }

    @ReactMethod
    fun evmPersonalSign(serializedMessage: String, callback: Callback) {
        AuthCore.evm.personalSign(serializedMessage, object : AuthCoreSignCallback<SignOutput> {
            override fun failure(errMsg: ErrorInfo) {
                callback.invoke(ReactCallBack.failed(errMsg).toGson())
            }

            override fun success(output: SignOutput) {
                callback.invoke(ReactCallBack.success(output).toGson())
            }
        })
    }

    @ReactMethod
    fun evmPersonalSignUnique(serializedMessage: String, callback: Callback) {
        AuthCore.evm.personalSignUnique(serializedMessage,
            object : AuthCoreSignCallback<SignOutput> {
                override fun failure(errMsg: ErrorInfo) {
                    callback.invoke(ReactCallBack.failed(errMsg).toGson())
                }

                override fun success(output: SignOutput) {
                    callback.invoke(ReactCallBack.success(output).toGson())
                }
            })
    }

    @ReactMethod
    fun evmSignTypedData(message: String, callback: Callback) {
        AuthCore.evm.signTypedData(message, object : AuthCoreSignCallback<SignOutput> {
            override fun failure(errMsg: ErrorInfo) {
                callback.invoke(ReactCallBack.failed(errMsg).toGson())
            }

            override fun success(output: SignOutput) {
                callback.invoke(ReactCallBack.success(output).toGson())
            }
        })
    }

    @ReactMethod
    fun evmSignTypedDataUnique(message: String, callback: Callback) {
        AuthCore.evm.signTypedDataUnique(message, object : AuthCoreSignCallback<SignOutput> {
            override fun failure(errMsg: ErrorInfo) {
                callback.invoke(ReactCallBack.failed(errMsg).toGson())
            }

            override fun success(output: SignOutput) {
                callback.invoke(ReactCallBack.success(output).toGson())
            }
        })
    }


    //solana

    @ReactMethod
    fun solanaGetAddress(promise: Promise) {
        promise.resolve(AuthCore.solana.getAddress())
    }

    @ReactMethod
    fun solanaSignMessage(message: String, callback: Callback) {
        AuthCore.solana.signMessage(MessageProcess.start(message),
            object : AuthCoreSignCallback<SignOutput> {
                override fun failure(errMsg: ErrorInfo) {
                    callback.invoke(ReactCallBack.failed(errMsg).toGson())
                }

                override fun success(output: SignOutput) {
                    callback.invoke(ReactCallBack.success(output).toGson())
                }
            })
    }

    @ReactMethod
    fun evmSolanaSignMessage(serializedMessage: String, callback: Callback) {
        AuthCore.solana.signMessage(MessageProcess.start(serializedMessage),
            object : AuthCoreSignCallback<SignOutput> {
                override fun failure(errMsg: ErrorInfo) {
                    callback.invoke(ReactCallBack.failed(errMsg).toGson())
                }

                override fun success(output: SignOutput) {
                    callback.invoke(ReactCallBack.success(output).toGson())
                }
            })
    }

    @ReactMethod
    fun solanaSignTransaction(transaction: String, callback: Callback) {
        AuthCore.solana.signTransaction(transaction, object : AuthCoreSignCallback<SignOutput> {
            override fun failure(errMsg: ErrorInfo) {
                callback.invoke(ReactCallBack.failed(errMsg).toGson())
            }

            override fun success(output: SignOutput) {
                callback.invoke(ReactCallBack.success(output).toGson())
            }
        })
    }

    @ReactMethod
    fun solanaSignAllTransactions(transactions: String, callback: Callback) {
        LogUtils.d("signAllTransactions", transactions)
        val trans = GsonUtils.fromJson<List<String>>(
            transactions, object : TypeToken<List<String>>() {}.type
        )
        AuthCore.solana.signAllTransactions(trans, object : AuthCoreSignCallback<SignAllOutput> {
            override fun failure(errMsg: ErrorInfo) {
                callback.invoke(ReactCallBack.failed(errMsg).toGson())
            }

            override fun success(output: SignAllOutput) {
                callback.invoke(ReactCallBack.success(output).toGson())
            }
        })

    }

    @ReactMethod
    fun solanaSignAndSendTransaction(transaction: String, callback: Callback) {
        AuthCore.solana.signAndSendTransaction(transaction,
            object : AuthCoreSignCallback<SignOutput> {
                override fun failure(errMsg: ErrorInfo) {
                    callback.invoke(ReactCallBack.failed(errMsg).toGson())
                }

                override fun success(output: SignOutput) {
                    callback.invoke(ReactCallBack.success(output).toGson())
                }
            })
    }

    @ReactMethod
    fun evmSendTransaction(transactionParams: String, callback: Callback) {
        LogUtils.d("signAndSendTransaction", transactionParams)
        val transParams =
            GsonUtils.fromJson<TransactionParams>(transactionParams, TransactionParams::class.java)
        var feeMode: FeeMode = FeeModeNative()
        if (transParams.feeMode != null) {
            val option = transParams!!.feeMode!!.option
            if (option == "token") {
                val tokenPaymasterAddress = transParams!!.feeMode!!.tokenPaymasterAddress
                val feeQuote = transParams.feeMode!!.feeQuote!!
                feeMode = FeeModeToken(feeQuote, tokenPaymasterAddress!!)
            } else if (option == "gasless") {
                val verifyingPaymasterGasless =
                    transParams.feeMode!!.wholeFeeQuote.verifyingPaymasterGasless
                feeMode = FeeModeGasless(verifyingPaymasterGasless)
            } else if (option == "native") {
                val verifyingPaymasterNative =
                    transParams.feeMode!!.wholeFeeQuote.verifyingPaymasterNative
                feeMode = FeeModeNative(verifyingPaymasterNative)
            }
        }
        try {
            AuthCore.evm.sendTransaction(
                transParams.transaction, object : AuthCoreSignCallback<SignOutput> {

                    override fun success(output: SignOutput) {
                        callback.invoke(ReactCallBack.success(output.signature).toGson())
                    }

                    override fun failure(errMsg: ErrorInfo) {
                        callback.invoke(ReactCallBack.failed(errMsg).toGson())
                    }

                }, feeMode
            )
        } catch (e: Exception) {
            e.printStackTrace()
            callback.invoke(ReactCallBack.failed(ErrorInfo(e.message ?: "failed", 10000)).toGson())
        }
    }

    @ReactMethod
    fun evmBatchSendTransactions(transactions: String, callback: Callback) {
        LogUtils.d("batchSendTransactions", transactions)
        val transParams =
            GsonUtils.fromJson<TransactionsParams>(transactions, TransactionsParams::class.java)
        var feeMode: FeeMode = FeeModeNative()
        if (transParams.feeMode != null && ParticleNetwork.isAAModeEnable()) {
            when (transParams.feeMode!!.option) {
                "token" -> {
                    val tokenPaymasterAddress = transParams.feeMode!!.tokenPaymasterAddress
                    val feeQuote = transParams.feeMode!!.feeQuote!!
                    feeMode = FeeModeToken(feeQuote, tokenPaymasterAddress!!)
                }

                "gasless" -> {
                    val verifyingPaymasterGasless =
                        transParams.feeMode!!.wholeFeeQuote.verifyingPaymasterGasless
                    feeMode = FeeModeGasless(verifyingPaymasterGasless)
                }

                "native" -> {
                    val verifyingPaymasterNative =
                        transParams.feeMode!!.wholeFeeQuote.verifyingPaymasterNative
                    feeMode = FeeModeNative(verifyingPaymasterNative)
                }
            }
        }
        CoroutineScope(Dispatchers.IO).launch {
            try {
                ParticleNetwork.getAAService().quickSendTransaction(transParams.transactions,
                    feeMode,
                    object : MessageSigner {
                        override fun signMessage(
                            message: String,
                            callback: WebServiceCallback<SignOutput>,
                            chainId: Long?
                        ) {
                            AuthCore.evm.personalSign(message,
                                object : AuthCoreSignCallback<SignOutput> {
                                    override fun success(output: SignOutput) {
                                        callback.success(output)
                                    }

                                    override fun failure(errMsg: ErrorInfo) {
                                        callback.failure(errMsg)
                                    }
                                })
                        }

                        override fun eoaAddress(): String {
                            return AuthCore.evm.getAddress()!!
                        }

                    },
                    object : WebServiceCallback<SignOutput> {
                        override fun success(output: SignOutput) {
                            callback.invoke(ReactCallBack.success(output.signature).toGson())
                        }

                        override fun failure(errMsg: ErrorInfo) {
                            callback.invoke(ReactCallBack.failed(errMsg).toGson())
                        }

                    })
            } catch (e: Exception) {
                e.printStackTrace()
                callback.invoke(
                    ReactCallBack.failed(ErrorInfo(e.message ?: "failed", 10000)).toGson()
                )
            }
        }
    }


}


