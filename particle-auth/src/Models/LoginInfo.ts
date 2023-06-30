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
    SelectAccount = 'select_account'
}

export class LoginAuthorization {
    public message: string;
    public uniq: boolean;

    constructor(message: string, uniq: boolean = false) {
        this.message = message;
        this.uniq = uniq;
    }
}


export enum iOSModalPresentStyle {
    FullScreen = 'fullScreen',
    FormSheet = 'formSheet',
}

export enum Env {
    Dev = 'Dev',
    Staging = 'Staging',
    Production = 'Production',
}
