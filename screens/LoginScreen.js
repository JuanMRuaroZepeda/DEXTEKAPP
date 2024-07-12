import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Por favor ingresa el usuario y la contraseña.');
      return;
    }
    try {
      const response = await fetch('http://192.168.1.10:3000/api/auth/login', {
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
        await AsyncStorage.setItem('name', data.name); // Almacena el nombre en lugar del nombre de usuario
        switch (data.id_role.toString()) {
          case '1':
            navigation.navigate('SuperAdmin', { name: data.name });
            break;
          case '2':
            navigation.navigate('AreaManager', { name: data.name });
            break;
          case '3':
            navigation.navigate('Worker', { name: data.name });
            break;
          case '4':
            navigation.navigate('Client', { name: data.name });
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
        required  // Campo obligatorio
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
        required  // Campo obligatorio
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
      marginBottom: 20, // Subir el contenido
  },
  logo: {
    width: width * 0.5, // 50% del ancho de la pantalla
    height: undefined,
    aspectRatio: 2.9,  // Proporción del logo
    alignSelf: 'center',
    marginBottom: 20, // Subir el contenido
    borderRadius: 5,
    borderColor: 'red',
    borderWidth: 1.5, // Grosor del borde
  },  
  text: {
      color: 'white', // Texto de color blanco
      marginBottom: 8,
  },
  input: {
      height: 40,
      borderColor: 'white',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
      color: 'white', // Texto del input de color blanco
  },
});

export default LoginScreen;