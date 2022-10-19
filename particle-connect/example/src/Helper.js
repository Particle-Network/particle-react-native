import { TestAccountSolana, TestAccountEVM } from './TestAccount';
import JsonRpcRequest from './NetService/NetService';
import { SerializeTransactionParams, SolanaReqBodyMethod } from './NetService/NetParams';
import BigNumber from 'bignumber.js';
import { Buffer } from 'buffer';
import {EvmService}  from './NetService/EvmService';
import {SolanaService}  from './NetService/SolanaService';

export async function getSolanaTransaction(from) {
    // mock a solana native transaction
    // send some native on solana devnet
    const sender = from;
    const receiver = TestAccountSolana.receiverAddress;
    const amount = 10000000;
    const obj = { sender: sender, receiver: receiver, lamports: amount }
    const rpcUrl = "http://api-debug.app-link.network/";
    // const rpcUrl = "https://api.particle.network/"
    const pathname = "solana/rpc"
    const chainId = 103

    const result = await JsonRpcRequest(rpcUrl, pathname, SolanaReqBodyMethod.enhancedSerializeTransaction, [SerializeTransactionParams.transferSol, obj], chainId);

    console.log(result.transaction.serialized)
    return result.transaction.serialized
}

export async function getSplTokenTransaction(from) {
    // mock a solana spl token transaction
    // send some spl token on solana devnet

    const sender = from;
    const receiver = TestAccountSolana.receiverAddress;
    const amount = parseInt(TestAccountSolana.amount);
    const mint = TestAccountSolana.tokenContractAddress;
    const obj = { sender: sender, receiver: receiver, amount: amount, mint: mint }
    const rpcUrl = "http://api-debug.app-link.network/";
    // const rpcUrl = "https://api.particle.network/"
    const pathname = "solana/rpc"
    const chainId = 103

    const result = await JsonRpcRequest(rpcUrl, pathname, SolanaReqBodyMethod.enhancedSerializeTransaction, [SerializeTransactionParams.transferToken, obj], chainId);

    console.log(result.transaction.serialized)
    return result.transaction.serialized
}

export async function getEthereumTransacion(from) {
    // mock a ethereum native transaction
    // send 0.01 native on ethereum goerli
    const sender = from;
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const data = "0x";

    const gasLimit = await EvmService.estimateGas(sender, receiver, "0x0", data);
    console.log(`gasLimit = ${gasLimit}`);
    const gasFeesResult = await EvmService.suggeseGasFee();
    console.log(`gasFeesResult = ${gasFeesResult}`);
    const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
    const maxFeePerGasHex = "0x" + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

    const maxPriorityFeePerGas = gasFeesResult.high.maxPriorityFeePerGas;
    const maxPriorityFeePerGasHex = "0x" + BigNumber(maxPriorityFeePerGas * Math.pow(10, 9)).toString(16);
    const chainId = TestAccountEVM.chainId;

    const value = "0x" + BigNumber(amount).toString(16);
    const transaction = { from: sender, to: receiver, data: data, gasLimit: gasLimit, value: value, type: "0x2", chainId: "0x" + chainId.toString(16), maxPriorityFeePerGas: maxPriorityFeePerGasHex, maxFeePerGas: maxFeePerGasHex }

    console.log(transaction);
    const json = JSON.stringify(transaction);
    const serialized = Buffer.from(json).toString('hex');
    return "0x" + serialized;
}

export async function getEvmTokenTransaction() {
    // mock a ethereum token transaction 
    // send 0.01 chain link token on ethereum goerli

    const sender = TestAccountEVM.publicAddress;
    const receiver = TestAccountEVM.receiverAddress;
    const contractAddress = TestAccountEVM.tokenContractAddress;
    const amount = TestAccountEVM.amount;

    const data = await EvmService.erc20Transfer(contractAddress, receiver, amount);
    console.log(`data = ${data}`);
    const gasLimit = await EvmService.estimateGas(sender, receiver, "0x0", data);
    console.log(`gasLimit = ${gasLimit}`);
    const gasFeesResult = await EvmService.suggeseGasFee();
    console.log(`gasFeesResult = ${gasFeesResult}`);

    const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
    const maxFeePerGasHex = "0x" + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

    const maxPriorityFeePerGas = gasFeesResult.high.maxPriorityFeePerGas;
    const maxPriorityFeePerGasHex = "0x" + BigNumber(maxPriorityFeePerGas * Math.pow(10, 9)).toString(16);
    const chainId = TestAccountEVM.chainId;

    const transaction = { from: sender, to: contractAddress, data: data, gasLimit: gasLimit, value: "0x0", type: "0x2", chainId: "0x" + chainId.toString(16), maxPriorityFeePerGas: maxPriorityFeePerGasHex, maxFeePerGas: maxFeePerGasHex }

    console.log(transaction);
    const json = JSON.stringify(transaction);
    const serialized = Buffer.from(json).toString('hex');
    return "0x" + serialized;
}



