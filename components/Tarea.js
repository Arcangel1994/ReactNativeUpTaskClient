import React from 'react';
import {StyleSheet, Alert} from 'react-native';
import {Text, ListItem, Left, Right, Icon, Toast} from 'native-base';

import {gql, useMutation} from '@apollo/client'

const ACTUALIZAR_TAREA = gql`
    mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean){
        actualizarTarea(id: $id, input: $input, estado: $estado ){
            nombre
            proyecto
            estado
            id
        }
    }
`;

const ELIMINAR_TAREA = gql`
    mutation eliminarTarea($id: ID!){
        eliminarTarea(id: $id)
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

const Tarea = ({tarea, proyectoId}) => {

    const [actualizarTarea] = useMutation(ACTUALIZAR_TAREA);
    const [eliminarTarea] = useMutation(ELIMINAR_TAREA,{
        update(cache){
            const {obtenerTareas} = cache.readQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: proyectoId
                    }
                }
            });

            cache.writeQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: proyectoId
                    }
                },
                data: {
                    obtenerTareas: obtenerTareas.filter(tareaActual => tareaActual.id !== tarea.id)
                }
            });

        }
    });


    const cambiarEstado = async () => {

        try {

            const {data} = await actualizarTarea({
                variables:{
                   id: tarea.id,
                   input:{
                    nombre: tarea.nombre
                   },
                   estado: !tarea.estado
                }
            });

        } catch (error) {
            console.log(error);
        }

    }

    const mostrarEliminar = () => {
        Alert.alert('Eliminar Tarea', "¿Deseas eliminar esta tarea?", [
            {
                text: 'Cancelar',
                style: 'cancel'
            },
            {
                text: 'Confirmar',
                onPress: () => eliminarDB()
            }
        ]);
    }

    const eliminarDB = async () => {
      
        try {

            const {data} = await eliminarTarea({
                variables:{
                   id: tarea.id
                }
            });

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            <ListItem
                onLongPress={() => mostrarEliminar()}
                onPress={() => cambiarEstado()}>
                <Left>
                    <Text>{tarea.nombre}</Text>
                </Left>
                <Right>
                    {tarea.estado ? (
                        <Icon 
                            name="ios-checkmark-circle"
                            style={[styles.completo, styles.icono]}
                        />
                    ):
                    (
                        <Icon 
                        name="ios-checkmark-circle"
                        style={[styles.incompleto, styles.icono]}
                    />
                    )}
                </Right>
            </ListItem>
        </>
    )
}

const styles = StyleSheet.create({
    icono:{
        fontSize: 30
    },
    completo: {
        color: 'green'
    },
    incompleto:{
        color: '#e1e1e1'
    }
});

export default Tarea;