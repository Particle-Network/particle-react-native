import { ChainInfo, PolygonMumbai } from '@particle-network/chains';
import type { RouteProp } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import ConnectDemo from './ConnectDemo';
import SelectChainPage from './SelectChain';
import SelectWalletTypePage from './SelectWalletType';

const logo = require('../images/ic_round.png');

type StackParamList = {
  Home: undefined;
  ConnectDemo: { chainInfo: ChainInfo };
  SelectChainPage: undefined;
  SelectWalletTypePage: undefined;
};

type HomeScreenRouteProp = RouteProp<StackParamList, 'Home'>;
type HomeScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Home'
>;

interface HomeScreenProps {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() =>
          navigation.push('ConnectDemo', { chainInfo: PolygonMumbai })
        }
      >
        <Text style={styles.textStyle}>ConnectDemo</Text>
      </TouchableOpacity>
    </View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

type ConnectScreenRouteProp = RouteProp<StackParamList, 'ConnectDemo'>;
type ConnectScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'ConnectDemo'
>;

export interface ConnectScreenProps {
  route: ConnectScreenRouteProp;
  navigation: ConnectScreenNavigationProp;
}

const ConnectScreen: React.FC<ConnectScreenProps> = ({ route, navigation }) => {
  return (
    <View style={styles.container}>
      <ConnectDemo navigation={navigation} route={route} />
    </View>
  );
};

type SelectChainScreenRouteProp = RouteProp<StackParamList, 'SelectChainPage'>;
type SelectChainScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SelectChainPage'
>;

interface SelectChainScreenProps {
  route: SelectChainScreenRouteProp;
  navigation: SelectChainScreenNavigationProp;
}

const SelectChainScreen: React.FC<SelectChainScreenProps> = ({
  route,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <SelectChainPage navigation={navigation} route={route} />
    </View>
  );
};

type SelectWalletScreenRouteProp = RouteProp<
  StackParamList,
  'SelectWalletTypePage'
>;
type SelectWalletScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SelectWalletTypePage'
>;

interface SelectWalletScreenProps {
  route: SelectWalletScreenRouteProp;
  navigation: SelectWalletScreenNavigationProp;
}

const SelectWalletScreen: React.FC<SelectWalletScreenProps> = ({
  route,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <SelectWalletTypePage navigation={navigation} route={route} />
    </View>
  );
};

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ConnectDemo" component={ConnectScreen} />
          <Stack.Screen name="SelectChainPage" component={SelectChainScreen} />
          <Stack.Screen
            name="SelectWalletTypePage"
            component={SelectWalletScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  content: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '60%',
    marginTop: -200,
  },

  logo: {
    width: 100,
    height: 100,
    marginTop: 0,
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
});
