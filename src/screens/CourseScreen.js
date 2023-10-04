
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, FlatList, SafeAreaView, Alert } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AntDesign from 'react-native-vector-icons/AntDesign'
import firestore from '@react-native-firebase/firestore'
import DatePicker from 'react-native-date-picker'

import { SaveInStorage, GetSpecificValueFromAsyncStorage } from '../storage/storage-functions.js'
import { hasSpecialPermission } from '../functions/firebase-firestore-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import ProfileButtonAlternative from '../components/ProfileButtonAlternative'
import StudentComponent from '../components/StudentComponent'
import WarningAlert from '../components/WarningAlert.js'

const CourseScreen = ({ route, navigation }) => {
    const { course_info, userID, userCompleteName, coursename, screenToChange } = route.params
    const [ allSelectedStudentsWhitHour, setAllSelectedStudentsWhitHour ] = useState([])
    const [ specialPermission, setSpecialPermission] = useState(false)
    const [ selectedStudents, setSelectedStudents ] = useState([])
    const [ days, setDays] = useState(course_info['daysArray'])
    const [ teacherName, setTeacherName] = useState('')
    const [ allStudents, setAllStudents ] = useState()
    const [ loadAgain, setLoadAgain] = useState(true)
    const [ hasDate2, setHasDate2 ] = useState(true)
    const [ hasDate, setHasDate ] = useState(true)
    const [ update, setUpdate ] = useState(false)
    const [ saved, setSaved ] = useState(false)
    const [ pantera, setPantera] = useState()

    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [done, setDone] = useState(false)

    const [date2, setDate2] = useState(new Date())
    const [open2, setOpen2] = useState(false)
    const [done2, setDone2] = useState(false)

    var hora_initial =   new Date(1970, 0, 1); 
    var hora_fin =  new Date(1970, 0, 1); 

    var fecha_initial =   new Date(1970, 0, 1); 
    var fecha_final =  new Date(1970, 0, 1); 

    hora_initial.setSeconds(course_info.date['seconds']+ 3600 );
    hora_fin.setSeconds(course_info.date2['seconds'] + 3600 );

    fecha_initial.setSeconds(course_info.fecha_Inicio['seconds'] - 14400);
    fecha_final.setSeconds(course_info.fecha_termino['seconds'] - 14400);

    // fecha_initial.setSeconds(course_info.fecha_Inicio['seconds'] - 14400);
    // fecha_final.setSeconds(course_info.fecha_termino['seconds'] - 14400);

    let fecha_initial_aux = ""
    let fecha_termino_aux = ""
    let index = 0

    const hora_inicio_string = hora_initial.toString()
    const hora_termino_string = hora_fin.toString()

    const fecha_inicio_string = fecha_initial.toString()
    const fecha_termino_string = fecha_final.toString()

    while(index<16){
        fecha_initial_aux = fecha_initial_aux + fecha_inicio_string[index]
        index = index +1
    }
    index = 0

    while(index<16){
        fecha_termino_aux = fecha_termino_aux + fecha_termino_string[index]
        index = index +1
    }

    let hora_inicio = hora_inicio_string[16] + hora_inicio_string[17]
    let minutero_inicio= hora_inicio_string[19] +  hora_inicio_string[20]

    let hora_termino = hora_termino_string[16] + hora_termino_string[17]
    let minutero_termino= hora_termino_string[19] +  hora_termino_string[20]

    hora_inicio =  Number(hora_inicio) - 4
    hora_termino =  Number(hora_termino) - 4

    if(hora_inicio<0) hora_inicio = 24 + hora_inicio
    if(hora_termino<0) hora_termino = 24 + hora_termino

    let final_start_hour = hora_inicio + ":"+  minutero_inicio
    let final_termino_hour = hora_termino + ":"+  minutero_termino

    let start_hour_aux = ""
    let final_hour_aux = ""

    if(final_start_hour.length==4){
        start_hour_aux = '0' + final_start_hour
        final_start_hour=start_hour_aux          
    }
    
    if(final_termino_hour.length==4){
        final_hour_aux = '0' + final_termino_hour
        final_termino_hour=final_hour_aux          
    }

    if(course_info['expoEditLastDate']  == true){
      final_start_hour   = course_info['date']
      final_termino_hour = course_info['date2']
      fecha_initial_aux  = course_info['fecha_Inicio']
      fecha_termino_aux  = course_info['fecha_termino']
    }

    useEffect(()=>{
      let localStudentsArray = []
      for(const this_Student of course_info['students']){
       // localStudentsArray.push(this_Student['nombre_estudiante']) <------------- Forma vieja
       localStudentsArray.push({'nombre_estudiante':this_Student['nombre_estudiante'], 'estado_estudiante':this_Student['EstadoCivil']})
      }
      setAllStudents(localStudentsArray)
    },[loadAgain]) 

    useEffect(()=>{
      if(userID){
        hasSpecialPermission(userID, setSpecialPermission)
      }
    },[userID]) 

    useEffect(()=>{
        GetCurrentSpecificInfo('userCompleteName', setTeacherName)
        GetSpecificValueFromAsyncStorage('allSelectedStudentsWhitHour' + course_info['cursoID'], setAllSelectedStudentsWhitHour)
    },[])
 
    useEffect(()=>{
        let allTeachersCourse= ""
        for(const thisTeacher of course_info['teachers']){
            allTeachersCourse= allTeachersCourse + thisTeacher['teachername'] + '<br>'
        }
        setPantera(allTeachersCourse)
    },[])
    
  const render =(item)=>{
    let showStudent = true
    if(allSelectedStudentsWhitHour){
      if(allSelectedStudentsWhitHour.length>0){
        for (const [key, value]  of Object.entries(allSelectedStudentsWhitHour) ){
          if(value["Student Name"] ==  item['item']['nombre_estudiante']){
            showStudent=false
          }
      }
    }
   }

    return(
      <>
      { showStudent &&
      <>
        <View style={{marginTop:5, marginBottom:5}} >
          <StudentComponent update={update} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} item = {item} />
        </View>
      </>
      }
      </>
    )
  }

  const showDay =(item)=>{
    let superday =  item['item']
    return <Text> {superday} </Text>
  }

  const askBeforeChange = (initial_or_final) =>{
    Alert.alert( "Alerta ", "¿ Esta seguro que desea cambiar la fecha de " + initial_or_final +" del curso ?" ,[
    { text: "Volver", onPress: () => {
      return },
    },
    {text: "Si, deseo cambiar la fecha de " + initial_or_final, onPress: () => { 
        if(initial_or_final == 'Inicio'){
            change_inital_date('Inicial')
        } else {
            change_final_date('Final')
        }
    },},
    ],{ cancelable: true })
  }

  useEffect(()=>{
    if(done){
      if(true){
        change_initial_or_final_date_in_firestore('Inicial', date)
      } else {
        Alert.alert( "Error ", "Su cuenta no posee permisos de administrador" ,[
          { text: "Continuar", onPress: () => {
            return },
          }
          ],{ cancelable: true })
      }
    }
    if(done2){
      if(true){
        change_initial_or_final_date_in_firestore('Termino', date2)
      } else {
        Alert.alert( "Error ", "Su cuenta no posee permisos de administrador" ,[
          { text: "Continuar", onPress: () => {
            return },
          }
          ],{ cancelable: true })
      }
    }

  },[done, done2])

  const change_inital_date =async ()=>{
    console.log("cambiando la fecha inicial")
    setOpen(true)
  }
  const change_final_date = ()=>{
    console.log("cambiando la fecha final   ")
    setOpen2(true)
  }

  const change_initial_or_final_date_in_firestore =async (inital_or_final, fecha)=>{
    if(inital_or_final == 'Inicial'){
        await firestore().collection('Cursos').doc(course_info['cursoID']).update({
            fecha_Inicio:fecha,
            expoEditLastDate:false
          }).then((value) => {
            console.log("Fecha de inicio del curso actualizada con exito !" + fecha )
            setDone(false)
          })

    } 
    if(inital_or_final == 'Termino'){
        await firestore().collection('Cursos').doc(course_info['cursoID']).update({
            fecha_termino:fecha,
            expoEditLastDate:false
          }).then((value) => {
            console.log("Fecha de termino del curso actualizada con exito !" + fecha )
            setDone2(false)
          })
    }

    Alert.alert( "Exito ", "La fecha de " + inital_or_final + " fue cambiada satisfatoriamente." ,[
        { text: "Continuar", onPress: () => {
          return },
        }
        ],{ cancelable: true })

        navigation.replace('DrawerNavigator',{         
        /*course_info:course_info,
        userID:userID,
        userCompleteName:teacherName,
        coursename:coursename*/
      }) 
  }

  const SaveStudentsInAsyncStorage = async() =>{
    let selectedStudents_whit_hour = []
    const date = new Date()

    if(selectedStudents.length>0){
      for(const current_student of selectedStudents){
        selectedStudents_whit_hour.push({'Student Name' : current_student, 'Hour Present':date})
      }
      let previusStudentsArray = []
          previusStudentsArray = await GetSpecificValueFromAsyncStorage('allSelectedStudentsWhitHour' + course_info['cursoID'], null)
  
      if(!previusStudentsArray) previusStudentsArray=[]
  
      if(selectedStudents_whit_hour){
        if(selectedStudents_whit_hour.length>0){
          for(const new_student of selectedStudents_whit_hour){
            previusStudentsArray.push(new_student)
          }
        }
      }
  
      await SaveInStorage('allSelectedStudentsWhitHour' + course_info['cursoID'], previusStudentsArray)
  
      navigation.replace('CourseScreen', {
        course_info:course_info,
        userID:userID,
        userCompleteName:userCompleteName,
        coursename :course_info['courseName'] 
      }) 
    } else{
      Alert.alert( "Error ", "No ha seleccionado ningun estudiante ..." ,[
        { text: "Continuar", onPress: () => {
          return },
        }
        ],{ cancelable: true })
    }
  }

  return (
    <>
        <SafeAreaView style={styles.container} >
            <View>
            <DatePicker modal mode='date' open={open} date={date} onConfirm={(date_current) => {
              setOpen(false)
              setDate(date_current)
              setHasDate(true)
              setDone(true)
              }}
              onCancel={() => {
                  setHasDate(false) 
                  setOpen(false)  }} />

            <DatePicker modal mode='date' open={open2} date={date2} onConfirm={(date_current2) => {
              setOpen2(false)
              setDate2(date_current2)
              setHasDate2(true)
              setDone2(true)
              }}
              onCancel={() => {
                  setHasDate2(false) 
                  setOpen2(false)  }} />
                <View style={{flexDirection:'row'}} >    
                    <Text style={styles.text}> {course_info['courseName']} </Text>
                    <Image source={require("../../assets/pizarraSimple.png")} style={styles.image}/>
                </View>
                <WarningAlert coursename={coursename} teacherName={teacherName} userID={userID} course_info={course_info} changeScreen={false} mainTitle={'Exito !'} special={true} status={saved} setStatus={setSaved} description={"Asistencia guardadada satisfactoriamente"} navigation={navigation} />
                <View style={{width:'60%', height:100, marginLeft:20, bottom:100}}  > 
                    <Text style={{top:0}} >{course_info['courseDescription']} </Text>
                </View>
                <View style={{left:20, top:-140}} >
                    <Text style={{}}> Hora de Inicio      : {final_start_hour} </Text>
                    <Text style={{}}> Hora de Termino : {final_termino_hour} </Text>
                    <View style={{flexDirection:'row', top:10 }} >
                        <Text style={{}}> Dias de Clase : </Text>
                        <FlatList horizontal={true}  style={{top:0}} data={days} renderItem={(item, index) => showDay(item)}  keyExtractor={(item, index) => index} />    
                    </View>
                  
                    <View style={{flexDirection:'row'}} >
                        <View style={{width:'80%', height:'100%'}} >
                            <Text style={styles.secondaryText}> Fecha de Inicio : {fecha_initial_aux}  </Text>
                        </View>
                    
                        <TouchableOpacity style={{top:0}} onPress={()=>{askBeforeChange('Inicio')}} >
                            <AntDesign style={{marginTop:20}}  name={'edit'}  size={20} color={'#000000'}/>    
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row'}} >
                        <View style={{width:'80%', height:'100%'}} >
                          <Text style={{top:5}}> Fecha de Termino :  {fecha_termino_aux} </Text>
                        </View>
                        <TouchableOpacity style={{top:0}} onPress={()=>{askBeforeChange('Termino')}} >  
                            <AntDesign style={{marginTop:5}}  name={'edit'}  size={20} color={'#000000'}/>    
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{width:'90%', height:180, alignSelf:'center',  borderWidth: 0.5, bottom:60, borderStyle:'dashed', }} >
                <Text style={styles.text_2}> Alumnos </Text>
                { allStudents &&
                     <FlatList  style={{top:0}} data={allStudents} renderItem={(item, index) => render(item)}  keyExtractor={(item, index) => index} />
                }
                </View>
                <View style={{top:-30}} >
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={()=>{SaveStudentsInAsyncStorage()}}>
                  <Text style={styles.textStyle}> Seleccionar Estudiantes </Text>
                </TouchableOpacity>
                <View style={{marginTop:10}} />
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={()=> { navigation.navigate('StudentsScreens' , {coursename:coursename,  courseData:course_info, teacherName:teacherName, courseid:course_info['cursoID'],  userID:userID, asisstencia:true, selectedStudents:selectedStudents })} }>
                  <Text style={styles.textStyle}> Ver Estudiantes presentes </Text>
                </TouchableOpacity>
                <ProfileButtonAlternative specialPermission={specialPermission} pantera={pantera} coursename={coursename} course_info={course_info} courseid={course_info['cursoID']} title='Asistencias Guardadas' asisstencia={true} userID={userID} navigation={navigation} />
                </View>
            </View>
        </SafeAreaView>
    </>
  )
}

export default CourseScreen
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ffffff"
      },
    image:{
        width: "80%",
        height: 120,
        resizeMode: "contain",
        alignItems: "center",
        marginTop:50,
        marginLeft:'-10%'
      },
      text:{
        fontSize:22,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'center',
        fontWeight: 'bold',
        left:10,
        bottom:55,
    },
    text_2:{
        fontSize:20,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'center',
        fontWeight: 'bold',
        bottom:'25%'
    },
    secondaryText:{
        top:20
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

})