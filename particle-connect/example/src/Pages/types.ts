import { AccountInfo, WalletType } from "@particle-network/rn-connect";
import { type ChainInfo } from '@particle-network/chains';

export type RootStackParamList = {
    Home: { chainInfo?: ChainInfo, accountInfo?: AccountInfo};
    SelectChainPage: undefined;
    SelectWalletPage: undefined;
    ConnectDemo: undefined;
    ConnectedWalletPage: {accountInfo: AccountInfo};
    // AccountPage: undefined;
  };
  