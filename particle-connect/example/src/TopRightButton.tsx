import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const TopRightButton = ({ onPress, buttonImageUri, buttonText }) => {
  return (
    <TouchableOpacity style={styles.topRightButton} onPress={onPress}>
      <Image style={styles.buttonImage} source={{ uri: buttonImageUri }} />
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topRightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  buttonImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default TopRightButton;
