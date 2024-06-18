import { WalletType } from '@particle-network/rn-connect';

export class PNAccount {
  walletType: WalletType;
  icons: string[];
  name: string;
  publicAddress: string;
  url: string;

  constructor(
    walletType: WalletType,
    icons: string[],
    name: string,
    publicAddress: string,
    url: string
  ) {
    this.walletType = walletType;
    this.icons = icons;
    this.name = name;
    this.publicAddress = publicAddress;
    this.url = url;
  }

  static parseFrom(params: string): PNAccount {
    return JSON.parse(params) as PNAccount;
  }
}
