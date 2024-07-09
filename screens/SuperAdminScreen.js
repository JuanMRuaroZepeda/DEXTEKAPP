// screens/SuperAdminScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon } from 'react-native-elements';

const SuperAdminScreen = ({ navigation, route }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    // Recuperar el nombre almacenado en AsyncStorage al cargar la pantalla
    AsyncStorage.getItem('name').then((value) => {
      setName(value);
    });
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    await AsyncStorage.removeItem('name'); // Eliminar el nombre al cerrar sesión
    navigation.navigate('Login');
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderMenu = () => (
    <ScrollView style={styles.menu}>
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
      <Button
        title="Cerrar Sesión"
        buttonStyle={styles.logoutButton} // Establecer el estilo del botón
        onPress={handleLogout}
      />
    </ScrollView>
  );

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
        {/* Contenedor para alinear horizontalmente */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Icon name="menu" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Bienvenido {'\n'} {name}</Text>
        </View>
        {/* Renderizar el menú si es visible */}
        {menuVisible && renderMenu()}
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
    top: -36,
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  header: {
    flexDirection: 'row', // Alinear horizontalmente los elementos
    alignItems: 'left', // Centrar verticalmente los elementos
    marginBottom: 1,
  },
  menuButton: {
    top: -30,
    marginLeft: 1, // Espacio entre el botón de menú y el texto de bienvenida
    marginRight: 15, // Espacio entre el botón de menú y el texto de bienvenida
  },
  menu: {
    position: 'absolute',
    top: 60,
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
  },
});

export default SuperAdminScreen;
