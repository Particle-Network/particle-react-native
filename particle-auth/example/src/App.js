import React, { PureComponent } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthDemo from './AuthDemo';
// import ConnectDemo from './Demo/ConnectDemo';
// import GUIDemo from './Demo/GUIDemo';
// import EvmRpcDemo from './Demo/EvmRpcDemo';
// import SolanaRpcDemo from './Demo/SolanaRpcDemo';
const logo = require('../images/ic_round.png');

function HomeScreen({ navigation }) {
  return (

    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.logo} source={logo} />

        <Button
          title={"AuthDemo"}
          onPress={
            () => navigation.push('AuthDemo')
          }
          buttonStyle={styles.buttonStyle}
          containerStyle={styles.containerStyle}
        />
       
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function AuthScreen() {
  return (
    <View style={styles.container}>
      <AuthDemo />
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='AuthDemo' component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>

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
  },

  containerStyle: {
    width: 200,
    marginHorizontal: 50,
    marginVertical: 10,
  }

});

