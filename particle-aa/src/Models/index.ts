export interface CommonError {
  code: number;
  message: string;
  data?: string;
}

export interface CommonResp<T> {
  status: number;
  data: T | CommonError;
}

export interface WholeFeeQuote {
  verifyingPaymasterGasless: any;
  verifyingPaymasterNative: any;
  tokenPaymaster: any;
}