package network.particle.flutter.bridge.module

import android.app.Activity
import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.connect.common.*
import com.connect.common.eip4361.Eip4361Message
import com.connect.common.model.Account
import com.connect.common.model.ConnectError
import com.connect.common.model.DAppMetadata
import com.evm.adapter.EVMConnectAdapter
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.particle.base.ChainInfo
import com.particle.base.Env
import com.particle.base.ParticleNetwork
import com.particle.connect.ParticleConnect
import com.particle.connect.ParticleConnect.setChain
import com.particle.connect.ParticleConnectAdapter
import com.particle.connect.model.AdapterAccount
import com.particlewallet.model.*
import com.particlewallet.utils.BridgeScope
import com.particlewallet.utils.ChainUtils
import com.particlewallet.utils.EncodeUtils
import com.phantom.adapter.PhantomConnectAdapter
import com.solana.adapter.SolanaConnectAdapter
import com.wallet.connect.adapter.*
import kotlinx.coroutines.launch
import org.json.JSONException
import org.json.JSONObject

class BridgeConnect(reactContext: ReactApplicationContext) :
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
        val chainInfo: ChainInfo = ChainUtils.getChainInfo(initData.chainName, initData.chainIdName)
        val (name, icon, url) = initData.metadata
        val rpcUrl: RpcUrl? = initData.rpcUrl
        val dAppMetadata = DAppMetadata(
            name, icon, url
        )
        val adapter: MutableList<IConnectAdapter> = ArrayList()
        initAdapter(adapter, rpcUrl)
        ParticleConnect.init(
            reactApplicationContext, Env.valueOf(initData.env.uppercase()), chainInfo, dAppMetadata
        ) { adapter }
    }

    @ReactMethod
    fun setChainInfo(chainParams: String, callback: Callback) {
        LogUtils.d("setChainInfo", chainParams)
        val chainData: ChainData = GsonUtils.fromJson(
            chainParams, ChainData::class.java
        )
        try {
            val chainInfo = ChainUtils.getChainInfo(
                chainData.chainName, chainData.chainIdName
            )
            setChain(chainInfo)
            callback.invoke(true)
        } catch (e: java.lang.Exception) {
            LogUtils.e("setChainName", e.message)
            callback.invoke(false)
        }
    }

    @ReactMethod
    fun connect(walletType: String, callback: Callback) {
        LogUtils.d("connect", walletType)
        var connectAdapter: IConnectAdapter? = null
        val adapters = ParticleConnect.getAdapters()
        for (adapter in adapters) {
            if (adapter.name.equals(walletType, ignoreCase = true)) {
                connectAdapter = adapter
                break
            }
        }
        val finalConnectAdapter = connectAdapter
        connectAdapter!!.connect<ConnectConfig>(null, object : ConnectCallback {
            override fun onConnected(account: Account) {
                BridgeGUI.createSelectedWallet(account.publicAddress, finalConnectAdapter!!)
                LogUtils.d("onConnected", account.toString())
                callback.invoke(ReactCallBack.success(account).toGson())
            }

            override fun onError(connectError: ConnectError) {
                LogUtils.d("onError", connectError.toString())
                callback.invoke(ReactCallBack.failed(connectError.message).toGson())
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
            var isConnect = false
            if (connectAdapter != null) {
                isConnect = connectAdapter.connected(publicKey)
            }
            LogUtils.d("isConnect", isConnect)
            callback.invoke(isConnect)
        } catch (e: Exception) {
            e.printStackTrace()
            callback.invoke(false)
        }
    }

    @ReactMethod
    fun getAccounts(walletType: String, promise: Promise) {
        LogUtils.d("getAccounts", walletType)
        val adapterAccounts: List<AdapterAccount> = ParticleConnect.getAccounts()
        var accounts: List<Account> = ArrayList()
        for (adapterAccount in adapterAccounts) {
            if (adapterAccount.connectAdapter.name.equals(walletType)) {
                accounts = adapterAccount.accounts
                break
            }
        }
        return promise.resolve(ReactCallBack.success(accounts).toGson())
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
                        ReactCallBack.failed(ReactErrorMessage.parseConnectError(error))
                            .toGson()
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
        val message = if (connectAdapter is ParticleConnectAdapter) {
            EncodeUtils.encode(signData.message)
        } else {
            signData.message
        }
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
        connectAdapter.signAndSendTransaction(signData.publicAddress,
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

    @ReactMethod
    fun signTransaction(jsonParams: String, callback: Callback) {
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
        connectAdapter.signTransaction(signData.publicAddress, transaction, object : SignCallback {

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
        connectAdapter.signAllTransactions(signData.publicAddress,
            signData.transactions.toTypedArray(),
            object : SignAllCallback {

                override fun onError(error: ConnectError) {
                    LogUtils.d("onError", error.toString())
                    callback.invoke(
                        ReactCallBack.failed(ReactErrorMessage.parseConnectError(error))
                            .toGson()
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
        val typedData = if (connectAdapter is ParticleConnectAdapter) {
            EncodeUtils.encode(signData.message)
        } else {
            signData.message
        }
        connectAdapter.signTypedData(signData.publicAddress,
            typedData,
            object : SignCallback {
                override fun onError(error: ConnectError) {
                    LogUtils.d("onError", error.toString())
                    callback.invoke(
                        ReactCallBack.failed(ReactErrorMessage.parseConnectError(error))
                            .toGson()
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
    fun login(jsonParams: String, callback: Callback) {
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
            signData.domain,
            signData.uri,
            signData.publicAddress
        )

        connectAdapter.login(signData.publicAddress, message, object : SignCallback {

            override fun onError(error: ConnectError) {
                LogUtils.d("onError", error.toString())
                callback.invoke(
                    ReactCallBack.failed(ReactErrorMessage.parseConnectError(error))
                        .toGson()
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
                signData.publicAddress,
                signData.signature,
                signData.message
            )
        ) {
            callback.invoke(ReactCallBack.success("success").toGson())
        } else {
            callback.invoke(ReactCallBack.failed("failed").toGson())
        }
    }

    //get adapter
    private fun getConnectAdapter(publicAddress: String, walletType: String): IConnectAdapter? {
        val adapters = ParticleConnect.getAdapterByAddress(publicAddress)
        var connectAdapter: IConnectAdapter? = null
        if (adapters.isNotEmpty()) {
            connectAdapter = adapters[0]
        }
        return connectAdapter
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


    private fun initAdapter(adapter: MutableList<IConnectAdapter>, rpcUrl: RpcUrl?) {
        try {
            adapter.add(ParticleConnectAdapter())
        } catch (ignored: Exception) {
        }
        try {
            adapter.add(MetaMaskConnectAdapter())
        } catch (ignored: Exception) {
        }
        try {
            adapter.add(RainbowConnectAdapter())
        } catch (ignored: Exception) {
        }
        try {
            adapter.add(TrustConnectAdapter())
        } catch (ignored: Exception) {
        }
        try {
            adapter.add(PhantomConnectAdapter())
        } catch (ignored: Exception) {
        }
        try {
            adapter.add(WalletConnectAdapter())
        } catch (ignored: Exception) {
        }
        try {
            adapter.add(ImTokenConnectAdapter())
        } catch (ignored: Exception) {
        }
        try {
            adapter.add(BitKeepConnectAdapter())
        } catch (ignored: Exception) {
        }
        try {
            if (rpcUrl != null) {
                adapter.add(EVMConnectAdapter(rpcUrl.evmUrl))
            } else {
                adapter.add(EVMConnectAdapter())
            }
        } catch (ignored: Exception) {
        }
        try {
            if (rpcUrl != null) {
                adapter.add(SolanaConnectAdapter(rpcUrl.solUrl))
            } else {
                adapter.add(SolanaConnectAdapter())
            }
        } catch (ignored: Exception) {
        }
    }

    override fun getName(): String {
        return "BridgeConnect"
    }
}
