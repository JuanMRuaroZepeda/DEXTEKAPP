import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-elements';

const CreateProyectoScreen = ({ navigation }) => {
  const [nameProject, setNameProject] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [idStatus, setIdStatus] = useState('');
  const [idUser, setIdUser] = useState('');
  const [idClient, setIdClient] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchClientes();
    fetchUsuarios();
  }, []);

  const fetchClientes = () => {
    fetch('http://192.168.1.78:3000/api/auth/clientes')
      .then(response => response.json())
      .then(data => {
        setClientes(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching clientes:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de clientes.');
      });
  };

  const fetchUsuarios = () => {
    fetch('http://192.168.1.78:3000/api/auth/usersrole3')
      .then(response => response.json())
      .then(data => {
        setUsuarios(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching usuarios:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de usuarios.');
      });
  };

  const createProject = () => {
    if (!nameProject || !description || !deadline || !idStatus || !idUser || !idClient) {
      Alert.alert('Error', 'Todos los campos son requeridos.');
      return;
    }

    setLoading(true);
    const newProject = {
      name_project: nameProject,
      description: description,
      deadline: deadline.toISOString(),
      id_status: idStatus,
      id_user: idUser,
      id_client: idClient
    };

    fetch('http://192.168.1.78:3000/api/auth/crearproyecto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
      })
      .then(data => {
        Alert.alert('Proyecto creado', data.message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
      })
      .catch(error => {
        console.error('Error creating project:', error);
        Alert.alert('Error', 'No se pudo crear el proyecto.', [{ text: 'OK' }]);
      })
      .finally(() => setLoading(false));
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(false);
    setDeadline(currentDate);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../../assets/fondos/fondo.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>Nombre del Proyecto:</Text>
        <TextInput
          style={styles.input}
          placeholder='Nombre del Proyecto'
          placeholderTextColor="white"
          value={nameProject}
          onChangeText={text => setNameProject(text)}
        />
        <Text style={styles.text}>Descripción del Proyecto:</Text>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          placeholderTextColor="white"
          value={description}
          onChangeText={text => setDescription(text)}
        />
        <Text style={styles.text}>Fecha de Entrega:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.buttonText}>{deadline.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={deadline}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        <Text style={styles.text}>Selecciona un Status:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idStatus}
            style={styles.picker}
            onValueChange={(itemValue) => setIdStatus(itemValue)}
          >
            <Picker.Item label="Seleccione una Opción" value="" />
            <Picker.Item label="Activo" value="1" />
            <Picker.Item label="Inactivo" value="2" />
            <Picker.Item label="Suspendido" value="3" />
            <Picker.Item label="En Proceso" value="4" />
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona un Encargado:</Text>
        <View style={styles.pickerContainer}>
        <Picker
          selectedValue={idUser}
          style={styles.picker}
          onValueChange={(itemValue) => setIdUser(itemValue)}
        >
          <Picker.Item label="Seleccionar Usuario" value="" />
          {usuarios.map(user => (
            <Picker.Item key={user.id} label={user.name} value={String(user.id)} />
          ))}
        </Picker>
        </View>
        <Text style={styles.text}>Selecciona un Cliente:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idClient}
            style={styles.picker}
            onValueChange={(itemValue) => setIdClient(itemValue)}
          >
            <Picker.Item label="Seleccionar Cliente" value="" />
            {clientes.map(cliente => (
              <Picker.Item key={cliente.id} label={cliente.contac_name} value={cliente.id} />
            ))}
          </Picker>
        </View>
        <Button title="Crear Proyecto" onPress={createProject} buttonStyle={styles.button2} />
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
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  button2: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default CreateProyectoScreen;
