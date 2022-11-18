import React, { PureComponent } from 'react';
import { NativeModules, StyleSheet, View, SafeAreaView, FlatList, Platform } from 'react-native';
import { Language, UserInterfaceStyle, WalletDisplay, WalletType, Env, ChainInfo } from 'react-native-particle-connect'
import { Button } from '@rneui/themed';
import * as particleConnect from 'react-native-particle-connect';
import { TestAccountEVM, TestAccountSolana } from './TestAccount';
import * as particleWallet from 'react-native-particle-wallet';
import { BuyCryptoConfig, OpenBuyNetwork } from 'react-native-particle-wallet';

init = async () => {
    const chainInfo = ChainInfo.EthereumGoerli;
    const env = Env.Dev;
    const metadata = { name: "Particle Connect", icon: "https://connect.particle.network/icons/512.png", url: "https://connect.particle.network" }
    const rpcUrl = { evm_url: null, solana_url: null };
    particleConnect.init(chainInfo, env, metadata, rpcUrl);
    particleWallet.initWallet()
}

// Wallet Service should use after connected a wallet, so add this method to help test wallet methods.
// Before this, you'd better login metamask with our testAccount in TestAccount.js
// TestAccount provides both evm and solana test account with some tokens.
connectMetamask = async () => {
    const account = await particleConnect.connect(WalletType.MetaMask);
    console.log(account);
}

navigatorWallet = async () => {
    const display = WalletDisplay.Token;
    particleWallet.navigatorWallet(display);
}

navigatorTokenReceive = async () => {
    const tokenAddress = TestAccountSolana.tokenContractAddress;
    particleWallet.navigatorTokenReceive(tokenAddress);
}

navigatorTokenSend = async () => {
    const tokenAddress = TestAccountSolana.tokenContractAddress;
    const toAddress = TestAccountSolana.receiverAddress;
    const amount = "1000000000";
    particleWallet.navigatorTokenSend(tokenAddress, toAddress, amount);
}

navigatorTokenTransactionRecords = async () => {
    const tokenAddress = TestAccountSolana.tokenContractAddress;
    particleWallet.navigatorTokenTransactionRecords(tokenAddress);

}

navigatorNFTSend = async () => {
    const mint = TestAccountEVM.nftContractAddress;
    const receiverAddress = TestAccountEVM.receiverAddress;
    const tokenId = TestAccountEVM.nftTokenId;
    particleWallet.navigatorNFTSend(receiverAddress, mint, tokenId);
}

navigatorNFTDetails = async () => {
    const mint = TestAccountEVM.nftContractAddress;
    const tokenId = TestAccountEVM.nftTokenId;
    particleWallet.navigatorNFTDetails(mint, tokenId);
}

navigatorBuyCrypto = async () => {
    // support no parameters
    // particleWallet.navigatorBuyCrypto();

    // also support pass public address, crypto symbol and so on.
    const config = new BuyCryptoConfig("0xa0869E99886e1b6737A4364F2cf9Bb454FD637E4", "BNB", "USD", 1000, OpenBuyNetwork.BinanceSmartChain);
    particleWallet.navigatorBuyCrypto(config);
}

navigatorLoginList = async () => {
    const result = await particleWallet.navigatorLoginList();
    console.log(result)
}

navigatorSwap = async () => {
    const fromTokenAddress = "";
    const toTokenAddress = "";
    const amount = "";
    particleWallet.navigatorSwap(fromTokenAddress, toTokenAddress, amount);
}

showTestNetwork = async () => {
    const isShow = true;
    particleWallet.showTestNetwork(isShow);
}

showManageWallet = async () => {
    const isShow = true;
    particleWallet.showManageWallet(isShow);
}

supportChain = async () => {
    const chainInfos = [ChainInfo.EthereumMainnet, ChainInfo.BscMainnet, ChainInfo.PolygonMainnet];
    particleWallet.supportChain(chainInfos);
}

enablePay = async () => {
    const isEnable = true;
    particleWallet.enablePay(isEnable);
}

getEnablePay = async () => {
    const result = await particleWallet.getEnablePay();
    console.log(result);
}

enableSwap = async () => {
    const isEnable = true;
    particleWallet.enableSwap(isEnable);
}

getEnableSwap = async () => {
    const result = await particleWallet.getEnableSwap();
    console.log(result);
}

switchWallet = async () => {
    const walletType = WalletType.MetaMask;
    const publicAddress = TestAccountEVM.publicAddress;

    const result = await particleWallet.switchWallet(walletType, publicAddress);
    console.log(result);

}

//only support iOS
setLanguage = async () => {
    const language = Language.Zh_hans
    particleWallet.setLanguage(language);
}
//only support iOS
setInterfaceStyle = async () => {
    const userInterfaceStyle = UserInterfaceStyle.Light
    particleWallet.setInterfaceStyle(userInterfaceStyle);
}

const data = [
    { key: 'Init', function: this.init },
    { key: 'ConnectMetamask', function: this.connectMetamask },
    { key: 'NavigatorWallet', function: this.navigatorWallet },
    { key: 'NavigatorTokenReceive', function: this.navigatorTokenReceive },
    { key: 'NavigatorTokenSend', function: this.navigatorTokenSend },
    { key: 'NavigatorTokenTransactionRecords', function: this.navigatorTokenTransactionRecords },
    { key: 'NavigatorNFTSend', function: this.navigatorNFTSend },
    { key: 'NavigatorNFTDetails', function: this.navigatorNFTDetails },
    { key: 'NavigatorBuyCrypto', function: this.navigatorBuyCrypto },
    { key: 'NavigatorLoginList', function: this.navigatorLoginList },
    { key: 'NavigatorSwap', function: this.navigatorSwap },
    { key: 'ShowTestNetwork', function: this.showTestNetwork },
    { key: 'ShowManageWallet', function: this.showManageWallet },
    { key: 'SupportChain', function: this.supportChain },
    { key: 'EnablePay', function: this.enablePay },
    { key: 'GetEnablePay', function: this.getEnablePay },
    { key: 'EnableSwap', function: this.enableSwap },
    { key: 'GetEnableSwap', function: this.getEnableSwap },
    { key: 'SwitchWallet', function: this.switchWallet },
    { key: 'SetLanguage', function: this.setLanguage },
    { key: 'SetInterfaceStyle', function: this.setInterfaceStyle },
];

export default class GUIDemo extends PureComponent {
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
