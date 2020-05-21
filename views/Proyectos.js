import React from 'react';
import {StyleSheet, ActivityIndicator,View} from 'react-native';
import {
    Container,
    Button,
    Text,
    H2,
    Content,
    List,
    ListItem,
    Left,
    Right
} from 'native-base';

import globalStyles from '../styles/globalstyles';

import {useNavigation} from '@react-navigation/native';

import {gql, useQuery} from '@apollo/client'

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;


const Proyectos = () => {

    const navigation = useNavigation();

    const { data, loading, error } = useQuery(OBTENER_PROYECTOS);

    if(loading){
        return (
            <Container style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
                <View style={globalStyles.contenido}>
                    <ActivityIndicator size="large" color="#28303b"/>
                </View>
            </Container>
        )
    }

    return(
        <Container style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
            <Button 
                onPress={ () => navigation.navigate('NuevoProyecto') }
                block
                square
                style={[globalStyles.boton, {marginTop: 30}]}
                >
                <Text style={globalStyles.botonText}>Nuevo Proyecto</Text>
            </Button>
            <H2 style={globalStyles.subtitulo}>Selecciona un Proyecto</H2>

            <Content>
                <List style={styles.contenido}>
                    {data.obtenerProyectos.map(proyecto => (
                        <ListItem
                            key={proyecto.id}
                            onPress={() => navigation.navigate('Proyecto', proyecto)}
                        >
                            <Left>
                                <Text>{proyecto.nombre}</Text>
                            </Left>
                            <Right>
                            
                            </Right>
                        </ListItem>
                    ))}
                </List>
            </Content>

        </Container>
    )
}

const styles = StyleSheet.create({
    contenido: {
        backgroundColor: '#fff',
        marginHorizontal: '3%'
    }
})

export default Proyectos;