import { AccountName, VersionNumber } from '@particle-network/rn-auth';
import { NativeModules, Platform } from 'react-native';
import type { CommonError, CommonResp, WholeFeeQuote } from './Models';

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
 * @param accountName AccountName
 * @param biconomyAppKeys AA dapp keys
 */
export function init(
  accountName: AccountName,
  biconomyAppKeys: { [key: number]: string }
) {
  const obj = {
    biconomy_app_keys: biconomyAppKeys,
    name: accountName.name,
    version: accountName.version,
  };
  const json = JSON.stringify(obj);

  if (Platform.OS === 'ios') {
    ParticleAAPlugin.initialize(json);
  } else {
    ParticleAAPlugin.init(json);
  }
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
): Promise<WholeFeeQuote | CommonError> {
  const obj = {
    eoa_address: eoaAddress,
    transactions: transactions,
  };
  const json = JSON.stringify(obj);
  const result: CommonResp<WholeFeeQuote> = await new Promise((resolve) => {
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
