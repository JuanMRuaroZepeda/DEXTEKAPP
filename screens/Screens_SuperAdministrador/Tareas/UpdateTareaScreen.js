import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-elements';

const UpdateTareaScreen = ({ route, navigation }) => {
  const { taskId } = route.params; // Obtener el ID de la tarea desde la navegación
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
    fetch('http://192.168.100.7:3000/api/auth/status')
      .then(response => response.json())
      .then(data => setStatus(data))
      .catch(error => {
        console.error('Error fetching status:', error);
        Alert.alert('Error', 'No se pudo obtener el estado del proyecto.');
      });
  };

  const fetchClients = () => {
    fetch('http://192.168.100.7:3000/api/auth/clientes')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => {
        console.error('Error fetching clientes:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de clientes.');
      });
  };

  const fetchUsers = () => {
    fetch('http://192.168.100.7:3000/api/auth/usersrole3')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => {
        console.error('Error fetching usuarios:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de usuarios.');
      });
  };

  const fetchProjects = () => {
    fetch('http://192.168.100.7:3000/api/auth/proyectos')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => {
        console.error('Error fetching proyectos:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de proyectos.');
      });
  };

  const updateTask = () => {
    if (!nameTask || !description || !deadline || !idStatus || !idUser || !idClient || !idProject) {
      Alert.alert('Error', 'Todos los campos son requeridos.');
      return;
    }

    setLoading(true);
    const updatedTask = {
      name_task: nameTask,
      description: description,
      deadline: deadline.toISOString(),
      id_status: idStatus,
      id_user: idUser,
      id_client: idClient,
      id_project: idProject
    };

    fetch(`http://192.168.100.7:3000/api/auth/actualizartarea/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      })      
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
      })
      .then(data => {
        Alert.alert('Tarea actualizada', data.message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
      })
      .catch(error => {
        console.error('Error updating task:', error);
        Alert.alert('Error', 'No se pudo actualizar la tarea.', [{ text: 'OK' }]);
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
        <Text style={styles.text}>Nuevo Nombre de la Tarea:</Text>
        <TextInput
          style={styles.input}
          placeholder='Nuevo Nombre'
          placeholderTextColor="white"
          value={nameTask}
          onChangeText={text => setNameTask(text)}
        />
        <Text style={styles.text}>Nueva Descripción de la Tarea:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nueva Descripción"
          placeholderTextColor="white"
          value={description}
          onChangeText={text => setDescription(text)}
        />
        <Text style={styles.text}>Nueva Fecha de Entrega:</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.buttonText}>Seleccionar Nueva Fecha Límite</Text>
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
        <Text style={styles.text}>Selecciona un Nuevo Estado:</Text>
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
        <Text style={styles.text}>Selecciona un Nuevo Encargado:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idUser}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdUser(itemValue)}
          >
            <Picker.Item label="Seleccionar una Opción" value="" />
            {users.map(user => (
              <Picker.Item key={user.id} label={user.name} value={user.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona un Nuevo Cliente:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idClient}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdClient(itemValue)}
          >
            <Picker.Item label="Seleccionar un Opción" value="" />
            {clients.map(client => (
              <Picker.Item key={client.id} label={client.contac_name} value={client.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>Selecciona un Nuevo Proyecto:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idProject}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setIdProject(itemValue)}
          >
            <Picker.Item label="Seleccionar una Opción" value="" />
            {projects.map(project => (
              <Picker.Item key={project.id} label={project.name_project} value={project.id} />
            ))}
          </Picker>
        </View>
        <Button title="Actualizar Tarea" onPress={updateTask} buttonStyle={styles.createButton} />
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
        height: 40,
        color: 'white',
      },
      createButton: {
        backgroundColor: 'green',
        borderRadius: 5,
        marginTop: 20,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
});

export default UpdateTareaScreen;