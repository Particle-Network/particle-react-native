export interface CommonError {
  code: number;
  message: string;
  data?: string;
}

export interface FeeQuote {
  address: string;
  decimal: number;
  logoUrl: string;
  offset: number;
  payment: string;
  refundReceiver: string;
  symbol: string;
  tokenBalance: string;
  tokenGasPrice: number;
}

export interface CommonResp<T> {
  status: number;
  data: T | CommonError;
}

export interface ThirdpartyUserInfo {
  provider: string;
  user_info: {
    id: string;
    name?: string;
    email?: string;
    picture?: string;
  };
}

export interface SecurityAccount {
  email?: string;
  phone?: string;
  has_set_payment_password: boolean;
  has_set_master_password: boolean;
  payment_password_updated_at?: string;
}

export interface Wallet {
  uuid: string;
  chain_name: string;
  public_address: string;
}

export interface UserInfo {
  uuid: string;
  token: string;
  wallets: Wallet[];
  name?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  facebook_id?: string;
  facebook_email?: string;
  google_id?: string;
  google_email?: string;
  apple_id?: string;
  apple_email?: string;
  discord_id?: string;
  discord_email?: string;
  github_id?: string;
  github_email?: string;
  linkedin_id?: string;
  linkedin_email?: string;
  microsoft_id?: string;
  microsoft_email?: string;
  twitch_id?: string;
  twitch_email?: string;
  twitter_id?: string;
  twitter_email?: string;
  created_at?: string;
  updated_at?: string;
  thirdparty_user_info?: ThirdpartyUserInfo;
  jwt_id?: string;
  security_account?: SecurityAccount;
  signature?: string;
  message?: string;
}
