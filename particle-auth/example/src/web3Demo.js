import Web3 from 'web3';
import { ParticleProvider } from 'react-native-particle-auth';

const createWeb3 = (projectId, clientKey) => {
  const provider = new ParticleProvider({ projectId, clientKey });
  const web3 = new Web3(provider);
  return web3;
};
