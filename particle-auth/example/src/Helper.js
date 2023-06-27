import { TestAccountSolana, TestAccountEVM } from './TestAccount';
import BigNumber from 'bignumber.js';
import { Buffer } from 'buffer';
import { EvmService, SolanaService, SerializeTransactionParams, SolanaReqBodyMethod, JsonRpcRequest } from 'react-native-particle-auth';
import * as particleAuth from 'react-native-particle-auth';

export async function getSolanaTransaction() {
    // mock a solana native transaction
    // send some native on solana devnet

    const sender = from;
    const receiver = TestAccountSolana.receiverAddress;
    const amount = 10000000;
    const obj = { sender: sender, receiver: receiver, lamports: amount };
    const rpcUrl = 'https://rpc.particle.network/';
    const pathname = 'solana';
    const chainId = 103;

    const result = await JsonRpcRequest(
        rpcUrl,
        pathname,
        SolanaReqBodyMethod.enhancedSerializeTransaction,
        [SerializeTransactionParams.transferSol, obj],
        chainId
    );

    console.log(result.transaction.serialized);
    return result.transaction.serialized;
}

export async function getSplTokenTransaction(from) {
    // mock a solana spl token transaction
    // send some spl token on solana devnet

    const sender = from;
    const receiver = TestAccountSolana.receiverAddress;
    const amount = parseInt(TestAccountSolana.amount);
    const mint = TestAccountSolana.tokenContractAddress;
    const obj = { sender: sender, receiver: receiver, amount: amount, mint: mint };
    const rpcUrl = 'https://rpc.particle.network/';
    const pathname = 'solana';
    const chainId = 103;

    const result = await JsonRpcRequest(
        rpcUrl,
        pathname,
        SolanaReqBodyMethod.enhancedSerializeTransaction,
        [SerializeTransactionParams.transferToken, obj],
        chainId
    );

    console.log(result.transaction.serialized);
    return result.transaction.serialized;
}

export async function getEthereumTransacion(from, to, amount) {
    // mock a evm native transaction,
    // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
    // send 0.01 native
    return await EvmService.createTransaction(from, "0x", BigNumber(amount), to, true);
}

export async function getEthereumTransacionLegacy(from, to, amount) {
    // mock a evm native transaction,
    // type is 0x0, should work in BSC and other blockchains which don't support EIP1559
    // send 0.01 native

    return await EvmService.createTransaction(from, "0x", BigNumber(amount), to, false);
}

export async function getEvmTokenTransaction(from, to, amount, contractAddress) {
    // mock a evm token transaction,
    // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
    // send 0.01 token
    const data = await EvmService.erc20Transfer(contractAddress, to, amount);
    return await EvmService.createTransaction(from, data, BigNumber(0), to, true);
}

export async function getEvmTokenTransactionLegacy(from, to, amount, contractAddress) {
    // mock a evm token transaction,
    // type is 0x0, should work in BSC and other blockchains which don't support EIP1559
    // send 0.01 token

    const data = await EvmService.erc20Transfer(contractAddress, to, amount);
    return await EvmService.createTransaction(from, data, BigNumber(0), to, false);
}

