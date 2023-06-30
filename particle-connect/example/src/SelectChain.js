import React, { PureComponent } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, TouchableOpacity, Text } from 'react-native';
import { ChainInfo } from "react-native-particle-auth"
import { Toast } from 'react-native-toast-message/lib/src/Toast';


export default class SelectChainPage extends PureComponent {

    render = () => {
        const data = Object.values(ChainInfo).map((chainInfo) => {

            return { key: chainInfo.chain_name + chainInfo.chain_id_name, value: chainInfo };

        });
        
        return (
            <SafeAreaView>
                <View style={styles.contentView}>
                    <FlatList data={data} renderItem={
                        ({ item }) =>

                            <TouchableOpacity style={styles.buttonStyle}
                                onPress={() => {
                                    this.selectedChain(item.value);
                                }}>
                                <Text style={styles.textStyle}>{item.key}</Text>
                            </TouchableOpacity>

                    }
                    />
                </View>
            </SafeAreaView >
        );
    }


    selectedChain = async (chainInfo) => {
        const { navigation, route } = this.props;

        Toast.show({
            type: 'success',
            text1: `select chain ${chainInfo.chain_name} ${chainInfo.chain_id_name} ${chainInfo.chain_id}`,
        });

        navigation.navigate({
            name: 'ConnectDemo',
            params: { chainInfo: chainInfo },
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
        textAlign: 'center'
    }
});

