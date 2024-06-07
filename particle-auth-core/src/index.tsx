import type { ChainInfo } from '@particle-network/chains';
import { NativeModules, Platform } from 'react-native';
import type { CommonResp, UserInfo } from './Models';
import * as evm from './evm';
import * as solana from './solana';
import { LoginType, SupportAuthType, type LoginPageConfig, type SocialLoginPrompt } from '@particle-network/rn-auth';

const LINKING_ERROR =
  `The package '@particle-network/rn-auth' doesn't seem to be linked. Make sure: \n\n` +
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
    ParticleAuthCorePlugin.initialize('');
  } else {
    ParticleAuthCorePlugin.init();
  }
}

/**
 * Connect 
 * @param type LoginType
 * @param account Optional, phone number, email or jwt, phone number request format E.164, such as '+11234567890' '+442012345678' '+8613611112222'
 * @param code Phone code or email code
 * @param socialLoginPrompt SocialLoginPrompt
 * @param loginPageConfig Login page config, imagePath support both icon url and base64 string.
 */
export async function connect(type: LoginType, account?: String | null, supportAuthType?: SupportAuthType[], socialLoginPrompt?: SocialLoginPrompt | null, loginPageConfig?: LoginPageConfig | null): Promise<CommonResp<UserInfo>> {
  const obj = {
    login_type: type,
    account: account,
    support_auth_type_values: supportAuthType,
    social_login_prompt: socialLoginPrompt,
    login_page_config: loginPageConfig
  };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.connect(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Connect JWT
 * @param jwt JWT
 */
export async function connectJWT(jwt: String): Promise<CommonResp<UserInfo>> {
  return connect(LoginType.JWT, jwt);
}

/**
 * Connect with code
 * @param phone Phone number format E.164, such as '+11234567890' '+442012345678' '+8613611112222'
 * @param email Email address
 * @param code Verification code
 * @returns 
 */
export async function connectWithCode(phone: string | null, email: string | null, code: string): Promise<CommonResp<UserInfo>> {
  const obj = {
    email: email,
    phone: phone,
    code: code,
  };
  const json = JSON.stringify(obj);
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.connectWithCode(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Send phone code
 * @param phone Phone number format E.164, such as '+11234567890' '+442012345678' '+8613611112222'
 */
export async function sendPhoneCode(phone: String): Promise<CommonResp<boolean>> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.sendPhoneCode(phone, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Send email code
 * @param email Email number
 */
export async function sendEmailCode(email: String): Promise<CommonResp<boolean>> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.sendEmailCode(email, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}


/**
 * Disconnect
 */
export async function disconnect(): Promise<CommonResp<string>> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.disconnect((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Is user logged in, check locally.
 * @returns Result, if user is login return true, otherwise return false
 */
export async function isConnected(): Promise<boolean> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.isConnected((result: string) => {
      const connected = JSON.parse(result);

      if (Platform.OS === 'ios') {
        resolve(connected?.data as boolean);
      } else {
        resolve(connected);
      }
    });
  });
}

/**
 * Get user info
 * @returns User info json string
 */
export async function getUserInfo(): Promise<UserInfo> {
  const json = await ParticleAuthCorePlugin.getUserInfo()
  return JSON.parse(json)
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
export function changeMasterPassword(): Promise<CommonResp<string>> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.changeMasterPassword((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Has master password, get value from local user info.
 */
export async function hasMasterPassword(): Promise<CommonResp<boolean>> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.hasMasterPassword((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Has payment password, get value from local user info.
 */
export async function hasPaymentPassword(): Promise<CommonResp<boolean>> {
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
export async function openAccountAndSecurity(): Promise<CommonResp<string>> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.openAccountAndSecurity((result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export function setBlindEnable(enable: boolean) {
  ParticleAuthCorePlugin.setBlindEnable(enable);
}

export async function getBlindEnable(): Promise<boolean> {
  return await ParticleAuthCorePlugin.getBlindEnable();
}


export * from './Models';
export { ParticleAuthCoreProvider } from './provider';
export { evm, solana };
