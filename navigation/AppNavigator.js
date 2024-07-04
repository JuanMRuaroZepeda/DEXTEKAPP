import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SuperAdminScreen from '../screens/SuperAdminScreen';
import AreaManagerScreen from '../screens/AreaManagerScreen';
import WorkerScreen from '../screens/WorkerScreen';
import ClientScreen from '../screens/ClientScreen';

const Stack = createStackNavigator();

const AppNavigator = ({ isLoggedIn }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="SuperAdmin" component={SuperAdminScreen} />
            <Stack.Screen name="AreaManager" component={AreaManagerScreen} />
            <Stack.Screen name="Worker" component={WorkerScreen} />
            <Stack.Screen name="Client" component={ClientScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;