import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList } from 'react-native';
import { Button } from '@rneui/themed';

import * as particleConnect from 'react-native-particle-connect';
import { TestAccountEVM, TestAccountSolana } from './TestAccount';
import * as Helper from './Helper';
import { WalletType, Env} from 'react-native-particle-connect';

const walletType = WalletType.MetaMask
var loginSourceMessage = "";
var loginSignature = "";

getAccounts = async () => {
    const accounts = await particleConnect.getAccounts(walletType);
    console.log(accounts);
}

setChainInfo = async () => {
    const chainInfo = EthereumGoerli;
    const result = await particleConnect.setChainInfo(chainInfo);
    console.log(result);

}

init = async () => {
    const chainInfo = EthereumGoerli;
    const env = Env.Dev;
    const metadata = { name: "Particle Connect", icon: "https://connect.particle.network/icons/512.png", url: "https://connect.particle.network" }
    const rpcUrl = { evm_url: null, solana_url: null };
    particleConnect.init(chainInfo, env, metadata, rpcUrl);
}

connect = async () => {
    const result = await particleConnect.connect(walletType);
    if (result.status) {
        const account = result.data;
        console.log(account);
    } else {
        const error = result.data;
        console.log(error);
    }
}

disconnect = async () => {
    const publicAddress = TestAccountEVM.publicAddress;
    const result = await particleConnect.disconnect(walletType, publicAddress);
    if (result.status) {
        console.log(result.data);
    } else {
        const error = result.data;
        console.log(error);
    }
}

isConnected = async () => {
    const publicAddress = TestAccountEVM.publicAddress;
    const isConnected = await particleConnect.isConnected(walletType, publicAddress);
    console.log(isConnected);
}

signMessage = async () => {
    const message = "Hello world!"
    const publicAddress = TestAccountEVM.publicAddress;
    const result = await particleConnect.signMessage(walletType, publicAddress, message);
    if (result.status) {
        const signedMessage = result.data;
        console.log(signedMessage);
    } else {
        const error = result.data;
        console.log(error);
    }

}

signTransaction = async () => {
    const transaction = ""
    const publicAddress = TestAccountEVM.publicAddress;
    const result = await particleConnect.signTransaction(walletType, publicAddress, transaction);
    if (result.status) {
        const signedTransaction = result.data;
        console.log(signedTransaction);
    } else {
        const error = result.data;
        console.log(error);
    }
}

signAllTransactions = async () => {
    const transactions = ["", ""]
    const publicAddress = TestAccountEVM.publicAddress;
    const result = await particleConnect.signAllTransactions(walletType, publicAddress, transactions);
    if (result.status) {
        const signedTransactions = result.data;
        console.log(signedTransactions);
    } else {
        const error = result.data;
        console.log(error);
    }
}

signAndSendTransaction = async () => {
    const transaction = await Helper.getEthereumTransacion(TestAccountEVM.publicAddress);
    console.log(transaction);
    const publicAddress = TestAccountEVM.publicAddress;
    const result = await particleConnect.signAndSendTransaction(walletType, publicAddress, transaction);
    if (result.status) {
        const signature = result.data;
        console.log("signAndSendTransaction:", signature);
    } else {
        const error = result.data;
        console.log(error);
    }

}

signTypedData = async () => {
    const typedData = "{        \"types\": {            \"EIP712Domain\": [                {                    \"name\": \"name\",                    \"type\": \"string\"                },                {                    \"name\": \"version\",                    \"type\": \"string\"                },                {                    \"name\": \"chainId\",                    \"type\": \"uint256\"                },                {                    \"name\": \"verifyingContract\",                    \"type\": \"address\"                }            ],            \"Person\": [                {                    \"name\": \"name\",                    \"type\": \"string\"                },                {                    \"name\": \"wallet\",                    \"type\": \"address\"                }            ],            \"Mail\": [                {                    \"name\": \"from\",                    \"type\": \"Person\"                },                {                    \"name\": \"to\",                    \"type\": \"Person\"                },                {                    \"name\": \"contents\",                    \"type\": \"string\"                }            ]        },        \"primaryType\": \"Mail\",        \"domain\": {            \"name\": \"Ether Mail\",            \"version\": \"1\",            \"chainId\": 5,            \"verifyingContract\": \"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC\"        },        \"message\": {            \"from\": {                \"name\": \"Cow\",                \"wallet\": \"0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826\"            },            \"to\": {                \"name\": \"Bob\",                \"wallet\": \"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB\"            },            \"contents\": \"Hello, Bob!\"        }}        ";
    const publicAddress = TestAccountEVM.publicAddress;
    const result = await particleConnect.signTypedData(walletType, publicAddress, typedData);
    if (result.status) {
        const signature = result.data;
        console.log(signature);
    } else {
        const error = result.data;
        console.log(error);
    }
}

login = async () => {
    const publicAddress = TestAccountEVM.publicAddress;
    const domain = "login.xyz";
    const uri = "https://login.xyz/demo#login";
    const result = await particleConnect.login(walletType, publicAddress, domain, uri);
    if (result.status) {
        const message = result.data.message;
        loginSourceMessage = message;
        const signature = result.data.signature;
        loginSignature = signature
        console.log("login message:", message);
        console.log("login signature:", signature);
    } else {
        const error = result.data;
        console.log(error);
    }

}

verify = async () => {
    const publicAddress = TestAccountEVM.publicAddress;
    const message = loginSourceMessage;
    const signature = loginSignature;
    console.log("verify message:", message);
    console.log("verify signature:", signature);
    const result = await particleConnect.verify(walletType, publicAddress, message, signature);
    if (result.status) {
        const flag = result.data;
        console.log(flag);
    } else {
        const error = result.data;
        console.log(error);
    }
}

importPrivateKey = async () => {
    const privateKey = TestAccountEVM.privateKey;
    const result = await particleConnect.importPrivateKey(WalletType.EvmPrivateKey, privateKey);
    if (result.status) {
        const account = result.data;
        console.log(account);
    } else {
        const error = result.data;
        console.log(error);
    }
}

importMnemonic = async () => {
    const mnemonic = TestAccountEVM.mnemonic;
    const result = await particleConnect.importMnemonic(WalletType.EvmPrivateKey, mnemonic);
    if (result.status) {
        const account = result.data;
        console.log(account);
    } else {
        const error = result.data;
        console.log(error);
    }
}

exportPrivateKey = async () => {
    const publicAddress = TestAccountEVM.publicAddress;
    const result = await particleConnect.exportPrivateKey(WalletType.EvmPrivateKey, publicAddress);
    if (result.status) {
        const privateKey = result.data;
        console.log(privateKey);
    } else {
        const error = result.data;
        console.log(error);
    }
}


const data = [
    { key: 'Init', function: this.init },
    { key: 'SetChainInfo', function: this.setChainInfo },
    { key: 'GetAccounts', function: this.getAccounts },
    { key: 'Connect', function: this.connect },
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
];

export default class ConnectDemo extends PureComponent {
    render = () => {
        return (
            <SafeAreaView>
                <FlatList data={data} renderItem={({ item }) => <Item item={item} />} />
            </SafeAreaView >
        );
    }
}

const Item = ({ item }) => {
    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Button
                title={item.key}
                onPress={item.function}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.containerStyle} />
        </View>
    )
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
    }
});
