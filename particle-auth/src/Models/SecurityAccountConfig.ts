/**
 * Dapp meta data
 */
export class SecurityAccountConfig {
    promptSettingWhenSign: number;
    promptMasterPasswordSettingWhenLogin: number;

    /**
     *
     * @param promptSettingWhenSign If show prompt when new acount sign, 0 no prompt, 1 first time show prompt, 2 every time show prompt, default value is 1
     *
     * @param promptMasterPasswordSettingWhenLogin If show master password prompt when login, 0 no prompt, 1 first time show prompt, 2 every time show prompt, default value is 0
     */
    constructor(promptSettingWhenSign: number, promptMasterPasswordSettingWhenLogin: number) {
        this.promptSettingWhenSign = promptSettingWhenSign;
        this.promptMasterPasswordSettingWhenLogin = promptMasterPasswordSettingWhenLogin;
    }
}
