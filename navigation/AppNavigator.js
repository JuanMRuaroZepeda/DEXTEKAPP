//navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import SuperAdminScreen from '../screens/SuperAdminScreen';
import AreaManagerScreen from '../screens/AreaManagerScreen';
import WorkerScreen from '../screens/WorkerScreen';
import ClientScreen from '../screens/ClientScreen';

// Importar las pantallas de Usuarios
import CMEUsuariosScreen from '../screens/Screens_SuperAdministrador/Usuarios/CMEUsuariosScreen';
import CreateUserScreen from '../screens/Screens_SuperAdministrador/Usuarios/CreateUserScreen';
import UpdateUserScreen from '../screens/Screens_SuperAdministrador/Usuarios/UpdateUserScreen';
import ConsultarUsuariosScreen from '../screens/Screens_SuperAdministrador/Usuarios/ConsultarUsuariosScreen';

// Importar las pantallas de Proyectos
import CMEProyectosScreen from '../screens/Screens_SuperAdministrador/Proyectos/CMEProyectosScreen';
import CreateProyectoScreen from '../screens/Screens_SuperAdministrador/Proyectos/CreateProjectScreen';
import UpdateProyectoScreen from '../screens/Screens_SuperAdministrador/Proyectos/UpdateProjectScreen';
import ConsultarProyectosScreen from '../screens/Screens_SuperAdministrador/Proyectos/ConsultarProyectosScreen';

// Importar las pantallas de Tareas
import CMETareasScreen from '../screens/Screens_SuperAdministrador/Tareas/CMETareasScreen';
import CreateTareaScreen from '../screens/Screens_SuperAdministrador/Tareas/CreateTareaScreen';
import UpdateTareaScreen from '../screens/Screens_SuperAdministrador/Tareas/UpdateTareaScreen';
import ConsultarTareasScreen from '../screens/Screens_SuperAdministrador/Tareas/ConsultarTareasScreen';

// Importar las pantallas de Clientes
import CMEClientesScreen from '../screens/Screens_SuperAdministrador/Clientes/CMEClientesScreen';
import CreateClienteScreen from '../screens/Screens_SuperAdministrador/Clientes/CreateClienteScreen';
import UpdateClienteScreen from '../screens/Screens_SuperAdministrador/Clientes/UpdateClienteScreen';
import ConsultarClientesScreen from '../screens/Screens_SuperAdministrador/Clientes/ConsultarClientesScreen';
import ConsultarProyectosCliente from '../screens/Screens_Client/Consultar_ProyectosClienteScreen';
import AvanceTareas from '../screens/Screens_Client/Avance_Tareas_Screen';

//Trabajador
import ConsultarProyectosTrabajador from '../screens/Screens_Worker/Consultar_Proyectos_Screen';
import ConsultarProyectos2 from '../screens/Screens_Worker/Consultar_Proyectos2';
import TareasProyecto from '../screens/Screens_Worker/TareasProyectoScreen';
import MisTareas from '../screens/Screens_Worker/Mis_TareasScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
        }}
      >

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Inicio de sesión', headerLeft: () => null }}
        />

        <Stack.Screen
          name="SuperAdmin"
          component={SuperAdminScreen}
          options={{ title: 'Super Administrador', headerLeft: () => null }}
        />

        <Stack.Screen
          name="CMEUsuario"
          component={CMEUsuariosScreen}
          options={{ title: 'Crea/Modifica/Elimina Usuarios' }}
        />

        <Stack.Screen
        name="CreateUser"
        component={CreateUserScreen}
        options={{ title: 'Crear Nuevo Usuario' }}
        />

        <Stack.Screen
        name="UpdateUserScreen"
        component={UpdateUserScreen}
        options={{ title: 'Modificar Usuario' }}
        />

        <Stack.Screen
          name="ConsultarUsuarios"
          component={ConsultarUsuariosScreen}
          options={{ title: 'Consultar Usuarios' }}
        />

        <Stack.Screen
          name="CMEProyectos"
          component={CMEProyectosScreen}
          options={{ title: 'Crear/Modificar/Eliminar Proyectos' }}
        />

        <Stack.Screen
        name="CreateProyecto"
        component={CreateProyectoScreen}
        options={{ title: 'Crear Nuevo Proyecto' }}
        />

        <Stack.Screen
        name="UpdateProyecto"
        component={UpdateProyectoScreen}
        options={{ title: 'Modificar Proyecto' }}
        />

        <Stack.Screen
          name="ConsultarProyectos"
          component={ConsultarProyectosScreen}
          options={{ title: 'Consultar Proyectos' }}
        />

        <Stack.Screen
          name="CMETareas"
          component={CMETareasScreen}
          options={{ title: 'Crear/Modificar/Eliminar Tareas' }}
        />

        <Stack.Screen
        name="CreateTarea"
        component={CreateTareaScreen}
        options={{ title: 'Crear Nueva Tarea' }}
        />
        
        <Stack.Screen
        name="UpdateTarea"
        component={UpdateTareaScreen}
        options={{ title: 'Modificar Tarea' }}
        />

        <Stack.Screen
          name="ConsultarTareas"
          component={ConsultarTareasScreen}
          options={{ title: 'Consultar Tareas' }}
        />

        <Stack.Screen
          name="CMEClientes"
          component={CMEClientesScreen}
          options={{ title: 'Crear/Modificar/Eliminar Clientes' }}
        />

        <Stack.Screen
        name="CreateCliente"
        component={CreateClienteScreen}
        options={{ title: 'Crear Cliente' }}
        />

        <Stack.Screen
        name="UpdateCliente"
        component={UpdateClienteScreen}
        options={{ title: 'Modificar Cliente' }}
        />
        
        <Stack.Screen
          name="ConsultarClientes"
          component={ConsultarClientesScreen}
          options={{ title: 'Consultar Clientes' }}
        />

        <Stack.Screen
          name="AreaManager"
          component={AreaManagerScreen}
          options={{ title: 'Jefe de Área', headerLeft: () => null }}
        />
        <Stack.Screen
          name="Worker"
          component={WorkerScreen}
          options={{ title: 'Trabajador', headerLeft: () => null }}
        />

        <Stack.Screen
        name="ConsultarProyectosTrabajador"
        component={ConsultarProyectosTrabajador}
        options={{title: 'Mis Proyectos'}}
        />

        <Stack.Screen
        name="ConsultarProyectos2"
        component={ConsultarProyectos2}
        options={{title: 'Selecciona un Proyecto'}}
        />

        <Stack.Screen
        name="TareasProyecto"
        component={TareasProyecto}
        options={{title: 'Tareas del Proyecto'}}
        />

        <Stack.Screen
        name="MisTareas"
        component={MisTareas}
        options={{title: 'Mis Tareas'}}
        />

        <Stack.Screen
          name="Client"
          component={ClientScreen}
          options={{ title: 'Cliente', headerLeft: () => null }}
        />

        <Stack.Screen
        name="MisProyectosCliente"
        component={ConsultarProyectosCliente}
        options={{title: 'Mis Proyectos'}}
        />

        <Stack.Screen
        name="AvanceTareas"
        component={AvanceTareas}
        options={{title: 'Avance del Proyecto'}}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

/* navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import SuperAdminScreen from '../screens/SuperAdminScreen';
import AreaManagerScreen from '../screens/AreaManagerScreen';
import WorkerScreen from '../screens/WorkerScreen';
import ClientScreen from '../screens/ClientScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SuperAdmin" component={SuperAdminScreen} />
        <Stack.Screen name="AreaManager" component={AreaManagerScreen} />
        <Stack.Screen name="Worker" component={WorkerScreen} />
        <Stack.Screen name="Client" component={ClientScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
*/