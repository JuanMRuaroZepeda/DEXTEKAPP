import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CMETareas = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('http://192.168.100.7:3000/api/auth/proyectos').then(response => response.json()),
      fetch('http://192.168.100.7:3000/api/auth/status').then(response => response.json()),
      fetch('http://192.168.100.7:3000/api/auth/usuarios2').then(response => response.json()),
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

  const onRefresh = () => {
    setRefreshing(true);
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
        setRefreshing(false); // Marca la carga como completada
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setRefreshing(false); // En caso de error, marca la carga como completada
      });
  };

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
      '¿Estás seguro de que deseas eliminar esta tarea?',
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
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
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
            <View key={task.id} style={styles.userCard}>
              <Text style={styles.userText}>Nombre: {task.name_task}</Text>
              <Text style={styles.userText}>Descripción: {task.description}</Text>
              <Text style={styles.userText}>Fecha Limite: {task.deadline}</Text>
              <Text style={styles.userText}>Estado: {task.name_status}</Text>
              <Text style={styles.userText}>Usuario: {task.name_user}</Text>
              <Text style={styles.userText}>Cliente: {task.name_client}</Text>
              <Text style={styles.userText}>Proyecto: {task.name_project}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.buttonUpdate} 
                  onPress={() => navigation.navigate('UpdateTarea', { taskId: task.id })}
                >
                  <Icon name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.buttonDelete} 
                  onPress={() => confirmDeleteTask(task.id)}
                >
                  <Icon name="trash" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreateTarea')}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    margin: 10,
  },
  text: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  userCard: {
    backgroundColor: 'rgba(10, 20, 20, 0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  userText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  buttonDelete: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginLeft: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonUpdate: {
    backgroundColor: '#F9C806',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 150,
    bottom: 20,
    width: 60,
    height: 60,
    backgroundColor: 'green',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CMETareas;