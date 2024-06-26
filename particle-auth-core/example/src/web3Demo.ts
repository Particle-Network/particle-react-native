// import type { LoginType } from '@particle-network/rn-auth';
import type { LoginType } from 'rn-base-beta';
// import { ParticleAuthCoreProvider } from '@particle-network/rn-auth-core';
import { ParticleAuthCoreProvider } from 'rn-auth-core-beta'; 
import Web3 from 'web3';

export const createWeb3 = (projectId: string, clientKey: string, loginType: LoginType) => {
    const provider = new ParticleAuthCoreProvider({ projectId, clientKey, loginType });
    // @ts-ignore
    const web3 = new Web3(provider);
    return web3;
};
