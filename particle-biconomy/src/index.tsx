import type { ChainInfo } from '@particle-network/chains';
import { NativeModules, Platform } from 'react-native';
import type { BiconomyVersion } from 'react-native-particle-auth';
import type { CommonResp, ErrResp, FeeQuote } from './Models';

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
export function init(
  version: BiconomyVersion,
  dappAppKeys: { [key: number]: string }
) {
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
export async function isSupportChainInfo(
  chainInfo: ChainInfo
): Promise<boolean> {
  const obj = {
    chain_id: chainInfo.id,
    chain_name: chainInfo.name,
    chain_id_name: chainInfo.network,
  };
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
export async function isDeploy(
  eoaAddress: string
): Promise<CommonResp<string>> {
  return new Promise((resolve) => {
    ParticleBiconomyPlugin.isDeploy(eoaAddress, (result: string) => {
      console.log('isDeploy22', JSON.parse(result));
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Is biconomy mode enable
 * @returns
 */
export async function isBiconomyModeEnable(): Promise<boolean> {
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
  ParticleBiconomyPlugin.enableBiconomyMode();
}

/**
 * Disable biconomy mode
 */
export function disableBiconomyMode() {
  ParticleBiconomyPlugin.disableBiconomyMode();
}

/**
 * Rpc get fee quotes
 * Pick one fee quote, then send with BiconomyFeeMode.custom
 * @param eoaAddress Eoa address
 * @param transactions transactions
 * @returns
 */
export async function rpcrpcGetFeeQuotes(
  eoaAddress: string,
  transactions: string[]
): Promise<FeeQuote[] | ErrResp> {
  const obj = {
    eoa_address: eoaAddress,
    transactions: transactions,
  };
  const json = JSON.stringify(obj);
  const result: CommonResp<FeeQuote[]> = await new Promise((resolve) => {
    ParticleBiconomyPlugin.rpcGetFeeQuotes(json, (result: string) => {
      console.log('rpcGetFeeQuotes', JSON.parse(result));
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
