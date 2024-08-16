import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const CreateUserScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idDocument, setIdDocument] = useState('');
  const [document, setDocument] = useState(null);
  const [idPosition, setIdPosition] = useState('');
  const [idBranch, setIdBranch] = useState('');
  const [idDepartment, setIdDepartment] = useState('');
  const [dateStart, setDateStart] = useState(new Date());
  const [idContract, setIdContract] = useState('');
  const [idJobTitle, setIdJobTitle] = useState('');
  const [idRole, setIdRole] = useState('');
  const [idStatus, setIdStatus] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);

  useEffect(() => {
    fetchDocuments();
    fetchPositions();
    fetchBranches();
    fetchDepartments();
    fetchContracts();
    fetchJobTitles();
  }, []);

  const fetchDocuments = () => {
    fetch('http://192.168.1.3:3000/api/auth/documentos')
      .then(response => response.json())
      .then(data => setDocuments(data))
      .catch(error => {
        console.error('Error fetching Documents:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de documentos.');
      });
  };

  const fetchPositions = () => {
    fetch('http://192.168.1.3:3000/api/auth/positions')
      .then(response => response.json())
      .then(data => setPositions(data))
      .catch(error => {
        console.error('Error fetching Positions:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de posiciones.');
      });
  };

  const fetchBranches = () => {
    fetch('http://192.168.1.3:3000/api/auth/sucursales')
      .then(response => response.json())
      .then(data => setBranches(data))
      .catch(error => {
        console.error('Error fetching Branches:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de sucursales.');
      });
  };

  const fetchDepartments = () => {
    fetch('http://192.168.1.3:3000/api/auth/departamentos')
      .then(response => response.json())
      .then(data => setDepartments(data))
      .catch(error => {
        console.error('Error fetching Departments:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de departamentos.');
      });
  };

  const fetchContracts = () => {
    fetch('http://192.168.1.3:3000/api/auth/contratos')
      .then(response => response.json())
      .then(data => setContracts(data))
      .catch(error => {
        console.error('Error fetching Contracts:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de contratos.');
      });
  };

  const fetchJobTitles = () => {
    fetch('http://192.168.1.3:3000/api/auth/jobstitles')
      .then(response => response.json())
      .then(data => setJobTitles(data))
      .catch(error => {
        console.error('Error fetching JobTitles:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de títulos de trabajo.');
      });
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateStart;
    setShowDatePicker(false);
    setDateStart(currentDate);
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      
      console.log('Document Picker Result:', result); // Para ver el resultado completo
      
      if (result.canceled) {
        console.log('Document picker was canceled'); // Agrega este console log si el picker fue cancelado
        return;
      }
  
      if (result.assets && result.assets.length > 0) {
        const selectedDocument = result.assets[0];
        setDocument(selectedDocument);
        console.log('Selected Document:', selectedDocument); // Agrega este console log para verificar el archivo seleccionado
      } else {
        console.log('No document selected'); // Agrega este console log si no se seleccionó ningún archivo
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'No se pudo seleccionar el documento.');
    }
  };

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
    formData.append('id_document', idDocument);
    formData.append('id_positionCompany', idPosition);
    formData.append('id_branch', idBranch);
    formData.append('id_department', idDepartment);
    formData.append('date_start', dateStart.toISOString());
    formData.append('id_contract', idContract);
    formData.append('id_jobTitle', idJobTitle);
    formData.append('id_role', idRole);
    formData.append('id_status', idStatus);
  
    if (document) {
      const fileUri = document.uri;
      const fileName = document.name;
      const fileType = document.mimeType;
  
      formData.append('document', {
        uri: fileUri,
        type: fileType,
        name: fileName,
      });
    }
  
    try {
      const response = await axios.post('http://192.168.1.3:3000/api/auth/register2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      console.log(response.data); // Verifica la respuesta aquí
    
      if (response.status !== 200) {
        throw new Error(response.data.message || 'Ocurrió un error al crear el usuario');
      }
    
      Alert.alert('Usuario creado', response.data.message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response ? error.response.data.message : 'No se pudo conectar con la API');
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
        <Text style={styles.text}>Selecciona el tipo de Documento:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idDocument}
            onValueChange={(itemValue) => setIdDocument(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una Opción" value="" />
            {documents.map((doc) => (
              <Picker.Item key={doc.id} label={doc.name_document} value={doc.id} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity onPress={handleDocumentPick} style={styles.button}>
          <Text style={styles.buttonText}>
            {document ? document.name : 'Selecciona un Documento'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.text}>Selecciona la Posición:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idPosition}
            onValueChange={(itemValue) => setIdPosition(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una Opción" value="" />
            {positions.map((pos) => (
              <Picker.Item key={pos.id} label={pos.name_position} value={pos.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona la Sucursal:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idBranch}
            onValueChange={(itemValue) => setIdBranch(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una Opción" value="" />
            {branches.map((branch) => (
              <Picker.Item key={branch.id} label={branch.name_branch} value={branch.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona el Departamento:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idDepartment}
            onValueChange={(itemValue) => setIdDepartment(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una Opción" value="" />
            {departments.map((dept) => (
              <Picker.Item key={dept.id} label={dept.name_departament} value={dept.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>Fecha de Inicio:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.buttonText}>{dateStart.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dateStart}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        <Text style={styles.text}>Selecciona el Contrato:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idContract}
            onValueChange={(itemValue) => setIdContract(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una Opción" value="" />
            {contracts.map((contract) => (
              <Picker.Item key={contract.id} label={contract.name_contrat} value={contract.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona el Título del Trabajo:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idJobTitle}
            onValueChange={(itemValue) => setIdJobTitle(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una Opción" value="" />
            {jobTitles.map((title) => (
              <Picker.Item key={title.id} label={title.name_jobTitle} value={title.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona el Rol:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idRole}
            onValueChange={(itemValue) => setIdRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una Opción" value="" />
            <Picker.Item label="Super Administrador" value="1" />
            <Picker.Item label="Jefe de Área" value="2" />
            <Picker.Item label="Trabajador" value="3" />
            <Picker.Item label="Cliente" value="4" />
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona el Estado:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idStatus}
            onValueChange={(itemValue) => setIdStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una Opción" value="" />
            <Picker.Item label="Activo" value="1" />
            <Picker.Item label="Inactivo" value="2" />
            <Picker.Item label="Suspendido" value="3" />
          </Picker>
        </View>
        <TouchableOpacity onPress={registerUser} style={styles.button2}>
          <Text style={styles.buttonText}>Registrar Usuario</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
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
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    width: '100%',
    color: 'white',
  },
  dateButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'red', // Establece el color de fondo rojo
    padding: 10, // Ajusta el padding según tus necesidades
    borderRadius: 5, // Opcional: agrega bordes redondeados
    alignItems: 'center', // Opcional: centra el texto
  },
  buttonText: {
    color: 'white', // Cambia el color del texto a blanco para contrastar con el fondo rojo
    fontSize: 16, // Ajusta el tamaño de la fuente según tus necesidades
  },
  button2: {
    backgroundColor: 'green', // Establece el color de fondo rojo
    padding: 10, // Ajusta el padding según tus necesidades
    borderRadius: 5, // Opcional: agrega bordes redondeados
    alignItems: 'center', // Opcional: centra el texto
  },
});

export default CreateUserScreen;