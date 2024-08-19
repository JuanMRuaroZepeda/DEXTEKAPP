import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-elements';

const CreateTareaScreen = ({ navigation }) => {
  const [nameTask, setNameTask] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [idStatus, setIdStatus] = useState('');
  const [idUser, setIdUser] = useState('');
  const [idClient, setIdClient] = useState('');
  const [idProject, setIdProject] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchStatus();
    fetchClients();
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchStatus = () => {
    fetch('http://192.168.1.78:3000/api/auth/status')
      .then(response => response.json())
      .then(data => setStatus(data))
      .catch(error => {
        console.error('Error fetching status:', error);
        Alert.alert('Error', 'No se pudo obtener el estado del proyecto.');
        navigation.goBack()
      });
  };

  const fetchClients = () => {
    fetch('http://192.168.1.78:3000/api/auth/clientes')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => {
        console.error('Error fetching clientes:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de clientes.');
        navigation.goBack()
      });
  };

  const fetchUsers = () => {
    fetch('http://192.168.1.78:3000/api/auth/usersrole3')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => {
        console.error('Error fetching usuarios:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de usuarios.');
        navigation.goBack()
      });
  };

  const fetchProjects = () => {
    fetch('http://192.168.1.78:3000/api/auth/proyectos')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => {
        console.error('Error fetching proyectos:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de proyectos.');
        navigation.goBack()
      });
  };

  const createTask = () => {
    if (!nameTask || !description || !deadline || !idStatus || !idUser || !idClient || !idProject) {
      Alert.alert('Error', 'Todos los campos son requeridos.');
      return;
    }

    setLoading(true);
    const newTask = {
      name_task: nameTask,
      description: description,
      deadline: deadline.toISOString(),
      id_status: idStatus,
      id_user: idUser,
      id_client: idClient,
      id_project: idProject
    };

    fetch('http://192.168.1.78:3000/api/auth/tasktnuevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
      })
      .then(data => {
        Alert.alert('Tarea creada', data.message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
      })
      .catch(error => {
        console.error('Error creating task:', error);
        Alert.alert('Error', 'No se pudo crear la tarea.', [{ text: 'OK' }]);
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
        <Text style={styles.text}>Nombre de la Tarea:</Text>
        <TextInput
          style={styles.input}
          placeholder='Nombre de la Tarea'
          placeholderTextColor="white"
          value={nameTask}
          onChangeText={text => setNameTask(text)}
        />
        <Text style={styles.text}>Descripción de la Tarea:</Text>
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
            onValueChange={(itemValue, itemIndex) => setIdStatus(itemValue)}
          >
            <Picker.Item label="Seleccione una Opción" value="" />
            <Picker.Item label="Activo" value="1" />
            <Picker.Item label="Inactivo" value="2" />
            <Picker.Item label="Suspendido" value="3" />
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona un Encargado:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idUser}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdUser(itemValue)}
          >
            <Picker.Item label="Seleccionar Usuario" value="" />
            {users.map(user => (
              <Picker.Item key={user.id} label={user.name} value={String(user.id)} />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona un Cliente:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idClient}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdClient(itemValue)}
          >
            <Picker.Item label="Seleccionar Cliente" value="" />
            {clients.map(client => (
              <Picker.Item key={client.id} label={client.contac_name} value={client.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona un Proyecto:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idProject}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdProject(itemValue)}
          >
            <Picker.Item label="Seleccionar Proyecto" value="" />
            {projects.map(project => (
              <Picker.Item key={project.id} label={project.name_project} value={String(project.id)} />
            ))}
          </Picker>
        </View>
        <Button title="Crear Tarea" onPress={createTask} buttonStyle={styles.button2} />
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

export default CreateTareaScreen;
