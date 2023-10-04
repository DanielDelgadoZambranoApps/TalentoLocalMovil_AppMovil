import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native'

import AntDesign from 'react-native-vector-icons/AntDesign'
import DatePicker from 'react-native-date-picker'

import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { GenerateHomeWork } from '../functions/firebase-firestore-functions.js'
import FormInputAlternative from '../components/FormInputAlternative.js'
import FormInputDescription from '../components/FormInputDescription.js'
import WeekDaysComponent from '../components/WeekDaysComponent.js'
import AuthorsTextInput from '../components/AuthorsTextInput.js'
import SelectTeachers from '../components/SelectTeachers.js'
import WarningAlert from '../components/WarningAlert.js'

const NewCourse = ({route, navigation }) => {
    const [ warningEmptyAuthors, setWarningEmptyAuthors ] = useState(false)
    const { item, superIDD } = route.params

    const [ courseDescription, setCourseDescription ] = useState(null)
    const [ totalAuthors, setTotalAuthors ] = useState(0)
    const [ courseName, setCourseName ] = useState(null)
    const [ hasDate, setHasDate ] = useState(true)
    const [ hasDate2, setHasDate2 ] = useState(true)
    const [ hasDate3, setHasDate3 ] = useState(true)
    const [ hasDate4, setHasDate4 ] = useState(true)
    const [ authors, setAuthors ] = useState([])
    const [ currentID, setCurrentID] = useState(null)

    const [ allFieldsComplete, setAllFieldsComplete] = useState(false)
    const [ selectedTeachers, setSelectedTeachers ] = useState([])

    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [done, setDone] = useState(false)

    const [date2, setDate2] = useState(new Date())
    const [open2, setOpen2] = useState(false)
    const [done2, setDone2] = useState(false)

    const [date3, setDate3] = useState(new Date())
    const [open3, setOpen3] = useState(false)
    const [done3, setDone3] = useState(false)

    const [date4, setDate4] = useState(new Date())
    const [open4, setOpen4] = useState(false)
    const [done4, setDone4] = useState(false)

    const [daysArray, setDaysArray] = useState([])

    const [userEmail, setUserEmail] = useState('Cargando Mail')
    const [userCompleteName, setUserCompleteName] = useState(null)
    const [succesfullyCreated, setSuccesfullyCreated] = useState(false)

    useEffect(()=>{
      GetCurrentSpecificInfo("userCompleteName", setUserCompleteName)
      GetCurrentSpecificInfo("email", setUserEmail)
      GetCurrentSpecificInfo('id', setCurrentID)
    },)

    const sendToFirebase =async()=>{

      let allteachers = selectedTeachers

      if(done && done2 && done3 && done4 &&totalAuthors>0 && courseName && courseDescription && currentID && (daysArray.length>0) ){
        allteachers.push({'teachername':item['userCompleteName'], 'teacherid':superIDD  })
        await GenerateHomeWork(date, date2, date3, date4, totalAuthors, courseName, authors, courseDescription, allteachers, daysArray)
        setSelectedTeachers([])
        setSuccesfullyCreated(true)
      } else {
        setAllFieldsComplete(true)
      }
    }

    const cleanAuthors =()=>{
      setAuthors([])
      setTotalAuthors(0)
    }

  return (
    <>
    <SafeAreaView style={styles.container} >
        <View style={{flexDirection:'row', right:100, marginTop:10 }} >
          <Image source={require("../../assets/pizarra.png")} style={styles.image}/>
          <SelectTeachers superIDD={superIDD} selectedTeachers={selectedTeachers} setSelectedTeachers={setSelectedTeachers} currentID={item['userID']} />
        </View>
        
        <View style={{marginTop:20}} />
        <WarningAlert status={succesfullyCreated} setStatus={setSuccesfullyCreated} description={"Ahora podra el profesor pordra visualizarlo en su pantalla de cursos."} navigation={navigation} />
        <WarningAlert changeScreen={false} mainTitle='Error ...' status={allFieldsComplete} setStatus={setAllFieldsComplete} description={"Debe completar todos campos, ademas de definir el horario correspondiente."} navigation={navigation} />
        <DatePicker modal mode='time' open={open} date={date} onConfirm={(date_current) => {
              setOpen(false)
              setDate(date_current)
              setHasDate(true)
              setDone(true)
              }}
              onCancel={() => {
                  setHasDate(false) 
                  setOpen(false)  }} />

        <DatePicker modal mode='time' open={open2} date={date2} onConfirm={(date_current2) => {
              setOpen2(false)
              setDate2(date_current2)
              setHasDate2(true)
              setDone2(true)
              }}
              onCancel={() => {
                  setHasDate2(false) 
                  setOpen2(false)  }} />

        <DatePicker modal mode='date' open={open3} date={date3} onConfirm={(date_current3) => {
              setOpen3(false)
              setDate3(date_current3)
              setHasDate3(true)
              setDone3(true)
              }}
              onCancel={() => {
                  setHasDate3(false) 
                  setOpen3(false)  }} />

        <DatePicker modal mode='date' open={open4} date={date4} onConfirm={(date_current4) => {
              setOpen4(false)
              setDate4(date_current4)
              setHasDate4(true)
              setDone4(true)
              }}
              onCancel={() => {
                  setHasDate4(false) 
                  setOpen4(false)  }} />
                  
        <FormInputAlternative
                labelValue={courseName}
                onChangeText={(courseName) => setCourseName(courseName)}
                placeholderText="Codigo curso"
                iconType="clipboard-pencil"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
          />
            <FormInputDescription
                labelValue={courseDescription}
                onChangeText={(courseDescription) => setCourseDescription(courseDescription)}
                placeholderText="Descripction ..."
                iconType="clipboard-pencil"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
          />

        <AuthorsTextInput setTotalAuthors={setTotalAuthors} totalAuthors={totalAuthors}
         authors={authors} setAuthors={setAuthors} holder={"Estudiantes(s)"} setWarningEmptyAuthors={setWarningEmptyAuthors} />

        <View style={{flexDirection:'row',top:3, left:80}} >
                <Text style={styles.subInfoText} > {totalAuthors} Estudiantes Agregados </Text>
                <TouchableOpacity onPress={()=>{cleanAuthors()}} >
                    <AntDesign style={{}}  name={'deleteusergroup'} size={25} color="red" />
                </TouchableOpacity>
            </View> 

            <View style={{marginTop:20, marginBottom:10}} >
              <WeekDaysComponent setDaysArray = { setDaysArray} daysArray = { daysArray} />
            </View>

            <View style={{flexDirection:'row'}} >
              <TouchableOpacity
                style={styles.buttonStyle2}
                activeOpacity={0.5}
                onPress={()=>{ setOpen(true)}}>
                <Text style={styles.buttonTextStyle3}>Hora de inicio </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonStyle2}
                activeOpacity={0.5}
                onPress={()=>{ setOpen3(true)}}>
                <Text style={styles.buttonTextStyle3}>Fecha Inicio </Text>
              </TouchableOpacity>
          </View>

            <View style={{flexDirection:'row'}} >

              <TouchableOpacity
              style={styles.buttonStyle2}
              activeOpacity={0.5}
              onPress={()=>{setOpen2(true)}}>
              <Text style={styles.buttonTextStyle2}> Hora de termino </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonStyle2}
              activeOpacity={0.5}
              onPress={()=>{setOpen4(true)}}>
              <Text style={styles.buttonTextStyle2}> Fecha de termino </Text>
            </TouchableOpacity>

            </View>

            <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={()=>{sendToFirebase()}}>
            <Text style={styles.buttonTextStyle}> Crear </Text>
          </TouchableOpacity>
      </SafeAreaView>
    </>
  )
}
export default NewCourse

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#ffffff"
  },
  textInputStyle: {
    width:'66%',
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#0074BB',
    backgroundColor: '#ffffff',
    alignSelf:'center',
    borderRadius:5,
    left:10
  },
  subInfoText:{
    fontSize:14,
    fontStyle:'italic',
    alignSelf:'flex-start',
    left:-65
  },
  image:{
    width: "80%",
    height: 100,
    resizeMode: "contain",
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#6EA789",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#5B8871",
    height: 42, 
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20,
    elevation:5,
    width:'90%',
    height:40
  },
  buttonStyle2: {
    width:'40%',
    backgroundColor: "#6EA789",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#6EA789",
    height: 32, 
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 20,
    elevation:5
  },
    registerTextStyle: {
    color: "#009EFF",
    textAlign:'center',
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
    marginLeft:160,
    marginTop:15
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 17,
  },
  buttonTextStyle2: {
    color: "#FFFFFF",
    fontSize: 17,
    top:3
  },
  buttonTextStyle3: {
    color: "#FFFFFF",
    fontSize: 17,
    top:3,
    left:-10,
    alignSelf:'center'
  },
})