
import { AbiEncodeFunction, EVMReqBodyMethod } from "./NetParams";
import JsonRpcRequest from "./NetService";
import BigNumber from 'bignumber.js';
import { Buffer } from 'buffer';
import * as ParticleConnect from 'react-native-particle-connect';

export class EvmService {
    static async rpc(method: string, params: any) {
        const rpcUrl = "https://api.particle.network/";
        const path = "evm-chain/rpc";
        const chainInfo = await ParticleConnect.getChainInfo();
        const chainId = chainInfo.chain_id;
        const result = await JsonRpcRequest(rpcUrl, path, method, params, chainId);
        return result;
    }

    static async getPrice(addresses: [string], currencies: [string]) {
        return await this.rpc(EVMReqBodyMethod.particleGetPrice, [addresses, currencies]);
    }

    static async getTokensAndNFTs(address: string) {
        return await this.rpc(EVMReqBodyMethod.particleGetTokensAndNFTs, [address]);
    }

    static async getTransactionsByAddress(address: string) {
        return await this.rpc(EVMReqBodyMethod.particleGetTransactionsByAddress, [address]);
    }

    static async suggeseGasFee() {
        return await this.rpc(EVMReqBodyMethod.particleSuggestedGasFees, []);
    }

    static async estimateGas(from: string, to: string, value: string, data: string) {
        const obj = { from: from, to: to, value: value, data: data };
        return await this.rpc(EVMReqBodyMethod.ethEstimateGas, [obj]);
    }

    static async erc20Transfer(contractAddress: string, to: string, amount: string) {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, AbiEncodeFunction.erc20Transfer, [to, amount]]);
    }

    static async erc20Approve(contractAddress: string, spender: string, amount: string) {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, AbiEncodeFunction.erc20Approve, [spender, amount]]);
    }

    static async erc20TransferFrom(contractAddress: string, from: string, to: string, amount: string) {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, AbiEncodeFunction.erc20TransferFrom, [from, to, amount]]);
    }

    static async erc721SafeTransferFrom(contractAddress: string, from: string, to: string, tokenId: string) {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, AbiEncodeFunction.erc721SafeTransferFrom, [from, to, tokenId]]);
    }

    static async erc1155SafeTransferFrom(contractAddress: string, from: string, to: string, id: string, amount: string, data: Uint8Array) {
        const params =  [from, to, id, amount, data].filter(function( element ) {
            return element !== undefined;
         });
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, AbiEncodeFunction.erc1155SafeTransferFrom, params]);
    }

    static async abiEncodeFunctionCall(contractAddress: string, methodName: string, params: string, abiJsonString: string) {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, methodName, params, abiJsonString]);
    }

    static async getTokenByTokenAddress(address: string, tokenAddresses: string) {
        return await this.rpc(EVMReqBodyMethod.particleGetTokensByTokenAddresses, [address, tokenAddresses]);
    }

    static async readContract(contractAddress: string, methodName: string, params: string, abiJsonString: string) {
        const data = await this.abiEncodeFunctionCall(contractAddress, methodName, params, abiJsonString);
        const callParams = { data: data, to: contractAddress };
        const result = this.rpc("eth_call", [callParams, "latest"]);
        return result;
    }

    static async writeContract(from: string, contractAddress: string, methodName: string, params: string, abiJsonString: string) {
        const data = await this.abiEncodeFunctionCall(contractAddress, methodName, params, abiJsonString);

        const gasLimit = await this.estimateGas(from, contractAddress, "0x0", data);
        const gasFeesResult = await this.suggeseGasFee();

        const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
        const maxFeePerGasHex = "0x" + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

        const maxPriorityFeePerGas = gasFeesResult.high.maxPriorityFeePerGas;
        const maxPriorityFeePerGasHex = "0x" + BigNumber(maxPriorityFeePerGas * Math.pow(10, 9)).toString(16);
        const chainInfo = await ParticleConnect.getChainInfo();
        const chainId = chainInfo.chain_id;

        const transaction = { from: from, to: contractAddress, data: data, gasLimit: gasLimit, value: "0x0", type: "0x2", chainId: "0x" + chainId.toString(16), maxPriorityFeePerGas: maxPriorityFeePerGasHex, maxFeePerGas: maxFeePerGasHex }

        console.log(transaction);
        const json = JSON.stringify(transaction);
        const serialized = Buffer.from(json).toString('hex');
        return "0x" + serialized;
    }




}