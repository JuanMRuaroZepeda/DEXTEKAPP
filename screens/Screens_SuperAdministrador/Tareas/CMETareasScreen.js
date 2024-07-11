import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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