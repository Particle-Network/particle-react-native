import { AccountInfo, WalletType } from "rn-connect-beta";
import { type ChainInfo } from '@particle-network/chains';

export type RootStackParamList = {
    Home: { chainInfo?: ChainInfo, accountInfo?: AccountInfo};
    SelectChainPage: undefined;
    SelectWalletPage: undefined;
    ConnectDemo: undefined;
    ConnectedWalletPage: {accountInfo: AccountInfo};
    // AccountPage: undefined;
  };
