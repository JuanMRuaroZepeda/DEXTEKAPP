import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-elements';

const UpdateClienteScreen = ({ route, navigation }) => {
    const { clienteId } = route.params;
    const [contac_name, setNameClient] = useState('');
    const [contac_email, setEmailClient] = useState('');
    const [contac_number, setNumberClient] = useState('');
    const [company_name, setCompanyClient] = useState('');
    const [company_address, setAddressClient] = useState('');
    const [company_number, setNumberCompany] = useState('');
    const [id_branch, setIdBranch] = useState('');
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = () => {
        fetch('http://192.168.100.7:3000/api/auth/sucursales')
            .then(response => response.json())
            .then(data => {
                setBranches(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching branches:', error);
                Alert.alert('Error', 'No se pudo obtener la lista de sucursales.');
                setLoading(false);
            });
    };

    const updateCliente = () => {
        if (!contac_name || !contac_email || !contac_number || !company_name || !company_address || !company_number || !id_branch) {
            Alert.alert('Error', 'Por favor, complete todos los campos.');
            return;
        }

        setLoading(true);
        const updatedClient = {
            contac_name,
            contac_email,
            contac_number,
            company_name,
            company_address,
            company_number,
            id_branch
        };

        fetch(`http://192.168.100.7:3000/api/auth/actualizarcliente/${clienteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedClient),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message); });
                }
                return response.json();
            })
            .then(data => {
                Alert.alert('Cliente actualizado', data.message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
            })
            .catch(error => {
                console.error('Error updating client:', error);
                Alert.alert('Error', 'No se pudo actualizar el cliente', [{ text: 'OK' }]);
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
                    title="Actualizar Cliente"
                    buttonStyle={styles.createButton}
                    onPress={updateCliente}
                />
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
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    input: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        color: 'white',
    },
    text: {
        color: 'white',
        marginBottom: 8,
    },
    pickerContainer: {
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 12,
    },
    picker: {
        height: 40,
        color: 'white',
    },
    createButton: {
        backgroundColor: 'green',
        borderRadius: 5,
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default UpdateClienteScreen;