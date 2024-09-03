import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConsultarProyectosCliente = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Estado para manejar la acción de refrescar
  const [id_client, setIdClient] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('id_client');
        if (id !== null) {
          setIdClient(id);
        } else {
          console.error('ID del cliente no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener el ID del cliente:', error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (id_client) {
      fetchData();
    }
  }, [id_client]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.100.115:3000/api/auth/proyectoscliente/${id_client}`);
      if (!response.ok) {
        throw new Error('Error en la respuesta de la red');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../assets/fondos/fondo.jpg')} style={styles.background}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Text style={styles.text}>Mis Proyectos</Text>
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('AvanceTareas', { projectId: project.id, projectName: project.name_project })}
              >
                <Text style={styles.buttonText}>Mostrar Avance</Text>
              </TouchableOpacity>
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
  button: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConsultarProyectosCliente;
