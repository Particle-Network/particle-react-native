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
  evm,
  solana,
  type CommonError,
  type UserInfo,
} from '@particle-network/rn-auth-core';
import BigNumber from 'bignumber.js';
import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  Button,
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
    const jwt =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IndVUE05RHNycml0Sy1jVHE2OWNKcCJ9.eyJlbWFpbCI6InBhbnRhb3ZheUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vZGV2LXFyNi01OWVlLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJFVmpLMVpaUFN0UWNkV3VoandQZGRBdGdSaXdwNTRWUSIsImlhdCI6MTY5ODk4MjU0OSwiZXhwIjoxNjk5MDE4NTQ5LCJzdWIiOiJhdXRoMHw2MzAzMjE0YjZmNjE1NjM2YWM5MTdmMWIiLCJzaWQiOiJlQ01XNUhpVGp0U2RNVWUxbGlTRFVLNkpxWEtFdDNpTiJ9.etB7gTez1D6lXkcxeZO0ViRE90RujcXxLxq7dDQdtVbeWMmwKBB7cqA8pdkN4vB5l9nP81JFi-8jdVk3oCQBK5i11iL36OC2BsK5W4r6bl3NlAgJAqDio8WMcdHZcgdxOW7Zm4qWQP7Ek2YPDlch4GhtnEzMmmgWzH1Te8cgAkjN72vyvWjmqPk5u0-owWNGcNGMUSaw-1nM1R922OE5FCBglXpk8NlVKg-becJ055ozf9-fVtcjdUABsw7_r60LpzL4Ms5MMJWkqE_WbcQ9IwodpyQZ7gyJYlIfvH96TbsjoQVzWqTCLIJCqHn-N9DB_JUd7fjopVMNR4DlUMNICQ';
    const result = await particleAuthCore.connect(jwt);
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

  solana = async () => {};

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

  evm = async () => {};

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

  data = [
    { key: 'Select Chain Page', function: null },
    { key: 'Init', function: this.init },
    { key: 'Connect', function: this.connect },
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
          <Button
            title="link baidu"
            onPress={() => navigation.navigate('baidu')}
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
