import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button, FlatList } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import * as particleConnect from "@particle-network/rn-connect";
import { LoginType, SocialLoginPrompt, CommonError, SupportAuthType } from "@particle-network/rn-base";
import { WalletType } from "@particle-network/rn-connect";
import Toast from 'react-native-toast-message';
import * as particleAuthCore from "@particle-network/rn-auth-core";
interface LoginTypesScreenProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (selectedTypes: string[]) => void;
}

const LoginTypesScreen: React.FC<LoginTypesScreenProps> = ({ visible, onClose, onSelect }) => {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const loginTypes = [
        'email', 'phone', 'apple', 'google', 'facebook', 'discord',
        'github', 'twitch', 'microsoft', 'linkedin', 'twitter'
    ];

    const handleSelectType = (type: string) => {
        setSelectedTypes(prevState =>
            prevState.includes(type) ? prevState.filter(item => item !== type) : [...prevState, type]
        );
    };

    const handleConfirmSelection = () => {
        onSelect(selectedTypes);
        onClose();
    };

    const renderItem = ({ item }: { item: string }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectType(item)}>
            <Text style={styles.itemText}>{item}</Text>
            <Text style={styles.itemText}>        </Text>
            {selectedTypes.includes(item) && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.headerText}>Select Login Types</Text>
                    <FlatList
                        data={loginTypes}
                        renderItem={renderItem}
                        keyExtractor={item => item}
                        contentContainerStyle={styles.listContent}
                    />
                    <Button title="Confirm" onPress={handleConfirmSelection} />
                </View>
            </View>
        </Modal>
    );
};

const AuthCoreLoginScreen = () => {
    const [selectedLoginType, setSelectedLoginType] = useState(
        LoginType.Email
    );
    const [modalVisible, setModalVisible] = useState(false);
    const [loginTypesModalVisible, setLoginTypesModalVisible] = useState(false);
    const [selectedSupportAuthTypes, setSelectedSupportAuthTypes] = useState<SupportAuthType[]>([]);
    const [account, setAccount] = useState<string>('');

    const handleLoginTypesSelect = (types: string[]) => {
        var supportAuthTypes: SupportAuthType[] = [];
        for (const type of types) {

            const lowerCaseAuthType = type.toLowerCase();

            // Find matching enum value, ignoring case
            for (const key of Object.keys(SupportAuthType)) {
                if (key.toLowerCase() === lowerCaseAuthType) {
                    const supportAuthType = SupportAuthType[key as keyof typeof SupportAuthType];
                    if (supportAuthType !== undefined) {
                        supportAuthTypes.push(supportAuthType)
                    }
                }
            }
        }
        setSelectedSupportAuthTypes(supportAuthTypes);
    };

    const connectAuthCore = async () => {
        const connectConfig = {
            account: account,
            loginType: selectedLoginType,
            supportAuthType: selectedSupportAuthTypes,
            socialLoginPrompt: SocialLoginPrompt.SelectAccount,
            loginPageConifg: {
                projectName: "React Native Example",
                description: "Welcome to login",
                imagePath: "https://connect.particle.network/icons/512.png"
            }
        };
        try {
            const account = await particleConnect.connect(WalletType.AuthCore, connectConfig)

            console.log('connect success', account);

            Toast.show({
                type: 'success',
                text1: 'Successfully connected',
            });

          const userInfo = await particleAuthCore.getUserInfo();
          console.log('userInfo ', userInfo);

        } catch (e) {
            const error = e as CommonError;
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.message,
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Particle Network AuthCore</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>LoginType</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text>{selectedLoginType}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Account</Text>
                <TextInput
                    placeholder="Phone/Email/JWT"
                    style={styles.input}
                    value={account}
                    onChangeText={setAccount}
                />
            </View>

            <View style={styles.supportContainer}>
                <TouchableOpacity onPress={() => setLoginTypesModalVisible(true)}>
                    <Text style={styles.supportLabel}>SupportLoginTypes: (Click to expand)</Text>
                </TouchableOpacity>
                <Text style={styles.supportTypes}>
                    {selectedSupportAuthTypes.join(', ')}
                </Text>
            </View>


            <TouchableOpacity
                style={styles.button}
                onPress={() => connectAuthCore()}
            >
                <Text style={styles.buttonText}>Connect</Text>
            </TouchableOpacity>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Picker
                            selectedValue={selectedLoginType}
                            style={styles.picker}
                            onValueChange={(itemValue) => setSelectedLoginType(itemValue)}
                        >
                            {Object.values(LoginType).map((type) => (
                                <Picker.Item key={type} label={`LoginType.${type}`} value={type} />
                            ))}
                        </Picker>
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

            <LoginTypesScreen
                visible={loginTypesModalVisible}
                onClose={() => setLoginTypesModalVisible(false)}
                onSelect={handleLoginTypesSelect}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 400,
        padding: 20,
        backgroundColor: '#f0eaff',
        borderRadius: 30,
        margin: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    inputContainer: {
        marginVertical: 10,
        flexDirection: 'column',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    pickerButton: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginTop: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginTop: 5,
    },
    supportContainer: {
        marginVertical: 10,
    },
    supportLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    supportTypes: {
        fontSize: 14,
    },
    button: {
        backgroundColor: '#9933ff',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    picker: {
        width: '100%',
    },
    listContent: {
        paddingBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginVertical: 5,
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkmark: {
        fontSize: 14,
        color: '#9933ff',
    },
});

export default AuthCoreLoginScreen;
