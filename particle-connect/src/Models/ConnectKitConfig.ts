export interface ConnectKitConfig {
    connectOptions: ConnectOption[],
    socialProviders: EnableSocialProvider[],
    walletProviders: EnableWalletProvider[],
    additionalLayoutOptions: AdditionalLayoutOptions
    logo?: string
}

export interface AdditionalLayoutOptions {
    isCollapseWalletList: boolean,
    isSplitEmailAndSocial: boolean,
    isSplitEmailAndPhone: boolean,
    isHideContinueButton: boolean,
}
export enum ConnectOption {
    EMAIL, PHONE, SOCIAL, WALLET
}

export enum EnableSocialProvider {
    GOOGLE,
    FACEBOOK,
    APPLE,
    TWITTER,
    DISCORD,
    GITHUB,
    TWITCH,
    MICROSOFT,
    LINKEDIN
}

export interface EnableWalletProvider {
    enableWallt: EnableWallet,
    label: EnableWalletLabel
}

export enum EnableWallet {
    MetaMask,
    Rainbow,
    Trust,
    ImToken,
    Bitget,
    OKX,
    Phantom,
    WalletConnect
}

export enum EnableWalletLabel { RECOMMENDED, POPULAR, NONE }