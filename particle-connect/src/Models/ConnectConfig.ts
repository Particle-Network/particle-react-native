import type {
  LoginAuthorization,
  LoginPageConfig,
  LoginType,
  SocialLoginPrompt,
  SupportAuthType,
} from '@particle-network/rn-auth';

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
   * LoginAuthorization, will work when use particle-auth to login, won't work when use particle-auth-core to login
   */
  authorization?: LoginAuthorization;
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
}

export interface LoginResp {
  signature: string;
  message: string;
}
