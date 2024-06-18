import { ChainInfo, Ethereum } from '@particle-network/chains';
import type { RouteProp } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect, UIEventHandler } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import ConnectDemo from './ConnectDemo';
import SelectChainPage from './SelectChainPage';
import SelectWalletTypePage from './SelectWalletType';
import * as particleBase from "rn-base-beta";
import TopRightButton from './TopRightButton';
import AccountPage from './AccountPage';
import { AccountInfo } from '@particle-network/rn-connect';

type StackParamList = {
  Home: undefined;
  ConnectDemo: { chainInfo: ChainInfo };
  SelectChainPage: undefined;
  SelectWalletTypePage: undefined;
  AccounPage: undefined;
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

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {

  const [accounList, setAccounList] = useState<AccountInfo[]>([]);

  const handlePress = (name: string) => {
    navigation.navigate('AccountPage', { name });
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={accounList}
        keyExtractor={(item) => item.publicAddress + item.walletType}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePress(item.name)}
          >
            <Image style={styles.buttonImage} source={{ uri: item.icons.length > 0 ? item.icons[0] : "" }} />
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.bottomRightButton}
        onPress={() => {
          navigation.push('SelectWalletTypePage');
        }}
      >
        <Text style={styles.buttonText}>Connect</Text>
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

type AccountScreenRouteProp = RouteProp<StackParamList, 'AccountPage'>;
type AccountScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'AccountPage'
>;


interface AccountScreenProps {
  route: AccountScreenRouteProp;
  navigation: AccountScreenNavigationProp;
}

const AccountScreen: React.FC<AccountScreenProps> = ({
  route,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <AccountPage navigation={navigation} route={route} />
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

  const [buttonText, setButtonText] = useState(Ethereum.fullname);
  const [buttonImageUri, setButtonImageUri] = useState(Ethereum.icon);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerTitle: "",
              headerRight: () => (
                <TopRightButton
                  onPress={() => navigation.push('SelectChainPage')}
                  buttonImageUri={buttonImageUri}
                  buttonText={buttonText}
                />
              ),
              headerLeft: () => (
                <Text style={styles.headerLeftText}>Particle</Text>
              ),

            })} />
          <Stack.Screen name="ConnectDemo" component={ConnectScreen} />
          <Stack.Screen name="SelectChainPage" component={SelectChainScreen} />
          <Stack.Screen
            name="SelectWalletTypePage"
            component={SelectWalletScreen}
          />
          <Stack.Screen name="AccountPage" component={AccountScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  buttonStyle: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  textStyle: {
    color: '#fff',
    fontSize: 16,
  },
  topRightButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },

  bottomRightButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },

  buttonImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },


  headerLeftText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  item: {
    padding: 15,
    backgroundColor: '#f9c2ff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
  },
});
