import {
  Ethereum,
  EthereumSepolia,
  SolanaTestnet,
  type ChainInfo,
} from '@particle-network/chains';
// import * as particleAuth from '@particle-network/rn-auth';
import * as particleBase from 'rn-base-beta';
// import {Env, ParticleInfo} from '@particle-network/rn-auth';
import { Env, ParticleInfo } from 'rn-base-beta';
// import * as particleAuthCore from '@particle-network/rn-auth-core';
import * as particleAuthCore from 'rn-auth-core-beta';
// import {
//   LoginType,
//   SocialLoginPrompt,
//   SupportAuthType
// } from '@particle-network/rn-auth';

import {
  LoginType,
  SocialLoginPrompt,
  SupportAuthType
} from 'rn-base-beta';

// import {
//   evm,
//   solana,
//   type CommonError,
//   type UserInfo,
// } from '@particle-network/rn-auth-core';
import {
  evm,
  solana,
  type CommonError,
  type UserInfo,
} from 'rn-auth-core-beta';

import BigNumber from 'bignumber.js';
import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import Toast from 'react-native-toast-message';
import type { AuthCoreScreenProps } from './App';
import * as Helper from './Helper';
import { TestAccountEVM } from './TestAccount';
import { createWeb3 } from './web3Demo';

export default class AuthCoreDemo extends PureComponent<AuthCoreScreenProps> {
  state = { currentLoadingBtn: '', currentKey: '', currentOptions: [] };
  modalSelect: ModalSelector<any> | null = null;
  web3 = createWeb3('f836e807-4594-46be-a36c-e479f03a5fe8', 'ce0lPTlERmAeGLU146VzknCWChz1DtcHFC396cAD', LoginType.Email);

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
      const chainInfo = this.props.route.params?.chainInfo || EthereumSepolia;
      // @ts-ignore
      const result = await this.web3.currentProvider!.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + chainInfo.id.toString(16) }],
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

  setChainInfo = () => {
    const chainInfo = this.props.route.params?.chainInfo || EthereumSepolia;
    particleBase.setChainInfo(chainInfo);
  }

  getChainInfo = async () => {
    try {
      const chainInfo = await particleBase.getChainInfo();
      Toast.show({
        type: 'success',
        text1: `chainName ${chainInfo.fullname}, id ${chainInfo.id}`,
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  }

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
    const chainInfo = this.props.route.params?.chainInfo || EthereumSepolia;
    const env = Env.Dev;
    particleBase.init(chainInfo, env);
    particleAuthCore.init();
    Toast.show({
      type: 'success',
      text1: 'Initialized successfully',
    });
  };

  switchChain = async () => {
    this.setState({
      currentOptions: [
        {
          label: 'Ethereum',
          key: 'Ethereum',
          value: Ethereum,
        },
        {
          label: 'Ethereum Sepolia',
          key: 'Ethereum Sepolia',
          Value: EthereumSepolia,
        },
        {
          label: 'Solana Testnet',
          key: 'Solana Testnet',
          value: SolanaTestnet,
        },
      ],
    });

    if (this.modalSelect) {
      this.modalSelect.open();
    }
  };

  connect = async () => {
    try {


      const supportAuthType = [
        SupportAuthType.Phone,
        SupportAuthType.Google,
        SupportAuthType.Facebook,
        SupportAuthType.Apple,
        SupportAuthType.Discord,
        SupportAuthType.Github,
        SupportAuthType.Twitch,
        SupportAuthType.Microsoft,
        SupportAuthType.Linkedin,
        SupportAuthType.Twitter,
      ];
      const userInfo = await particleAuthCore.connect(LoginType.Email, null, supportAuthType, SocialLoginPrompt.SelectAccount, {
        projectName: "React Native Example",
        description: "Welcome to login",
        imagePath: "https://connect.particle.network/icons/512.png"
      });

      console.log('connect', userInfo);
      Toast.show({
        type: 'success',
        text1: 'Successfully connected',
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  connectJWT = async () => {
    try {


      const jwt =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IndVUE05RHNycml0Sy1jVHE2OWNKcCJ9.eyJlbWFpbCI6InBhbnRhb3ZheUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vZGV2LXFyNi01OWVlLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJFVmpLMVpaUFN0UWNkV3VoandQZGRBdGdSaXdwNTRWUSIsImlhdCI6MTY5ODk4MjU0OSwiZXhwIjoxNjk5MDE4NTQ5LCJzdWIiOiJhdXRoMHw2MzAzMjE0YjZmNjE1NjM2YWM5MTdmMWIiLCJzaWQiOiJlQ01XNUhpVGp0U2RNVWUxbGlTRFVLNkpxWEtFdDNpTiJ9.etB7gTez1D6lXkcxeZO0ViRE90RujcXxLxq7dDQdtVbeWMmwKBB7cqA8pdkN4vB5l9nP81JFi-8jdVk3oCQBK5i11iL36OC2BsK5W4r6bl3NlAgJAqDio8WMcdHZcgdxOW7Zm4qWQP7Ek2YPDlch4GhtnEzMmmgWzH1Te8cgAkjN72vyvWjmqPk5u0-owWNGcNGMUSaw-1nM1R922OE5FCBglXpk8NlVKg-becJ055ozf9-fVtcjdUABsw7_r60LpzL4Ms5MMJWkqE_WbcQ9IwodpyQZ7gyJYlIfvH96TbsjoQVzWqTCLIJCqHn-N9DB_JUd7fjopVMNR4DlUMNICQ';
      const userInfo = await particleAuthCore.connectJWT(jwt);


      console.log('connect', userInfo);
      Toast.show({
        type: 'success',
        text1: 'Successfully connected',
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  disconnect = async () => {
    try {
      const status = await particleAuthCore.disconnect();
      console.log(status);
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  isConnected = async () => {
    try {
      const result = await particleAuthCore.isConnected();
      console.log(result);
      Toast.show({
        type: 'info',
        text1: 'Is Connected',
        text2: String(result),
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }

  };

  changeMasterPassword = async () => {
    try {
      const result = await particleAuthCore.changeMasterPassword();
      console.log(result);
      Toast.show({
        type: 'info',
        text1: 'changeMasterPassword',
        text2: String(result),
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  solana = async () => {
  };

  solanaGetAddress = async () => {
    const address = await solana.getAddress();
    console.log('solana address ', address);
    Toast.show({
      type: 'success',
      text1: 'Address',
      text2: address,
    });
  };

  solanaSignMessage = async () => {
    try {
      const message = 'Hello world!';
      const signature = await solana.signMessage(message);
      console.log(signature);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
        text2: signature,
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }

  };

  solanaSignTransaction = async () => {
    try {
      const sender = await solana.getAddress();
      console.log('sender: ', sender);
      const transaction = await Helper.getSolanaTransaction(sender);
      const signature = await solana.signTransaction(transaction);
      console.log(signature);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
        text2: signature,
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  solanaSignAllTransactions = async () => {
    try {
      const sender = await solana.getAddress();
      console.log('sender: ', sender);
      const transaction1 = await Helper.getSolanaTransaction(sender);
      const transaction2 = await Helper.getSplTokenTransaction(sender);
      const transactions = [transaction1, transaction2];

      const signatures = await solana.signAllTransactions(transactions);
      console.log(signatures);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
        text2: signatures.join(","),
      });

    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  solanaSignAndSendTransaction = async () => {
    try {
      const sender = await solana.getAddress();
      console.log('sender: ', sender);
      const transaction = await Helper.getSolanaTransaction(sender);
      const txHash = await solana.signAndSendTransaction(transaction);

      console.log(txHash);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
        text2: txHash,
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  evm = async () => {
  };

  evmGetAddress = async () => {
    try {
      const address = await evm.getAddress();
      console.log('evm address ', address);
      Toast.show({
        type: 'success',
        text1: 'Address',
        text2: address,
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  evmPersonalSign = async () => {
    try {
      const message = 'Hello world!';
      const signature = await evm.personalSign(message);
      console.log(signature);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
        text2: signature
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  evmPersonalSignUnique = async () => {
    try {
      const message = 'Hello world!';
      const signature = await evm.personalSignUnique(message);
      console.log(signature);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
        text2: signature
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  getTypedDataV4 = () => {
    const chainInfo: ChainInfo =
      this.props.route.params?.chainInfo || EthereumSepolia;
    const typedData: string = `{"types":{"OrderComponents":[{"name":"offerer","type":"address"},{"name":"zone","type":"address"},{"name":"offer","type":"OfferItem[]"},{"name":"consideration","type":"ConsiderationItem[]"},{"name":"orderType","type":"uint8"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"zoneHash","type":"bytes32"},{"name":"salt","type":"uint256"},{"name":"conduitKey","type":"bytes32"},{"name":"counter","type":"uint256"}],"OfferItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"}],"ConsiderationItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"},{"name":"recipient","type":"address"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"name":"Seaport","version":"1.1","chainId":${chainInfo.id},"verifyingContract":"0x00000000006c3852cbef3e08e8df289169ede581"},"primaryType":"OrderComponents","message":{"offerer":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d","zone":"0x0000000000000000000000000000000000000000","offer":[{"itemType":"2","token":"0xd15b1210187f313ab692013a2544cb8b394e2291","identifierOrCriteria":"33","startAmount":"1","endAmount":"1"}],"consideration":[{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"9750000000000000","endAmount":"9750000000000000","recipient":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d"},{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"250000000000000","endAmount":"250000000000000","recipient":"0x66682e752d592cbb2f5a1b49dd1c700c9d6bfb32"}],"orderType":"0","startTime":"1669188008","endTime":"115792089237316195423570985008687907853269984665640564039457584007913129639935","zoneHash":"0x3000000000000000000000000000000000000000000000000000000000000000","salt":"48774942683212973027050485287938321229825134327779899253702941089107382707469","conduitKey":"0x0000000000000000000000000000000000000000000000000000000000000000","counter":"0"}}`;
    return typedData;
  }

  evmSignTypedData = async () => {
    try {
      const typedData = this.getTypedDataV4();
      const signature = await evm.signTypedData(typedData);
      console.log(signature);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
        text2: signature
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

  evmSignTypedDataUnique = async () => {
    try {
      const typedData = this.getTypedDataV4();
      const signature = await evm.signTypedData(typedData);
      console.log(signature);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
        text2: signature
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

  evmSendTransaction = async () => {
    try {
      const sender = await evm.getAddress();
      console.log('sender ', sender);

      let transaction: string = '';
      // There are four test cases
      // Before test, make sure your public address have some native token for fee.
      // 1. send evm native in Ethereum goerli, the transacion is type 0x2, for blockchains support EIP1559
      // 2. send evm native in BSC testnet, the transacion is type 0x0, for blockchians don't supoort EIP1559
      // 3. send evm token in Ethereum goerli, the transacion is type 0x2, for blockchains support EIP1559
      // 4. send evm token in BSC testnet, the transacion is type 0x0, for blockchians don't supoort EIP1559
      let testCase = 2;

      if (testCase == 1) {
        const receiver = TestAccountEVM.receiverAddress;
        const amount = TestAccountEVM.amount;
        transaction = await Helper.getEthereumTransacion(
          sender,
          receiver,
          BigNumber(amount)
        );
      } else if (testCase == 2) {
        const receiver = TestAccountEVM.receiverAddress;
        const amount = TestAccountEVM.amount;
        transaction = await Helper.getEthereumTransacionLegacy(
          sender,
          receiver,
          BigNumber(amount)
        );
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

      console.log(transaction);
      const txHash = await evm.sendTransaction(transaction);
      console.log(txHash);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
        text2: txHash
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

  openAccountAndSecurity = async () => {
    try {
      const status = await particleAuthCore.openAccountAndSecurity();
      console.log(status);
    } catch (e) {
      const error = e as CommonError;
      console.log(error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }

  };

  getUserInfo = async () => {
    try {
      const userInfo = await particleAuthCore.getUserInfo();
      console.log(userInfo);

    } catch (e) {
      const error = e as CommonError;
      console.log(error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  hasMasterPassword = async () => {
    try {
      const hasMasterPassword = await particleAuthCore.hasMasterPassword();
      console.log('hasMasterPassword', hasMasterPassword);
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
  };

  hasPaymentPassword = async () => {
    try {
      const hasPaymentPassword = await particleAuthCore.hasPaymentPassword();
      console.log('hasPaymentPassword', hasPaymentPassword);
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
  };

  handleModelSelect = async ({ value }: { value: ChainInfo }) => {
    console.log(value);
    switch (this.state.currentKey) {
      case 'SwitchChain':
        const result = await particleAuthCore.switchChain(value);
        Toast.show({
          type: result ? 'success' : 'error',
          text1: result ? 'Successfully switched' : 'Failed to switch chain',
        });
    }
  };

  setSecurityAccountConfig = () => {
    particleBase.setSecurityAccountConfig(new particleBase.SecurityAccountConfig(0, 0));
  }

  setBlindEnable = () => {
    particleAuthCore.setBlindEnable(true);
  }

  getBlindEnable = async () => {
    try {
      const result = await particleAuthCore.getBlindEnable();
      console.log('getBlindEnable', result);
      Toast.show({
        type: 'success',
        text1: `getBlindEnable ${result}`,
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
  data = [
    { key: 'Select Chain Page', function: null },
    { key: 'Init', function: this.init },

    { key: 'web3_getAccounts', function: this.web3_getAccounts },
    { key: 'web3_getBalance', function: this.web3_getBalance },
    { key: 'web3_getChainId', function: this.web3_getChainId },
    { key: 'web3_personalSign', function: this.web3_personalSign },
    { key: 'web3_personalSign_unique', function: this.web3_personalSign_unique },
    { key: 'web3_signTypedData_v4', function: this.web3_signTypedData_v4 },
    { key: 'web3_signTypedData_v4_unique', function: this.web3_signTypedData_v4_unique },
    { key: 'web3_sendTransaction', function: this.web3_sendTransaction },
    { key: 'web3_wallet_switchEthereumChain', function: this.web3_wallet_switchEthereumChain },

    { key: 'Connect', function: this.connect },
    { key: 'ConnectJWT', function: this.connectJWT },
    { key: 'Email Login Page', function: null },
    { key: 'Phone Login Page', function: null },
    { key: 'Disconnect', function: this.disconnect },
    { key: 'IsConnected', function: this.isConnected },
    { key: 'ChangeMasterPassword', function: this.changeMasterPassword },
    { key: 'GetUserInfo', function: this.getUserInfo },
    { key: 'SetChinInfo', function: this.setChainInfo },
    { key: 'GetChainInfo', function: this.getChainInfo },
    { key: 'SwitchChain', function: this.switchChain },

    { key: 'OpenAccountAndSecurity', function: this.openAccountAndSecurity },

    { key: 'HasMasterPassword', function: this.hasMasterPassword },
    { key: 'HasPaymentPassword', function: this.hasPaymentPassword },

    { key: 'EVM ↓', function: this.evm },
    { key: 'EVM GetAddress', function: this.evmGetAddress },
    { key: 'PersonalSign', function: this.evmPersonalSign },
    { key: 'PersonalSignUnique', function: this.evmPersonalSignUnique },
    { key: 'SignTypedData', function: this.evmSignTypedData },
    { key: 'SignTypedDataUnique', function: this.evmSignTypedDataUnique },
    { key: 'SendTransaction', function: this.evmSendTransaction },

    { key: 'Solana ↓', function: this.solana },
    { key: 'Solana GetAddress', function: this.solanaGetAddress },
    { key: 'SignMessage', function: this.solanaSignMessage },
    { key: 'SignTransaction', function: this.solanaSignTransaction },
    { key: 'SignAllTransactions', function: this.solanaSignAllTransactions },
    {
      key: 'SignAndSendTransaction',
      function: this.solanaSignAndSendTransaction,
    },

    { key: 'SetSecurityAccountConfig', function: this.setSecurityAccountConfig },
    { key: 'SetBlindEnable', function: this.setBlindEnable },
    { key: 'GetBlindEnable', function: this.getBlindEnable },
  ];

  componentDidMount(): void {
    this.init();
  }

  render = () => {
    const { navigation } = this.props;

    return (
      <SafeAreaView>
        <View>
          <FlatList
            // @ts-ignore
            data={this.data}
            renderItem={({
              item,
            }: {
              item: { key: string; function: () => void };
            }) => (
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={async () => {
                  if (item.key === 'Select Chain Page') {
                    // @ts-ignore
                    navigation.push('SelectChainPage');
                  } else if (item.key === 'Email Login Page') {
                    // @ts-ignore
                    navigation.push('EmailLoginPage');
                  } else if (item.key === 'Phone Login Page') {
                    // @ts-ignore
                    navigation.push('PhoneLoginPage');
                  } else {
                    this.setState({
                      currentLoadingBtn: item.key,
                      currentKey: item.key,
                    });

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
          selectStyle={{ display: 'none' }}
          onChange={this.handleModelSelect}
          data={this.state.currentOptions}
          ref={(el) => {
            this.modalSelect = el;
          }}
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
