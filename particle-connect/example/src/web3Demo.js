import Web3 from 'web3';
import { ParticleConnectProvider } from 'react-native-particle-connect';

/// Get a new web3 object, use this method when didn't connect any wallet type, public address
export const createWeb3 = (projectId, clientKey, walletType) => {
  const provider = new ParticleConnectProvider({ projectId, clientKey, walletType});
  const web3 = new Web3(provider);
  return web3;
};

/// Get an exists web3 object, use this method when your address is connected before.
export const restoreWeb3 = (projectId, clientKey, walletType, publicAddress) => {
    const provider = new ParticleConnectProvider({ projectId, clientKey, walletType, publicAddress});
    const web3 = new Web3(provider);
    return web3;
};

