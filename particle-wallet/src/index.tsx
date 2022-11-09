
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

/**
 * Init Particle Wallet Service
 */
export function initWallet() {
  if (Platform.OS === 'android') {
    ParticleWalletPlugin.init();
  }
}

/**
 * Navigator wallet page
 * @param display Wallet display
 */
export function navigatorWallet(display: WalletDisplay) {
  ParticleWalletPlugin.navigatorWallet(display);
}

/**
 * Navigator token receive page
 * @param tokenAddress Optional, token address
 */
export function navigatorTokenReceive(tokenAddress?: string) {
  ParticleWalletPlugin.navigatorTokenReceive(tokenAddress);
}

/**
 * Navigator token send page
 * @param tokenAddress Optional, token address
 * @param toAddress Optional, receiver address
 * @param amount Optional, amount
 */
export function navigatorTokenSend(tokenAddress?: string, toAddress?: string, amount?: string) {
  const obj = { token_address: tokenAddress, to_address: toAddress, amount: amount };
  const json = JSON.stringify(obj);
  ParticleWalletPlugin.navigatorTokenSend(json);
}

/**
 * Navigator token transaction records page
 * @param tokenAddress Optional, token address
 */
export function navigatorTokenTransactionRecords(tokenAddress?: string) {
  ParticleWalletPlugin.navigatorTokenTransactionRecords(tokenAddress);
}

/**
 * Navigator NFT send page
 * @param receiverAddress Optional, receiver address
 * @param mint NFT contract/mint address
 * @param tokenId NFT token id, for solana nft, pass ""
 */
export function navigatorNFTSend(mint: string, tokenId: string, receiverAddress?: string) {
  const obj = { mint: mint, receiver_address: receiverAddress, token_id: tokenId };
  const json = JSON.stringify(obj);
  ParticleWalletPlugin.navigatorNFTSend(json);
}

/**
 * Navigator NFT details page
 * @param mint NFT contract/mint address
 * @param tokenId NFT token id, for solana nft, pass ""
 */
export function navigatorNFTDetails(mint: string, tokenId: string) {
  const obj = { mint: mint, token_id: tokenId };
  const json = JSON.stringify(obj);
  ParticleWalletPlugin.navigatorNFTDetails(json);
}

/**
 * Navigator buy crypto page
 */
export function navigatorPay() {
  ParticleWalletPlugin.navigatorPay();
}

/**
 * Navigator login list page
 * @returns  Result, account or eror
 */
export function navigatorLoginList(): Promise<any>{
  return new Promise((resolve) => {
    ParticleWalletPlugin.navigatorLoginList((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Navigatro Swap page
 * @param fromTokenAddress Optional, from token address
 * @param toTokenAddress Optional, to token address
 * @param amount Optional, amount, decimal digits example "10000", "100", 
 */
export function navigatorSwap(fromTokenAddress?: string, toTokenAddress?: string, amount?: string) {
  const obj = { from_token_address: fromTokenAddress, to_token_address: toTokenAddress, amount: amount }
  const json = JSON.stringify(obj);
  ParticleWalletPlugin.navigatorSwap(json);
}

/**
 * Show test network, default is false
 * @param isShow 
 */
export function showTestNetwork(isShow: boolean) {
  ParticleWalletPlugin.showTestNetwork(isShow);
}

/**
 * Show manage wallet page, default is true
 * @param isShow 
 */
export function showManageWallet(isShow: boolean) {
  ParticleWalletPlugin.showManageWallet(isShow);
}

/**
 * Support chainInfos
 * @param chainInfos ChainInfos
 */
export function supportChain(chainInfos: [ChainInfo]) {
  const json = JSON.stringify(chainInfos);
  ParticleWalletPlugin.supportChain(json);
}

/**
 * Enable pay feature, pay feature is default enable.
 * @param isEnable 
 */
export function enablePay(isEnable: boolean) {
  ParticleWalletPlugin.enablePay(isEnable);
}

/**
 * Get pay feature state
 * @returns Trus if enable, otherwise false
 */
export function getEnablePay() {
  return new Promise((resolve) => {
    ParticleWalletPlugin.getEnablePay((result: string) => {
      resolve(result)
    });
  });
}

/**
 * Enable swap feature, swap feature is default enable.
 * @param isEnable 
 */
export function enableSwap(isEnable: boolean) {
  ParticleWalletPlugin.enableSwap(isEnable);
}

/**
 * Get swap feature state
 * @returns Trus if enable, otherwise false
 */
export function getEnableSwap() {
  return new Promise((resolve) => {
    ParticleWalletPlugin.getEnableSwap((result: string) => {
      resolve(result)
    });
  });
}

/**
 * Switch wallet, tell GUI which wallet show when open
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @returns Result
 */
export function switchWallet(walletType: string, publicAddress: string): Promise<boolean> {
  const obj = { wallet_type: walletType, public_address: publicAddress };
  const json = JSON.stringify(obj);

  return new Promise((resolve) => {
    ParticleWalletPlugin.switchWallet(json, (result: string) => {
      resolve(JSON.parse(result))
    });
  });
}

/**
 * Set wallet page language
 * @param language Language
 */
export function setLanguage(language: Language) {
  ParticleWalletPlugin.setLanguage(language);
}

/**
 * Set wallet page interface style
 * @param userInterfaceStyle UserInterfaceStyle
 */
export function setInterfaceStyle(userInterfaceStyle: UserInterfaceStyle) {
  ParticleWalletPlugin.setInterfaceStyle(userInterfaceStyle);
}
