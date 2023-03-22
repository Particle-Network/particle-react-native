import axios from 'axios';
import type { ConnectionOptions, RequestArguments } from './types';

const instance = axios.create({
    baseURL: 'https://rpc.particle.network',
    timeout: 30_000, // 30 secs
});

function request(path: string, args: RequestArguments, config: ConnectionOptions) {
    args.jsonrpc = '2.0';
    if (!args.id) {
        args.id = randomId();
    }
    return instance
        .post(path, args, {
            params: {
                chainId: config.chainId,
                projectUuid: config.projectId,
                projectKey: config.clientKey,
            },
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then((res) => res.data);
}

export function randomId(): number {
    const date = Date.now() * Math.pow(10, 3);
    const extra = Math.floor(Math.random() * Math.pow(10, 3));
    return date + extra;
}

export function sendEVMRpc(args: RequestArguments, config: ConnectionOptions) {
    return request('/evm-chain', args, config);
}

export function sendSolanaRpc(args: RequestArguments, config: ConnectionOptions) {
    return request('/solana', args, config);
}

export function setBaseURL(baseURL: string) {
    instance.defaults.baseURL = baseURL;
}
