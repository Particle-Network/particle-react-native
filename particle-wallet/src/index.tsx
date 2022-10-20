
import { NativeModules, Platform } from 'react-native';

import type { WalletDisplay, Language, UserInterfaceStyle, ChainInfo } from 'react-native-particle-connect';

const LINKING_ERROR =
  `The package 'react-native-particle-wallet' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ParticleWalletPlugin = NativeModules.ParticleWalletPlugin
  ? NativeModules.ParticleWalletPlugin
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export function initWallet() {
  if (Platform.OS === 'android') {
    ParticleWalletPlugin.init();
  }
}

export function navigatorWallet(display: WalletDisplay) {
  ParticleWalletPlugin.navigatorWallet(display);
}

export function navigatorTokenReceive(tokenAddress: string) {
  ParticleWalletPlugin.navigatorTokenReceive(tokenAddress);
}

export function navigatorTokenSend(tokenAddress: string, toAddress: string, amount: string) {
  const obj = { token_address: tokenAddress, to_address: toAddress, amount: amount };
  const json = JSON.stringify(obj);
  ParticleWalletPlugin.navigatorTokenSend(json);
}

export function navigatorTokenTransactionRecords(tokenAddress: string) {
  ParticleWalletPlugin.navigatorTokenTransactionRecords(tokenAddress);
}

export function navigatorNFTSend(receiverAddress: string, mint: string, tokenId: string) {
  const obj = { mint: mint, receiver_address: receiverAddress, token_id: tokenId };
  const json = JSON.stringify(obj);
  ParticleWalletPlugin.navigatorNFTSend(json);
}

export function navigatorNFTDetails(mint: string, tokenId: string) {
  const obj = { mint: mint, token_id: tokenId };
  const json = JSON.stringify(obj);
  ParticleWalletPlugin.navigatorNFTDetails(json);
}

export function navigatorPay() {
  ParticleWalletPlugin.navigatorPay();
}

export function navigatorLoginList(): Promise<any>{
  return new Promise((resolve) => {
    ParticleWalletPlugin.navigatorLoginList((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function navigatorSwap(fromTokenAddress: string, toTokenAddress: string, amount: string) {
  const obj = { from_token_address: fromTokenAddress, to_token_address: toTokenAddress, amount: amount }
  const json = JSON.stringify(obj);
  ParticleWalletPlugin.navigatorSwap(json);
}

export function showTestNetwork(isShow: boolean) {
  ParticleWalletPlugin.showTestNetwork(isShow);
}

export function showManageWallet(isShow: boolean) {
  ParticleWalletPlugin.showManageWallet(isShow);
}

export function supportChain(chainInfos: [ChainInfo]) {
  const json = JSON.stringify(chainInfos);
  ParticleWalletPlugin.supportChain(json);
}

export function enablePay(isEnable: boolean) {
  ParticleWalletPlugin.enablePay(isEnable);
}

export function getEnablePay() {
  return new Promise((resolve) => {
    ParticleWalletPlugin.getEnablePay((result: string) => {
      resolve(result)
    });
  });
}

export function enableSwap(isEnable: boolean) {
  ParticleWalletPlugin.enableSwap(isEnable);
}

export function getEnableSwap() {
  return new Promise((resolve) => {
    ParticleWalletPlugin.getEnableSwap((result: string) => {
      resolve(result)
    });
  });
}

export function switchWallet(walletType: string, publicAddress: string): Promise<boolean> {
  const obj = { wallet_type: walletType, public_address: publicAddress };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleWalletPlugin.switchWallet(json, (result: string) => {
      resolve(JSON.parse(result))
    });
  });
}

export function setLanguage(language: Language) {
  ParticleWalletPlugin.setLanguage(language);
}

export function setInterfaceStyle(userInterfaceStyle: UserInterfaceStyle) {
  ParticleWalletPlugin.setInterfaceStyle(userInterfaceStyle);
}
