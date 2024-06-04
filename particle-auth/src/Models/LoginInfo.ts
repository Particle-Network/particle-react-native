export enum LoginType {
    Email = 'Email',
    Phone = 'Phone',
    JWT = 'JWT',
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

export enum SupportAuthType {
    None = 'None',
    Email = 'Email',
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
    All = 'All',
}

export enum SocialLoginPrompt {
    None = 'none',
    Consent = 'Sconsent',
    SelectAccount = 'select_account',
}

export interface LoginAuthorization {
    message: string;
    uniq: boolean;
}

export enum iOSModalPresentStyle {
    FullScreen = 'fullScreen',
    PageSheet = 'pageSheet',
}

export enum Env {
    Dev = 'Dev',
    Staging = 'Staging',
    Production = 'Production',
}

export interface ThirdpartyUserInfo {
    provider: string;
    user_info: {
        id: string;
        name?: string;
        email?: string;
        picture?: string;
    };
}

export interface SecurityAccount {
    email?: string;
    phone?: string;
    has_set_payment_password: boolean;
    has_set_master_password: boolean;
    payment_password_updated_at?: string;
}

export interface Wallet {
    uuid: string;
    chain_name: string;
    public_address: string;
}

export interface UserInfo {
    uuid: string;
    token: string;
    wallets: Wallet[];
    name?: string;
    avatar?: string;
    phone?: string;
    email?: string;
    facebook_id?: string;
    facebook_email?: string;
    google_id?: string;
    google_email?: string;
    apple_id?: string;
    apple_email?: string;
    discord_id?: string;
    discord_email?: string;
    github_id?: string;
    github_email?: string;
    linkedin_id?: string;
    linkedin_email?: string;
    microsoft_id?: string;
    microsoft_email?: string;
    twitch_id?: string;
    twitch_email?: string;
    twitter_id?: string;
    twitter_email?: string;
    created_at?: string;
    updated_at?: string;
    thirdparty_user_info?: ThirdpartyUserInfo;
    jwt_id?: string;
    security_account?: SecurityAccount;
    signature?: string;
}

export interface LoginPageConfig {
    projectName: string;
    description: string;
    imagePath: string;
}

