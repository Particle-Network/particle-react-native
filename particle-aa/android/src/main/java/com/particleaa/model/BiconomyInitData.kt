package com.particleaa.model

import androidx.annotation.Keep
import com.google.gson.annotations.SerializedName

@Keep
data class BiconomyInitData(
  @SerializedName("biconomy_app_keys")
  val dAppKeys: Map<Long, String> = emptyMap(),
  @SerializedName("name")
  val name: String,
  @SerializedName("version")
  val version: String
)

@Keep
data class FeeQuotesParams(
  @SerializedName("eoa_address")
  val eoaAddress: String,
  val transactions: List<String>
)

