import type { Language } from "react-native-particle-auth";

export class BuyCryptoConfig {
  /**
   * Public address
   */
  walletAddres?: string;
  /**
   * Crypto coin symbol, like 'ETH', 'USDT', 'BNB'
   */
  cryptoCoin?: string;
  /**
   * Fiat coin symbol, like 'USD', 'JPY', 'HKD'
   */
  fiatCoin?: string;
  /**
   * Fiat coin amount, like 300, 1000.
   */
  fiatAmt?: number;
  /**
   * Open buy network
   */
  network?: OpenBuyNetwork;
  /**
   * If fix fiat coin, default value is false
   */
  fixFiatCoin: boolean = false
  /**
   * If fix fiat amount, default value is false
   */
  fixFiatAmt: boolean = false
  /**
   * If fix crypto coin, default value is false
   */
  fixCryptoCoin: boolean = false
  /**
   * Theme, light or dark
   */
  theme?: string; // light or dark
  /**
   * Language
   */
  language?: Language; 

  /**
   *
   * @param walletAddres Your wallet address.
   * @param cryptoCoin Crypto coin symbol, like "ETH", "USDT", "BNB".
   * @param fiatCoin Fiat coin symbol, like "USD", "JPY", "HKD"
   * @param fiatAmt Fiat coin amount, like 300, 1000.
   * @param network Network
   */
  constructor(
    walletAddres?: string,
    cryptoCoin?: string,
    fiatCoin?: string,
    fiatAmt?: number,
    network?: OpenBuyNetwork
  ) {
    this.walletAddres = walletAddres;
    this.cryptoCoin = cryptoCoin;
    this.fiatCoin = fiatCoin;
    this.fiatAmt = fiatAmt;
    this.network = network;
  }
}

export enum OpenBuyNetwork {
  Solana = 'Solana',
  Ethereum = 'Ethereum',
  BinanceSmartChain = 'BinanceSmartChain',
  Optimism = 'Optimism',
  Polygon = 'Polygon',
  Tron = 'Tron',
  ArbitrumOne = 'ArbitrumOne'
}
