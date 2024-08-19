import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ConsultarProyectos = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Estado para manejar la acción de refrescar

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('http://192.168.1.78:3000/api/auth/proyectos').then(response => response.json()),
      fetch('http://192.168.1.78:3000/api/auth/status').then(response => response.json()),
      fetch('http://192.168.1.78:3000/api/auth/clientes').then(response => response.json()),
      fetch('http://192.168.1.78:3000/api/auth/usuarios').then(response => response.json())
    ])
    .then(([proyectosData, statusData, clientesData, usuariosData]) => {
      setProjects(proyectosData);
      setStatus(statusData);
      setClientes(clientesData);
      setUsuarios(usuariosData);
      setLoading(false); // Marca la carga como completada
      setRefreshing(false); // Marca la carga como completada
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false); // En caso de error, marca la carga como completada
      setRefreshing(false); // En caso de error, marca la carga como completada
    });
  };

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
    fetchData();
  };

  if (loading && !refreshing) {
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
            <View key={project.id} style={styles.userCard}>
              <Text style={styles.userText}>Nombre: {project.name_project}</Text>
              <Text style={styles.userText}>Descripción: {project.description}</Text>
              <Text style={styles.userText}>Fecha límite: {project.deadline}</Text>
              <Text style={styles.userText}>Estado: {project.name_status}</Text>
              <Text style={styles.userText}>Usuario: {project.user_name}</Text>
              <Text style={styles.userText}>Cliente: {project.client_name}</Text>
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
export default ConsultarProyectos;