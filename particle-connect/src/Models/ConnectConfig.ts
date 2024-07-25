// import type {
//   LoginPageConfig,
//   LoginType,
//   SocialLoginPrompt,
//   SupportAuthType,
// } from '@particle-network/rn-auth';

import type {
  LoginPageConfig,
  LoginType,
  SocialLoginPrompt,
  SupportAuthType,
} from '@particle-network/rn-base';
import { WalletType } from './WalletType';


export interface ParticleConnectConfig {
  /**
   * LoginType
   */
  loginType: LoginType;
  /**
   * Email, phone number or JWT
   */
  account?: string;
  /**
   * Email or phone code, used with particle-auth-core
   */
  code?: string;
  /**
   * List of SupportAuthType
   */
  supportAuthType: SupportAuthType[];
  /**
   *SocialLoginPrompt
   */
  socialLoginPrompt?: SocialLoginPrompt;
  /**
   * LoginPageConfig, to config the login page user interface, will work when use particle-auth-core to login, won't work when use particle-auth to login
   */
  loginPageConifg?: LoginPageConfig
}

export interface AccountInfo {
  icons: string[];
  name: string;
  publicAddress: string;
  url: string;
  description?: string;
  chainId?: number;
  mnemonic?: string;
  walletType?: WalletType
}

export interface LoginResp {
  signature: string;
  message: string;
}
