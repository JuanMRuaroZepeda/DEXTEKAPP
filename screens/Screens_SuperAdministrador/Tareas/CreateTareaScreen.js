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
    fetch('https://apidextek.fragomx.com/api/auth/status')
      .then(response => response.json())
      .then(data => setStatus(data))
      .catch(error => {
        console.error('Error fetching status:', error);
        Alert.alert('Error', 'No se pudo obtener el estado del proyecto.');
      });
  };

  const fetchClients = () => {
    fetch('https://apidextek.fragomx.com/api/auth/clientes')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => {
        console.error('Error fetching clientes:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de clientes.');
      });
  };

  const fetchUsers = () => {
    fetch('https://apidextek.fragomx.com/api/auth/usersrole3')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => {
        console.error('Error fetching usuarios:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de usuarios.');
      });
  };

  const fetchProjects = () => {
    fetch('https://apidextek.fragomx.com/api/auth/proyectos')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => {
        console.error('Error fetching proyectos:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de proyectos.');
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

    fetch('https://apidextek.fragomx.com/api/auth/tasktnuevo', {
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
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.buttonText}>Seleccionar Fecha Límite</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={deadline}
            mode="date"
            is24Hour={true}
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
              <Picker.Item key={user.id} label={user.name} value={user.id} />
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
              <Picker.Item key={project.id} label={project.name_project} value={project.id} />
            ))}
          </Picker>
        </View>
        <Button title="Crear Tarea" onPress={createTask} buttonStyle={styles.createButton} />
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
    color: 'white',
  },
  text: {
    color: 'white',
    marginBottom: 8,
  },
  datePickerButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  pickerContainer: {
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 12,
  },
  picker: {
    color: 'white',
  },
  createButton: {
    backgroundColor: 'green',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateTareaScreen;
