export * from './BuyCryptoConfig';
export * from './WalletMetaData';

export interface CommonError {
  code: number;
  message: string;
}

export interface CommonResp<T> {
  data: T | CommonError;
  status: number;
}
