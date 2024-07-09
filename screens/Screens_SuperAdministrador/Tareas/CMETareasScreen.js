import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CMETareas = ({ navigation }) => {
  
    return (
    <View style={styles.container}>
      <Text>Welcome Home!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CMETareas;