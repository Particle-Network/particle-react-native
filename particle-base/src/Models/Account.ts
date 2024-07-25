export interface SmartAccountInfo {
    isDeployed: boolean;
    chainId: number;
    eoaAddress: string;
    factoryAddress: string;
    entryPointAddress: string;
    smartAccountAddress: string;
    owner: string;
    index: number;
    implementationAddress: string;
    fallBackHandlerAddress: string;
    version: string;
    name: string;
}
