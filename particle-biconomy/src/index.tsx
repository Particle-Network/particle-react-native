import { NativeModules, Platform } from 'react-native';
import type  { BiconomyVersion, ChainInfo } from 'react-native-particle-auth';

const LINKING_ERROR =
  `The package 'react-native-particle-biconomy' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ParticleBiconomyPlugin = NativeModules.ParticleBiconomyPlugin
  ? NativeModules.ParticleBiconomyPlugin
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

  /**
   * Init particle biconomy service
   * @param version Biconomy Version
   * @param dappAppKeys Biconomy dapp keys
   */
export function init(version: BiconomyVersion, dappAppKeys: { [key: number]: string }) {
  const obj = {
    version: version,
    dapp_app_keys: dappAppKeys,
  };
  const json = JSON.stringify(obj);

  if (Platform.OS === 'ios') {
    ParticleBiconomyPlugin.initialize(json);
  } else {
    ParticleBiconomyPlugin.init(json);
  }
}

/**
 * Is support chain info
 * @param chainInfo ChainInfo
 * @returns 
 */
export function isSupportChainInfo(chainInfo: ChainInfo): Promise<boolean> {
  const obj = chainInfo;
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleBiconomyPlugin.isSupportChainInfo(json, (result: boolean) => {
      resolve(result);
    });
  });
}


/**
 * Has eoa address deployed conract in current chain.
 * @param eoaAddress Eoa address
 * @returns 
 */
export function isDeploy(eoaAddress: string): Promise<string> {
  return new Promise((resolve) => {
    ParticleBiconomyPlugin.isDeploy(eoaAddress, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Is biconomy mode enable
 * @returns 
 */
export function isBiconomyModeEnable(): Promise<boolean> {
  return new Promise((resolve) => {
    ParticleBiconomyPlugin.isBiconomyModeEnable((result: boolean) => {
      resolve(result);
    });
  });
}

/**
 * Enable biconomy mode
 */
export function enableBiconomyMode() {
  ParticleBiconomyPlugin.enableBiconomyMode()
}

/**
 * Disable biconomy mode
 */
export function disableBiconomyMode() {
  ParticleBiconomyPlugin.disableBiconomyMode()
}

/**
 * Rpc get fee quotes
 * Pick one fee quote, then send with BiconomyFeeMode.custom
 * @param eoaAddress Eoa address
 * @param transactions transactions
 * @returns 
 */
export async function rpcGetFeeQuotes(eoaAddress: string, transactions: string[]): Promise<any[]> {
  const obj = {
    eoa_address: eoaAddress,
    transactions: transactions
  };
  const json = JSON.stringify(obj);
  const result: any = await new Promise((resolve) => {
    ParticleBiconomyPlugin.rpcGetFeeQuotes(json, (result: any) => {
      resolve(JSON.parse(result));
    });
  });

  if (result.status) {
    const data = result.data
    return data as any[]
  } else {
    return Promise.reject(result.data)
  }
}
 