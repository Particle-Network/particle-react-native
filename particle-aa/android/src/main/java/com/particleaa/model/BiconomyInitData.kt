package com.particleaa.model

import androidx.annotation.Keep
import com.google.gson.annotations.SerializedName

@Keep
data class BiconomyInitData(

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

