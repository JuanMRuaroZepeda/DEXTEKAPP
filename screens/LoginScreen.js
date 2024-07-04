import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.100.7:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      console.log("Response data: ", data);

      if (data.id_role) {
        await AsyncStorage.setItem('token', data.accessToken);
        await AsyncStorage.setItem('role', data.id_role.toString());
        switch (data.id_role.toString()) {
          case '1':
            navigation.navigate('SuperAdmin');
            break;
          case '2':
            navigation.navigate('AreaManager');
            break;
          case '3':
            navigation.navigate('Worker');
            break;
          case '4':
            navigation.navigate('Client');
            break;
          default:
            alert('Rol no reconocido');
        }
      } else {
        alert('Usuario no Encontrado');
      }
    } catch (error) {
      console.error(error);
      alert('Error en la conexión con la API');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
  },
});

export default LoginScreen;
