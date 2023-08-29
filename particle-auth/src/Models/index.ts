export * from './Appearance';
export * from './BiconomyFeeMode';
export * from './BiconomyVersion';
export * from './FiatCoin';
export * from './GasFeeLevel';
export * from './Language';
export * from './LoginInfo';
export * from './SecurityAccountConfig';
export * from './WalletDisplay';

interface CommonError {
    code: number;
    message: string;
}

export interface CommonResp<T> {
    data: T | CommonError;
    status: number;
}
