

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { WalletType } from "rn-connect-beta";
import * as particleBase from "rn-base-beta";
import * as particleConnect from "rn-connect-beta";
import Toast from "react-native-toast-message";
import { CommonError } from "rn-base-beta";
import * as Helper from '../utils/Helper';
import { TestAccountEVM } from "../utils/TestAccount";
import BigNumber from "bignumber.js";
import * as particleAuthCore from "rn-auth-core-beta";

type ConnectedWalletScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConnectedWalletPage'>;
type ConnectedWalletScreenRouteProp = RouteProp<RootStackParamList, 'ConnectedWalletPage'>;

export default function ConnectedWalletScreen() {
    const navigation = useNavigation<ConnectedWalletScreenNavigationProp>();
    const route = useRoute<ConnectedWalletScreenRouteProp>();
    const [message, setMessage] = useState("");
    const [signature, setSignature] = useState("");

    const { accountInfo } = route.params;

    const getAccounts = async () => {
        const walletType = accountInfo.walletType!;
        const accounts = await particleConnect.getAccounts(walletType);
        Toast.show({
            type: 'success',
            text1: 'Successfully get accounts',
        });
        console.log(accounts);
    };

    const disconnect = async () => {
        try {
            const publicAddress = accountInfo.publicAddress;
            const walletType = accountInfo.walletType!;
            if (publicAddress == undefined) {
                console.log('publicAddress is underfined, you need connect');
                return;
            }
            const result = await particleConnect.disconnect(
                walletType,
                publicAddress
            );
            console.log(result);
            Toast.show({
                type: 'success',
                text1: 'Successfully disconnected',
            });
            navigation.navigate('Home', {
            });
        } catch (e) {
            const error = e as particleBase.CommonError;
            console.log(error);

            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    };

    const isConnected = async () => {
        const publicAddress = accountInfo.publicAddress;
        const walletType = accountInfo.walletType!;
        if (publicAddress == undefined) {
            console.log('publicAddress is underfined, you need connect');
            return;
        }
        const result = await particleConnect.isConnected(
            walletType,
            publicAddress
        );
        console.log(result);
        Toast.show({
            type: 'info',
            text1: 'Is connected',
            text2: String(result),
        });
    };

    const signMessage = async () => {
        const publicAddress = accountInfo.publicAddress;
        const walletType = accountInfo.walletType!;

        if (publicAddress == undefined) {
            console.log('publicAddress is underfined, you need connect');
            return;
        }
        const message = 'Hello world!';
        const result = await particleConnect.signMessage(
            walletType,
            publicAddress,
            message
        );
        if (result.status) {
            const signedMessage = result.data as string;
            console.log(signedMessage);

            Toast.show({
                type: 'success',
                text1: 'Successfully sign message',
                text2: signedMessage,
            });
        } else {
            const error = result.data as CommonError;
            console.log(error);

            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    };

    const signTransaction = async () => {
        const publicAddress = accountInfo.publicAddress;
        const walletType = accountInfo.walletType!;

        try {
            const chainInfo = await particleBase.getChainInfo()

            if (chainInfo.name.toLowerCase() != 'solana') {
                console.log('signTransaction only supports solana');
                Toast.show({
                    type: 'error',
                    text1: 'signTransaction only supports solana',
                });
                return;
            }

            console.log('sender: ', publicAddress);
            const transaction = await Helper.getSolanaTransaction(publicAddress);
            console.log('transaction:', transaction);

            const signature = await particleConnect.signTransaction(walletType, publicAddress, transaction)

            console.log(signature);

            Toast.show({
                type: 'success',
                text1: 'Successfully sign transaction ',
                text2: signature,
            });

        } catch (e) {
            const error = e as CommonError;
            console.log(error);

            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    };

    const signAllTransactions = async () => {
        const publicAddress = accountInfo.publicAddress;
        const walletType = accountInfo.walletType!;

        try {
            const chainInfo = await particleBase.getChainInfo()

            if (chainInfo.name.toLowerCase() != 'solana') {
                console.log('signAllTransactions only supports solana');
                Toast.show({
                    type: 'error',
                    text1: 'signAllTransactions only supports solana',
                });
                return;
            }

            console.log('sender: ', publicAddress);
            const transaction = await Helper.getSolanaTransaction(publicAddress);
            console.log('transaction:', transaction);

            const transactions = [transaction, transaction];
            const signatures = await particleConnect.signAllTransactions(
                walletType,
                publicAddress,
                transactions
            );

            console.log(signatures);
            Toast.show({
                type: 'success',
                text1: 'Successfully sign transaction ',
                text2: signatures.join(','),
            });
        } catch (e) {
            const error = e as CommonError;
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    };

    const signAndSendTransaction = async () => {
        const publicAddress = accountInfo.publicAddress;
        const walletType = accountInfo.walletType!;

        try {
            const chainInfo = await particleBase.getChainInfo()

            let transaction = '';
            if (chainInfo.name.toLowerCase() == 'solana') {
                transaction = await Helper.getSolanaTransaction(publicAddress);
            } else {
                const receiver = TestAccountEVM.receiverAddress;
                const amount = TestAccountEVM.amount;
                transaction = await Helper.getEthereumTransacion(
                    publicAddress,
                    receiver,
                    BigNumber(amount)
                );
            }

            console.log(transaction);
            const txHash = await particleConnect.signAndSendTransaction(
                walletType,
                publicAddress,
                transaction
            );

            console.log('signAndSendTransaction:', txHash);
            Toast.show({
                type: 'success',
                text1: 'Successfully sign transaction ',
                text2: txHash,
            });
        } catch (e) {
            const error = e as CommonError;
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    };

    const getTypedDataV4 = async () => {
        const chainInfo = await particleBase.getChainInfo()
        const typedData: string = `{"types":{"OrderComponents":[{"name":"offerer","type":"address"},{"name":"zone","type":"address"},{"name":"offer","type":"OfferItem[]"},{"name":"consideration","type":"ConsiderationItem[]"},{"name":"orderType","type":"uint8"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"zoneHash","type":"bytes32"},{"name":"salt","type":"uint256"},{"name":"conduitKey","type":"bytes32"},{"name":"counter","type":"uint256"}],"OfferItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"}],"ConsiderationItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"},{"name":"recipient","type":"address"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"name":"Seaport","version":"1.1","chainId":${chainInfo.id},"verifyingContract":"0x00000000006c3852cbef3e08e8df289169ede581"},"primaryType":"OrderComponents","message":{"offerer":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d","zone":"0x0000000000000000000000000000000000000000","offer":[{"itemType":"2","token":"0xd15b1210187f313ab692013a2544cb8b394e2291","identifierOrCriteria":"33","startAmount":"1","endAmount":"1"}],"consideration":[{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"9750000000000000","endAmount":"9750000000000000","recipient":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d"},{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"250000000000000","endAmount":"250000000000000","recipient":"0x66682e752d592cbb2f5a1b49dd1c700c9d6bfb32"}],"orderType":"0","startTime":"1669188008","endTime":"115792089237316195423570985008687907853269984665640564039457584007913129639935","zoneHash":"0x3000000000000000000000000000000000000000000000000000000000000000","salt":"48774942683212973027050485287938321229825134327779899253702941089107382707469","conduitKey":"0x0000000000000000000000000000000000000000000000000000000000000000","counter":"0"}}`;
        return typedData;
    }

    const signTypedData = async () => {
        const publicAddress = accountInfo.publicAddress;
        const walletType = accountInfo.walletType!;

        try {

            const chainInfo = await particleBase.getChainInfo()

            if (chainInfo.name.toLowerCase() == 'solana') {
                console.log('signTypedData only supports evm');
                Toast.show({
                    type: 'error',
                    text1: 'signTypedData only supports evm',
                });
                return;
            }

            const typedData = await getTypedDataV4();
            const signature = await particleConnect.signTypedData(
                walletType,
                publicAddress,
                typedData
            );

            console.log(signature);
            Toast.show({
                type: 'success',
                text1: 'Successfully sign typed data',
                text2: signature,
            });
        } catch (e) {
            const error = e as CommonError;
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    };

    const signInWithEthereum = async () => {
        const publicAddress = accountInfo.publicAddress;
        const walletType = accountInfo.walletType!;
        try {

            const domain = 'login.xyz';
            const uri = 'https://login.xyz/demo#login';
            const result = await particleConnect.signInWithEthereum(
                walletType,
                publicAddress,
                domain,
                uri
            );

            const message = result.message;
            const signature = result.signature;

            setMessage(message);
            setSignature(signature);

            console.log('login message:', message);
            console.log('login signature:', signature);

            Toast.show({
                type: 'success',
                text1: 'Login successfully',
            });

        } catch (e) {
            const error = e as CommonError;
            console.log(error);
            Toast.show({
                type: 'success',
                text1: error.message,
            });
        }
    };

    const verify = async () => {
        const publicAddress = accountInfo.publicAddress;
        const walletType = accountInfo.walletType!;

        try {
            if (message === "" || signature === "") {
                console.log('message or signature is underfined');
                return;
            }
            console.log('verify message:', message);
            console.log('verify signature:', signature);
            const result = await particleConnect.verify(
                walletType,
                publicAddress,
                message,
                signature
            );

            console.log(result);

            Toast.show({
                type: 'info',
                text1: String(result),
            });

        } catch (e) {
            const error = e as CommonError;
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    };

    const getUserInfo = async () => {
        try {
            const userInfo = await particleAuthCore.getUserInfo();
            console.log('userInfo ', userInfo);
            Toast.show({
                type: 'info',
                text1: JSON.stringify(userInfo),
            });
        } catch (e) {
            const error = e as CommonError;
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    }

    const openAccountAndSecurity = async () => {
        try {
            const result = await particleAuthCore.openAccountAndSecurity();
            console.log('result ', result);
        } catch (e) {
            const error = e as CommonError;
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    }
    const hasMasterPassword = async () => {
        try {
            const hasMasterPassword = await particleAuthCore.hasMasterPassword();
            console.log('hasMasterPassword ', hasMasterPassword);
            Toast.show({
                type: 'info',
                text1: hasMasterPassword.toString(),
            });
        } catch (e) {
            const error = e as CommonError;
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    }

    const hasPaymentPassword = async () => {
        try {
            const hasPaymentPassword = await particleAuthCore.hasPaymentPassword();
            console.log('hasPaymentPassword ', hasPaymentPassword);
            Toast.show({
                type: 'info',
                text1: hasPaymentPassword.toString(),
            });
        } catch (e) {
            const error = e as CommonError;
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    }

    const changeMasterPassword = async () => {
        try {
            const result = await particleAuthCore.changeMasterPassword();
            console.log('result ', result);
        } catch (e) {
            const error = e as CommonError;
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    }

    const generalMethods = [
        { key: 'GetAccounts', function: getAccounts },
        { key: 'Disconnect', function: disconnect },
        { key: 'IsConnected', function: isConnected },
        { key: 'SignMessage', function: signMessage },
        { key: 'SignTransaction', function: signTransaction },
        { key: 'SignAllTransactions', function: signAllTransactions },
        { key: 'SignAndSendTransaction', function: signAndSendTransaction },
        { key: 'SignTypedData', function: signTypedData },
        { key: 'SignInWithEthereum', function: signInWithEthereum },
        { key: 'Verify', function: verify },
    ];

    const authCoreMethods = [
        { key: 'GetUserInfo', function: getUserInfo },
        { key: 'OpenAccountAndSecurity', function: openAccountAndSecurity },
        { key: 'HasMasterPassword', function: hasMasterPassword },
        { key: 'HasPaymentPassword', function: hasPaymentPassword },
        { key: 'ChangeMasterPassword', function: changeMasterPassword },
    ]

    return (
        <View style={styles.container}>
            <FlatList
                // @ts-ignore
                data={accountInfo.walletType! == WalletType.AuthCore ? authCoreMethods.concat(generalMethods) : generalMethods}
                renderItem={({ item }: { item: { key: string; function: () => void } }) => (
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        accessibilityRole="button"
                        onPress={async () => {
                            if (item.key == 'Select Chain Page') {
                                // @ts-ignore
                                navigation.push('SelectChainPage');
                            } else {
                                await item.function();
                            }
                        }}
                    >
                        <Text style={styles.textStyle}>{item.key}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    image: {
        width: 40,
        height: 40,
        marginLeft: 10,
    },
    connectButton: {
        position: 'absolute',
        right: 20,
        bottom: 100,
        backgroundColor: '#6200EE',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    textContainer: {
        flexDirection: 'column',
        marginLeft: 5,
    },
    connectButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonStyle: {
        backgroundColor: '#9933ff',
        borderRadius: 14,
        margin: 5,
        height: 40,
        width: 340,
        justifyContent: 'center',
    },
    textStyle: {
        color: 'white',
        textAlign: 'center',
    },
    addressTextStyle: {
        color: 'black',
        textAlign: 'left',
        fontSize: 9
    },
    flatListContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    textMargin: {
        marginBottom: 5,
    },
});
