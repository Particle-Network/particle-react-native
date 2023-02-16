package com.particlewallet.ui;

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.RelativeLayout
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.blankj.utilcode.util.LogUtils
import com.connect.common.ConnectCallback
import com.connect.common.model.Account
import com.connect.common.model.ChainType
import com.connect.common.model.ConnectError
import com.particle.api.infrastructure.db.table.Wallet
import com.particle.api.infrastructure.db.table.WalletType
import com.particle.base.ParticleNetwork
import com.particle.connect.ParticleConnect
import com.particle.connect.ParticleConnectConfig
import com.particle.gui.ui.login.LoginOptFragment
import com.particle.gui.ui.login.LoginTypeCallBack
import com.particle.gui.ui.setting.manage_wallet.dialog.WalletConnectQRFragment
import com.particle.gui.ui.setting.manage_wallet.private_login.PrivateKeyLoginActivity
import com.particle.gui.utils.Constants
import com.particle.gui.utils.WalletUtils
import com.particle.network.ParticleNetworkAuth.getAddress
import com.particle.network.service.LoginType
import com.particle.network.service.SupportAuthType
import com.particlewallet.R
import com.particlewallet.model.ReactCallBack
import com.wallet.connect.adapter.WalletConnectAdapter
import com.wallet.connect.adapter.model.MobileWCWallet
import kotlinx.coroutines.launch
import network.particle.flutter.bridge.module.BridgeGUI

class RNLoginOptActivity : AppCompatActivity() {
    lateinit var launcherResult: ActivityResultLauncher<Intent>
    var loginFragment: LoginOptFragment? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_rn_login_opt)
        setObserver()
        findViewById<RelativeLayout>(R.id.rlMain).setOnClickListener {
            finish()
        }
        loginFragment = LoginOptFragment.show(supportFragmentManager, true)
        loginFragment?.setCallBack(object : LoginTypeCallBack {
            override fun onLoginType(loginType: LoginType) {
                loginWithPn(loginType, SupportAuthType.ALL)
            }

            override fun onLoginConnect(walletType: WalletType) {
                when (walletType) {
                    WalletType.CONNET_METAMASK -> {
                        connectEvmWallet(MobileWCWallet.MetaMask)
                    }
                    WalletType.CONNET_RAINBOW -> {
                        connectEvmWallet(MobileWCWallet.Rainbow)
                    }
                    WalletType.CONNET_TRUST -> {
                        connectEvmWallet(MobileWCWallet.Trust)
                    }
                    WalletType.CONNET_IMTOKEN -> {
                        connectEvmWallet(MobileWCWallet.ImToken)
                    }
                    WalletType.CONNET_BITKEEP -> {
                        connectEvmWallet(MobileWCWallet.BitKeep)
                    }
                    WalletType.CONNET_WALLET -> {
                        walletConnect()
                    }
                    WalletType.CONNET_PHANTOM -> {
                        connectPhantom()
                    }
                    WalletType.SOL_IMPORT -> {
                        val intent = PrivateKeyLoginActivity.newIntent(this@RNLoginOptActivity)
                        launcherResult.launch(intent)
                    }
                    WalletType.ETH_IMPORT -> {
                        val intent = PrivateKeyLoginActivity.newIntent(this@RNLoginOptActivity)
                        launcherResult.launch(intent)
                    }
                    else -> {

                    }
                }
            }
        })
    }

    private fun loginWithPn(
        loginType: LoginType,
        supportAuthType: SupportAuthType
    ) {

        val adapter =
            ParticleConnect.getAdapters(if (ParticleNetwork.isEvmChain()) ChainType.EVM else ChainType.Solana)
                .first { it.name == "Particle" }
        val config = ParticleConnectConfig(loginType, supportAuthType.value)
        adapter.connect(config, object : ConnectCallback {
            override fun onConnected(account: Account) {
                lifecycleScope.launch {
                    val wallet = Wallet.createPnWallet(
                        ParticleNetwork.getAddress(),
                        ParticleNetwork.chainInfo.chainName.toString(),
                        ParticleNetwork.chainInfo.chainId.toString(),
                        1,
                    )
                    WalletUtils.setWalletChain(wallet)
                    val map = mutableMapOf<String, Any>()
                    map["account"] = account
                    map["walletType"] = "Particle"
                    BridgeGUI.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
                    loginFragment?.hide()
                }
            }

            override fun onError(error: ConnectError) {
                BridgeGUI.loginOptCallback?.invoke(ReactCallBack.failed(error.message).toGson())
            }
        })
    }

    private fun connectEvmWallet(mobileWallet: MobileWCWallet) {
        val adapter = ParticleConnect.getAdapters(ChainType.EVM)
            .first { it.name == mobileWallet.name }
        adapter.connect(null, object : ConnectCallback {
            override fun onConnected(account: Account) {
                lifecycleScope.launch {
                    val wallet = WalletUtils.createSelectedWallet(account.publicAddress, adapter)
                    WalletUtils.setWalletChain(wallet)
                    val map = mutableMapOf<String, Any>()
                    map["account"] = account
                    map["walletType"] = mobileWallet.name
                    BridgeGUI.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
                    loginFragment?.hide()
                }
            }

            override fun onError(error: ConnectError) {
                BridgeGUI.loginOptCallback?.invoke(ReactCallBack.failed(error.message).toGson())
            }
        })
    }

    var qrFragment: WalletConnectQRFragment? = null
    private fun walletConnect() {
        val adapter = ParticleConnect.getAdapters(ChainType.EVM)
            .first { it.name == "WalletConnect" } as WalletConnectAdapter
        adapter.connect(null, object : ConnectCallback {
            override fun onConnected(account: Account) {
                qrFragment?.hide()
                lifecycleScope.launch {
                    val wallet =
                        WalletUtils.createSelectedWallet(account.publicAddress, adapter)
                    WalletUtils.setWalletChain(wallet)
                    val map = mutableMapOf<String, Any>()
                    map["account"] = account
                    map["walletType"] = "WalletConnect"
                    BridgeGUI.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
                    loginFragment?.hide()
                }
            }

            override fun onError(error: ConnectError) {
                LogUtils.d("MetaMask error: $error")
                qrFragment?.hide()
                BridgeGUI.loginOptCallback?.invoke(ReactCallBack.failed(error.message).toGson())
            }
        })
        val qrUrl = adapter.qrCodeUri()
        qrFragment = WalletConnectQRFragment.show(supportFragmentManager, qrUrl!!)
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
                    BridgeGUI.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
                    loginFragment?.hide()
                }
            }

            override fun onError(error: ConnectError) {
                BridgeGUI.loginOptCallback?.invoke(ReactCallBack.failed(error.message).toGson())
            }
        })
    }

    private fun setObserver() {
        launcherResult =
            registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { activityResult ->
                if (activityResult.resultCode == Activity.RESULT_OK) {
                    try {
                        loginFragment?.hide()
                        val wallet: Wallet =
                            activityResult.data!!.getParcelableExtra<Wallet>(Constants.PRIVATE_KEY_LOGIN_CHAIN_WALLET)!!
                        val map = mutableMapOf<String, Any>()
                        if (wallet.type == WalletType.ETH_IMPORT) {
                            map["account"] = Account(wallet.address, wallet.name)
                            map["walletType"] = "EthereumPrivateKey"
                        } else {
                            map["account"] = Account(wallet.address, wallet.name)
                            map["walletType"] = "SolanaPrivateKey"
                        }
                        BridgeGUI.loginOptCallback?.invoke(ReactCallBack.success(map).toGson())
                    } catch (e: Exception) {
                        e.printStackTrace()
                        BridgeGUI.loginOptCallback?.invoke(ReactCallBack.failed("Failed").toGson())
                    }
                }
            }
    }
}
