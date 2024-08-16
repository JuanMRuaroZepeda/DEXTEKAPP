import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const TareasProyecto = ({ route }) => {
  const { projectId } = route.params;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.1.3:3000/api/auth/tareasporproyectos/${projectId}`);
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks().finally(() => setRefreshing(false));
  };

  const handleDocumentPick = async (taskId) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type === 'success') {
        const formData = new FormData();
        formData.append('task_document', {
          uri: result.uri,
          name: result.name,
          type: result.mimeType || 'application/octet-stream',
        });

        const response = await axios.post(`http://192.168.1.3:3000/api/auth/evidenciatarea`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          Alert.alert('Éxito', 'Evidencia subida correctamente');
          //updateTaskStatus(taskId);
        } else {
          Alert.alert('Error', 'No se pudo subir la evidencia');
        }
      }
    } catch (error) {
      console.error('Error seleccionando el archivo:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const updateTaskStatus = async (taskId) => {
    try {
      const response = await axios.patch(`http://192.168.1.3:3000/api/auth/updateTaskStatus/${taskId}`, {
        // Aquí podrías enviar datos adicionales si es necesario
      });

      if (response.status === 200) {
        Alert.alert('Éxito', 'Estado de tarea actualizado correctamente');
        fetchTasks(); // Actualizar la lista de tareas después de subir la evidencia
      } else {
        Alert.alert('Error', 'No se pudo actualizar el estado de la tarea');
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado de la tarea');
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="red" />
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
        <Text style={styles.text}>Tareas del Proyecto</Text>
        <View style={styles.container}>
          {tasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <Text style={styles.taskText}>id: {task.id}</Text>
              <Text style={styles.taskText}>Nombre: {task.name_task}</Text>
              <Text style={styles.taskText}>Descripción: {task.description}</Text>
              <Text style={styles.taskText}>Fecha límite: {task.deadline}</Text>
              <Text style={styles.taskText}>Estado: {task.name_status}</Text>
              <Text style={styles.taskText}>Usuario: {task.user_name}</Text>
              
              <TouchableOpacity style={styles.uploadButton} onPress={() => handleDocumentPick(task.id)}>
                <Text style={styles.uploadButtonText}>Subir Evidencia</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.updateButton} onPress={() => updateTaskStatus(task.id)}>
                <Text style={styles.updateButtonText}>Actualizar Estado</Text>
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
  taskCard: {
    backgroundColor: 'rgba(10, 20, 20, 0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  taskText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  uploadButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  updateButtonText: {
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

export default TareasProyecto;
