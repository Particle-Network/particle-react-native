import { chains } from '@particle-network/chains';
import BigNumber from 'bignumber.js';
import { Buffer } from 'buffer';
import { SmartAccountInfo, GasFeeLevel } from '../Models';
import type { SmartAccountParamType } from '../Models/SmartAccountConfig';
import { getChainId, getChainInfo } from '../index';
import { AbiEncodeFunction, EVMReqBodyMethod } from './NetParams';
import JsonRpcRequest from './NetService';

export class EvmService {
    /**
     * Support evm standard rpc methpd
     * @param method Method name, like "eth_getBalance", "eth_call"
     * @param params Parameters requested by method
     * @returns Json string
     */
    static async rpc(method: string, params: any): Promise<any> {
        const rpcUrl = 'https://rpc.particle.network/';
        const path = 'evm-chain';

        let result;
        try {
            const chainId = await getChainId();
            result = await JsonRpcRequest(rpcUrl, path, method, params, chainId);
        } catch (err) {
            result = {
                status: 0,
                data: {
                    code: 0,
                    data: (err as Error).message,
                },
            };
        }

        return result;
    }

    /**
     * Get token price
     * @param addresses Token address array, for native token, pass "native"
     * @param currencies Currencies array, like ["usd", "cny"]
     * @returns Json string
     */
    static async getPrice(addresses: string[], currencies: string[]): Promise<any> {
        return await this.rpc(EVMReqBodyMethod.particleGetPrice, [addresses, currencies]);
    }

    /**
     * Get tokens and nfts
     * @param address Public address
     * @param tokenAddresses You can pass specified token addresses, can be empty array.
     * @returns Json string, contains native amount, tokens, nfts
     */
    static async getTokensAndNFTs(address: string, tokenAddresses: string[]): Promise<any> {
        return await this.rpc(EVMReqBodyMethod.particleGetTokensAndNFTs, [address, tokenAddresses]);
    }

    /**
     * Get tokens
     * @param address Public address
     * @param tokenAddresses You can pass specified token addresses, can be empty array.
     * @returns Json string, contains native amount, tokens
     */
    static async getTokens(address: string, tokenAddresses: string[]): Promise<any> {
        return await this.rpc(EVMReqBodyMethod.particleGetTokens, [address, tokenAddresses]);
    }

    /**
     * Get NFTs
     * @param address Public address
     * @returns Json string, contains NFTs
     */
    static async getNFTs(address: string): Promise<any> {
        return await this.rpc(EVMReqBodyMethod.particleGetNFTs, [address]);
    }

    /**
     * Get public address transactions
     * @param address Public address
     * @returns Json string
     */
    static async getTransactionsByAddress(address: string): Promise<any> {
        return await this.rpc(EVMReqBodyMethod.particleGetTransactionsByAddress, [address]);
    }

    /**
     * Get suggest gas fee
     * @returns Json string, contains base fee, high, medium, low fee.
     */
    static async suggestedGasFees(): Promise<any> {
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
    static async estimateGas(from: string, to: string, value: string, data: string): Promise<any> {
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
    static async erc20Transfer(contractAddress: string, to: string, amount: string): Promise<any> {
        const data = await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
            contractAddress,
            AbiEncodeFunction.erc20Transfer,
            [to, amount],
        ]);
        return data;
    }

    /**
     * Get the `data` field in Transacion
     * @param contractAddress Contract address
     * @param spender Spender address
     * @param amount Token amount
     * @returns The `data` field in Transacion
     */
    static async erc20Approve(contractAddress: string, spender: string, amount: string): Promise<any> {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
            contractAddress,
            AbiEncodeFunction.erc20Approve,
            [spender, amount],
        ]);
    }

    /**
     * Get the `data` field in Transacion
     * @param contractAddress Contract address
     * @param from From address
     * @param to To address
     * @param amount Token amount
     * @returns The `data` field in Transacion
     */
    static async erc20TransferFrom(contractAddress: string, from: string, to: string, amount: string): Promise<any> {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
            contractAddress,
            AbiEncodeFunction.erc20TransferFrom,
            [from, to, amount],
        ]);
    }

    /**
     * Get the `data` field in Transacion
     * @param contractAddress Contract address
     * @param from From address
     * @param to To address
     * @param tokenId Token id
     * @returns The `data` field in Transacion
     */
    static async erc721SafeTransferFrom(
        contractAddress: string,
        from: string,
        to: string,
        tokenId: string
    ): Promise<any> {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
            contractAddress,
            AbiEncodeFunction.erc721SafeTransferFrom,
            [from, to, tokenId],
        ]);
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
    static async erc1155SafeTransferFrom(
        contractAddress: string,
        from: string,
        to: string,
        id: string,
        amount: string,
        data: Uint8Array
    ): Promise<any> {
        const params = [from, to, id, amount, data].filter(function (element) {
            return element !== undefined;
        });
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
            contractAddress,
            AbiEncodeFunction.erc1155SafeTransferFrom,
            params,
        ]);
    }

    /**
     * Get the `data` field in Transacion
     * @param contractAddress Contract address
     * @param methodName Method name, like `mint`, `balanceOf` or other methods that are defined in your contract
     * @param params Parameters request by method
     * @param abiJsonString ABI json string
     * @returns The `data` field in Transacion
     */
    static async abiEncodeFunctionCall(
        contractAddress: string,
        methodName: string,
        params: string[],
        abiJsonString: string
    ): Promise<any> {
        return await this.rpc(EVMReqBodyMethod.particleAbiEncodeFunctionCall, [
            contractAddress,
            `custom_${methodName}`,
            params,
            abiJsonString,
        ]);
    }

    /**
     * Get token by token address
     * @param address Public address
     * @param tokenAddresses Token address array
     * @returns Json string, tokens
     */
    static async getTokenByTokenAddress(address: string, tokenAddresses: string[]): Promise<any> {
        return await this.rpc(EVMReqBodyMethod.particleGetTokensByTokenAddresses, [address, tokenAddresses]);
    }

    /**
     * Read contract
     * @param address address the transaction is sent from.
     * @param value the value sent with this transaction.
     * @param contractAddress Contract address
     * @param methodName Method name, like `mint`, `balanceOf` or other methods that are defined in your contract
     * @param params Parameters request by method
     * @param abiJsonString ABI json string
     * @returns Json string
     */
    static async readContract(
        address: string,
        value: BigNumber,
        contractAddress: string,
        methodName: string,
        params: string[],
        abiJsonString: string
    ): Promise<string> {
        const data = await this.abiEncodeFunctionCall(contractAddress, methodName, params, abiJsonString);
        const valueHex = '0x' + value.toString(16);
        const callParams = { data: data, to: contractAddress, from: address, value: valueHex };
        const result = this.rpc('eth_call', [callParams, 'latest']);
        return result;
    }



    /**
     * Write contract, it works for blockchain which support EIP1559.
     * @param from address the transaction is sent from.
     * @param value the value sent with this transaction.
     * @param contractAddress Contract address
     * @param methodName Method name, like `mint`, `balanceOf` or other methods that are defined in your contract
     * @param params Parameters request by method
     * @param abiJsonString ABI json string
     * @param gasFeeLevel Gas fee level, default is high.
     * @returns Serialized transacion
     */
    static async writeContract(
        from: string,
        value: BigNumber,
        contractAddress: string,
        methodName: string,
        params: string[],
        abiJsonString: string,
        gasFeeLevel: GasFeeLevel = GasFeeLevel.high
    ): Promise<string> {
        const data = await this.abiEncodeFunctionCall(contractAddress, methodName, params, abiJsonString);
        return await this.createTransaction(from, data, value, contractAddress, gasFeeLevel);
    }

    /**
     * Create transaction
     * @param from From address
     * @param data Contract transaction parameter, if you want to send native, pass 0x
     * @param value Native amount
     * @param to If it is a contract transaction, to is the contract address, if it is a native transaction, to is the receiver address.
     * @param gasFeeLevel Gas fee level, default is high.
     * @returns
     */
    static async createTransaction(
        from: string,
        data: string,
        value: BigNumber,
        to: string,
        gasFeeLevel: GasFeeLevel = GasFeeLevel.high
    ): Promise<string> {
        const valueHex = '0x' + value.toString(16);
        const gasLimit = await this.estimateGas(from, to, valueHex, data);
        const gasFeesResult = await this.suggestedGasFees();

        let gasFee;
        switch (gasFeeLevel) {
            case GasFeeLevel.high:
                gasFee = gasFeesResult.high;
                break;
            case GasFeeLevel.medium:
                gasFee = gasFeesResult.medium;
                break;

            case GasFeeLevel.low:
                gasFee = gasFeesResult.low;
                break;
        }

        const maxFeePerGas = gasFee.maxFeePerGas;
        console.log('maxFeePerGas', maxFeePerGas);
        const maxFeePerGasHex = '0x' + BigNumber(Math.floor(maxFeePerGas * Math.pow(10, 9))).toString(16);

        console.log('maxFeePerGasHex', maxFeePerGasHex);
        const maxPriorityFeePerGas = gasFee.maxPriorityFeePerGas;
        const maxPriorityFeePerGasHex =
            '0x' + BigNumber(Math.floor(maxPriorityFeePerGas * Math.pow(10, 9))).toString(16);

        const chainInfo = await getChainInfo();
        const chainId = chainInfo.id;
        const isSupportEIP1559 = chains.isChainSupportEIP1559({ id: chainInfo.id, name: chainInfo.name });

        let transaction;

        if (isSupportEIP1559) {
            transaction = {
                from: from,
                to: to,
                data: data,
                gasLimit: gasLimit,
                value: valueHex,
                type: '0x2',
                chainId: '0x' + chainId.toString(16),
                maxPriorityFeePerGas: maxPriorityFeePerGasHex,
                maxFeePerGas: maxFeePerGasHex,
            };
        } else {
            transaction = {
                from: from,
                to: to,
                data: data,
                gasLimit: gasLimit,
                value: valueHex,
                type: '0x0',
                chainId: '0x' + chainId.toString(16),
                gasPrice: maxFeePerGasHex,
            };
        }
        console.log(transaction);
        const json = JSON.stringify(transaction);
        const serialized = Buffer.from(json).toString('hex');
        return '0x' + serialized;
    }

    /**
     * Get smart account
     * @param smartAccountConfigList Smart account config list
     * @returns Smart account json object
     */
    static async getSmartAccount(smartAccountConfigList: SmartAccountParamType[]): Promise<SmartAccountInfo[]> {
        return await this.rpc(EVMReqBodyMethod.particleAAGetSmartAccount, smartAccountConfigList);
    }
}
