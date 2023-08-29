export * from './BuyCryptoConfig';
export * from './WalletMetaData';

interface CommonError {
  code: number;
  message: string;
}

export interface CommonResp<T> {
  data: T | CommonError;
  status: number;
}
