import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateUserScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idDocument, setIdDocument] = useState('');
  const [idPosition, setIdPosition] = useState('');
  const [idBranch, setIdBranch] = useState('');
  const [idDepartment, setIdDepartment] = useState('');
  const [dateStart, setDateStart] = useState(new Date());
  const [idContract, setIdContract] = useState('');
  const [idJobTitle, setIdJobTitle] = useState('');
  const [idRole, setIdRole] = useState('');
  const [idStatus, setIdStatus] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const registerUser = async () => {
    if (!name || !lastname || !username || !password || !idDocument || !idPosition || !idBranch || !idDepartment || !dateStart || !idContract || !idJobTitle || !idRole || !idStatus) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.', [{ text: 'OK' }]);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('lastname', lastname);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('id_document', parseInt(idDocument));
    formData.append('id_position', parseInt(idPosition));
    formData.append('id_branch', parseInt(idBranch));
    formData.append('id_department', parseInt(idDepartment));
    formData.append('dateStart', dateStart.toISOString());
    formData.append('id_contract', parseInt(idContract));
    formData.append('id_jobTitle', parseInt(idJobTitle));
    formData.append('id_role', parseInt(idRole));
    formData.append('id_status', parseInt(idStatus));

    try {
      const response = await fetch('http://192.168.100.7:3000/api/auth/register2', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Ocurrió un error al crear el usuario');
      }

      Alert.alert('Usuario creado', result.message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'No se pudo conectar con la API');
    }
  };

  return (
    <ImageBackground source={require('../../../assets/fondos/fondo.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>Nombre(s):</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre(s)"
          placeholderTextColor="white"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.text}>Apellidos:</Text>
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          placeholderTextColor="white"
          value={lastname}
          onChangeText={setLastname}
        />
        <Text style={styles.text}>Nombre de Usuario:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de Usuario"
          placeholderTextColor="white"
          value={username}
          onChangeText={setUsername}
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
        <Text style={styles.text}>Tipo de Documento de Identificación:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idDocument}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdDocument(itemValue)}
          >
            <Picker.Item label="Seleccione una Opción" />
            {/* Agrega aquí las opciones del Picker */}
          </Picker>
        </View>
        <Text style={styles.text}>Cargo en la empresa:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idPosition}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdPosition(itemValue)}
          >
            <Picker.Item label="Seleccione una Opción" />
            {/* Agrega aquí las opciones del Picker */}
          </Picker>
        </View>
        <Text style={styles.text}>Centro:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idBranch}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdBranch(itemValue)}
          >
            <Picker.Item label="Seleccione una Opción" />
            {/* Agrega aquí las opciones del Picker */}
          </Picker>
        </View>
        <Text style={styles.text}>Departamento:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idDepartment}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdDepartment(itemValue)}
          >
            <Picker.Item label="Seleccione una Opción" />
            {/* Agrega aquí las opciones del Picker */}
          </Picker>
        </View>
        <Text style={styles.text}>Fecha de Inicio:</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>Seleccionar Fecha</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dateStart}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              setDateStart(selectedDate || dateStart);
            }}
          />
        )}
        <Text style={styles.text}>Tipo de Contrato:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idContract}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdContract(itemValue)}
          >
            <Picker.Item label="Seleccione una Opción" />
            <Picker.Item label="Prácticas" value="1" />
            <Picker.Item label="Indefinido" value="2" />
            <Picker.Item label="Temporal" value="3" />
            <Picker.Item label="Capacitación y aprendizaje" value="4" />
          </Picker>
        </View>
        <Text style={styles.text}>Puesto Laboral:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idJobTitle}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdJobTitle(itemValue)}
          >
            <Picker.Item label="Seleccione una Opción" />
            {/* Agrega aquí las opciones del Picker */}
          </Picker>
        </View>
        <Text style={styles.text}>Rol:</Text>
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
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    color: 'white',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left',
    width: '100%',
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'white',
  },
  dateButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
  },
});

export default CreateUserScreen;