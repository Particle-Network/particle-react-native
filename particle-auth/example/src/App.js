import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
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

                <TouchableOpacity style={styles.buttonStyle}
                    onPress={() => {

                        navigation.push('AuthDemo')

                    }}>
                    <Text style={styles.textStyle}>AuthDemo</Text>
                </TouchableOpacity>
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
        margin: 10,
        height: 30,
        width: 300,
        justifyContent: 'center',
    },

    textStyle: {
        color: 'white',
        textAlign: 'center'
    }
});
