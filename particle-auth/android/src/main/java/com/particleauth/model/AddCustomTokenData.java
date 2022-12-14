package com.particleauth.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class AddCustomTokenData {

    @SerializedName("address")
    public String address;

    @SerializedName("token_addresses")
    public List<String> tokenAddress;

}
