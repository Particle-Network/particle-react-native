import { type ChainInfo, chains } from '@particle-network/chains';
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

import type { NavigationProp, RouteProp } from '@react-navigation/native';

interface SelectChainPageProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}

export default class SelectChainPage extends PureComponent<SelectChainPageProps> {
  render = () => {
    const data = chains.getAllChainInfos();

    return (
      <SafeAreaView>
        <View>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  this.selectedChain(item);
                }}
              >
                <Text style={styles.textStyle}>
                  {item.name + ' ' + item.network + ' ' + item.id}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    );
  };

  selectedChain = async (chainInfo: ChainInfo) => {
    const { navigation, route } = this.props;

    Toast.show({
      type: 'success',
      text1: `select chain ${chainInfo.name} ${chainInfo.network} ${chainInfo.id}`,
    });
    
    navigation.navigate('Home', {
      chainInfo: chainInfo,
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
