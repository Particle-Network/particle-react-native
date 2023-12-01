export * from './AAFeeMode';
export * from './Account';
export * from './AccountName';
export * from './Appearance';
export * from './FiatCoin';
export * from './GasFeeLevel';
export * from './Language';
export * from './LoginInfo';
export * from './SecurityAccountConfig';
export * from './SmartAccountConfig';
export * from './VersionNumber';
export * from './WalletDisplay';

export interface CommonError {
    code: number;
    message: string;
}

export interface CommonResp<T> {
    data: T | CommonError;
    status: number;
}
