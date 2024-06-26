import type { Language } from 'rn-base-beta';

export interface BuyCryptoConfig {
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
  fixFiatCoin: boolean;
  /**
   * If fix fiat amount, default value is false
   */
  fixFiatAmt: boolean;
  /**
   * If fix crypto coin, default value is false
   */
  fixCryptoCoin: boolean;
  /**
   * Theme, light or dark
   */
  theme?: string; // light or dark
  /**
   * Language
   */
  language?: Language;
}

export enum OpenBuyNetwork {
  Solana = 'Solana',
  Ethereum = 'Ethereum',
  BinanceSmartChain = 'BinanceSmartChain',
  Optimism = 'Optimism',
  Polygon = 'Polygon',
  Tron = 'Tron',
  ArbitrumOne = 'ArbitrumOne',
  Avalanche = 'Avalanche',
  Celo = 'Celo',
  ZkSync = 'ZkSync',
  Base = 'Base',
  Linea = 'Linea',
  Mantle = 'Mantle',
}
