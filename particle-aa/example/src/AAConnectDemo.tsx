import {
  Ethereum,
  Polygon,
  EthereumSepolia,
} from '@particle-network/chains';
import * as particleAA from '@particle-network/rn-aa';
import { CommonError, WholeFeeQuote } from '@particle-network/rn-aa';
import * as particleBase from 'rn-base-beta';
// import * as particleConnect from '@particle-network/rn-connect';
import * as particleConnect from 'rn-connect-beta';
// import {
//   AccountInfo,
//   WalletType,
// } from '@particle-network/rn-connect';
import {
  WalletType,
} from 'rn-connect-beta';
// import {
//   Env,
//   ParticleInfo,
//   AccountName,
//   EvmService,
//   AAFeeMode,
//   SmartAccountInfo
// } from '@particle-network/rn-auth';
import {
  Env,
  ParticleInfo,
  AccountName,
  EvmService,
  AAFeeMode,
  SmartAccountInfo
} from 'rn-base-beta';
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
import Toast from 'react-native-toast-message';
import * as Helper from './Helper';
import { TestAccountEVM } from './TestAccount';

interface AAConnectDemoProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}

export default class AAConnectDemo extends PureComponent<AAConnectDemoProps> {
  state = { currentLoadingBtn: '', currentOptions: [], currentKey: '' };
  publicAddress = '0x498c9b8379E2e16953a7b1FF94ea11893d09A3Ed';

  walletType = WalletType.MetaMask;

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

    particleBase.init(chainInfo, env);

    const metadata = {
      walletConnectProjectId: '75ac08814504606fc06126541ace9df6',
      url: 'https://connect.particle.network',
      icon: 'https://connect.particle.network/icons/512.png',
      name: 'Particle Connect',
      description: 'Particle Wallet'
    }

    // the rpcUrl works for WalletType EvmPrivateKey and SolanaPrivakey
    // we have default rpc url in native SDK
    const rpcUrl = { evm_url: null, solana_url: null };

    // should init particle connect first
    particleConnect.init(chainInfo, env, metadata, rpcUrl);

    // then set wallet connect project id
    let chainInfos = [Ethereum, Polygon, EthereumSepolia];
    // Note, metamask doesn't support more than one chain info when connect.
    // here we test with metamask, so we set only one chainInfo
    chainInfos = [EthereumSepolia];
    // set support wallet connect chain list
    particleConnect.setWalletConnectV2SupportChainInfos(chainInfos);

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
    const result = await particleBase.setChainInfo(chainInfo);
    console.log(result);

    Toast.show({
      type: result ? 'success' : 'error',
      text1: result
        ? 'Successfully set chain info'
        : 'Failed to set chain info',
    });
  };

  loginMetamask = async () => {
    try {
      const account = await particleConnect.connect(this.walletType);
      this.publicAddress = account.publicAddress;
      console.log(this.publicAddress);
    } catch (e) {
      const error = e as CommonError;
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
    const smartAccountAddress = await this.getSmartAccountAddress(eoaAddress);
    if (smartAccountAddress == undefined) {
      return;
    }

    console.log('eoaAddress', eoaAddress);
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
      text1: JSON.stringify(result),
    });
    console.log('rpcGetFeeQuotes result', result);
  };

  getSmartAccountAddress = async (eoaAddress: string) => {
    const smartAccountParam = {
      name: this.accountName.name,
      version: this.accountName.version,
      ownerAddress: eoaAddress,
    };
    const result: SmartAccountInfo[] = await EvmService.getSmartAccount([smartAccountParam]);
    const smartAccountAddress = result[0]?.smartAccountAddress;
    console.log('smartAccountAddress', smartAccountAddress);
    return smartAccountAddress;
  }

  isDeploy = async () => {
    try {
      const eoaAddress = this.publicAddress;
      const isDeploy = await particleAA.isDeploy(eoaAddress);
      console.log('isDeploy result', isDeploy);
      Toast.show({
        type: 'info',
        text1: 'Is Deploy',
        text2: String(isDeploy),
      });
    } catch (e) {
      const error = e as CommonError;
      console.log('isDeploy result', error);

      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }

  };

  signAndSendTransactionWithNative = async () => {
    try {


      const eoaAddress = this.publicAddress;
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

      const wholeFeeQuote = await particleAA.rpcGetFeeQuotes(eoaAddress, [
        transaction,
      ]) as WholeFeeQuote;

      console.log('wholeFeeQuote', wholeFeeQuote);

      const feeQuote = wholeFeeQuote.verifyingPaymasterNative['feeQuote'];
      const fee = BigNumber(feeQuote['fee']);
      const balance = BigNumber(feeQuote['balance']);

      console.log(`balance: ${balance}, fee: ${fee}`);

      if (balance.isLessThan(fee)) {
        console.log("native balance if not enough for gas fee");
        return;
      }

      const txHash = await particleConnect.signAndSendTransaction(
        this.walletType,
        this.publicAddress,
        transaction,
        AAFeeMode.native(wholeFeeQuote)
      );

      Toast.show({
        type: 'success',
        text1: 'signAndSendTransactionWithNative',
        text2: txHash,
      });
      console.log('signAndSendTransactionWithNative result', txHash);
    } catch (e) {
      const error = e as CommonError;
      Toast.show({
        type: 'error',
        text1: 'signAndSendTransactionWithNative',
        text2: `${error}`,
      });
      console.log('signAndSendTransactionWithNative result', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  signAndSendTransactionWithGasless = async () => {
    try {


      const eoaAddress = this.publicAddress;
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
      const wholeFeeQuote = await particleAA.rpcGetFeeQuotes(eoaAddress, [
        transaction,
      ]) as WholeFeeQuote;

      const verifyingPaymasterGasless = wholeFeeQuote.verifyingPaymasterGasless;
      if (verifyingPaymasterGasless == undefined) {
        console.log("gasless is not available");
        return;
      }

      const txHash = await particleConnect.signAndSendTransaction(
        this.walletType,
        this.publicAddress,
        transaction,
        AAFeeMode.gasless(wholeFeeQuote)
      );

      Toast.show({
        type: 'success',
        text1: 'signAndSendTransactionWithGasless',
        text2: txHash,
      });
      console.log('signAndSendTransactionWithGasless result', txHash);

    } catch (e) {
      const error = e as CommonError;
      Toast.show({
        type: 'error',
        text1: 'signAndSendTransactionWithGasless',
        text2: `${error}`,
      });
      console.log('signAndSendTransactionWithGasless result', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  signAndSendTransactionWithToken = async () => {
    try {


      const eoaAddress = this.publicAddress;
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

      const wholeFeeQuote = await particleAA.rpcGetFeeQuotes(eoaAddress, [
        transaction,
      ]) as WholeFeeQuote;
      console.log('wholeFeeQuote', wholeFeeQuote);

      const feeQuotes = wholeFeeQuote.tokenPaymaster['feeQuotes'] as any[];

      const validFeeQuotes = feeQuotes.filter(item => {
        const fee = BigNumber(item['fee']);
        const balance = BigNumber(item['balance']);
        if (balance.isLessThan(fee)) {
          return false;
        } else {
          return true;
        }
      });


      if (validFeeQuotes.length == 0) {
        console.log("no valid token for gas fee");
        return;
      }

      const feeQuote = validFeeQuotes[0];

      const tokenPaymasterAddress =
        wholeFeeQuote.tokenPaymaster["tokenPaymasterAddress"] as string;

      console.log(`feeQuote: ${JSON.stringify(feeQuote)}`);
      console.log(`tokenPaymasterAddress: ${tokenPaymasterAddress}`);
      const txHash = await particleConnect.signAndSendTransaction(
        this.walletType,
        this.publicAddress,
        transaction,
        AAFeeMode.token(feeQuote, tokenPaymasterAddress)
      );
      Toast.show({
        type: 'success',
        text1: 'signAndSendTransactionWithGasless',
        text2: txHash
      });
      console.log('signAndSendTransactionWithToken result', txHash);

    } catch (e) {
      const error = e as CommonError;
      Toast.show({
        type: 'error',
        text1: 'signAndSendTransactionWithToken',
        text2: `${error}`,
      });
      console.log(' result', error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  batchSendTransactions = async () => {
    try {


      const eoaAddress = this.publicAddress;
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

      const wholeFeeQuote = await particleAA.rpcGetFeeQuotes(
        eoaAddress,
        transactions
      ) as WholeFeeQuote;

      console.log('wholeFeeQuote', wholeFeeQuote);

      const feeQuote = wholeFeeQuote.verifyingPaymasterNative['feeQuote'];
      const fee = BigNumber(feeQuote['fee']);
      const balance = BigNumber(feeQuote['balance']);

      if (balance.isLessThan(fee)) {
        console.log("native balance if not enough for gas fee");
        return;
      }

      const txHash = await particleConnect.batchSendTransactions(
        this.walletType,
        this.publicAddress,
        transactions,
        AAFeeMode.native(wholeFeeQuote)
      );
      Toast.show({
        type: 'success',
        text1: 'batchSendTransactions',
        text2: txHash,
      });
      console.log('batchSendTransactions result', txHash);

    } catch (e) {
      const error = e as CommonError;
      Toast.show({
        type: 'error',
        text1: 'batchSendTransactions',
        text2: `${error}`,
      });
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
