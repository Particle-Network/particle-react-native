import { NativeModules, Platform } from 'react-native';
import type { ChainInfo } from './Models/ChainInfo';
import type { Env, iOSModalPresentStyle, LoginType, SupportAuthType } from './Models/LoginInfo';

const LINKING_ERROR =
  `The package 'react-native-particle-auth' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ParticleAuth = NativeModules.ParticleAuth
  ? NativeModules.ParticleAuth
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export function init(chainInfo: ChainInfo, env: Env) {
  const obj = { chain_name: chainInfo.chain_name, chain_id: chainInfo.chain_id, chain_id_name: chainInfo.chain_id_name, env: env };
  const json = JSON.stringify(obj);
  if (Platform.OS === 'ios') {
    ParticleAuth.initialize(json);
  } else {
    ParticleAuth.init(json);
  }
}

export function setChainInfo(chainInfo: ChainInfo): Promise<boolean> {
  const obj = { chain_name: chainInfo.chain_name, chain_id: chainInfo.chain_id, chain_id_name: chainInfo.chain_id_name };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleAuth.setChainInfo(json, (result: boolean) => {
      resolve(result);
    });
  });
}

export function getChainInfo(): Promise<ChainInfo> {
  return new Promise((resolve) => {
    ParticleAuth.getChainInfo((result: string) => {
      resolve(JSON.parse(result) as ChainInfo);
    });
  });
}

export function setChainInfoAsync(chainInfo: ChainInfo): Promise<boolean> {
  const obj = { chain_name: chainInfo.chain_name, chain_id: chainInfo.chain_id, chain_id_name: chainInfo.chain_id_name };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleAuth.setChainInfoAsync(json, (result: boolean) => {
      resolve(result);
    });
  });
}

export function login(type: LoginType, account: string, supportAuthType: [SupportAuthType], loginFormMode: boolean = false): Promise<any> {
  const obj = { login_type: type, account: account, support_auth_type_values: supportAuthType, login_form_mode: loginFormMode };
  const json = JSON.stringify(obj);
  console.log("login:", json);
  return new Promise((resolve) => {
    ParticleAuth.login(json, (result: string) => {
      resolve(JSON.parse(result))
    });
  });
}

export function logout(): Promise<any> {
  return new Promise((resolve) => {
    ParticleAuth.logout((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function isLogin(): Promise<boolean> {
  return new Promise((resolve) => {
    ParticleAuth.isLogin((result: boolean) => {
      resolve(result);
    });
  });

}

export function signMessage(message: string) {
  return new Promise((resolve) => {
    ParticleAuth.signMessage(message, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}
//only solana chain support!
export function signTransaction(transaction: string) {
  return new Promise((resolve) => {
    ParticleAuth.signTransaction(transaction, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

//only solana chain support!
export function signAllTransactions(transactions: [string]) {
  const json = JSON.stringify(transactions);
  return new Promise((resolve) => {
    ParticleAuth.signAllTransactions(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function signAndSendTransaction(transaction: string) {
  return new Promise((resolve) => {
    ParticleAuth.signAndSendTransaction(transaction, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

//only evm chain support sign typed data!
export function signTypedData(typedData: string, version: string) {
  const obj = { message: typedData, version: version };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleAuth.signTypedData(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function getAddress(): Promise<string> {
  return ParticleAuth.getAddress()
}

export function getUserInfo() {
  return ParticleAuth.getUserInfo()
}

//only support ios
export function setModalPresentStyle(style: iOSModalPresentStyle) {
  ParticleAuth.setModalPresentStyle(style)
}

export function setDisplayWallet(isDisplay: boolean) {
  ParticleAuth.setDisplayWallet(isDisplay)
}

export function openWebWallet() {
  ParticleAuth.openWebWallet();
}

export * from "./Models/LoginInfo"
export * from "./Models/ChainInfo"
export * from "./Models/DappMetaData"
export * from "./Models/RpcUrl"
export * from "./Models/WalletType"