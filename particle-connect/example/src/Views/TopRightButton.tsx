import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

interface TopRightButtonProps {
  onPress: () => void;
  buttonImageUri: string;
  buttonText: string;
}

export default function TopRightButton({ onPress, buttonImageUri, buttonText }: TopRightButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Image source={{ uri: buttonImageUri }} style={styles.image} />
      <Text>{buttonText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});
