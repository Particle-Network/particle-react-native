import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BiconomyAuthDemo from './BiconomyAuthDemo';
import BiconomyConnectDemo from './BiconomyConnectDemo';
import Toast from 'react-native-toast-message';

const logo = require('../images/ic_round.png');

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.logo} source={logo} />

        <TouchableOpacity style={styles.buttonStyle}
          onPress={() => navigation.push('BiconomyAuthDemo')}>
          <Text style={styles.textStyle}>BiconomyAuthDemo</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function BiconomyAuthScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <BiconomyAuthDemo navigation={navigation} />
    </View>
  );
}

function BiconomyConnectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <BiconomyConnectDemo navigation={navigation} />
    </View>
  );
}

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
    justifyContent: 'center',
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
