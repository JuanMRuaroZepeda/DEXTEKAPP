import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de tener instalada esta dependencia

const CMEUsuariosScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para datos adicionales
  const [positions, setPositions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchPositions();
    fetchBranches();
    fetchDepartments();
    fetchContracts();
    fetchJobTitles();
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
  }, [searchQuery, users, positions, branches, departments, contracts, jobTitles]);

  const fetchUsers = () => {
    fetch('http://192.168.1.3:3000/api/auth/usuarios2')
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

  const fetchPositions = () => {
    fetch('http://192.168.1.3:3000/api/auth/positions')
      .then(response => response.json())
      .then(data => setPositions(data))
      .catch(error => {
        console.error('Error fetching Positions:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de posiciones.');
      });
  };

  const fetchBranches = () => {
    fetch('http://192.168.1.3:3000/api/auth/sucursales')
      .then(response => response.json())
      .then(data => setBranches(data))
      .catch(error => {
        console.error('Error fetching Branches:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de sucursales.');
      });
  };

  const fetchDepartments = () => {
    fetch('http://192.168.1.3:3000/api/auth/departamentos')
      .then(response => response.json())
      .then(data => setDepartments(data))
      .catch(error => {
        console.error('Error fetching Departments:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de departamentos.');
      });
  };

  const fetchContracts = () => {
    fetch('http://192.168.1.3:3000/api/auth/contratos')
      .then(response => response.json())
      .then(data => setContracts(data))
      .catch(error => {
        console.error('Error fetching Contracts:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de contratos.');
      });
  };

  const fetchJobTitles = () => {
    fetch('http://192.168.1.3:3000/api/auth/jobstitles')
      .then(response => response.json())
      .then(data => setJobTitles(data))
      .catch(error => {
        console.error('Error fetching JobTitles:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de títulos de trabajo.');
      });
  };

  const getPositionText = (positionId) => {
    const position = positions.find(p => p.id === positionId);
    return position ? position.name_position : 'Desconocido';
  };

  const getBranchText = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name_branch : 'Desconocido';
  };

  const getDepartmentText = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name_departament : 'Desconocido';
  };

  const getContractText = (contractId) => {
    const contract = contracts.find(c => c.id === contractId);
    return contract ? contract.name_contrat : 'Desconocido';
  };

  const getJobTitleText = (jobTitleId) => {
    const jobTitle = jobTitles.find(j => j.id === jobTitleId);
    return jobTitle ? jobTitle.name_jobTitle : 'Desconocido';
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
    fetch(`http://192.168.1.3:3000/api/auth/eliminarusuario/${userId}`, {
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
              <Text style={styles.userText}>Posición: {getPositionText(user.id_positionCompany)}</Text>
              <Text style={styles.userText}>Sucursal: {getBranchText(user.id_branch)}</Text>
              <Text style={styles.userText}>Departamento: {getDepartmentText(user.id_department)}</Text>
              <Text style={styles.userText}>Contrato: {getContractText(user.id_contract)}</Text>
              <Text style={styles.userText}>Título: {getJobTitleText(user.id_jobTitle)}</Text>
              <Text style={styles.userText}>Rol: {getRoleText(user.id_role)}</Text>
              <Text style={styles.userText}>Estado: {getStatusText(user.id_status)}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonUpdate}
                  onPress={() => navigation.navigate('UpdateUserScreen', { userId: user.id })}
                >
                  <Icon name="pencil" size={25} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonDelete}
                  onPress={() => confirmDeleteUser(user.id)}
                >
                  <Icon name="trash-outline" size={25} color="#fff" />
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
          <Icon name="add" size={25} color="#fff" />
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

export default CMEUsuariosScreen;