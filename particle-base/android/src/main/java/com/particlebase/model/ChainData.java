package com.particlebase.model;

import androidx.annotation.Keep;

import com.google.gson.annotations.SerializedName;

@Keep
public class ChainData {

    @SerializedName("chain_id")
    public long chainId;

}
