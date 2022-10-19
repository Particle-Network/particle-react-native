import * as particleAuth from 'react-native-particle-auth';
import { SerializeTransactionParams, SolanaReqBodyMethod } from "./NetParams";
import JsonRpcRequest from "./NetService";

export class SolanaService {
    static async rpc(method: string, params: any) {
        const rpcUrl = "https://api.particle.network/";
        const path = "solana/rpc";
        const chainInfo = await particleAuth.getChainInfo();
        const chainId = chainInfo.chain_id; 
        const result = await JsonRpcRequest(rpcUrl, path, method, params, chainId);
        return result;
    }

    static async getPrice(addresses:[string], currencies: [string]) {
        return await this.rpc(SolanaReqBodyMethod.enhancedGetPrice, [addresses, currencies]);
    }

    static async getTokensAndNFTs(address: string) {
        return await this.rpc(SolanaReqBodyMethod.enhancedGetTokensAndNFTs, [address]);
    }
    static async getTransactionsByAddress(address: string) {
    const obj = {parseMetadataUri: true};
        return await this.rpc(SolanaReqBodyMethod.enhancedGetTransactionsByAddress, [address, obj]);

    }

    static async getTokenTransactionsByAddress(address: string, mintAddress: string) {
        const obj = {address: address, mint: mintAddress};
        return await this.rpc(SolanaReqBodyMethod.enhancedGetTokenTransactionsByAddress, [obj]);
    }

    static async serializeSolTransction(from: string, to: string, amount: string) {
        const obj = {sender: from, receiver: to, lamports: amount};
        return await this.rpc(SolanaReqBodyMethod.enhancedSerializeTransaction, [SerializeTransactionParams.transferSol, obj]);
    }

    static async serializeSplTokenTransction(from: string, to: string, mint: string, amount: string) {
        const obj = {sender: from, receiver: to, mint: mint, amount: amount};
        return await this.rpc(SolanaReqBodyMethod.enhancedSerializeTransaction, [SerializeTransactionParams.transferToken, obj]);
    }

}