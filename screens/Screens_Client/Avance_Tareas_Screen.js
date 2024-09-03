import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, RefreshControl, Alert, Animated } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const AvanceTareas = ({ route, navigation }) => {
  const { projectId, projectName } = route.params;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [document, setDocument] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    animateProgressBar(completionPercentage);
  }, [completionPercentage]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.100.115:3000/api/auth/tareasporproyectos/${projectId}`);
      const data = await response.json();
      const tasksArray = Array.isArray(data) ? data : [];

      setTasks(tasksArray);

      const completedTasks = tasksArray.filter(task => task.name_status === 'Finalizado').length;
      const totalTasks = tasksArray.length;
      const percentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

      setCompletionPercentage(percentage);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const animateProgressBar = (percentage) => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 1000, // Duración de la animación
      useNativeDriver: false,
    }).start();
  };

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
  };

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
        <Text style={styles.text}>Tareas del Proyecto {projectName}</Text>

        <Text style={styles.text}>Progreso: {Math.round(completionPercentage)}%</Text>
        <ProgressBar animatedWidth={animatedWidth} />

        <View style={styles.container}>
          {tasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <Text style={styles.taskText}>Nombre: {task.name_task}</Text>
              <Text style={styles.taskText}>Descripción: {task.description}</Text>
              <Text style={styles.taskText}>Fecha límite: {task.deadline}</Text>
              <Text style={styles.taskText}>Estado: {task.name_status}</Text>
              <Text style={styles.taskText}>Usuario: {task.user_name}</Text>

              {task.name_status === 'Finalizado' ? (
                <Text style={styles.evidenceText}>Proceso Terminado</Text>
              ) : (
                <Text style={styles.evidenceText}>En proceso</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const ProgressBar = ({ animatedWidth }) => {
  const animatedStyle = {
    width: animatedWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    }),
  };

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBar, animatedStyle]} />
    </View>
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
    marginVertical: 15,
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
  evidenceText: {
    color: 'red',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
  progressBarContainer: {
    height: 30,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AvanceTareas;