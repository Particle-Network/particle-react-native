package com.particleaa.model

import com.google.gson.annotations.SerializedName

class RpcUrl {
    @SerializedName("evm_url")
    var evmUrl: String? = null

    @SerializedName("sol_url")
    var solUrl: String? = null
}
