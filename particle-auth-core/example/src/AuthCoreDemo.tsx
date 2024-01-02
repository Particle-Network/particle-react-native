import {
  Ethereum,
  EthereumGoerli,
  PolygonMumbai,
  SolanaTestnet,
  type ChainInfo,
} from '@particle-network/chains';
import * as particleAuth from '@particle-network/rn-auth';
import { Env, ParticleInfo } from '@particle-network/rn-auth';
import * as particleAuthCore from '@particle-network/rn-auth-core';
import {
  LoginType,
  SocialLoginPrompt,
  SupportAuthType
} from '@particle-network/rn-auth';

import {
  evm,
  solana,
  type CommonError,
  type UserInfo,
} from '@particle-network/rn-auth-core';
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

export default class AuthCoreDemo extends PureComponent<AuthCoreScreenProps> {
  state = { currentLoadingBtn: '', currentKey: '', currentOptions: [] };
  modalSelect: ModalSelector<any> | null = null;

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
    const env = Env.Dev;
    particleAuth.init(chainInfo, env);
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
          label: 'Polygon Mumbai',
          key: 'Polygon Mumbai',
          value: PolygonMumbai,
        },
        { label: 'Ethereum', key: 'Ethereum', value: Ethereum },
        {
          label: 'Ethereum Goerli',
          key: 'Ethereum Goerli',
          Value: EthereumGoerli,
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
    const result = await particleAuthCore.connect(LoginType.Github, null, null, SocialLoginPrompt.SelectAccount);
    if (result.status) {
      const userInfo = result.data as UserInfo;
      console.log('connect', userInfo);
      Toast.show({
        type: 'success',
        text1: 'Successfully connected',
      });
    } else {
      const error = result.data as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  connectJWT = async () => {
    const jwt =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IndVUE05RHNycml0Sy1jVHE2OWNKcCJ9.eyJlbWFpbCI6InBhbnRhb3ZheUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vZGV2LXFyNi01OWVlLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJFVmpLMVpaUFN0UWNkV3VoandQZGRBdGdSaXdwNTRWUSIsImlhdCI6MTY5ODk4MjU0OSwiZXhwIjoxNjk5MDE4NTQ5LCJzdWIiOiJhdXRoMHw2MzAzMjE0YjZmNjE1NjM2YWM5MTdmMWIiLCJzaWQiOiJlQ01XNUhpVGp0U2RNVWUxbGlTRFVLNkpxWEtFdDNpTiJ9.etB7gTez1D6lXkcxeZO0ViRE90RujcXxLxq7dDQdtVbeWMmwKBB7cqA8pdkN4vB5l9nP81JFi-8jdVk3oCQBK5i11iL36OC2BsK5W4r6bl3NlAgJAqDio8WMcdHZcgdxOW7Zm4qWQP7Ek2YPDlch4GhtnEzMmmgWzH1Te8cgAkjN72vyvWjmqPk5u0-owWNGcNGMUSaw-1nM1R922OE5FCBglXpk8NlVKg-becJ055ozf9-fVtcjdUABsw7_r60LpzL4Ms5MMJWkqE_WbcQ9IwodpyQZ7gyJYlIfvH96TbsjoQVzWqTCLIJCqHn-N9DB_JUd7fjopVMNR4DlUMNICQ';
    const result = await particleAuthCore.connectJWT(jwt);
    if (result.status) {
      const userInfo = result.data as UserInfo;
      console.log('connect', userInfo);
      Toast.show({
        type: 'success',
        text1: 'Successfully connected',
      });
    } else {
      const error = result.data as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  presentLoginPage = async () => {
    const result = await particleAuthCore.presentLoginPage(LoginType.Email, null, [SupportAuthType.All], null, { projectName: 'React Native Example', description: 'Welcome to login', imageType: 'base64', imagePath: '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' });
    if (result.status) {
      const userInfo = result.data as UserInfo;
      console.log('connect', userInfo);
      Toast.show({
        type: 'success',
        text1: 'Successfully connected',
      });
    } else {
      const error = result.data as CommonError;
      console.log('connect', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  }

  disconnect = async () => {
    const result = await particleAuthCore.disconnect();
    if (result.status) {
      console.log(result.data);
    } else {
      const error = result.data as CommonError;
      console.log(error);
    }
  };

  isConnected = async () => {
    const result = await particleAuthCore.isConnected();
    console.log(result);
    Toast.show({
      type: 'info',
      text1: 'Is Connected',
      text2: String(result),
    });
  };

  changeMasterPassword = async () => {
    const result = await particleAuthCore.changeMasterPassword();
    if (result.status) {
      console.log(result.data);
    } else {
      const error = result.data as CommonError;
      console.log(error);
    }
  };

  solana = async () => { };

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
    const message = 'Hello world!';
    const result = await solana.signMessage(message);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
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

  solanaSignTransaction = async () => {
    const sender = await solana.getAddress();
    console.log('sender: ', sender);
    const transaction = await Helper.getSolanaTransaction(sender);
    const result = await solana.signTransaction(transaction);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
    } else {
      const error = result.data;
      console.log(error);
    }
  };

  solanaSignAllTransactions = async () => {
    const sender = await solana.getAddress();
    console.log('sender: ', sender);
    const transaction1 = await Helper.getSolanaTransaction(sender);
    const transaction2 = await Helper.getSplTokenTransaction(sender);
    const transactions = [transaction1, transaction2];

    const result = await solana.signAllTransactions(transactions);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
    } else {
      const error = result.data;
      console.log(error);
    }
  };

  solanaSignAndSendTransaction = async () => {
    const sender = await solana.getAddress();
    console.log('sender: ', sender);
    const transaction = await Helper.getSolanaTransaction(sender);
    const result = await solana.signAndSendTransaction(transaction);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
    } else {
      const error = result.data;
      console.log(error);
    }
  };

  evm = async () => { };

  evmGetAddress = async () => {
    const address = await evm.getAddress();
    console.log('evm address ', address);
    Toast.show({
      type: 'success',
      text1: 'Address',
      text2: address,
    });
  };

  evmPersonalSign = async () => {
    const message = 'Hello world!';
    const result = await evm.personalSign(message);
    console.log(result);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
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

  evmPersonalSignUnique = async () => {
    const message = 'Hello world!';
    const result = await evm.personalSignUnique(message);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
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

  evmSignTypedData = async () => {
    const chainInfo: ChainInfo =
      this.props.route.params?.chainInfo || PolygonMumbai;
    const typedData: string = `{"types":{"OrderComponents":[{"name":"offerer","type":"address"},{"name":"zone","type":"address"},{"name":"offer","type":"OfferItem[]"},{"name":"consideration","type":"ConsiderationItem[]"},{"name":"orderType","type":"uint8"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"zoneHash","type":"bytes32"},{"name":"salt","type":"uint256"},{"name":"conduitKey","type":"bytes32"},{"name":"counter","type":"uint256"}],"OfferItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"}],"ConsiderationItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"},{"name":"recipient","type":"address"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"name":"Seaport","version":"1.1","chainId":${chainInfo.id},"verifyingContract":"0x00000000006c3852cbef3e08e8df289169ede581"},"primaryType":"OrderComponents","message":{"offerer":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d","zone":"0x0000000000000000000000000000000000000000","offer":[{"itemType":"2","token":"0xd15b1210187f313ab692013a2544cb8b394e2291","identifierOrCriteria":"33","startAmount":"1","endAmount":"1"}],"consideration":[{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"9750000000000000","endAmount":"9750000000000000","recipient":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d"},{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"250000000000000","endAmount":"250000000000000","recipient":"0x66682e752d592cbb2f5a1b49dd1c700c9d6bfb32"}],"orderType":"0","startTime":"1669188008","endTime":"115792089237316195423570985008687907853269984665640564039457584007913129639935","zoneHash":"0x3000000000000000000000000000000000000000000000000000000000000000","salt":"48774942683212973027050485287938321229825134327779899253702941089107382707469","conduitKey":"0x0000000000000000000000000000000000000000000000000000000000000000","counter":"0"}}`;

    const result = await evm.signTypedData(typedData);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
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

  evmSignTypedDataUnique = async () => {
    const chainInfo: ChainInfo =
      this.props.route.params?.chainInfo || PolygonMumbai;
    const typedData: string = `{"types":{"OrderComponents":[{"name":"offerer","type":"address"},{"name":"zone","type":"address"},{"name":"offer","type":"OfferItem[]"},{"name":"consideration","type":"ConsiderationItem[]"},{"name":"orderType","type":"uint8"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"zoneHash","type":"bytes32"},{"name":"salt","type":"uint256"},{"name":"conduitKey","type":"bytes32"},{"name":"counter","type":"uint256"}],"OfferItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"}],"ConsiderationItem":[{"name":"itemType","type":"uint8"},{"name":"token","type":"address"},{"name":"identifierOrCriteria","type":"uint256"},{"name":"startAmount","type":"uint256"},{"name":"endAmount","type":"uint256"},{"name":"recipient","type":"address"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"name":"Seaport","version":"1.1","chainId":${chainInfo.id},"verifyingContract":"0x00000000006c3852cbef3e08e8df289169ede581"},"primaryType":"OrderComponents","message":{"offerer":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d","zone":"0x0000000000000000000000000000000000000000","offer":[{"itemType":"2","token":"0xd15b1210187f313ab692013a2544cb8b394e2291","identifierOrCriteria":"33","startAmount":"1","endAmount":"1"}],"consideration":[{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"9750000000000000","endAmount":"9750000000000000","recipient":"0x6fc702d32e6cb268f7dc68766e6b0fe94520499d"},{"itemType":"0","token":"0x0000000000000000000000000000000000000000","identifierOrCriteria":"0","startAmount":"250000000000000","endAmount":"250000000000000","recipient":"0x66682e752d592cbb2f5a1b49dd1c700c9d6bfb32"}],"orderType":"0","startTime":"1669188008","endTime":"115792089237316195423570985008687907853269984665640564039457584007913129639935","zoneHash":"0x3000000000000000000000000000000000000000000000000000000000000000","salt":"48774942683212973027050485287938321229825134327779899253702941089107382707469","conduitKey":"0x0000000000000000000000000000000000000000000000000000000000000000","counter":"0"}}`;

    const result = await evm.signTypedDataUnique(typedData);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
      Toast.show({
        type: 'success',
        text1: 'Successfully signed',
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

  evmSendTransaction = async () => {
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
    const result = await evm.sendTransaction(transaction);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
    } else {
      const error = result.data;
      console.log(error);
    }
  };

  openAccountAndSecurity = async () => {
    const result = await particleAuthCore.openAccountAndSecurity();
    if (result.status) {
      const signature = result.data;
      console.log(signature);
    } else {
      const error = result.data;
      console.log(error);
    }
  };

  getUserInfo = async () => {
    const result = await particleAuthCore.getUserInfo();
    const userInfo = JSON.parse(result);
    console.log(userInfo);
  };

  hasMasterPassword = async () => {
    const hasMasterPassword = await particleAuthCore.hasMasterPassword();
    console.log('hasMasterPassword', hasMasterPassword);
  };

  hasPaymentPassword = async () => {
    const hasPaymentPassword = await particleAuthCore.hasPaymentPassword();
    console.log('hasPaymentPassword', hasPaymentPassword);
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

  setBlindEnable = async () => {
    particleAuthCore.setBlindEnable(true);
  }

  getBlindEnable = async () => {
    const result = await particleAuthCore.getBlindEnable();
    console.log('getBlindEnable', result);
    Toast.show({
      type: 'success',
      text1: `getBlindEnable ${result}`,
    });
  }

  data = [
    { key: 'Select Chain Page', function: null },
    { key: 'Init', function: this.init },
    { key: 'Connect', function: this.connect },
    { key: 'ConnectJWT', function: this.connectJWT },
    { key: 'PresentLoginPage', function: this.presentLoginPage },
    { key: 'Email Login Page', function: null },
    { key: 'Phone Login Page', function: null },
    { key: 'Disconnect', function: this.disconnect },
    { key: 'IsConnected', function: this.isConnected },
    { key: 'ChangeMasterPassword', function: this.changeMasterPassword },
    { key: 'GetUserInfo', function: this.getUserInfo },
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
