import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, DeviceEventEmitter, NativeEventEmitter } from 'react-native';
import { ChainInfo, WalletType } from "react-native-particle-connect"
import { Button } from '@rneui/themed';
import { EvmService } from './NetService/EvmService';
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

                            <Button
                                title={item.key}
                                onPress={ () => {
                                    this.selectedWalletType(item.value);
                                }} 
                                buttonStyle={styles.buttonStyle}
                                containerStyle={styles.containerStyle} />
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
    },
    containerStyle: {
        width: 300,
        marginHorizontal: 50,
        marginVertical: 10,
    }
});

