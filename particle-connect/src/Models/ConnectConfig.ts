import type { LoginAuthorization, LoginType, SocialLoginPrompt, SupportAuthType } from "react-native-particle-auth"

export class ParticleConnectConfig {
    loginType: LoginType
    account: string
    supportAuthType: SupportAuthType[]
    socialLoginPrompt?: SocialLoginPrompt
    authorization?: LoginAuthorization


    constructor(loginType: LoginType, account: string, supportAuthType: SupportAuthType[], socialLoginPrompt?: SocialLoginPrompt, authorization?: LoginAuthorization) {
        this.loginType = loginType
        this.account = account
        this.supportAuthType = supportAuthType
        this.socialLoginPrompt = socialLoginPrompt
        this.authorization = authorization
    }
} 