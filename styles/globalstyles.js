import {StyleSheet} from 'react-native';

const globalStyles = StyleSheet.create({
    contenedor:{
        flex: 1
    },
    contenido:{
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: '3%',
        flex: 1
    },
    titulo:{
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff'
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 20
    },
    boton:{
        backgroundColor: '#28303b',
        marginTop: 5
    },
    botonText:{
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#fff'
    },
    enlace: {
        color: '#fff',
        marginTop: 60,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        textTransform: 'uppercase'
    },
    subtitulo: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20
    }
});

export default globalStyles;