import BigNumber from 'bignumber.js';
import { EvmService } from 'react-native-particle-auth';
import { TestAccountSolana } from './TestAccount';

import {
    JsonRpcRequest,
    SerializeTransactionParams,
    SolanaReqBodyMethod,
} from 'react-native-particle-auth';

export async function getSolanaTransaction(from: string) {
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

export async function getSplTokenTransaction(from: string) {
  // mock a solana spl token transaction
  // send some spl token on solana devnet

  const sender = from;
  const receiver = TestAccountSolana.receiverAddress;
  const amount = parseInt(TestAccountSolana.amount);
  const mint = TestAccountSolana.tokenContractAddress;
  const obj = {
    sender: sender,
    receiver: receiver,
    amount: amount,
    mint: mint,
  };
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

export async function getEthereumTransacion(
  from: string,
  to: string,
  amount: BigNumber
) {
  // mock a evm native transaction,
  // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
  // send 0.01 native
  return await EvmService.createTransaction(from, '0x', amount, to);
}

export async function getEthereumTransacionLegacy(
  from: string,
  to: string,
  amount: BigNumber
) {
  // mock a evm native transaction,
  // type is 0x0, should work in BSC and other blockchains which don't support EIP1559
  // send 0.01 native

  return await EvmService.createTransaction(from, '0x', amount, to);
}

export async function getEvmTokenTransaction(
  from: string,
  to: string,
  amount: BigNumber,
  contractAddress: string
) {
  // mock a evm token transaction,
  // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
  // send 0.01 token
  const data = await EvmService.erc20Transfer(
    contractAddress,
    to,
    amount.toString(10)
  );
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

  const data = await EvmService.erc20Transfer(
    contractAddress,
    to,
    amount.toString(10)
  );
  return await EvmService.createTransaction(from, data, BigNumber(0), to);
}
