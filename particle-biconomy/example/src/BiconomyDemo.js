import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, DeviceEventEmitter, NativeEventEmitter } from 'react-native';
import * as particleBiconomy from 'react-native-particle-biconomy';

init = () => {
    particleBiconomy.init()
    const chainInfo = EvmService.currentChainInfo;
    const env = Env.Production;
    particleAuth.init(chainInfo, env);
};

setChainInfo = async () => {
    const chainInfo = EvmService.currentChainInfo;
    const result = await particleAuth.setChainInfo(chainInfo);
    console.log(result);
};

setChainInfoAsync = async () => {
    const chainInfo = EvmService.currentChainInfo;
    const result = await particleAuth.setChainInfoAsync(chainInfo);
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

logout = async () => {
    const result = await particleAuth.logout();
    if (result.status) {
        console.log(result.data);
    } else {
        const error = result.data;
        console.log(error);
    }
};

fastLogout = async () => {
    const result = await particleAuth.fastLogout();
    if (result.status) {
        console.log(result.data);
    } else {
        const error = result.data;
        console.log(error);
    }
};

isLogin = async () => {
    const result = await particleAuth.isLogin();
    console.log(result);
};

isLoginAsync = async () => {
    const result = await particleAuth.isLoginAsync();
    if (result.status) {
        const userInfo = result.data;
        console.log(userInfo);
    } else {
        const error = result.data;
        console.log(error);
    }
};

signMessage = async () => {
    const message = 'Hello world!';
    const result = await particleAuth.signMessage(message);
    if (result.status) {
        const signedMessage = result.data;
        console.log(signedMessage);
    } else {
        const error = result.data;
        console.log(error);
    }
};

signTransaction = async () => {
    const chainInfo = await particleAuth.getChainInfo();
    if (chainInfo.chain_name.toLowerCase() != 'solana') {
        console.log('signTransaction only supports solana');
        return;
    }
    const sender = await particleAuth.getAddress();
    console.log('sender: ', sender);
    const transaction = await Helper.getSolanaTransaction(sender);
    console.log('transaction:', transaction);
    const result = await particleAuth.signTransaction(transaction);
    if (result.status) {
        const signedTransaction = result.data;
        console.log(signedTransaction);
    } else {
        const error = result.data;
        console.log(error);
    }
};

signAllTransactions = async () => {
    const chainInfo = await particleAuth.getChainInfo();
    if (chainInfo.chain_name.toLowerCase() != 'solana') {
        console.log('signAllTransactions only supports solana');
        return;
    }
    const sender = await particleAuth.getAddress();
    const transaction1 = await Helper.getSolanaTransaction(sender);
    const transaction2 = await Helper.getSplTokenTransaction(sender);
    const transactions = [transaction1, transaction2];
    const result = await particleAuth.signAllTransactions(transactions);
    if (result.status) {
        const signedTransactions = result.data;
        console.log(signedTransactions);
    } else {
        const error = result.data;
        console.log(error);
    }
};

signAndSendTransaction = async () => {
    const sender = await particleAuth.getAddress();
    const chainInfo = await particleAuth.getChainInfo();
    let transaction = '';
    // There are four test cases
    // Before test, make sure your public address have some native token for fee.
    // 1. send evm native in Ethereum goerli, the transacion is type 0x2, for blockchains support EIP1559
    // 2. send evm native in BSC testnet, the transacion is type 0x0, for blockchians don't supoort EIP1559
    // 3. send evm token in Ethereum goerli, the transacion is type 0x2, for blockchains support EIP1559
    // 4. send evm token in BSC testnet, the transacion is type 0x0, for blockchians don't supoort EIP1559
    let testCase = 1;

    if (chainInfo.chain_name.toLowerCase() == 'solana') {
        transaction = await Helper.getSolanaTransaction(sender);
    } else {
        if (testCase == 1) {
            const receiver = TestAccountEVM.receiverAddress;
            const amount = TestAccountEVM.amount;
            transaction = await Helper.getEthereumTransacion(sender, receiver, amount);
        } else if (testCase == 2) {
            const receiver = TestAccountEVM.receiverAddress;
            const amount = TestAccountEVM.amount;
            transaction = await Helper.getEthereumTransacionLegacy(sender, receiver, amount);
        } else if (testCase == 3) {
            const receiver = TestAccountEVM.receiverAddress;
            const amount = TestAccountEVM.amount;
            const contractAddress = TestAccountEVM.tokenContractAddress;
            transaction = await Helper.getEvmTokenTransaction(sender, receiver, amount, contractAddress);
        } else {
            const receiver = TestAccountEVM.receiverAddress;
            const amount = TestAccountEVM.amount;
            const contractAddress = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee';
            transaction = await Helper.getEvmTokenTransactionLegacy(sender, receiver, amount, contractAddress);
        }
    }
    console.log(transaction);
    const result = await particleAuth.signAndSendTransaction(transaction);
    if (result.status) {
        const signature = result.data;
        console.log(signature);
    } else {
        const error = result.data;
        console.log(error);
    }
};

signTypedData = async () => {
    const chainInfo = await particleAuth.getChainInfo();
    if (chainInfo.chain_name.toLowerCase() == 'solana') {
        console.log('signTypedData only supports evm');
        return;
    }
    const typedData =
        '[    {    "type":"string",    "name":"Message",    "value":"Hi, Alice!"    },    {    "type":"uint32",    "name":"A nunmber",    "value":"1337"    }]';

    const version = 'v1';

    const result = await particleAuth.signTypedData(typedData, version);
    if (result.status) {
        const signature = result.data;
        console.log(signature);
    } else {
        const error = result.data;
        console.log(error);
    }
};

openAccountAndSecurity = async () => {
    particleAuth.openAccountAndSecurity();
};

getAddress = async () => {
    const address = await particleAuth.getAddress();
    console.log(address);
};

getUserInfo = async () => {
    const result = await particleAuth.getUserInfo();
    const userInfo = JSON.parse(result);
    console.log(userInfo);
};

setModalPresentStyle = async () => {
    const style = iOSModalPresentStyle.FormSheet;
    particleAuth.setModalPresentStyle(style);
};

setMediumScreen = async () => {
    const isMedium = true;
    particleAuth.setMediumScreen(isMedium);
};

setLanguage = async () => {
    const language = Language.JA;
    particleAuth.setLanguage(language);
};

setDisplayWallet = async () => {
    const isDisplay = true;
    particleAuth.setDisplayWallet(isDisplay);
};

openWebWallet = async () => {
    particleAuth.openWebWallet();
};

getChainInfo = async () => {
    const result = await particleAuth.getChainInfo();
    console.log(result);
};

setUserInfo = async () => {
    const json = '';
    const result = await particleAuth.setUserInfo(json);
    console.log(result);
};

setSecurityAccountConfig = async () => {
    const config = new SecurityAccountConfig(1, 2);
    particleAuth.setSecurityAccountConfig(config);
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
