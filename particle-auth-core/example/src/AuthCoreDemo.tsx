import { PolygonMumbai, type ChainInfo } from '@particle-network/chains';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
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
import * as particleAuth from 'react-native-particle-auth';
import { Env, ParticleInfo } from 'react-native-particle-auth';
import * as particleAuthCore from 'react-native-particle-auth-core';
import {
  ErrResp,
  UserInfo,
  evm,
  solana,
} from 'react-native-particle-auth-core';
import Toast from 'react-native-toast-message';
import * as Helper from './Helper';
import { TestAccountEVM } from './TestAccount';

interface AuthDemoDemoProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}
export default class AuthCoreDemo extends PureComponent<AuthDemoDemoProps> {
  state = { currentLoadingBtn: '', currentKey: '' };

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
    const chainInfo: ChainInfo =
      this.props.route.params?.chainInfo || PolygonMumbai;
    const result = await particleAuthCore.switchChain(chainInfo);
    console.log(result);
  };

  connect = async () => {
    const jwt = ''; // your jwt
    const result = await particleAuthCore.connect(jwt);
    if (result.status) {
      const userInfo = result.data as UserInfo;
      console.log('connect', userInfo);
      Toast.show({
        type: 'success',
        text1: 'Successfully connected',
      });
    } else {
      const error = result.data as ErrResp;
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
      const error = result.data;
      console.log(error);
    }
  };

  isConnected = async () => {
    const result = await particleAuthCore.isConnected();
    console.log(result);
  };

  solana = async () => {};

  solanaGetAddress = async () => {
    const address = await solana.getAddress();
    console.log('solana address ', address);
  };

  solanaSignMessage = async () => {
    const message = 'Hello world!';
    const result = await solana.signMessage(message);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
    } else {
      const error = result.data;
      console.log(error);
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
  };

  evmPersonalSign = async () => {
    const message = 'Hello world!';
    const result = await evm.personalSign(message);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
    } else {
      const error = result.data;
      console.log(error);
    }
  };

  evmPersonalSignUnique = async () => {
    const message = 'Hello world!';
    const result = await evm.personalSignUnique(message);
    if (result.status) {
      const signature = result.data;
      console.log(signature);
    } else {
      const error = result.data;
      console.log(error);
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
    } else {
      const error = result.data;
      console.log(error);
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
    } else {
      const error = result.data;
      console.log(error);
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
    particleAuthCore.openWebWallet(webConfigJSON);
  };

  hasMasterPassword = async () => {
    const hasMasterPassword = await particleAuthCore.hasMasterPassword();
    console.log('hasMasterPassword', hasMasterPassword);
  };

  hasPaymentPassword = async () => {
    const hasPaymentPassword = await particleAuthCore.hasPaymentPassword();
    console.log('hasPaymentPassword', hasPaymentPassword);
  };

  data = [
    { key: 'Select Chain Page', function: null },
    { key: 'Init', function: this.init },
    { key: 'Connect', function: this.connect },
    { key: 'Disconnect', function: this.disconnect },
    { key: 'IsConnected', function: this.isConnected },
    { key: 'GetUserInfo', function: this.getUserInfo },
    { key: 'SwitchChain', function: this.switchChain },

    { key: 'OpenWebWallet', function: this.openWebWallet },
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
                  if (item.key == 'Select Chain Page') {
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
        </View>
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
