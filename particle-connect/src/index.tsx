import { NativeModules, Platform } from 'react-native';
import type { ChainInfo } from './Models/ChainInfo';
import type { DappMetaData } from './Models/DappMetaData';
import type { Env, } from './Models/LoginInfo';
import type { RpcUrl } from './Models/RpcUrl';
import type { WalletType } from './Models/WalletType';

const LINKING_ERROR =
  `The package 'react-native-particle-connect' doesn't seem to be linked. Make sure: \n\n` +
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


export function init(chainInfo: ChainInfo, env: Env, metadata: DappMetaData, rpcUrl: RpcUrl) {
  const obj = { chain_name: chainInfo.chain_name, chain_id: chainInfo.chain_id, chain_id_name: chainInfo.chain_id_name, env: env, metadata: metadata, rpc_url: rpcUrl };
  const json = JSON.stringify(obj);
  ParticleConnectPlugin.initialize(json);
}

export function setChainInfo(chainInfo: ChainInfo): Promise<boolean> {
  const obj = { chain_name: chainInfo.chain_name, chain_id: chainInfo.chain_id, chain_id_name: chainInfo.chain_id_name };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleConnectPlugin.setChainInfo(json, (result: boolean) => {
      resolve(result);
    });
  });
}

export function getAccounts(walletType: WalletType): Promise<string> {
  return ParticleConnectPlugin.getAccounts(walletType);
}

export function connect(walletType: WalletType): Promise<any> {
  return new Promise((resolve) => {
    ParticleConnectPlugin.connect(walletType, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function disconnect(walletType: WalletType, publicAddress: string): Promise<any> {
  const obj = { wallet_type: walletType, public_address: publicAddress };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleConnectPlugin.disconnect(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function isConnected(walletType: WalletType, publicAddress: string): Promise<any> {
  const obj = { wallet_type: walletType, public_address: publicAddress };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleConnectPlugin.isConnected(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function signMessage(walletType: WalletType, publicAddress: string, message: string): Promise<any> {
  const obj = { wallet_type: walletType, public_address: publicAddress, message: message };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleConnectPlugin.signMessage(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function signTransaction(walletType: WalletType, publicAddress: string, transaction: string): Promise<any> {
  const obj = { wallet_type: walletType, public_address: publicAddress, transaction: transaction };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.signTransaction(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function signAllTransactions(walletType: WalletType, publicAddress: string, transactions: [string]): Promise<any> {
  const obj = { wallet_type: walletType, public_address: publicAddress, transactions: transactions };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.signAllTransactions(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function signAndSendTransaction(walletType: WalletType, publicAddress: string, transaction: string): Promise<any> {
  const obj = { wallet_type: walletType, public_address: publicAddress, transaction: transaction };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.signAndSendTransaction(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function signTypedData(walletType: WalletType, publicAddress: string, typedData: string): Promise<any> {
  const obj = { wallet_type: walletType, public_address: publicAddress, message: typedData };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.signTypedData(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}
export function login(walletType: WalletType, publicAddress: string, domain: string, uri: string): Promise<any> {
  const obj = { wallet_type: walletType, public_address: publicAddress, domain: domain, uri: uri };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleConnectPlugin.login(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function verify(walletType: WalletType, publicAddress: string, message: string, signature: string): Promise<any> {
  const obj = { wallet_type: walletType, public_address: publicAddress, message: message, signature: signature };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.verify(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function importPrivateKey(walletType: WalletType, privateKey: string): Promise<any> {
  const obj = { wallet_type: walletType, private_key: privateKey };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.importPrivateKey(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function importMnemonic(walletType: WalletType, mnemonic: string): Promise<any> {
  const obj = { wallet_type: walletType, mnemonic: mnemonic };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.importMnemonic(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function exportPrivateKey(walletType: WalletType, publicAddress: string): Promise<any> {
  const obj = { wallet_type: walletType, public_address: publicAddress };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleConnectPlugin.exportPrivateKey(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function getChainInfo(): Promise<ChainInfo> {
  return new Promise((resolve) => {
    ParticleConnectPlugin.getChainInfo((result: string) => {
      resolve(JSON.parse(result) as ChainInfo);
    });
  });
}

export * from "./Models/LoginInfo"
export * from "./Models/ChainInfo"
export * from "./Models/DappMetaData"
export * from "./Models/RpcUrl"
export * from "./Models/WalletType"