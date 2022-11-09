import type { LoginType, SupportAuthType } from "./LoginInfo"

export class ParticleConnectConfig {
    loginType: LoginType
    account: string
    supportAuthType: [SupportAuthType]
    loginFormMode: boolean
    
    constructor(loginType: LoginType, account: string, supportAuthType: [SupportAuthType], loginFormMode: boolean = false) {
            this.loginType = loginType
            this.account = account
            this.supportAuthType = supportAuthType
            this.loginFormMode = loginFormMode
        }
} 