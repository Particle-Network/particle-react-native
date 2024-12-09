import type { Language } from '@particle-network/rn-base';
import type { ChainInfo} from '@particle-network/chains'
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
  chainInfo?: ChainInfo;
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
