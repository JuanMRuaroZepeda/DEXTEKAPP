// LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Image, Dimensions, Alert, Touchable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
        <TouchableOpacity onPress={handleLogin} style={styles.buttonaccess}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
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
    width: width * 0.8, // Ajusta el tamaño del logo aquí
    height: undefined,
    aspectRatio: 2.9, // Mantiene la relación de aspecto
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
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'white',
    marginBottom: 10,
  },
  buttonaccess: {
    backgroundColor: 'red', // Establece el color de fondo rojo
    padding: 10, // Ajusta el padding según tus necesidades
    borderRadius: 5, // Opcional: agrega bordes redondeados
    alignItems: 'center', // Opcional: centra el texto
  },
  buttonText: {
    color: 'white', // Cambia el color del texto a blanco para contrastar con el fondo rojo
    fontSize: 16, // Ajusta el tamaño de la fuente según tus necesidades
  },
});

export default LoginScreen;