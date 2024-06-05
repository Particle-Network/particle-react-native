import { chains } from '@particle-network/chains';
import * as particleAuth from '@particle-network/rn-auth';
import { EventEmitter } from 'events';
import type { AccountInfo } from '../Models';
import * as particleConnect from '../index';
import { sendEVMRpc } from './connection';
import type { ParticleConnectOptions, RequestArguments } from './types';
import { notSupportMethods, signerMethods } from './types';

class ParticleConnectProvider {
  private events = new EventEmitter();

  constructor(private options: ParticleConnectOptions) {
    console.log(this.options, particleConnect);
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
      } else if (
        payload.method === 'eth_accounts' ||
        payload.method === 'eth_requestAccounts'
      ) {
        // check is the publicAddress is connected already
        let isConnected = false;
        if (this.options.publicAddress == undefined) {
          isConnected = false;
        } else {
          isConnected = await particleConnect.isConnected(
            this.options.walletType,
            this.options.publicAddress
          );
        }
        if (!isConnected) {
          const result = await particleConnect.connect(this.options.walletType);
          if (result.status) {
            return [(result.data as AccountInfo).publicAddress];
          } else {
            Promise.reject(result.data);
          }
        } else {
          return [this.options.publicAddress];
        }
      } else if (payload.method === 'eth_sendTransaction') {
        const txData = payload.params[0];
        if (!txData.chainId) {
          const chainInfo = await particleAuth.getChainInfo();
          txData.chainId = `0x${chainInfo.id.toString(16)}`;
        }
        const tx = Buffer.from(JSON.stringify(txData)).toString('hex');
        // const result: any = await particleConnect.signAndSendTransaction(
        //   `0x${tx}`
        // );

        const publicAddress = txData.from;

        const result: any = await particleConnect.signAndSendTransaction(
          this.options.walletType,
          publicAddress,
          `0x${tx}`
        );
        if (result.status) {
          return result.data;
        } else {
          return Promise.reject(result.data);
        }
      } else if (payload.method === 'personal_sign') {
        const publicAddress = payload.params[1];
        const result: any = await particleConnect.signMessage(
          this.options.walletType,
          publicAddress,
          payload.params[0]
        );
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
      } else if (payload.method === 'eth_signTypedData_v4') {
        const typedData = JSON.stringify(payload.params[1]);
        const publicAddress = payload.params[0];
        const result: any = await particleConnect.signTypedData(
          this.options.walletType,
          publicAddress,
          typedData
        );
        if (result.status) {
          return result.data;
        } else {
          return Promise.reject(result.data);
        }
      } else if (
        payload.method === 'eth_signTypedData' ||
        payload.method === 'eth_signTypedData_v1' ||
        payload.method === 'eth_signTypedData_v3'
      ) {
        return Promise.reject({
          code: 4200,
          message: 'The Provider does not support the requested method',
        });
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

export { ParticleConnectProvider };
