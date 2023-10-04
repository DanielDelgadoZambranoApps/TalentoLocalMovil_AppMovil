import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, Alert, View, FlatList, StyleSheet, TextInput } from 'react-native'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Fontisto from 'react-native-vector-icons/Fontisto';  
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker'

import { SaveInStorage, GetSpecificValueFromAsyncStorage } from '../storage/storage-functions.js'
import { saveStudentList } from '../functions/firebase-firestore-functions'
import DeleteComponent from '../components/DeleteComponent.js';

const StudentsScreens = ({route, navigation}) => {
  const { coursename, courseData, teacherName, courseid, userID, screenToChange } = route.params
  const [ allSelectedStudentsWhitHour, setAllSelectedStudentsWhitHour ] = useState([])
  const [ names_to_Delete_Array, setNames_to_Delete_Array] = useState([])
  const [ justificationText, setJustificationText ] = useState('')
  const [ nullAssistace, setNullAssistace ] = useState(false)
  const [ currentDay, setCurrentDay ] = useState(true)
  const [ shortDate, setShortDate ] = useState()
  const [ hasDate, setHasDate ] = useState(true)
  const [ date, setDate ] = useState(new Date())
  const [ open, setOpen ] = useState(false)
  const [ done, setDone ] = useState(false)

  useEffect(()=>{
    GetSpecificValueFromAsyncStorage('allSelectedStudentsWhitHour' + courseData['cursoID'], setAllSelectedStudentsWhitHour)
  },[])

  useEffect(()=>{
    let stringeDate = date.toString()
    let temporalDate = ""
    let index = 0

    while (index <16){
      temporalDate = temporalDate + stringeDate[index]
      index = index + 1
    }
    setShortDate(temporalDate)

  },[date])

  const SaveAssistancesFirebase = ()=>{
    if(nullAssistace){
      if(justificationText.length<1){
        Alert.alert("Error", "Debe indicar justificar porque .",
        [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
      } else {
        Alert.alert( "Alerta ", "Esta a punto de guardar la asistencia, esta seguro que los datos son correctos ?",[
          {text: "Subir Asistencia", onPress: () => { 
          saveStudentList(allSelectedStudentsWhitHour, courseid, teacherName, courseData, currentDay, nullAssistace, date, justificationText, currentDay)
          SaveInStorage('allSelectedStudentsWhitHour' + courseData['cursoID'], [])
          Alert.alert("Exito !", "Asistencia subida de manera satisfactoria", [{ text: "Continuar", onPress: () => {
            navigation.navigate('Tu Cuenta')
          }}]) 
            
        },},
        { text: "Volver", onPress: () => {
          return },
        },],{ cancelable: true })
        SaveInStorage('allSelectedStudentsWhitHour' + courseData['cursoID'], [])
      }
    } else {
      Alert.alert( "Alerta ", "Esta a punto de guardar la asistencia de este dia, esta seguro que los datos son correctos ?",[
        {text: "Subir Asistencia", onPress: () => { 
        saveStudentList(allSelectedStudentsWhitHour, courseid, teacherName, courseData, currentDay, nullAssistace, date, justificationText)
        SaveInStorage('allSelectedStudentsWhitHour' + courseData['cursoID'], [])
        
        Alert.alert("Exito !", "Asistencia subida de manera satisfactoria", [{ text: "Continuar", onPress: () => {
          navigation.navigate('Tu Cuenta')
          }}])
      },},
      { text: "Volver", onPress: () => {
        return },
      },],{ cancelable: true })
    }
  }

  const askBeforeDelete = ()=>{
    Alert.alert( "Alerta ", "Desea eliminar a estos alumnos de la lista de estudiantes presentes ?" ,[
      { text: "Si", onPress: () => {
        deleteStudentFromAsyncStorage()
        },
      },
      { text: "Cancelar", onPress: () => {
        return },
      }
      ],{ cancelable: true })
  }

  const deleteStudentFromAsyncStorage = async () =>{
    for(const name of names_to_Delete_Array){
      let previusStudentsArray = []
      let newStudentsArray = [] 
          previusStudentsArray = await GetSpecificValueFromAsyncStorage('allSelectedStudentsWhitHour' + courseData['cursoID'])
          for (const previusStudentInfo of previusStudentsArray){
                if(previusStudentInfo['Student Name'] == name){
                // Nothing
                } else { 
                  newStudentsArray.push(previusStudentInfo)
                }
          }
          await SaveInStorage('allSelectedStudentsWhitHour' + courseData['cursoID'], newStudentsArray)
    }
    navigation.navigate('DrawerNavigator', {
      course_info:courseData,
      userID:userID,
      userCompleteName:teacherName,
      coursename :courseData['courseName'] 
    })    
  }

  const render = (item) =>{
    var temporal_hour =   new Date(item['item']['Hour Present']); 
      let temporal_hour_string = temporal_hour.toString()
      let final_hour = ""
      let index = 15

      while(index < 21){
        final_hour = final_hour +temporal_hour_string[index]
        index = index + 1
      }
 
    return(
      <>
        <View style={{flexDirection:'row', left:15, marginTop:20}} >
          <FontAwesome name={'user-circle-o'} size={35} color={'#76AF92'}/>   
          <View style={{marginRight:20}} />
            <View style={{width:'45%'}} >
              <Text  style={styles.hourStyle} > {item['item']['Student Name']} </Text>
            </View>
          <Text style={styles.hourStyle}> {final_hour}  </Text>
          <View>  
          <DeleteComponent studentName={item['item']['Student Name']} setNames_to_Delete_Array={setNames_to_Delete_Array}  names_to_Delete_Array={names_to_Delete_Array}  />
          </View> 
        </View>
      </>
    )
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
    <> 
      <View>
        <View style={styles.box} >
          <View style={styles.SecondaryBox} >

            { !nullAssistace ? 
            <>
             { allSelectedStudentsWhitHour &&
                 <FlatList  style={{top:0}} data={allSelectedStudentsWhitHour} renderItem={(item, index) => render(item)}  keyExtractor={(item, index) => index} /> 
             }
            </>

            :
            <>
              <TextInput
                value={justificationText}
                style={styles.justificationInput} 
                numberOfLines={1}
                fontStyle={justificationText.length == 0 ? 'italic' : 'normal'}
                placeholder={ "Breve justificacion anular la asistencia  :"}
                placeholderTextColor="#666"
                onChangeText={(text) => setJustificationText(text)} 
              />
            </>
            }
          </View>
        </View>
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
        <View  style={{left:20, marginTop:15}}>
            <View style={{flexDirection:'row'}} >
              <View  >
                <CheckBox
                  disabled={false}         value={currentDay}
                  onValueChange={(value) => useAnotherDate()}
                  />  
              </View>
              <Text  style={styles.hourStyle} > Fecha de hoy </Text>
            </View>
            <View style={{flexDirection:'row'}} >
              <CheckBox
                disabled={false}
                value={nullAssistace}
                onValueChange={(value) => setNullAssistace(!nullAssistace)}
                />
              <Text  style={styles.hourStyle} > Anular Asistencia </Text>
            </View>
          </View>
        <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={()=>SaveAssistancesFirebase()}>
                <Text style={styles.textStyle}> Guardar Asistencia </Text>
              </TouchableOpacity>

              { !nullAssistace &&
              <>
                <TouchableOpacity
                style={styles.button}
                onPress={()=>askBeforeDelete() }>
                    <Fontisto
                        name={'trash'}
                        size={30}
                        color={'#ffffff'}/>
                </TouchableOpacity>
              </>
              }
      </View>
    </>
  )
}
export default StudentsScreens

const styles = StyleSheet.create({
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
    marginBottom: 10,
    width:'80%',
    alignSelf:'center',
    marginTop:20,
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
  box:{
    marginTop:22,
    paddingVertical: 8,
    borderWidth: 0,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#BFE2D0",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    height:'73%',
    width:'90%',
    alignSelf:'center'
  },
  SecondaryBox:{
    marginTop: 10,
    paddingVertical: 8,
    borderWidth: 0,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    height:'95%',
    width:'90%',
    alignSelf:'center'
  },
  hourStyle:{
    fontSize:14.5,
    fontWeight: '600',
    top:4
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
    height:'50%'
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6EA789',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    right: 20,
    elevation: 5,
    right:10
  }
})