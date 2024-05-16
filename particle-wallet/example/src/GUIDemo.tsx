import { Ethereum, EthereumSepolia, PolygonAmoy } from '@particle-network/chains';
import * as particleAuth from '@particle-network/rn-auth';
import { Env, Language, WalletDisplay } from '@particle-network/rn-auth';
import * as particleConnect from '@particle-network/rn-connect';
import {
  AccountInfo,
  DappMetaData,
  WalletType,
} from '@particle-network/rn-connect';
import * as particleWallet from '@particle-network/rn-wallet';
import {
  BuyCryptoConfig,
  CommonError,
  OpenBuyNetwork,
} from '@particle-network/rn-wallet';
import React, { PureComponent } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import Toast from 'react-native-toast-message';
import { GUIScreenProps } from './App';
import { TestAccountEVM, TestAccountSolana } from './TestAccount';

export default class GUIDemo extends PureComponent<GUIScreenProps> {
  state = { currentLoadingBtn: '', currentOptions: [], currentKey: '' };
  modalSelect: ModalSelector<any> | null = null;

  init = async () => {
    const chainInfo = PolygonAmoy;
    const env = Env.Dev;
    const walletMetaData = {
      walletConnectProjectId: '75ac08814504606fc06126541ace9df6',
      name: 'Particle Connect',
      icon: 'https://connect.particle.network/icons/512.png',
      url: 'https://connect.particle.network',
      description: 'Particle Wallet',
    };
    const dappMetaData = new DappMetaData(
      '75ac08814504606fc06126541ace9df6',
      'Particle Connect',
      'https://connect.particle.network/icons/512.png',
      'https://connect.particle.network',
      'Particle Wallet',
      '',
      ''
    );
    particleConnect.init(chainInfo, env, dappMetaData);
    particleWallet.initWallet(walletMetaData);
    Toast.show({
      type: 'success',
      text1: 'Initialized successfully',
    });
  };

  setChainInfo = async () => {
    this.setState({
      currentOptions: [
        { label: 'Ethereum', key: 'Ethereum', value: Ethereum },
        {
          label: 'Ethereum Sepolia',
          key: 'Ethereum Sepolia',
          value: EthereumSepolia,
        },
        {
          label: 'Polygon Amy',
          key: 'Polygon Amy',
          value: PolygonAmoy,
        },
      ],
    });
    if (this.modalSelect) {
      this.modalSelect.open();
    }
  };

  loginParticle = async () => {
    // const result = await particleAuth.login();
    // console.log(result);
    const result = await particleConnect.connect(WalletType.Particle);

    if (result.status) {
      const accountInfo = result.data as AccountInfo;
      console.log('accountInfo', accountInfo.publicAddress);
      particleWallet.createSelectedWallet(
        accountInfo.publicAddress,
        WalletType.Particle,
        'Custom WalletName'
      );

      Toast.show({
        type: 'success',
        text1: 'Login successfully',
      });
    } else {
      const error = result.data as CommonError;

      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  // Wallet Service should use after connected a wallet, so add this method to help test wallet methods.
  // Before this, you'd better login metamask with our testAccount in TestAccount.js
  // TestAccount provides both evm and solana test account with some tokens.
  connectMetamask = async () => {
    const result = await particleConnect.connect(WalletType.MetaMask);

    const accountInfo = result.data as AccountInfo;
    console.log('accountInfo', accountInfo.publicAddress);
    particleWallet.createSelectedWallet(
      accountInfo.publicAddress,
      WalletType.MetaMask
    );
  };

  navigatorWallet = async () => {
    const display = WalletDisplay.Token;
    particleWallet.navigatorWallet(display);
  };

  navigatorTokenReceive = async () => {
    const tokenAddress = TestAccountSolana.tokenContractAddress;
    particleWallet.navigatorTokenReceive(tokenAddress);
  };

  navigatorTokenSend = async () => {
    const tokenAddress = TestAccountSolana.tokenContractAddress;
    const toAddress = TestAccountSolana.receiverAddress;
    const amount = '1000000000';
    particleWallet.navigatorTokenSend(tokenAddress, toAddress, amount);
  };

  navigatorTokenTransactionRecords = async () => {
    const tokenAddress = '0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904';
    particleWallet.navigatorTokenTransactionRecords(tokenAddress);
  };

  navigatorNFTSend = async () => {
    const mint = TestAccountEVM.nftContractAddress;
    const receiverAddress = TestAccountEVM.receiverAddress;
    const tokenId = TestAccountEVM.nftTokenId;
    const amount = '1';
    particleWallet.navigatorNFTSend(mint, tokenId, receiverAddress, amount);
  };

  navigatorNFTDetails = async () => {
    const mint = TestAccountEVM.nftContractAddress;
    const tokenId = TestAccountEVM.nftTokenId;
    particleWallet.navigatorNFTDetails(mint, tokenId);
  };

  navigatorBuyCrypto = async () => {
    // support no parameters
    // particleWallet.navigatorBuyCrypto();

    // also support pass public address, crypto symbol and so on.
    const config = new BuyCryptoConfig(
      '0xa0869E99886e1b6737A4364F2cf9Bb454FD637E4',
      'BNB',
      'USD',
      1000,
      OpenBuyNetwork.BinanceSmartChain
    );
    // these are other parameters, they are optional.
    config.fixFiatCoin = true;
    config.fixCryptoCoin = true;
    config.fixFiatAmt = true;
    config.theme = 'dark';
    config.language = Language.JA;
    particleWallet.navigatorBuyCrypto(config);
  };

  navigatorLoginList = async () => {
    const result = await particleWallet.navigatorLoginList();
    console.log('navigatorLoginList', result);
  };
  navigatorWalletConnect = async () => {
    const result = await particleWallet.navigatorWalletConnect();
    console.log('navigatorWalletConnect', result);
  };
  navigatorSwap = async () => {
    const fromTokenAddress = '';
    const toTokenAddress = '';
    const amount = '';
    particleWallet.navigatorSwap(fromTokenAddress, toTokenAddress, amount);
  };

  navigatorDappBrowser = async () => {
    particleWallet.navigatorDappBrowser("https://opensea.io");
  }

  setShowTestNetwork = async () => {
    const isShow = false;
    particleWallet.setShowTestNetwork(isShow);

    Toast.show({
      type: 'success',
      text1: 'Successfully set',
    });
  };

  setShowSmartAccountSetting = async () => {
    const isShow = false;
    particleWallet.setShowSmartAccountSetting(isShow);

    Toast.show({
      type: 'success',
      text1: 'Successfully set',
    });
  };

  setShowManageWallet = async () => {
    const isShow = false;
    particleWallet.setShowManageWallet(isShow);
    Toast.show({
      type: 'success',
      text1: 'Successfully set',
    });
  };

  setSupportChain = async () => {
    const chainInfos = [Ethereum, EthereumSepolia, PolygonAmoy];
    particleWallet.setSupportChain(chainInfos);
    Toast.show({
      type: 'success',
      text1: 'Successfully set',
    });
  };

  setPayDisabled = async () => {
    const disabled = true;
    particleWallet.setPayDisabled(disabled);
    Toast.show({
      type: 'success',
      text1: 'Successfully set',
    });
  };

  getPayDisabled = async () => {
    const result = await particleWallet.getPayDisabled();
    console.log(result);

    Toast.show({
      type: 'info',
      text1: 'Pay Disabled',
      text2: String(result),
    });
  };

  setSwapDisabled = async () => {
    const disabled = true;
    particleWallet.setSwapDisabled(disabled);
    Toast.show({
      type: 'success',
      text1: 'Successfully set',
    });
  };

  getSwapDisabled = async () => {
    const result = await particleWallet.getSwapDisabled();
    console.log(result);
    Toast.show({
      type: 'info',
      text1: 'Swap Disabled',
      text2: String(result),
    });
  };

  switchWallet = async () => {
    const walletTypeOptions: {
      label: string;
      key: string;
      value: string;
    }[] = [];
    for (var walletType in WalletType) {
      walletTypeOptions.push({
        label: walletType,
        key: walletType,
        value: walletType,
      });
    }
    this.setState({
      currentOptions: walletTypeOptions,
    });
    if (this.modalSelect) {
      this.modalSelect.open();
    }
  };

  setDisplayTokenAddresses = async () => {
    const tokenAddresses = ['', ''];
    particleWallet.setDisplayTokenAddresses(tokenAddresses);
  };

  setDisplayNFTContractAddresses = async () => {
    const nftContractAddresses = ['', ''];
    particleWallet.setDisplayNFTContractAddresses(nftContractAddresses);
  };

  setPriorityTokenAddresses = async () => {
    const tokenAddresses = ['0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904'];
    particleWallet.setPriorityTokenAddresses(tokenAddresses);
  };

  setPriorityNFTContractAddresses = async () => {
    const nftContractAddresses = ['', ''];
    particleWallet.setPriorityNFTContractAddresses(nftContractAddresses);
  };

  setShowLanguageSetting = async () => {
    particleWallet.setShowLanguageSetting(false);
  };

  setShowAppearanceSetting = async () => {
    particleWallet.setShowAppearanceSetting(false);
  };

  setSupportAddToken = async () => {
    particleWallet.setSupportAddToken(false);
  };

  setSupportWalletConnect = async () => {
    particleWallet.setSupportWalletConnect(false);
  };

  setSupportDappBrowserTrue = async () => {
    particleWallet.setSupportDappBrowser(true);
  };

  setSupportDappBrowserFalse = async () => {
    particleWallet.setSupportDappBrowser(false);
  };

  setCustomWalletName = async () => {
    particleWallet.setCustomWalletName('Playbux Wallet', "https://static.particle.network/wallet-icons/Rainbow.png")
  }

  setCustomLocalizable = async () => {
    if (Platform.OS === 'ios') {
      // use language code in type Language
      const localizables: any = {
        'en': {
          "network fee": "Service Fee",
          "particle auth wallet": "Playbux Wallet"
        },
      };

      console.log()

      particleWallet.setCustomLocalizable(localizables);
    }

  }





  handleModelSelect = async ({ value }: any) => {
    switch (this.state.currentKey) {
      case 'SetChainInfo':
        console.log(value);
        await particleAuth.setChainInfo(value);
        const chainIfo = await particleAuth.getChainInfo();
        console.log(chainIfo);
        Toast.show({
          type: 'success',
          text1: chainIfo.id + ' ' + chainIfo.name,
        });
        break;
      case 'SwitchWallet':
        const publicAddress = TestAccountEVM.publicAddress;
        const result = await particleWallet.switchWallet(value, publicAddress);
        Toast.show({
          type: result ? 'success' : 'error',
          text1: result ? 'Successfully switched' : 'Failed to switch',
        });
    }
  };

  data = [
    { key: 'Init', function: this.init },
    { key: 'SetChainInfo', function: this.setChainInfo },
    { key: 'LoginParticle', function: this.loginParticle },
    { key: 'ConnectMetamask', function: this.connectMetamask },
    { key: 'NavigatorWallet', function: this.navigatorWallet },
    { key: 'NavigatorTokenReceive', function: this.navigatorTokenReceive },
    { key: 'NavigatorTokenSend', function: this.navigatorTokenSend },
    {
      key: 'NavigatorTokenTransactionRecords',
      function: this.navigatorTokenTransactionRecords,
    },
    { key: 'NavigatorNFTSend', function: this.navigatorNFTSend },
    { key: 'NavigatorNFTDetails', function: this.navigatorNFTDetails },
    { key: 'NavigatorBuyCrypto', function: this.navigatorBuyCrypto },
    { key: 'NavigatorLoginList', function: this.navigatorLoginList },
    { key: 'NavigatorWalletConnect', function: this.navigatorWalletConnect },
    { key: 'NavigatorSwap', function: this.navigatorSwap },
    { key: 'NavigatorDappBrowser', function: this.navigatorDappBrowser },
    { key: 'SetShowTestNetwork', function: this.setShowTestNetwork },
    { key: 'SetShowManageWallet', function: this.setShowManageWallet },
    { key: 'SetSupportChain', function: this.setSupportChain },
    { key: 'SetPayDisabled', function: this.setPayDisabled },
    { key: 'GetPayDisabled', function: this.getPayDisabled },
    { key: 'SetSwapDisabled', function: this.setSwapDisabled },
    { key: 'GetSwapDisabled', function: this.getSwapDisabled },
    { key: 'SwitchWallet', function: this.switchWallet },
    {
      key: 'SetDisplayTokenAddresses',
      function: this.setDisplayTokenAddresses,
    },
    {
      key: 'SetDisplayNFTContractAddresses',
      function: this.setDisplayNFTContractAddresses,
    },
    {
      key: 'SetPriorityTokenAddresses',
      function: this.setPriorityTokenAddresses,
    },

    {
      key: 'SetShowSmartAccountSetting',
      function: this.setShowSmartAccountSetting,
    },
    {
      key: 'SetPriorityNFTContractAddresses',
      function: this.setPriorityNFTContractAddresses,
    },
    { key: 'SetShowLanguageSetting', function: this.setShowLanguageSetting },
    {
      key: 'SetShowAppearanceSetting',
      function: this.setShowAppearanceSetting,
    },
    { key: 'SetSupportAddToken', function: this.setSupportAddToken },
    { key: 'SetSupportWalletConnect', function: this.setSupportWalletConnect },
    {
      key: 'setSupportDappBrowserTrue',
      function: this.setSupportDappBrowserTrue,
    },
    {
      key: 'setSupportDappBrowserFalse',
      function: this.setSupportDappBrowserFalse,
    },
    {
      key: 'setCustomWalletName',
      function: this.setCustomWalletName,
    },
    {
      key: 'setCustomLocalizable',
      function: this.setCustomLocalizable,
    },
  ];

  render = () => {
    return (
      <SafeAreaView>
        <FlatList
          data={this.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                this.setState({
                  currentKey: item.key,
                });

                item.function();
              }}
            >
              <Text style={styles.textStyle}>{item.key}</Text>
            </TouchableOpacity>
          )}
        />
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
