package com.particleaa.model

import com.google.gson.Gson
import com.google.gson.annotations.SerializedName

class ReactCallBack<T>(status: FlutterCallBackStatus, t: T) {
    enum class FlutterCallBackStatus {
        Failed, Success
    }

    @SerializedName("status")
    var status: Int

    @SerializedName("data")
    var t: T

    init {
        this.status = status.ordinal
        this.t = t
    }

    fun toGson(): String {
        return Gson().toJson(this)
    }

    companion object {
        fun successStr(): ReactCallBack<*> {
            return ReactCallBack<Any?>(FlutterCallBackStatus.Success, "success")
        }

        fun <T> success(t: T): ReactCallBack<*> {
            return ReactCallBack<Any?>(FlutterCallBackStatus.Success, t)
        }

        fun failedStr(): ReactCallBack<*> {
            return ReactCallBack<Any?>(FlutterCallBackStatus.Failed, "failed")
        }

        fun <T> failed(t: T): ReactCallBack<*> {
            return ReactCallBack<Any?>(FlutterCallBackStatus.Failed, t)
        }
    }
}
