import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CreateUserScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [idRole, setIdRole] = useState('');
  const [idStatus, setIdStatus] = useState('');

  const registerUser = async () => {
    // Validar que todos los campos estén llenos
    if (!username || !email || !password || !name || !idRole || !idStatus) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.', [{ text: 'OK' }]);
      return;
    }

    const newUser = {
      username,
      email,
      password,
      name,
      id_role: parseInt(idRole),
      id_status: parseInt(idStatus)
    };

    try {
      const response = await fetch('http://192.168.100.7:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Usuario Creado", `Usuario ${result.user.username} creado exitosamente`);
        navigation.goBack();
      } else {
        Alert.alert("Error", result.message || "Ocurrió un error al crear el usuario");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar con la API");
    }
  };

  return (
    <ImageBackground source={require('../../../assets/fondos/fondo.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>Nombre de Usuario:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de Usuario"
          placeholderTextColor="white"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.text}>Correo Electronico:</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo Electronico"
          placeholderTextColor="white"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.text}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="white"
          autoCapitalize="none"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.text}>Nombre Completo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="white"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.text}>Selecciona un Rol:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idRole}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdRole(itemValue)}
          >
            <Picker.Item label="Seleccione una Opción" />
            <Picker.Item label="Super Administrador" value="1" />
            <Picker.Item label="Jefe de Área" value="2" />
            <Picker.Item label="Trabajador" value="3" />
            <Picker.Item label="Cliente" value="4" />
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona un Status:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idStatus}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdStatus(itemValue)}
          >
            <Picker.Item label="Seleccione una Opción" />
            <Picker.Item label="Activo" value="1" />
            <Picker.Item label="Inactivo" value="2" />
            <Picker.Item label="Suspendido" value="3" />
          </Picker>
        </View>
        <Button title="Crear Usuario" onPress={registerUser} color="green" />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'top',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: 'white', // Texto del input de color blanco
  },
  pickerContainer: {
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'white', // Texto de color blanco
  },
  text: {
    color: 'white',
    marginBottom: 8,
  },
});

export default CreateUserScreen;