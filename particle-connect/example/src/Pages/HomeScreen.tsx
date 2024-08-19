

import { Ethereum } from "@particle-network/chains";
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import TopRightButton from '../Views/TopRightButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { AccountInfo, WalletType, ConnectOption, EnableSocialProvider, EnableWallet, EnableWalletLabel } from "@particle-network/rn-connect";
import * as particleBase from "@particle-network/rn-base";
import * as particleConnect from "@particle-network/rn-connect";
import { base64Icon } from "../utils/Base64Image";
import Toast from "react-native-toast-message";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const [buttonText, setButtonText] = useState(Ethereum.fullname);
  const [buttonImageUri, setButtonImageUri] = useState(Ethereum.icon);
  const [accountInfos, setAccountInfos] = useState<AccountInfo[]>([]);

  const fetchAccounts = async () => {
    try {
      let connectedAccounts = await getConnectedAccounts();
      const chainInfo = await particleBase.getChainInfo()
      console.log('current chainInfo ', chainInfo.fullname);
      if (chainInfo.chainType == 'evm') {
        connectedAccounts = connectedAccounts.filter((account) => {
          return account.publicAddress.startsWith("0x")
        })
      } else {
        connectedAccounts = connectedAccounts.filter((account) => {
          return !account.publicAddress.startsWith("0x")
        })
      }
      setAccountInfos(connectedAccounts);
      console.log(`connectedAccounts ${JSON.stringify(connectedAccounts)}`)
    } catch (error) {
      console.error("Error fetching accounts: ", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [])
  );

  useEffect(() => {
    if (route.params?.chainInfo) {
      const { chainInfo } = route.params;
      setButtonText(chainInfo.fullname);
      setButtonImageUri(chainInfo.icon);
      fetchAccounts()
    }

    console.log(`useEffect route.params?.accountInfo`)
    if (route.params?.accountInfo) {
      fetchAccounts()
    }
  }, [route.params?.chainInfo, route.params?.accountInfo]);

  async function getConnectedAccounts(): Promise<AccountInfo[]> {
    const connectedAccounts: AccountInfo[] = [];

    const walletTypes = [
      WalletType.AuthCore,
      WalletType.MetaMask,
      WalletType.Trust,
      WalletType.Bitget,
      WalletType.Rainbow,
      WalletType.ImToken,
      WalletType.OKX,
      WalletType.WalletConnect
      // available walletType is defined in WalletType.ts
      // you can edit, add other wallet type to test
    ];

    try {
      for (const walletType of walletTypes) {
        console.log(`walletType ${walletType}`);
        const chainInfo = await particleBase.getChainInfo();
        const accounts = await particleConnect.getAccounts(walletType as WalletType);
        console.log("getConnectedAccounts: ", accounts);
        if (chainInfo.chainType === "evm") {
          const evmAccounts = accounts.filter(account => account.publicAddress.startsWith("0x"));
          connectedAccounts.push(...evmAccounts);
        } else {
          const solanaAccounts = accounts.filter(account => !account.publicAddress.startsWith("0x"));
          connectedAccounts.push(...solanaAccounts);
        }
      }
    } catch (error) {
      console.error("getConnectedAccounts: ", error);
    }

    return connectedAccounts;
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TopRightButton
          onPress={() => navigation.navigate('SelectChainPage')}
          buttonImageUri={buttonImageUri}
          buttonText={buttonText}
        />
      ),
    });
  }, [navigation, buttonImageUri, buttonText]);

  const selectAccount = (accountInfo: AccountInfo) => {
    navigation.navigate('ConnectedWalletPage', {
      accountInfo: accountInfo,
    });
  };

  const connectWithConnectKit = async () => {
    // explore https://demo.particle.network to customize login interface.
    const config = {
      //  You can control the array elements and adjust the UI order
      connectOptions: [ConnectOption.Email, ConnectOption.Phone, ConnectOption.Social, ConnectOption.Wallet],
      //  You can control the array elements and adjust the UI order
      socialProviders: [EnableSocialProvider.Google, EnableSocialProvider.Apple, EnableSocialProvider.Twitter, EnableSocialProvider.Discord, EnableSocialProvider.Github],
      //  You can control the array elements and adjust the UI order
      walletProviders: [{ enableWallet: EnableWallet.MetaMask, label: EnableWalletLabel.Recommended },
      { enableWallet: EnableWallet.OKX, label: EnableWalletLabel.Popular },
      { enableWallet: EnableWallet.Trust, label: EnableWalletLabel.None },
      { enableWallet: EnableWallet.Bitget, label: EnableWalletLabel.None }
      ],

      additionalLayoutOptions: {
        isCollapseWalletList: false,
        isSplitEmailAndSocial: true,
        isSplitEmailAndPhone: false,
        isHideContinueButton: false,
      },
      logo: base64Icon // base64 string or url
    };

    try {
      const accountInfo = await particleConnect.connectWithConnectKitConfig(config);
      console.log(`accountInfo ${accountInfo}`);
      Toast.show({
        type: 'success',
        text1: 'Successfully get accounts',
      });
      fetchAccounts();
    } catch (e) {
      const error = e as particleBase.CommonError;
      console.log(error);
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  }

  const getImageSource = (accountInfo: AccountInfo) => {
    if (accountInfo.icons.length > 0) {
      return { uri: accountInfo.icons[0] };
    } else {
      const walletTypeToImageMap: Partial<Record<WalletType, any>> = {
        [WalletType.AuthCore]: require('../../images/AuthCore.png'),
        [WalletType.OKX]: require('../../images/OKX.png'),
        [WalletType.MetaMask]: require('../../images/MetaMask.png'),
        [WalletType.Trust]: require('../../images/Trust.png'),
        [WalletType.ImToken]: require('../../images/ImToken.png'),
        [WalletType.Phantom]: require('../../images/Phantom.png'),
        [WalletType.WalletConnect]: require('../../images/WalletConnect.png'),
        [WalletType.Bitget]: require('../../images/Bitget.png'),
      };
      if (accountInfo.walletType && walletTypeToImageMap[accountInfo.walletType]) {
        return walletTypeToImageMap[accountInfo.walletType];
      } else {
        return { uri: "" };
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={accountInfos}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => selectAccount(item)}
          >
            <View style={styles.rowContainer}>
              <Image source={getImageSource(item)} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={[styles.textStyle, styles.textMargin]}>
                  {item.walletType}
                </Text>
                <Text style={styles.addressTextStyle}>
                  {item.publicAddress}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContent}
      />

      <TouchableOpacity style={styles.connectKitButton} onPress={() =>
        connectWithConnectKit()
      }>
        <Text style={styles.connectButtonText}>ConnectWithConnectKit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.connectButton} onPress={() => navigation.navigate('SelectWalletPage')}>
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  image: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  connectKitButton: {
    position: 'absolute',
    right: 20,
    bottom: 150,
    backgroundColor: '#9933ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  connectButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: '#9933ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 5,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonStyle: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 14,
    margin: 10,
    height: 60,
    width: 340,
    justifyContent: 'center',
  },
  textStyle: {
    color: 'black',
    textAlign: 'left',
  },
  addressTextStyle: {
    color: 'black',
    textAlign: 'left',
    fontSize: 9
  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textMargin: {
    marginBottom: 5,
  },
});
