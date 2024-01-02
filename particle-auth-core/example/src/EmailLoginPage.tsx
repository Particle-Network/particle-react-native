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

interface EmailLoginPagePageProps {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
}

export default class EmailLoginPage extends PureComponent<EmailLoginPagePageProps> {

    state = { email: '', code: '' };
    emailTextInput: TextInput | null = null;
    codeTextInput: TextInput | null = null;
    handleEmailTextChange = (text: string) => {
        // 只允许输入数字
        this.setState({ email: text });
    };

    handleCodeTextChange = (text: string) => {
        // 只允许输入数字
        this.setState({ code: text });
    };

    handleEmailKeyboardDismiss = () => {
        // 收起键盘
        this.emailTextInput?.blur();
    };

    handleCodeKeyboardDismiss = () => {
        // 收起键盘
        this.codeTextInput?.blur();
    };


    render = () => {
        return (
            <SafeAreaView>
                <View>
                    <TextInput
                        placeholder="Enter1 your email..."
                        placeholderTextColor='gray'
                        value={this.state.email}
                        onChangeText={this.handleEmailTextChange}
                        keyboardType="email-address"
                        returnKeyType="done"
                        onSubmitEditing={this.handleEmailKeyboardDismiss}
                        ref={(input: TextInput | null) => (this.emailTextInput = input)}
                        onKeyPress={(e) => {
                            e.preventDefault();
                        }}
                    />
                </View>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={async () => {
                        const result = await particleAuthCore.sendEmailCode(this.state.email);
                        if (result.status) {
                            const isSuccess = result.data as boolean;
                            console.log('sendEmailCode', isSuccess);
                            Toast.show({
                                type: 'success',
                                text1: `sendEmailCode ${isSuccess}`,
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
                    <Text style={styles.textStyle}>{'Send Email1'}</Text>

                </TouchableOpacity>


                <View>
                    <TextInput
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
                        const result = await particleAuthCore.connect(LoginType.Email, this.state.email, this.state.code);
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
});
