import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, Platform } from 'react-native';
import { WalletDisplay, WalletType, Env, ChainInfo } from 'react-native-particle-connect'
import { Button } from '@rneui/themed';
import * as particleConnect from 'react-native-particle-connect';
import { Language } from 'react-native-particle-auth';
import { TestAccountEVM, TestAccountSolana } from './TestAccount';
import * as particleWallet from 'react-native-particle-wallet';
import { BuyCryptoConfig, FaitCoin, OpenBuyNetwork } from 'react-native-particle-wallet';

init = async () => {
    const chainInfo = ChainInfo.EthereumGoerli;
    const env = Env.Dev;
    const metadata = { name: "Particle Connect", icon: "https://connect.particle.network/icons/512.png", url: "https://connect.particle.network" }
    const rpcUrl = { evm_url: null, solana_url: null };
    particleConnect.init(chainInfo, env, metadata, rpcUrl);
    particleWallet.initWallet()
}

setChainInfo = async () => {
    const chainInfo = ChainInfo.EthereumMainnet;
    particleConnect.setChainInfo(chainInfo);
}

// Wallet Service should use after connected a wallet, so add this method to help test wallet methods.
// Before this, you'd better login metamask with our testAccount in TestAccount.js
// TestAccount provides both evm and solana test account with some tokens.
connectMetamask = async () => {
    const accountInfo = await particleConnect.connect(WalletType.MetaMask);
    console.log('accountInfo', accountInfo.data.publicAddress);
    particleWallet.createSelectedWallet(accountInfo.data.publicAddress, WalletType.MetaMask);
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
    const amount = "1";
    particleWallet.navigatorNFTSend(mint, tokenId, receiverAddress, amount);
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
    // these are other parameters, they are optional.
    config.fixFiatCoin = true;
    config.fixCryptoCoin = true;
    config.fixFiatAmt = true;
    config.theme = "dark";
    config.language = Language.JA;
    particleWallet.navigatorBuyCrypto(config);
}

navigatorLoginList = async () => {
    const result = await particleWallet.navigatorLoginList();
    console.log('navigatorLoginList', result)
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

setLanguage = async () => {
    const language = Language.JA;
    particleWallet.setLanguage(language);
}

setFiatCoin = async () => {
    const faitCoin = FaitCoin.HKD;
    particleWallet.setFiatCoin(faitCoin);
}

setDisplayTokenAddresses = async () => {
    const tokenAddresses = ["", ""];
    particleWallet.setDisplayTokenAddresses(tokenAddresses);
}

setDisplayNFTContractAddresses = async () => {
    const nftContractAddresses = ["", ""];
    particleWallet.setDisplayNFTContractAddresses(nftContractAddresses);
}

setPriorityTokenAddresses = async () => {
    const tokenAddresses = ["", ""];
    particleWallet.setPriorityTokenAddresses(tokenAddresses);
}

setPriorityNFTContractAddresses = async () => {
    const nftContractAddresses = ["", ""];
    particleWallet.setPriorityNFTContractAddresses(nftContractAddresses);
}

showLanguageSetting = async () => {
    particleWallet.showLanguageSetting(false);
}

showAppearanceSetting = async () => {
    particleWallet.showAppearanceSetting(false);
}

setSupportAddToken = async () => {
    particleWallet.setSupportAddToken(false);
}

const data = [
    { key: 'Init', function: this.init },
    { key: 'SetChainInfo', function: this.setChainInfo },
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
    { key: 'SetFiatCoin', function: this.setFiatCoin },
    { key: 'SetDisplayTokenAddresses', function: this.setDisplayTokenAddresses },
    { key: 'SetDisplayNFTContractAddresses', function: this.setDisplayNFTContractAddresses },
    { key: 'SetPriorityTokenAddresses', function: this.setPriorityTokenAddresses },
    { key: 'SetPriorityNFTContractAddresses', function: this.setPriorityNFTContractAddresses },
    { key: 'ShowLanguageSetting', function: this.showLanguageSetting },
    { key: 'ShowAppearanceSetting', function: this.showAppearanceSetting },
    { key: 'SetSupportAddToken', function: this.setSupportAddToken },

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
