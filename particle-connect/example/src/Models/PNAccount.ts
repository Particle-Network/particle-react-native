import { WalletType } from 'react-native-particle-connect';

export class PNAccount {
  static walletType: WalletType = WalletType.Particle;

  icons: [string];
  name: string;
  publicAddress: string;
  url: string;

  constructor(
    icons: [string],
    name: string,
    publicAddress: string,
    url: string
  ) {
    this.icons = icons;
    this.name = name;
    this.publicAddress = publicAddress;
    this.url = url;
  }

  static parseFrom(params: string): PNAccount {
    return JSON.parse(params) as PNAccount;
  }
}
