package com.particleconnect.model

import androidx.annotation.Keep
import com.particle.base.model.Erc4337FeeQuote

@Keep
data class BiconomyFeeMode(val option: String, val feeQuote: Erc4337FeeQuote)
