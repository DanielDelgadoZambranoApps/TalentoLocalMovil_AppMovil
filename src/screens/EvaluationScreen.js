import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import DatePicker from 'react-native-date-picker'

import { newEvaluation }  from '../functions/firebase-firestore-functions'
import EvaluationComponent from '../components/EvaluationComponent'

const EvaluationScreen = ({navigation, route}) => {
    const { course_info } = route.params
    const [ students, setStudents ] = useState(course_info['students'])
    const [ nombre_evaluacion, setNombre_evaluacion] = useState('')
    const [ studentsNotas, setStudentsNotas ] = useState([])
    const [ descripcion, setDescripcion ] = useState('')
    const [ currentDay, setCurrentDay ] = useState(true)
    const [ date, setDate ] = useState(new Date())
    const [ hasDate, setHasDate ] = useState(true)
    const [ open, setOpen ] = useState(false)
    const [ done, setDone ] = useState(false)
    
    const render = (item) => {
       return <EvaluationComponent item={item} studentsNotas={studentsNotas} setStudentsNotas={setStudentsNotas} />
    }

    useEffect(()=>{   
      let temporal_notes = []
      for(const student_note of course_info['students']){
        temporal_notes.push({nombre_estudiante:student_note['nombre_estudiante'], nota:'1.0'})
      }
      setStudentsNotas(temporal_notes)
    },[]) 

    const checkBeforeSend =()=>{
      /*if(nombre_evaluacion.length > 0 ){
        if(descripcion.length > 0){
          newEvaluation( course_info['cursoID'],  nombre_evaluacion, descripcion, studentsNotas, date, navigation)
        } else {
          Alert.alert("Error ...", "Debe ingresar una descripcion para la evaluacion ...", [{ text: "Continuar", onPress: () => {return null}}])
        }
      } else {
        Alert.alert("Error ...", "Debe ingresar un nombre para la evaluacion ...", [{ text: "Continuar", onPress: () => {return null}}])
      } */
    }
    const useAnotherDate = () => {
      if(currentDay == false){
        setCurrentDay(true)
        setDate(new Date())
      } else {
        setCurrentDay(false)
        setOpen(true)
      }
    }
  
  return (
    <View style= {styles.container} >
            <View style= {styles.box} >
            <DatePicker modal mode='date' open={open} date={date} onConfirm={(date_current) => {
              setOpen(false)
              setDate(date_current)
              setHasDate(true)
              setDone(true) 
              setCurrentDay(false)
              Alert.alert("Exito", "Fecha selecionada satisfatoriamente .",
              [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
              }}
              onCancel={() => {
                  setCurrentDay(true)
                  setHasDate(false) 
                  setOpen(false)  }} />
                <TextInput style={styles.input} placeholderTextColor="#666"  
              //  fontStyle={nombre_evaluacion.length == 0 ? 'italic' : 'normal'}
                    placeholder={ "Nombre de la evaluacion"}onChangeText={setNombre_evaluacion} value={nombre_evaluacion} />
                    <View style={{ width:'90%',height:'20%', backgroundColor:'#ffffff', borderRadius:10, right:9, top:20 }} >
                        <TextInput
                        value={descripcion}
                        style={styles.justificationInput} 
                        numberOfLines={1}
                     //   fontStyle={descripcion.length == 0 ? 'italic' : 'normal'}
                        placeholder={ "Breve descripcion de la evaluacion :"}
                        placeholderTextColor="#666"
                        onChangeText={(text) => setDescripcion(text)} 
                        />
                    </View>
                <View style={{width:'90%', height:'55%', backgroundColor:'#ffffff', marginTop:30, borderRadius:10, right:5, top:20}} >
                    { students &&
                    <>
                      <FlatList  style={{top:0}} data={students} renderItem={(item, index) => render(item)}  keyExtractor={(item, index) => index} />
                    </>
                    }
                </View>
                <View style={{flexDirection:'row', top:30, left:8, alignSelf:'flex-start'}} >
                  <CheckBox
                    disabled={false}         value={currentDay}
                    onValueChange={(value) => useAnotherDate()}
                    />  
                    <Text  style={styles.hourStyle} > Fecha de hoy </Text>
                </View>
            </View>
            <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={()=>checkBeforeSend()}>
                <Text style={styles.textStyle}>Agregar Evaluacion</Text>
            </TouchableOpacity> 
    </View>
  )
}
export default EvaluationScreen

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
        alignSelf:'center',
        alignItems:'center'
      },
      titleStyle:{
        fontSize:16,
        fontWeight: '400',
        color:'#6D6D6D',
        right:10,
        alignSelf:'flex-start',
        left:10,
        marginBottom:10
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
        marginBottom:5,
        fontSize: 16,
        textAlign:'center',
        color: '#333',
      },
      justificationInput:{
        flex: 1,
        fontSize: 16,
        fontFamily: 'Lato-Regular',
        color: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign:'center',
        borderColor:'#6EA789',
        borderWidth:1,
        borderRadius:10,
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
        marginTop: 10,
        elevation:10
      },
      textStyle: {
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
        alignSelf: "center",
        padding: 10
      },
      text:{
        fontSize:16 ,
        fontWeight: '400',
        color:'#6D6D6D',
        left:15,
        marginTop:-5,
        width:'45%'
      },
      input_nota: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        backgroundColor:'#ffffff',
        elevation:10,
        borderRadius:10,
        right:10,
        width:'30%',
        borderRightColor:'#6D6D6D',
        borderBottomColor:'#6D6D6D',
        borderTopColor:'#6D6D6D',
        borderLeftColor:'#6D6D6D',
        borderWidth:1,
        fontSize: 16,
        left:60,
        color: '#333',
        bottom:15
      },
      hourStyle:{
        fontSize:14.5,
        fontWeight: '600',
        top:4
      },
})