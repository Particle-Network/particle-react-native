

package com.particlebase.model;

import com.google.gson.annotations.SerializedName;


public class InitData {

  @SerializedName("chain_name")
  public String chainName;

  @SerializedName("chain_id")
  public long chainId;


  @SerializedName("env")
  public String env;

}
