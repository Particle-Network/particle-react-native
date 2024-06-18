import React from 'react';
import { Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { type ChainInfo, chains } from '@particle-network/chains';
import Toast from 'react-native-toast-message';
import { WalletType } from '@particle-network/rn-connect';
import * as particleConnect from '@particle-network/rn-connect';

type SelectWalletScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectWalletPage'>;
type SelectWalletScreenRouteProp = RouteProp<RootStackParamList, 'SelectWalletPage'>;

export default function SelectWalletScreen() {
    const navigation = useNavigation<SelectWalletScreenNavigationProp>();
    const route = useRoute<SelectWalletScreenRouteProp>();

    const selectChain = async (walletType: WalletType) => {
        let accountInfo = await particleConnect.connect(walletType);
        accountInfo.walletType = walletType;
        navigation.navigate('Home', {
            accountInfo: accountInfo,
        });
    };

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
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => selectChain(item.value)}
                    >
                        <Text style={styles.textStyle}>
                            {item.key}
                        </Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.flatListContent}
            />
        </SafeAreaView>
    );
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
    flatListContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
