
package network.particle.flutter.bridge.module

import android.content.Intent
import android.util.Log
import com.connect.common.IConnectAdapter
import com.connect.common.utils.GsonUtils
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.particle.base.ChainInfo
import com.particle.base.ParticleNetwork
import com.particle.gui.ParticleWallet
import com.particle.gui.ParticleWallet.enablePay
import com.particle.gui.ParticleWallet.enableSwap
import com.particle.gui.ParticleWallet.getEnablePay
import com.particle.gui.ParticleWallet.getEnableSwap
import com.particle.gui.ParticleWallet.openBuy
import com.particle.gui.router.PNRouter
import com.particle.gui.router.RouterPath
import com.particle.gui.ui.nft_detail.NftDetailParams
import com.particle.gui.ui.receive.ReceiveData
import com.particle.gui.ui.send.WalletSendParams
import com.particle.gui.ui.token_detail.TokenTransactionRecordsParams
import com.particle.gui.utils.WalletUtils
import com.particle.network.ParticleNetworkAuth.getAddress
import com.particlewallet.model.InitData
import com.particlewallet.ui.RNLoginOptActivity
import com.particlewallet.utils.BridgeScope
import com.particlewallet.utils.ChainUtils
import com.particlewallet.utils.WalletTypeParser
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.math.BigInteger
import com.particle.api.infrastructure.db.table.WalletType

class ParticleWalletPlugin(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        var loginOptCallback:Callback?=null
        var isUIInit = false

        fun isUIModuleInit(): Boolean {
            return if (isUIInit) {
                true
            } else {
                Log.e("UIBridge", "UI module is not init!!!")
                false
            }
        }

        fun setPNWallet() {
            if (!isUIModuleInit()) return;
          BridgeScope.launch {
                val address = ParticleNetwork.getAddress()
                val wallet = WalletUtils.createSelectedWallet(address, WalletType.PN_WALLET)
                WalletUtils.setWalletChain(wallet)
            }
        }


        fun createSelectedWallet(publicAddress: String, adapter: IConnectAdapter) {
            BridgeScope.launch {
                val wallet = WalletUtils.createSelectedWallet(publicAddress, adapter)
              WalletUtils.setWalletChain(wallet)
            }
        }
    }

    @ReactMethod
    fun init() {
        isUIInit = try {
            ParticleWallet.init(reactApplicationContext, null)
            true
        } catch (e: Exception) {
            false
        }
    }

    /**
     * navigatorWallet
     */
    @ReactMethod
    fun navigatorWallet(display: Int) {
        if (!isUIModuleInit()) return;
        PNRouter.build(RouterPath.Wallet).withInt(RouterPath.Wallet.toString(), display)
            .navigation();
    }

    @ReactMethod
    fun navigatorTokenReceive(tokenAddress: String) {
        if (!isUIModuleInit()) return;
        try {
            val receiveData = ReceiveData(tokenAddress);
            PNRouter.build(RouterPath.TokenReceive)
                .withParcelable(RouterPath.TokenReceive.toString(), receiveData).navigation();
        } catch (e: Exception) {
            e.printStackTrace();
        }
    }

    /**
     * {
     * token_address: "0x0000000000000000000000000000000000000000",
     * to_address:"0x0000000000000000000000000000000000000000",
     * amount: 111,
     * }
     */
    @ReactMethod
    fun navigatorTokenSend(json: String) {
        if (!isUIModuleInit()) return;
//        LogUtils.d("navigatorTokenSend", json);
        try {
            val jsonObject = JSONObject(json);
            val tokenAddress = jsonObject.getString("token_address");
            val toAddress = jsonObject.getString("to_address");
            val amount = jsonObject.getLong("amount");
            val params = WalletSendParams(
                tokenAddress, toAddress, BigInteger.valueOf(amount)
            );
            PNRouter.build(RouterPath.TokenSend, params).navigation();
        } catch (e: Exception) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    fun navigatorTokenTransactionRecords(tokenAddress: String) {
        if (!isUIModuleInit()) return;
        try {
            val params = TokenTransactionRecordsParams(tokenAddress);
            PNRouter.build(RouterPath.TokenTransactionRecords, params).navigation();
        } catch (e: Exception) {
            e.printStackTrace();
        }
    }

    /**
     * {
     * "mint":"0x0000000000000000000000000000000000000000",
     * "receiver_address":"0x0000000000000000000000000000000000000000",
     * }
     */
    @ReactMethod
    fun navigatorNFTSend(json: String) {
        if (!isUIModuleInit()) return;
        try {
            val jsonObject = JSONObject(json);
            val mint = jsonObject.getString("mint");
            val receiverAddress = jsonObject.getString("receiver_address");
            val params = NftDetailParams(mint, receiverAddress);
            PNRouter.build(RouterPath.NftDetails, params).navigation();
        } catch (e: Exception) {
            e.printStackTrace();
        }

    }

    @ReactMethod
    fun navigatorNFTDetails(mint: String) {
        if (!isUIModuleInit()) return;
        try {
            val params = NftDetailParams(mint, null);
            PNRouter.build(RouterPath.NftDetails, params).navigation();
        } catch (e: Exception) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    fun logoutWallet(publicAddress: String) {
        if (!isUIModuleInit()) return;
        BridgeScope.launch {
            DBService.walletDao.deleteWallet(publicAddress)
        }
    }

    @ReactMethod
    fun getEnablePay(callback: Callback) {
        callback.invoke(ParticleNetwork.getEnablePay())
    }

    @ReactMethod
    fun enablePay(enable: Boolean) {
//        LogUtils.d("enablePay", enable.toString());
        ParticleNetwork.enablePay(enable)
    }

    @ReactMethod
    fun enableSwap(enable: Boolean) {
//        LogUtils.d("enableSwap", enable.toString());
        ParticleNetwork.enableSwap(enable)
    }

    @ReactMethod
    fun getEnableSwap(callback: Callback) {
        callback.invoke(ParticleNetwork.getEnableSwap())
    }

    @ReactMethod
    fun navigatorPay() {
        ParticleNetwork.openBuy()
    }

    /**
     *  const obj = { from_token_address: fromTokenAddress, to_token_address: toTokenAddress, amount: amount }
     *   const json = JSON.stringify(obj);
     */
    @ReactMethod
    fun navigatorSwap(jsonParams: String) {
        //unsupported jsonParams
        PNRouter.navigatorSwap("native");
    }

    @ReactMethod
    fun showTestNetwork(show: Boolean) {
//        LogUtils.d("showTestNetwork", show);
        ParticleWallet.showTestNetworks(show)
    }

    @ReactMethod
    fun showManageWallet(show: Boolean) {
//        LogUtils.d("showManageWallet", show);
        ParticleWallet.showManageWallet(show)
    }

    @ReactMethod
    fun navigatorLoginList(callback: Callback) {
        loginOptCallback = callback
        currentActivity?.startActivity(
            Intent(
                currentActivity,
                RNLoginOptActivity::class.java
            )
        )
    }

    /**
     * GUI
     */
    @ReactMethod
    fun supportChain(jsonParams: String) {
//        LogUtils.d("setSupportChain", jsonParams);
        if (!isUIModuleInit()) return;
        val chains = GsonUtils.fromJson<List<InitData>>(

            jsonParams, object : TypeToken<List<InitData>>() {}.type
        )
        val supportChains: MutableList<ChainInfo> = java.util.ArrayList()
        for (chain in chains) {
            val chainInfo: ChainInfo = ChainUtils.getChainInfo(chain.chainName, chain.chainIdName)
            supportChains.add(chainInfo)
        }
        ParticleWallet.setSupportChain(supportChains)
    }

    @ReactMethod
    fun switchWallet(jsonParams: String, callback: Callback) {
//        LogUtils.d("switchWallet", jsonParams);
        if (!isUIModuleInit()) return
        try {
            val jsonObject = JSONObject(jsonParams);
            val walletType = jsonObject.getString("wallet_type");
            val publicKey = jsonObject.getString("public_address");
            val type = WalletTypeParser.getWalletType(walletType);
            val adapter = WalletUtils.getConnectAdapter(type)
            BridgeScope.launch {
                WalletUtils.createSelectedWallet(publicKey, adapter!!)
                callback.invoke(true)
            }
        } catch (e: Exception) {
            callback.invoke(false)
        }

    }

    override fun getName(): String {
        return "BridgeGUI"
    }

}
