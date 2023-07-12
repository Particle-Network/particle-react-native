package com.particleconnect.utils;

import com.particle.base.ParticleNetwork
import com.particle.base.utils.Base58Utils

object EncodeUtils {
    fun encode(message: String): String {
        return if (ParticleNetwork.isEvmChain()) {
            HexUtils.encodeWithPrefix(message.toByteArray(Charsets.UTF_8))
        } else {
            Base58Utils.encode(message.toByteArray(Charsets.UTF_8))
        }
    }
}
