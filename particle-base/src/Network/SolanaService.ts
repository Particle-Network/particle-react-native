import { getChainId } from '../index';
import { SerializeTransactionParams, SolanaReqBodyMethod } from './NetParams';
import JsonRpcRequest from './NetService';

export class SolanaService {
    static async rpc(method: string, params: any): Promise<any> {
        const rpcUrl = 'https://rpc.particle.network/';
        const path = 'solana';
        const chainId = await getChainId();
        const result = await JsonRpcRequest(rpcUrl, path, method, params, chainId);
        return result;
    }

    static async getPrice(addresses: [string], currencies: [string]): Promise<any> {
        return await this.rpc(SolanaReqBodyMethod.enhancedGetPrice, [addresses, currencies]);
    }

    static async getTokensAndNFTs(address: string): Promise<any> {
        return await this.rpc(SolanaReqBodyMethod.enhancedGetTokensAndNFTs, [address]);
    }
    static async getTransactionsByAddress(address: string): Promise<any> {
        const obj = { parseMetadataUri: true };
        return await this.rpc(SolanaReqBodyMethod.enhancedGetTransactionsByAddress, [address, obj]);
    }

    static async getTokenTransactionsByAddress(address: string, mintAddress: string): Promise<any> {
        const obj = { address: address, mint: mintAddress };
        return await this.rpc(SolanaReqBodyMethod.enhancedGetTokenTransactionsByAddress, [obj]);
    }

    static async serializeSolTransction(from: string, to: string, amount: number): Promise<any> {
        const obj = { sender: from, receiver: to, lamports: amount };
        return await this.rpc(SolanaReqBodyMethod.enhancedSerializeTransaction, [
            SerializeTransactionParams.transferSol,
            obj,
        ]);
    }

    static async serializeSplTokenTransction(from: string, to: string, mint: string, amount: number): Promise<any> {
        const obj = { sender: from, receiver: to, mint: mint, amount: amount };
        return await this.rpc(SolanaReqBodyMethod.enhancedSerializeTransaction, [
            SerializeTransactionParams.transferToken,
            obj,
        ]);
    }

    static async serializeUnwrapWSolTransction(address: string): Promise<any> {
        const obj = { address: address };
        return await this.rpc(SolanaReqBodyMethod.enhancedSerializeTransaction, [
            SerializeTransactionParams.unwrapSol,
            obj,
        ]);
    }
}
