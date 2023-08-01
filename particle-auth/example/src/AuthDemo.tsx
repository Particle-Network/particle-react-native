import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, DeviceEventEmitter, NativeEventEmitter, TouchableOpacity, Text, Platform, FlatList } from 'react-native';

import BigNumber from 'bignumber.js';
import { ChainInfo, PolygonMumbai } from '@particle-network/chains';

import {
    Language,
    Appearance,
    iOSModalPresentStyle,
    LoginType,
    SupportAuthType,
    Env,
    ParticleInfo,
    LoginAuthorization,
    SecurityAccountConfig,
    EvmService,
    BiconomyVersion,
    FiatCoin
} from 'react-native-particle-auth';
import * as particleAuth from 'react-native-particle-auth';
import type { NavigationProp, RouteProp } from '@react-navigation/native';

import * as Helper from './Helper';
import { TestAccountEVM } from './TestAccount';
import { createWeb3 } from './web3Demo';

interface AuthDemoProps {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
}

export default class AuthDemo extends PureComponent<AuthDemoProps> {
    private openAccountAndSecurityEvent: any;

    web3 = createWeb3('5479798b-26a9-4943-b848-649bb104fdc3', 'cUKfeOA7rnNFCxSBtXE5byLgzIhzGrE4Y7rDdY4b');

    web3_getAccounts = async () => {
        try {
            const accounts = await this.web3.eth.getAccounts();
            console.log('web3.eth.getAccounts', accounts);
        } catch (error) {
            console.log('web3.eth.getAccounts', error);
        }
    };

    web3_getBalance = async () => {
        try {
            const accounts = await this.web3.eth.getAccounts();
            const account = accounts[0];
            if (account) {
                const balance = await this.web3.eth.getBalance(account);
                console.log('web3.eth.getBalance', balance);
            }
        } catch (error) {
            console.log('web3.eth.getBalance', error);
        }
    };

    web3_getChainId = async () => {
        try {
            const chainId = await this.web3.eth.getChainId();
            console.log('web3.eth.getChainId', chainId);
        } catch (error) {
            console.log('web3.eth.getChainId', error);
        }
    };

    web3_personalSign = async () => {
        try {
            // for persion_sign
            // don't use web3.eth.personal.sign
            // @ts-ignore
            const result = await this.web3.currentProvider!.request({
                method: 'personal_sign',
                params: ['hello world'],
            });

            console.log('web3.eth.personal.sign', result);
        } catch (error) {
            console.log('web3.eth.personal.sign', error);
        }
    };

    web3_personalSign_unique = async () => {
        try {
            // for persion_sign
            // don't use web3.eth.personal.sign
            // @ts-ignore
            const result = await this.web3.currentProvider!.request({
                method: 'personal_sign_unique',
                params: ['hello world'],
            });

            console.log('personal_sign_unique', result);
        } catch (error) {
            console.log('personal_sign_unique', error);
        }
    };

    web3_signTypedData_v1 = async () => {
        try {
            const accounts = await this.web3.eth.getAccounts();
            // @ts-ignore
            const result = await this.web3.currentProvider!.request({
                method: 'eth_signTypedData_v1',
                params: [
                    [
                        { type: 'string', name: 'Message', value: 'Hi, Alice!' },
                        { type: 'uint32', name: 'A nunmber', value: '1337' },
                    ],
                    accounts[0],
                ],
            });
            console.log('web3 eth_signTypedData_v1', result);
        } catch (error) {
            console.log('web3 eth_signTypedData_v1', error);
        }
    };

    web3_signTypedData_v3 = async () => {
        try {
            const accounts = await this.web3.eth.getAccounts();
            const chainId = await this.web3.eth.getChainId();
            // @ts-ignore
            const result = await this.web3.currentProvider!.request({
                method: 'eth_signTypedData_v3',
                params: [
                    accounts[0],
                    {
                        types: {
                            EIP712Domain: [
                                { name: 'name', type: 'string' },
                                { name: 'version', type: 'string' },
                                { name: 'chainId', type: 'uint256' },
                                { name: 'verifyingContract', type: 'address' },
                            ],
                            Person: [
                                { name: 'name', type: 'string' },
                                { name: 'wallet', type: 'address' },
                            ],
                            Mail: [
                                { name: 'from', type: 'Person' },
                                { name: 'to', type: 'Person' },
                                { name: 'contents', type: 'string' },
                            ],
                        },
                        primaryType: 'Mail',
                        domain: {
                            name: 'Ether Mail',
                            version: '1',
                            chainId: `${chainId}`,
                            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
                        },
                        message: {
                            from: { name: 'Cow', wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826' },
                            to: { name: 'Bob', wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB' },
                            contents: 'Hello, Bob!',
                        },
                    },
                ],
            });
            console.log('web3 eth_signTypedData_v3', result);
        } catch (error) {
            console.log('web3 eth_signTypedData_v3', error);
        }
    };

    web3_signTypedData_v4 = async () => {
        try {
            const accounts = await this.web3.eth.getAccounts();
            const chainId = await this.web3.eth.getChainId();
            // @ts-ignore
            const result = await this.web3.currentProvider!.request({
                method: 'eth_signTypedData_v4',
                params: [
                    accounts[0],
                    {
                        types: {
                            OrderComponents: [
                                { name: 'offerer', type: 'address' },
                                { name: 'zone', type: 'address' },
                                { name: 'offer', type: 'OfferItem[]' },
                                { name: 'consideration', type: 'ConsiderationItem[]' },
                                { name: 'orderType', type: 'uint8' },
                                { name: 'startTime', type: 'uint256' },
                                { name: 'endTime', type: 'uint256' },
                                { name: 'zoneHash', type: 'bytes32' },
                                { name: 'salt', type: 'uint256' },
                                { name: 'conduitKey', type: 'bytes32' },
                                { name: 'counter', type: 'uint256' },
                            ],
                            OfferItem: [
                                { name: 'itemType', type: 'uint8' },
                                { name: 'token', type: 'address' },
                                { name: 'identifierOrCriteria', type: 'uint256' },
                                { name: 'startAmount', type: 'uint256' },
                                { name: 'endAmount', type: 'uint256' },
                            ],
                            ConsiderationItem: [
                                { name: 'itemType', type: 'uint8' },
                                { name: 'token', type: 'address' },
                                { name: 'identifierOrCriteria', type: 'uint256' },
                                { name: 'startAmount', type: 'uint256' },
                                { name: 'endAmount', type: 'uint256' },
                                { name: 'recipient', type: 'address' },
                            ],
                            EIP712Domain: [
                                { name: 'name', type: 'string' },
                                { name: 'version', type: 'string' },
                                { name: 'chainId', type: 'uint256' },
                                { name: 'verifyingContract', type: 'address' },
                            ],
                        },
                        domain: {
                            name: 'Seaport',
                            version: '1.1',
                            chainId: `${chainId}`,
                            verifyingContract: '0x00000000006c3852cbef3e08e8df289169ede581',
                        },
                        primaryType: 'OrderComponents',
                        message: {
                            offerer: '0x6fc702d32e6cb268f7dc68766e6b0fe94520499d',
                            zone: '0x0000000000000000000000000000000000000000',
                            offer: [
                                {
                                    itemType: '2',
                                    token: '0xd15b1210187f313ab692013a2544cb8b394e2291',
                                    identifierOrCriteria: '33',
                                    startAmount: '1',
                                    endAmount: '1',
                                },
                            ],
                            consideration: [
                                {
                                    itemType: '0',
                                    token: '0x0000000000000000000000000000000000000000',
                                    identifierOrCriteria: '0',
                                    startAmount: '9750000000000000',
                                    endAmount: '9750000000000000',
                                    recipient: '0x6fc702d32e6cb268f7dc68766e6b0fe94520499d',
                                },
                                {
                                    itemType: '0',
                                    token: '0x0000000000000000000000000000000000000000',
                                    identifierOrCriteria: '0',
                                    startAmount: '250000000000000',
                                    endAmount: '250000000000000',
                                    recipient: '0x66682e752d592cbb2f5a1b49dd1c700c9d6bfb32',
                                },
                            ],
                            orderType: '0',
                            startTime: '1669188008',
                            endTime: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
                            zoneHash: '0x3000000000000000000000000000000000000000000000000000000000000000',
                            salt: '48774942683212973027050485287938321229825134327779899253702941089107382707469',
                            conduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
                            counter: '0',
                        },
                    },
                ],
            });
            console.log('web3 eth_signTypedData_v4', result);
        } catch (error) {
            console.log('web3 eth_signTypedData_v4', error);
        }
    };

    web3_signTypedData_v4_unique = async () => {
        try {
            const accounts = await this.web3.eth.getAccounts();
            const chainId = await this.web3.eth.getChainId();
            // @ts-ignore
            const result = await this.web3.currentProvider.request({
                method: 'eth_signTypedData_v4_unique',
                params: [
                    accounts[0],
                    {
                        types: {
                            OrderComponents: [
                                { name: 'offerer', type: 'address' },
                                { name: 'zone', type: 'address' },
                                { name: 'offer', type: 'OfferItem[]' },
                                { name: 'consideration', type: 'ConsiderationItem[]' },
                                { name: 'orderType', type: 'uint8' },
                                { name: 'startTime', type: 'uint256' },
                                { name: 'endTime', type: 'uint256' },
                                { name: 'zoneHash', type: 'bytes32' },
                                { name: 'salt', type: 'uint256' },
                                { name: 'conduitKey', type: 'bytes32' },
                                { name: 'counter', type: 'uint256' },
                            ],
                            OfferItem: [
                                { name: 'itemType', type: 'uint8' },
                                { name: 'token', type: 'address' },
                                { name: 'identifierOrCriteria', type: 'uint256' },
                                { name: 'startAmount', type: 'uint256' },
                                { name: 'endAmount', type: 'uint256' },
                            ],
                            ConsiderationItem: [
                                { name: 'itemType', type: 'uint8' },
                                { name: 'token', type: 'address' },
                                { name: 'identifierOrCriteria', type: 'uint256' },
                                { name: 'startAmount', type: 'uint256' },
                                { name: 'endAmount', type: 'uint256' },
                                { name: 'recipient', type: 'address' },
                            ],
                            EIP712Domain: [
                                { name: 'name', type: 'string' },
                                { name: 'version', type: 'string' },
                                { name: 'chainId', type: 'uint256' },
                                { name: 'verifyingContract', type: 'address' },
                            ],
                        },
                        domain: {
                            name: 'Seaport',
                            version: '1.1',
                            chainId: `${chainId}`,
                            verifyingContract: '0x00000000006c3852cbef3e08e8df289169ede581',
                        },
                        primaryType: 'OrderComponents',
                        message: {
                            offerer: '0x6fc702d32e6cb268f7dc68766e6b0fe94520499d',
                            zone: '0x0000000000000000000000000000000000000000',
                            offer: [
                                {
                                    itemType: '2',
                                    token: '0xd15b1210187f313ab692013a2544cb8b394e2291',
                                    identifierOrCriteria: '33',
                                    startAmount: '1',
                                    endAmount: '1',
                                },
                            ],
                            consideration: [
                                {
                                    itemType: '0',
                                    token: '0x0000000000000000000000000000000000000000',
                                    identifierOrCriteria: '0',
                                    startAmount: '9750000000000000',
                                    endAmount: '9750000000000000',
                                    recipient: '0x6fc702d32e6cb268f7dc68766e6b0fe94520499d',
                                },
                                {
                                    itemType: '0',
                                    token: '0x0000000000000000000000000000000000000000',
                                    identifierOrCriteria: '0',
                                    startAmount: '250000000000000',
                                    endAmount: '250000000000000',
                                    recipient: '0x66682e752d592cbb2f5a1b49dd1c700c9d6bfb32',
                                },
                            ],
                            orderType: '0',
                            startTime: '1669188008',
                            endTime: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
                            zoneHash: '0x3000000000000000000000000000000000000000000000000000000000000000',
                            salt: '48774942683212973027050485287938321229825134327779899253702941089107382707469',
                            conduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
                            counter: '0',
                        },
                    },
                ],
            });
            console.log('web3 eth_signTypedData_v4_unique', result);
        } catch (error) {
            console.log('web3 eth_signTypedData_v4_unique', error);
        }
    };

    web3_sendTransaction = async () => {
        try {
            const accounts = await this.web3.eth.getAccounts();
            const result = await this.web3.eth.sendTransaction({
                from: accounts[0],
                to: TestAccountEVM.receiverAddress,
                value: '1000000',
                data: '0x',
            });
            console.log('web3.eth.sendTransaction', result);
        } catch (error) {
            console.log('web3.eth.sendTransaction', error);
        }
    };

    web3_wallet_switchEthereumChain = async () => {
        try {
            // @ts-ignore
            const result = await this.web3.currentProvider!.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x61' }],
            });
            console.log('web3 wallet_switchEthereumChain', result);
        } catch (error) {
            console.log('web3 wallet_switchEthereumChain', error);
        }
    };

    init = () => {
        // Get your project id and client key from dashboard, https://dashboard.particle.network
        ParticleInfo.projectId = '5479798b-26a9-4943-b848-649bb104fdc3'; // your project id
        ParticleInfo.clientKey = 'cUKfeOA7rnNFCxSBtXE5byLgzIhzGrE4Y7rDdY4b'; // your client key

        if (ParticleInfo.projectId == "" || ParticleInfo.clientKey == "") {
            throw new Error(
                'You need set project info, get your project id and client from dashboard, https://dashboard.particle.network'
            );
        }

        console.log('init');
        const chainInfo = PolygonMumbai;
        const env = Env.Production;
        particleAuth.init(chainInfo, env);
    };

    setChainInfo = async () => {
        const chainInfo: ChainInfo = this.props.route.params?.chainInfo || PolygonMumbai;
        const result = await particleAuth.setChainInfo(chainInfo);
        console.log(result);
    };

    getChainInfo = async () => {
        const result = await particleAuth.getChainInfo();
        console.log(result);
    };

    setChainInfoAsync = async () => {
        const chainInfo: ChainInfo = this.props.route.params?.chainInfo || PolygonMumbai;
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

        const result = await particleAuth.login(type, '', supportAuthType);
        if (result.status) {
            const userInfo = result.data;
            console.log(userInfo);
        } else {
            const error = result.data;
            console.log(error);
        }
    };

    loginWithSignMessage = async () => {
        const type = LoginType.Email;
        const supportAuthType = [
            SupportAuthType.Email,
            SupportAuthType.Apple,
            SupportAuthType.Google,
            SupportAuthType.Discord,
        ];

        const message = "Hello Particle";
        const messageHex = "0x" + Buffer.from(message).toString('hex');

        // authrization is optional, used to login and sign a message.
        const authrization = new LoginAuthorization(messageHex, false);

        const result = await particleAuth.login(type, '', supportAuthType, undefined, authrization);
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

    signMessageUnique = async () => {
        const message = 'Hello world!';
        const result = await particleAuth.signMessageUnique(message);
        if (result.status) {
            const signedMessage = result.data;
            console.log(signedMessage);
        } else {
            const error = result.data;
            console.log(error);
        }
    };

    signTransaction = async () => {
        const chainInfo: ChainInfo = this.props.route.params?.chainInfo || PolygonMumbai;

        if (chainInfo.name.toLowerCase() != 'solana') {
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
        const chainInfo: ChainInfo = this.props.route.params?.chainInfo || PolygonMumbai;
        if (chainInfo.name.toLowerCase() != 'solana') {
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
        const chainInfo: ChainInfo = this.props.route.params?.chainInfo || PolygonMumbai;
        let transaction = '';
        // There are four test cases
        // Before test, make sure your public address have some native token for fee.
        // 1. send evm native in Ethereum goerli, the transacion is type 0x2, for blockchains support EIP1559
        // 2. send evm native in BSC testnet, the transacion is type 0x0, for blockchians don't supoort EIP1559
        // 3. send evm token in Ethereum goerli, the transacion is type 0x2, for blockchains support EIP1559
        // 4. send evm token in BSC testnet, the transacion is type 0x0, for blockchians don't supoort EIP1559
        let testCase = 2;

        if (chainInfo.name.toLowerCase() == 'solana') {
            transaction = await Helper.getSolanaTransaction(sender);
        } else {
            if (testCase == 1) {
                const receiver = TestAccountEVM.receiverAddress;
                const amount = TestAccountEVM.amount;
                transaction = await Helper.getEthereumTransacion(sender, receiver, BigNumber(amount));
            } else if (testCase == 2) {
                const receiver = TestAccountEVM.receiverAddress;
                const amount = TestAccountEVM.amount;
                transaction = await Helper.getEthereumTransacionLegacy(sender, receiver, BigNumber(amount));
            } else if (testCase == 3) {
                const receiver = TestAccountEVM.receiverAddress;
                const amount = TestAccountEVM.amount;
                const contractAddress = TestAccountEVM.tokenContractAddress;
                transaction = await Helper.getEvmTokenTransaction(sender, receiver, BigNumber(amount), contractAddress);
            } else {
                const receiver = TestAccountEVM.receiverAddress;
                const amount = TestAccountEVM.amount;
                const contractAddress = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee';
                transaction = await Helper.getEvmTokenTransactionLegacy(sender, receiver, BigNumber(amount), contractAddress);
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

        const chainInfo: ChainInfo = this.props.route.params?.chainInfo || PolygonMumbai;
        if (chainInfo.name.toLowerCase() == 'solana') {
            console.log('signTypedData only supports evm');
            return;
        }
        const typedData: string = `{"types":{"OrderComponents":[{"name":"offerer","type":"address"},{"name":"zone","type":"address"},{"name":"offer","type":"OfferItem[]"},{"name":"consideration","type":"ConsiderationItem[]"},{"name":"orderType","type":"uint8"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"zoneHash","type":"bytes32"},{"name":"salt","type":"uint256"},{"name":"conduitKey","type":"bytes32"},{"name":"counter","type":"uint256"}],"OfferItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"}],"ConsiderationItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"},{"name":"recipient","type":"address"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"name":"Seaport","version":"1.1","chainId":${chainInfo.id},"verifyingContract":"0x00000000006c3852cbef3e08e8df289169ede581"},"primaryType":"OrderComponents","message":{"offerer":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d","zone":"0x0000000000000000000000000000000000000000","offer":[{"itemType":"2","token":"0xd15b1210187f313ab692013a2544cb8b394e2291","identifierOrCriteria":"33","startAmount":"1","endAmount":"1"}],"consideration":[{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"9750000000000000","endAmount":"9750000000000000","recipient":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d"},{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"250000000000000","endAmount":"250000000000000","recipient":"0x66682e752d592cbb2f5a1b49dd1c700c9d6bfb32"}],"orderType":"0","startTime":"1669188008","endTime":"115792089237316195423570985008687907853269984665640564039457584007913129639935","zoneHash":"0x3000000000000000000000000000000000000000000000000000000000000000","salt":"48774942683212973027050485287938321229825134327779899253702941089107382707469","conduitKey":"0x0000000000000000000000000000000000000000000000000000000000000000","counter":"0"}}`;

        const result = await particleAuth.signTypedData(typedData, 'v4');
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

    setWebAuthConfig = async () => {
        const isDisplay = true;
        particleAuth.setWebAuthConfig(isDisplay, Appearance.Dark);
    };

    setAppearance = async () => {
        particleAuth.setAppearance(Appearance.Dark);
    }

    setFiatCoin = async () => {
        particleAuth.setFiatCoin(FiatCoin.KRW);
    }

    openWebWallet = async () => {
        //https://docs.particle.network/developers/wallet-service/sdks/web
        let webConfig = {
            supportAddToken: false,
            supportChains: [
                {
                    id: 1,
                    name: 'Ethereum',
                },
                {
                    id: 5,
                    name: 'Ethereum',
                },
            ],
        };
        const webConfigJSON = JSON.stringify(webConfig);
        particleAuth.openWebWallet(webConfigJSON);
    };

    setSecurityAccountConfig = async () => {
        const config = new SecurityAccountConfig(1, 2);
        particleAuth.setSecurityAccountConfig(config);
    };

    getSmartAccount = async () => {
        const eoaAddress = await particleAuth.getAddress();
        const result = await EvmService.getSmartAccount([eoaAddress], BiconomyVersion.v1_0_0);
        console.log(result);
    }

    readContract = async () => {
        try {
            const address = await particleAuth.getAddress();
            const contractAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
            const methodName = "balanceOf"; // this is your contract method name, like balanceOf, mint.
            const params = [address]; // this is the method params.
            const abiJsonString = "";

            const result = await EvmService.readContract(contractAddress, methodName, params, abiJsonString);
            console.log(result);
        } catch (error) {
            console.log(error);
        }

    }

    writeContract = async () => {
        try {
            const from = await particleAuth.getAddress()
            const contractAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
            const methodName = "transfer"; // this is your contract method name, like balanceOf, mint.
            const params = ["0xa0869E99886e1b6737A4364F2cf9Bb454FD637E4", "1000000000000000"]; // this is the method params.
            const abiJsonString = "";
            const transaction = await EvmService.writeContract(from, contractAddress, methodName, params, abiJsonString);
            console.log(transaction);
        } catch (error) {
            console.log(error);
        }
    }

    writeContractAndSend = async () => {
        try {
            const from = await particleAuth.getAddress()
            const contractAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
            const methodName = "transfer"; // this is your contract method name, like balanceOf, mint.
            const params = ["0xa0869E99886e1b6737A4364F2cf9Bb454FD637E4", "1000000000000000"]; // this is the method params.
            const abiJsonString = "";
            const transaction = await EvmService.writeContract(from, contractAddress, methodName, params, abiJsonString);
            console.log(transaction);
            const result = await particleAuth.signAndSendTransaction(transaction);
            if (result.status) {
                const signature = result.data;
                console.log(signature);
            } else {
                const error = result.data;
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    hasMasterPassword = async () => {
        const hasMasterPassword = await particleAuth.hasMasterPassword();
        console.log('hasMasterPassword', hasMasterPassword);
    }

    hasPaymentPassword = async () => {
        const hasPaymentPassword = await particleAuth.hasPaymentPassword();
        console.log('hasPaymentPassword', hasPaymentPassword);
    }

    hasSecurityAccount = async () => {
        const hasSecurityAccount = await particleAuth.hasSecurityAccount();
        console.log('hasSecurityAccount', hasSecurityAccount);
    }

    getSecurityAccount = async () => {
        const result = await particleAuth.getSecurityAccount();
        if (result.status) {
            const secuirtyAccount = result.data;
            const hasMasterPassword = secuirtyAccount.has_set_master_password;
            const hasPaymentPassword = secuirtyAccount.has_set_payment_password;
            const email = secuirtyAccount.email;
            const phone = secuirtyAccount.phont;
            const hasSecurityAccount = !email || !phone;
            console.log('hasMasterPassword', hasMasterPassword, 'hasPaymentPassword', hasPaymentPassword, 'hasSecurityAccount', hasSecurityAccount);
        } else {
            const error = result.data;
            console.log(error);
        }
    }

    data = [
        { key: 'Select Chain Page', function: null },
        { key: 'Init', function: this.init },
        { key: 'Login', function: this.login },
        { key: 'LoginWithSignMessage', function: this.loginWithSignMessage },

        { key: 'web3_getAccounts', function: this.web3_getAccounts },
        { key: 'web3_getBalance', function: this.web3_getBalance },
        { key: 'web3_getChainId', function: this.web3_getChainId },
        { key: 'web3_personalSign', function: this.web3_personalSign },
        { key: 'web3_personalSign_unique', function: this.web3_personalSign_unique },
        { key: 'web3_signTypedData_v1', function: this.web3_signTypedData_v1 },
        { key: 'web3_signTypedData_v3', function: this.web3_signTypedData_v3 },
        { key: 'web3_signTypedData_v4', function: this.web3_signTypedData_v4 },
        { key: 'web3_signTypedData_v4_unique', function: this.web3_signTypedData_v4_unique },
        { key: 'web3_sendTransaction', function: this.web3_sendTransaction },
        { key: 'web3_wallet_switchEthereumChain', function: this.web3_wallet_switchEthereumChain },

        { key: 'Logout', function: this.logout },
        { key: 'FastLogout', function: this.fastLogout },
        { key: 'IsLogin', function: this.isLogin },
        { key: 'IsLoginAsync', function: this.isLoginAsync },
        { key: 'SetChainInfo', function: this.setChainInfo },
        { key: 'GetChainInfo', function: this.getChainInfo },
        { key: 'SetChainInfoAsync', function: this.setChainInfoAsync },
        { key: 'SignMessage', function: this.signMessage },
        { key: 'SignMessageUnique', function: this.signMessageUnique },
        { key: 'SignTransaction', function: this.signTransaction },
        { key: 'SignAllTransactions', function: this.signAllTransactions },
        { key: 'SignAndSendTransaction', function: this.signAndSendTransaction },
        { key: 'SignTypedData', function: this.signTypedData },
        { key: 'OpenAccountAndSecurity', function: this.openAccountAndSecurity },
        { key: 'GetAddress', function: this.getAddress },
        { key: 'GetUserInfo', function: this.getUserInfo },
        { key: 'SetModalPresentStyle', function: this.setModalPresentStyle },
        { key: 'SetMediumScreen', function: this.setMediumScreen },
        { key: 'SetLanguage', function: this.setLanguage },
        { key: 'SetAppearance', function: this.setAppearance },
        { key: 'SetFiatCoin', function: this.setFiatCoin },
        { key: 'SetWebAuthConfig', function: this.setWebAuthConfig },
        { key: 'OpenWebWallet', function: this.openWebWallet },

        { key: 'SetSecurityAccountConfig', function: this.setSecurityAccountConfig },
        { key: 'GetSmartAccount', function: this.getSmartAccount },
        { key: 'ReadContract', function: this.readContract },
        { key: 'WriteContract', function: this.writeContract },

        { key: 'WriteContractAndSend', function: this.writeContractAndSend },
        { key: 'HasMasterPassword', function: this.hasMasterPassword },
        { key: 'HasPaymentPassword', function: this.hasPaymentPassword },
        { key: 'HasSecurityAccount', function: this.hasSecurityAccount },
        { key: 'GetSecurityAccount', function: this.getSecurityAccount },
    ];


    render = () => {
        const { navigation } = this.props;

        return (
            <SafeAreaView>
                <View>
                    <FlatList 
                     // @ts-ignore
                    data={this.data}
                        renderItem={({ item }: { item: { key: string, function: () => void } }) => (
                            <TouchableOpacity style={styles.buttonStyle}
                                onPress={() => {
                                    if (item.key == "Select Chain Page") {
                                         // @ts-ignore
                                        navigation.push("SelectChainPage");
                                    } else {
                                        item.function();
                                    }
                                }}>
                                <Text style={styles.textStyle}>{item.key}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    };


    componentDidMount = () => {
        console.log('AuthDemo componentDidMount');

        if (Platform.OS === 'ios') {
            const emitter = new NativeEventEmitter(particleAuth.ParticleAuthEvent);
            this.openAccountAndSecurityEvent = emitter.addListener('securityFailedCallBack', this.securityFailedCallBack);
        } else {
            this.openAccountAndSecurityEvent = DeviceEventEmitter.addListener(
                'securityFailedCallBack',
                this.openAccountAndSecurityEvent
            );
        }
    };

    componentWillUnmount() {
        this.openAccountAndSecurityEvent.remove();
    };


    securityFailedCallBack = (result: any) => {
        console.log(result);
    }

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
        textAlign: 'center'
    }
});
