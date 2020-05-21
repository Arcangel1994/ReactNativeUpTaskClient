import React, {useState} from 'react';
import {View} from 'react-native';
import {
    Container,
    Button,
    Text,
    H1,
    Input,
    Form,
    Item,
    Toast
} from 'native-base'

import {useNavigation} from '@react-navigation/native'

import globalStyles from '../styles/globalstyles';

import {gql, useMutation} from '@apollo/client'

const NUEVA_CUENTA = gql`
    mutation crearUsuario($input: UsuarioInput ){
        crearUsuario(input:$input)
    }
`;

const CrearCuenta = () => {

    const navigation = useNavigation();

    const [nombre, guardarNombre] = useState('');
    const [email, guardarEmail] = useState('');
    const [password, guardarPassword] = useState('');

    const [mensaje, guardarMensaje] = useState(null);

    const [crearUsuario] = useMutation(NUEVA_CUENTA);

    const handleSubmit = async () => {

        if(nombre === '' || email === '' || password === ''){
            guardarMensaje('Todos los campos son obligatorios');
            return;
        }

        if(password.length < 6){
            guardarMensaje('Contraseña mayor a 6 caracteres');
            return;
        }

        try{
            const {data} = await crearUsuario({
                variables:{
                    input: {
                        nombre,
                        email,
                        password
                    }
                }
            });

            console.log(data);
            guardarNombre('')
            guardarEmail('')
            guardarPassword('')
            guardarMensaje(data.crearUsuario);
            navigation.goBack();

        }catch(error){
            guardarMensaje(error.message.replace('GraphQL error: ', ''));
        }

            
    }

    const mostrarAlerta = () => {
        Toast.show({
            text: mensaje,
            buttonText: 'Ok',
            duration: 5000
        })
        guardarMensaje(null)
    }

    return(
        <Container style={[{backgroundColor: '#e84347'}, globalStyles.contenedor]}>
            <View style={globalStyles.contenido}>
                <H1 style={globalStyles.titulo}>UpTask</H1>

                <Form>

                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            placeholder="Nombre"
                            onChangeText={ texto => guardarNombre(texto) }
                        />
                    </Item>

                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            autoCompleteType="email"
                            keyboardType="email-address"
                            placeholder="Email"
                            onChangeText={ texto => guardarEmail(texto) }
                        />
                    </Item>

                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            secureTextEntry={true}
                            placeholder="Password"
                            onChangeText={ texto => guardarPassword(texto) }
                        />
                    </Item>

                </Form>

                <Button 
                    square block style={globalStyles.boton}
                    onPress={() => handleSubmit()}
                >
                    <Text style={globalStyles.botonText}>Crear Cuenta</Text>
                </Button>

                { mensaje && mostrarAlerta() }

            </View>
        </Container>
    );
}

export default CrearCuenta;