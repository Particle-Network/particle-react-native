package com.particlewallet.utils

import network.particle.chains.ChainInfo

internal object ChainUtils {
  fun getChainInfo(chainId: Long): ChainInfo {
    return getChainInfoByChainId(chainId)
  }

  fun getChainInfoByChainId(chainId: Long): ChainInfo {
    return ChainInfo.getEvmChain(chainId) ?: ChainInfo.getSolanaChain(chainId)
    ?: ChainInfo.getEvmChain(1)!!
  }
}
