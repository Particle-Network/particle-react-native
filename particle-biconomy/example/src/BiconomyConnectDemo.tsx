import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, TouchableOpacity, Text } from 'react-native';
import { Env, BiconomyVersion, BiconomyFeeMode, ParticleInfo, LoginType, SupportAuthType } from 'react-native-particle-auth';
import { PolygonMumbai, Ethereum, EthereumGoerli, EthereumSepolia, Polygon } from '@particle-network/chains';
import BigNumber from 'bignumber.js';
import * as particleBiconomy from 'react-native-particle-biconomy';
import * as particleAuth from 'react-native-particle-auth';
import * as particleConnect from 'react-native-particle-connect';
import { DappMetaData, WalletType } from 'react-native-particle-connect';
import * as Helper from './Helper';
import { TestAccountEVM } from './TestAccount';


import type { NavigationProp, RouteProp } from '@react-navigation/native';

interface BiconomyConnectDemoProps {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
}

export default class BiconomyConnectDemo extends PureComponent<BiconomyConnectDemoProps> {
    publicAddress = '0x498c9b8379E2e16953a7b1FF94ea11893d09A3Ed';

    walletType = WalletType.MetaMask;

    init = () => {
        // Get your project id and client from dashboard, https://dashboard.particle.network
        ParticleInfo.projectId = '5479798b-26a9-4943-b848-649bb104fdc3'; // your project id
        ParticleInfo.clientKey = 'cUKfeOA7rnNFCxSBtXE5byLgzIhzGrE4Y7rDdY4b'; // your client key 

        if (ParticleInfo.projectId == "" || ParticleInfo.clientKey == "") {
            throw new Error(
                'You need set project info, get your project id and client from dashboard, https://dashboard.particle.network'
            );
        }

        // should init particle auth
        const chainInfo = PolygonMumbai;
        const env = Env.Production;

        particleAuth.init(chainInfo, env);

        const metadata = new DappMetaData('75ac08814504606fc06126541ace9df6',
            'Particle Connect',
            'https://connect.particle.network/icons/512.png',
            'https://connect.particle.network',
            'Particle Wallet', "", "");

        // the rpcUrl works for WalletType EvmPrivateKey and SolanaPrivakey
        // we have default rpc url in native SDK
        const rpcUrl = { evm_url: null, solana_url: null };

        // should init particle connect first
        particleConnect.init(chainInfo, env, metadata, rpcUrl)

        // then set wallet connect project id 
        const chainInfos = [Ethereum, Polygon, EthereumGoerli, EthereumSepolia];
        // set support wallet connect chain list
        particleConnect.setWalletConnectV2SupportChainInfos(chainInfos);

        // then init particle biconomy
        const dappAppKeys = {
            1: 'your ethereum mainnet key',
            5: 'your ethereum goerli key',
            137: 'your polygon mainnet key',
            80001: 'hYZIwIsf2.e18c790b-cafb-4c4e-a438-0289fc25dba1'
        }
        particleBiconomy.init(BiconomyVersion.v1_0_0, dappAppKeys);
    };

    setChainInfo = async () => {
        const chainInfo = PolygonMumbai;
        const result = await particleAuth.setChainInfo(chainInfo);
        console.log(result);
    };

    loginMetamask = async () => {
        const result = await particleConnect.connect(this.walletType);
        console.log(result);
        if (result.status) {
            this.publicAddress = result.data.publicAddress;
            console.log(this.publicAddress);
        } else {
            console.log(result.data);
        }
    }


    enable = async () => {
        particleBiconomy.enableBiconomyMode();
    }

    disable = async () => {
        particleBiconomy.disableBiconomyMode();
    }

    isEnable = async () => {
        const result = await particleBiconomy.isBiconomyModeEnable();
        console.log('is enable', result);
    }

    rpcGetFeeQuotes = async () => {
        const eoaAddress = this.publicAddress
        console.log('eoaAddress', eoaAddress);
        const receiver = TestAccountEVM.receiverAddress;
        const amount = TestAccountEVM.amount;
        const transaction = await Helper.getEthereumTransacion(eoaAddress, receiver, BigNumber(amount));

        console.log('transaction', transaction);
        const result = await particleBiconomy.rpcGetFeeQuotes(eoaAddress, [transaction]);

        console.log('rpcGetFeeQuotes result', result);
    }

    isDeploy = async () => {
        const eoaAddress = this.publicAddress
        const result = await particleBiconomy.isDeploy(eoaAddress);

        if (result.status) {
            const isDeploy = result.data;
            console.log('isDeploy result', isDeploy);
        } else {
            const error = result.data;
            console.log('isDeploy result', error);
        }
    }

    isSupportChainInfo = async () => {
        const result = await particleBiconomy.isSupportChainInfo(PolygonMumbai);
        console.log('isSupportChainInfo result', result)
    }


    signAndSendTransactionWithBiconomyAuto = async () => {

        const eoaAddress = this.publicAddress;
        const receiver = TestAccountEVM.receiverAddress;
        const amount = TestAccountEVM.amount;
        const transaction = await Helper.getEthereumTransacion(eoaAddress, receiver, BigNumber(amount));

        const result = await particleConnect.signAndSendTransaction(this.walletType, this.publicAddress, transaction, BiconomyFeeMode.auto())
        if (result.status) {
            const signature = result.data;
            console.log('signAndSendTransactionWithBiconomyAuto result', signature);
        } else {
            const error = result.data;
            console.log('signAndSendTransactionWithBiconomyAuto result', error);
        }
    }

    signAndSendTransactionWithBiconomyGasless = async () => {

        const eoaAddress = this.publicAddress
        const receiver = TestAccountEVM.receiverAddress;
        const amount = TestAccountEVM.amount;
        const transaction = await Helper.getEthereumTransacion(eoaAddress, receiver, BigNumber(amount));

        const result = await particleConnect.signAndSendTransaction(this.walletType, this.publicAddress, transaction, BiconomyFeeMode.gasless())
        if (result.status) {
            const signature = result.data;
            console.log('signAndSendTransactionWithBiconomyGasless result', signature);
        } else {
            const error = result.data;
            console.log('signAndSendTransactionWithBiconomyGasless result', error);
        }
    }

    signAndSendTransactionWithBiconomyCustom = async () => {

        const eoaAddress = this.publicAddress
        const receiver = TestAccountEVM.receiverAddress;
        const amount = TestAccountEVM.amount;
        const transaction = await Helper.getEthereumTransacion(eoaAddress, receiver, BigNumber(amount));

        const feeQutotes = await particleBiconomy.rpcGetFeeQuotes(eoaAddress, [transaction]);

        const result = await particleConnect.signAndSendTransaction(this.walletType, this.publicAddress, transaction, BiconomyFeeMode.custom(feeQutotes[0]))
        if (result.status) {
            const signature = result.data;
            console.log('signAndSendTransactionWithBiconomyCustom result', signature);
        } else {
            const error = result.data;
            console.log('signAndSendTransactionWithBiconomyCustom result', error);
        }
    }

    batchSendTransactions = async () => {
        const eoaAddress = this.publicAddress;
        const receiver = TestAccountEVM.receiverAddress;
        const amount = TestAccountEVM.amount;
        const transaction = await Helper.getEthereumTransacion(eoaAddress, receiver, BigNumber(amount));

        const transactions = [transaction, transaction];
        const result = await particleConnect.batchSendTransactions(this.walletType, this.publicAddress, transactions, BiconomyFeeMode.auto());
        if (result.status) {
            const signature = result.data;
            console.log('batchSendTransactions result', signature);
        } else {
            const error = result.data;
            console.log('batchSendTransactions result', error);
        }

    }

    data = [
        { key: 'Init', function: this.init },
        { key: 'SetChainInfo', function: this.setChainInfo },
        { key: 'LoginMetamask', function: this.loginMetamask },
        { key: 'Enable', function: this.enable },
        { key: 'Disable', function: this.disable },
        { key: 'IsEnable', function: this.isEnable },
        { key: 'rpcGetFeeQuotes', function: this.rpcGetFeeQuotes },
        { key: 'isDeploy', function: this.isDeploy },
        { key: 'isSupportChainInfo', function: this.isSupportChainInfo },
        { key: 'batchSendTransactions', function: this.batchSendTransactions },
        { key: 'signAndSendTransactionWithBiconomyAuto', function: this.signAndSendTransactionWithBiconomyAuto },
        { key: 'signAndSendTransactionWithBiconomyGasless', function: this.signAndSendTransactionWithBiconomyGasless },
        { key: 'signAndSendTransactionWithBiconomyCustom', function: this.signAndSendTransactionWithBiconomyCustom },
    ];


    render = () => {
        return (
            <SafeAreaView>
                <View>
                    <FlatList
                        data={this.data}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.buttonStyle}
                                onPress={() => {
                                    item.function();
                                }}>
                                <Text style={styles.textStyle}>{item.key}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    };
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: 'rgba(78, 116, 289, 1)',
        borderRadius: 3,
        margin: 10,
        height: 30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerStyle: {
        width: 300,
        marginHorizontal: 50,
        marginVertical: 10,
    },
    textStyle: {
        color: 'white',
        textAlign: 'center'
    }
});