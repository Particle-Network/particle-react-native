import { EvmService, SolanaService } from '@particle-network/rn-auth';
import BigNumber from 'bignumber.js';
import { TestAccountSolana } from './TestAccount';

export async function getSolanaTransaction(from: string) {
    // mock a solana native transaction
    // send some native on solana devnet
    const result = await SolanaService.serializeSolTransction(from, TestAccountSolana.receiverAddress, 1000000);
    console.log(result.transaction.serialized);
    return result.transaction.serialized;
}

export async function getSplTokenTransaction(from: string) {
    // mock a solana spl token transaction
    // send some spl token on solana devnet
    const result = await SolanaService.serializeSplTokenTransction(from, TestAccountSolana.receiverAddress, TestAccountSolana.tokenContractAddress, parseInt(TestAccountSolana.amount));

    console.log(result.transaction.serialized);
    return result.transaction.serialized;
}

export async function getEthereumTransacion(from: string, to: string, amount: BigNumber) {
    // mock a evm native transaction,
    // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
    // send 0.01 native
    return await EvmService.createTransaction(from, '0x', amount, to);
}

export async function getEthereumTransacionLegacy(from: string, to: string, amount: BigNumber) {
    // mock a evm native transaction,
    // type is 0x0, should work in BSC and other blockchains which don't support EIP1559
    // send 0.01 native

    return await EvmService.createTransaction(from, '0x', amount, to);
}

export async function getEvmTokenTransaction(from: string, to: string, amount: BigNumber, contractAddress: string) {
    // mock a evm token transaction,
    // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
    // send 0.01 token
    const data = await EvmService.erc20Transfer(contractAddress, to, amount.toString(10));
    return await EvmService.createTransaction(from, data, BigNumber(0), to);
}

export async function getEvmTokenTransactionLegacy(
    from: string,
    to: string,
    amount: BigNumber,
    contractAddress: string
) {
    // mock a evm token transaction,
    // type is 0x0, should work in BSC and other blockchains which don't support EIP1559
    // send 0.01 token

    const data = await EvmService.erc20Transfer(contractAddress, to, amount.toString(10));
    return await EvmService.createTransaction(from, data, BigNumber(0), to);
}
