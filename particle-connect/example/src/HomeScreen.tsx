

import { Ethereum } from "@particle-network/chains";
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopRightButton from './TopRightButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const [buttonText, setButtonText] = useState(Ethereum.fullname);
  const [buttonImageUri, setButtonImageUri] = useState(Ethereum.icon);

  useEffect(() => {
    if (route.params?.chainInfo) {
      const { chainInfo } = route.params;
      setButtonText(chainInfo.name);
      setButtonImageUri(chainInfo.icon);
    }
  }, [route.params?.chainInfo]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TopRightButton
          onPress={() => navigation.navigate('SelectChainPage')}
          buttonImageUri={buttonImageUri}
          buttonText={buttonText}
        />
      ),
    });
  }, [navigation, buttonImageUri, buttonText]);

  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
}
