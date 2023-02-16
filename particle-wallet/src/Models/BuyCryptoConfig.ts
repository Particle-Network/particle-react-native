export class BuyCryptoConfig {
  walletAddres?: string;
  cryptoCoin?: string;
  fiatCoin?: string;
  fiatAmt?: number;
  network?: OpenBuyNetwork;

  /**
   *
   * @param walletAddres Your wallet address.
   * @param cryptoCoin Crypto coin symbol, like "ETH", "USDT", "BNB".
   * @param fiatCoin Fiat coin symbol, like "USD", "GBP", "USDT".
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
  Avalanche = 'Avalanche',
  Polygon = 'Polygon',
}
