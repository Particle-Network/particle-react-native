import { AccountName } from '@particle-network/rn-auth';
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
 * if you prefer to use particle paymaster, you don't need to pass biconomyApiKeys.
 * In mainnet, fund in particle dashboard, the gasless transaction will work in mainnet.
 * In testnet, no need to fund, particle will handle the fees.
 * if you prefer to use biconomy paymaster, you should pass the right api keys.
 * @param accountName AccountName
 * @param biconomyAppKeys Optional, biconomy api keys
 */
export function init(
  accountName: AccountName,
  biconomyAppKeys?: { [key: number]: string }
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
): Promise<string> {
  return new Promise((resolve, reject) => {
    ParticleAAPlugin.isDeploy(eoaAddress, (result: string) => {
      const parsedResult: CommonResp<string> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as string);
      } else {
        reject(parsedResult.data as CommonError);
      }
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
): Promise<WholeFeeQuote> {
  const obj = {
    eoa_address: eoaAddress,
    transactions: transactions,
  };
  const json = JSON.stringify(obj);

  return new Promise((resolve, reject) => {
    ParticleAAPlugin.rpcGetFeeQuotes(json, (result: string) => {
      const parsedResult: CommonResp<WholeFeeQuote> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as WholeFeeQuote);
      } else {
        reject(parsedResult.data as CommonError);
      }
    });
  });
}

export * from './Models';
