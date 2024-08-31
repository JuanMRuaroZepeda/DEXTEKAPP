import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, RefreshControl, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const MisTareas = ({ route, navigation }) => {
    const { projectId, projectName, userId } = route.params; // Recibe userId
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTasks, setFilteredTasks] = useState([]);
  
    const [document, setDocument] = useState(null);
  
    useEffect(() => {
      fetchTasks();
    }, []);
  
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // Modifica la URL para incluir el userId
        const response = await fetch(`http://192.168.100.115:3000/api/auth/mistareaspersonales/${userId}`);
        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
        setFilteredTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        Alert.alert('Error', 'No se pudieron cargar las tareas');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      const filtered = tasks.filter(task =>
        (task.name_task || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.name_status || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.user_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.name_project || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(filtered);
    }, [searchQuery, tasks]);

    const handleDocumentPick = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({});
        
        if (result.canceled) return;
    
        if (result.assets && result.assets.length > 0) {
          const selectedDocument = result.assets[0];
          setDocument(selectedDocument);
        }
      } catch (error) {
        console.error('Error picking document:', error);
        Alert.alert('Error', 'No se pudo seleccionar el documento.');
      }
    };

    const onRefresh = () => {
      setRefreshing(true);
      fetchTasks().finally(() => setRefreshing(false));
    };

    const createEvidence = async (taskId) => {
      if (!taskId) {
        Alert.alert('Error del Servidor', 'Error del Servidor.', [{ text: 'OK' }]);
        return;
      }

      const formData = new FormData();
      formData.append('id_task', taskId);

      if (document) {
        const fileUri = document.uri;
        const fileName = document.name;
        const fileType = document.mimeType;

        formData.append('task_document', {
          uri: fileUri,
          type: fileType,
          name: fileName,
        });
      }

      try {
        const response = await axios.post(`http://192.168.100.115:3000/api/auth/evidenciatarea`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status !== 200) {
          throw new Error(response.data.message || 'Ocurrió un error al subir la evidencia');
        }
        Alert.alert('Evidencia Subida Correctamente', response.data.message, [{ text: 'OK' }]);
        updateTaskStatus(taskId);
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        Alert.alert('Error', error.response ? error.response.data.message : 'No se pudo conectar con la API');
      }
    }

    const updateTaskStatus = async (taskId) => {
      try {
        const response = await axios.patch(`http://192.168.100.115:3000/api/auth/updateTaskStatus/${taskId}`);

        if (response.status === 200) {
          fetchTasks();
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
          <Text style={styles.text}>Mis Tareas Generales</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, descripción, estado, usuario o proyecto"
            placeholderTextColor="white"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.container}>
            {(searchQuery.length > 0 ? filteredTasks : tasks).map(task => (
              <View key={task.id} style={styles.taskCard}>
                <Text style={styles.taskText}>Nombre: {task.name_task}</Text>
                <Text style={styles.taskText}>Descripción: {task.description}</Text>
                <Text style={styles.taskText}>Fecha límite: {task.deadline}</Text>
                <Text style={styles.taskText}>Estado: {task.name_status}</Text>
                <Text style={styles.taskText}>Usuario: {task.user_name}</Text>
                <Text style={styles.taskText}>Proyecto: {task.name_project}</Text>

                {task.name_status === 'Finalizado' ? (
                  <Text style={styles.evidenceText}>Evidencia ya enviada</Text>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={handleDocumentPick}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>
                        {document ? document.name : 'Selecciona un Documento'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.updateButton}
                      onPress={() => createEvidence(task.id)}
                    >
                      <Text style={styles.updateButtonText}>Enviar Evidencia</Text>
                    </TouchableOpacity>
                  </>
                )}
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
  evidenceText: {
    color: 'red',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
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
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MisTareas;
