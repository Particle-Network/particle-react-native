package com.particlewallet.ui

import android.content.DialogInterface
import android.graphics.Bitmap
import android.os.Bundle
import androidx.annotation.Keep
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.lifecycleScope
import com.google.zxing.BarcodeFormat
import com.particle.base.ParticleNetwork
import com.particlewallet.R
import com.particlewallet.databinding.RnFragmentWalletConnectQrBinding
import com.particlewallet.utils.RNBarcodeEncode
import com.particlewallet.utils.RNQrParams
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext


@Keep
 class RNWalletConnectQRFragment :
  RNBaseBottomSheetDialogFragment<RnFragmentWalletConnectQrBinding>(R.layout.rn_fragment_wallet_connect_qr) {

  @Keep
  companion object {
    val DATA_KEY = "data_key"
    fun show(fm: FragmentManager, qrStr: String): RNWalletConnectQRFragment {
      val qr = RNWalletConnectQRFragment()
      val bundle = Bundle()
      bundle.putString(DATA_KEY, qrStr)
      qr.arguments = bundle
      qr.show(fm, RNWalletConnectQRFragment::javaClass.name)
      return qr
    }
  }

  override fun initView() {
    super.initView()
    val qrStr = arguments?.getString(DATA_KEY)!!
    generateQrCode(qrStr)
  }

  override fun setListeners() {
    super.setListeners()
  }

  private fun generateQrCode(str: String) {
    lifecycleScope.launch {
      try {
        val qr = rnGenerateQrCode(str)
        binding.ivQr.setImageBitmap(qr)
      } catch (e: Throwable) {
        e.printStackTrace()
      }
    }
  }
  suspend fun rnGenerateQrCode(address: String): Bitmap = withContext(Dispatchers.Default) {
    RNBarcodeEncode.encodeBitmap(
      address,
      BarcodeFormat.QR_CODE,
      900,
      900,
      RNQrParams(
        ContextCompat.getColor(ParticleNetwork.context, com.particle.gui.R.color.pn_black),
        ContextCompat.getColor(ParticleNetwork.context, network.particle.theme.R.color.pn_white)
      )
    )
  }
  fun hide() {
    dismissAllowingStateLoss()
  }

  override fun onDismiss(dialog: DialogInterface) {
    super.onDismiss(dialog)
    requireActivity().finish()
  }
}
