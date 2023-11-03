package com.particleaa.model

import com.google.gson.annotations.SerializedName

class InitData {
    @SerializedName("chain_name")
    var chainName: String? = null

    @SerializedName("chain_id")
    var chainId:Long = 0


    @SerializedName("env")
    var env: String? = null
}
