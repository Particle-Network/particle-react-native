import { NativeModules, Platform } from 'react-native';
import type { ChainInfo } from './Models/ChainInfo';
import type { Language } from './Models/Language';
import type {
    Env,
    iOSModalPresentStyle,
    LoginAuthorization,
    LoginType,
    SocialLoginPrompt,
    SupportAuthType,
} from './Models/LoginInfo';
import type { SecurityAccountConfig } from './Models/SecurityAccountConfig';
import type { BiconomyFeeMode } from './Models/BiconomyFeeMode';

const LINKING_ERROR =
    `The package 'react-native-particle-auth' doesn't seem to be linked. Make sure: \n\n` +
    Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo Go\n';

const ParticleAuthPlugin = NativeModules.ParticleAuthPlugin
    ? NativeModules.ParticleAuthPlugin
    : new Proxy(
          {},
          {
              get() {
                  throw new Error(LINKING_ERROR);
              },
          }
      );

export const ParticleAuthEvent = NativeModules.ParticleAuthEvent
    ? NativeModules.ParticleAuthEvent
    : new Proxy(
          {},
          {
              get() {
                  // throw new Error(LINKING_ERROR);
              },
          }
      );

/**
 * Init Particle Auth Service.
 * @param chainInfo ChainInfo
 * @param env Env
 */
export function init(chainInfo: ChainInfo, env: Env) {
    const obj = {
        chain_name: chainInfo.chain_name,
        chain_id: chainInfo.chain_id,
        chain_id_name: chainInfo.chain_id_name,
        env: env,
    };
    const json = JSON.stringify(obj);
    if (Platform.OS === 'ios') {
        ParticleAuthPlugin.initialize(json);
    } else {
        ParticleAuthPlugin.init(json);
    }
}

/**
 * Set chainInfo
 * @param chainInfo ChainInfo
 * @returns Result
 */
export function setChainInfo(chainInfo: ChainInfo): Promise<boolean> {
    const obj = {
        chain_name: chainInfo.chain_name,
        chain_id: chainInfo.chain_id,
        chain_id_name: chainInfo.chain_id_name,
    };
    const json = JSON.stringify(obj);
    return new Promise((resolve) => {
        ParticleAuthPlugin.setChainInfo(json, (result: boolean) => {
            resolve(result);
        });
    });
}
/**
 * Get chainInfo
 * @returns ChainInfo
 */
export function getChainInfo(): Promise<ChainInfo> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.getChainInfo((result: string) => {
            resolve(JSON.parse(result) as ChainInfo);
        });
    });
}

/**
 * Get chainId
 * @returns ChainId
 */
export function getChainId(): Promise<number> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.getChainInfo((result: string) => {
            resolve((JSON.parse(result) as ChainInfo).chain_id);
        });
    });
}
/**
 * Set chainInfo async, because ParticleAuthService support both solana and evm, if switch to solana from evm, Auth Service will create a evm address if the user doesn't has a evm address.
 * @param chainInfo
 * @returns Result
 */
export function setChainInfoAsync(chainInfo: ChainInfo): Promise<boolean> {
    const obj = {
        chain_name: chainInfo.chain_name,
        chain_id: chainInfo.chain_id,
        chain_id_name: chainInfo.chain_id_name,
    };
    const json = JSON.stringify(obj);
    return new Promise((resolve) => {
        ParticleAuthPlugin.setChainInfoAsync(json, (result: boolean) => {
            resolve(result);
        });
    });
}

/**
 * Login Particle Auth Service
 * @param type Login type, support phone, email, json web token, google, apple and more.
 * @param account When login type is email, phone or jwt, you could pass email address, phone number or jwt.
 * @param supportAuthType Controls whether third-party login buttons are displayed. default will show all third-party login buttons.
 * @param loginFormMode Controls whether show light UI in web, default is false.
 * @param socialLoginPrompt Social login prompt, optional.
 * @param authorization message:evm->hex sign message . solana is base58, uniq:unique sign,only support evm
 * @returns Result, userinfo or error
 */
export function login(
    type?: LoginType,
    account?: string,
    supportAuthType?: [SupportAuthType],
    loginFormMode?: boolean,
    socialLoginPrompt?: SocialLoginPrompt,
    authorization?: LoginAuthorization
): Promise<any> {
    const obj = {
        login_type: type,
        account: account,
        support_auth_type_values: supportAuthType,
        login_form_mode: loginFormMode,
        social_login_prompt: socialLoginPrompt,
        authorization: authorization,
    };

    const json = JSON.stringify(obj);
    console.log('login:', json);
    return new Promise((resolve) => {
        ParticleAuthPlugin.login(json, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

export function setUserInfo(json: string): Promise<boolean> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.setUserInfo(json, (result: string) => {
            resolve(JSON.parse(result));
            ParticleAuthPlugin.setUserInfo(json, (result: boolean) => {
                resolve(result);
            });
        });
    });
}
/**
 * Logout
 * @returns Result, success or error
 */
export function logout(): Promise<any> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.logout((result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Fast logout, silently
 * @returns Result, success or error
 */
export function fastLogout(): Promise<any> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.fastLogout((result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Is user logged in, check locally.
 * @returns Result, if user is login return true, otherwise retrun false
 */
export function isLogin(): Promise<boolean> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.isLogin((result: boolean) => {
            resolve(result);
        });
    });
}

/**
 * Is user logged in, check from server. recommended.
 * @returns Result, if user is login return userinfo, otherwise retrun error
 */
export function isLoginAsync(): Promise<any> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.isLoginAsync((result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Sign message
 * @param message Message that you want user to sign.
 * @returns Result, signed message or error
 */
export function signMessage(message: string): Promise<any> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.signMessage(message, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Sign message unique
 * @param message Message that you want user to sign.
 * @returns Result, signed message or error
 */
export function signMessageUnique(message: string): Promise<any> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.signMessageUnique(message, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Sign transaction, only solana chain support!
 * @param transaction Transaction that you want user to sign.
 * @returns Result, signed transaction or error
 */
export function signTransaction(transaction: string): Promise<any> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.signTransaction(transaction, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Sign all transactions, only solana chain support!
 * @param transactions Transactions that you want user to sign
 * @returns Result, signed transactions or error
 */
export function signAllTransactions(transactions: string[]): Promise<any> {
    const json = JSON.stringify(transactions);
    return new Promise((resolve) => {
        ParticleAuthPlugin.signAllTransactions(json, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Sign and send transaction
 * @param transaction Transaction that you want user to sign and send
 * @param feeMode Optional, works with particle biconomy service
 * @returns Result, signature or error
 */
export function signAndSendTransaction(transaction: string, feeMode?: BiconomyFeeMode): Promise<any> {
    const obj = {
        transaction: transaction,
        fee_mode: {
            option: feeMode?.getOption(),
            fee_quote: feeMode?.getFeeQuote(),
        },
    };
    const json = JSON.stringify(obj);

    return new Promise((resolve) => {
        ParticleAuthPlugin.signAndSendTransaction(json, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Batch send transactions, works with particle biconomy service
 * @param transactions Transactions that you want user to sign and send
 * @param feeMode Optional, default is auto
 * @returns Result, signature or error
 */
export function batchSendTransactions(transactions: string[], feeMode?: BiconomyFeeMode): Promise<any> {
    const obj = {
        transactions: transactions,
        fee_mode: {
            option: feeMode?.getOption(),
            fee_quote: feeMode?.getFeeQuote(),
        },
    };
    const json = JSON.stringify(obj);

    return new Promise((resolve) => {
        ParticleAuthPlugin.batchSendTransactions(json, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Sign typed data, only evm chain support sign typed data!
 * @param typedData TypedData string
 * @param version TypedData version, support v1, v3, v4, v4Unique
 * @returns Result, signature or error
 */
export function signTypedData(typedData: string, version: 'v1' | 'v3' | 'v4' | 'v4Unique'): Promise<any> {
    const obj = { message: typedData, version: version };
    const json = JSON.stringify(obj);

    return new Promise((resolve) => {
        ParticleAuthPlugin.signTypedData(json, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Open account and security page
 * use DeviceEventEmitter.addListener('securityFailedCallBack', this.securityFailedCallBack) get securityFailedCallBack
 */
export function openAccountAndSecurity() {
    ParticleAuthPlugin.openAccountAndSecurity();
}

/**
 * Get public address
 * @returns Public address
 */
export async function getAddress(): Promise<string> {
    return await ParticleAuthPlugin.getAddress();
}

/**
 * Get user info
 * @returns User info json string
 */
export async function getUserInfo(): Promise<string> {
    return await ParticleAuthPlugin.getUserInfo();
}

/**
 * Set modal present style, only support iOS
 * @param style Modal present style
 */
export function setModalPresentStyle(style: iOSModalPresentStyle) {
    if (Platform.OS === 'ios') {
        ParticleAuthPlugin.setModalPresentStyle(style);
    }
}

/**
 * Set medium screen, only support iOS 15.0 or later
 *
 * if you want a medium screen when present safari web view, call this method with true.
 * and don't call setModalPresentStyle with fullScreen.
 * @param isMediumScreen Is medium screen
 */
export function setMediumScreen(isMediumScreen: boolean) {
    if (Platform.OS === 'ios') {
        ParticleAuthPlugin.setMediumScreen(isMediumScreen);
    }
}

/**
 * Set language
 * @param language Language
 */
export function setLanguage(language: Language) {
    ParticleAuthPlugin.setLanguage(language);
}

/**
 * Set if display wallet in web page.
 * @param isDisplay
 */
export function setDisplayWallet(isDisplay: boolean) {
    ParticleAuthPlugin.setDisplayWallet(isDisplay);
}

/**
 * Open web wallet
 */
export function openWebWallet(webStyle?: string) {
    console.log('openWebWallet', webStyle);
    if (Platform.OS === 'ios') {
        ParticleAuthPlugin.setCustomStyle(webStyle);
        ParticleAuthPlugin.openWebWallet();
    } else {
        ParticleAuthPlugin.openWebWallet(webStyle);
    }
}

/**
 * Set security account config
 * @param config
 */
export function setSecurityAccountConfig(config: SecurityAccountConfig) {
    const obj = {
        prompt_setting_when_sign: config.promptSettingWhenSign,
        prompt_master_password_setting_when_login: config.promptMasterPasswordSettingWhenLogin,
    };
    const json = JSON.stringify(obj);
    ParticleAuthPlugin.setSecurityAccountConfig(json);
}

/**
 * Has master password, get value from local user info.
 */
export async function hasMasterPassword(): Promise<boolean> {
    const result = await getUserInfo();

    const userInfo = JSON.parse(result);
    const hasMasterPassword = userInfo.security_account.has_set_master_password;
    return hasMasterPassword;
}

/**
 * Has payment password, get value from local user info.
 */
export async function hasPaymentPassword(): Promise<boolean> {
    const result = await getUserInfo();

    const userInfo = JSON.parse(result);
    const hasPaymentPassword = userInfo.security_account.has_set_payment_password;
    return hasPaymentPassword;
}

/**
 * Has security account, get value from local user info.
 */
export async function hasSecurityAccount(): Promise<boolean> {
    const result = await getUserInfo();

    const userInfo = JSON.parse(result);
    const email = userInfo.security_account.email;
    const phone = userInfo.security_account.phone;
    return !email || !phone;
}

/**
 * Get security account from remote server, contains hasMasterPassword, hasPaymentPassword and hasSecurityAccount.
 */
export async function getSecurityAccount(): Promise<string> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.getSecurityAccount((result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

export * from './Models/LoginInfo';
export * from './Models/ChainInfo';
export * from './Models/Language';
export * from './Models/WalletDisplay';
export * from './Models/UserInterfaceStyle';
export * from './Models/SecurityAccountConfig';
export * from './Models/BiconomyVersion';
export * from './Models/BiconomyFeeMode';
export * from './Network/EvmService';
export * from './Network/SolanaService';
export * from './Network/ParticleInfo';
export * from './Models/GasFeeLevel';

export { ParticleProvider } from './provider';
