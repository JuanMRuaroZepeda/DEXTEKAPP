import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';

const ConsultarUsuarios = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filtrar usuarios basado en la búsqueda
    const filtered = users.filter(user =>
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.lastname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getPositionText(user.id_positionCompany) || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getBranchText(user.id_branch) || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getDepartmentText(user.id_department) || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getContractText(user.id_contract) || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getJobTitleText(user.id_jobTitle) || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getRoleText(user.id_role) || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getStatusText(user.id_status) || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = () => {
    fetch('http://192.168.100.7:3000/api/auth/usuarios2')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
    setRefreshing(false);
  };

  const getPositionText = (positionId) => {
    switch (positionId) {
      case 1: return 'Manager';
      case 2: return 'Developer';
      case 3: return 'Designer';
      default: return 'Desconocido';
    }
  };

  const getBranchText = (branchId) => {
    switch (branchId) {
      case 1: return 'New York';
      case 2: return 'Los Angeles';
      case 3: return 'Chicago';
      default: return 'Desconocido';
    }
  };

  const getDepartmentText = (departmentId) => {
    switch (departmentId) {
      case 1: return 'IT';
      case 2: return 'HR';
      case 3: return 'Sales';
      default: return 'Desconocido';
    }
  };

  const getContractText = (contractId) => {
    switch (contractId) {
      case 1: return 'Full-time';
      case 2: return 'Part-time';
      case 3: return 'Freelance';
      default: return 'Desconocido';
    }
  };

  const getJobTitleText = (jobTitleId) => {
    switch (jobTitleId) {
      case 1: return 'Senior Developer';
      case 2: return 'Junior Developer';
      case 3: return 'Intern';
      default: return 'Desconocido';
    }
  };

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
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Text style={styles.text}>{'\n'}Usuarios</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, apellido, usuario, documento, rol o estado"
          placeholderTextColor="white"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.container}>
          {(searchQuery.length > 0 ? filteredUsers : users).map(user => (
            <View key={user.id} style={styles.userCard}>
              <Text style={styles.userText}>Nombre: {user.name || ''}</Text>
              <Text style={styles.userText}>Apellido: {user.lastname || ''}</Text>
              <Text style={styles.userText}>Usuario: {user.username || ''}</Text>
              <Text style={styles.userText}>Posición: {getPositionText(user.id_positionCompany) || ''}</Text>
              <Text style={styles.userText}>Sucursal: {getBranchText(user.id_branch) || ''}</Text>
              <Text style={styles.userText}>Departamento: {getDepartmentText(user.id_department) || ''}</Text>
              <Text style={styles.userText}>Fecha de Inicio: {user.date_start || ''}</Text>
              <Text style={styles.userText}>Contrato: {getContractText(user.id_contract) || ''}</Text>
              <Text style={styles.userText}>Título del Trabajo: {getJobTitleText(user.id_jobTitle) || ''}</Text>
              <Text style={styles.userText}>Rol: {getRoleText(user.id_role) || ''}</Text>
              <Text style={styles.userText}>Status: {getStatusText(user.id_status) || ''}</Text>
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
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  userText: {
    fontSize: 16,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#F8DC6B',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#EC4B4B',
    padding: 10,
    borderRadius: 5,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 140,
    bottom: 30,
    backgroundColor: 'green',
    borderRadius: 60,
    elevation: 10,
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    padding: 10,
    color: 'white',
    marginBottom: 20,
    alignSelf: 'center',
    width: '90%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ConsultarUsuarios;