import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import GUIDemo from './GUIDemo';
const logo = require('../images/ic_round.png');
const HomeScreen = ({ navigation }) => {
    return (React.createElement(View, { style: styles.container },
        React.createElement(View, { style: styles.content },
            React.createElement(Image, { style: styles.logo, source: logo }),
            React.createElement(TouchableOpacity, { style: styles.buttonStyle, onPress: () => navigation.push('GUIDemo') },
                React.createElement(Text, { style: styles.textStyle }, "GUIDemo")))));
};
const Stack = createNativeStackNavigator();
const GUIScreen = ({ route, navigation }) => {
    return (React.createElement(View, { style: styles.container },
        React.createElement(GUIDemo, { navigation: navigation, route: route })));
};
export default function App() {
    return (React.createElement(React.Fragment, null,
        React.createElement(NavigationContainer, null,
            React.createElement(Stack.Navigator, null,
                React.createElement(Stack.Screen, { name: "Home", component: HomeScreen }),
                React.createElement(Stack.Screen, { name: "GUIDemo", component: GUIScreen }))),
        React.createElement(Toast, null)));
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
        textAlign: 'center',
    },
});
