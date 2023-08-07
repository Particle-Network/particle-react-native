import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Demo from './Demo';
import Toast from 'react-native-toast-message';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SelectChainPage from './SelectChainPage';

const logo = require('../images/ic_round.png');

type StackParamList = {
    Home: undefined;
    Demo: undefined;
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

            <TouchableOpacity style={styles.buttonStyle}
                onPress={() => navigation.push('Demo')}>
                <Text style={styles.textStyle}>Demo</Text>
            </TouchableOpacity>

        </View>
    );
};

const Stack = createNativeStackNavigator<StackParamList>();

type AuthCoreScreenRouteProp = RouteProp<StackParamList, 'Demo'>;
type AuthCoreScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Demo'>;

interface AuthCoreScreenProps {
    route: AuthCoreScreenRouteProp;
    navigation: AuthCoreScreenNavigationProp;
}

const AuthCoreScreen: React.FC<AuthCoreScreenProps> = ({ route, navigation }) => {
    return (
        <View style={styles.container}>
            <Demo navigation={navigation} route={route} />
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
                    <Stack.Screen name="Demo" component={AuthCoreScreen} />
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
        textAlign: 'center'
    }
});
