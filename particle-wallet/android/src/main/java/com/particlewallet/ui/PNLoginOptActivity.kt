package com.particlewallet.ui;

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.text.TextUtils
import android.widget.RelativeLayout
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import network.blankj.utilcode.util.LogUtils
import com.connect.common.ConnectCallback
import com.connect.common.model.Account
import com.connect.common.model.ConnectError
import com.evm.adapter.EVMConnectAdapter
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.particle.api.infrastructure.db.table.WalletInfo
import com.particle.base.ParticleNetwork
import com.particle.base.model.ChainType
import com.particle.base.model.LoginType
import com.particle.base.model.MobileWCWalletName
import com.particle.base.model.SupportAuthType
import com.particle.connect.ParticleConnect
import com.particle.gui.ui.login.LoginOptFragment
import com.particle.gui.ui.login.LoginTypeCallBack
import com.particle.gui.ui.setting.manage_wallet.dialog.WalletConnectQRFragment
import com.particle.gui.ui.setting.manage_wallet.private_login.PrivateKeyLoginActivity
import com.particle.gui.utils.Constants
import com.particle.gui.utils.WalletUtils
import com.particle.network.ParticleNetworkAuth.getAddress
import com.particlewallet.ParticleWalletPlugin
import com.particlewallet.R
import com.particlewallet.model.ReactCallBack
import com.phantom.adapter.PhantomConnectAdapter
import com.solana.adapter.SolanaConnectAdapter
import com.wallet.connect.adapter.WalletConnectAdapter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch
import particle.auth.adapter.ParticleConnectConfig

class PNLoginOptActivity : AppCompatActivity() {
  companion object {
    fun newIntent(activity: Activity, walletConnect: Boolean): Intent {
      return Intent(activity, PNLoginOptActivity::class.java).apply {
        putExtra("walletConnect", walletConnect)
      }
    }
  }

  lateinit var launcherResult: ActivityResultLauncher<Intent>
  var loginFragment: LoginOptFragment? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    val walletConnect = intent.getBooleanExtra("walletConnect", false)
    setContentView(R.layout.activity_rn_login_opt)
    setObserver()
    findViewById<RelativeLayout>(R.id.rlMain).setOnClickListener {
      finish()
    }
    if (walletConnect) {
      ParticleConnect.getAdapters().firstOrNull { it is WalletConnectAdapter }?.let {
        walletConnect(it as WalletConnectAdapter)
        return
      }
    }
    loginFragment = LoginOptFragment.show(supportFragmentManager, true)
    loginFragment?.setCallBack(object : LoginTypeCallBack {
      override fun onLoginType(loginType: LoginType) {
        loginWithPn(loginType, SupportAuthType.ALL)
      }

      override fun onLoginConnect(walletName: String) {
        val adapter = ParticleConnect.getAdapters().first { it.name.equals(walletName, true) }
        if (adapter is EVMConnectAdapter) {
          val intent = PrivateKeyLoginActivity.newIntent(this@PNLoginOptActivity)
          launcherResult.launch(intent)
        } else if (adapter is SolanaConnectAdapter) {
          val intent = PrivateKeyLoginActivity.newIntent(this@PNLoginOptActivity)
          launcherResult.launch(intent)
        } else if (adapter is WalletConnectAdapter) {
          walletConnect(adapter)
        } else if (adapter is PhantomConnectAdapter) {
          connectPhantom(adapter)
        } else {
          adapter.connect(null, object : ConnectCallback {
            override fun onConnected(account: Account) {
              lifecycleScope.launch {
                val wallet = WalletUtils.createSelectedWallet(account.publicAddress, adapter)
                WalletUtils.setWalletChain(wallet)
                val map = mutableMapOf<String, Any>()
                map["account"] = account
                map["walletType"] = adapter.name
                ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
                loginFragment?.dismissAllowingStateLoss()
              }
            }

            override fun onError(error: ConnectError) {
              ParticleWalletPlugin.loginOptCallback?.invoke(
                ReactCallBack.failed(error.message).toGson()
              )
            }
          })
        }
      }
    })
  }


  private fun loginWithPn(
    loginType: LoginType,
    supportAuthType: SupportAuthType
  ) {

    val adapter =
      ParticleConnect.getAdapters().first { it.name.equals(MobileWCWalletName.Particle.name, true) }
    val config = ParticleConnectConfig(loginType, supportAuthType.value)
    adapter.connect(config, object : ConnectCallback {
      override fun onConnected(account: Account) {
        lifecycleScope.launch {
          val wallet = WalletInfo.createPnWallet(
            ParticleNetwork.getAddress(),
            ParticleNetwork.chainInfo.name,
            ParticleNetwork.chainInfo.id,
            1,
          )
          WalletUtils.setWalletChain(wallet)
          val map = mutableMapOf<String, Any>()
          map["account"] = account
          map["walletType"] = "Particle"
          ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
          loginFragment?.dismissAllowingStateLoss()
        }
      }

      override fun onError(error: ConnectError) {
        ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.failed(error.message).toGson())

      }
    })
  }

  private fun connectEvmWallet() {
//    val adapter = ParticleConnect.getAdapters(ChainType.EVM)
//      .first { it.name == mobileWallet.name }
//    adapter.connect(null, object : ConnectCallback {
//      override fun onConnected(account: Account) {
//        lifecycleScope.launch {
//          val wallet = WalletUtils.createSelectedWallet(account.publicAddress, adapter)
//          WalletUtils.setWalletChain(wallet)
//          val map = mutableMapOf<String, Any>()
//          map["account"] = account
//          map["walletType"] = mobileWallet.name
//          ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
//          loginFragment?.hide()
//        }
//      }
//
//      override fun onError(error: ConnectError) {
//        ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.failed(error.message).toGson())
//      }
//    })
  }

  var qrFragment: RNWalletConnectQRFragment? = null
  var job: Job? = null
  private fun walletConnect(adapter: WalletConnectAdapter) {
    adapter.connect(null, object : ConnectCallback {
      override fun onConnected(account: Account) {
        qrFragment?.dismissAllowingStateLoss()
        lifecycleScope.launch {
          try {
            val wallet =
              WalletUtils.createSelectedWallet(account.publicAddress, adapter)
            WalletUtils.setWalletChain(wallet)
            val map = mutableMapOf<String, Any>()
            map["account"] = account
            map["walletType"] = "WalletConnect"
            ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
            loginFragment?.dismissAllowingStateLoss()
            finish()
          }catch (_:Exception){

          }

        }
      }

      override fun onError(error: ConnectError) {
        try {
          LogUtils.d("MetaMask error: $error")
          qrFragment?.dismissAllowingStateLoss()
          ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.failed(error.message).toGson())
          finish()
        }catch (_:Exception){

        }

      }
    })
    job = adapter.qrUriModel.onEach {

      if (!TextUtils.isEmpty(it)) job?.cancel()
      val qrUrl = adapter.qrCodeUri()
      try {
        qrFragment = RNWalletConnectQRFragment.show(supportFragmentManager, qrUrl!!)
      }catch (_:Exception){
      }
    }.launchIn(CoroutineScope(Dispatchers.Main))
  }

  private fun connectPhantom() {
    val adapter =
      ParticleConnect.getAdapters(ChainType.Solana).first { it.name == "Phantom" }
    adapter.connect(null, object : ConnectCallback {
      override fun onConnected(account: Account) {
        lifecycleScope.launch {
          val wallet = WalletUtils.createSelectedWallet(account.publicAddress, adapter)
          WalletUtils.setWalletChain(wallet)
          val map = mutableMapOf<String, Any>()
          map["account"] = account
          map["walletType"] = "Phantom"
          ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
          loginFragment?.hide()
        }
      }

      override fun onError(error: ConnectError) {
        ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.failed(error.message).toGson())
      }
    })
  }

  private fun connectPhantom(adapter: PhantomConnectAdapter) {
    adapter.connect(null, object : ConnectCallback {
      override fun onConnected(account: Account) {
        lifecycleScope.launch {
          val wallet = WalletUtils.createSelectedWallet(account.publicAddress, adapter)
          WalletUtils.setWalletChain(wallet)
          val map = mutableMapOf<String, Any>()
          map["account"] = account
          map["walletType"] = "Phantom"
          ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
          loginFragment?.hide()
        }
      }

      override fun onError(error: ConnectError) {
        ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.failed(error.message).toGson())
      }
    })
  }

  private fun setObserver() {
    launcherResult =
      registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { activityResult ->
        if (activityResult.resultCode == Activity.RESULT_OK) {
          try {
            loginFragment?.dismissAllowingStateLoss()
            val wallet: WalletInfo =
              activityResult.data!!.getParcelableExtra<WalletInfo>(Constants.PRIVATE_KEY_LOGIN_CHAIN_WALLET)!!
            val map = mutableMapOf<String, Any>()
            if (wallet.name == MobileWCWalletName.EVMConnect.name) {
              map["account"] = Account(wallet.address, wallet.name)
              map["walletType"] = "EthereumPrivateKey"
            } else {
              map["account"] = Account(wallet.address, wallet.name)
              map["walletType"] = "SolanaPrivateKey"
            }
            ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
          } catch (e: Exception) {
            e.printStackTrace()
            ParticleWalletPlugin.loginOptCallback?.invoke(ReactCallBack.failed("Failed").toGson())
          }
        }
      }
  }
}
