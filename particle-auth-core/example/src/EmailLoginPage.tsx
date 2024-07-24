import React, { PureComponent } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput
} from 'react-native';

// import {
//     type UserInfo,
//     type CommonError,
// } from '@particle-network/rn-auth-core';

import {
    type UserInfo,
    type CommonError,
} from '@particle-network/rn-auth-core';

import Toast from 'react-native-toast-message';
// import * as particleAuthCore from '@particle-network/rn-auth-core';
import * as particleAuthCore from '@particle-network/rn-auth-core';

import type { NavigationProp, RouteProp } from '@react-navigation/native';

interface EmailLoginPagePageProps {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
}

export default class EmailLoginPage extends PureComponent<EmailLoginPagePageProps> {

    state = { email: '', code: '' };
    emailTextInput: TextInput | null = null;
    codeTextInput: TextInput | null = null;
    handleEmailTextChange = (text: string) => {
        this.setState({ email: text });
    };

    handleCodeTextChange = (text: string) => {
        this.setState({ code: text });
    };

    handleEmailKeyboardDismiss = () => {
        this.emailTextInput?.blur();
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
                        placeholder="Enter your email..."
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
                        try {
                            const isSuccess = await particleAuthCore.sendEmailCode(this.state.email);
                            console.log('sendEmailCode', isSuccess);
                            Toast.show({
                                type: 'success',
                                text1: `sendEmailCode ${isSuccess}`,
                            });
                        } catch (e) {
                            const error = e as CommonError;
                            console.log(error);
                            Toast.show({
                                type: 'error',
                                text1: error.message,
                            });
                        }

                    }}
                >
                    <Text style={styles.textStyle}>{'Send Email Code'}</Text>

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
                        try {
                            const userInfo = await particleAuthCore.connectWithCode(null, this.state.email, this.state.code);
                            console.log('connect', userInfo);
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
