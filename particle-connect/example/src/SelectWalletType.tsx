import { WalletType } from '@particle-network/rn-connect';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
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
import { PNAccount } from './Models/PNAccount';
import * as particleConnect from '@particle-network/rn-connect';

interface SelectWalletTypePageProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}

export default class SelectWalletTypePage extends PureComponent<SelectWalletTypePageProps> {
  render = () => {
    const data = [
      { key: 'ParticleAuthCore', value: WalletType.AuthCore },
      { key: 'MetaMask', value: WalletType.MetaMask },
      { key: 'Trust', value: WalletType.Trust },
      { key: 'BitKeep', value: WalletType.BitKeep },
      { key: 'Rainbow', value: WalletType.Rainbow },
      { key: 'Imtoken', value: WalletType.ImToken },
      { key: 'EvmPrivateKey', value: WalletType.EvmPrivateKey },
      { key: 'SoalnaPrivateKey', value: WalletType.SolanaPrivateKey },
      { key: 'WalletConnect', value: WalletType.WalletConnect },
      // available walletType is defined in WalletType.ts
      // you can edit, add other wallet type to test
    ];

    return (
      <SafeAreaView>
        <View>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  this.selectedWalletType(item.value);
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

  selectedWalletType = async (walletType: WalletType) => {
    const { navigation } = this.props;
    const accountInfo = await particleConnect.connect(walletType);
    accountInfo.walletType = walletType;
    
    Toast.show({
      type: 'success',
      text1: `select wallet type ${walletType}`,
    });

    navigation.navigate({
      name: 'Home',
      params: { accountInfo: accountInfo },
      merge: true,
    });
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
