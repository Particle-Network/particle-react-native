import { StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Text } from 'react-native';

import Toast from 'react-native-toast-message';

import {
  ChainInfo,
  Ethereum,
} from '@particle-network/chains';

import {
  Env,
  LoginType,
  ParticleInfo,
  SocialLoginPrompt,
  SupportAuthType,
  WalletDisplay,
  CommonError
} from '@particle-network/rn-base';

import {
  WalletType,
} from '@particle-network/rn-connect';
import * as particleConnect from '@particle-network/rn-connect';
import * as particleWallet from '@particle-network/rn-wallet';
import * as particleAuthCore from '@particle-network/rn-auth-core';

export class PNAccount {
  static walletType: WalletType = WalletType.AuthCore;

  icons: string[];
  name: string;
  publicAddress: string;
  url: string;

  constructor(
    icons: string[],
    name: string,
    publicAddress: string,
    url: string
  ) {
    this.icons = icons;
    this.name = name;
    this.publicAddress = publicAddress;
    this.url = url;
  }

  static parseFrom(params: string): PNAccount {
    return JSON.parse(params) as PNAccount;
  }
}

export async function init() {
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
  const metaData = {
    walletConnectProjectId: '75ac08814504606fc06126541ace9df6',
    name: 'Particle Connect',
    icon: 'https://connect.particle.network/icons/512.png',
    url: 'https://connect.particle.network',
    description: 'Particle Wallet',
  };

  particleConnect.init(chainInfo, env, metaData);
  particleWallet.initWallet(metaData);
  particleAuthCore.init();
}


export async function connectParticle() {
  const connectConfig = {
    account: "",
    loginType: LoginType.Email,
    supportAuthType: [SupportAuthType.Email, SupportAuthType.Phone, SupportAuthType.Apple, SupportAuthType.Google],
    socialLoginPrompt: SocialLoginPrompt.SelectAccount,
    loginPageConifg: {
      projectName: "React Native Example",
      description: "Welcome to login",
      imagePath: "https://connect.particle.network/icons/512.png"
    }
  };

  try {
    await particleConnect.disconnect(WalletType.AuthCore, "");
    const account = await particleConnect.connect(WalletType.AuthCore, connectConfig);
    console.log('connect success', account);

    Toast.show({
      type: 'success',
      text1: 'Successfully connected',
    });
  } catch (e) {
    const error = e as CommonError;
    console.log(error);
    Toast.show({
      type: 'error',
      text1: error.message,
    });
  }
};

export async function openWallet() {
  particleWallet.navigatorWallet(WalletDisplay.Token);
}

var data = [
  { key: 'Init', function: init },
  { key: 'Connect particle', function: connectParticle },
  { key: 'Open Wallet', function: openWallet },
]

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} >
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={async () => {
              await item.function();
            }}
          >
            <Text style={styles.textStyle}>{item.key}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
