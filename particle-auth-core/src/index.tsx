import { NativeModules, Platform } from 'react-native';
import type { ChainInfo } from '@particle-network/chains';
import * as evm from './evm';
import * as solana from './solana';

const LINKING_ERROR =
  `The package 'react-native-particle-auth' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export const ParticleAuthCorePlugin = NativeModules.ParticleAuthCorePlugin
  ? NativeModules.ParticleAuthCorePlugin
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

/**
 * Init ParticleAuthCore SDK
 */
export function init() {
  if (Platform.OS === 'ios') {
    ParticleAuthCorePlugin.initialize("");
  } else {

  }
}



/**
 * Connect JWT
 * @param jwt JWT
 */
export async function connect(jwt: String): Promise<any> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.connect(jwt, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Disconnect
 */
export async function disconnect(): Promise<any> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.disconnect((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}


/**
 * Is user logged in, check locally.
 * @returns Result, if user is login return true, otherwise retrun false
 */
export async function isConnected(): Promise<boolean> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.isConnected((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Get user info
 * @returns User info json string
 */
export async function getUserInfo(): Promise<string> {
  return await ParticleAuthCorePlugin.getUserInfo();
}

/**
 * Switch chainInfo
 * @param chainInfo
 * @returns Result
 */
export async function switchChain(chainInfo: ChainInfo): Promise<boolean> {
  const obj = {
    chain_name: chainInfo.name,
    chain_id: chainInfo.id,
    chain_id_name: chainInfo.network,
  };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.switchChain(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Change master password
 * @returns 
 */
export function changeMasterPassword(): Promise<any> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.changeMasterPassword((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Has master password, get value from local user info.
 */
export async function hasMasterPassword(): Promise<any> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.hasMasterPassword((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
* Has payment password, get value from local user info.
*/
export async function hasPaymentPassword(): Promise<any> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.hasPaymentPassword((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Open account and security page
 * use DeviceEventEmitter.addListener('securityFailedCallBack', this.securityFailedCallBack) get securityFailedCallBack
 */
export async function openAccountAndSecurity(): Promise<any> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.openAccountAndSecurity((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Open web wallet
 */
export function openWebWallet(webStyle?: string) {
  ParticleAuthCorePlugin.openWebWallet(webStyle);
}


export { evm, solana }  
