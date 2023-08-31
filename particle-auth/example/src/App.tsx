import type { RouteProp } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import AuthDemo from './AuthDemo';
import SelectChainPage from './SelectChain';

const logo = require('../images/ic_round.png');

type StackParamList = {
    Home: undefined;
    AuthDemo: undefined;
    SelectChainPage: undefined;
};

type HomeScreenRouteProp = RouteProp<StackParamList, 'Home'>;
type HomeScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Home'>;

interface HomeScreenProps {
    route: HomeScreenRouteProp;
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={logo} />

            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.push('AuthDemo')}>
                <Text style={styles.textStyle}>AuthDemo</Text>
            </TouchableOpacity>
        </View>
    );
};

const Stack = createNativeStackNavigator<StackParamList>();

type AuthScreenRouteProp = RouteProp<StackParamList, 'AuthDemo'>;
type AuthScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'AuthDemo'>;

interface AuthScreenProps {
    route: AuthScreenRouteProp;
    navigation: AuthScreenNavigationProp;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ route, navigation }) => {
    return (
        <View style={styles.container}>
            <AuthDemo navigation={navigation} route={route} />
        </View>
    );
};

type SelectScreenRouteProp = RouteProp<StackParamList, 'SelectChainPage'>;
type SelectScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'SelectChainPage'>;

interface SelectScreenProps {
    route: SelectScreenRouteProp;
    navigation: SelectScreenNavigationProp;
}

const SelectScreen: React.FC<SelectScreenProps> = ({ route, navigation }) => {
    return (
        <View style={styles.container}>
            <SelectChainPage navigation={navigation} route={route} />
        </View>
    );
};

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
