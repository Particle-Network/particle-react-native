import type { RouteProp } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import AAAuthDemo from './AAAuthDemo';
import AAConnectDemo from './AAConnectDemo';
import AAAuthCoreDemo from './AAAuthCoreDemo';
const logo = require('../images/ic_round.png');

type StackParamList = {
  Home: undefined;
  AAAuthDemo: undefined;
  AAConnectDemo: undefined;
  AAAuthCoreDemo: undefined;
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
        onPress={() => navigation.push('AAAuthDemo')}
      >
        <Text style={styles.textStyle}>AAAuthDemo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => navigation.push('AAConnectDemo')}
      >
        <Text style={styles.textStyle}>AAConnectDemo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => navigation.push('AAAuthCoreDemo')}
      >
        <Text style={styles.textStyle}>AAAuthCoreDemo</Text>
      </TouchableOpacity>
    </View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

type AAAuthScreenRouteProp = RouteProp<StackParamList, 'AAAuthDemo'>;
type AAAuthScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'AAAuthDemo'
>;

interface AAAuthScreenProps {
  route: AAAuthScreenRouteProp;
  navigation: AAAuthScreenNavigationProp;
}

const AAAuthScreen: React.FC<AAAuthScreenProps> = ({ route, navigation }) => {
  return (
    <View style={styles.container}>
      <AAAuthDemo navigation={navigation} route={route} />
    </View>
  );
};

type AAConnectScreenRouteProp = RouteProp<StackParamList, 'AAConnectDemo'>;
type AAConnectScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'AAConnectDemo'
>;

interface AAConnectScreenProps {
  route: AAConnectScreenRouteProp;
  navigation: AAConnectScreenNavigationProp;
}

const AAConnectScreen: React.FC<AAConnectScreenProps> = ({
  route,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <AAConnectDemo navigation={navigation} route={route} />
    </View>
  );
};

type AAAuthCoreScreenRouteProp = RouteProp<StackParamList, 'AAAuthCoreDemo'>;
type AAAuthCoreScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'AAAuthCoreDemo'
>;

interface AAAuthCoreScreenProps {
  route: AAAuthCoreScreenRouteProp;
  navigation: AAAuthCoreScreenNavigationProp;
}

const AAAuthCoreScreen: React.FC<AAAuthCoreScreenProps> = ({ route, navigation }) => {
  return (
    <View style={styles.container}>
      <AAAuthCoreDemo navigation={navigation} route={route} />
    </View>
  );
};

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AAAuthDemo" component={AAAuthScreen} />
          <Stack.Screen name="AAConnectDemo" component={AAConnectScreen} />
          <Stack.Screen name="AAAuthCoreDemo" component={AAAuthCoreScreen} />
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
