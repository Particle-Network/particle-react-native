// import { LoginType } from '@particle-network/rn-auth';
import { LoginType } from '@particle-network/rn-base';
export interface RequestArguments {
    method: string;
    params?: any;
    id?: number | string;
    jsonrpc?: string;
}

export interface ProviderError {
    message: string;
    code: number | string;
    data?: unknown;
}

export const notSupportMethods = [
    'eth_signTransaction',
    'eth_sign',
    'eth_sendRawTransaction',
    'wallet_watchAsset', //EIP-747
    'wallet_addEthereumChain', //EIP-3085
    'eth_signTypedData_v1',
    'eth_signTypedData_v3',
];

export const signerMethods = [
    'eth_requestAccounts', //EIP-1102
    'eth_accounts',
    'eth_chainId',
    'eth_sendTransaction',
    'eth_signTypedData',
    'eth_signTypedData_v4',
    'eth_signTypedData_v4_unique',
    'personal_sign',
    'personal_sign_unique',
    'wallet_switchEthereumChain', //EIP-3326
];

export interface ParticleAuthCoreOptions {
    projectId: string;
    clientKey: string;
    loginType: LoginType;
}

export interface ConnectionOptions extends ParticleAuthCoreOptions {
    chainId: number;
}
