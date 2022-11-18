package com.particleconnect.utils;

import com.connect.common.utils.Base58Utils
import com.particle.base.ParticleNetwork

object EncodeUtils {
    fun encode(message: String): String {
        return if (ParticleNetwork.isEvmChain()) {
            HexUtils.encodeWithPrefix(message.toByteArray(Charsets.UTF_8))
        } else {
            Base58Utils.encode(message.toByteArray(Charsets.UTF_8))
        }
    }
}
