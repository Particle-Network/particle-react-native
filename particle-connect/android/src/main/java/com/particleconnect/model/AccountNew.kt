package com.particleconnect.model

import androidx.annotation.Keep

@Keep
data class AccountNew(val publicAddress: String, val walletType: String? = null)