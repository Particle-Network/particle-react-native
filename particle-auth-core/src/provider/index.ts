import { chains } from '@particle-network/chains';
import { EventEmitter } from 'events';
import * as particleAuthCore from '../index';
import * as particleAuth from '@particle-network/rn-auth';
import { LoginType, SupportAuthType } from '@particle-network/rn-auth';
import { sendEVMRpc } from './connection';
import type { ParticleOptions, RequestArguments } from './types';
import { notSupportMethods, signerMethods } from './types';
import * as evm from '../evm';

class ParticleAuthCoreProvider {
    private events = new EventEmitter();

    constructor(private options: ParticleOptions) {
        console.log(this.options, particleAuthCore);
        this.events.setMaxListeners(100);
    }

    public on(event: string | symbol, listener: any): void {
        this.events.on(event, listener);
    }

    public once(event: string | symbol, listener: any): void {
        this.events.once(event, listener);
    }

    public off(event: string | symbol, listener: any): void {
        this.events.off(event, listener);
    }

    public removeListener(event: string | symbol, listener: any): void {
        this.events.removeListener(event, listener);
    }

    public removeAllListeners(event: string | symbol): void {
        this.events.removeAllListeners(event);
    }

    public async enable(): Promise<string[]> {
        return this.request({
            method: 'eth_requestAccounts',
        });
    }

    public async request(payload: RequestArguments) {
        if (!payload.method || notSupportMethods.includes(payload.method)) {
            return Promise.reject({
                code: -32601,
                message: 'Method not supported',
            });
        }
        if (signerMethods.includes(payload.method)) {
            if (payload.method === 'eth_chainId') {
                const chainInfo = await particleAuth.getChainInfo();
                return Promise.resolve(`0x${chainInfo.id.toString(16)}`);
            } else if (payload.method === 'eth_accounts' || payload.method === 'eth_requestAccounts') {
                const isLogin = await particleAuthCore.isConnected();
                if (!isLogin) {
                    await particleAuthCore.connect(LoginType.Email, undefined, [SupportAuthType.All]);
                }
                const account = await evm.getAddress();
                return [account];
            } else if (payload.method === 'eth_sendTransaction') {
                const txData = payload.params[0];
                if (!txData.chainId) {
                    const chainInfo = await particleAuth.getChainInfo();
                    txData.chainId = `0x${chainInfo.id.toString(16)}`;
                }
                const tx = Buffer.from(JSON.stringify(txData)).toString('hex');
                const result: any = await evm.sendTransaction(`0x${tx}`);
                if (result.status) {
                    return result.data;
                } else {
                    return Promise.reject(result.data);
                }
            } else if (payload.method === 'personal_sign') {
                const result = await evm.personalSign(payload.params[0]);
                if (result.status) {
                    return result.data;
                } else {
                    return Promise.reject(result.data);
                }
            } else if (payload.method === 'personal_sign_unique') {
                const result = await evm.personalSignUnique(payload.params[0]);
                if (result.status) {
                    return result.data;
                } else {
                    return Promise.reject(result.data);
                }
            } else if (payload.method === 'wallet_switchEthereumChain') {
                const chainId = Number(payload.params[0].chainId);

                const chainInfo = chains.getEVMChainInfoById(chainId);
                if (!chainInfo) {
                    return Promise.reject({
                        code: 4201,
                        message: 'The Provider does not support the chain',
                    });
                }
                const result = await particleAuth.setChainInfo(chainInfo);
                if (result) {
                    return Promise.resolve(null);
                } else {
                    return Promise.reject({ message: 'switch chain failed' });
                }
            } else if (payload.method === 'eth_signTypedData' || payload.method === 'eth_signTypedData_v4') {
                const typedData = JSON.stringify(payload.params[1]);
                const result = await evm.signTypedData(
                    typedData
                );
                if (result.status) {
                    return result.data;
                } else {
                    return Promise.reject(result.data);
                }
            } else if (payload.method === 'eth_signTypedData_v4_unique') {
                const typedData = JSON.stringify(payload.params[1]);
                const result = await evm.signTypedDataUnique(typedData);
                if (result.status) {
                    return result.data;
                } else {
                    return Promise.reject(result.data);
                }
            } else {
                return Promise.reject({
                    code: 4200,
                    message: 'The Provider does not support the requested method',
                });
            }
        } else {
            const chainInfo = await particleAuth.getChainInfo();
            return sendEVMRpc(payload, {
                ...this.options,
                chainId: chainInfo.id,
            }).then((output) => {
                if (output.error) {
                    return Promise.reject(output.error);
                } else {
                    return Promise.resolve(output.result);
                }
            });
        }
    }
}

export { ParticleAuthCoreProvider };
