import { PureComponent } from "react";
import { AccountScreenProps } from "./App";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import * as particleConnect from "@particle-network/rn-connect";
import { PNAccount } from "./Models/PNAccount";
import Toast from "react-native-toast-message";
import { CommonError } from "rn-base-beta";
import QRCode from "react-native-qrcode-svg";


export default class AccountPage extends PureComponent<AccountScreenProps> {

    pnaccount = new PNAccount(particleConnect.WalletType.AuthCore, [], '', '', '');

    signMessage = async () => {
        const publicAddress = this.pnaccount.publicAddress;
        if (publicAddress == undefined) {
            console.log('publicAddress is underfined, you need connect');
            return;
        }
        const message = 'Hello world!';
        const result = await particleConnect.signMessage(
            this.pnaccount.walletType,
            publicAddress,
            message
        );
        if (result.status) {
            const signedMessage = result.data as string;
            console.log(signedMessage);

            Toast.show({
                type: 'success',
                text1: 'Successfully sign message',
                text2: signedMessage,
            });
        } else {
            const error = result.data as CommonError;
            console.log(error);

            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    };

    render = () => {
        const { navigation } = this.props;

        return (
            <SafeAreaView>
                <FlatList
                    data={this.data}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={async () => {
                                if (item.key == 'Select Chain Page') {
                                    // @ts-ignore
                                    navigation.push('SelectChainPage');
                                } else if (item.key == 'Select Wallet Type Page') {
                                    // @ts-ignore
                                    navigation.push('SelectWalletTypePage');
                                } else {
                                    this.setState({
                                        currentLoadingBtn: item.key,
                                        currentKey: item.key,
                                    });
                                    // @ts-ignore
                                    await item.function();
                                    this.setState({ currentLoadingBtn: '' });
                                }
                            }}
                        >
                            {this.state.currentLoadingBtn === item.key ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.textStyle}>{item.key}</Text>
                            )}
                        </TouchableOpacity>
                    )}
                />

                {this.state.qrCodeUri !== '' && (
                    <QRCode
                        value={this.state.qrCodeUri}
                    />
                )}
            </SafeAreaView>
        );
    };

}


const styles = StyleSheet.create({
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
