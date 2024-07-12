import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';

const ConsultarTareas = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('http://192.168.100.7:3000/api/auth/proyectos').then(response => response.json()),
      fetch('http://192.168.100.7:3000/api/auth/status').then(response => response.json()),
      fetch('http://192.168.100.7:3000/api/auth/usuarios').then(response => response.json()),
      fetch('http://192.168.100.7:3000/api/auth/clientes').then(response => response.json()),
      fetch('http://192.168.100.7:3000/api/auth/tareas').then(response => response.json()),
    ])
      .then(([proyectosData, statusData, usuariosData, clientesData, tareasData]) => {
        setProjects(proyectosData);
        setStatus(statusData);
        setUsers(usuariosData);
        setClients(clientesData);
        setTasks(tareasData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = tasks.filter(task =>
      (task.name_task || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.name_status || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.name_user || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.name_client || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.name_project || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [searchQuery, tasks]);

  const deleteTask = (taskId) => {
    fetch(`http://192.168.100.7:3000/api/auth/eliminartarea/${taskId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        Alert.alert('Tarea eliminada', data.message, [{ text: 'OK' }]);
        setTasks(tasks.filter(task => task.id !== taskId));
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'No se pudo eliminar la tarea.', [{ text: 'OK' }]);
      });
  };

  const confirmDeleteTask = (taskId) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estas seguro de que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí', onPress: () => deleteTask(taskId) }
      ]
    );
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
      <ScrollView>
        <Text style={styles.text}>Tareas</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, descripción, estado, usuario, cliente o proyecto"
          placeholderTextColor="white"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.container}>
          {(searchQuery.length > 0 ? filteredTasks : tasks).map(task => (
            <View key={task.id} style={styles.projectCard}>
              <Text style={styles.taskText}>Nombre: {task.name_task}</Text>
              <Text style={styles.taskText}>Descripción: {task.description}</Text>
              <Text style={styles.taskText}>Fecha Limite: {task.deadline}</Text>
              <Text style={styles.taskText}>Estado: {task.name_status}</Text>
              <Text style={styles.taskText}>Usuario: {task.name_user }</Text>
              <Text style={styles.taskText}>Cliente: {task.name_client }</Text>
              <Text style={styles.taskText}>Proyecto: {task.name_project}</Text>
            </View>
          ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 35,
    marginVertical: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: 'white',
    alignSelf: 'center',
    width: '90%',
  },
  projectCard: {
    backgroundColor: 'gray',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  taskText: {
    color: 'white',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#D9E04F',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  fab: {
    position: 'absolute',
    right: 145,
    bottom: 20,
    width: 60,
    height: 60,
    backgroundColor: 'green',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConsultarTareas;