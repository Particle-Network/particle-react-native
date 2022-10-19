export const EVMReqBodyMethod = {
    particleSuggestedGasFees: "particle_suggestedGasFees",
    particleGetPrice: "particle_getPrice",
    particleGetTokensAndNFTs: "particle_getTokensAndNFTs",
    particleDeserializeTransaction: "particle_deserializeTransaction",
    particleGetTransactionsByAddress: "particle_getTransactionsByAddress",
    particleAbiEncodeFunctionCall: "particle_abi_encodeFunctionCall",
    ethEstimateGas: "eth_estimateGas",
    particleGetTokensByTokenAddresses: "particle_getTokensByTokenAddresses",
}

export const AbiEncodeFunction = {
    erc20Transfer: "erc20_transfer",
    erc20Approve: "erc20_approve",
    erc20TransferFrom: "erc20_transferFrom",
    erc721SafeTransferFrom: "erc721_safeTransferFrom",
    erc1155SafeTransferFrom: "erc1155_safeTransferFrom",
}

export const SolanaReqBodyMethod = {
    enhancedGetTokensAndNFTs: "enhancedGetTokensAndNFTs",
    enhancedGetPrice: "enhancedGetPrice",
    enhancedGetTransactionsByAddress: "enhancedGetTransactionsByAddress",
    enhancedGetTokenTransactionsByAddress: "enhancedGetTokenTransactionsByAddress",
    enhancedSerializeTransaction: "enhancedSerializeTransaction",
    enhancedGetTokensByTokenAddresses: "enhancedGetTokensByTokenAddresses",
}

export const SerializeTransactionParams = {
    transferSol: "transfer-sol",
    transferToken: "transfer-token",
}

