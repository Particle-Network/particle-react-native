import type { RouteProp } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import GUIDemo from './GUIDemo';

const logo = require('../images/ic_round.png');

type StackParamList = {
  Home: undefined;
  GUIDemo: undefined;
};

type HomeScreenRouteProp = RouteProp<StackParamList, 'Home'>;
type HomeScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'Home'
>;

export interface HomeScreenProps {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.logo} source={logo} />

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.push('GUIDemo')}
        >
          <Text style={styles.textStyle}>GUIDemo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

type GUIScreenRouteProp = RouteProp<StackParamList, 'GUIDemo'>;
type GUIScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'GUIDemo'
>;

export interface GUIScreenProps {
  route: GUIScreenRouteProp;
  navigation: GUIScreenNavigationProp;
}

const GUIScreen: React.FC<GUIScreenProps> = ({ route, navigation }) => {
  return (
    <View style={styles.container}>
      <GUIDemo navigation={navigation} route={route} />
    </View>
  );
};

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="GUIDemo" component={GUIScreen} />
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
    textAlign: 'center',
  },
});
