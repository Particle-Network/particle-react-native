package com.particlewallet.model;

import com.google.gson.annotations.SerializedName;

public class ChainData {

    @SerializedName("chain_name")
    public String chainName;

    @SerializedName("chain_id")
    public long chainId;

    @SerializedName("chain_id_name")
    public String chainIdName;

}
