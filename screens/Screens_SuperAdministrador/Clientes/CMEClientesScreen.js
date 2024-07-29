import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de tener instalada esta dependencia

const CMEClientes = ({ navigation }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetch('https://apidextek.fragomx.com/api/auth/clientes')
      .then(response => response.json())
      .then(clientesData => {
        setClientes(clientesData);
        setLoading(false); // Marca la carga como completada
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

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
    fetch('https://apidextek.fragomx.com/api/auth/clientes')
      .then(response => response.json())
      .then(clientesData => {
        setClientes(clientesData);
        setRefreshing(false); // Marca la carga como completada
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setRefreshing(false); // En caso de error, marca la carga como completada
      });
  };

  const deleteCliente = (clienteId) => {
    fetch(`https://apidextek.fragomx.com/api/auth/eliminarcliente/${clienteId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        Alert.alert('Cliente eliminado', data.message, [{ text: 'OK' }]);
        setClientes(clientes.filter(cliente => cliente.id !== clienteId));
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'No se pudo eliminar el cliente.', [{ text: 'OK' }]);
      });
  };

  const confirmDeleteCliente = (clienteId) => {
    Alert.alert(
      'Eliminar Cliente',
      '¿Estás seguro de que deseas eliminar este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí', onPress: () => deleteCliente(clienteId) }
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
            <View key={cliente.id} style={styles.card}>
              <Text style={styles.text}>Nombre del Contacto: {cliente.contac_name}</Text>
              <Text style={styles.text}>Correo Electronico: {cliente.contac_email}</Text>
              <Text style={styles.text}>Numero de Telefono: {cliente.contac_number}</Text>
              <Text style={styles.text}>Nombre de la Compañia: {cliente.company_name}</Text>
              <Text style={styles.text}>Dirección: {cliente.company_address}</Text>
              <Text style={styles.text}>Numero de la Compañia: {cliente.company_number}</Text>
              <Text style={styles.text}>Sucursal: {cliente.name_branch}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => navigation.navigate('UpdateCliente', { clienteId: cliente.id })}
                >
                  <Icon name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => confirmDeleteCliente(cliente.id)}
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
        onPress={() => navigation.navigate('CreateCliente')}
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
  card: {
    top: 10,
    backgroundColor: 'gray',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  text: {
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
  texttitle: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 35,
    top: 10,
  },
});

export default CMEClientes;