import type { ChainInfo } from '@particle-network/chains';
import {
  AAFeeMode,
  getChainInfo,
  isHexString,
  type Env,
} from '@particle-network/rn-auth';
import { NativeModules, Platform } from 'react-native';
import type {
  AccountInfo,
  CommonResp,
  DappMetaData,
  LoginResp,
  ParticleConnectConfig,
  RpcUrl,
  WalletType,
} from './Models';
import { formatRespData } from './utils';

const LINKING_ERROR =
  `The package '@particle-network/rn-connect' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ParticleConnectPlugin = NativeModules.ParticleConnectPlugin
  ? NativeModules.ParticleConnectPlugin
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );
export const ParticleConnectEvent = NativeModules.ParticleConnectEvent
  ? NativeModules.ParticleConnectEvent
  : new Proxy(
    {},
    {
      get() {
        // throw new Error(LINKING_ERROR);
      },
    }
  );
/**
 * Init Particle Connect Service
 * @param chainInfo ChainInfo
 * @param env Env
 * @param metadata Dapp meta data
 * @param rpcUrl Custom RpcUrl
 */
export function init(
  chainInfo: ChainInfo,
  env: Env,
  metadata: DappMetaData,
  rpcUrl?: RpcUrl | null
) {
  const obj = {
    chain_name: chainInfo.name,
    chain_id: chainInfo.id,
    env: env,
    metadata: metadata,
    rpc_url: rpcUrl,
  };
  const json = JSON.stringify(obj);
  ParticleConnectPlugin.initialize(json);
}

/**
 * Set the required chains for wallet connect v2. If not set, the current chain connection will be used.
 * @param chainInfos Chain info list
 */
export function setWalletConnectV2SupportChainInfos(chainInfos: ChainInfo[]) {
  const chainInfoObjects = chainInfos.map((info) => ({
    chain_name: info.name,
    chain_id_name: info.network,
    chain_id: info.id,
  }));

  const json = JSON.stringify(chainInfoObjects);
  ParticleConnectPlugin.setWalletConnectV2SupportChainInfos(json);
}

/**
 * Get accounts
 * @param walletType Wallet type
 * @returns Account
 */
export async function getAccounts(walletType: WalletType): Promise<string> {
  return ParticleConnectPlugin.getAccounts(walletType);
}

/**
 * Connect wallet
 * @param walletType Wallet type
 * @param config Optional, works when connect with partile
 * @returns Result, account or error
 */
export async function connect(
  walletType: WalletType,
  config?: ParticleConnectConfig
): Promise<CommonResp<AccountInfo>> {
  let configJson = '';
  if (config) {
    const obj = {
      login_type: config.loginType,
      account: config.account,
      support_auth_type_values: config.supportAuthType,
      social_login_prompt: config.socialLoginPrompt,
      authorization: config.authorization,
    };
    configJson = JSON.stringify(obj);
  }
  return new Promise((resolve) => {
    ParticleConnectPlugin.connect(walletType, configJson, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Disconnect
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @returns Result, success or error
 */
export async function disconnect(
  walletType: WalletType,
  publicAddress: string
): Promise<CommonResp<string>> {
  const obj = { wallet_type: walletType, public_address: publicAddress };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleConnectPlugin.disconnect(json, (result: string) => {
      console.log('disconnect', JSON.parse(result));

      resolve(JSON.parse(result));
    });
  });
}

/**
 * Is connected
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @returns Result, success or failure or error
 */
export async function isConnected(
  walletType: WalletType,
  publicAddress: string
): Promise<any> {
  const obj = { wallet_type: walletType, public_address: publicAddress };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleConnectPlugin.isConnected(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}
/**
 * Sign message
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @param message Message that you want user to sign
 * @returns Result, signed message or error
 */
export async function signMessage(
  walletType: WalletType,
  publicAddress: string,
  message: string
): Promise<CommonResp<string>> {
  let serializedMessage: string;

  let chainInfo = await getChainInfo();
  if (chainInfo.name.toLowerCase() == 'solana') {
    serializedMessage = message;
  } else {
    if (isHexString(message)) {
      serializedMessage = message;
    } else {
      serializedMessage = '0x' + Buffer.from(message).toString('hex');
    }
  }

  const obj = {
    wallet_type: walletType,
    public_address: publicAddress,
    message: serializedMessage,
  };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleConnectPlugin.signMessage(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Sign transaction
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @param transaction Transaction that you want user to sign
 * @returns Result, signed transaction or error
 */
export async function signTransaction(
  walletType: WalletType,
  publicAddress: string,
  transaction: string
): Promise<CommonResp<string>> {
  const obj = {
    wallet_type: walletType,
    public_address: publicAddress,
    transaction: transaction,
  };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.signTransaction(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Sign all transactions
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @param transactions Transactions that you want user to sign
 * @returns Result, signed transactions or error
 */
export async function signAllTransactions(
  walletType: WalletType,
  publicAddress: string,
  transactions: string[]
): Promise<CommonResp<string>> {
  const obj = {
    wallet_type: walletType,
    public_address: publicAddress,
    transactions: transactions,
  };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.signAllTransactions(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Sign and send transaction
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @param transaction Transaction that you want user to sign and send
 * @returns Result, signature or error
 */
export async function signAndSendTransaction(
  walletType: WalletType,
  publicAddress: string,
  transaction: string,
  feeMode?: AAFeeMode
): Promise<CommonResp<string>> {
  const obj = {
    wallet_type: walletType,
    public_address: publicAddress,
    transaction: transaction,
    fee_mode: {
      option: feeMode?.getOption(),
      fee_quote: feeMode?.getFeeQuote(),
      token_paymaster_address: feeMode?.getTokenPaymasterAddress(),
      whole_fee_quote: feeMode?.getWholeFeeQuote(),
    },
  };

  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.signAndSendTransaction(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Batch send transactions, works with particle aa service
 * @param transactions Transactions that you want user to sign and send
 * @param feeMode Optional, default is native
 * @returns Result, signature or error
 */
export async function batchSendTransactions(
  walletType: WalletType,
  publicAddress: string,
  transactions: string[],
  feeMode?: AAFeeMode
): Promise<CommonResp<string>> {
  const obj = {
    wallet_type: walletType,
    public_address: publicAddress,
    transactions: transactions,
    fee_mode: {
      option: feeMode?.getOption(),
      fee_quote: feeMode?.getFeeQuote(),
      token_paymaster_address: feeMode?.getTokenPaymasterAddress(),
      whole_fee_quote: feeMode?.getWholeFeeQuote(),
    },
  };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.batchSendTransactions(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Sign typed data
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @param typedData Typed data that you want user to sign and send, support typed data version v4
 * @returns Result, signature or error
 */
export async function signTypedData(
  walletType: WalletType,
  publicAddress: string,
  typedData: string
): Promise<CommonResp<string>> {
  let serializedMessage: string;

  if (isHexString(typedData)) {
    serializedMessage = typedData;
  } else {
    serializedMessage = '0x' + Buffer.from(typedData).toString('hex');
  }

  const obj = {
    wallet_type: walletType,
    public_address: publicAddress,
    message: serializedMessage,
  };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.signTypedData(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Sign in with Ethereum/Solana
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @param domain Domain, example "particle.network"
 * @param uri Uri, example "https://particle.network/demo#login"
 * @returns Result, source message and signature or error
 */
export function login(
  walletType: WalletType,
  publicAddress: string,
  domain: string,
  uri: string
): Promise<CommonResp<LoginResp>> {
  const obj = {
    wallet_type: walletType,
    public_address: publicAddress,
    domain: domain,
    uri: uri,
  };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleConnectPlugin.login(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Verify
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @param message Source message
 * @param signature Signature
 * @returns Result, bool or error
 */
export function verify(
  walletType: WalletType,
  publicAddress: string,
  message: string,
  signature: string
): Promise<CommonResp<boolean>> {
  const obj = {
    wallet_type: walletType,
    public_address: publicAddress,
    message: message,
    signature: signature,
  };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.verify(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Import private key
 * @param walletType Wallet type, EvmPrivateKey or SolanaPrivateKey
 * @param privateKey Private key
 * @returns Result, account or error
 */
export function importPrivateKey(
  walletType: WalletType,
  privateKey: string
): Promise<CommonResp<Partial<AccountInfo>>> {
  const obj = { wallet_type: walletType, private_key: privateKey };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.importPrivateKey(json, (result: string) => {
      resolve(formatRespData(result));
    });
  });
}

/**
 * Import mnemonic
 * @param walletType Wallet type, EvmPrivateKey or SolanaPrivateKey
 * @param mnemonic Mnemonic, example "word1 work2 ... " at least 12 words.
 * @returns Result, account or error
 */
export function importMnemonic(
  walletType: WalletType,
  mnemonic: string
): Promise<CommonResp<Partial<AccountInfo>>> {
  const obj = { wallet_type: walletType, mnemonic: mnemonic };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.importMnemonic(json, (result: string) => {
      resolve(formatRespData(result));
    });
  });
}

/**
 * Export private key
 * @param walletType Wallet type, EvmPrivateKey or SolanaPrivateKey
 * @param publicAddress Public address
 * @returns Result, private key or error
 */
export function exportPrivateKey(
  walletType: WalletType,
  publicAddress: string
): Promise<CommonResp<string>> {
  const obj = { wallet_type: walletType, public_address: publicAddress };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.exportPrivateKey(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Only support iOS
 *
 * Reconnect wallet connect, works with walletconnect, not support wallet type Particle, EvmPrivateKey or SolanaPrivateKey
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @returns Result
 */
export function reconnectIfNeeded(
  walletType: WalletType,
  publicAddress: string
): Promise<any> {
  if (Platform.OS === 'ios') {
    const obj = { wallet_type: walletType, public_address: publicAddress };
    const json = JSON.stringify(obj);

    return new Promise((resolve) => {
      ParticleConnectPlugin.reconnectIfNeeded(json, (result: string) => {
        resolve(JSON.parse(result));
      });
    });
  } else {
    return Promise.resolve();
  }
}

/**
 * Connect get a wallet connect qrcode uri, should use with NativeEventEmitter, event name 'qrCodeUri', 
 * you can explore example for more details.
 * @returns Account
 */
export function connectWalletConnect(): Promise<CommonResp<AccountInfo>> {
  return new Promise((resolve) => {
    ParticleConnectPlugin.connectWalletConnect((result: string) => {
      console.log('result', result);
      resolve(JSON.parse(result));
    });
  });
}

export * from './Models';
export { ParticleConnectProvider } from './provider';
