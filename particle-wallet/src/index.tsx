import type { ChainInfo } from '@particle-network/chains';
import type { WalletDisplay } from '@particle-network/rn-base';
import type { WalletType, DappMetaData } from '@particle-network/rn-connect';
import { NativeModules, Platform } from 'react-native';
import { BuyCryptoConfig } from './Models/BuyCryptoConfig';
import * as particleConnect from '@particle-network/rn-connect';

const LINKING_ERROR =
  `The package '@particle-network/rn-wallet' doesn't seem to be linked. Make sure: \n\n` +
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
export function initWallet(metaData: DappMetaData) {
  if (Platform.OS === 'android') {
    ParticleWalletPlugin.init();
  }

  if (Platform.OS === 'ios') {
    const json = JSON.stringify(metaData);
    ParticleWalletPlugin.initializeWalletMetaData(json);
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
 * After login before open wallet page, call this method to confirm unique wallet.
 * @param publicAddress Public address
 * @param walletType WalletType
 * @param walletName Customize wallet name, works for Android. In iOS, you can call setCustomWalletName to customize wallet name and icon.
 * @returns Result
 */
export async function createSelectedWallet(
  publicAddress: string,
  walletType: WalletType,
  walletName?: string
): Promise<boolean> {
  if (Platform.OS == 'android') {
    ParticleWalletPlugin.createSelectedWallet(publicAddress, walletType, walletName);
    return new Promise(() => {
      return true;
    });
  } else {
    const obj = { wallet_type: walletType, public_address: publicAddress, wallet_name: walletName };
    const json = JSON.stringify(obj);

    return new Promise((resolve) => {
      ParticleWalletPlugin.switchWallet(json, (result: string) => {
        resolve(JSON.parse(result));
      });
    });
  }
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
export function navigatorTokenSend(
  tokenAddress?: string,
  toAddress?: string,
  amount?: string
) {
  const obj = {
    token_address: tokenAddress,
    to_address: toAddress,
    amount: amount,
  };
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
 *
 * @param mint NFT contract/mint address
 * @param tokenId NFT token id, for solana nft, pass ""
 * @param receiverAddress Optional, receiver address
 * @param amount Optional, for solana nft, pass null, for erc721 nft, it is a useless parameter, pass null, for erc1155 nft, you can pass amount string, such as "1", "100", "10000"
 */
export function navigatorNFTSend(
  mint: string,
  tokenId: string,
  receiverAddress?: string,
  amount?: string
) {
  const obj = {
    mint: mint,
    receiver_address: receiverAddress,
    token_id: tokenId,
    amount: amount,
  };
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
export function navigatorBuyCrypto(config?: BuyCryptoConfig) {
  if (config != null) {
    const obj = {
      wallet_address: config.walletAddres,
      network: { chain_id: config.chainInfo?.id, chain_name: config.chainInfo?.name },
      crypto_coin: config.cryptoCoin,
      fiat_coin: config.fiatCoin,
      fiat_amt: config.fiatAmt,
      fix_fiat_coin: config.fixFiatCoin,
      fix_fiat_amt: config.fixFiatAmt,
      fix_crypto_coin: config.fixCryptoCoin,
      theme: config.theme,
      language: config.language,
    };
    const json = JSON.stringify(obj);
    ParticleWalletPlugin.navigatorBuyCrypto(json);
  } else {
    ParticleWalletPlugin.navigatorBuyCrypto(config);
  }
}

export function navigatorWalletConnect(): Promise<any> {
  if (Platform.OS === 'android') {
    return new Promise((resolve) => {
      ParticleWalletPlugin.navigatorWalletConnect((result: string) => {
        console.log('navigatorLoginList', JSON.parse(result));
        resolve(JSON.parse(result));
      });
    });
  }

  return Promise.resolve(null);
}

/**
 * Navigatro Swap page
 * @param fromTokenAddress Optional, from token address
 * @param toTokenAddress Optional, to token address
 * @param amount Optional, amount, decimal digits example "10000", "100",
 */
export function navigatorSwap(
  fromTokenAddress?: string,
  toTokenAddress?: string,
  amount?: string
) {
  const obj = {
    from_token_address: fromTokenAddress,
    to_token_address: toTokenAddress,
    amount: amount,
  };
  const json = JSON.stringify(obj);
  ParticleWalletPlugin.navigatorSwap(json);
}

/**
 * Show test network, default is false
 * @param isShow
 */
export function setShowTestNetwork(isShow: boolean) {
  ParticleWalletPlugin.setShowTestNetwork(isShow);
}

/**
 * Show smart account in setting page, default is true, works when add particle-aa and enable aa service.
 * @param isShow
 */
export function setShowSmartAccountSetting(isShow: boolean) {
  if (Platform.OS === 'ios') {
    ParticleWalletPlugin.setShowSmartAccountSetting(isShow);
  }
}

/**
 * Show manage wallet page, default is true
 * @param isShow
 */
export function setShowManageWallet(isShow: boolean) {
  ParticleWalletPlugin.setShowManageWallet(isShow);
}

/**
 * Support chainInfos
 * @param chainInfos ChainInfos
 */
export function setSupportChain(chainInfos: ChainInfo[]) {
  const chainInfoObjects = chainInfos.map((info) => ({
    chain_name: info.name,
    chain_id_name: info.network,
    chain_id: info.id,
  }));
  const json = JSON.stringify(chainInfoObjects);
  ParticleWalletPlugin.setSupportChain(json);
}

/**
 * Set pay disabled, default value is false.
 * @param disabled
 */
export function setPayDisabled(disabled: boolean) {
  ParticleWalletPlugin.setPayDisabled(disabled);
}

/**
 * Get pay disabled state
 * @returns Trus if disabled, otherwise false
 */
export function getPayDisabled(): Promise<boolean> {
  return new Promise((resolve) => {
    ParticleWalletPlugin.getPayDisabled((result: boolean) => {
      console.log('getPayDisabled', result);
      resolve(result);
    });
  });
}

/**
 * Set swap disabled, default value is false.
 * @param disabled
 */
export function setSwapDisabled(disabled: boolean) {
  ParticleWalletPlugin.setSwapDisabled(disabled);
}

/**
 * Get swap disabled state
 * @returns Trus if disabled, otherwise true
 */
export function getSwapDisabled(): Promise<boolean> {
  return new Promise((resolve) => {
    ParticleWalletPlugin.getSwapDisabled((result: boolean) => {
      resolve(result);
    });
  });
}

/**
 * Set bridge disabled, default value is false.
 * @param disabled
 */
export function setBridgeDisabled(disabled: boolean) {
  ParticleWalletPlugin.setBridgeDisabled(disabled);
}

/**
 * Get bridge disabled state
 * @returns Trus if disabled, otherwise true
 */
export function getBridgeDisabled(): Promise<boolean> {
  return new Promise((resolve) => {
    ParticleWalletPlugin.getBridgeDisabled((result: boolean) => {
      resolve(result);
    });
  });
}

/**
 * Set display token addresses
 *
 * If you called this method, Wallet SDK will only show these tokens in the token addresses.
 * @param tokenAddresses TokenAddress array
 */
export function setDisplayTokenAddresses(tokenAddresses: string[]) {
  const json = JSON.stringify(tokenAddresses);
  ParticleWalletPlugin.setDisplayTokenAddresses(json);
}

/**
 * Set display NFT contract addresses
 *
 * If you called this method, Wallet SDK will only show NFTs in the NFT contract addresses.
 * @param nftContractAddresses
 */
export function setDisplayNFTContractAddresses(nftContractAddresses: string[]) {
  const json = JSON.stringify(nftContractAddresses);
  ParticleWalletPlugin.setDisplayNFTContractAddresses(json);
}

/**
 * Set priority token addresses
 *
 * If you called this method, Wallet SDK will show these tokens in top part of the list.
 * @param tokenAddresses TokenAddress array
 */
export function setPriorityTokenAddresses(tokenAddresses: string[]) {
  const json = JSON.stringify(tokenAddresses);
  console.log('setPriorityTokenAddresses', json);
  ParticleWalletPlugin.setPriorityTokenAddresses(json);
}

/**
 * Set priority NFT contract addresses
 *
 * If you called this method, Wallet SDK will only show NFTs in top part of list.
 * @param nftContractAddresses
 */
export function setPriorityNFTContractAddresses(
  nftContractAddresses: string[]
) {
  const json = JSON.stringify(nftContractAddresses);
  ParticleWalletPlugin.setPriorityNFTContractAddresses(json);
}

/**
 * Set show language setting button in setting page
 * @param isShow default value is false
 */
export function setShowLanguageSetting(isShow: boolean) {
  ParticleWalletPlugin.setShowLanguageSetting(isShow);
}

/**
 * Set show appearance setting button in setting page
 * @param isShow default value is false
 */
export function setShowAppearanceSetting(isShow: boolean) {
  ParticleWalletPlugin.setShowAppearanceSetting(isShow);
}

/**
 * Set support add token, true will show add token button, false will hide add token button.
 * @param isShow default value is true
 */
export function setSupportAddToken(isShow: boolean) {
  ParticleWalletPlugin.setSupportAddToken(isShow);
}

/**
 * Set wallet if support wallet connect as a wallet
 * not support for now, coming soon.
 * @param isEnable
 */
export function setSupportWalletConnect(isEnable: boolean) {
  ParticleWalletPlugin.setSupportWalletConnect(isEnable);
}

/**
 * Set support dapp browser in wallet page, default value is true.
 * @param isShow
 */
export function setSupportDappBrowser(isShow: boolean) {
  ParticleWalletPlugin.setSupportDappBrowser(isShow);
}

/**
 * Set custom wallet name and icon, should call before login/connect, only support particle wallet.
 * In Android, you need call createSelectedWallet to set the wallet name
 * @param name Wallet name, for Android, you need call createSelectedWallet to customize the wallet name after particle wallet connected
 * @param icon Wallet icon, a uri such as https://example.com/1.png
 */
export function setCustomWalletName(name: string, icon: string) {
  if (Platform.OS === 'ios') {
    const obj = { name: name, icon: icon };
    const json = JSON.stringify(obj);
    ParticleWalletPlugin.setCustomWalletName(json);
  } else {
    ParticleWalletPlugin.setCustomWalletIcon(icon);
  }
}

/**
 * Set custom localizable strings, should call before open any wallet page.
 * Not support Android
 * @param json Json string
 */
export function setCustomLocalizable(localizables: string) {
  if (Platform.OS === 'ios') {
    const json = JSON.stringify(localizables);
    ParticleWalletPlugin.setCustomLocalizable(json);
  }
}

/**
 * Navigator dapp browser page.
 * @param url Dapp url, could pass empty string to show default browser page.
 */
export function navigatorDappBrowser(url: string) {
  const obj = { url: url };
  const json = JSON.stringify(obj);
  if (Platform.OS === 'ios') {
    ParticleWalletPlugin.navigatorDappBrowser(json);
  } else {
    ParticleWalletPlugin.navigatorDappBrowser(url);
  }
}

/**
 * Set WalletConnect ProjectId
 */
export function setWalletConnectProjectId(
  walletConnectProjectId: string,
) {
  if (Platform.OS === 'ios') {
    ParticleWalletPlugin.navigatorDappBrowser(walletConnectProjectId);
  } else {
    particleConnect.setWalletConnectProjectId(walletConnectProjectId)
  }
}

export * from './Models';
