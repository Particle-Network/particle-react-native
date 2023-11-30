import {
  Ethereum,
  EthereumGoerli,
  EthereumSepolia,
  Polygon,
  PolygonMumbai,
} from '@particle-network/chains';
import * as particleAA from '@particle-network/rn-aa';
import { CommonError, FeeQuote } from '@particle-network/rn-aa';
import * as particleAuth from '@particle-network/rn-auth';
import { AAFeeMode, Env, ParticleInfo } from '@particle-network/rn-auth';
import * as particleConnect from '@particle-network/rn-connect';
import {
  AccountInfo,
  DappMetaData,
  WalletType,
} from '@particle-network/rn-connect';
import {
  AccounName,
  VersionNumber
} from  '@particle-network/rn-auth';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import BigNumber from 'bignumber.js';
import React, { PureComponent } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import * as Helper from './Helper';
import { TestAccountEVM } from './TestAccount';

interface AAConnectDemoProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}

export default class AAConnectDemo extends PureComponent<AAConnectDemoProps> {
  publicAddress = '0x498c9b8379E2e16953a7b1FF94ea11893d09A3Ed';

  walletType = WalletType.MetaMask;

  init = () => {
    // Get your project id and client from dashboard, https://dashboard.particle.network
    ParticleInfo.projectId = '5479798b-26a9-4943-b848-649bb104fdc3'; // your project id
    ParticleInfo.clientKey = 'cUKfeOA7rnNFCxSBtXE5byLgzIhzGrE4Y7rDdY4b'; // your client key

    if (ParticleInfo.projectId == '' || ParticleInfo.clientKey == '') {
      throw new Error(
        'You need set project info, get your project id and client from dashboard, https://dashboard.particle.network'
      );
    }

    // should init particle auth
    const chainInfo = PolygonMumbai;
    const env = Env.Production;

    particleAuth.init(chainInfo, env);

    const metadata = new DappMetaData(
      '75ac08814504606fc06126541ace9df6',
      'Particle Connect',
      'https://connect.particle.network/icons/512.png',
      'https://connect.particle.network',
      'Particle Wallet',
      '',
      ''
    );

    // the rpcUrl works for WalletType EvmPrivateKey and SolanaPrivakey
    // we have default rpc url in native SDK
    const rpcUrl = { evm_url: null, solana_url: null };

    // should init particle connect first
    particleConnect.init(chainInfo, env, metadata, rpcUrl);

    // then set wallet connect project id
    const chainInfos = [Ethereum, Polygon, EthereumGoerli, EthereumSepolia];
    // set support wallet connect chain list
    particleConnect.setWalletConnectV2SupportChainInfos(chainInfos);

    // then init particle AA
    const biconomyAppKeys = {
      1: 'your ethereum mainnet key',
      5: 'your ethereum goerli key',
      137: 'your polygon mainnet key',
      80001: 'hYZIwIsf2.e18c790b-cafb-4c4e-a438-0289fc25dba1',
    };
    particleAA.init(AccounName.BICONOMY, VersionNumber.v1_0_0, biconomyAppKeys);

    Toast.show({
      type: 'success',
      text1: 'Initialized successfully',
    });
  };

  setChainInfo = async () => {
    const chainInfo = PolygonMumbai;
    const result = await particleAuth.setChainInfo(chainInfo);
    console.log(result);

    Toast.show({
      type: result ? 'success' : 'error',
      text1: result
        ? 'Successfully set chain info'
        : 'Failed to set chain info',
    });
  };

  loginMetamask = async () => {
    const result = await particleConnect.connect(this.walletType);
    console.log(result);
    if (result.status) {
      this.publicAddress = (result.data as AccountInfo).publicAddress;
      console.log(this.publicAddress);
    } else {
      const error = result.data as CommonError;
      console.log(error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  enable = async () => {
    particleAA.enableAAMode();
    Toast.show({
      type: 'success',
      text1: 'Successfully set',
    });
  };

  disable = async () => {
    particleAA.disableAAMode();
    Toast.show({
      type: 'success',
      text1: 'Successfully set',
    });
  };

  isEnable = async () => {
    const result = await particleAA.isAAModeEnable();
    console.log('is enable', result);

    Toast.show({
      type: 'info',
      text1: 'Is enable',
      text2: String(result),
    });
  };

  rpcGetFeeQuotes = async () => {
    const eoaAddress = this.publicAddress;
    console.log('eoaAddress', eoaAddress);
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      eoaAddress,
      receiver,
      BigNumber(amount)
    );

    console.log('transaction', transaction);
    const result = await particleAA.rpcGetFeeQuotes(eoaAddress, [transaction]);

    console.log('rpcGetFeeQuotes result', result);

    if (result instanceof Array) {
      Toast.show({
        type: 'success',
        text1: 'Successfully get fee quotes',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: (result as CommonError).message,
      });
    }
  };

  isDeploy = async () => {
    const eoaAddress = this.publicAddress;
    const result = await particleAA.isDeploy(eoaAddress);

    if (result.status) {
      const isDeploy = result.data;
      console.log('isDeploy result', isDeploy);

      Toast.show({
        type: 'info',
        text1: 'Is Deploy',
        text2: String(isDeploy),
      });
    } else {
      const error = result.data as CommonError;
      console.log('isDeploy result', error);

      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  isSupportChainInfo = async () => {
    const result = await particleAA.isSupportChainInfo(PolygonMumbai);
    console.log('isSupportChainInfo result', result);
    Toast.show({
      type: 'info',
      text1: 'Is support chain info',
      text2: String(result),
    });
  };

  signAndSendTransactionWithAAAuto = async () => {
    const eoaAddress = this.publicAddress;
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      eoaAddress,
      receiver,
      BigNumber(amount)
    );

    const feeQutotes = (await particleAA.rpcGetFeeQuotes(eoaAddress, [
      transaction,
    ])) as FeeQuote[];
    const result = await particleConnect.signAndSendTransaction(
      this.walletType,
      this.publicAddress,
      transaction,
      AAFeeMode.native(feeQutotes)
    );
    if (result.status) {
      const signature = result.data;
      console.log('signAndSendTransactionWithAAAuto result', signature);
    } else {
      const error = result.data as CommonError;
      console.log('signAndSendTransactionWithAAAuto result', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  signAndSendTransactionWithAAGasless = async () => {
    const eoaAddress = this.publicAddress;
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      eoaAddress,
      receiver,
      BigNumber(amount)
    );
    const feeQutotes = (await particleAA.rpcGetFeeQuotes(eoaAddress, [
      transaction,
    ])) as FeeQuote[];
    const result = await particleConnect.signAndSendTransaction(
      this.walletType,
      this.publicAddress,
      transaction,
      AAFeeMode.gasless(feeQutotes)
    );
    if (result.status) {
      const signature = result.data;
      console.log('signAndSendTransactionWithAAGasless result', signature);
    } else {
      const error = result.data as CommonError;
      console.log('signAndSendTransactionWithAAGasless result', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  signAndSendTransactionWithAACustom = async () => {
    const eoaAddress = this.publicAddress;
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      eoaAddress,
      receiver,
      BigNumber(amount)
    );

    const feeQutotes = (await particleAA.rpcGetFeeQuotes(eoaAddress, [
      transaction,
    ])) as FeeQuote[];

    const result = await particleConnect.signAndSendTransaction(
      this.walletType,
      this.publicAddress,
      transaction,
      AAFeeMode.token(
        feeQutotes?.tokenPaymaster.feeQuotes[0],
        feeQutotes?.tokenPaymaster?.tokenPaymasterAddress
      )
    );
    if (result.status) {
      const signature = result.data;
      console.log('signAndSendTransactionWithAACustom result', signature);
    } else {
      const error = result.data as CommonError;
      console.log('signAndSendTransactionWithAACustom result', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  batchSendTransactions = async () => {
    const eoaAddress = this.publicAddress;
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      eoaAddress,
      receiver,
      BigNumber(amount)
    );

    const transactions = [transaction, transaction];
    const feeQutotes = await particleAA.rpcGetFeeQuotes(
      eoaAddress,
      transactions
    );
    const result = await particleConnect.batchSendTransactions(
      this.walletType,
      this.publicAddress,
      transactions,
      AAFeeMode.gasless(feeQutotes)
    );
    if (result.status) {
      const signature = result.data;
      console.log('batchSendTransactions result', signature);
    } else {
      const error = result.data as CommonError;
      console.log('batchSendTransactions result', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  data = [
    { key: 'Init', function: this.init },
    { key: 'SetChainInfo', function: this.setChainInfo },
    { key: 'LoginMetamask', function: this.loginMetamask },
    { key: 'Enable', function: this.enable },
    { key: 'Disable', function: this.disable },
    { key: 'IsEnable', function: this.isEnable },
    { key: 'rpcGetFeeQuotes', function: this.rpcGetFeeQuotes },
    { key: 'isDeploy', function: this.isDeploy },
    { key: 'isSupportChainInfo', function: this.isSupportChainInfo },
    { key: 'batchSendTransactions', function: this.batchSendTransactions },
    {
      key: 'signAndSendTransactionWithAAAuto',
      function: this.signAndSendTransactionWithAAAuto,
    },
    {
      key: 'signAndSendTransactionWithAAGasless',
      function: this.signAndSendTransactionWithAAGasless,
    },
    {
      key: 'signAndSendTransactionWithAACustom',
      function: this.signAndSendTransactionWithAACustom,
    },
  ];

  render = () => {
    return (
      <SafeAreaView>
        <View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    width: 300,
    marginHorizontal: 50,
    marginVertical: 10,
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
  },
});
