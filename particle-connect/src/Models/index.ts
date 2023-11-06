export * from './ConnectConfig';
export * from './DappMetaData';
export * from './RpcUrl';
export * from './WalletType';

export interface CommonError {
  code: number;
  message: string;
  data?: string;
}

export interface CommonResp<T> {
  data: T | CommonError;
  status: number;
}
