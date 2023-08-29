export interface ErrResp {
  code: number;
  message: string;
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
  data: T | ErrResp;
}
