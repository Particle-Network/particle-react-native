import { ChainInfo, ArbitrumSepolia } from '@particle-network/chains';
import * as particleBase from 'rn-base-beta';
import {
    AccountName,
    Appearance,
    Env,
    EvmService,
    FiatCoin,
    Language,
    ParticleInfo,
    SecurityAccountConfig,
    SmartAccountInfo
} from 'rn-base-beta';

import React, { PureComponent } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import Toast from 'react-native-toast-message';
import type { BaseScreenProps } from './App';

export default class BaseDemo extends PureComponent<BaseScreenProps> {
    modalSelect: ModalSelector<any> | null = null;
    state = { currentLoadingBtn: '', currentOptions: [], currentKey: '' };


    init = () => {
        // Get your project id and client key from dashboard, https://dashboard.particle.network
        ParticleInfo.projectId = '5479798b-26a9-4943-b848-649bb104fdc3'; // your project id
        ParticleInfo.clientKey = 'cUKfeOA7rnNFCxSBtXE5byLgzIhzGrE4Y7rDdY4b'; // your client key

        if (ParticleInfo.projectId == '' || ParticleInfo.clientKey == '') {
            throw new Error(
                'You need set project info, get your project id and client from dashboard, https://dashboard.particle.network'
            );
        }

        console.log('init');
        const chainInfo = this.props.route.params?.chainInfo || ArbitrumSepolia;
        const env = Env.Dev;
        particleBase.init(chainInfo, env);
        Toast.show({
            type: 'success',
            text1: 'Initialized successfully',
        });
    };

    setChainInfo = async () => {
        const chainInfo: ChainInfo = this.props.route.params?.chainInfo || ArbitrumSepolia;

        const result = await particleBase.setChainInfo(chainInfo);
        Toast.show({
            type: result ? 'success' : 'error',
            text1: result ? 'successfully set' : 'Setting failed',
        });
    };

    getChainInfo = async () => {
        const result = await particleBase.getChainInfo();
        console.log(result);
    };


    setLanguage = async () => {
        this.setState({
            currentOptions: [
                { label: Language.EN, key: Language.EN, value: Language.EN },
                { label: Language.ZH_HANS, key: Language.ZH_HANS, value: Language.ZH_HANS },
                { label: Language.ZH_HANT, key: Language.ZH_HANT, value: Language.ZH_HANT },
                { label: Language.JA, key: Language.JA, value: Language.JA },
                { label: Language.KO, key: Language.KO, value: Language.KO },
            ],
        });
        if (this.modalSelect) {
            this.modalSelect.open();
        }
    };

    getLanguage = async () => {
        const currentLanguage = await particleBase.getLanguage();
        Toast.show({
            type: 'success',
            text1: `Language`,
            text2: currentLanguage,
        });
    };


    setAppearance = async () => {
        this.setState({
            currentOptions: [
                { label: Appearance.Dark, key: Appearance.Dark, value: Appearance.Dark },
                { label: Appearance.Light, key: Appearance.Light, value: Appearance.Light },
                { label: Appearance.System, key: Appearance.System, value: Appearance.System },
            ],
        });
        if (this.modalSelect) {
            this.modalSelect.open();
        }
    };

    setFiatCoin = async () => {
        this.setState({
            currentOptions: [
                { label: FiatCoin.CNY, key: FiatCoin.CNY, value: FiatCoin.CNY },
                { label: FiatCoin.HKD, key: FiatCoin.HKD, value: FiatCoin.HKD },
                { label: FiatCoin.INR, key: FiatCoin.INR, value: FiatCoin.INR },
                { label: FiatCoin.JPY, key: FiatCoin.JPY, value: FiatCoin.JPY },
                { label: FiatCoin.KRW, key: FiatCoin.KRW, value: FiatCoin.KRW },
                { label: FiatCoin.USD, key: FiatCoin.USD, value: FiatCoin.USD },
            ],
        });
        if (this.modalSelect) {
            this.modalSelect.open();
        }
    };


    setSecurityAccountConfig = async () => {
        const config = new SecurityAccountConfig(1, 2);
        particleBase.setSecurityAccountConfig(config);
        Toast.show({
            type: 'success',
            text1: `Successfully set security account config`,
        });
    };

    getSmartAccount = async () => {
        const eoaAddress = await particleBase.getAddress();
        const smartAccountParam = {
            name: AccountName.BICONOMY_V1().name,
            version: AccountName.BICONOMY_V1().version,
            ownerAddress: eoaAddress,
        };
        const result: SmartAccountInfo[] = await EvmService.getSmartAccount([smartAccountParam]);
        console.log('getSmartAccount', result[0]);
        Toast.show({
            type: 'success',
            text1: `Successfully get smart account ${result[0]!.smartAccountAddress}`,
        });
    };



    handleModelSelect = async ({ value }: any) => {
        switch (this.state.currentKey) {
            case 'SetLanguage':
                particleBase.setLanguage(value as Language);
                Toast.show({
                    type: 'success',
                    text1: `successfully set language`,
                });
                break;
            case 'SetAppearance':
                particleBase.setAppearance(value as Appearance);
                Toast.show({
                    type: 'success',
                    text1: `successfully set appearance`,
                });
                break;
            case 'SetFiatCoin':
                particleBase.setFiatCoin(value as FiatCoin);
                Toast.show({
                    type: 'success',
                    text1: `successfully set fail coin`,
                });
                break;
        }
    };

    data = [
        { key: 'Select Chain Page', function: null },
        { key: 'Init', function: this.init },
        { key: 'SetChainInfo', function: this.setChainInfo },
        { key: 'GetChainInfo', function: this.getChainInfo },
        { key: 'SetLanguage', function: this.setLanguage },
        { key: 'GetLanguage', function: this.getLanguage },
        { key: 'SetAppearance', function: this.setAppearance },
        { key: 'SetFiatCoin', function: this.setFiatCoin },
        { key: 'SetSecurityAccountConfig', function: this.setSecurityAccountConfig },
        { key: 'GetSmartAccount', function: this.getSmartAccount },
    ];

    render = () => {
        const { navigation } = this.props;
        return (
            <SafeAreaView>
                <View style={{ paddingBottom: 100 }}>
                    <FlatList
                        // @ts-ignore
                        data={this.data}
                        renderItem={({ item }: { item: { key: string; function: () => void } }) => (
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                accessibilityRole="button"
                                onPress={async () => {
                                    if (item.key == 'Select Chain Page') {
                                        // @ts-ignore
                                        navigation.push('SelectChainPage');
                                    } else {
                                        this.setState({ currentLoadingBtn: item.key, currentKey: item.key });

                                        await item.function();
                                        this.setState({ currentLoadingBtn: '' });
                                    }
                                }}
                            >
                                {this.state.currentLoadingBtn === item.key ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.textStyle}>{item.key}</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <ModalSelector
                    onChange={this.handleModelSelect}
                    data={this.state.currentOptions}
                    ref={(el) => {
                        this.modalSelect = el;
                    }}
                />
            </SafeAreaView>
        );
    };
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: 'rgba(78, 116, 289, 1)',
        borderRadius: 3,
        margin: 10,
        width: 300,
        justifyContent: 'center',
        padding: 10,
    },

    textStyle: {
        color: 'white',
        textAlign: 'center',
    },
});
