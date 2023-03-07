
import { AbiEncodeFunction, EVMReqBodyMethod } from "./NetParams";
import JsonRpcRequest from "./NetService";
import BigNumber from 'bignumber.js';
import { Buffer } from 'buffer';
import { ChainInfo } from "react-native-particle-connect";

export class EvmService {
    /// current chain info
    static currentChainInfo: ChainInfo = ChainInfo.EthereumGoerli;

    /**
     * Support evm standard rpc methpd
     * @param method Method name, like "eth_getBalance", "eth_call"
     * @param params Parameters requested by method
     * @returns Json string
     */
    static async rpc(method: string, params: any) {
        const rpcUrl = "https://rpc.particle.network/";
        const path = "evm-chain";
        const chainId = EvmService.currentChainInfo.chain_id;
        const result = await JsonRpcRequest(rpcUrl, path, method, params, chainId);
        return result;
    }

    /**
     * Get token price 
     * @param addresses Token address array
     * @param currencies Currencies array, like ["usd", "cny"]
     * @returns Json string
     */
    static async getPrice(addresses: [string], currencies: [string]) {
        return await this.rpc(EVMReqBodyMethod.particleGetPrice, [addresses, currencies]);
    }

    /**
     * Get tokens and nfts
     * @param address Public address
     * @returns Json string, contains native amount, tokens, nfts 
     */
    static async getTokensAndNFTs(address: string) {
        return await this.rpc(EVMReqBodyMethod.particleGetTokensAndNFTs, [address]);
    }

    /**
     * Get tokens 
     * @param address Public address
     * @returns Json string, contains native amount, tokens
     */
    static async getTokens(address: string) {
        return await this.rpc(EVMReqBodyMethod.particleGetTokens, [address]);
    }

    /**
     * Get NFTs 
     * @param address Public address
     * @returns Json string, contains NFTs
     */
    static async getNFTs(address: string) {
        return await this.rpc(EVMReqBodyMethod.particleGetNFTs, [address]);
    }

    /**
     * Get public address transactions
     * @param address Public address
     * @returns Json string
     */
    static async getTransactionsByAddress(address: string) {
        return await this.rpc(EVMReqBodyMethod.particleGetTransactionsByAddress, [address]);
    }

    /**
     * Get suggest gas fee
     * @returns Json string, contains base fee, high, medium, low fee.
     */
    static async suggeseGasFee() {
        return await this.rpc(EVMReqBodyMethod.particleSuggestedGasFees, []);
    }

    /**
     * Estimate gas price
     * @param from From public address
     * @param to To public address, if send native token, `to` is receiver address, if send erc20 token, erc721 NFT, erc1155 NFT or write contract, `to` is contract address.
     * @param value Native value
     * @param data Data
     * @returns 
     */
    static async estimateGas(from: string, to: string, value: string, data: string) {
        const obj = { from: from, to: to, value: value, data: data };
        return await this.rpc(EVMReqBodyMethod.ethEstimateGas, [obj]);
    }

    /**
     * Get the `data` field in Transacion
     * @param contractAddress Contract address
     * @param to Recevier address
     * @param amount Token amount
     * @returns The `data` field in Transacion
     */
    static async erc20Transfer(contractAddress: string, to: string, amount: string) {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, AbiEncodeFunction.erc20Transfer, [to, amount]]);
    }

    /**
     * Get the `data` field in Transacion
     * @param contractAddress Contract address
     * @param spender Spender address
     * @param amount Token amount
     * @returns The `data` field in Transacion
     */
    static async erc20Approve(contractAddress: string, spender: string, amount: string) {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, AbiEncodeFunction.erc20Approve, [spender, amount]]);
    }

    /**
     * Get the `data` field in Transacion
     * @param contractAddress Contract address
     * @param from From address
     * @param to To address
     * @param amount Token amount
     * @returns The `data` field in Transacion
     */
    static async erc20TransferFrom(contractAddress: string, from: string, to: string, amount: string) {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, AbiEncodeFunction.erc20TransferFrom, [from, to, amount]]);
    }

    /**
     * Get the `data` field in Transacion
     * @param contractAddress Contract address
     * @param from From address
     * @param to To address
     * @param tokenId Token id
     * @returns The `data` field in Transacion
     */
    static async erc721SafeTransferFrom(contractAddress: string, from: string, to: string, tokenId: string) {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, AbiEncodeFunction.erc721SafeTransferFrom, [from, to, tokenId]]);
    }

    /**
     * Get the `data` field in Transacion
     * @param contractAddress Contract address
     * @param from From address
     * @param to To address
     * @param id Token id
     * @param amount Token amount
     * @param data Data, 
     * @returns The `data` field in Transacion
     */
    static async erc1155SafeTransferFrom(contractAddress: string, from: string, to: string, id: string, amount: string, data: Uint8Array) {
        const params =  [from, to, id, amount, data].filter(function( element ) {
            return element !== undefined;
         });
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, AbiEncodeFunction.erc1155SafeTransferFrom, params]);
    }

    /**
     * Get the `data` field in Transacion
     * @param contractAddress Contract address
     * @param methodName Method name, like `mint`, `balanceOf` or other methods that are defined in your contract
     * @param params Parameters request by method
     * @param abiJsonString ABI json string
     * @returns The `data` field in Transacion
     */
    static async abiEncodeFunctionCall(contractAddress: string, methodName: string, params: string, abiJsonString: string) {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [contractAddress, `custom_${methodName}`, params, abiJsonString]);
    }

    /**
     * Get token by token address
     * @param address Public address
     * @param tokenAddresses Token address array
     * @returns Json string, tokens
     */
    static async getTokenByTokenAddress(address: string, tokenAddresses: string) {
        return await this.rpc(EVMReqBodyMethod.particleGetTokensByTokenAddresses, [address, tokenAddresses]);
    }

    /**
     * Read contract
     * @param contractAddress Contract address
     * @param methodName Method name, like `mint`, `balanceOf` or other methods that are defined in your contract
     * @param params Parameters request by method
     * @param abiJsonString ABI json string
     * @returns Json string
     */
    static async readContract(contractAddress: string, methodName: string, params: string, abiJsonString: string) {
        const data = await this.abiEncodeFunctionCall(contractAddress, methodName, params, abiJsonString);
        const callParams = { data: data, to: contractAddress };
        const result = this.rpc("eth_call", [callParams, "latest"]);
        return result;
    }


    /**
     * Write contract, it works for blockchain which support EIP1559.
     * @param from From address
     * @param contractAddress Contract address
     * @param methodName Method name, like `mint`, `balanceOf` or other methods that are defined in your contract
     * @param params Parameters request by method
     * @param abiJsonString ABI json string
     * @returns Serialized transacion 
     */
    static async writeContract(from: string, contractAddress: string, methodName: string, params: string, abiJsonString: string) {
        const data = await this.abiEncodeFunctionCall(contractAddress, methodName, params, abiJsonString);

        const gasLimit = await this.estimateGas(from, contractAddress, "0x0", data);
        const gasFeesResult = await this.suggeseGasFee();

        const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
        const maxFeePerGasHex = "0x" + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

        const maxPriorityFeePerGas = gasFeesResult.high.maxPriorityFeePerGas;
        const maxPriorityFeePerGasHex = "0x" + BigNumber(maxPriorityFeePerGas * Math.pow(10, 9)).toString(16);
        const chainId = EvmService.currentChainInfo.chain_id;

        const transaction = { from: from, to: contractAddress, data: data, gasLimit: gasLimit, value: "0x0", type: "0x2", chainId: "0x" + chainId.toString(16), maxPriorityFeePerGas: maxPriorityFeePerGasHex, maxFeePerGas: maxFeePerGasHex }

        console.log(transaction);
        const json = JSON.stringify(transaction);
        const serialized = Buffer.from(json).toString('hex');
        return "0x" + serialized;
    }

    /**
     * Write contract, it works for blockchain which doesn't support EIP1559.
     * @param from From address
     * @param contractAddress Contract address
     * @param methodName Method name, like `mint`, `balanceOf` or other methods that are defined in your contract
     * @param params Parameters request by method
     * @param abiJsonString ABI json string
     * @returns Serialized transacion 
     */
    static async writeContractLegacy(from: string, contractAddress: string, methodName: string, params: string, abiJsonString: string) {
        const data = await this.abiEncodeFunctionCall(contractAddress, methodName, params, abiJsonString);

        const gasLimit = await this.estimateGas(from, contractAddress, "0x0", data);
        const gasFeesResult = await this.suggeseGasFee();

        const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
        const maxFeePerGasHex = "0x" + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

        const chainId = EvmService.currentChainInfo.chain_id;

        const transaction = { from: from, to: contractAddress, data: data, gasLimit: gasLimit, value: "0x0", type: "0x0", chainId: "0x" + chainId.toString(16), gasPrice: maxFeePerGasHex }

        console.log(transaction);
        const json = JSON.stringify(transaction);
        const serialized = Buffer.from(json).toString('hex');
        return "0x" + serialized;
    }
}