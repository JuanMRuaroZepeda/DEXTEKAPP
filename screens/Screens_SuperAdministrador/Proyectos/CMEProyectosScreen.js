import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CMEProyectos = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('https://apidextek.fragomx.com/api/auth/proyectos').then(response => response.json()),
      fetch('https://apidextek.fragomx.com/api/auth/status').then(response => response.json()),
      fetch('https://apidextek.fragomx.com/api/auth/clientes').then(response => response.json()),
      fetch('https://apidextek.fragomx.com/api/auth/usuarios').then(response => response.json())
    ])
      .then(([proyectosData, statusData, clientesData, usuariosData]) => {
        setProjects(proyectosData);
        setStatus(statusData);
        setClientes(clientesData);
        setUsuarios(usuariosData);
        setLoading(false); // Marca la carga como completada
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // En caso de error, marca la carga como completada
      });
  }, []);

  useEffect(() => {
    // Filtrar proyectos basado en la búsqueda
    const filtered = projects.filter(project =>
      (project.name_project || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.user_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.name_status || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([
      fetch('https://apidextek.fragomx.com/api/auth/proyectos').then(response => response.json()),
      fetch('https://apidextek.fragomx.com/api/auth/status').then(response => response.json()),
      fetch('https://apidextek.fragomx.com/api/auth/clientes').then(response => response.json()),
      fetch('https://apidextek.fragomx.com/api/auth/usuarios').then(response => response.json())
    ])
      .then(([proyectosData, statusData, clientesData, usuariosData]) => {
        setProjects(proyectosData);
        setStatus(statusData);
        setClientes(clientesData);
        setUsuarios(usuariosData);
        setRefreshing(false); // Marca la carga como completada
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setRefreshing(false); // En caso de error, marca la carga como completada
      });
  };

  const deleteProject = (projectId) => {
    fetch(`https://apidextek.fragomx.com/api/auth/eliminarproyecto/${projectId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        Alert.alert('Proyecto eliminado', data.message, [{ text: 'OK' }]);
        setProjects(projects.filter(project => project.id !== projectId));
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'No se pudo eliminar el proyecto.', [{ text: 'OK' }]);
      });
  };

  const confirmDeleteProject = (projectId) => {
    Alert.alert(
      'Eliminar Proyecto',
      '¿Estás seguro de que deseas eliminar este proyecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí', onPress: () => deleteProject(projectId) }
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
        <Text style={styles.text}>Proyectos</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, descripción, usuario, cliente o estado"
          placeholderTextColor="white"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.container}>
          {(searchQuery.length > 0 ? filteredProjects : projects).map(project => (
            <View key={project.id} style={styles.projectCard}>
              <Text style={styles.projectText}>Nombre: {project.name_project}</Text>
              <Text style={styles.projectText}>Descripción: {project.description}</Text>
              <Text style={styles.projectText}>Fecha límite: {project.deadline}</Text>
              <Text style={styles.projectText}>Estado: {project.name_status}</Text>
              <Text style={styles.projectText}>Usuario: {project.user_name}</Text>
              <Text style={styles.projectText}>Cliente: {project.client_name}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => navigation.navigate('UpdateProyecto', { projectId: project.id })}
                >
                  <Icon name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => confirmDeleteProject(project.id)}
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
        onPress={() => navigation.navigate('CreateProyecto')}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectCard: {
    top: 10,
    backgroundColor: 'gray',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  projectText: {
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
  text: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 35,
    top: 10,
  },
  searchInput: {
    height: 40,
    top: 20,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: 'white',
    alignSelf: 'center',
    width: '90%',
  },
});

export default CMEProyectos;