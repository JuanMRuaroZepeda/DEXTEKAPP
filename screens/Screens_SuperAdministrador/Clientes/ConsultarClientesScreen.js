import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de tener instalada esta dependencia

const ConsultarClientes = ({ navigation }) => {
  
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Estado para manejar la acción de refrescar

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch('http://apidextek.fragomx.com/api/auth/clientes')
      .then(response => response.json())
      .then(clientesData => {
        setClientes(clientesData);
        setLoading(false); // Marca la carga como completada
        setRefreshing(false); // Marca la carga como completada
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
        setRefreshing(false); // En caso de error, marca la carga como completada
      });
  };

  useEffect(() => {
    const filtered = clientes.filter(cliente =>
      (cliente.contac_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cliente.contac_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cliente.contac_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cliente.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cliente.company_address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cliente.company_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cliente.name_branch || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClientes(filtered);
  }, [searchQuery, clientes]);

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
        <Text style={styles.texttitle}>Clientes</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, correo electrónico, número de contacto, nombre de compañía, dirección, nombre de empresa a cargo"
          placeholderTextColor="white"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.container}>
          {(searchQuery.length > 0 ? filteredClientes : clientes).map(cliente => (
            <View key={cliente.id} style={styles.userCard}>
              <Text style={styles.userText}>Nombre del Contacto: {cliente.contac_name}</Text>
              <Text style={styles.userText}>Correo Electronico: {cliente.contac_email}</Text>
              <Text style={styles.userText}>Numero de Telefono: {cliente.contac_number}</Text>
              <Text style={styles.userText}>Nombre de la Compañia: {cliente.company_name}</Text>
              <Text style={styles.userText}>Dirección: {cliente.company_address}</Text>
              <Text style={styles.userText}>Numero de la Compañia: {cliente.company_number}</Text>
              <Text style={styles.userText}>Sucursal: {cliente.name_branch}</Text>
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

export default ConsultarClientes;