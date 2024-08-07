// LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Image, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Datos Incompletos','Por favor ingresa el usuario y la contraseña.');
      return;
    }
    try {
      const response = await fetch('http://192.168.100.7:3000/api/auth/login2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      console.log("Response data: ", data);

      if (data.accessToken) {
        await AsyncStorage.setItem('token', data.accessToken);

        const idRole = data.id_role !== undefined ? data.id_role.toString() : null;
        const idStatus = data.id_status !== undefined ? data.id_status.toString() : null;

        if (idRole !== null) {
          await AsyncStorage.setItem('role', idRole);
        } else {
          await AsyncStorage.removeItem('role');
        }

        if (data.name !== undefined) {
          await AsyncStorage.setItem('name', data.name);
        } else {
          await AsyncStorage.removeItem('name');
        }

        if (data.lastname !== undefined) {
          await AsyncStorage.setItem('lastname', data.lastname);
        } else {
          await AsyncStorage.removeItem('lastname');
        }

        if (idStatus !== null) {
          await AsyncStorage.setItem('status', idStatus);
        } else {
          await AsyncStorage.removeItem('status');
        }

        if (idStatus === '2') {
          Alert.alert('Atención!','Cuenta Eliminada');
          return;
        } else if (idStatus === '3') {
          Alert.alert('Atención!','Cuenta Suspendida');
          return;
        } else if (idStatus !== '1') {
          Alert.alert('Atención!','Estado de cuenta no válido');
          return;
        }

        switch (idRole) {
          case '1':
            navigation.navigate('SuperAdmin', { name: data.name, lastname: data.lastname });
            break;
          case '2':
            navigation.navigate('AreaManager', { name: data.name, lastname: data.lastname });
            break;
          case '3':
            navigation.navigate('Worker', { name: data.name, lastname: data.lastname });
            break;
          case '4':
            navigation.navigate('Client', { name: data.name, lastname: data.lastname });
            break;
          default:
            Alert.alert('Atención!','Rol no reconocido');
        }
      } else {
        Alert.alert('Atención!','Usuario no Encontrado');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error en el Servidor','Error en la conexión con la API');
    }
  };

  return (
    <ImageBackground source={require('../assets/fondos/fondo.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('../assets/fondos/logo.png')} style={styles.logo} />
        <Text style={styles.text}>Nombre de Usuario:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="Nombre de Usuario"
          placeholderTextColor="#aaa"
        />
        <Text style={styles.text}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
        />
        <Button title="Iniciar Sesión" onPress={handleLogin} color="red" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logo: {
    width: width * 0.5,
    aspectRatio: 2.9,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 5,
    borderColor: 'red',
    borderWidth: 1.5,
  },
  text: {
    color: 'white',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: 'white',
  },
});

export default LoginScreen;