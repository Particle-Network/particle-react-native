import React, { PureComponent } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Text,
} from 'react-native';
import { WalletType, DappMetaData } from 'react-native-particle-connect';
import { PolygonMumbai, Ethereum, EthereumGoerli } from '@particle-network/chains';
import * as particleConnect from 'react-native-particle-connect';
import * as particleAuth from 'react-native-particle-auth';
import {
    Env,
    Language,
    WalletDisplay,
} from 'react-native-particle-auth';
import { TestAccountEVM, TestAccountSolana } from './TestAccount';
import * as particleWallet from 'react-native-particle-wallet';
import {
    BuyCryptoConfig,
    OpenBuyNetwork
} from 'react-native-particle-wallet';
import type { NavigationProp, RouteProp } from '@react-navigation/native';

interface GUIDemoProps {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
}

export default class GUIDemo extends PureComponent<GUIDemoProps> {
    init = async () => {
        const chainInfo = Ethereum;
        const env = Env.Dev;
        const walletMetaData = {
            walletConnectProjectId: '75ac08814504606fc06126541ace9df6',
            name: 'Particle Connect',
            icon: 'https://connect.particle.network/icons/512.png',
            url: 'https://connect.particle.network',
            description: 'Particle Wallet',
        };
        const dappMetaData = new DappMetaData('75ac08814504606fc06126541ace9df6',
            'Particle Connect',
            'https://connect.particle.network/icons/512.png',
            'https://connect.particle.network',
            'Particle Wallet', "", "");
        particleConnect.init(chainInfo, env, dappMetaData);
        particleWallet.initWallet(walletMetaData);
    };

    setChainInfo = async () => {
        const chainInfo = Ethereum;
        particleAuth.setChainInfo(chainInfo);
    };

    loginParticle = async () => {
        const result = await particleAuth.login();
        console.log(result);
    };

    // Wallet Service should use after connected a wallet, so add this method to help test wallet methods.
    // Before this, you'd better login metamask with our testAccount in TestAccount.js
    // TestAccount provides both evm and solana test account with some tokens.
    connectMetamask = async () => {
        const accountInfo = await particleConnect.connect(WalletType.MetaMask);
        console.log('accountInfo', accountInfo.data.publicAddress);
        particleWallet.createSelectedWallet(
            accountInfo.data.publicAddress,
            WalletType.MetaMask
        );
    };

    navigatorWallet = async () => {
        const display = WalletDisplay.Token;
        particleWallet.navigatorWallet(display);
    };

    navigatorTokenReceive = async () => {
        const tokenAddress = TestAccountSolana.tokenContractAddress;
        particleWallet.navigatorTokenReceive(tokenAddress);
    };

    navigatorTokenSend = async () => {
        const tokenAddress = TestAccountSolana.tokenContractAddress;
        const toAddress = TestAccountSolana.receiverAddress;
        const amount = '1000000000';
        particleWallet.navigatorTokenSend(tokenAddress, toAddress, amount);
    };

    navigatorTokenTransactionRecords = async () => {
        const tokenAddress = TestAccountSolana.tokenContractAddress;
        particleWallet.navigatorTokenTransactionRecords(tokenAddress);
    };

    navigatorNFTSend = async () => {
        const mint = TestAccountEVM.nftContractAddress;
        const receiverAddress = TestAccountEVM.receiverAddress;
        const tokenId = TestAccountEVM.nftTokenId;
        const amount = '1';
        particleWallet.navigatorNFTSend(mint, tokenId, receiverAddress, amount);
    };

    navigatorNFTDetails = async () => {
        const mint = TestAccountEVM.nftContractAddress;
        const tokenId = TestAccountEVM.nftTokenId;
        particleWallet.navigatorNFTDetails(mint, tokenId);
    };

    navigatorBuyCrypto = async () => {
        // support no parameters
        // particleWallet.navigatorBuyCrypto();

        // also support pass public address, crypto symbol and so on.
        const config = new BuyCryptoConfig(
            '0xa0869E99886e1b6737A4364F2cf9Bb454FD637E4',
            'BNB',
            'USD',
            1000,
            OpenBuyNetwork.BinanceSmartChain
        );
        // these are other parameters, they are optional.
        config.fixFiatCoin = true;
        config.fixCryptoCoin = true;
        config.fixFiatAmt = true;
        config.theme = 'dark';
        config.language = Language.JA;
        particleWallet.navigatorBuyCrypto(config);
    };

    navigatorLoginList = async () => {
        const result = await particleWallet.navigatorLoginList();
        console.log('navigatorLoginList', result);
    };

    navigatorSwap = async () => {
        const fromTokenAddress = '';
        const toTokenAddress = '';
        const amount = '';
        particleWallet.navigatorSwap(fromTokenAddress, toTokenAddress, amount);
    };

    setShowTestNetwork = async () => {
        const isShow = false;
        particleWallet.setShowTestNetwork(isShow);
    };

    setShowManageWallet = async () => {
        const isShow = false;
        particleWallet.setShowManageWallet(isShow);
    };

    setSupportChain = async () => {
        const chainInfos = [
            Ethereum,
            EthereumGoerli,
            PolygonMumbai,
        ];
        particleWallet.setSupportChain(chainInfos);
    };

    setPayDisabled = async () => {
        const disabled = true;
        particleWallet.setPayDisabled(disabled);
    };

    getPayDisabled = async () => {
        const result = await particleWallet.getPayDisabled();
        console.log(result);
    };

    setSwapDisabled = async () => {
        const disabled = true;
        particleWallet.setSwapDisabled(disabled);
    };

    getSwapDisabled = async () => {
        const result = await particleWallet.getSwapDisabled();
        console.log(result);
    };

    switchWallet = async () => {
        const walletType = WalletType.MetaMask;
        const publicAddress = TestAccountEVM.publicAddress;

        const result = await particleWallet.switchWallet(walletType, publicAddress);
        console.log(result);
    };

    setDisplayTokenAddresses = async () => {
        const tokenAddresses = ['', ''];
        particleWallet.setDisplayTokenAddresses(tokenAddresses);
    };

    setDisplayNFTContractAddresses = async () => {
        const nftContractAddresses = ['', ''];
        particleWallet.setDisplayNFTContractAddresses(nftContractAddresses);
    };

    setPriorityTokenAddresses = async () => {
        const tokenAddresses = ['', ''];
        particleWallet.setPriorityTokenAddresses(tokenAddresses);
    };

    setPriorityNFTContractAddresses = async () => {
        const nftContractAddresses = ['', ''];
        particleWallet.setPriorityNFTContractAddresses(nftContractAddresses);
    };

    setShowLanguageSetting = async () => {
        particleWallet.setShowLanguageSetting(false);
    };

    setShowAppearanceSetting = async () => {
        particleWallet.setShowAppearanceSetting(false);
    };

    setSupportAddToken = async () => {
        particleWallet.setSupportAddToken(false);
    };

    setSupportWalletConnect = async () => {
        particleWallet.setSupportWalletConnect(false);
    };

    data = [
        { key: 'Init', function: this.init },
        { key: 'SetChainInfo', function: this.setChainInfo },
        { key: 'LoginParticle', function: this.loginParticle },
        { key: 'ConnectMetamask', function: this.connectMetamask },
        { key: 'NavigatorWallet', function: this.navigatorWallet },
        { key: 'NavigatorTokenReceive', function: this.navigatorTokenReceive },
        { key: 'NavigatorTokenSend', function: this.navigatorTokenSend },
        {
            key: 'NavigatorTokenTransactionRecords',
            function: this.navigatorTokenTransactionRecords,
        },
        { key: 'NavigatorNFTSend', function: this.navigatorNFTSend },
        { key: 'NavigatorNFTDetails', function: this.navigatorNFTDetails },
        { key: 'NavigatorBuyCrypto', function: this.navigatorBuyCrypto },
        { key: 'NavigatorLoginList', function: this.navigatorLoginList },
        { key: 'NavigatorSwap', function: this.navigatorSwap },
        { key: 'SetShowTestNetwork', function: this.setShowTestNetwork },
        { key: 'SetShowManageWallet', function: this.setShowManageWallet },
        { key: 'SetSupportChain', function: this.setSupportChain },
        { key: 'SetPayDisabled', function: this.setPayDisabled },
        { key: 'GetPayDisabled', function: this.getPayDisabled },
        { key: 'SetSwapDisabled', function: this.setSwapDisabled },
        { key: 'GetSwapDisabled', function: this.getSwapDisabled },
        { key: 'SwitchWallet', function: this.switchWallet },
        {
            key: 'SetDisplayTokenAddresses',
            function: this.setDisplayTokenAddresses,
        },
        {
            key: 'SetDisplayNFTContractAddresses',
            function: this.setDisplayNFTContractAddresses,
        },
        {
            key: 'SetPriorityTokenAddresses',
            function: this.setPriorityTokenAddresses,
        },
        {
            key: 'SetPriorityNFTContractAddresses',
            function: this.setPriorityNFTContractAddresses,
        },
        { key: 'SetShowLanguageSetting', function: this.setShowLanguageSetting },
        { key: 'SetShowAppearanceSetting', function: this.setShowAppearanceSetting },
        { key: 'SetSupportAddToken', function: this.setSupportAddToken },
        { key: 'SetSupportWalletConnect', function: this.setSupportWalletConnect },
    ];

    render = () => {
        return (
            <SafeAreaView>
                <FlatList
                    data={this.data}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={() => {
                                item.function();
                            }}
                        >
                            <Text style={styles.textStyle}>{item.key}</Text>
                        </TouchableOpacity>
                    )}
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
        height: 30,
        width: 300,
        justifyContent: 'center',
    },

    textStyle: {
        color: 'white',
        textAlign: 'center',
    },
});
