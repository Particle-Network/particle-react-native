import { ChainInfo, PolygonMumbai } from '@particle-network/chains';
import * as particleAuth from '@particle-network/rn-auth';
import {
    AccountName,
    Appearance,
    CommonError,
    Env,
    EvmService,
    FiatCoin,
    Language,
    LoginAuthorization,
    LoginType,
    ParticleInfo,
    SecurityAccount,
    SecurityAccountConfig,
    SupportAuthType,
    VersionNumber,
    iOSModalPresentStyle,
} from '@particle-network/rn-auth';
import BigNumber from 'bignumber.js';
import React, { PureComponent } from 'react';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    FlatList,
    NativeEventEmitter,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import Toast from 'react-native-toast-message';
import type { AuthScreenProps } from './App';
import * as Helper from './Helper';
import { TestAccountEVM } from './TestAccount';
import { createWeb3 } from './web3Demo';
export default class AuthDemo extends PureComponent<AuthScreenProps> {
    private openAccountAndSecurityEvent: any;
    modalSelect: ModalSelector<any> | null = null;
    state = { currentLoadingBtn: '', currentOptions: [], currentKey: '' };
    web3 = createWeb3('fab00091-f966-437f-8ae9-12aa495f2828', 'cif8thrddJ9Iz46tecZ9UiEQmjxRaKy42AuutAZj');

    web3_getAccounts = async () => {
        try {
            const accounts = await this.web3.eth.getAccounts();
            console.log('web3.eth.getAccounts', accounts);
            Toast.show({
                type: 'success',
                text1: 'accounts',
                text2: accounts.join(','),
            });
        } catch (error) {
            console.log('web3.eth.getAccounts', error);

            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
        }
    };

    web3_getBalance = async () => {
        try {
            const accounts = await this.web3.eth.getAccounts();
            const account = accounts[0];
            if (account) {
                const balance = await this.web3.eth.getBalance(account);
                console.log('web3.eth.getBalance', balance);
                Toast.show({
                    type: 'success',
                    text1: 'balance',
                    text2: balance,
                });
            }
        } catch (error) {
            console.log('web3.eth.getBalance', error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
        }
    };

    web3_getChainId = async () => {
        try {
            const chainId = await this.web3.eth.getChainId();
            console.log('web3.eth.getChainId', chainId);
            Toast.show({
                type: 'success',
                text1: 'chainId',
                text2: String(chainId),
            });
        } catch (error) {
            console.log('web3.eth.getChainId', error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
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
            Toast.show({
                type: 'success',
                text1: 'web3_personalSign',
                text2: result,
            });
        } catch (error) {
            console.log('web3.eth.personal.sign', error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
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
            Toast.show({
                type: 'success',
                text1: 'personal unique sign',
                text2: result,
            });
        } catch (error) {
            console.log('personal_sign_unique', error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
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
            Toast.show({
                type: 'success',
                text1: 'signTypedData_v1',
                text2: result,
            });
        } catch (error) {
            console.log('web3 eth_signTypedData_v1', error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
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
            Toast.show({
                type: 'success',
                text1: 'web3_signTypedData_v3',
                text2: result,
            });
        } catch (error) {
            console.log('web3 eth_signTypedData_v3', error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
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
            Toast.show({
                type: 'success',
                text1: 'web3_signTypedData_v4',
                text2: result,
            });
        } catch (error) {
            console.log('web3 eth_signTypedData_v4', error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
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
            Toast.show({
                type: 'success',
                text1: 'eth_signTypedData_v4_unique',
                text2: result,
            });
        } catch (error) {
            console.log('web3 eth_signTypedData_v4_unique', error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
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
            Toast.show({
                type: 'success',
                text1: 'send transaction successfully',
            });
        } catch (error) {
            console.log('web3.eth.sendTransaction', error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
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
            Toast.show({
                type: 'success',
                text1: 'successfully switched',
            });
        } catch (error) {
            console.log('web3 wallet_switchEthereumChain', error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
        }
    };

    init = () => {
        // Get your project id and client key from dashboard, https://dashboard.particle.network
        ParticleInfo.projectId = '5479798b-26a9-4943-b848-649bb104fdc3'; // your project id
        ParticleInfo.clientKey = 'cUKfeOA7rnNFCxSBtXE5byLgzIhzGrE4Y7rDdY4b'; // your client key

        if (ParticleInfo.projectId == '' || ParticleInfo.clientKey == '') {
            throw new Error(
                'You need set project info, get your project id and client from dashboard, https://dashboard.particle.network'
            );
        }

        console.log('init');
        const chainInfo = PolygonMumbai;
        const env = Env.Production;
        particleAuth.init(chainInfo, env);
        Toast.show({
            type: 'success',
            text1: 'Initialized successfully',
        });
    };

    setChainInfo = async () => {
        const chainInfo: ChainInfo = this.props.route.params?.chainInfo || PolygonMumbai;

        const result = await particleAuth.setChainInfo(chainInfo);
        Toast.show({
            type: result ? 'success' : 'error',
            text1: result ? 'successfully set' : 'Setting failed',
        });
    };

    getChainInfo = async () => {
        const result = await particleAuth.getChainInfo();
        console.log(result);
    };

    setChainInfoAsync = async () => {
        const chainInfo: ChainInfo = this.props.route.params?.chainInfo || PolygonMumbai;

        const resultAsync = await particleAuth.setChainInfoAsync(chainInfo);
        console.log(resultAsync);
        Toast.show({
            type: resultAsync ? 'success' : 'error',
            text1: resultAsync ? 'successfully set' : 'Setting failed',
        });
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
            Toast.show({
                type: 'success',
                text1: 'Login successful',
            });
        } else {
            const error = result.data;
            console.log(error);
            Toast.show({
                type: 'error',
                text1: (error as CommonError).message,
            });
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

        const message = 'Hello Particle';
        const messageHex = '0x' + Buffer.from(message).toString('hex');

        // authrization is optional, used to login and sign a message.
        const authrization = new LoginAuthorization(messageHex, false);

        const result = await particleAuth.login(type, '', supportAuthType, undefined, authrization);
        if (result.status) {
            const userInfo = result.data;
            console.log(userInfo);
            Toast.show({
                type: 'success',
                text1: 'Login successfully',
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

    logout = async () => {
        const result = await particleAuth.logout();
        this.setState({ currentLoadingBtn: '' });
        if (result.status) {
            console.log(result.data);
            Toast.show({
                type: 'success',
                text1: 'successfully logged out',
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

    fastLogout = async () => {
        const result = await particleAuth.fastLogout();
        if (result.status) {
            console.log(result.data);
            Toast.show({
                type: 'success',
                text1: 'successfully logged out',
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

    isLogin = async () => {
        const result = await particleAuth.isLogin();
        console.log(result);
        Toast.show({
            type: 'success',
            text1: `Is logged in: ${result}`,
        });
    };

    isLoginAsync = async () => {
        const result = await particleAuth.isLoginAsync();
        if (result.status) {
            const userInfo = result.data;
            console.log(userInfo);
            Toast.show({
                type: 'success',
                text1: `Is login async: ${userInfo}`,
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

    signMessage = async () => {
        const message = 'Hello world!';
        const result = await particleAuth.signMessage(message);
        if (result.status) {
            const signedMessage = result.data as string;
            console.log(signedMessage);
            Toast.show({
                type: 'success',
                text1: `Sign message`,
                text2: signedMessage,
            });
        } else {
            const error = result.data as CommonError;
            console.log(error);
            Toast.show({
                type: 'success',
                text2: error.message,
            });
        }
    };

    signMessageUnique = async () => {
        const message = 'Hello world!';
        const result = await particleAuth.signMessageUnique(message);
        if (result.status) {
            const signedMessage = result.data as string;
            console.log(signedMessage);
            Toast.show({
                type: 'success',
                text1: `Sign unique message`,
                text2: signedMessage,
            });
        } else {
            const error = result.data as CommonError;
            console.log(error);
            Toast.show({
                type: 'success',
                text2: error.message,
            });
        }
    };

    signTransaction = async () => {
        const chainInfo: ChainInfo = this.props.route.params?.chainInfo || PolygonMumbai;

        if (chainInfo.name.toLowerCase() != 'solana') {
            console.log('signTransaction only supports solana');
            return;
        }

        try {
            const sender = await particleAuth.getAddress();
            console.log('sender: ', sender);
            const transaction = await Helper.getSolanaTransaction(sender);
            console.log('transaction:', transaction);
            const result = await particleAuth.signTransaction(transaction);

            if (result.status) {
                const signedTransaction = result.data as string;
                Toast.show({
                    type: 'success',
                    text1: `Successfully sign transaction `,
                    text2: signedTransaction,
                });
                console.log(signedTransaction);
            } else {
                const error = result.data as CommonError;
                console.log(error);
                Toast.show({
                    type: 'error',
                    text2: error.message,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text2: (error as Error).message,
            });
        }
    };

    signAllTransactions = async () => {
        const chainInfo: ChainInfo = this.props.route.params?.chainInfo || PolygonMumbai;
        if (chainInfo.name.toLowerCase() != 'solana') {
            console.log('signAllTransactions only supports solana');
            return;
        }

        try {
            const sender = await particleAuth.getAddress();
            const transaction1 = await Helper.getSolanaTransaction(sender);
            const transaction2 = await Helper.getSplTokenTransaction(sender);
            const transactions = [transaction1, transaction2];
            const result = await particleAuth.signAllTransactions(transactions);
            if (result.status) {
                const signedTransactions = result.data as string;
                console.log(signedTransactions);
                Toast.show({
                    type: 'success',
                    text1: `Successfully sign transaction `,
                    text2: signedTransactions,
                });
            } else {
                const error = result.data as CommonError;
                console.log(error);
                Toast.show({
                    type: 'error',
                    text1: error.message,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
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

        try {
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
                    transaction = await Helper.getEvmTokenTransaction(
                        sender,
                        receiver,
                        BigNumber(amount),
                        contractAddress
                    );
                } else {
                    const receiver = TestAccountEVM.receiverAddress;
                    const amount = TestAccountEVM.amount;
                    const contractAddress = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee';
                    transaction = await Helper.getEvmTokenTransactionLegacy(
                        sender,
                        receiver,
                        BigNumber(amount),
                        contractAddress
                    );
                }
            }

            const result = await particleAuth.signAndSendTransaction(transaction);
            if (result.status) {
                const signature = result.data as string;
                console.log(signature);
                Toast.show({
                    type: 'success',
                    text1: `Successfully sign and send transaction `,
                    text2: signature,
                });
            } else {
                const error = result.data as CommonError;
                console.log(error);
                Toast.show({
                    type: 'error',
                    text2: error.message,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
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
            const signature = result.data as string;
            console.log(signature);
            Toast.show({
                type: 'success',
                text1: `Successfully sign typed data`,
                text2: signature,
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

    openAccountAndSecurity = async () => {
        particleAuth.openAccountAndSecurity();
    };

    getAddress = async () => {
        const address = await particleAuth.getAddress();

        Toast.show({
            type: 'success',
            text1: `Address`,
            text2: address,
        });
    };

    getUserInfo = async () => {
        const result = await particleAuth.getUserInfo();
        const userInfo = JSON.parse(result);
        console.log(userInfo);

        Toast.show({
            type: 'success',
            text1: `Successfully get user info`,
        });
    };

    setModalPresentStyle = async () => {
        // const style = iOSModalPresentStyle.FormSheet;
        // particleAuth.setModalPresentStyle(style);
        this.setState({
            currentOptions: [
                {
                    label: iOSModalPresentStyle.FullScreen,
                    key: iOSModalPresentStyle.FullScreen,
                    value: iOSModalPresentStyle.FullScreen,
                },
                {
                    label: iOSModalPresentStyle.PageSheet,
                    key: iOSModalPresentStyle.PageSheet,
                    value: iOSModalPresentStyle.PageSheet,
                },
            ],
        });
        if (this.modalSelect) {
            this.modalSelect.open();
        }
    };

    setMediumScreen = async () => {
        const isMedium = true;
        particleAuth.setMediumScreen(isMedium);
        Toast.show({
            type: 'success',
            text1: `Successfully set medium screen`,
        });
    };

    setLanguage = async () => {
        this.setState({
            currentOptions: [
                { label: Language.EN, key: Language.EN, value: Language.EN },
                { label: Language.ZH_HANS, key: Language.ZH_HANS, value: Language.ZH_HANS },
                { label: Language.ZH_HANT, key: Language.ZH_HANT, value: Language.ZH_HANT },
                { label: Language.JA, key: Language.JA, value: Language.JA },
                { label: Language.KO, key: Language.KO, value: Language.KO },
            ],
        });
        if (this.modalSelect) {
            this.modalSelect.open();
        }
    };

    setWebAuthConfig = async () => {
        const isDisplay = true;
        particleAuth.setWebAuthConfig(isDisplay, Appearance.Dark);
        Toast.show({
            type: 'success',
            text1: `Successfully set web auth config`,
        });
    };

    setAppearance = async () => {
        this.setState({
            currentOptions: [
                { label: Appearance.Dark, key: Appearance.Dark, value: Appearance.Dark },
                { label: Appearance.Light, key: Appearance.Light, value: Appearance.Light },
                { label: Appearance.System, key: Appearance.System, value: Appearance.System },
            ],
        });
        if (this.modalSelect) {
            this.modalSelect.open();
        }
    };

    setFiatCoin = async () => {
        this.setState({
            currentOptions: [
                { label: FiatCoin.CNY, key: FiatCoin.CNY, value: FiatCoin.CNY },
                { label: FiatCoin.HKD, key: FiatCoin.HKD, value: FiatCoin.HKD },
                { label: FiatCoin.INR, key: FiatCoin.INR, value: FiatCoin.INR },
                { label: FiatCoin.JPY, key: FiatCoin.JPY, value: FiatCoin.JPY },
                { label: FiatCoin.KRW, key: FiatCoin.KRW, value: FiatCoin.KRW },
                { label: FiatCoin.USD, key: FiatCoin.USD, value: FiatCoin.USD },
            ],
        });
        if (this.modalSelect) {
            this.modalSelect.open();
        }
    };

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
            evmSupportWalletConnect: false
        };
        const webConfigJSON = JSON.stringify(webConfig);
        particleAuth.openWebWallet(webConfigJSON);
    };

    setSecurityAccountConfig = async () => {
        const config = new SecurityAccountConfig(1, 2);
        particleAuth.setSecurityAccountConfig(config);
        Toast.show({
            type: 'success',
            text1: `Successfully set security account config`,
        });
    };

    getSmartAccount = async () => {
        const eoaAddress = await particleAuth.getAddress();
        const smartAccountParam = {
            name: AccountName.BICONOMY,
            version: VersionNumber.v1_0_0,
            ownerAddress: eoaAddress,
        };
        const result = await EvmService.getSmartAccount([smartAccountParam]);
        console.log('getSmartAccount', result);
        Toast.show({
            type: 'success',
            text1: `Successfully get smart account`,
        });
    };

    readContract = async () => {
        try {
            const address = await particleAuth.getAddress();
            const contractAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';
            const methodName = 'balanceOf'; // this is your contract method name, like balanceOf, mint.
            const params = [address]; // this is the method params.
            const abiJsonString = '';

            const result = await EvmService.readContract(contractAddress, methodName, params, abiJsonString);
            console.log('readContract', result);
            Toast.show({
                type: 'success',
                text1: 'Successfully read contract',
                text2: result,
            });
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
        }
    };

    writeContract = async () => {
        try {
            const from = await particleAuth.getAddress();
            const contractAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';
            const methodName = 'transfer'; // this is your contract method name, like balanceOf, mint.
            const params = ['0xa0869E99886e1b6737A4364F2cf9Bb454FD637E4', '1000000000000000']; // this is the method params.
            const abiJsonString = '';
            const transaction = await EvmService.writeContract(
                from,
                contractAddress,
                methodName,
                params,
                abiJsonString
            );
            console.log('writeContract', transaction);
            Toast.show({
                type: 'success',
                text1: 'Successfully write contract',
                text2: transaction,
            });
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: (error as Error).message,
            });
        }
    };

    writeContractAndSend = async () => {
        try {
            const from = await particleAuth.getAddress();
            const contractAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';
            const methodName = 'transfer'; // this is your contract method name, like balanceOf, mint.
            const params = ['0xa0869E99886e1b6737A4364F2cf9Bb454FD637E4', '1000000000000000']; // this is the method params.
            const abiJsonString = '';
            const transaction = await EvmService.writeContract(
                from,
                contractAddress,
                methodName,
                params,
                abiJsonString
            );
            console.log(transaction);
            const result = await particleAuth.signAndSendTransaction(transaction);
            if (result.status) {
                const signature = result.data as string;
                console.log(signature);
                Toast.show({
                    type: 'success',
                    text1: 'Successfully written and sent contract',
                    text2: signature,
                });
            } else {
                const error = result.data as CommonError;
                console.log(error);
                Toast.show({
                    type: 'error',
                    text1: error.message,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    hasMasterPassword = async () => {
        const hasMasterPassword = await particleAuth.hasMasterPassword();
        console.log('hasMasterPassword', hasMasterPassword);
        Toast.show({
            type: 'info',
            text2: String(hasMasterPassword),
        });
    };

    hasPaymentPassword = async () => {
        const hasPaymentPassword = await particleAuth.hasPaymentPassword();
        console.log('hasPaymentPassword', hasPaymentPassword);
        Toast.show({
            type: 'info',
            text2: String(hasPaymentPassword),
        });
    };

    hasSecurityAccount = async () => {
        const hasSecurityAccount = await particleAuth.hasSecurityAccount();
        console.log('hasSecurityAccount', hasSecurityAccount);
        Toast.show({
            type: 'info',
            text2: String(hasSecurityAccount),
        });
    };

    getSecurityAccount = async () => {
        const result = await particleAuth.getSecurityAccount();
        console.log('getSecurityAccount', result);
        if (result.status) {
            const secuirtyAccount = result.data as SecurityAccount;
            const hasMasterPassword = secuirtyAccount.has_set_master_password;
            const hasPaymentPassword = secuirtyAccount.has_set_payment_password;
            const email = secuirtyAccount.email;
            const phone = secuirtyAccount.phone;
            const hasSecurityAccount = !email || !phone;
            console.log(
                'hasMasterPassword',
                hasMasterPassword,
                'hasPaymentPassword',
                hasPaymentPassword,
                'hasSecurityAccount',
                hasSecurityAccount
            );
            Toast.show({
                type: 'success',
                text1: `Successfully get security account`,
            });
        } else {
            const error = result.data as CommonError;
            Toast.show({
                type: 'error',
                text1: error.message,
            });
            console.log(error);
        }
    };

    handleModelSelect = async ({ value }: any) => {
        switch (this.state.currentKey) {
            case 'SetModalPresentStyle':
                particleAuth.setModalPresentStyle(value as iOSModalPresentStyle);
                Toast.show({
                    type: 'success',
                    text1: `successfully set modal present style `,
                });
                break;
            case 'SetLanguage':
                particleAuth.setLanguage(value as Language);
                Toast.show({
                    type: 'success',
                    text1: `successfully set language`,
                });
                break;
            case 'SetAppearance':
                particleAuth.setAppearance(value as Appearance);
                Toast.show({
                    type: 'success',
                    text1: `successfully set appearance`,
                });
                break;
            case 'SetFiatCoin':
                particleAuth.setFiatCoin(value as FiatCoin);
                Toast.show({
                    type: 'success',
                    text1: `successfully set fail coin`,
                });
                break;
        }
    };

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
                <View style={{ paddingBottom: 100 }}>
                    <FlatList
                        // @ts-ignore
                        data={this.data}
                        renderItem={({ item }: { item: { key: string; function: () => void } }) => (
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                accessibilityRole="button"
                                onPress={async () => {
                                    if (item.key == 'Select Chain Page') {
                                        // @ts-ignore
                                        navigation.push('SelectChainPage');
                                    } else {
                                        this.setState({ currentLoadingBtn: item.key, currentKey: item.key });

                                        await item.function();
                                        this.setState({ currentLoadingBtn: '' });
                                    }
                                }}
                            >
                                {this.state.currentLoadingBtn === item.key ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.textStyle}>{item.key}</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <ModalSelector
                    onChange={this.handleModelSelect}
                    data={this.state.currentOptions}
                    ref={(el) => {
                        this.modalSelect = el;
                    }}
                />
            </SafeAreaView>
        );
    };

    componentDidMount = () => {
        console.log('AuthDemo componentDidMount');

        if (Platform.OS === 'ios') {
            const emitter = new NativeEventEmitter(particleAuth.ParticleAuthEvent);
            this.openAccountAndSecurityEvent = emitter.addListener(
                'securityFailedCallBack',
                this.securityFailedCallBack
            );
        } else {
            this.openAccountAndSecurityEvent = DeviceEventEmitter.addListener(
                'securityFailedCallBack',
                this.openAccountAndSecurityEvent
            );
        }

        this.init();
    };

    componentWillUnmount() {
        this.openAccountAndSecurityEvent.remove();
    }

    securityFailedCallBack = (result: any) => {
        console.log(result);
    };
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: 'rgba(78, 116, 289, 1)',
        borderRadius: 3,
        margin: 10,
        width: 300,
        justifyContent: 'center',
        padding: 10,
    },

    textStyle: {
        color: 'white',
        textAlign: 'center',
    },
});
