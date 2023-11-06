import type { ChainInfo } from '@particle-network/chains';
import { NativeModules, Platform } from 'react-native';
import type { CommonError, CommonResp, FeeQuote } from './Models';

const LINKING_ERROR =
  `The package '@particle-network/rn-aa' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ParticleAAPlugin = NativeModules.ParticleAAPlugin
  ? NativeModules.ParticleAAPlugin
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * Init particle AA service
 * @param dappAppKeys AA dapp keys
 */
export function init(
  dappAppKeys: { [key: number]: string }
) {
  const obj = {
    dapp_app_keys: dappAppKeys,
  };
  const json = JSON.stringify(obj);

  if (Platform.OS === 'ios') {
    ParticleAAPlugin.initialize(json);
  } else {
    ParticleAAPlugin.init(json);
  }
}

/**
 * Is support chain info
 * @param chainInfo ChainInfo
 * @returns
 */
export async function isSupportChainInfo(
  chainInfo: ChainInfo
): Promise<boolean> {
  const obj = {
    chain_id: chainInfo.id,
    chain_name: chainInfo.name,
  };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleAAPlugin.isSupportChainInfo(json, (result: boolean) => {
      resolve(result);
    });
  });
}

/**
 * Has eoa address deployed conract in current chain.
 * @param eoaAddress Eoa address
 * @returns
 */
export async function isDeploy(
  eoaAddress: string
): Promise<CommonResp<string>> {
  return new Promise((resolve) => {
    ParticleAAPlugin.isDeploy(eoaAddress, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Is AA mode enable
 * @returns
 */
export async function isAAModeEnable(): Promise<boolean> {
  return new Promise((resolve) => {
    ParticleAAPlugin.isAAModeEnable((result: boolean) => {
      resolve(result);
    });
  });
}

/**
 * Enable AA mode
 */
export function enableAAMode() {
  ParticleAAPlugin.enableAAMode();
}

/**
 * Disable AA mode
 */
export function disableAAMode() {
  ParticleAAPlugin.disableAAMode();
}

/**
 * Rpc get fee quotes
 * Pick one fee quote, then send with native, gasless or token.
 * @param eoaAddress Eoa address
 * @param transactions transactions
 * @returns
 */
export async function rpcGetFeeQuotes(
  eoaAddress: string,
  transactions: string[]
): Promise<FeeQuote[] | CommonError> {
  const obj = {
    eoa_address: eoaAddress,
    transactions: transactions,
  };
  const json = JSON.stringify(obj);
  const result: CommonResp<FeeQuote[]> = await new Promise((resolve) => {
    ParticleAAPlugin.rpcGetFeeQuotes(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });

  if (result.status) {
    const data = result.data;
    return data;
  } else {
    return Promise.reject(result.data);
  }
}

export * from './Models';