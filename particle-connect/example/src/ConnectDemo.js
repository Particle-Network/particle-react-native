import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList } from 'react-native';
import { Button } from '@rneui/themed';

import * as particleConnect from 'react-native-particle-connect';
import { TestAccountEVM, TestAccountSolana } from './TestAccount';
import * as Helper from './Helper';
import {
    Env,
    LoginType,
    SupportAuthType,
    WalletType,
} from 'react-native-particle-connect';
import { ChainInfo } from 'react-native-particle-connect';
import { ParticleConnectConfig } from 'react-native-particle-connect';
import { PNAccount } from './Models/PNAccount';
import { EvmService } from './NetService/EvmService';

var loginSourceMessage = '';
var loginSignature = '';

var pnaccount = new PNAccount();

getAccounts = async () => {
    const accounts = await particleConnect.getAccounts(PNAccount.walletType);
    console.log(accounts);
};

setChainInfo = async () => {
    console.log('current wallet type', PNAccount.walletType);
    const chainInfo = EvmService.currentChainInfo;
    const result = await particleConnect.setChainInfo(chainInfo);
    console.log(result);
};

getChainInfo = async () => {
    const chainInfo = await particleConnect.getChainInfo();
    console.log(chainInfo);
};

setChainInfoAsync = async () => {
    const chainInfo = EvmService.currentChainInfo;
    const result = await particleConnect.setChainInfoAsync(chainInfo);
    console.log(result);
};

init = async () => {
    const chainInfo = EvmService.currentChainInfo;
    const env = Env.Dev;
    const metadata = {
        name: 'Particle Connect',
        icon: 'https://connect.particle.network/icons/512.png',
        url: 'https://connect.particle.network',
    };
    const rpcUrl = { evm_url: null, solana_url: null };
    particleConnect.init(chainInfo, env, metadata, rpcUrl);
};

connect = async () => {
    const result = await particleConnect.connect(PNAccount.walletType);
    if (result.status) {
        console.log('connect success');
        const account = result.data;
        pnaccount = new PNAccount(
            account.icons,
            account.name,
            account.publicAddress,
            account.url
        );
        console.log('pnaccount = ', pnaccount);
    } else {
        console.log('connect failure');
        const error = result.data;
        console.log(error);
    }
};

connectWithParticleConfig = async () => {
    const connectConfig = new ParticleConnectConfig(LoginType.Phone, '', [
        SupportAuthType.Email,
        SupportAuthType.Google,
        SupportAuthType.Apple,
    ]);
    const result = await particleConnect.connect(
        WalletType.Particle,
        connectConfig
    );
    if (result.status) {
        console.log('connect success');
        const account = result.data;
        pnaccount = new PNAccount(
            account.icons,
            account.name,
            account.publicAddress,
            account.url
        );
        console.log('pnaccount = ', pnaccount);
    } else {
        console.log('connect failure');
        const error = result.data;
        console.log(error);
    }
};

disconnect = async () => {
    const publicAddress = pnaccount.publicAddress;
    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }
    const result = await particleConnect.disconnect(PNAccount.walletType, publicAddress);
    if (result.status) {
        console.log(result.data);
    } else {
        const error = result.data;
        console.log(error);
    }
};

isConnected = async () => {
    const publicAddress = pnaccount.publicAddress;
    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }
    const isConnected = await particleConnect.isConnected(
        PNAccount.walletType,
        publicAddress
    );
    console.log(isConnected);
};

signMessage = async () => {

    const publicAddress = pnaccount.publicAddress;
    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }
    const message = 'Hello world!';
    const result = await particleConnect.signMessage(
        PNAccount.walletType,
        publicAddress,
        message
    );
    if (result.status) {
        const signedMessage = result.data;
        console.log(signedMessage);
    } else {
        const error = result.data;
        console.log(error);
    }
};

signTransaction = async () => {

    const publicAddress = pnaccount.publicAddress;
    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }
    const transaction = '';
    const result = await particleConnect.signTransaction(
        PNAccount.walletType,
        publicAddress,
        transaction
    );
    if (result.status) {
        const signedTransaction = result.data;
        console.log(signedTransaction);
    } else {
        const error = result.data;
        console.log(error);
    }
};

signAllTransactions = async () => {

    const publicAddress = pnaccount.publicAddress;
    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }
    const transactions = ['', ''];
    const result = await particleConnect.signAllTransactions(
        PNAccount.walletType,
        publicAddress,
        transactions
    );
    if (result.status) {
        const signedTransactions = result.data;
        console.log(signedTransactions);
    } else {
        const error = result.data;
        console.log(error);
    }
};

signAndSendTransaction = async () => {


    const publicAddress = pnaccount.publicAddress;

    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }

    const transaction = await Helper.getEthereumTransacion(
        pnaccount.publicAddress
    );
    console.log(transaction);
    const result = await particleConnect.signAndSendTransaction(
        PNAccount.walletType,
        publicAddress,
        transaction
    );
    if (result.status) {
        const signature = result.data;
        console.log('signAndSendTransaction:', signature);
    } else {
        const error = result.data;
        console.log(error);
    }
};

signTypedData = async () => {
    const typedData =
        '{        "types": {            "EIP712Domain": [                {                    "name": "name",                    "type": "string"                },                {                    "name": "version",                    "type": "string"                },                {                    "name": "chainId",                    "type": "uint256"                },                {                    "name": "verifyingContract",                    "type": "address"                }            ],            "Person": [                {                    "name": "name",                    "type": "string"                },                {                    "name": "wallet",                    "type": "address"                }            ],            "Mail": [                {                    "name": "from",                    "type": "Person"                },                {                    "name": "to",                    "type": "Person"                },                {                    "name": "contents",                    "type": "string"                }            ]        },        "primaryType": "Mail",        "domain": {            "name": "Ether Mail",            "version": "1",            "chainId": 5,            "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"        },        "message": {            "from": {                "name": "Cow",                "wallet": "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"            },            "to": {                "name": "Bob",                "wallet": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"            },            "contents": "Hello, Bob!"        }}        ';
    const publicAddress = pnaccount.publicAddress;
    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }
    const result = await particleConnect.signTypedData(
        PNAccount.walletType,
        publicAddress,
        typedData
    );
    if (result.status) {
        const signature = result.data;
        console.log(signature);
    } else {
        const error = result.data;
        console.log(error);
    }
};

login = async () => {
    const publicAddress = pnaccount.publicAddress;

    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }

    const domain = 'login.xyz';
    const uri = 'https://login.xyz/demo#login';
    const result = await particleConnect.login(
        PNAccount.walletType,
        publicAddress,
        domain,
        uri
    );
    if (result.status) {
        const message = result.data.message;
        loginSourceMessage = message;
        const signature = result.data.signature;
        loginSignature = signature;
        console.log('login message:', message);
        console.log('login signature:', signature);
    } else {
        const error = result.data;
        console.log(error);
    }
};

verify = async () => {
    const publicAddress = pnaccount.publicAddress;
    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }
    const message = loginSourceMessage;
    const signature = loginSignature;
    if (message == undefined || signature == undefined) {
        console.log('message or signature is underfined');
        return;
    }
    console.log('verify message:', message);
    console.log('verify signature:', signature);
    const result = await particleConnect.verify(
        PNAccount.walletType,
        publicAddress,
        message,
        signature
    );
    if (result.status) {
        const flag = result.data;
        console.log(flag);
    } else {
        const error = result.data;
        console.log(error);
    }
};

importPrivateKey = async () => {
    // this method only support WalletType is SolanaPrivateKey or EvmPrivateKey
    // we provide a private key for test
    const privateKey = TestAccountEVM.privateKey;
    const result = await particleConnect.importPrivateKey(
        WalletType.EvmPrivateKey,
        privateKey
    );
    if (result.status) {
        const account = result.data;
        console.log(account);
    } else {
        const error = result.data;
        console.log(error);
    }
};

importMnemonic = async () => {
    // this method only support WalletType is SolanaPrivateKey or EvmPrivateKey
    // we provide a mnemonic for test
    const mnemonic = TestAccountEVM.mnemonic;
    const result = await particleConnect.importMnemonic(
        WalletType.EvmPrivateKey,
        mnemonic
    );
    if (result.status) {
        const account = result.data;
        console.log(account);
    } else {
        const error = result.data;
        console.log(error);
    }
};

exportPrivateKey = async () => {
    // this method only support WalletType is SolanaPrivateKey or EvmPrivateKey
    const publicAddress = TestAccountEVM.publicAddress;
    const result = await particleConnect.exportPrivateKey(
        WalletType.EvmPrivateKey,
        publicAddress
    );
    if (result.status) {
        const privateKey = result.data;
        console.log(privateKey);
    } else {
        const error = result.data;
        console.log(error);
    }
};


addEthereumChain = async () => {
    const publicAddress = pnaccount.publicAddress;
    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }

    console.log(publicAddress);
    const result = await particleConnect.addEthereumChain(
        PNAccount.walletType,
        publicAddress,
        EvmService.currentChainInfo
    );

    if (result.status) {
        const data = result.data;
        console.log(data);
    } else {
        const error = result.data;
        console.log(error);
    }
};

switchEthereumChain = async () => {
    const publicAddress = pnaccount.publicAddress;

    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }

    const result = await particleConnect.switchEthereumChain(
        PNAccount.walletType,
        publicAddress,
        EvmService.currentChainInfo
    );

    if (result.status) {
        const data = result.data;
        console.log(data);
    } else {
        const error = result.data;
        console.log(error);
    }
};

reconnectIfNeeded = async () => {
    const publicAddress = TestAccountEVM.publicAddress;

    if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
    }

    const result = await particleConnect.reconnectIfNeeded(
        PNAccount.walletType,
        publicAddress
    );

    if (result.status) {
        const data = result.data;
        console.log(data);
    } else {
        const error = result.data;
        console.log(error);
    }
};

const data = [
    { key: 'Select Chain Page', function: null },
    { key: 'Select Wallet Type Page', function: null },
    { key: 'Init', function: this.init },
    { key: 'SetChainInfo', function: this.setChainInfo },
    { key: 'SetChainInfoAsync', function: this.setChainInfoAsync },
    { key: 'GetChainInfo', function: this.getChainInfo },
    { key: 'GetAccounts', function: this.getAccounts },
    { key: 'Connect', function: this.connect },
    { key: 'ConnectWithParticleConfig', function: this.connectWithParticleConfig },
    { key: 'Disconnect', function: this.disconnect },
    { key: 'IsConnected', function: this.isConnected },
    { key: 'SignMessage', function: this.signMessage },
    { key: 'SignTransaction', function: this.signTransaction },
    { key: 'SignAllTransactions', function: this.signAllTransactions },
    { key: 'SignAndSendTransaction', function: this.signAndSendTransaction },
    { key: 'SignTypedData', function: this.signTypedData },
    { key: 'Login', function: this.login },
    { key: 'Verify', function: this.verify },
    { key: 'ImportPrivateKey', function: this.importPrivateKey },
    { key: 'ImportMnemonic', function: this.importMnemonic },
    { key: 'ExportPrivateKey', function: this.exportPrivateKey },
    { key: 'AddEthereumChain', function: this.addEthereumChain },
    { key: 'SwitchEthereumChain', function: this.switchEthereumChain },
    { key: 'ReconnectIfNeeded', function: this.reconnectIfNeeded },
];

export default class ConnectDemo extends PureComponent {

    render = () => {
        const { navigation, route } = this.props;

        return (
            <SafeAreaView>
                <FlatList data={data} renderItem={
                    ({ item }) =>
                        <Button
                            title={item.key}
                            onPress={() => {
                                if (item.key == "Select Chain Page") {
                                    navigation.push("SelectChainPage");
                                } else if (item.key == 'Select Wallet Type Page') {
                                    navigation.push("SelectWalletTypePage");
                                } else {
                                    item.function();
                                }
                            }}
                            buttonStyle={styles.buttonStyle}
                            containerStyle={styles.containerStyle} />
                } />
            </SafeAreaView>
        );
    };

}

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
