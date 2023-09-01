import { PolygonMumbai } from '@particle-network/chains';
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
import {
  BiconomyFeeMode,
  BiconomyVersion,
  Env,
  LoginType,
  ParticleInfo,
  SupportAuthType,
} from 'react-native-particle-auth';

import * as particleAuth from 'react-native-particle-auth';
import * as particleBiconomy from 'react-native-particle-biconomy';
import { CommonError } from 'react-native-particle-biconomy/lib/typescript/Models';
import Toast from 'react-native-toast-message';
import * as Helper from './Helper';
import { TestAccountEVM } from './TestAccount';

import type { NavigationProp, RouteProp } from '@react-navigation/native';
import BigNumber from 'bignumber.js';

interface BiconomyAuthDemoProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}

export default class BiconomyAuthDemo extends PureComponent<BiconomyAuthDemoProps> {
  state = { currentLoadingBtn: '', currentOptions: [], currentKey: '' };
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

    // then init particle biconomy
    const dappAppKeys = {
      1: 'your ethereum mainnet key',
      5: 'your ethereum goerli key',
      137: 'your polygon mainnet key',
      80001: 'hYZIwIsf2.e18c790b-cafb-4c4e-a438-0289fc25dba1',
    };
    particleBiconomy.init(BiconomyVersion.v1_0_0, dappAppKeys);

    Toast.show({
      type: 'success',
      text1: 'Initialized successfully',
    });
  };

  setChainInfo = async () => {
    const chainInfo = PolygonMumbai;
    const result = await particleAuth.setChainInfo(chainInfo);
    Toast.show({
      type: result ? 'success' : 'error',
      text1: result
        ? 'Successfully set chain info'
        : 'Failed to set chain info',
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
    const result = await particleAuth.login(
      type,
      '',
      supportAuthType,
      undefined
    );
    if (result.status) {
      const userInfo = result.data;
      console.log(userInfo);

      Toast.show({
        type: 'success',
        text1: 'Login succeessfully',
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

  enable = async () => {
    particleBiconomy.enableBiconomyMode();

    Toast.show({
      type: 'success',
      text1: 'Successfully set',
    });
  };

  disable = async () => {
    particleBiconomy.disableBiconomyMode();

    Toast.show({
      type: 'success',
      text1: 'Successfully set',
    });
  };

  isEnable = async () => {
    const result = await particleBiconomy.isBiconomyModeEnable();
    console.log('is enable', result);

    Toast.show({
      type: 'info',
      text1: 'Is enable',
      text2: String(result),
    });
  };

  rpcGetFeeQuotes = async () => {
    const eoaAddress = await particleAuth.getAddress();
    console.log('eoaAddress', eoaAddress);
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      eoaAddress,
      receiver,
      BigNumber(amount)
    );

    console.log('transaction', transaction);
    const result = await particleBiconomy.rpcGetFeeQuotes(eoaAddress, [
      transaction,
    ]);

    console.log('rpcGetFeeQuotes result', result);
  };

  isDeploy = async () => {
    const eoaAddress = await particleAuth.getAddress();
    const result = await particleBiconomy.isDeploy(eoaAddress);

    if (result.status) {
      const isDeploy = result.data;
      console.log('isDeploy result', isDeploy);
      Toast.show({
        type: 'success',
        text1: 'isDeploy result',
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
    const result = await particleBiconomy.isSupportChainInfo(PolygonMumbai);
    console.log('isSupportChainInfo result', result);
    Toast.show({
      type: 'info',
      text1: 'IsSupportChainInfo result',
      text2: String(result),
    });
  };

  signAndSendTransactionWithBiconomyAuto = async () => {
    const eoaAddress = await particleAuth.getAddress();
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      eoaAddress,
      receiver,
      BigNumber(amount)
    );
    console.log('transaction', transaction);
    const result = await particleAuth.signAndSendTransaction(
      transaction,
      BiconomyFeeMode.auto()
    );
    if (result.status) {
      const signature = result.data;
      console.log('signAndSendTransactionWithBiconomyAuto result', signature);
    } else {
      const error = result.data;
      console.log('signAndSendTransactionWithBiconomyAuto result', error);
    }
  };

  signAndSendTransactionWithBiconomyGasless = async () => {
    const eoaAddress = await particleAuth.getAddress();
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      eoaAddress,
      receiver,
      BigNumber(amount)
    );

    const result = await particleAuth.signAndSendTransaction(
      transaction,
      BiconomyFeeMode.gasless()
    );
    if (result.status) {
      const signature = result.data;
      console.log(
        'signAndSendTransactionWithBiconomyGasless result',
        signature
      );
    } else {
      const error = result.data;
      console.log('signAndSendTransactionWithBiconomyGasless result', error);
    }
  };

  signAndSendTransactionWithBiconomyCustom = async () => {
    const eoaAddress = await particleAuth.getAddress();
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      eoaAddress,
      receiver,
      BigNumber(amount)
    );

    const feeQutotes = await particleBiconomy.rpcGetFeeQuotes(eoaAddress, [
      transaction,
    ]);

    const result = await particleAuth.signAndSendTransaction(
      transaction,
      BiconomyFeeMode.custom(feeQutotes[0])
    );
    if (result.status) {
      const signature = result.data;
      console.log('signAndSendTransactionWithBiconomyCustom result', signature);
    } else {
      const error = result.data;
      console.log('signAndSendTransactionWithBiconomyCustom result', error);
    }
  };

  batchSendTransactions = async () => {
    const eoaAddress = await particleAuth.getAddress();
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      eoaAddress,
      receiver,
      BigNumber(amount)
    );

    const transactions = [transaction, transaction];
    const result = await particleAuth.batchSendTransactions(
      transactions,
      BiconomyFeeMode.auto()
    );
    if (result.status) {
      const signature = result.data;
      console.log('batchSendTransactions result', signature);
    } else {
      const error = result.data;
      console.log('batchSendTransactions result', error);
    }
  };

  data = [
    { key: 'Init', function: this.init },
    { key: 'SetChainInfo', function: this.setChainInfo },
    { key: 'Login', function: this.login },
    { key: 'Enable', function: this.enable },
    { key: 'Disable', function: this.disable },
    { key: 'IsEnable', function: this.isEnable },
    { key: 'rpcGetFeeQuotes', function: this.rpcGetFeeQuotes },
    { key: 'isDeploy', function: this.isDeploy },
    { key: 'isSupportChainInfo', function: this.isSupportChainInfo },
    { key: 'batchSendTransactions', function: this.batchSendTransactions },
    {
      key: 'signAndSendTransactionWithBiconomyAuto',
      function: this.signAndSendTransactionWithBiconomyAuto,
    },
    {
      key: 'signAndSendTransactionWithBiconomyGasless',
      function: this.signAndSendTransactionWithBiconomyGasless,
    },
    {
      key: 'signAndSendTransactionWithBiconomyCustom',
      function: this.signAndSendTransactionWithBiconomyCustom,
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
                onPress={async () => {
                  this.setState({ currentLoadingBtn: item.key });

                  await item.function();
                  this.setState({ currentLoadingBtn: '' });
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
