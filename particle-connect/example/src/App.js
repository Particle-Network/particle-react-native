import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnectDemo from './ConnectDemo';
import SelectChainPage from './SelectChain';
import Toast from 'react-native-toast-message';
import SelectWalletTypePage from './SelectWalletType';

const logo = require('../images/ic_round.png');

function HomeScreen({ navigation }) {
  return (

    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.logo} source={logo} />



        <TouchableOpacity style={styles.buttonStyle}
          onPress={() => navigation.push('ConnectDemo')}>
          <Text style={styles.textStyle}>ConnectDemo</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function ConnectScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      <ConnectDemo navigation={navigation} route={route} />
    </View>
  )
}


function SelectChainScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      <SelectChainPage navigation={navigation} route={route} />
    </View>
  )
}

function SelectWalletScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      <SelectWalletTypePage navigation={navigation} route={route} />
    </View>
  )
}


export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='ConnectDemo' component={ConnectScreen} />
          <Stack.Screen name='SelectChainPage' component={SelectChainScreen} />
          <Stack.Screen name='SelectWalletTypePage' component={SelectWalletScreen} />
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
    justifyContent: 'center',
  },

  content: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '60%',
    marginTop: -200
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

