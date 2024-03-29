import { ParticleProvider } from '@particle-network/rn-auth';
import Web3 from 'web3';

export const createWeb3 = (projectId: string, clientKey: string) => {
    const provider = new ParticleProvider({ projectId, clientKey });
    // @ts-ignore
    const web3 = new Web3(provider);
    return web3;
};
