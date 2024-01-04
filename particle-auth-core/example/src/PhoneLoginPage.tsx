import React, { PureComponent } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput
} from 'react-native';

import {
    type UserInfo,
    type CommonError,
} from '@particle-network/rn-auth-core';

import Toast from 'react-native-toast-message';
import * as particleAuthCore from '@particle-network/rn-auth-core';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import { LoginType } from '@particle-network/rn-auth';

interface PhoneLoginPagePageProps {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
}

export default class PhoneLoginPage extends PureComponent<PhoneLoginPagePageProps> {

    state = { phone: '', code: '' };
    phoneTextInput: TextInput | null = null;
    codeTextInput: TextInput | null = null;
    handlePhoneTextChange = (text: string) => {
        this.setState({ phone: text });
    };

    handleCodeTextChange = (text: string) => {
        this.setState({ code: text });
    };

    handlePhoneKeyboardDismiss = () => {
        this.phoneTextInput?.blur();
    };

    handleCodeKeyboardDismiss = () => {
        this.codeTextInput?.blur();
    };


    render = () => {
        return (
            <SafeAreaView>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your phone number..."
                        placeholderTextColor='gray'
                        value={this.state.phone}
                        onChangeText={this.handlePhoneTextChange}
                        returnKeyType="done"
                        onSubmitEditing={this.handlePhoneKeyboardDismiss}
                        ref={(input: TextInput | null) => (this.phoneTextInput = input)}
                        onKeyPress={(e) => {
                            e.preventDefault();
                        }}
                    />
                </View>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={async () => {
                        const result = await particleAuthCore.sendPhoneCode(this.state.phone);
                        if (result.status) {
                            const isSuccess = result.data as boolean;
                            console.log('sendPhoneCode', isSuccess);
                            Toast.show({
                                type: 'success',
                                text1: `sendPhoneCode ${isSuccess}`,
                            });
                        } else {
                            const error = result.data as CommonError;
                            console.log('connect', error);
                            Toast.show({
                                type: 'error',
                                text1: error.message,
                            });
                        }
                    }}
                >
                    <Text style={styles.textStyle}>{'Send Phone Code'}</Text>

                </TouchableOpacity>


                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your code..."
                        placeholderTextColor='gray'
                        value={this.state.code}
                        onChangeText={this.handleCodeTextChange}
                        keyboardType="numeric"
                        returnKeyType="done"
                        onSubmitEditing={this.handleCodeKeyboardDismiss}
                        ref={(input: TextInput | null) => (this.codeTextInput = input)}
                        onKeyPress={(e) => {
                            e.preventDefault();
                        }}
                    />
                </View>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={async () => {
                        const result = await particleAuthCore.connect(LoginType.Phone, this.state.phone, this.state.code);
                        if (result.status) {
                            const userInfo = result.data as UserInfo;
                            console.log('connect', userInfo);
                            Toast.show({
                                type: 'success',
                                text1: 'Successfully connected',
                            });
                        } else {
                            const error = result.data as CommonError;
                            console.log('connect', error);
                            Toast.show({
                                type: 'error',
                                text1: error.message,
                            });
                        }
                    }}
                >
                    <Text style={styles.textStyle}>{'Connect'}</Text>

                </TouchableOpacity>
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

    input: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        padding: 10,
        borderColor: 'gray',
        borderRadius: 5,
    },
});
