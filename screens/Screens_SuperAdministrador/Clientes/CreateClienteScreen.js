import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-elements';

const CreateClienteScreen = ({ navigation }) => {
    const [contac_name, setNameClient] = useState('');
    const [contac_email, setEmailClient] = useState('');
    const [contac_number, setNumberClient] = useState('');
    const [company_name, setCompanyClient] = useState('');
    const [company_address, setAddressClient] = useState('');
    const [company_number, setNumberCompany] = useState('');
    const [id_branch, setIdBranch] = useState('');
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = () => {
        fetch('http://192.168.100.115:3000/api/auth/sucursales')
        .then(response => response.json())
        .then(data => {
            setBranches(data);
        })
        .catch(error => {
           console.error('Error fetching branches:', error);
           Alert.alert('Error', 'No se pudo obtener la lista de sucursales.');
        });
    };

    const createCliente = () => {
        if (!contac_name || !contac_email || !contac_number || !company_name || !company_address || !company_number || !id_branch){
            Alert.alert('Error', 'Por favor, complete todos los campos.');
            return;
        }

        setLoading(true);
        const newClient = {
            contac_name,
            contac_email,
            contac_number,
            company_name,
            company_address,
            company_number,
            id_branch
        };

        fetch('http://192.168.100.115:3000/api/auth/clientnuevo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newClient),
        })
        .then(response => {
            if(!response.ok) {
                return response.json().then(err => { throw new Error(err.message); });
            }
            return response.json();
        })
        .then(data => {
            Alert.alert('Cliente creado', data.message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
        })
        .catch(error => {
            console.error('Error creating client:', error);
            Alert.alert('Error', 'No se pudo crear el cliente', [{ text: 'OK' }]);
        })
        .finally(() => setLoading(false));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ImageBackground source={require('../../../assets/fondos/fondo.jpg')} style={styles.background}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.text}>Nombre del Cliente:</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Nombre del Cliente'
                    placeholderTextColor="white"
                    value={contac_name}
                    onChangeText={text => setNameClient(text)}
                />
                <Text style={styles.text}>Correo Electrónico:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Correo Electrónico"
                    placeholderTextColor="white"
                    value={contac_email}
                    onChangeText={text => setEmailClient(text)}
                />
                <Text style={styles.text}>Número de Contacto:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Número de Contacto"
                    placeholderTextColor="white"
                    value={contac_number}
                    onChangeText={text => setNumberClient(text)}
                />
                <Text style={styles.text}>Nombre de la Empresa:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre de la Empresa"
                    placeholderTextColor="white"
                    value={company_name}
                    onChangeText={text => setCompanyClient(text)}
                />
                <Text style={styles.text}>Dirección de la Empresa:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Dirección de la Empresa"
                    placeholderTextColor="white"
                    value={company_address}
                    onChangeText={text => setAddressClient(text)}
                />
                <Text style={styles.text}>Número de la Empresa:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Número de la Empresa"
                    placeholderTextColor="white"
                    value={company_number}
                    onChangeText={text => setNumberCompany(text)}
                />
                <Text style={styles.text}>Sucursal:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={id_branch}
                        style={styles.picker}
                        onValueChange={(itemValue) => setIdBranch(itemValue)}
                    >
                        <Picker.Item label="Seleccione una Opción" value="" />
                        {branches.map(branch => (
                            <Picker.Item key={branch.id} label={branch.name_branch} value={branch.id} />
                        ))}
                    </Picker>
                </View>
                <Button
                    title="Crear Cliente"
                    buttonStyle={styles.button2}
                    onPress={createCliente}
                />
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
      },
      container: {
        padding: 20,
      },
      text: {
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'white',
        marginBottom: 10,
      },
      pickerContainer: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
      },
      picker: {
        height: 40,
        width: '100%',
        color: 'white',
      },
      dateButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
      },
      button: {
        backgroundColor: 'red', // Establece el color de fondo rojo
        padding: 10, // Ajusta el padding según tus necesidades
        borderRadius: 5, // Opcional: agrega bordes redondeados
        alignItems: 'center', // Opcional: centra el texto
      },
      buttonText: {
        color: 'white', // Cambia el color del texto a blanco para contrastar con el fondo rojo
        fontSize: 16, // Ajusta el tamaño de la fuente según tus necesidades
      },
      button2: {
        backgroundColor: 'green', // Establece el color de fondo rojo
        padding: 10, // Ajusta el padding según tus necesidades
        borderRadius: 5, // Opcional: agrega bordes redondeados
        alignItems: 'center', // Opcional: centra el texto
      },
});

export default CreateClienteScreen;