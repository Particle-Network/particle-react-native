import { PolygonMumbai } from '@particle-network/chains';
import {
  AAFeeMode,
  AccountName,
  Env,
  EvmService,
  LoginType,
  ParticleInfo,
  SupportAuthType,
  SmartAccountInfo
} from '@particle-network/rn-auth';
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

import * as particleAA from '@particle-network/rn-aa';
import { CommonError, WholeFeeQuote } from '@particle-network/rn-aa';
import * as particleAuth from '@particle-network/rn-auth';
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
    const biconomyAppKeys = {
      1: 'your ethereum mainnet key',
      5: 'your ethereum goerli key',
      137: 'your polygon mainnet key',
      80001: 'hYZIwIsf2.e18c790b-cafb-4c4e-a438-0289fc25dba1',
    };

    particleAA.init(
      AccountName.BICONOMY_V1(),
      biconomyAppKeys
    );

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
    const result = await particleAA.rpcGetFeeQuotes(eoaAddress, [transaction]);

    console.log('rpcGetFeeQuotes result', result);
  };

  isDeploy = async () => {
    const eoaAddress = await particleAuth.getAddress();
    const result = await particleAA.isDeploy(eoaAddress);

    if (result.status) {
      const isDeploy = result.data;
      console.log('isDeploy result', isDeploy);
      Toast.show({
        type: 'success',
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

  getSmartAccountAddress = async (eoaAddress: string) => {
    const smartAccountParam = {
      name: AccountName.BICONOMY_V1().name,
      version: AccountName.BICONOMY_V1().version,
      ownerAddress: eoaAddress,
    };
    const result: SmartAccountInfo[] = await EvmService.getSmartAccount([smartAccountParam]);
    const smartAccountAddress = result[0]?.smartAccountAddress;
    console.log('smartAccountAddress', smartAccountAddress);
    return smartAccountAddress;
  };

  signAndSendTransactionWithNative = async () => {
    const eoaAddress = await particleAuth.getAddress();
    const smartAccountAddress = await this.getSmartAccountAddress(eoaAddress);
    if (smartAccountAddress == undefined) {
      return;
    }
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      smartAccountAddress,
      receiver,
      BigNumber(amount)
    );
    const wholeFeeQuote = (await particleAA.rpcGetFeeQuotes(eoaAddress, [
      transaction,
    ])) as WholeFeeQuote;

    console.log('wholeFeeQuote', wholeFeeQuote);

    const feeQuote = wholeFeeQuote.verifyingPaymasterNative.feeQuote;
    const fee = BigNumber(feeQuote.fee);
    const balance = BigNumber(feeQuote.balance);

    console.log(`balance: ${balance}, fee: ${fee}`);

    if (balance.isLessThan(fee)) {
      console.log('native balance if not enough for gas fee');
      return;
    }

    const result = await particleAuth.signAndSendTransaction(
      transaction,
      AAFeeMode.native(wholeFeeQuote)
    );
    if (result.status) {
      const signature = result.data;
      console.log('signAndSendTransactionWithNative result', signature);
    } else {
      const error = result.data;
      console.log('signAndSendTransactionWithNative result', error);
    }
  };

  signAndSendTransactionWithGasless = async () => {
    const eoaAddress = await particleAuth.getAddress();
    const smartAccountAddress = await this.getSmartAccountAddress(eoaAddress);
    if (smartAccountAddress == undefined) {
      return;
    }

    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      smartAccountAddress,
      receiver,
      BigNumber(amount)
    );

    const wholeFeeQuote = (await particleAA.rpcGetFeeQuotes(eoaAddress, [
      transaction,
    ])) as WholeFeeQuote;

    const verifyingPaymasterGasless = wholeFeeQuote.verifyingPaymasterGasless;
    if (verifyingPaymasterGasless == undefined) {
      console.log('gasless is not available');
      return;
    }

    const result = await particleAuth.signAndSendTransaction(
      transaction,
      AAFeeMode.gasless(wholeFeeQuote)
    );
    if (result.status) {
      const signature = result.data;
      console.log('signAndSendTransactionWithGasless result', signature);
    } else {
      const error = result.data;
      console.log('signAndSendTransactionWithGasless result', error);
    }
  };

  signAndSendTransactionWithToken = async () => {
    const eoaAddress = await particleAuth.getAddress();
    const smartAccountAddress = await this.getSmartAccountAddress(eoaAddress);
    if (smartAccountAddress == undefined) {
      return;
    }

    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      smartAccountAddress,
      receiver,
      BigNumber(amount)
    );

    const wholeFeeQuote = (await particleAA.rpcGetFeeQuotes(eoaAddress, [
      transaction,
    ])) as WholeFeeQuote;
    console.log('wholeFeeQuote', wholeFeeQuote);

    const feeQuotes = wholeFeeQuote.tokenPaymaster.feeQuotes as any[];

    const validFeeQuotes = feeQuotes.filter((item) => {
      const fee = BigNumber(item.fee);
      const balance = BigNumber(item.balance);
      if (balance.isLessThan(fee)) {
        return false;
      } else {
        return true;
      }
    });

    if (validFeeQuotes.length == 0) {
      console.log('no valid token for gas fee');
      return;
    }

    const feeQuote = validFeeQuotes[0];

    const tokenPaymasterAddress = wholeFeeQuote.tokenPaymaster
      .tokenPaymasterAddress as string;

    const result = await particleAuth.signAndSendTransaction(
      transaction,
      AAFeeMode.token(feeQuote, tokenPaymasterAddress)
    );
    if (result.status) {
      const signature = result.data;
      console.log('signAndSendTransactionWithToken result', signature);
    } else {
      const error = result.data;
      console.log('signAndSendTransactionWithToken result', error);
    }
  };

  batchSendTransactions = async () => {
    const eoaAddress = await particleAuth.getAddress();
    const smartAccountAddress = await this.getSmartAccountAddress(eoaAddress);
    if (smartAccountAddress == undefined) {
      return;
    }

    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      smartAccountAddress,
      receiver,
      BigNumber(amount)
    );

    const transactions = [transaction, transaction];
    const wholeFeeQuote = (await particleAA.rpcGetFeeQuotes(
      eoaAddress,
      transactions
    )) as WholeFeeQuote;

    console.log('wholeFeeQuote', wholeFeeQuote);

    const feeQuote = wholeFeeQuote.verifyingPaymasterNative.feeQuote;
    const fee = BigNumber(feeQuote.fee);
    const balance = BigNumber(feeQuote.balance);

    if (balance.isLessThan(fee)) {
      console.log('native balance if not enough for gas fee');
      return;
    }

    const result = await particleAuth.batchSendTransactions(
      transactions,
      AAFeeMode.native(wholeFeeQuote)
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
    { key: 'batchSendTransactions', function: this.batchSendTransactions },
    {
      key: 'signAndSendTransactionWithNative',
      function: this.signAndSendTransactionWithNative,
    },
    {
      key: 'signAndSendTransactionWithGasless',
      function: this.signAndSendTransactionWithGasless,
    },
    {
      key: 'signAndSendTransactionWithToken',
      function: this.signAndSendTransactionWithToken,
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
