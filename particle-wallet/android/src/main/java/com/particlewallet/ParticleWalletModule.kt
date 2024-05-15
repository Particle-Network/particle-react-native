package com.particlewallet

import android.content.Intent
import android.util.Log
import com.blankj.utilcode.util.GsonUtils
import com.blankj.utilcode.util.LogUtils
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.reflect.TypeToken
import com.particle.base.ParticleNetwork
import com.particle.gui.ParticleWallet
import com.particle.gui.router.PNRouter
import com.particle.gui.router.RouterPath
import com.particle.gui.ui.nft_detail.NftDetailParams
import com.particle.gui.ui.receive.ReceiveData
import com.particle.gui.ui.send.WalletSendParams
import com.particle.gui.ui.token_detail.TokenTransactionRecordsParams
import com.particle.gui.utils.WalletUtils
import com.particlewallet.model.InitData
import com.particlewallet.ui.PNLoginOptActivity
import com.particlewallet.utils.BridgeScope
import com.particlewallet.utils.ChainUtils
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.math.BigInteger
import com.particle.api.service.DBService
import com.particle.base.LanguageEnum
import com.particle.gui.ParticleWallet.displayNFTContractAddresses
import com.particle.gui.ui.swap.SwapConfig
import network.particle.chains.ChainInfo
import android.os.Handler
import android.os.Looper
import android.text.TextUtils
import com.particle.api.infrastructure.db.table.WalletInfo
import com.particle.base.model.MobileWCWalletName
import com.particle.connect.ParticleConnect
import com.particle.gui.ParticleWallet.priorityNFTContractAddresses
import com.particle.gui.ParticleWallet.priorityTokenAddresses
import com.particle.network.ParticleNetworkAuth.getAddress
import particle.auth.adapter.ParticleConnectAdapter

class ParticleWalletPlugin(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
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


  }

  @ReactMethod
  fun createSelectedWallet(publicAddress: String, walletType: String, walletName: String?) {
    val adapter = ParticleConnect.getAdapters().first { it.name.equals(walletType, true) }
    if (!TextUtils.isEmpty(walletName) && adapter is ParticleConnectAdapter) {
      BridgeScope.launch {
        val wallet = WalletInfo.createWallet(
          ParticleNetwork.getAddress(),
          ParticleNetwork.chainInfo.name,
          ParticleNetwork.chainInfo.id,
          1,
          walletName!!,
          MobileWCWalletName.Particle.name
        )
        ParticleWallet.setWallet(wallet)
      }
    } else {
      BridgeScope.launch {
        val wallet = WalletUtils.createSelectedWallet(publicAddress, adapter)
        WalletUtils.setWalletChain(wallet)
      }
    }
  }

  private val mainHandler = Handler(Looper.getMainLooper())

  @ReactMethod
  fun init() {
    isUIInit = try {
      mainHandler.post {
        ParticleWallet.init(reactApplicationContext, null)
      }
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
      DBService.walletInfoDao.deleteWallet(publicAddress)
    }
  }

  @ReactMethod
  fun getPayDisabled(callback: Callback) {
    callback.invoke(ParticleWallet.getPayDisabled())
  }

  @ReactMethod
  fun setPayDisabled(enable: Boolean) {
    ParticleWallet.setPayDisabled(enable)
  }

  @ReactMethod
  fun setSwapDisabled(disabled: Boolean) {
    ParticleWallet.setSwapDisabled(disabled)
  }

  @ReactMethod
  fun getSwapDisabled(callback: Callback) {
    callback.invoke(ParticleWallet.getSwapDisabled())
  }

  @ReactMethod
  fun navigatorPay() {
    currentActivity?.apply {
      ParticleNetwork.openBuy(this)
    }
  }

  /**
   *  const obj = { from_token_address: fromTokenAddress, to_token_address: toTokenAddress, amount: amount }
   *   const json = JSON.stringify(obj);
   */
  @ReactMethod
  fun navigatorSwap(jsonParams: String) {
    //unsupported jsonParams
    try {
      val jobj = JSONObject(jsonParams)
      val swapConfig =
        SwapConfig(jobj.optString("from_token_address"), jobj.optString("to_token_address"), "0")
      PNRouter.navigatorSwap(swapConfig);
    } catch (e: Exception) {
      e.printStackTrace()
      PNRouter.navigatorSwap(null);
    }

  }

  @ReactMethod
  fun setShowTestNetwork(show: Boolean) {
    ParticleWallet.setShowTestNetworkSetting(show)
  }

  @ReactMethod
  fun setShowManageWallet(show: Boolean) {
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

  @ReactMethod
  fun navigatorWalletConnect(callback: Callback) {
    loginOptCallback = callback
    currentActivity?.startActivity(
      PNLoginOptActivity.newIntent(
        currentActivity!!,
        true
      )
    )
  }

  /**
   * GUI
   */
  @ReactMethod
  fun setSupportChain(jsonParams: String) {
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

  @ReactMethod
  fun setSupportWalletConnect(isEnable: Boolean) {
    ParticleWallet.setSupportWalletConnect(isEnable)
  }

  @ReactMethod
  fun navigatorBuyCrypto(jsonParams: String?) {
    LogUtils.d("navigatorBuyCrypto", jsonParams)
    LogUtils.d("navigatorBuyCrypto", jsonParams)
    if (!isUIModuleInit()) return;
    val jsonObject = JSONObject(jsonParams)
    val walletAddress = jsonObject.optString("wallet_address")
    val chainName = jsonObject.optString("network")
    val cryptoCoin = jsonObject.optString("crypto_coin")
    val fiatCoin = jsonObject.optString("fiat_coin")
    val fiatAmt = jsonObject.optInt("fiat_amt")
    val fixCryptoCoin = jsonObject.optBoolean("fix_crypto_coin")
    val fixFiatAmt = jsonObject.optBoolean("fix_fiat_amt")
    val fixFiatCoin = jsonObject.optBoolean("fix_fiat_coin")
    val theme = jsonObject.optString("theme")
    val language = jsonObject.optString("language")
    currentActivity?.apply {
      ParticleNetwork.openBuy(
        this,
        walletAddress = walletAddress,
        amount = fiatAmt,
        fiatCoin = fiatCoin,
        cryptoCoin = cryptoCoin,
        fixFiatCoin = fixFiatCoin,
        fixFiatAmt = fixFiatAmt,
        fixCryptoCoin = fixCryptoCoin,
        theme = theme,
        language = language,
        chainName = chainName
      )
    }

  }

  @ReactMethod
  fun setDisplayTokenAddresses(tokenAddressJson: String) {
    val tokenAddresses = GsonUtils.fromJson<List<String>>(
      tokenAddressJson, object : TypeToken<List<String>>() {}.type
    )
    ParticleWallet.displayTokenAddresses(tokenAddresses as MutableList<String>)
  }

  @ReactMethod
  fun setDisplayNFTContractAddresses(nftContractAddresses: String) {
    val nftContractAddressList = GsonUtils.fromJson<List<String>>(
      nftContractAddresses, object : TypeToken<List<String>>() {}.type
    )
    ParticleNetwork.displayNFTContractAddresses(nftContractAddressList as MutableList<String>)
  }

  @ReactMethod
  fun setPriorityTokenAddresses(addresses: String) {
    ParticleNetwork.priorityTokenAddresses(GsonUtils.fromJson<List<String>>(
      addresses, object : TypeToken<List<String>>() {}.type
    ) as MutableList<String>)
  }

  @ReactMethod
  fun setPriorityNFTContractAddresses(addresses: String) {
    ParticleNetwork.priorityNFTContractAddresses(GsonUtils.fromJson<List<String>>(
      addresses, object : TypeToken<List<String>>() {}.type
    ) as MutableList<String>)
  }


  @ReactMethod
  fun setShowLanguageSetting(isShow: Boolean) {
    ParticleWallet.setShowLanguageSetting(isShow)
  }

  @ReactMethod
  fun setShowAppearanceSetting(isShow: Boolean) {
    ParticleWallet.setShowAppearanceSetting(isShow)
  }

  @ReactMethod
  fun setSupportAddToken(isShow: Boolean) {
    ParticleWallet.setSupportAddToken(isShow)
  }

  @ReactMethod
  fun setSupportDappBrowser(isShow: Boolean) {
    ParticleWallet.setSupportDappBrowser(isShow)
  }
  @ReactMethod
  fun setCustomWalletIcon(icon: String) {
    ParticleWallet.setWalletIcon(icon)
  }


  override fun getName(): String {
    return "ParticleWalletPlugin"
  }

}
