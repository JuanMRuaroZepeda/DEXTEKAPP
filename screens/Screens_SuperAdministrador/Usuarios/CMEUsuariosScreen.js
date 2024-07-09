import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de tener instalada esta dependencia

const CMEUsuariosScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetch('http://192.168.100.7:3000/api/auth/usuarios')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filtrar usuarios basado en la búsqueda
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getRoleText(user.id_role).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getStatusText(user.id_status).toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const getRoleText = (roleId) => {
    switch (roleId) {
      case 1: return 'Super Administrador';
      case 2: return 'Jefe de Área';
      case 3: return 'Trabajador';
      case 4: return 'Cliente';
      default: return 'Desconocido';
    }
  };

  const getStatusText = (statusId) => {
    switch (statusId) {
      case 1: return 'Activo';
      case 2: return 'Inactivo';
      case 3: return 'Suspendido';
      default: return 'Desconocido';
    }
  };

  const deleteUser = (userId) => {
    fetch(`http://192.168.100.7:3000/api/auth/eliminarusuario/${userId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        Alert.alert('Usuario eliminado', data.message, [{ text: 'OK' }]);
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'No se pudo eliminar el usuario.', [{ text: 'OK' }]);
      });
  };

  const confirmDeleteUser = (userId) => {
    Alert.alert(
      'Eliminar Usuario',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí', onPress: () => deleteUser(userId) }
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
        <Text style={styles.text}>Usuarios</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, correo, rol o estado"
          placeholderTextColor="white"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.container}>
          {(searchQuery.length > 0 ? filteredUsers : users).map(user => (
            <View key={user.id} style={styles.userCard}>
              <Text style={styles.userText}>Nombre: {user.name}</Text>
              <Text style={styles.userText}>Correo: {user.email}</Text>
              <Text style={styles.userText}>Rol: {getRoleText(user.id_role)}</Text>
              <Text style={styles.userText}>Status: {getStatusText(user.id_status)}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => navigation.navigate('UpdateUserScreen', { userId: user.id })}
                >
                  <Icon name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => confirmDeleteUser(user.id)}
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
        onPress={() => navigation.navigate('CreateUser')}
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
  userCard: {
    top: 10,
    backgroundColor: 'gray',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  userText: {
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
    top:20,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: 'white',
    alignSelf: 'center',
    width: '90%',
  },
});

export default CMEUsuariosScreen;