import { TestAccountSolana, TestAccountEVM } from './TestAccount';
import BigNumber from 'bignumber.js';
import { Buffer } from 'buffer';
import { EvmService, SolanaService, SerializeTransactionParams, SolanaReqBodyMethod, JsonRpcRequest} from 'react-native-particle-auth';

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
    const data = '0x';
    const gasLimit = await EvmService.estimateGas(from, to, '0x0', data);
    console.log(`gasLimit = ${gasLimit}`);
    const gasFeesResult = await EvmService.suggeseGasFee();
    console.log(`gasFeesResult = ${gasFeesResult}`);
    const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
    const maxFeePerGasHex = '0x' + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

    const maxPriorityFeePerGas = gasFeesResult.high.maxPriorityFeePerGas;
    const maxPriorityFeePerGasHex = '0x' + BigNumber(maxPriorityFeePerGas * Math.pow(10, 9)).toString(16);

    const chainId = EvmService.currentChainInfo.chain_id;

    console.log(`chainid = ${chainId}`);
    const value = '0x' + BigNumber(amount).toString(16);
    const transaction = {
        from: from,
        to: to,
        data: data,
        gasLimit: gasLimit,
        value: value,
        type: '0x2',
        chainId: '0x' + chainId.toString(16),
        maxPriorityFeePerGas: maxPriorityFeePerGasHex,
        maxFeePerGas: maxFeePerGasHex,
    };

    console.log('transaction', transaction);
    const json = JSON.stringify(transaction);
    const serialized = Buffer.from(json).toString('hex');
    return '0x' + serialized;
}

export async function getEthereumTransacionLegacy(from, to, amount) {
    // mock a evm native transaction,
    // type is 0x0, should work in BSC and other blockchains which don't support EIP1559
    // send 0.01 native

    const data = '0x';

    const gasLimit = await EvmService.estimateGas(from, to, '0x0', data);
    console.log(`gasLimit = ${gasLimit}`);
    const gasFeesResult = await EvmService.suggeseGasFee();
    console.log(`gasFeesResult = ${JSON.stringify(gasFeesResult)}`);
    const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
    const maxFeePerGasHex = '0x' + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

    const chainId = EvmService.currentChainInfo.chain_id;

    const value = '0x' + BigNumber(amount).toString(16);
    const transaction = {
        from: from,
        to: to,
        data: data,
        gasLimit: gasLimit,
        value: value,
        type: '0x0',
        chainId: '0x' + chainId.toString(16),
        gasPrice: maxFeePerGasHex,
    };

    console.log(transaction);
    const json = JSON.stringify(transaction);
    const serialized = Buffer.from(json).toString('hex');
    return '0x' + serialized;
}

export async function getEvmTokenTransaction(from, to, amount, contractAddress) {
    // mock a evm token transaction,
    // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
    // send 0.01 token

    const data = await EvmService.erc20Transfer(contractAddress, to, amount);
    console.log(`data = ${data}`);
    const gasLimit = await EvmService.estimateGas(from, contractAddress, '0x0', data);
    console.log(`gasLimit = ${gasLimit}`);
    const gasFeesResult = await EvmService.suggeseGasFee();
    console.log(`gasFeesResult = ${gasFeesResult}`);

    const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
    const maxFeePerGasHex = '0x' + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

    const maxPriorityFeePerGas = gasFeesResult.high.maxPriorityFeePerGas;
    const maxPriorityFeePerGasHex = '0x' + BigNumber(maxPriorityFeePerGas * Math.pow(10, 9)).toString(16);

    const chainId = EvmService.currentChainInfo.chain_id;

    const transaction = {
        from: from,
        to: contractAddress,
        data: data,
        gasLimit: gasLimit,
        value: '0x0',
        type: '0x2',
        chainId: '0x' + chainId.toString(16),
        maxPriorityFeePerGas: maxPriorityFeePerGasHex,
        maxFeePerGas: maxFeePerGasHex,
    };

    console.log(transaction);
    const json = JSON.stringify(transaction);
    const serialized = Buffer.from(json).toString('hex');
    return '0x' + serialized;
}

export async function getEvmTokenTransactionLegacy(from, to, amount, contractAddress) {
    // mock a evm token transaction,
    // type is 0x0, should work in BSC and other blockchains which don't support EIP1559
    // send 0.01 token

    const data = await EvmService.erc20Transfer(contractAddress, to, amount);
    console.log(`data = ${data}`);
    const gasLimit = await EvmService.estimateGas(from, contractAddress, '0x0', data);
    console.log(`gasLimit = ${gasLimit}`);
    const gasFeesResult = await EvmService.suggeseGasFee();
    console.log(`gasFeesResult = ${gasFeesResult}`);

    const maxFeePerGas = gasFeesResult.high.maxFeePerGas;
    const maxFeePerGasHex = '0x' + BigNumber(maxFeePerGas * Math.pow(10, 9)).toString(16);

    const chainId = EvmService.currentChainInfo.chain_id;

    const transaction = {
        from: from,
        to: contractAddress,
        data: data,
        gasLimit: gasLimit,
        value: '0x0',
        type: '0x0',
        chainId: '0x' + chainId.toString(16),
        gasPrice: maxFeePerGasHex,
    };

    console.log(transaction);
    const json = JSON.stringify(transaction);
    const serialized = Buffer.from(json).toString('hex');
    return '0x' + serialized;
}

