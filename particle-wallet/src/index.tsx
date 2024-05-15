import type { ChainInfo } from '@particle-network/chains';
import type { WalletDisplay } from '@particle-network/rn-auth';
import type { WalletType } from '@particle-network/rn-connect';
import { NativeModules, Platform } from 'react-native';
import type { BuyCryptoConfig, WalletMetaData } from './Models';

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
export function initWallet(walletMetaData: WalletMetaData) {
  if (Platform.OS === 'android') {
    ParticleWalletPlugin.init();
  }

  if (Platform.OS === 'ios') {
    const json = JSON.stringify(walletMetaData);
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

export function createSelectedWallet(
  publicAddress: string,
  walletType: WalletType
) {
  if (Platform.OS == 'android') {
    ParticleWalletPlugin.createSelectedWallet(publicAddress, walletType);
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
      network: config.network,
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

/**
 * Navigator login list page
 * @returns  Result, account or eror
 */
export function navigatorLoginList(): Promise<any> {
  return new Promise((resolve) => {
    ParticleWalletPlugin.navigatorLoginList((result: string) => {
      console.log('navigatorLoginList', JSON.parse(result));
      resolve(JSON.parse(result));
    });
  });
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
export function getPayDisabled(): Promise<any> {
  return new Promise((resolve) => {
    ParticleWalletPlugin.getPayDisabled((result: string) => {
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
export function getSwapDisabled(): Promise<any> {
  return new Promise((resolve) => {
    ParticleWalletPlugin.getSwapDisabled((result: string) => {
      resolve(result);
    });
  });
}

/**
 * Switch wallet, tell GUI which wallet show when open
 * @param walletType Wallet type
 * @param publicAddress Public address
 * @param pnWalletName Works for Android, to customize the wallet name
 * @returns Result
 */
export function switchWallet(
  walletType: string,
  publicAddress: string,
  pnWalletName?: string
): Promise<boolean> {

  const obj = { wallet_type: walletType, public_address: publicAddress, wallet_name: pnWalletName };
  const json = JSON.stringify(obj);

  if (Platform.OS === 'ios') {
    return new Promise((resolve) => {
      ParticleWalletPlugin.switchWallet(json, (result: string) => {
        resolve(JSON.parse(result));
      });
    });
  }
  else {
    return new Promise((resolve) => {
      ParticleWalletPlugin.setWallet(json, (result: string) => {
        resolve(JSON.parse(result));
      });
    });
  }
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
 * In Android, you need call switchWallet to set the wallet name
 * @param name Wallet name, for Android, you need call switch wallet to customize the wallet name
 * @param icon Wallet icon, a uri such as https://example.com/1.png
 */
export function setCustomWalletName(name: string, icon: string) {
  const obj = { name: name, icon: icon };
  const json = JSON.stringify(obj);
  ParticleWalletPlugin.setCustomWalletName(json);
}

/**
 * Set custom localizable strings, should call before open any wallet page.
 * Not support Android
 * @param json Json string
 */
export function setCustomLocalizable(localizables: string) {
  if (Platform.OS === 'ios') {
    const json = JSON.stringify(localizables)
    ParticleWalletPlugin.setCustomLocalizable(json);
  }
}

export * from './Models';
