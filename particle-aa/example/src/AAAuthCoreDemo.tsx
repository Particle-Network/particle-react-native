import { EthereumSepolia } from '@particle-network/chains';
import {
  AAFeeMode,
  AccountName,
  Env,
  EvmService,
  LoginType,
  ParticleInfo,
  SupportAuthType,
  SmartAccountInfo, SocialLoginPrompt
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
import * as particleAuthCore from '@particle-network/rn-auth-core';
import Toast from 'react-native-toast-message';
import * as Helper from './Helper';
import { TestAccountEVM } from './TestAccount';
import { evm } from "@particle-network/rn-auth-core";
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import BigNumber from 'bignumber.js';

interface AAAuthCoreDemoProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}

export default class AAAuthCoreDemo extends PureComponent<AAAuthCoreDemoProps> {
  state = { currentLoadingBtn: '', currentOptions: [], currentKey: '' };
  accountName = AccountName.BICONOMY_V2();

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
    const chainInfo = EthereumSepolia;
    const env = Env.Production;

    particleAuth.init(chainInfo, env);
    particleAuthCore.init();

    // Optional, if you prefer to use particle paymaster, you don't need to pass biconomyApiKeys.
    // if you prefer to use biconomy paymaster, you should pass the right api keys.
    particleAA.init(this.accountName, /** biconomyApiKeys */);

    Toast.show({
      type: 'success',
      text1: 'Initialized successfully',
    });
  };

  setChainInfo = async () => {
    const chainInfo = EthereumSepolia;
    const result = await particleAuthCore.switchChain(chainInfo);
    Toast.show({
      type: result ? 'success' : 'error',
      text1: result
        ? 'Successfully set chain info'
        : 'Failed to set chain info',
    });
  };

  connect = async () => {
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
    const result = await particleAuthCore.connect(LoginType.Email, null, supportAuthType, SocialLoginPrompt.SelectAccount, {
      projectName: "React Native Example",
      description: "Welcome to login",
      imagePath: "https://connect.particle.network/icons/512.png"
    });
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
    const eoaAddress = await evm.getAddress();
    const smartAccountAddress = await this.getSmartAccountAddress(eoaAddress);
    if (smartAccountAddress == undefined) {
      return;
    }
    console.log('smartAccountAddress', smartAccountAddress);
    const receiver = TestAccountEVM.receiverAddress;
    const amount = TestAccountEVM.amount;
    const transaction = await Helper.getEthereumTransacion(
      smartAccountAddress,
      receiver,
      BigNumber(amount)
    );

    console.log('transaction', transaction);
    const result = await particleAA.rpcGetFeeQuotes(eoaAddress, [transaction]);

    Toast.show({
      type: 'success',
      text1: `${result}`,
    });
    console.log('rpcGetFeeQuotes result', result);
  };

  isDeploy = async () => {
    const eoaAddress = await evm.getAddress();
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
      name: this.accountName.name,
      version: this.accountName.version,
      ownerAddress: eoaAddress,
    };
    const result: SmartAccountInfo[] = await EvmService.getSmartAccount([smartAccountParam]);
    const smartAccountAddress = result[0]?.smartAccountAddress;
    Toast.show({
      type: 'success',
      text1: 'getSmartAccountAddress',
      text2: `${smartAccountAddress}`,
    });
    console.log('smartAccountAddress', smartAccountAddress);
    return smartAccountAddress;
  };

  signAndSendTransactionWithNative = async () => {
    const eoaAddress = await evm.getAddress();
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

    const result = await evm.sendTransaction(
      transaction,
      AAFeeMode.native(wholeFeeQuote)
    );
    if (result.status) {
      const signature = result.data;
      Toast.show({
        type: 'success',
        text1: 'signAndSendTransactionWithNative',
        text2: `${signature}`,
      });
      console.log('signAndSendTransactionWithNative result', signature);
    } else {
      const error = result.data as CommonError;
      Toast.show({
        type: 'error',
        text1: 'signAndSendTransactionWithNative',
        text2: `${error}`,
      });
      console.log('signAndSendTransactionWithNative result', error);
    }
  };

  signAndSendTransactionWithGasless = async () => {
    const eoaAddress = await evm.getAddress();
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

    const result = await evm.sendTransaction(
      transaction,
      AAFeeMode.gasless(wholeFeeQuote)
    );
    if (result.status) {
      const signature = result.data;
      Toast.show({
        type: 'success',
        text1: 'signAndSendTransactionWithGasless',
        text2: `${signature}`,
      });
      console.log('signAndSendTransactionWithGasless result', signature);
    } else {
      const error = result.data as CommonError;
      Toast.show({
        type: 'error',
        text1: 'signAndSendTransactionWithGasless',
        text2: `${error}`,
      });
      console.log('signAndSendTransactionWithGasless result', error);
    }
  };

  signAndSendTransactionWithToken = async () => {
    const eoaAddress = await evm.getAddress();
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

    const result = await evm.sendTransaction(
      transaction,
      AAFeeMode.token(feeQuote, tokenPaymasterAddress)
    );
    if (result.status) {
      const signature = result.data;
      Toast.show({
        type: 'success',
        text1: 'signAndSendTransactionWithToken',
        text2: `${signature}`,
      });
      console.log('signAndSendTransactionWithToken result', signature);
    } else {
      const error = result.data as CommonError;
      Toast.show({
        type: 'error',
        text1: 'signAndSendTransactionWithGasless',
        text2: `${error}`,
      });
      console.log('signAndSendTransactionWithToken result', error);
    }
  };

  batchSendTransactions = async () => {
    const eoaAddress = await evm.getAddress();
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

    const result = await evm.batchSendTransactions(
      transactions,
      AAFeeMode.native(wholeFeeQuote)
    );
    if (result.status) {
      const signature = result.data;
      Toast.show({
        type: 'success',
        text1: 'batchSendTransactions',
        text2: `${signature}`,
      });
      console.log('batchSendTransactions result', signature);
    } else {
      const error = result.data as CommonError;
      Toast.show({
        type: 'error',
        text1: 'batchSendTransactions',
        text2: `${error}`,
      });
      console.log('batchSendTransactions result', error);
    }
  };

  data = [
    { key: 'Init', function: this.init },
    { key: 'SetChainInfo', function: this.setChainInfo },
    { key: 'Connect', function: this.connect },
    { key: 'Enable', function: this.enable },
    { key: 'Disable', function: this.disable },
    { key: 'IsEnable', function: this.isEnable },
    { key: 'rpcGetFeeQuotes', function: this.rpcGetFeeQuotes },
    { key: 'isDeploy', function: this.isDeploy },
    { key: 'batchSendTransactions', function: this.batchSendTransactions },
    {
      key: 'signAndSendTransaction \nWithNative',
      function: this.signAndSendTransactionWithNative,
    },
    {
      key: 'signAndSendTransaction \nWithGasless',
      function: this.signAndSendTransactionWithGasless,
    },
    {
      key: 'signAndSendTransaction \nWithToken',
      function: this.signAndSendTransactionWithToken,
    },
  ];

  render = () => {
    return (
      <SafeAreaView>
        <View>
          <FlatList
            style={styles.flatListStyle}
            data={this.data}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={index >= this.data.length - 3 ? styles.biggerButtonStyle : styles.buttonStyle}
                onPress={async () => {
                  this.setState({ currentLoadingBtn: item.key });

                  await item.function();
                  this.setState({ currentLoadingBtn: '' });
                }}
              >
                {this.state.currentLoadingBtn === item.key ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.textStyle} numberOfLines={2} >{item.key}</Text>
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
  flatListStyle: {
    width: 300,
  },

  buttonStyle: {
    backgroundColor: 'rgba(78, 116, 289, 1)',
    borderRadius: 3,
    margin: 10,
    height: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  biggerButtonStyle: {
    backgroundColor: 'rgba(78, 116, 289, 1)',
    borderRadius: 3,
    margin: 10,
    height: 50,
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
    fontSize: 14,
  },
});
