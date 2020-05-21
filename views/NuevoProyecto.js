import React, {useState} from 'react';
import {View} from 'react-native';
import {
    Container,
    Button,
    Text,
    H1,
    Form,
    Item,
    Input,
    Toast
} from 'native-base';

import globalStyles from '../styles/globalstyles';
import {useNavigation} from '@react-navigation/native';

import {gql, useMutation} from '@apollo/client'

const NUEVA_PROYECTO = gql`
    mutation nuevoProyecto($input: ProyectoInput ){
        nuevoProyecto(input:$input){
            nombre
            id
        }
    }
`;

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;

const NuevoProyecto = () => {

    const navigation = useNavigation();

    const [nombre, guardarNombre] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    const [nuevoProyecto] = useMutation(NUEVA_PROYECTO,{
        update(cache, { data: { nuevoProyecto }}){
            const {obtenerProyectos} = cache.readQuery({query: OBTENER_PROYECTOS})
            cache.writeQuery({
                query: OBTENER_PROYECTOS,
                data: {obtenerProyectos: obtenerProyectos.concat([nuevoProyecto])}
            })
        }
    });


    const mostrarAlerta = () => {
        Toast.show({
            text: mensaje,
            buttonText: 'Ok',
            duration: 5000
        })
        guardarMensaje(null)
    }

    const handleSubmit = async () => {

        if(nombre === ''){
            guardarMensaje('Nombre es obligatorio')
            return;
        }

        try{
            const {data} = await nuevoProyecto({
                variables:{
                    input: {
                        nombre
                    }
                }
            });

            console.log(data);
            guardarNombre('')
            guardarMensaje('Proyecto Guardado');
            navigation.goBack();

        }catch(error){
            guardarMensaje(error.message.replace('GraphQL error: ', ''));
        }

    }

    return (
        <Container style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
        <View style={globalStyles.contenido}>
            <H1 style={globalStyles.subtitulo}>Nuevo Proyecto</H1>        

            <Form>
                <Item inlineLabel last style={globalStyles.input}>
                    <Input
                        placeholder="Nombre del Proyecto"
                        onChangeText={text => guardarNombre(text)}
                    />
                </Item>
            </Form>

            <Button 
                onPress={() => handleSubmit()}
                block
                square
                style={[globalStyles.boton, {marginTop: 30}]}
                >
                <Text style={globalStyles.botonText}>Crear Proyecto</Text>
            </Button>

            { mensaje && mostrarAlerta() }

        </View>
    </Container>
    )
}

export default NuevoProyecto;