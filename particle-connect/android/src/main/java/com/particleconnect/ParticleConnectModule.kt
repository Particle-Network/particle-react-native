package com.particleconnect

import android.app.Application
import android.text.TextUtils
import auth.core.adapter.AuthCoreAdapter
import auth.core.adapter.ConnectConfigEmail
import auth.core.adapter.ConnectConfigJWT
import auth.core.adapter.ConnectConfigPhone
import auth.core.adapter.ConnectConfigSocialLogin
import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.connect.common.*
import com.connect.common.eip4361.Eip4361Message
import com.connect.common.model.Account
import com.connect.common.model.ConnectError
import com.evm.adapter.EVMConnectAdapter
import com.facebook.react.bridge.*
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.particle.base.Env
import com.particle.base.ParticleNetwork
import com.particle.base.data.ErrorInfo
import com.particle.base.data.SignOutput
import com.particle.base.data.WebServiceCallback
import com.particle.base.iaa.FeeMode
import com.particle.base.iaa.FeeModeNative
import com.particle.base.iaa.FeeModeToken
import com.particle.base.iaa.FeeModeGasless
import com.particle.base.iaa.MessageSigner
import com.particle.base.model.LoginType
import com.particle.base.model.ResultCallback
import com.particle.base.model.SupportAuthType
import com.particle.connect.ParticleConnect
import com.particle.connect.ParticleConnect.setChain
import com.particle.connect.model.AdapterAccount
import com.particle.network.ParticleNetworkAuth.switchChain
import com.particleconnect.model.*
import com.particleconnect.utils.BridgeScope
import com.particleconnect.utils.ChainUtils
import com.particleconnect.utils.EncodeUtils
import com.particleconnect.utils.MessageProcess
import com.phantom.adapter.PhantomConnectAdapter
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.particle.base.model.LoginPrompt
import com.particle.base.model.MobileWCWalletName
import com.particle.base.model.SocialLoginType
import com.particle.base.model.SupportLoginType
import com.particle.connectkit.ConnectKitConfig
import com.particle.connectkit.ParticleConnectKit
import com.solana.adapter.SolanaConnectAdapter
import com.wallet.connect.adapter.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch
import network.particle.chains.ChainInfo
import org.json.JSONException
import org.json.JSONObject
import particle.auth.adapter.ParticleConnectAdapter
import particle.auth.adapter.ParticleConnectConfig
import java.lang.Exception
import java.util.Locale

class ParticleConnectPlugin(var reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    /**
     * {
     * "chain": "BscChain",
     * "chain_id": "Testnet",
     * "env": "PRODUCTION"
     * }
     */
    @ReactMethod
    fun initialize(initParams: String) {
        LogUtils.d("init", initParams)
        val initData: InitData = GsonUtils.fromJson(initParams, InitData::class.java)
        val chainInfo: ChainInfo = ChainUtils.getChainInfo(initData.chainId)
        val dAppMetadata = initData.metadata
        val rpcUrl: RpcUrl? = initData.rpcUrl
        ParticleConnect.init(
            reactApplicationContext.applicationContext as Application,
            Env.valueOf(initData.env.uppercase()),
            chainInfo,
            dAppMetadata
        ) { initAdapter(rpcUrl) }
    }

    @ReactMethod
    fun setWalletConnectProjectId(walletConnectProjectId:String){
        ParticleNetwork.setWalletConnectProjectId(walletConnectProjectId)
    }
    var job: Job? = null

    @ReactMethod
    fun connectWalletConnect(callback: Callback) {
        val connectAdapter = ParticleConnect.getAdapters()
            .first { it is WalletConnectAdapter } as WalletConnectAdapter
        connectAdapter.connect<ConnectConfig>(null, object : ConnectCallback {
            override fun onConnected(account: Account) {
                LogUtils.d("onConnected", account.toString())
                try {
                    callback.invoke(ReactCallBack.success(account).toGson())
                } catch (_: Exception) {
                }
            }

            override fun onError(connectError: ConnectError) {
                LogUtils.d("onError", connectError.toString())
                callback.invoke(
                    ReactCallBack.failed(ReactErrorMessage.parseConnectError(connectError)).toGson()
                )
            }
        })

        job = connectAdapter.qrUriModel.onEach {
            if (!TextUtils.isEmpty(it)) job?.cancel()
            reactContext
                .getJSModule(
                    DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
                )
                .emit("qrCodeUri", it)
        }.launchIn(CoroutineScope(Dispatchers.Main))
    }

    @ReactMethod
    fun setChainInfo(chainParams: String, callback: Callback) {
        LogUtils.d("setChainInfo", chainParams)
        val chainData: ChainData = GsonUtils.fromJson(
            chainParams, ChainData::class.java
        )

        try {
            val chainInfo = ChainUtils.getChainInfo(chainData.chainId)
            setChain(chainInfo)
            callback.invoke(true)
        } catch (e: java.lang.Exception) {
            LogUtils.e("setChainName", e.message)
            callback.invoke(false)
        }
    }

    @ReactMethod
    fun setChainInfoAsync(chainParams: String, callback: Callback) {
        LogUtils.d("setChainInfo", chainParams)
        val chainData: ChainData = GsonUtils.fromJson(chainParams, ChainData::class.java)

        try {
            val chainInfo = ChainUtils.getChainInfo(chainData.chainId)
            ParticleNetwork.switchChain(chainInfo, object : ResultCallback {
                override fun success() {
                    ParticleConnect.setChain(chainInfo)
                    LogUtils.d("Connect setChainNameAsync success");
                    callback.invoke(ReactCallBack.success("success").toGson())
                }

                override fun failure() {
                    LogUtils.d("Connect setChainNameAsync failed");
                    callback.invoke(ReactCallBack.failed(ErrorInfo("failed", 100000)).toGson())
                }
            })

        } catch (e: Exception) {
            LogUtils.e("setChainName", e.message)
            callback.invoke(ReactCallBack.failed(ErrorInfo("failed", 100000)).toGson())
        }
    }

    @ReactMethod
    fun getChainInfo(callback: Callback) {
        val chainInfo: ChainInfo = ParticleNetwork.chainInfo
        val map: MutableMap<String, Any> = HashMap()
        map["chain_name"] = chainInfo.name
        map["chain_id"] = chainInfo.id
        val result = Gson().toJson(map)
        LogUtils.d("getChainInfo", result)
        callback.invoke(result)
    }

    @ReactMethod
    fun setWalletConnectV2SupportChainInfos(chainsString: String?) {
        LogUtils.d("setWalletConnectV2SupportChainInfos", chainsString)
        val initData: List<InitData> =
            GsonUtils.fromJson(chainsString, object : TypeToken<List<InitData>>() {}.type)
        val chainInfos = mutableListOf<ChainInfo>()
        initData.forEach {
            chainInfos.add(ChainUtils.getChainInfo(it.chainId))
        }
        ParticleConnect.setWalletConnectV2SupportChainInfos(chainInfos)
    }

    @ReactMethod
    fun connect(connectParams: String, callback: Callback) {
        LogUtils.d("connectParams", connectParams)
        val particleConnectDataParams = GsonUtils.fromJson(connectParams,ParticleConnectDataParams::class.java)
        val walletType = particleConnectDataParams.walletType
        var config: ConnectConfig? = null
        try {
            if (particleConnectDataParams.particleConnectConfig!=null) {
                val connectData = particleConnectDataParams.particleConnectConfig!!
                val account: String = connectData.account ?: ""
                if (walletType == MobileWCWalletName.Particle.name) {
                    var supportAuthType = SupportAuthType.NONE.value
                    for (i in connectData.supportAuthTypeValues.indices) {
                        try {
                            val supportType =
                                connectData.supportAuthTypeValues[i].uppercase(Locale.getDefault())
                            val authType = SupportAuthType.valueOf(supportType)
                            supportAuthType = supportAuthType or authType.value
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    }
                    config =
                        ParticleConnectConfig(
                            LoginType.valueOf(
                                connectData.loginType.uppercase(
                                    Locale.getDefault()
                                )
                            ), supportAuthType, account, null
                        )
                    val configJson = Gson().toJson(config)
                    LogUtils.d("Connect connect config", configJson)
                } else if (walletType == MobileWCWalletName.AuthCore.name) {
                    val loginType =
                        LoginType.valueOf(connectData.loginType.uppercase(Locale.ENGLISH))
                    if (loginType == LoginType.JWT) {
                        config = ConnectConfigJWT(account)
                    } else if (loginType == LoginType.PHONE) {
                        val supportLoginTypes: List<SupportLoginType> =
                            connectData.supportAuthTypeValues.map {
                                SupportLoginType.valueOf(it.uppercase())
                            }
                        val prompt = LoginPrompt.parse(connectData.prompt)
                        config = ConnectConfigPhone(
                            account,
                            connectData.code ?: "",
                            supportLoginTypes,
                            prompt,
                            connectData.loginPageConfig
                        )
                    } else if (loginType == LoginType.EMAIL) {
                        val supportLoginTypes: List<SupportLoginType> =
                            connectData.supportAuthTypeValues.map {
                                SupportLoginType.valueOf(it.uppercase())
                            }
                        val prompt = LoginPrompt.parse(connectData.prompt)
                        config = ConnectConfigEmail(
                            account,
                            connectData.code ?: "",
                            supportLoginTypes,
                            prompt,
                            connectData.loginPageConfig
                        )

                    } else {
                        val socialLoginType =
                            SocialLoginType.valueOf(connectData.loginType.uppercase(Locale.ENGLISH))
                        val prompt = LoginPrompt.parse(connectData.prompt)
                        config = ConnectConfigSocialLogin(socialLoginType, prompt)
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        var connectAdapter: IConnectAdapter? = null
        val adapters = ParticleConnect.getAdapters()
        for (adapter in adapters) {
            if (adapter.name.equals(walletType, ignoreCase = true)) {
                connectAdapter = adapter
                break
            }
        }
        connectAdapter!!.connect(config, object : ConnectCallback {
            override fun onConnected(account: Account) {
                try {
                    LogUtils.d("onConnected", account.toString())
                    callback.invoke(ReactCallBack.success(account).toGson())
                } catch (_: Exception) {

                }
            }

            override fun onError(connectError: ConnectError) {
                try {
                    LogUtils.d("onError", connectError.toString())
                    callback.invoke(ReactCallBack.failed(connectError.message).toGson())
                } catch (_: Exception) {

                }
            }
        })
    }

    @ReactMethod
    fun connectWithConnectKitConfig(
        connectJson: String, callback: Callback
    ) {
        LogUtils.d("connectWithConnectKitConfig", connectJson)
        val connectKitConfig: ConnectKitConfig = GsonUtils.fromJson(
            connectJson, ConnectKitConfig::class.java
        )
        LogUtils.d("connectKitConfig", connectKitConfig)
        ParticleConnectKit.connect(connectKitConfig, object : ConnectKitCallback {
            override fun onConnected(walletName: String, account: Account) {
                LogUtils.d("onConnected", account.toString())
                try {
                    LogUtils.d("onConnected", account.toString())
                    callback.invoke(
                        ReactCallBack.success(
                            AccountNew(
                                account.publicAddress,
                                walletName
                            )
                        ).toGson()
                    )
                } catch (_: Exception) {

                }
            }

            override fun onError(error: ConnectError) {
                try {
                    LogUtils.d("onError", error.toString())
                    callback.invoke(ReactCallBack.failed(error.message).toGson())
                } catch (_: Exception) {

                }
            }
        })
    }

    @ReactMethod
    fun isConnected(jsonParams: String, callback: Callback) {
        LogUtils.d("isConnect", jsonParams)
        try {
            val jsonObject = JSONObject(jsonParams)
            val walletType = jsonObject.getString("wallet_type")
            val publicKey = jsonObject.getString("public_address")
            val connectAdapter = getConnectAdapter(publicKey, walletType)
            if (connectAdapter == null) {
                callback.invoke(
                    ReactCallBack.failed(
                        ReactErrorMessage.parseConnectError(
                            ConnectError.Unauthorized()
                        )
                    ).toGson()
                )
                return
            }
            var isConnect = false
            isConnect = connectAdapter.connected(publicKey)
            LogUtils.d("isConnect", isConnect)
            callback.invoke(isConnect)
        } catch (e: Exception) {
            e.printStackTrace()
            callback.invoke(false)
        }
    }

    @ReactMethod
    fun getAccounts(walletType: String, callback: Callback) {
        LogUtils.d("getAccounts", walletType)
        val adapterAccounts: List<AdapterAccount> = ParticleConnect.getAccounts()
        var accounts: List<Account> = ArrayList()
        for (adapterAccount in adapterAccounts) {
            if (adapterAccount.connectAdapter.name.equals(walletType)) {
                accounts = adapterAccount.accounts
                break
            }
        }
        return callback.invoke(ReactCallBack.success(accounts).toGson())
    }

    @ReactMethod
    fun disconnect(jsonParams: String, callback: Callback) {
        LogUtils.d("disconnect", jsonParams)
        try {
            val jsonObject = JSONObject(jsonParams)
            val walletType = jsonObject.getString("wallet_type")
            val publicAddress = jsonObject.getString("public_address")
            val connectAdapter = getConnectAdapter(publicAddress, walletType)
            if (connectAdapter == null) {
                callback.invoke(
                    ReactCallBack.failed(
                        ReactErrorMessage.parseConnectError(
                            ConnectError.Unauthorized()
                        )
                    ).toGson()
                )
                return
            }
            connectAdapter.disconnect(publicAddress, object : DisconnectCallback {
                override fun onDisconnected() {
                    LogUtils.d("onDisconnected", publicAddress)
                    callback.invoke(ReactCallBack.success(publicAddress).toGson())
                }

                override fun onError(error: ConnectError) {
                    LogUtils.d("onError", error.toString())
                    callback.invoke(
                        ReactCallBack.failed(ReactErrorMessage.parseConnectError(error)).toGson()
                    )
                }
            })
        } catch (e: JSONException) {
            e.printStackTrace();
            callback.invoke(ReactCallBack.failed(e.message).toGson())
        }
    }

    @ReactMethod
    fun signMessage(jsonParams: String, callback: Callback) {
        LogUtils.d("signMessage", jsonParams)
        val signData = GsonUtils.fromJson(
            jsonParams, ConnectSignData::class.java
        )

        val connectAdapter = getConnectAdapter(signData.publicAddress, signData.walletType)
        if (connectAdapter == null) {
            callback.invoke(
                ReactCallBack.failed(
                    ReactErrorMessage.parseConnectError(
                        ConnectError.Unauthorized()
                    )
                ).toGson()
            )
            return
        }
        val message = MessageProcess.start(signData.message)
        connectAdapter.signMessage(signData.publicAddress, message, object : SignCallback {
            override fun onError(error: ConnectError) {
                LogUtils.d("onError", error.toString())
                callback.invoke(
                    ReactCallBack.failed(ReactErrorMessage.parseConnectError(error)).toGson()
                )
            }

            override fun onSigned(signature: String) {
                LogUtils.d("onSigned", signature)
                callback.invoke(ReactCallBack.success(signature).toGson())
            }
        })
    }

    @ReactMethod
    fun signAndSendTransaction(jsonParams: String, callback: Callback) {
        val transParams = GsonUtils.fromJson(jsonParams, ConnectSignData::class.java)
        val transaction = transParams.transaction
        val connectAdapter = getConnectAdapter(transParams.publicAddress, transParams.walletType)
        if (connectAdapter == null) {
            callback.invoke(
                ReactCallBack.failed(
                    ReactErrorMessage.parseConnectError(
                        ConnectError.Unauthorized()
                    )
                ).toGson()
            )
            return
        }

        if (ParticleNetwork.isAAModeEnable() && transParams.feeMode != null) {
            var feeMode: FeeMode = FeeModeNative()
            val option = transParams.feeMode.option
            if (option == "token") {
                val tokenPaymasterAddress = transParams.feeMode.tokenPaymasterAddress
                val feeQuote = transParams.feeMode.feeQuote!!
                feeMode = FeeModeToken(feeQuote, tokenPaymasterAddress!!)
            } else if (option == "gasless") {
                val verifyingPaymasterGasless =
                    transParams.feeMode.wholeFeeQuote.verifyingPaymasterGasless
                feeMode = FeeModeGasless(verifyingPaymasterGasless)
            } else if (option == "native") {
                val verifyingPaymasterNative =
                    transParams.feeMode.wholeFeeQuote.verifyingPaymasterNative
                feeMode = FeeModeNative(verifyingPaymasterNative)
            }
            connectAdapter.signAndSendTransaction(
                transParams.publicAddress,
                transaction,
                feeMode,
                object : TransactionCallback {

                    override fun onError(error: ConnectError) {
                        LogUtils.d("onError", error.toString())
                        callback.invoke(
                            ReactCallBack.failed(ReactErrorMessage.parseConnectError(error))
                                .toGson()
                        )

                    }

                    override fun onTransaction(transactionId: String?) {
                        LogUtils.d("onTransaction", transactionId)
                        callback.invoke(ReactCallBack.success(transactionId).toGson())
                    }
                })
        } else {
            connectAdapter.signAndSendTransaction(
                transParams.publicAddress,
                transaction,
                object : TransactionCallback {

                    override fun onError(error: ConnectError) {
                        LogUtils.d("onError", error.toString())
                        callback.invoke(
                            ReactCallBack.failed(ReactErrorMessage.parseConnectError(error))
                                .toGson()
                        )

                    }

                    override fun onTransaction(transactionId: String?) {
                        LogUtils.d("onTransaction", transactionId)
                        callback.invoke(ReactCallBack.success(transactionId).toGson())
                    }
                })
        }

    }

    @ReactMethod
    fun signTransaction(jsonParams: String, callback: Callback) {
        LogUtils.d("signAndSendTransaction", jsonParams)
        val signData = GsonUtils.fromJson(jsonParams, ConnectSignData::class.java)
        val transaction = signData.transaction
        val connectAdapter = getConnectAdapter(signData.publicAddress, signData.walletType)
        if (connectAdapter == null) {
            callback.invoke(
                ReactCallBack.failed(
                    ReactErrorMessage.parseConnectError(
                        ConnectError.Unauthorized()
                    )
                ).toGson()
            )
            return
        }

        connectAdapter.signAndSendTransaction(
            signData.publicAddress,
            transaction,
            object : TransactionCallback {
                override fun onError(error: ConnectError) {
                    LogUtils.d("onError", error.toString())
                    ReactCallBack.failed(ReactErrorMessage.parseConnectError(error)).toGson()
                }

                override fun onTransaction(transactionId: String?) {
                    LogUtils.d("onTransaction", transactionId)
                    callback.invoke(ReactCallBack.success(transactionId).toGson())

                }
            })
    }

    @ReactMethod
    fun signAllTransactions(jsonParams: String, callback: Callback) {
        val signData = GsonUtils.fromJson(jsonParams, ConnectSignData::class.java)
        val connectAdapter = getConnectAdapter(signData.publicAddress, signData.walletType)
        if (connectAdapter == null) {
            callback.invoke(
                ReactCallBack.failed(
                    ReactErrorMessage.parseConnectError(
                        ConnectError.Unauthorized()
                    )
                ).toGson()
            )
            return
        }
        connectAdapter.signAllTransactions(
            signData.publicAddress,
            signData.transactions.toTypedArray(),
            object : SignAllCallback {

                override fun onError(error: ConnectError) {
                    LogUtils.d("onError", error.toString())
                    callback.invoke(
                        ReactCallBack.failed(ReactErrorMessage.parseConnectError(error)).toGson()
                    )
                }

                override fun onSigned(signatures: List<String>) {
                    LogUtils.d("onSigned", signatures.toString())
                    callback.invoke(ReactCallBack.success(signatures).toGson())
                }
            })

    }

    @ReactMethod
    fun signTypedData(jsonParams: String, callback: Callback) {
        val signData = GsonUtils.fromJson(jsonParams, ConnectSignData::class.java)
        val connectAdapter = getConnectAdapter(signData.publicAddress, signData.walletType)
        if (connectAdapter == null) {
            callback.invoke(
                ReactCallBack.failed(
                    ReactErrorMessage.parseConnectError(
                        ConnectError.Unauthorized()
                    )
                ).toGson()
            )
            return
        }
        val typedData = MessageProcess.start(signData.message)
        connectAdapter.signTypedData(signData.publicAddress, typedData, object : SignCallback {
            override fun onError(error: ConnectError) {
                LogUtils.d("onError", error.toString())
                callback.invoke(
                    ReactCallBack.failed(ReactErrorMessage.parseConnectError(error)).toGson()
                )
            }

            override fun onSigned(signature: String) {
                LogUtils.d("onSigned", signature)
                callback.invoke(ReactCallBack.success(signature).toGson())
            }
        })
    }

    @ReactMethod
    fun importMnemonic(jsonParams: String, callback: Callback) {
        val signData = GsonUtils.fromJson(jsonParams, ConnectSignData::class.java)
        val connectAdapter = getPrivateKeyAdapter()
        if (connectAdapter == null) {
            callback.invoke(
                ReactCallBack.failed(
                    ReactErrorMessage.parseConnectError(
                        ConnectError.Unauthorized()
                    )
                ).toGson()
            )
            return
        }
        BridgeScope.launch {
            try {
                val account = connectAdapter.importWalletFromMnemonic(
                    signData.mnemonic
                )
                callback.invoke(ReactCallBack.success(account).toGson())
            } catch (e: Exception) {
                e.printStackTrace()
                callback.invoke(ReactCallBack.failed(e.message).toGson())
            }
        }
    }

    @ReactMethod
    fun importPrivateKey(jsonParams: String, callback: Callback) {
        val signData = GsonUtils.fromJson(jsonParams, ConnectSignData::class.java)
        val connectAdapter = getPrivateKeyAdapter()
        if (connectAdapter == null) {
            callback.invoke(
                ReactCallBack.failed(
                    ReactErrorMessage.parseConnectError(
                        ConnectError.Unauthorized()
                    )
                ).toGson()
            )
            return
        }
        BridgeScope.launch {
            try {
                val account = connectAdapter.importWalletFromPrivateKey(
                    signData.privateKey
                )
                callback.invoke(ReactCallBack.success(account).toGson())
            } catch (e: Exception) {
                e.printStackTrace()
                callback.invoke(ReactCallBack.failed(e.message).toGson())
            }
        }
    }

    @ReactMethod
    fun exportPrivateKey(jsonParams: String, callback: Callback) {
        val signData = GsonUtils.fromJson(jsonParams, ConnectSignData::class.java)
        val connectAdapter = getPrivateKeyAdapter()
        if (connectAdapter == null) {
            callback.invoke(
                ReactCallBack.failed(
                    ReactErrorMessage.parseConnectError(
                        ConnectError.Unauthorized()
                    )
                ).toGson()
            )
            return
        }
        BridgeScope.launch {
            try {
                val pk = connectAdapter.exportWalletPrivateKey(
                    signData.publicAddress
                )
                callback.invoke(ReactCallBack.success(pk).toGson())

            } catch (e: Exception) {
                e.printStackTrace()
                callback.invoke(ReactCallBack.failed(e.message).toGson())
            }
        }
    }

    @ReactMethod
    fun signInWithEthereum(jsonParams: String, callback: Callback) {
        LogUtils.d("login", jsonParams)
        val signData = GsonUtils.fromJson(jsonParams, ConnectSignData::class.java)
        val connectAdapter = getConnectAdapter(signData.publicAddress, signData.walletType)
        if (connectAdapter == null) {
            callback.invoke(
                ReactCallBack.failed(
                    ReactErrorMessage.parseConnectError(
                        ConnectError.Unauthorized()
                    )
                ).toGson()
            )
            return
        }
        val message = Eip4361Message.createWithRequiredParameter(
            signData.domain, signData.uri, signData.publicAddress
        )

        connectAdapter.login(signData.publicAddress, message, object : SignCallback {

            override fun onError(error: ConnectError) {
                LogUtils.d("onError", error.toString())
                callback.invoke(
                    ReactCallBack.failed(ReactErrorMessage.parseConnectError(error)).toGson()
                )
            }

            override fun onSigned(signature: String) {
                LogUtils.d("onSigned", signature)
                val map = mapOf("signature" to signature, "message" to message.toString())
                callback.invoke(ReactCallBack.success(map).toGson())
            }
        })
    }

    @ReactMethod
    fun verify(jsonParams: String, callback: Callback) {
        LogUtils.d("verify", jsonParams)
        val signData = GsonUtils.fromJson(jsonParams, ConnectSignData::class.java)
        val connectAdapter = getConnectAdapter(signData.publicAddress, signData.walletType)
        if (connectAdapter == null) {
            callback.invoke(
                ReactCallBack.failed(
                    ReactErrorMessage.parseConnectError(
                        ConnectError.Unauthorized()
                    )
                ).toGson()
            )
            return
        }
        if (connectAdapter.verify(
                signData.publicAddress, signData.signature, signData.message
            )
        ) {
            callback.invoke(ReactCallBack.success(true).toGson())
        } else {
            callback.invoke(ReactCallBack.failed(false).toGson())
        }
    }

    @ReactMethod
    fun addEthereumChain(jsonParams: String, callback: Callback) {

    }

    @ReactMethod
    fun switchEthereumChain(jsonParams: String, callback: Callback) {

    }


    //get adapter
    private fun getConnectAdapter(publicAddress: String, walletType: String): IConnectAdapter? {
        try {
            val allAdapters = ParticleConnect.getAdapters().filter {
                it.name.equals(walletType, true)
            }
            val adapters = allAdapters.filter {
                val accounts = it.getAccounts()
                accounts.any { account -> account.publicAddress.equals(publicAddress, true) }
            }
            var connectAdapter: IConnectAdapter? = null
            if (adapters.isNotEmpty()) {
                connectAdapter = adapters[0]
            }
            return connectAdapter
        } catch (e: Exception) {
            return null
        }

    }

    private fun getPrivateKeyAdapter(): ILocalAdapter? {
        val allAdapters = ParticleConnect.getAdapters()
        if (ParticleNetwork.isEvmChain()) {
            for (adapter in allAdapters) {
                if (adapter is EVMConnectAdapter) {
                    return adapter as ILocalAdapter
                }
            }
        } else {
            for (adapter in allAdapters) {
                if (adapter is SolanaConnectAdapter) {
                    return adapter as ILocalAdapter
                }
            }
        }
        return null
    }


    private fun initAdapter(rpcUrl: RpcUrl?): List<IConnectAdapter> {
        val adapters = mutableListOf<IConnectAdapter>(
            ParticleConnectAdapter(),
            MetaMaskConnectAdapter(),
            RainbowConnectAdapter(),
            TrustConnectAdapter(),
            ImTokenConnectAdapter(),
            BitGetConnectAdapter(),
            WalletConnectAdapter(),
            PhantomConnectAdapter(),
        )
        if (rpcUrl != null) {
            adapters.add(EVMConnectAdapter(rpcUrl.evmUrl))
        } else {
            adapters.add(EVMConnectAdapter())
        }

        if (rpcUrl != null) {
            adapters.add(SolanaConnectAdapter(rpcUrl.solUrl))
        } else {
            adapters.add(SolanaConnectAdapter())
        }
        try {
            adapters.add(AuthCoreAdapter())
        } catch (_: Exception) {

        }
        return adapters;
    }

    @ReactMethod
    fun batchSendTransactions(transactions: String, result: Callback) {
        LogUtils.d("batchSendTransactions", transactions)
        val transParams =
            GsonUtils.fromJson<ConnectSignData>(transactions, ConnectSignData::class.java)
        val connectAdapter = getConnectAdapter(transParams.publicAddress, transParams.walletType)
        if (connectAdapter == null) {
            result.invoke(
                ReactCallBack.failed(
                    ReactErrorMessage.parseConnectError(
                        ConnectError.Unauthorized()
                    )
                ).toGson()
            )
            return
        }

        var feeMode: FeeMode = FeeModeNative()
        if (transParams.feeMode != null) {
            when (transParams.feeMode.option) {
                "token" -> {
                    val tokenPaymasterAddress = transParams.feeMode.tokenPaymasterAddress
                    val feeQuote = transParams.feeMode.feeQuote!!
                    feeMode = FeeModeToken(feeQuote, tokenPaymasterAddress!!)
                }

                "gasless" -> {
                    val verifyingPaymasterGasless =
                        transParams.feeMode.wholeFeeQuote.verifyingPaymasterGasless
                    feeMode = FeeModeGasless(verifyingPaymasterGasless)
                }

                "native" -> {
                    val verifyingPaymasterNative =
                        transParams.feeMode.wholeFeeQuote.verifyingPaymasterNative
                    feeMode = FeeModeNative(verifyingPaymasterNative)
                }
            }
        }
        CoroutineScope(Dispatchers.IO).launch {
            try {
                ParticleNetwork.getAAService()
                    .quickSendTransaction(
                        transParams.transactions,
                        feeMode,
                        object : MessageSigner {
                            override fun signMessage(
                                message: String,
                                callback: WebServiceCallback<SignOutput>,
                                chainId: Long?
                            ) {
                                connectAdapter.signMessage(
                                    transParams.publicAddress,
                                    message,
                                    object : SignCallback {
                                        override fun onError(error: ConnectError) {
                                            callback.failure(
                                                ErrorInfo(
                                                    error.message,
                                                    error.code
                                                )
                                            )
                                        }

                                        override fun onSigned(signature: String) {
                                            callback.success(SignOutput(signature))
                                        }

                                    })

                            }

                            override fun eoaAddress(): String {
                                return connectAdapter.getAccounts()[0].publicAddress
                            }

                        },
                        object : WebServiceCallback<SignOutput> {
                            override fun success(output: SignOutput) {
                                result.invoke(ReactCallBack.success(output.signature!!).toGson())
                            }

                            override fun failure(errMsg: ErrorInfo) {
                                result.invoke(ReactCallBack.failed(errMsg).toGson())
                            }
                        })
            } catch (e: Exception) {
                e.printStackTrace()
                result.invoke((ReactCallBack.failed(ErrorInfo("failed", 100000))).toGson())
            }
        }
    }

    override fun getName(): String {
        return "ParticleConnectPlugin"
    }

}

