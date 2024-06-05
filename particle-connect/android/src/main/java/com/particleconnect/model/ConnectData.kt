package com.particleconnect.model

import androidx.annotation.Keep
import com.google.gson.annotations.SerializedName
import com.particle.base.model.LoginAuthorization
import com.particle.base.model.LoginPageConfig
import com.particle.base.model.LoginPrompt

@Keep
data class ConnectDataAuthCore(
    @SerializedName("loginType") val loginType: String,
    @SerializedName("account") val account: String?,
    @SerializedName("supportAuthTypeValues") val supportLoginTypes: List<String>? = null,
    @SerializedName("loginPageConfig") val loginPageConfig: LoginPageConfig? = null,
    @SerializedName("socialLoginPrompt") val prompt: LoginPrompt? = null
)


@Keep
data class ParticleConnectData(
    @SerializedName("loginType") var loginType: String,
    @SerializedName("account") var account: String? = "",
    @SerializedName("code") var code: String? = "",
    @SerializedName("supportAuthTypeValues") var supportAuthTypeValues: List<String> = emptyList<String>(),
    @SerializedName("loginPageConfig") val loginPageConfig: LoginPageConfig? = null,
    @SerializedName("socialLoginPrompt") val prompt: String? = null,
    @SerializedName("authorization") var authorization: LoginAuthorization? = null
)

