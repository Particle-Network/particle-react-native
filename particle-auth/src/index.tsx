import type { ChainInfo } from '@particle-network/chains';
import { chains } from '@particle-network/chains';
import { NativeModules, Platform } from 'react-native';
import {
    AAFeeMode,
    Appearance,
    CommonResp,
    Env,
    FiatCoin,
    Language,
    LoginAuthorization,
    LoginType,
    SecurityAccount,
    SecurityAccountConfig,
    SocialLoginPrompt,
    SupportAuthType,
    UserInfo,
    iOSModalPresentStyle,
} from './Models';

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
        chain_name: chainInfo.name,
        chain_id: chainInfo.id,
        chain_id_name: chainInfo.network,
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
        chain_name: chainInfo.name,
        chain_id: chainInfo.id,
        chain_id_name: chainInfo.network,
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
export async function getChainInfo(): Promise<ChainInfo> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.getChainInfo((result: string) => {
            const json = JSON.parse(result);

            const chainInfo = chains.getChainInfo({ id: json.chain_id, name: json.chain_name })!;

            resolve(chainInfo);
        });
    });
}

/**
 * Get chainId
 * @returns ChainId
 */
export async function getChainId(): Promise<number> {
    let chainInfo = await getChainInfo();
    return chainInfo.id;
}
/**
 * Set chainInfo async, because ParticleAuthService support both solana and evm, if switch to solana from evm, Auth Service will create a evm address if the user doesn't has a evm address.
 * @param chainInfo
 * @returns Result
 */
export function setChainInfoAsync(chainInfo: ChainInfo): Promise<boolean> {
    const obj = {
        chain_name: chainInfo.name,
        chain_id: chainInfo.id,
        chain_id_name: chainInfo.network,
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
 * @param socialLoginPrompt Social login prompt, optional.
 * @param authorization message:evm->hex sign message . solana is base58, uniq:unique sign,only support evm
 * @returns Result, userinfo or error
 */
export function login(
    type?: LoginType,
    account?: string,
    supportAuthType?: SupportAuthType[],
    socialLoginPrompt?: SocialLoginPrompt,
    authorization?: LoginAuthorization
): Promise<CommonResp<UserInfo>> {
    const obj = {
        login_type: type,
        account: account,
        support_auth_type_values: supportAuthType,
        social_login_prompt: socialLoginPrompt,
        authorization: authorization,
    };

    const json = JSON.stringify(obj);
    return new Promise((resolve) => {
        ParticleAuthPlugin.login(json, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Logout
 * @returns Result, success or error
 */
export function logout(): Promise<CommonResp<void>> {
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
export function fastLogout(): Promise<CommonResp<string>> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.fastLogout((result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Is user logged in, check locally.
 * @returns Result, if user is login return true, otherwise return false
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
export function isLoginAsync(): Promise<CommonResp<UserInfo>> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.isLoginAsync((result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Sign message
 * @param message Message that you want user to sign, evm chain requires hexadecimal string, solana chain requires human readable message.
 * @returns Result, signed message or error
 */
export async function signMessage(message: string): Promise<CommonResp<string>> {
    let serializedMessage: string;

    let chainInfo = await getChainInfo();
    if (chainInfo.name.toLowerCase() == 'solana') {
        serializedMessage = message;
    } else {
        if (isHexString(message)) {
            serializedMessage = message;
        } else {
            serializedMessage = '0x' + Buffer.from(message).toString('hex');
        }
    }

    return new Promise((resolve) => {
        ParticleAuthPlugin.signMessage(serializedMessage, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Sign message unique
 * @param message Message that you want user to sign, evm chain requires hexadecimal string, solana chain requires human readable message.
 * @returns Result, signed message or error
 */
export async function signMessageUnique(message: string): Promise<CommonResp<string>> {
    let serializedMessage: string;

    let chainInfo = await getChainInfo();
    if (chainInfo.name.toLowerCase() == 'solana') {
        serializedMessage = message;
    } else {
        if (isHexString(message)) {
            serializedMessage = message;
        } else {
            serializedMessage = '0x' + Buffer.from(message).toString('hex');
        }
    }

    return new Promise((resolve) => {
        ParticleAuthPlugin.signMessageUnique(serializedMessage, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Sign transaction, only solana chain support!
 * @param transaction Transaction that you want user to sign.
 * @returns Result, signed transaction or error
 */
export async function signTransaction(transaction: string): Promise<CommonResp<string>> {
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
export async function signAllTransactions(transactions: string[]): Promise<CommonResp<string>> {
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
 * @param feeMode Optional, works with particle aa service
 * @returns Result, signature or error
 */
export async function signAndSendTransaction(transaction: string, feeMode?: AAFeeMode): Promise<CommonResp<string>> {
    console.log('transaction', transaction, feeMode);
    const obj = {
        transaction: transaction,
        fee_mode: {
            option: feeMode?.getOption(),
            fee_quote: feeMode?.getFeeQuote(),
            token_paymaster_address: feeMode?.getTokenPaymasterAddress(),
            whole_fee_quote: feeMode?.getWholeFeeQuote(),
        },
    };
    console.log('param', obj);
    const json = JSON.stringify(obj);

    return new Promise((resolve) => {
        ParticleAuthPlugin.signAndSendTransaction(json, (result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

/**
 * Batch send transactions, works with particle aa service
 * @param transactions Transactions that you want user to sign and send
 * @param feeMode Optional, default is native
 * @returns Result, signature or error
 */
export async function batchSendTransactions(transactions: string[], feeMode?: AAFeeMode): Promise<CommonResp<string>> {
    const obj = {
        transactions: transactions,
        fee_mode: {
            option: feeMode?.getOption(),
            fee_quote: feeMode?.getFeeQuote(),
            token_paymaster_address: feeMode?.getTokenPaymasterAddress(),
            whole_fee_quote: feeMode?.getWholeFeeQuote(),
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
 * @param typedData TypedData string, requires hexadecimal string.
 * @param version TypedData version, support v1, v3, v4, v4Unique
 * @returns Result, signature or error
 */
export async function signTypedData(
    typedData: string,
    version: 'v1' | 'v3' | 'v4' | 'v4Unique'
): Promise<CommonResp<string>> {
    let serializedMessage: string;

    if (isHexString(typedData)) {
        serializedMessage = typedData;
    } else {
        serializedMessage = '0x' + Buffer.from(typedData).toString('hex');
    }

    const obj = { message: serializedMessage, version: version };
    const json = JSON.stringify(obj);

    console.log('call signTypedData', json);

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
 * Get language
 */
export async function getLanguage(): Promise<Language> {
    const languageString = await ParticleAuthPlugin.getLanguage();
    switch (languageString) {
        case 'en':
            return Language.EN;
        case 'zh_hans':
            return Language.ZH_HANS;
        case 'zh_hant':
            return Language.ZH_HANT;
        case 'ja':
            return Language.JA;
        case 'ko':
            return Language.KO;
        default:
            return Language.EN;
    }
}

/**
 * Set appearance
 * @param appearance Appearance
 */
export function setAppearance(appearance: Appearance) {
    if (Platform.OS === 'ios') {
        ParticleAuthPlugin.setAppearance(appearance);
    }
    // todo
}

export function setFiatCoin(fiatCoin: FiatCoin) {
    if (Platform.OS === 'ios') {
        ParticleAuthPlugin.setFiatCoin(fiatCoin);
    }
    // todo
}

/**
 * Set web auth config
 * @param displayWallet
 * @param appearance
 */
export function setWebAuthConfig(displayWallet: boolean, appearance: Appearance) {
    const obj = {
        display_wallet: displayWallet,
        appearance: appearance,
    };

    if (Platform.OS === 'ios') {
        const json = JSON.stringify(obj);
        ParticleAuthPlugin.setWebAuthConfig(json);
    }
    // todo
}

/**
 * Open web wallet
 */
export function openWebWallet(webStyle?: string) {
    ParticleAuthPlugin.openWebWallet(webStyle);
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
export async function getSecurityAccount(): Promise<CommonResp<SecurityAccount>> {
    return new Promise((resolve) => {
        ParticleAuthPlugin.getSecurityAccount((result: string) => {
            resolve(JSON.parse(result));
        });
    });
}

export function isHexString(str: string): boolean {
    const regex = /^0x[0-9a-fA-F]*$/;
    return regex.test(str);
}

export * from './Models';
export * from './Network';
export { ParticleProvider } from './provider';
