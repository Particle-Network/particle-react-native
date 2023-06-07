import React, { PureComponent } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthDemo from './AuthDemo';
import SelectChainPage from './SelectChain';
import Toast from 'react-native-toast-message';

const logo = require('../images/ic_round.png');

function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image style={styles.logo} source={logo} />

                <Button
                    title={'AuthDemo'}
                    onPress={() => navigation.push('AuthDemo')}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.containerStyle}
                />
            </View>
        </View>
    );
}

const Stack = createNativeStackNavigator();

function AuthScreen({ route, navigation }) {
    return (
        <View style={styles.container}>
            <AuthDemo navigation={navigation} route={route} />
        </View>
    );
}

function SelectScreen({ route, navigation }) {
    return (
        <View style={styles.container}>
            <SelectChainPage navigation={navigation} route={route} />
        </View>
    );
}

export default function App() {
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="AuthDemo" component={AuthScreen} />
                    <Stack.Screen name="SelectChainPage" component={SelectScreen} />
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
        justifyContent: 'center',
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
    },

    containerStyle: {
        width: 200,
        marginHorizontal: 50,
        marginVertical: 10,
    },
});
