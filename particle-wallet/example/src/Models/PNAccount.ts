import { WalletType } from '@particle-network/rn-connect';

export interface PNAccount {
  walletType: WalletType;
  icons: string[];
  name: string;
  publicAddress: string;
  url: string;
}
