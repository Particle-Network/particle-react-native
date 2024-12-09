export interface ConnectKitConfig {
    connectOptions: ConnectOption[],
    socialProviders?: EnableSocialProvider[],
    walletProviders?: EnableWalletProvider[],
    additionalLayoutOptions?: AdditionalLayoutOptions
    logo?: string
}

export interface AdditionalLayoutOptions {
    isCollapseWalletList: boolean,
    isSplitEmailAndSocial: boolean,
    isSplitEmailAndPhone: boolean,
    isHideContinueButton: boolean,
}
export enum ConnectOption {
    Email = "EMAIL",
    Phone = "PHONE",
    Social = "SOCIAL",
    Wallet = "WALLET"
}

export enum EnableSocialProvider {
    Phone = 'PHONE',
    Google = 'GOOGLE',
    Facebook = 'FACEBOOK',
    Apple = 'APPLE',
    Discord = 'DISCORD',
    Github = 'GITHUB',
    Twitch = 'TWITCH',
    Microsoft = 'MICROSOFT',
    Linkedin = 'LINKEDIN',
    Twitter = 'TWITTER',
}

export interface EnableWalletProvider {
    enableWallet: EnableWallet,
    label: EnableWalletLabel
}

export enum EnableWallet {
    MetaMask = "MetaMask",
    Rainbow = "Rainbow",
    Trust = "Trust",
    ImToken = "ImToken",
    Bitget = "Bitget",
    OKX = "OKX",
    Phantom = "Phantom",
    WalletConnec = "WalletConnec",
}

export enum EnableWalletLabel {
    Recommended = "RECOMMENDED",
    Popular = "POPULAR",
    None = "NONE"
}