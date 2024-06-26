import { WalletType } from 'rn-connect-beta';

export interface PNAccount {
  walletType: WalletType;
  icons: string[];
  name: string;
  publicAddress: string;
  url: string;
}
