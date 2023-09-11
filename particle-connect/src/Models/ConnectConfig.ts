import type {
  LoginAuthorization,
  LoginType,
  SocialLoginPrompt,
  SupportAuthType,
} from '@particle-network/rn-auth';

export class ParticleConnectConfig {
  loginType: LoginType;
  account: string;
  supportAuthType: SupportAuthType[];
  socialLoginPrompt?: SocialLoginPrompt;
  authorization?: LoginAuthorization;

  constructor(
    loginType: LoginType,
    account: string,
    supportAuthType: SupportAuthType[],
    socialLoginPrompt?: SocialLoginPrompt,
    authorization?: LoginAuthorization
  ) {
    this.loginType = loginType;
    this.account = account;
    this.supportAuthType = supportAuthType;
    this.socialLoginPrompt = socialLoginPrompt;
    this.authorization = authorization;
  }
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
