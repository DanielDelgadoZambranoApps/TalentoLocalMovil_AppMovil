import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ScrollView } from 'react-native-gesture-handler'

import { GetSpecificValueFromAsyncStorage } from '../storage/storage-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { uploadNewStudent }from '../functions/firebase-firestore-functions'
import { CheckConnectivity} from '../functions/general-functions'

const NewStudentScreen = ({route, navigation}) => {
  const { course_info } = route.params
  const [ nombre_estudiante, setNombre_estudiante ] = useState('')
  const [ nivelEducacional, setNivelEducacional ] = useState('')
  const [ nacimiento, setNacimiento ] = useState('')
  const [ direccion, setDireccion ] = useState('')
  const [ userID , setUserID ] = useState()
  const [ estado, setEstado ] = useState('')
  const [ correo, setCorreo ] = useState('')  
  const [ genero, setGenero ] = useState('')
  const [ movil, setMovil ] = useState('')
  const [ comuna, setComuna ] = useState('')
  const [ rut, setRut ] = useState('')

    useEffect(()=>{ 
      if(CheckConnectivity()){
        GetCurrentSpecificInfo('id', setUserID)
      } else {
        GetSpecificValueFromAsyncStorage('id', setUserID)
        setInternetConnection(false)  
        } 
    },[])  


  const checkBeforeSend = ( )=> {
    if(nombre_estudiante.length >0 ){
      if(rut.length > 0){
          console.log("funciona pra subir el weom")
          uploadNewStudent(nombre_estudiante, nivelEducacional, nacimiento, estado, correo, genero, movil, rut, comuna, direccion, userID, course_info['cursoID'], navigation )
      } else {
        Alert.alert( "Error !", "El nombre y rut del alumno son campos obligatorios",[
          { text: "Continuar", onPress: () => {
              return },
          },
          ,],{ cancelable: true })
      }
    } else {
      Alert.alert( "Error !", "El nombre y rut del alumno son campos obligatorios",[
        { text: "Continuar", onPress: () => {
            return },
        },
        ,],{ cancelable: true })
       
    }
  }
  return (
    <View style= {styles.container} >
        <View style= {styles.box} >
          <View style={{alignSelf:'center', bottom:5}} >
            <TouchableOpacity >
                <FontAwesome name={'user'} size={180} color="#AEE5C7" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{width:'90%', height:'100%', alignSelf:'flex-end'. let}}  >
                    <View style={{left:30}} >
                        <Text  style={styles.titleStyle} > Nombre Estudiante </Text>
                        <TextInput style={styles.input} onChangeText={setNombre_estudiante} value={nombre_estudiante} />
                        <Text  style={styles.titleStyle} > Rut </Text>
                        <TextInput style={styles.input} onChangeText={setRut} value={rut} />
                        <Text  style={styles.titleStyle} > Correo </Text>
                        <TextInput style={styles.input} onChangeText={setCorreo} value={correo} />
                        <Text  style={styles.titleStyle} > Estado </Text>
                        <TextInput style={styles.input} onChangeText={setEstado} value={estado} />
                        <Text  style={styles.titleStyle} > Genero </Text>
                        <TextInput style={styles.input} onChangeText={setGenero} value={genero} />
                        <Text  style={styles.titleStyle} > Movil </Text>
                        <TextInput style={styles.input} onChangeText={setMovil} value={movil} />
                        <Text  style={styles.titleStyle} > Nacimiento </Text>
                        <TextInput style={styles.input} onChangeText={setNacimiento } value={nacimiento} />
                        <Text  style={styles.titleStyle} > Nivel Educacional </Text>
                        <TextInput style={styles.input} onChangeText={setNivelEducacional}value={nivelEducacional} />
                        <Text  style={styles.titleStyle} > Comuna </Text>
                        <TextInput style={styles.input} onChangeText={setComuna} value={comuna} />
                        <Text  style={styles.titleStyle} > Direccion </Text>
                        <TextInput style={styles.input} onChangeText={setDireccion} value={direccion}/>
                    </View>
                </ScrollView>
                <TouchableOpacity
                      style={styles.buttonStyle}
                      activeOpacity={0.5}
                      onPress={()=> checkBeforeSend()}>
                      <Text style={styles.textStyle}> Agregar Alumno </Text>
                    </TouchableOpacity>
             
        </View>

    </View>
  )
}
export default NewStudentScreen

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
        height:'85%',
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
        top:60
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