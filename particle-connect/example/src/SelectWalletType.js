import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, TouchableOpacity, Text } from 'react-native';
import { WalletType } from "react-native-particle-connect"
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { PNAccount } from './Models/PNAccount';


export default class SelectWalletTypePage extends PureComponent {

    render = () => {

        const data = [
            { key: 'Particle', value: WalletType.Particle },
            { key: 'MetaMask', value: WalletType.MetaMask },
            { key: 'Trust', value: WalletType.Trust },
            { key: 'BitKeep', value: WalletType.BitKeep },
            { key: 'Rainbow', value: WalletType.Rainbow },
            { key: 'Imtoken', value: WalletType.ImToken },
            { key: 'EvmPrivateKey', value: WalletType.EvmPrivateKey },
            { key: 'SoalnaPrivateKey', value: WalletType.SolanaPrivateKey },
            // available walletType is defined in WalletType.ts
            // you can edit, add other wallet type to test  
        ];

        return (
            <SafeAreaView>
                <View style={styles.contentView}>
                    <FlatList data={data} renderItem={
                        ({ item }) =>

                        <TouchableOpacity style={styles.buttonStyle}
                        onPress={() => {
                            this.selectedWalletType(item.value);
                        }}>
                        <Text style={styles.textStyle}>{item.key}</Text>
                    </TouchableOpacity>
                    }
                    />
                </View>
            </SafeAreaView >
        );
    }

    selectedWalletType = async (walletType) => {
        const { navigation } = this.props;
        PNAccount.walletType = walletType;
        Toast.show({
            type: 'success',
            text1: `select wallet type ${walletType}`
        })
        
        navigation.navigate({
            name: 'ConnectDemo',
            params: { post: walletType},
            merge: true,
        })
       
    }
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
        textAlign: 'center'
    }
});

