package com.particleauth.model;

import com.google.gson.annotations.SerializedName;
import java.util.List;


public class LoginData {

    @SerializedName("login_type")
    public String loginType;

    public String account;

    @SerializedName("support_auth_type_values")
    public List<String> supportAuthTypeValues;

    @SerializedName("login_form_mode")
    public boolean loginFormMode;
}
