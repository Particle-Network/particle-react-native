import { AccountInfo } from "@particle-network/rn-connect";
import { type ChainInfo } from '@particle-network/chains';

export type RootStackParamList = {
    Home: { chainInfo?: ChainInfo, accountInfo?: AccountInfo};
    // ConnectDemo: undefined;
    SelectChainPage: undefined;
    SelectWalletPage: undefined;
    // AccountPage: undefined;
  };
  