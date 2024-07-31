import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,ImageBackground,TouchableOpacity,ScrollView,RefreshControl,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de usar un único import

const SuperAdminScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('name').then((value) => {
      setName(value);
    });
    AsyncStorage.getItem('lastname').then((value) => {
      setLastname(value);
    });
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    await AsyncStorage.removeItem('name');
    await AsyncStorage.removeItem('lastname');
    navigation.navigate('Login');
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      // Lógica adicional para actualizar los datos aquí
    }, 2000);
  };

  const renderMenuItem = (title, subItems) => (
    <View key={title} style={styles.menuItem}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subItems.map((subItem) => (
        <TouchableOpacity
          key={subItem.title}
          onPress={() => navigation.navigate(subItem.screen)}
          style={styles.subMenuItem}
        >
          <Text style={styles.subMenuText}>{subItem.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/fondos/fondo2.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Icon name="bars" size={35} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Bienvenido {'\n'} {name} {lastname}</Text>
        </View>
        {menuVisible && (
          <View style={styles.menu}>
            {renderMenuItem('Usuarios', [
              { title: 'Crear/Modificar/Eliminar', screen: 'CMEUsuario' },
              { title: 'Consultar Usuarios', screen: 'ConsultarUsuarios' },
            ])}
            {renderMenuItem('Proyectos', [
              { title: 'Crear/Modificar/Eliminar', screen: 'CMEProyectos' },
              { title: 'Consultar Proyectos', screen: 'ConsultarProyectos' },
            ])}
            {renderMenuItem('Tareas', [
              { title: 'Crear/Modificar/Eliminar', screen: 'CMETareas' },
              { title: 'Consultar Tareas', screen: 'ConsultarTareas' },
            ])}
            {renderMenuItem('Clientes', [
              { title: 'Crear/Modificar/Eliminar', screen: 'CMEClientes' },
              { title: 'Consultar Clientes', screen: 'ConsultarClientes' },
            ])}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        )}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate('ConsultarUsuarios')}>
              <Icon name="user" size={50} color="white" />
              <Text style={styles.buttonText}>Consultar Usuarios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate('ConsultarProyectos')}>
              <Icon name="briefcase" size={50} color="white" />
              <Text style={styles.buttonText}>Consultar Proyectos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate('ConsultarTareas')}>
              <Icon name="tasks" size={50} color="white" />
              <Text style={styles.buttonText}>Consultar Tareas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate('ConsultarClientes')}>
              <Icon name="user-circle" size={50} color="white" />
              <Text style={styles.buttonText}>Consultar Clientes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  title: {
    top: -22,
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    top: -35,
    marginRight: 20,
  },
  menu: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: '#717171',
    borderRadius: 8,
    padding: 10,
    zIndex: 1,
  },
  menuItem: {
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subMenuItem: {
    paddingLeft: 10,
    paddingVertical: 5,
  },
  subMenuText: {
    fontSize: 16,
    color: 'white',
  },
  logoutButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Ajustar para alinear los botones arriba
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 10, // Ajustar el espacio superior e inferior
  },
  bigButton: {
    backgroundColor: 'black', // Color de fondo rojo
    borderRadius: 20,
    width: '80%',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5,
  },
  buttonText: {
    color: 'white', // Texto en blanco
    fontSize: 18,
    marginTop: 10,
  },
});

export default SuperAdminScreen;