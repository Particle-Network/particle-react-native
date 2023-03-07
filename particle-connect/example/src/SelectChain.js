import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, DeviceEventEmitter, NativeEventEmitter } from 'react-native';
import { ChainInfo } from "react-native-particle-connect"
import { Button } from '@rneui/themed';
import { EvmService } from './NetService/EvmService';
import { Toast } from 'react-native-toast-message/lib/src/Toast';


export default class SelectChainPage extends PureComponent {

    render = () => {

        const data = [
            { key: 'EthereumMainnet', value: ChainInfo.EthereumMainnet },
            { key: 'EthereumGoerli', value: ChainInfo.EthereumGoerli },
            { key: 'BSCMainnet', value: ChainInfo.BSCMainnet },
            { key: 'BSCTestnet', value: ChainInfo.BSCTestnet },
            { key: 'PolygonMainnet', value: ChainInfo.PolygonMainnet },
            { key: 'PolygonMumbai', value: ChainInfo.PolygonMumbai },
            // available chain is defined in ChainInfo.ts
            // you can add your network to test  
        ];

        return (
            <SafeAreaView>
                <View style={styles.contentView}>
                    <FlatList data={data} renderItem={
                        ({ item }) =>

                            <Button
                                title={item.key}
                                onPress={ () => {
                                    this.selectedChain(item.value);
                                }} 
                                buttonStyle={styles.buttonStyle}
                                containerStyle={styles.containerStyle} />
                    }
                    />
                </View>
            </SafeAreaView >
        );
    }

    selectedChain = async (chainInfo) => {
        const { navigation } = this.props;

        Toast.show({
            type: 'success',
            text1: `select chain ${chainInfo.chain_name} ${chainInfo.chain_id_name} ${chainInfo.chain_id}`
        })
        
        EvmService.currentChainInfo = chainInfo;
        
        navigation.navigate({
            name: 'ConnectDemo',
            params: { post: chainInfo},
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

