package network.particle.flutter.bridge.module

import android.content.Intent
import android.util.Log
import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.connect.common.IConnectAdapter
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.reflect.TypeToken
import com.particle.api.service.DBService
import com.particle.base.ParticleNetwork
import com.particle.base.model.MobileWCWalletName
import com.particle.gui.ParticleWallet
import com.particle.gui.ParticleWallet.getEnablePay
import com.particle.gui.ParticleWallet.getEnableSwap
import com.particle.gui.ParticleWallet.navigatorBuy
import com.particle.gui.ParticleWallet.setPayDisabled
import com.particle.gui.ParticleWallet.setSwapDisabled
import com.particle.gui.router.PNRouter
import com.particle.gui.router.RouterPath
import com.particle.gui.ui.nft_detail.NftDetailParams
import com.particle.gui.ui.receive.ReceiveData
import com.particle.gui.ui.send.WalletSendParams
import com.particle.gui.ui.swap.SwapConfig
import com.particle.gui.ui.token_detail.TokenTransactionRecordsParams
import com.particle.gui.utils.WalletUtils
import com.particle.network.ParticleNetworkAuth.getAddress
import com.particlewallet.model.InitData
import com.particlewallet.ui.PNLoginOptActivity
import com.particlewallet.utils.BridgeScope
import com.particlewallet.utils.ChainUtils
import kotlinx.coroutines.launch
import network.particle.chains.ChainInfo
import org.json.JSONObject
import java.math.BigInteger

class BridgeGUI(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  companion object {
    var loginOptCallback: Callback? = null
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
        val wallet = WalletUtils.createSelectedWallet(address, MobileWCWalletName.Particle.name)
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
    LogUtils.d("navigatorTokenSend", json);
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
      DBService.walletInfoDao.deleteWallet(publicAddress)
    }
  }

  @ReactMethod
  fun getEnablePay(callback: Callback) {
    callback.invoke(ParticleNetwork.getEnablePay())
  }

  @ReactMethod
  fun enablePay(enable: Boolean) {
    LogUtils.d("enablePay", enable.toString());
    ParticleNetwork.setPayDisabled(!enable)
  }

  @ReactMethod
  fun enableSwap(enable: Boolean) {
    LogUtils.d("enableSwap", enable.toString());
    ParticleNetwork.setSwapDisabled(!enable)
  }

  @ReactMethod
  fun getEnableSwap(callback: Callback) {
    callback.invoke(ParticleNetwork.getEnableSwap())
  }

  @ReactMethod
  fun navigatorPay() {
    currentActivity?.let {
      ParticleNetwork.navigatorBuy(it)
    }
  }

  /**
   *  const obj = { from_token_address: fromTokenAddress, to_token_address: toTokenAddress, amount: amount }
   *   const json = JSON.stringify(obj);
   */
  @ReactMethod
  fun navigatorSwap(jsonParams: String) {
    try {
      val jobj = JSONObject(jsonParams)
      val fromTokenAddress = jobj.optString("from_token_address")
      val toTokenAddress = jobj.optString("to_token_address")
      val config = SwapConfig(
        fromTokenAddress,
        toTokenAddress
      )
      PNRouter.navigatorSwap(config);
    } catch (e: Exception) {
      e.printStackTrace()
      PNRouter.navigatorSwap(null);
    }

  }

  @ReactMethod
  fun showTestNetwork(show: Boolean) {
    LogUtils.d("showTestNetwork", show);
    ParticleWallet.setShowTestNetworkSetting(show)
  }

  @ReactMethod
  fun showManageWallet(show: Boolean) {
    LogUtils.d("showManageWallet", show);
    ParticleWallet.setShowManageWalletSetting(show)
  }

  @ReactMethod
  fun navigatorLoginList(callback: Callback) {
    loginOptCallback = callback
    currentActivity?.startActivity(
      Intent(
        currentActivity,
        PNLoginOptActivity::class.java
      )
    )
  }

  /**
   * GUI
   */
  @ReactMethod
  fun supportChain(jsonParams: String) {
    LogUtils.d("setSupportChain", jsonParams);
    if (!isUIModuleInit()) return;
    val chains = GsonUtils.fromJson<List<InitData>>(
      jsonParams, object : TypeToken<List<InitData>>() {}.type
    )
    val supportChains: MutableList<ChainInfo> = java.util.ArrayList()
    for (chain in chains) {
      val chainInfo: ChainInfo = ChainUtils.getChainInfo(chain.chainId)
      supportChains.add(chainInfo)
    }
    ParticleWallet.setSupportChain(supportChains)
  }

  @ReactMethod
  fun switchWallet(jsonParams: String, callback: Callback) {
    LogUtils.d("switchWallet", jsonParams);
    if (!isUIModuleInit()) return
    try {
      val jsonObject = JSONObject(jsonParams);
      val walletType = jsonObject.getString("wallet_type");
      val publicKey = jsonObject.getString("public_address");
      BridgeScope.launch {
        WalletUtils.createSelectedWallet(publicKey, walletType)
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
