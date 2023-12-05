type AccountNameType = 'BICONOMY' | 'SIMPLE' | 'CYBERCONNECT';
type VersionNumberType = '1.0.0' | '2.0.0';

export interface SmartAccountParamType {
    name: AccountNameType;
    version: VersionNumberType;
    ownerAddress: string;
}
