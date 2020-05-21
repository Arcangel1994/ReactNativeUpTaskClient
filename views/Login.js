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

import {useNavigation} from '@react-navigation/native';

import AsyncStorage from '@react-native-community/async-storage';

import globalStyles from '../styles/globalstyles';

import {gql, useMutation} from '@apollo/client'

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput ){
        autenticarUsuario(input:$input){
            token
        }
    }
`;

const Login = () => {

    const navigation = useNavigation();

    const [email, guardarEmail] = useState('');
    const [password, guardarPassword] = useState('');

    const [mensaje, guardarMensaje] = useState(null);

    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

    const handleSubmit = async () => {

        if(email === '' || password === ''){
            guardarMensaje('Todos los campos son obligatorios');
            return;
        }

        try{

            const {data} = await autenticarUsuario({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            });

            const { token } = data.autenticarUsuario;

            await AsyncStorage.setItem('token', token);
            guardarMensaje('Bienvenido');
            navigation.navigate('Proyectos');

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
                    onPress={() => handleSubmit()}
                    square block style={globalStyles.boton}>
                    <Text style={globalStyles.botonText}>Iniciar Sesion</Text>
                </Button>

                <Text 
                    style={globalStyles.enlace}
                    onPress={ () => navigation.navigate("CrearCuenta")}
                >Crear Cuenta</Text>

                { mensaje && mostrarAlerta() }

            </View>
        </Container>
    );
}

export default Login;