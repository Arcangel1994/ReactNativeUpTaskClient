import React, {useState} from 'react';
import {StyleSheet, ActivityIndicator,View} from 'react-native';
import {
    Container,
    Button,
    Text,
    H2,
    Content,
    List,
    Form,
    Item,
    Input,
    Toast
} from 'native-base';

import globalStyles from '../styles/globalstyles';

import {useNavigation} from '@react-navigation/native';

import {gql, useMutation, useQuery} from '@apollo/client'

import Tarea from '../components/Tarea';

const NUEVA_TAREA = gql`
    mutation nuevaTarea($input: TareaInput ){
        nuevaTarea(input:$input){
            nombre
            id
            proyecto
            estado
        }
    }
`;

const OBTENER_TAREAS = gql`
    query obtenerTareas($input: ProyectoIDInput) {
        obtenerTareas(input: $input){
            nombre
            estado
            id
        }
    }
`;


const Proyecto = ({route}) => {

    const navigation = useNavigation();

    const [nombre, guardarNombre] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    const [nuevaTarea] = useMutation(NUEVA_TAREA,{
        update(cache, {data: {nuevaTarea}}){
            const {obtenerTareas} = cache.readQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: route.params.id
                    }
                }
            });

            cache.writeQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: route.params.id
                    }
                },
                data: {
                    obtenerTareas: [...obtenerTareas, nuevaTarea]
                }
            });

        }
    });

    const { data, loading, error } = useQuery(OBTENER_TAREAS, {
        variables:{
            input: {
                proyecto: route.params.id
            }
        }
    });

    const mostrarAlerta = () => {
        Toast.show({
            text: mensaje,
            buttonText: 'Ok',
            duration: 5000
        })

        setTimeout(() => {
            guardarMensaje(null)
        }, 3000);


        guardarMensaje(null)
    }

    const handleSubmit = async () => {

        if(nombre === ''){
            guardarMensaje('Nombre es obligatorio')
            return;
        }

        try {

            const {data} = await nuevaTarea({
                variables:{
                   input:{
                        nombre,
                        proyecto: route.params.id
                   }
                }
            });

            guardarNombre('')
            guardarMensaje('Tarea Guardado');

        } catch (error) {
            console.log(error);
        }

    }

    if(loading){
        return (
            <Container style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
                <View style={globalStyles.contenido}>
                    <ActivityIndicator size="large" color="#28303b"/>
                </View>
            </Container>
        )
    }

    return (
        <Container style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
            <Form style={{marginHorizontal: '3%', marginTop: 20}}>
                <Item inlineLabel last style={globalStyles.input}>
                    <Input
                        placeholder="Nombre Tarea"
                        value={nombre}
                        onChangeText={text => guardarNombre(text)}
                    />
                </Item>

                <Button 
                    onPress={() => handleSubmit()}
                    style={globalStyles.boton} 
                    square 
                     block>
                    <Text style={globalStyles.botonText}>Crear Tarea</Text>
                </Button>

            </Form>

            <H2 style={globalStyles.subtitulo}>Tareas: {route.params.nombre}</H2>

            <Content>
                <List style={styles.contenido}>
                    {data.obtenerTareas.map(tarea => (
                        <Tarea
                            key={tarea.id}
                            tarea={tarea}
                            proyectoId= {route.params.id}
                        />
                    ))}
                </List>
            </Content>

            { mensaje && mostrarAlerta() }

        </Container>
    )
}

const styles = StyleSheet.create({
    contenido: {
        backgroundColor: '#fff',
        marginHorizontal: '3%'
    }
})

export default Proyecto;