import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet } from 'react-native';
import HomeScreen from './Pages/HomeScreen';
import SelectChainScreen from './Pages/SelectChainScreen';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from './Pages/types';
import { Ethereum } from "@particle-network/chains";
import * as particleConnect from '@particle-network/rn-connect';
import { ParticleInfo } from '@particle-network/rn-base';
import * as particleAuthCore from "@particle-network/rn-auth-core";
import { type ChainInfo } from '@particle-network/chains';
import { Env } from '@particle-network/rn-base';
import SelectWalletScreen from './Pages/SelectWalletScreen';
import ConnectedWalletScreen from './Pages/ConnectedWalletScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    initParticle();
  }, []);

  const initParticle = () => {
    // Get your project id and client from dashboard,
    // https://dashboard.particle.network/

    ParticleInfo.projectId = '5479798b-26a9-4943-b848-649bb104fdc3'; // your project id
    ParticleInfo.clientKey = 'cUKfeOA7rnNFCxSBtXE5byLgzIhzGrE4Y7rDdY4b'; // your client key

    if (ParticleInfo.projectId == '' || ParticleInfo.clientKey == '') {
      throw new Error(
        'You need set project info, Get your project id and client from dashboard, https://dashboard.particle.network'
      );
    }

    const chainInfo: ChainInfo = Ethereum;
    const env = Env.Dev;
    const metadata = {
      url: 'https://connect.particle.network',
      icon: 'https://connect.particle.network/icons/512.png',
      name: 'Particle Connect',
      description: 'Particle Wallet'
    }

    particleConnect.init(chainInfo, env, metadata);
    particleAuthCore.init();
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={() => ({
            headerTitle: "",
            headerLeft: () => <Text style={styles.headerLeftText}>Particle</Text>
          })}
        />
        {/* <Stack.Screen name="ConnectDemo" component={ConnectScreen} /> */}
        <Stack.Screen name="SelectChainPage" component={SelectChainScreen} />
        <Stack.Screen name="SelectWalletPage" component={SelectWalletScreen} />
        <Stack.Screen name="ConnectedWalletPage" component={ConnectedWalletScreen} />
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
