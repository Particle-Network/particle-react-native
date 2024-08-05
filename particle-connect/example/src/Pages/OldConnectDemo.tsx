import {
  ChainInfo,
  Ethereum,
  SolanaDevnet,
  EthereumSepolia
} from '@particle-network/chains';

import * as particleBase from '@particle-network/rn-base';

import * as particleAuthCore from '@particle-network/rn-auth-core';

import {
  Env,
  LoginType,
  ParticleInfo,
  SocialLoginPrompt,
  SupportAuthType,
} from '@particle-network/rn-base';
import * as particleConnect from '@particle-network/rn-connect';
import {
  CommonError,
  WalletType,
} from '@particle-network/rn-connect';
import BigNumber from 'bignumber.js';
import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeEventEmitter,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';
import Web3 from 'web3';
import * as Helper from '../utils/Helper';
import { PNAccount } from '../Models/PNAccount';
import { TestAccountEVM } from '../utils/TestAccount';
import { createWeb3, restoreWeb3 } from '../utils/web3Demo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { RouteProp } from '@react-navigation/native';
export interface ConnectScreenProps {
  route: ConnectDemoRouteProp;
  navigation: ConnectDemoNavigationProp;
}

type ConnectDemoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type ConnectDemoRouteProp = RouteProp<RootStackParamList, 'Home'>;

export default class OldConnectDemo extends PureComponent<ConnectScreenProps> {
  loginSourceMessage = '';
  loginSignature = '';
  state = {
    currentLoadingBtn: '',
    currentOptions: [],
    currentKey: '',
    qrCodeUri: '',
  };
  pnaccount!: PNAccount
  walletType: WalletType = WalletType.AuthCore;
  emitter = new NativeEventEmitter(particleConnect.ParticleConnectEvent);

  // Start with new web3, at this time, you don't connect with this walletType, and don't know any publicAddress
  newWeb3!: Web3;

  // After connected a wallet, restoreWeb3 when getAccounts.
  // We need to check if the walletType and publicAddress is connected.
  web3!: Web3;

  init = () => {
    // Get your project id and client from dashboard,
    // https://dashboard.particle.network/

    ParticleInfo.projectId = '5479798b-26a9-4943-b848-649bb104fdc3'; // your project id
    ParticleInfo.clientKey = 'cUKfeOA7rnNFCxSBtXE5byLgzIhzGrE4Y7rDdY4b'; // your client key

    if (ParticleInfo.projectId == '' || ParticleInfo.clientKey == '') {
      throw new Error(
        'You need set project info, Get your project id and client from dashboard, https://dashboard.particle.network'
      );
    }

    const chainInfo: ChainInfo = Ethereum;
    const env = Env.Dev;
    const metadata = {
      walletConnectProjectId: '75ac08814504606fc06126541ace9df6',
      url: 'https://connect.particle.network',
      icon: 'https://connect.particle.network/icons/512.png',
      name: 'Particle Connect',
      description: 'Particle Wallet'
    }

    particleConnect.init(chainInfo, env, metadata);
    particleAuthCore.init();

    this.newWeb3 = createWeb3(
      '5479798b-26a9-4943-b848-649bb104fdc3',
      'cUKfeOA7rnNFCxSBtXE5byLgzIhzGrE4Y7rDdY4b',
      this.walletType
    );

    Toast.show({ type: 'success', text1: 'Initialized successfully' });
    // const chainInfos = [Ethereum, Polygon];
    // particleConnect.setWalletConnectV2SupportChainInfos(chainInfos);
  };

  newWeb3_getAccounts = async () => {
    try {
      const accounts = await this.newWeb3.eth.getAccounts();
      this.pnaccount = {
        walletType: this.walletType,
        icons: [],
        publicAddress: accounts[0] as string,
        url: "",
        name: ""
      }
      console.log('web3.eth.getAccounts', accounts);
      Toast.show({
        type: 'success',
        text1: 'accounts',
        text2: accounts.join(','),
      });
    } catch (error) {
      console.log('web3.eth.getAccounts', error);
      if (error instanceof Error) {
        Toast.show({ type: 'error', text1: error.message });
      }
    }
  };

  restoreWeb3_getAccounts = async () => {
    try {
      console.log('pnaccount.publicAddress ', this.pnaccount.publicAddress);
      this.web3 = restoreWeb3(
        '5479798b-26a9-4943-b848-649bb104fdc3',
        'cUKfeOA7rnNFCxSBtXE5byLgzIhzGrE4Y7rDdY4b',
        this.pnaccount.walletType,
        this.pnaccount.publicAddress
      );

      const accounts = await this.web3.eth.getAccounts();
      this.pnaccount = {
        walletType: this.walletType,
        icons: [],
        publicAddress: accounts[0] as string,
        url: "",
        name: ""
      }
      console.log('web3.eth.getAccounts', accounts);
      Toast.show({
        type: 'success',
        text1: 'accounts',
        text2: accounts.join(','),
      });
    } catch (error) {
      console.log('web3.eth.getAccounts', error);
      if (error instanceof Error) {
        Toast.show({ type: 'error', text1: error.message });
      }
    }
  };

  web3_getBalance = async () => {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const balance = await this.web3.eth.getBalance(accounts[0] as string);
      console.log('web3.eth.getBalance', accounts[0], balance);
      Toast.show({
        type: 'success',
        text1: 'balance',
        text2: balance,
      });
    } catch (error) {
      console.log('web3.eth.getBalance', error);
      if (error instanceof Error) {
        Toast.show({ type: 'error', text1: error.message });
      }
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
      if (error instanceof Error) {
        Toast.show({ type: 'error', text1: error.message });
      }
    }
  };

  web3_personalSign = async () => {
    // for persion_sign
    // don't use web3.eth.personal.sign

    try {
      const accounts = await this.web3.eth.getAccounts();
      // @ts-ignore
      const result = await this.web3.currentProvider!.request({
        method: 'personal_sign',
        params: ['Hello world', accounts[0]],
      });
      Toast.show({
        type: 'success',
        text1: 'web3_personalSign',
        text2: result,
      });
      console.log('web3.eth.personal.sign', result);
    } catch (error) {
      console.log('web3.eth.personal.sign', error);
      if (error instanceof Error) {
        Toast.show({ type: 'error', text1: error.message });
      }
    }
  };

  web3_signTypedData_v4 = async () => {
    try {
      // @ts-ignore
      const accounts = await this.web3!.eth.getAccounts();
      const chainId = await this.web3.eth.getChainId();
      // @ts-ignore
      const result = await this.web3!.currentProvider.request({
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
              endTime:
                '115792089237316195423570985008687907853269984665640564039457584007913129639935',
              zoneHash:
                '0x3000000000000000000000000000000000000000000000000000000000000000',
              salt: '48774942683212973027050485287938321229825134327779899253702941089107382707469',
              conduitKey:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              counter: '0',
            },
          },
        ],
      });
      console.log('web3 eth_signTypedData_v4', result);
      Toast.show({
        type: 'success',
        text1: 'web3 eth_signTypedData_v4',
        text2: result,
      });
    } catch (error) {
      console.log('web3 eth_signTypedData_v4', error);
      if (error instanceof Error) {
        Toast.show({ type: 'error', text1: error.message });
      }
    }
  };

  web3_sendTransaction = async () => {
    try {
      // @ts-ignore
      const accounts = await this.web3!.eth.getAccounts();
      // @ts-ignore
      const result = await this.web3!.eth.sendTransaction({
        from: accounts[0],
        to: TestAccountEVM.receiverAddress,
        value: '1000000',
        data: '0x',
      });
      console.log('web3.eth.sendTransaction', result);
      Toast.show({
        type: 'success',
        text1: 'web3 eth_signTypedData_v4',
        text2: 'Successfully sent transaction',
      });
    } catch (error) {
      console.log('web3.eth.sendTransaction', error);
      if (error instanceof Error) {
        Toast.show({ type: 'error', text1: error.message });
      }
    }
  };

  getAccounts = async () => {
    const accounts = await particleConnect.getAccounts(this.pnaccount.walletType);
    Toast.show({
      type: 'success',
      text1: 'Successfully get accounts',
    });
    console.log(accounts);
  };

  setChainInfo = async () => {
    const chainInfo: ChainInfo =
      this.props.route.params?.chainInfo || EthereumSepolia;
    const result = await particleBase.setChainInfo(chainInfo);
    console.log(result);
    Toast.show({
      type: result ? 'success' : 'error',
      text1: result ? 'Successfully set' : 'Setting failed',
    });
  };

  getChainInfo = async () => {
    const chainInfo: ChainInfo = await particleBase.getChainInfo();
    console.log(chainInfo);
    Toast.show({
      type: 'success',
      text1: `Successfully get chain info ${chainInfo.name} ${chainInfo.network} ${chainInfo.id}`,
    });
  };

  setChainInfoAsync = async () => {
    const chainInfo: ChainInfo =
      this.props.route.params?.chainInfo || EthereumSepolia;
    var result;
    if (this.walletType == WalletType.AuthCore) {
      result = await particleAuthCore.switchChain(chainInfo);
    } else {
      result = await particleBase.setChainInfo(chainInfo);
    }
    Toast.show({
      type: result ? 'success' : 'error',
      text2: result ? 'Successfully set' : 'Setting failed',
    });
  };

  connect = async () => {
    try {

      const account = await particleConnect.connect(WalletType.AuthCore);
      this.pnaccount = {
        walletType: WalletType.AuthCore,
        icons: account.icons,
        name: account.name,
        publicAddress: account.publicAddress,
        url: account.url
      }

      console.log('pnaccount = ', this.pnaccount);

      this.web3 = restoreWeb3(
        '5479798b-26a9-4943-b848-649bb104fdc3',
        'cUKfeOA7rnNFCxSBtXE5byLgzIhzGrE4Y7rDdY4b',
        this.walletType,
        this.pnaccount.publicAddress
      );
      Toast.show({
        type: 'success',
        text1: 'Successfully connected',
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

  connectWithParticleAuthCore = async () => {
    try {


      const connectConfig = {
        loginType: LoginType.Google,
        supportAuthType: [SupportAuthType.Phone, SupportAuthType.Google, SupportAuthType.Apple],
        socialLoginPrompt: SocialLoginPrompt.SelectAccount,
        loginPageConifg: {
          projectName: "React Native Example",
          description: "Welcome to login",
          imagePath: "https://connect.particle.network/icons/512.png"
        }

      };

      const account = await particleConnect.connect(
        WalletType.AuthCore,
        connectConfig
      );

      console.log('connect success');
      this.walletType = WalletType.AuthCore;
      this.pnaccount = {
        icons: account.icons,
        name: account.name,
        publicAddress: account.publicAddress,
        url: account.url,
        walletType: WalletType.AuthCore
      }
      console.log('pnaccount = ', this.pnaccount);

      Toast.show({
        type: 'success',
        text1: 'Successfully connected',
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

  disconnect = async () => {
    try {
      const publicAddress = this.pnaccount.publicAddress;
      if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
      }
      const result = await particleConnect.disconnect(
        this.walletType,
        publicAddress
      );
      console.log(result);
      Toast.show({
        type: 'success',
        text1: 'Successfully disconnected',
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

  isConnected = async () => {
    const publicAddress = this.pnaccount.publicAddress;
    if (publicAddress == undefined) {
      console.log('publicAddress is underfined, you need connect');
      return;
    }
    const result = await particleConnect.isConnected(
      this.walletType,
      publicAddress
    );
    console.log(result);
    Toast.show({
      type: 'info',
      text1: 'Is connected',
      text2: String(result),
    });
  };

  signMessage = async () => {
    const publicAddress = this.pnaccount.publicAddress;
    if (publicAddress == undefined) {
      console.log('publicAddress is underfined, you need connect');
      return;
    }
    const message = 'Hello world!';
    const result = await particleConnect.signMessage(
      this.walletType,
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

  signTransaction = async () => {
    const chainInfo: ChainInfo =
      this.props.route.params?.chainInfo || SolanaDevnet;

    if (chainInfo.name.toLowerCase() != 'solana') {
      console.log('signTransaction only supports solana');
      return;
    }

    try {
      const publicAddress = this.pnaccount.publicAddress;
      if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
      }

      const sender = await particleAuthCore.evm.getAddress();
      console.log('sender: ', sender);
      const transaction = await Helper.getSolanaTransaction(sender);
      console.log('transaction:', transaction);

      const signature = await particleConnect.signTransaction(
        this.walletType,
        publicAddress,
        transaction
      );

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

  signAllTransactions = async () => {
    const chainInfo: ChainInfo =
      this.props.route.params?.chainInfo || SolanaDevnet;

    if (chainInfo.name.toLowerCase() != 'solana') {
      console.log('signAllTransactions only supports solana');
      return;
    }

    try {
      const publicAddress = this.pnaccount.publicAddress;
      if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
      }
      const sender = await particleAuthCore.evm.getAddress();
      console.log('sender: ', sender);
      const transaction = await Helper.getSolanaTransaction(sender);
      console.log('transaction:', transaction);

      const transactions = [transaction, transaction];
      const signatures = await particleConnect.signAllTransactions(
        this.walletType,
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

  signAndSendTransaction = async () => {
    const sender = await particleAuthCore.evm.getAddress();
    const chainInfo: ChainInfo =
      this.props.route.params?.chainInfo || EthereumSepolia;

    const publicAddress = this.pnaccount.publicAddress;

    if (publicAddress == undefined) {
      console.log('publicAddress is underfined, you need connect');
      return;
    }

    try {
      let transaction = '';
      if (chainInfo.name.toLowerCase() == 'solana') {
        transaction = await Helper.getSolanaTransaction(sender);
      } else {
        const receiver = TestAccountEVM.receiverAddress;
        const amount = TestAccountEVM.amount;
        transaction = await Helper.getEthereumTransacion(
          this.pnaccount.publicAddress,
          receiver,
          BigNumber(amount)
        );
      }

      console.log(transaction);
      const txHash = await particleConnect.signAndSendTransaction(
        this.walletType,
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

  signTypedData = async () => {

    const chainInfo: ChainInfo =
      this.props.route.params?.chainInfo || EthereumSepolia;
    if (chainInfo.name.toLowerCase() == 'solana') {
      console.log('signTypedData only supports evm');
      return;
    }

    try {


      const typedData = `{"types":{"OrderComponents":[{"name":"offerer","type":"address"},{"name":"zone","type":"address"},{"name":"offer","type":"OfferItem[]"},{"name":"consideration","type":"ConsiderationItem[]"},{"name":"orderType","type":"uint8"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"zoneHash","type":"bytes32"},{"name":"salt","type":"uint256"},{"name":"conduitKey","type":"bytes32"},{"name":"counter","type":"uint256"}],"OfferItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"}],"ConsiderationItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"},{"name":"recipient","type":"address"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"name":"Seaport","version":"1.1","chainId":${chainInfo.id},"verifyingContract":"0x00000000006c3852cbef3e08e8df289169ede581"},"primaryType":"OrderComponents","message":{"offerer":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d","zone":"0x0000000000000000000000000000000000000000","offer":[{"itemType":"2","token":"0xd15b1210187f313ab692013a2544cb8b394e2291","identifierOrCriteria":"33","startAmount":"1","endAmount":"1"}],"consideration":[{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"9750000000000000","endAmount":"9750000000000000","recipient":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d"},{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"250000000000000","endAmount":"250000000000000","recipient":"0x66682e752d592cbb2f5a1b49dd1c700c9d6bfb32"}],"orderType":"0","startTime":"1669188008","endTime":"115792089237316195423570985008687907853269984665640564039457584007913129639935","zoneHash":"0x3000000000000000000000000000000000000000000000000000000000000000","salt":"48774942683212973027050485287938321229825134327779899253702941089107382707469","conduitKey":"0x0000000000000000000000000000000000000000000000000000000000000000","counter":"0"}}`;
      const publicAddress = this.pnaccount.publicAddress;
      if (publicAddress == undefined) {
        console.log('publicAddress is underfined, you need connect');
        return;
      }
      const signature = await particleConnect.signTypedData(
        this.walletType,
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

  signInWithEthereum = async () => {
    const publicAddress = this.pnaccount.publicAddress;

    if (publicAddress == undefined) {
      console.log('publicAddress is underfined, you need connect');
      return;
    }
    try {

      const domain = 'login.xyz';
      const uri = 'https://login.xyz/demo#login';
      const result = await particleConnect.signInWithEthereum(
        this.walletType,
        publicAddress,
        domain,
        uri
      );

      const message = result.message;
      const signature = result.signature;

      this.loginSourceMessage = message;
      this.loginSignature = signature;

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

  verify = async () => {
    const publicAddress = this.pnaccount.publicAddress;
    if (publicAddress == undefined) {
      console.log('publicAddress is underfined, you need connect');
      return;
    }
    try {
      const message = this.loginSourceMessage;
      const signature = this.loginSignature;
      if (!message || !signature) {
        console.log('message or signature is underfined');
        return;
      }
      console.log('verify message:', message);
      console.log('verify signature:', signature);
      const result = await particleConnect.verify(
        this.walletType,
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

  connectWalletConnect = async () => {
    try {
      const account = await particleConnect.connectWalletConnect();
      console.log(account);

    } catch (e) {
      const error = e as CommonError;
      console.log(error);
    }

  };

  data = [
    { key: 'Select Chain Page', function: null },
    { key: 'Select Wallet Type Page', function: null },
    { key: 'Init', function: this.init },

    { key: 'newWeb3_getAccounts', function: this.newWeb3_getAccounts },
    { key: 'restoreWeb3_getAccounts', function: this.restoreWeb3_getAccounts },
    { key: 'web3_getBalance', function: this.web3_getBalance },
    { key: 'web3_getChainId', function: this.web3_getChainId },
    { key: 'web3_personalSign', function: this.web3_personalSign },
    { key: 'web3_signTypedData_v4', function: this.web3_signTypedData_v4 },
    { key: 'web3_sendTransaction', function: this.web3_sendTransaction },

    { key: 'SetChainInfo', function: this.setChainInfo },
    { key: 'SetChainInfoAsync', function: this.setChainInfoAsync },
    { key: 'GetChainInfo', function: this.getChainInfo },
    { key: 'GetAccounts', function: this.getAccounts },
    { key: 'Connect', function: this.connect },
    {
      key: 'connectWithParticleAuthCore',
      function: this.connectWithParticleAuthCore,
    },
    { key: 'Disconnect', function: this.disconnect },
    { key: 'IsConnected', function: this.isConnected },
    { key: 'SignMessage', function: this.signMessage },
    { key: 'SignTransaction', function: this.signTransaction },
    { key: 'SignAllTransactions', function: this.signAllTransactions },
    { key: 'SignAndSendTransaction', function: this.signAndSendTransaction },
    { key: 'SignTypedData', function: this.signTypedData },
    { key: 'SignInWithEthereum', function: this.signInWithEthereum },
    { key: 'Verify', function: this.verify },
    { key: 'ConnectWalletConnect', function: this.connectWalletConnect },
  ];

  componentDidMount(): void {
    this.init();

    this.props.navigation.addListener('focus', async () => {
      const chainInfo: ChainInfo | undefined = this.props.route.params?.chainInfo;

      if (chainInfo) {
        await particleBase.setChainInfo(chainInfo);
      }
    });

    this.emitter.addListener('qrCodeUri', (message: string) => {
      const qrCodeUri = message;
      console.log('qrCodeUri', qrCodeUri);
      this.setState({
        qrCodeUri: qrCodeUri,
      });
    });
  }

  componentWillUnmount(): void {
    this.emitter.removeAllListeners('qrCodeUri');
  }

  render = () => {
    const { navigation } = this.props;

    return (
      <SafeAreaView>
        <FlatList
          data={this.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={async () => {
                if (item.key == 'Select Chain Page') {
                  // @ts-ignore
                  navigation.push('SelectChainPage');
                } else if (item.key == 'Select Wallet Type Page') {
                  // @ts-ignore
                  navigation.push('SelectWalletTypePage');
                } else {
                  this.setState({
                    currentLoadingBtn: item.key,
                    currentKey: item.key,
                  });
                  // @ts-ignore
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

        {this.state.qrCodeUri !== '' && (
          <QRCode
            value={this.state.qrCodeUri}
          />
        )}
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
