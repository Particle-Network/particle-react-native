import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet } from 'react-native';
import HomeScreen from './HomeScreen';
// import ConnectScreen from './ConnectScreen';
import SelectChainScreen from './SelectChainScreen';
// import SelectWalletScreen from './SelectWalletScreen';
// import AccountScreen from './AccountScreen';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from './types';
import TopRightButton from './TopRightButton';
import { Ethereum } from "@particle-network/chains";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [buttonText, setButtonText] = useState(Ethereum.fullname);
  const [buttonImageUri, setButtonImageUri] = useState(Ethereum.icon);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation, route }) => ({
            headerTitle: "",
            headerLeft: () => <Text style={styles.headerLeftText}>Particle</Text>,
            headerRight: () => (
              <TopRightButton
                onPress={() => navigation.navigate('SelectChainPage')}
                buttonImageUri={buttonImageUri}
                buttonText={buttonText}
              />
            )
          })}
        />
        {/* <Stack.Screen name="ConnectDemo" component={ConnectScreen} /> */}
        <Stack.Screen name="SelectChainPage" component={SelectChainScreen} />
        {/* <Stack.Screen name="SelectWalletTypePage" component={SelectWalletScreen} /> */}
        {/* <Stack.Screen name="AccountPage" component={AccountScreen} /> */}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerLeftText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
