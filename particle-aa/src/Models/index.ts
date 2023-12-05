export interface CommonError {
  code: number;
  message: string;
  data?: string;
}

// export interface FeeQuote {
//   address: string;
//   decimal: number;
//   logoUrl: string;
//   offset: number;
//   payment: string;
//   refundReceiver: string;
//   symbol: string;
//   tokenBalance: string;
//   tokenGasPrice: number;
// }

export interface CommonResp<T> {
  status: number;
  data: T | CommonError;
}

export interface WholeFeeQuote {
  verifyingPaymasterGasless: any;
  verifyingPaymasterNative: any;
  tokenPaymaster: any;
}