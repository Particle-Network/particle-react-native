import { StatusBar } from 'expo-status-bar';
import {
  ChainInfo,
  Ethereum,
  PolygonMumbai,
  SolanaDevnet,
} from '@particle-network/chains';

import {
  Env,
  LoginType,
  ParticleInfo,
  SocialLoginPrompt,
  SupportAuthType,
  WalletDisplay
} from '@particle-network/rn-auth';

import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  AccountInfo,
  CommonError,
  DappMetaData,
  LoginResp,
  ParticleConnectConfig,
  WalletType,
} from '@particle-network/rn-connect';
import { PNAccount } from './PNAccount';
import * as particleConnect from '@particle-network/rn-connect';
import * as particleWallet from '@particle-network/rn-wallet';

var state = { currentLoadingBtn: '', currentOptions: [], currentKey: '' };

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
  const walletMetaData = {
    walletConnectProjectId: '75ac08814504606fc06126541ace9df6',
    name: 'Particle Connect',
    icon: 'https://connect.particle.network/icons/512.png',
    url: 'https://connect.particle.network',
    description: 'Particle Wallet',
  };
  const dappMetaData = new DappMetaData(
    '75ac08814504606fc06126541ace9df6',
    'Particle Connect',
    'https://connect.particle.network/icons/512.png',
    'https://connect.particle.network',
    'Particle Wallet',
    '',
    ''
  );
  particleConnect.init(chainInfo, env, dappMetaData);
  particleWallet.initWallet(walletMetaData);
}


export async function connectParticle() {
  const result = await particleConnect.connect(WalletType.Particle);
  if (result.status) {
    console.log('connect success');
    const account = result.data as AccountInfo;
    this.pnaccount = new PNAccount(
      account.icons,
      account.name,
      account.publicAddress,
      account.url
    );
    console.log('pnaccount = ', this.pnaccount);


  } else {
    const error = result.data as CommonError;
    console.log(error);

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

export default function App() {
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
