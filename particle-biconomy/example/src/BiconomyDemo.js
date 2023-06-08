import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, DeviceEventEmitter, NativeEventEmitter } from 'react-native';
import { ChainInfo, Env, BiconomyVersion, EvmService} from 'react-native-particle-auth';
import * as particleBiconomy from 'react-native-particle-biconomy';
import * as particleAuth from 'react-native-particle-auth';
import * as Helper from './Helper';
import { TestAccountEVM } from './TestAccount';

init = () => {
    // should init particle auth
    const chainInfo = EvmService.currentChainInfo;
    const env = Env.Production;

    particleAuth.init(chainInfo, env);

    // then init particle biconomy
    const dappAppKeys = {
        1: 'your ethereum mainnet key',
        80001: 'hYZIwIsf2.e18c790b-cafb-4c4e-a438-0289fc25dba1'
    }
    particleBiconomy.init(BiconomyVersion.v1_0_0, dappAppKeys);
};

setChainInfo = async () => {
    const chainInfo = ChainInfo.PolygonMumbai;
    const result = await particleAuth.setChainInfo(chainInfo);
    console.log(result);
};

login = async () => {
    const type = LoginType.Phone;
    const supportAuthType = [
        SupportAuthType.Email,
        SupportAuthType.Apple,
        SupportAuthType.Google,
        SupportAuthType.Discord,
    ];
    const result = await particleAuth.login(type, '', supportAuthType, undefined);
    if (result.status) {
        const userInfo = result.data;
        console.log(userInfo);
    } else {
        const error = result.data;
        console.log(error);
    }
};


enable = async () => {
    particleBiconomy.enableBiconomyMode();
}

disable = async() => {
    particleBiconomy.disableBiconomyMode();
}

isEnable = async() => {
    const result = particleBiconomy.isBiconomyModeEnable();
    console.log('is enable', result);
}

rpcGetFeeQuotes = async () => {
    const eoaAddress =  particleAuth.getAddress();

    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(eoaAddress, receiver, amount);

    const result = await particleBiconomy.rpcGetFeeQuotes(eoaAddress, [transaction]);
    console.log('rpcGetFeeQuotes result', result);
}

isDeploy  = async () => {
    const eoaAddress =  particleAuth.getAddress();

    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(eoaAddress, receiver, amount);

    const result = await particleBiconomy.rpcGetFeeQuotes(eoaAddress, [transaction]);
    console.log('rpcGetFeeQuotes result', result);
}

const data = [
    { key: 'Init', function: this.init },
    { key: 'SetChainInfo', function: this.setChainInfo },
    { key: 'Login', function: this.login },
    { key: 'Enable', function: this.enable },
    { key: 'Disable', function: this.disable },
    { key: 'IsEnable', function: this.isEnable },
    { key: 'rpcGetFeeQuotes', function: this.rpcGetFeeQuotes },
    { key: 'isDeploy', function: this.isDeploy },
    { key: 'isSupportChainInfo', function: this.isSupportChainInfo },
];

export default class BiconomyDemo extends PureComponent {
    render = () => {
        const { navigation } = this.props;

        return (
            <SafeAreaView>
                <View>
                    <FlatList
                        data={data}
                        renderItem={({ item }) => (
                            <Button
                                title={item.key}
                                onPress={() => {

                                    item.function();

                                }}
                                buttonStyle={styles.buttonStyle}
                                containerStyle={styles.containerStyle}
                            />
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    };
}

const Item = ({ item }) => {
    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Button
                title={item.key}
                onPress={item.function}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.containerStyle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: 'rgba(78, 116, 289, 1)',
        borderRadius: 3,
    },
    containerStyle: {
        width: 300,
        marginHorizontal: 50,
        marginVertical: 10,
    },
});
