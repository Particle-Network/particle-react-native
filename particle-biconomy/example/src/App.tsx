import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BiconomyAuthDemo from './BiconomyAuthDemo';
import BiconomyConnectDemo from './BiconomyConnectDemo';
import Toast from 'react-native-toast-message';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const logo = require('../images/ic_round.png');

type StackParamList = {
  Home: undefined;
  BiconomyAuthDemo: undefined;
  BiconomyConnectDemo: undefined;
};

type HomeScreenRouteProp = RouteProp<StackParamList, 'Home'>;
type HomeScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Home'>;

interface HomeScreenProps {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
      <View style={styles.container}>
          <Image style={styles.logo} source={logo} />

          <TouchableOpacity style={styles.buttonStyle}
          onPress={() => navigation.push('BiconomyAuthDemo')}>
          <Text style={styles.textStyle}>BiconomyAuthDemo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle}
          onPress={() => navigation.push('BiconomyConnectDemo')}>
          <Text style={styles.textStyle}>BiconomyConnectDemo</Text>
        </TouchableOpacity>

      </View>
  );
};


const Stack = createNativeStackNavigator<StackParamList>();

type BiconomyAuthScreenRouteProp = RouteProp<StackParamList, 'BiconomyAuthDemo'>;
type BiconomyAuthScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'BiconomyAuthDemo'>;

interface BiconomyAuthScreenProps {
    route: BiconomyAuthScreenRouteProp;
    navigation: BiconomyAuthScreenNavigationProp;
}

const BiconomyAuthScreen: React.FC<BiconomyAuthScreenProps> = ({ route, navigation }) => {
    return (
        <View style={styles.container}>
            <BiconomyAuthDemo navigation={navigation} route={route} />
        </View>
    );
};

type BiconomyConnectScreenRouteProp = RouteProp<StackParamList, 'BiconomyConnectDemo'>;
type BiconomyConnectScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'BiconomyConnectDemo'>;

interface BiconomyConnectScreenProps {
    route: BiconomyConnectScreenRouteProp;
    navigation: BiconomyConnectScreenNavigationProp;
}

const BiconomyConnectScreen: React.FC<BiconomyConnectScreenProps> = ({ route, navigation }) => {
    return (
        <View style={styles.container}>
            <BiconomyConnectDemo navigation={navigation} route={route} />
        </View>
    );
};


export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="BiconomyAuthDemo" component={BiconomyAuthScreen} />
          <Stack.Screen name="BiconomyConnectDemo" component={BiconomyConnectScreen} />
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
    textAlign: 'center'
  }
});
