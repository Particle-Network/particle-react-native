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
    Email = "Email",
    Phone = "Phone",
    Social = "Social",
    Wallet = "Wallet"
}

export enum EnableSocialProvider {
    Phone = 'Phone',
    Google = 'Google',
    Facebook = 'Facebook',
    Apple = 'Apple',
    Discord = 'Discord',
    Github = 'Github',
    Twitch = 'Twitch',
    Microsoft = 'Microsoft',
    Linkedin = 'Linkedin',
    Twitter = 'Twitter',
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
    Recommended = "Recommended",
    Popular = "Popular",
    None = "None"
}