import Web3 from 'web3';
import { ParticleConnectProvider, WalletType } from 'react-native-particle-connect';

/// Get a new web3 object, use this method when didn't connect any wallet type, public address
export const createWeb3 = (projectId: string, clientKey: string, walletType: WalletType) => {
  const provider = new ParticleConnectProvider({ projectId, clientKey, walletType});
  // @ts-ignore
  const web3 = new Web3(provider);
  return web3;
};

/// Get an exists web3 object, use this method when your address is connected before.
export const restoreWeb3 = (projectId: string, clientKey: string, walletType: WalletType, publicAddress: string) => {
    const provider = new ParticleConnectProvider({ projectId, clientKey, walletType, publicAddress});
    // @ts-ignore
    const web3 = new Web3(provider)
    return web3;
};

