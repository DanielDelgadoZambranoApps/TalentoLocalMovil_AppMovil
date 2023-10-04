import React, {useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { updateUserDataFirebase } from '../functions/firebase-firestore-functions'
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';

const StudentScreen = ({route, navigation})=> {
    const { item, course_info, screenToChange } = route.params
    let [ nombre_estudiante, setNombre_estudiante ] = useState(item['item']['nombre_estudiante'])
    const [ nivelEducacional, setNivelEducacional ] = useState(item['item']['NivelEducacional'])
    const [ nacimiento, setNacimiento ] = useState(item['item']['Nacimiento'])
    const [ direccion, setDireccion ] = useState(item['item']['Direccion'])
    const [ estado, setEstado ] = useState(item['item']['EstadoCivil'])
    const [ correo, setCorreo ] = useState(item['item']['Correo'])    
    const [ genero, setGenero ] = useState(item['item']['Genero'])
    const [ movil, setMovil ] = useState(item['item']['Movil'])
    const [ rut, setRut ] = useState(item['item']['rut'])
    const [ comuna, setComuna ] = useState(item['item']['Comuna'])
    
     // const [ estado, setEstado ] = useState('Sin Informacion')
    //  const [ genero, setGenero ] = useState('Sin Informacion')

    const updateUserData = ()=>{
      console.log("esta pantalla kla me esta llegando ------>" + screenToChange)
      Alert.alert( "¿ Esta Seguro que desea actualizar ?","",[,{text: "Aceptar", onPress: () => { 
      updateUserDataFirebase(nombre_estudiante, nivelEducacional, nacimiento, direccion, estado, correo, genero, movil, rut, comuna, course_info, navigation, screenToChange)}},{text: "Cancelar", onPress: () => { return },
    }],{ cancelable: true }) 
    }

  return (
    <>
    <View style={styles.container} >
        <View style={styles.box} >
        <View style={styles.secondaryBox} >
            <View style={{left:20}} >
                <View style={{flexDirection:'row'}} >
                    <TouchableOpacity >
                        <FontAwesome name={'user'} size={100} color="#AEE5C7" />
                    </TouchableOpacity>
                    <View style={{left:40, width:'60%'}} >
                        <Text style={styles.text}>
                        {item['item']['nombre_estudiante']}
                        </Text>
                   </View>
                </View>
        </View>
                <ScrollView style={{width:'90%', height:'100%', alignSelf:'flex-end'. let}}  >
                    <View style={{left:30}} >
                        <Text  style={styles.titleStyle} > Nombre Estudiante </Text>
                        <TextInput style={styles.input} onChangeText={setNombre_estudiante} value={nombre_estudiante} placeholder={item['item']['nombre_estudiante']} />
                        <Text  style={styles.titleStyle} > Rut </Text>
                        <TextInput style={styles.input} onChangeText={setRut} value={rut} placeholder={item['item']['rut']} />
                        <Text  style={styles.titleStyle} > Correo </Text>
                        <TextInput style={styles.input} onChangeText={setCorreo} value={correo} placeholder={item['item']['Correo']} />
                        <Text  style={styles.titleStyle} > Estado </Text>
                        <TextInput style={styles.input} onChangeText={setEstado} value={estado} placeholder={item['item']['EstadoCivil']}/>
                        <Text  style={styles.titleStyle} > Genero </Text>
                        <TextInput style={styles.input} onChangeText={setGenero} value={genero} placeholder={item['item']['Genero']} />
                        <Text  style={styles.titleStyle} > Movil </Text>
                        <TextInput style={styles.input} onChangeText={setMovil} value={movil} placeholder={item['item']['Movil']} />
                        <Text  style={styles.titleStyle} > Nacimiento </Text>
                        <TextInput style={styles.input} onChangeText={setNacimiento } value={nacimiento} placeholder={item['item']['Nacimiento']} />
                        <Text  style={styles.titleStyle} > Nivel Educacional </Text>
                        <TextInput style={styles.input} onChangeText={setNivelEducacional}value={nivelEducacional}  placeholder={item['item']['NivelEducacional']}/>
                        <Text  style={styles.titleStyle} > Comuna </Text>
                        <TextInput style={styles.input} onChangeText={setComuna} value={comuna} placeholder={item['item']['Comuna']} />
                        <Text  style={styles.titleStyle} > Direccion </Text>
                        <TextInput style={styles.input} onChangeText={setDireccion} value={direccion} placeholder={item['item']['Direccion']} />
                    </View>
                </ScrollView>
                <TouchableOpacity
                      style={styles.buttonStyle}
                      activeOpacity={0.5}
                      onPress={()=> { updateUserData() } }>
                      <Text style={styles.textStyle}> Actualizar Datos </Text>
                    </TouchableOpacity>
                </View>
        </View>
    </View>
    </>
  )
}

export default StudentScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ffffff"
      },
    box:{
        marginTop: 30,
        paddingVertical: 8,
        borderWidth: 0,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#DEFCEC",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        height:'90%',
        width:'90%',
        alignSelf:'center'
      },
      text:{
        fontSize:18,
        fontWeight: '400',
        color:'#6D6D6D',
      },
      input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        backgroundColor:'#ffffff',
        elevation:10,
        borderRadius:10,
        right:10,
        width:'90%',
        borderRightColor:'#6D6D6D',
        borderBottomColor:'#6D6D6D',
        borderTopColor:'#6D6D6D',
        borderLeftColor:'#6D6D6D',
        marginTop:5,
        marginBottom:5
      },
      titleStyle:{
        fontSize:14,
        fontWeight: '400',
        color:'#6D6D6D',
        right:10
      },
      secondaryBox:{
        width:'100%',
        height:'90%'
      },
      buttonStyle: {
        backgroundColor: "#6EA789",
        borderWidth: 0,
        color: "#FFFFFF",
        borderColor: "#7DE24E",
        height: 40,
        alignItems: "center",
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        width:'80%',
        alignSelf:'center',
        elevation:10,
        top:40
      },
      textStyle:{
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 14,
        alignSelf: "center",
        padding: 10
      }
})