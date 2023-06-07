import { NativeModules, Platform } from 'react-native';
import type  { BiconomyVersion } from 'react-native-particle-auth';

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

export function isSupportChainInfo(chainId: string, chainName: string, chainIdName: string): Promise<boolean> {
  const obj = {
    chain_name: chainName,
    chain_id: chainId,
    chain_id_name: chainIdName,
  };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleBiconomyPlugin.isSupportChainInfo(json, (result: boolean) => {
      resolve(result);
    });
  });
}

export function isDeploy(eoaAddress: string): Promise<boolean> {
  return new Promise((resolve) => {
    ParticleBiconomyPlugin.isDeploy(eoaAddress, (result: boolean) => {
      resolve(result);
    });
  });
}

export function isBiconomyModeEnable() {
  return ParticleBiconomyPlugin.isBiconomyModeEnable();
}

export function enableBiconomyMode() {
  ParticleBiconomyPlugin.enableBiconomyMode()
}

export function disableBiconomyMode() {
  ParticleBiconomyPlugin.disableBiconomyMode()
}

export function rpcGetFeeQuotes(eoaAddress: string, transactions: string[]): Promise<any[]> {
  const obj = {
    eoaAddress: eoaAddress,
    transactions: transactions
  };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleBiconomyPlugin.rpcGetFeeQuotes(json, (result: any) => {
      resolve(JSON.parse(result));
    });
  });
}
 