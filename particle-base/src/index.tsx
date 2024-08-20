import type { ChainInfo } from '@particle-network/chains';
import { chains } from '@particle-network/chains';
import { NativeModules, Platform } from 'react-native';
import {
    Appearance,
    Env,
    FiatCoin,
    Language,
    SecurityAccountConfig
} from './Models';

const LINKING_ERROR =
    `The package 'react-native-particle-base' doesn't seem to be linked. Make sure: \n\n` +
    Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo Go\n';

const ParticleBasePlugin = NativeModules.ParticleBasePlugin
    ? NativeModules.ParticleBasePlugin
    : new Proxy(
        {},
        {
            get() {
                throw new Error(LINKING_ERROR);
            },
        }
    );
/**
 * Init Particle Base
 * @param chainInfo ChainInfo
 * @param env Env
 */
export function init(chainInfo: ChainInfo, env: Env) {
    const obj = {
        chain_name: chainInfo.name,
        chain_id: chainInfo.id,
        env: env,
    };
    const json = JSON.stringify(obj);
    if (Platform.OS === 'ios') {
        ParticleBasePlugin.initialize(json);
    } else {
        ParticleBasePlugin.init(json);
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
    };
    const json = JSON.stringify(obj);
    return new Promise((resolve) => {
        ParticleBasePlugin.setChainInfo(json, (result: boolean) => {
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
        ParticleBasePlugin.getChainInfo((result: string) => {
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
 * Set language
 * @param language Language
 */
export function setLanguage(language: Language) {
    ParticleBasePlugin.setLanguage(language);
}

/**
 * Get language
 */
export async function getLanguage(): Promise<Language> {
    const languageString = await ParticleBasePlugin.getLanguage();
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
        ParticleBasePlugin.setAppearance(appearance);
    }
    // todo
}


/**
 * Set fiat coin
 * @param fiatCoin FiatCoin
 */
export function setFiatCoin(fiatCoin: FiatCoin) {
    ParticleBasePlugin.setFiatCoin(fiatCoin);
}

/**
 * Set theme color
 * @param hexColor requires 6-digit hexadecimal color code, such as #FFFFFF, the defualt theme color is #A257FA
 */
export function setThemeColor(hexColor: string) {
    if (Platform.OS === 'ios') {
        ParticleBasePlugin.setThemeColor(hexColor);
    }else{
        //unsupported
    }
    
}

/**
 * Set customize UI config json string, only support iOS
 * 
 * @param jsonString can reference example customUIConfig.json files
 */
export function setCustomUIConfigJsonString(jsonString: string) {
    if (Platform.OS === 'ios') {
        ParticleBasePlugin.setCustomUIConfigJsonString(jsonString);
    }else{
        //unsupported
    }
    
}

/**
 * Set unsupport countries list, used with phone login UI
 * @param isoCodeList is ISO 3166-1 alpha-2 code list, https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2, such as the US, the UK, etc.
 */
export function setUnsupportCountries(isoCodeList: string[]) {
    const jsonString = JSON.stringify(isoCodeList);
    ParticleBasePlugin.setUnsupportCountries(jsonString);
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
    ParticleBasePlugin.setSecurityAccountConfig(json);
}


export function isHexString(str: string): boolean {
    const regex = /^0x[0-9a-fA-F]*$/;
    return regex.test(str);
}

export * from './Models';
export * from './Network';
