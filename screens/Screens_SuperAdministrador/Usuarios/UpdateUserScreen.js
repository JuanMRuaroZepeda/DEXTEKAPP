import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const UpdateUserScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    id_role: '',
    id_status: '',
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Aquí puedes poner la lógica para cargar de nuevo los datos del usuario
      // Puedes hacer una nueva solicitud para obtener los datos actualizados si es necesario
    });

    return unsubscribe;
  }, [navigation]);

  const handleChange = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  const updateUser = () => {
    // Validar que todos los campos estén llenos
    if (!user.username || !user.email || !user.password || !user.name || !user.id_role || !user.id_status) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.', [{ text: 'OK' }]);
      return;
    }

    fetch(`https://apidextek.fragomx.com/api/auth/actualizarusuario/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(response => response.json())
      .then(data => {
        Alert.alert('Usuario actualizado', data.message, [{ text: 'OK' }]);
        // Navegar hacia atrás y recargar la pantalla anterior
        navigation.navigate('UpdateUserScreen', { userId }); // Esto recargará la pantalla anterior
        navigation.goBack();
        
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'No se pudo actualizar el usuario.', [{ text: 'OK' }]);
      });
  };

  return (
    <ImageBackground source={require('../../../assets/fondos/fondo.jpg')} style={styles.background}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.text}>Nuevo Nombre de Usuario:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa nuevo nombre de usuario"
            placeholderTextColor="white"
            value={user.username}
            autoCapitalize="none"
            onChangeText={(value) => handleChange('username', value)}
          />
          <Text style={styles.text}>Nuevo Correo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa nuevo correo electrónico"
            placeholderTextColor="white"
            value={user.email}
            autoCapitalize="none"
            onChangeText={(value) => handleChange('email', value)}
          />
          <Text style={styles.text}>Nueva Contraseña:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa nueva contraseña"
            placeholderTextColor="white"
            value={user.password}
            autoCapitalize="none"
            onChangeText={(value) => handleChange('password', value)}
          />
          <Text style={styles.text}>Nuevo Nombre Completo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa nuevo nombre completo"
            placeholderTextColor="white"
            value={user.name}
            onChangeText={(value) => handleChange('name', value)}
          />
          <Text style={styles.text}>Selecciona un Nuevo Rol:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={user.id_role}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => handleChange('id_role', itemValue)}
            >
              <Picker.Item label="Seleccione una Opción" value="" />
              <Picker.Item label="Super Administrador" value="1" />
              <Picker.Item label="Jefe de Área" value="2" />
              <Picker.Item label="Trabajador" value="3" />
              <Picker.Item label="Cliente" value="4" />
            </Picker>
          </View>
          <Text style={styles.text}>Selecciona un Nuevo Status:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={user.id_status}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => handleChange('id_status', itemValue)}
            >
              <Picker.Item label="Seleccione una Opción" value="" />
              <Picker.Item label="Activo" value="1" />
              <Picker.Item label="Inactivo" value="2" />
              <Picker.Item label="Suspendido" value="3" />
            </Picker>
          </View>
          <Button title='Actualizar Usuario' onPress={updateUser} color="green" />
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: 'white',
  },
  text: {
    color: 'white',
    marginBottom: 8,
  },
  pickerContainer: {
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'white',
  },
});

export default UpdateUserScreen;
