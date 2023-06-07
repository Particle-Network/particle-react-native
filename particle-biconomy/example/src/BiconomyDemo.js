import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, DeviceEventEmitter, NativeEventEmitter } from 'react-native';
import { ChainInfo, Env } from 'react-native-particle-auth';
import * as particleBiconomy from 'react-native-particle-biconomy';
import * as particleAuth from 'react-native-particle-auth';

init = () => {
    const chainInfo = EvmService.currentChainInfo;
    const env = Env.Production;
    particleAuth.init(chainInfo, env);

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

const data = [
    { key: 'Init', function: this.init },
    { key: 'Enable', function: this.login },
    { key: 'Disable', function: this.web3_getAccounts },
    { key: 'IsEnable', function: this.web3_getBalance },
    { key: 'rpcGetFeeQuotes', function: this.web3_getChainId },
    { key: 'isDeploy', function: this.web3_personalSign },
    { key: 'isSupportChainInfo', function: this.web3_signTypedData_v1 },
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
