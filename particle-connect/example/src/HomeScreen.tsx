

import { Ethereum } from "@particle-network/chains";
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopRightButton from './TopRightButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { AccountInfo, WalletType } from "@particle-network/rn-connect";
import * as particleBase from "rn-base-beta";
import * as particleConnect from "@particle-network/rn-connect";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const [buttonText, setButtonText] = useState(Ethereum.fullname);
  const [buttonImageUri, setButtonImageUri] = useState(Ethereum.icon);
  const [accountInfos, setAccountInfos] = useState<AccountInfo[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const connectedAccounts = await getConnectedAccounts();
        setAccountInfos(connectedAccounts);
        console.log(`connectedAccounts ${connectedAccounts}`);
      } catch (error) {
        console.error("Error fetching accounts: ", error);
      }
    };

    fetchAccounts(); // 仅在组件挂载时调用一次
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const connectedAccounts = await getConnectedAccounts();
        setAccountInfos(connectedAccounts);
        console.log(`connectedAccounts ${connectedAccounts}`)
      } catch (error) {
        console.error("Error fetching accounts: ", error);
      }
    };

    if (route.params?.chainInfo) {
      const { chainInfo } = route.params;
      setButtonText(chainInfo.fullname);
      setButtonImageUri(chainInfo.icon);
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
      WalletType.BitKeep,
      WalletType.Rainbow,
      WalletType.ImToken,
      WalletType.EvmPrivateKey,
      WalletType.SolanaPrivateKey,
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
    // navigation.navigate('Home', {
    //     chainInfo: chainInfo,
    // });
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
            <Image source={{ uri: item.icons.length > 0 ? item.icons[0] : undefined }} style={styles.image} />
              <Text style={styles.textStyle}>
                {item.walletType}
              </Text>
              <Text style={styles.textStyle}>
                {item.publicAddress}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContent}
      />

      <TouchableOpacity style={styles.connectButton} onPress={() => navigation.navigate('SelectWalletPage')}>
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
    </View>
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
    width: 20,
    height: 20,
    marginRight: 5,
  },
  connectButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  flatListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
