import React, { useEffect, useState } from 'react'
import { Image, Text, View, FlatList, TouchableOpacity, Alert, StyleSheet, RefreshControl } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { writeFile, readFile, DownloadDirectoryPath } from 'react-native-fs'
import RNPrint from 'react-native-print'
import XLSX from 'xlsx'

import { CheckConnectivity, getDateNewFormat } from '../functions/general-functions'
import { getAllAsistances } from '../functions/firebase-firestore-functions'
import ProfileButtonExportAll from '../components/ProfileButtonExportAll'

 const AssistancesScreen = ({ route, navigation }) => {
    const { userID, courseid, course_info, coursename, pantera, specialPermission } = route.params
    const [ internetConnection , setInternetConnection] = useState(true)
    const [ allSavedAssistances, setAllSavedAssistances ] = useState([])
    const [ superUpdate, setSuperUpdate] = useState(false)
    const [ isLoading , setIsLoading ] = useState(false)

    useEffect(()=>{
        if(CheckConnectivity()){
            // Nothing
        } else {
            setInternetConnection(false)
        }
    },[])

    useEffect(()=>{
        getAllAsistances( courseid, setAllSavedAssistances)
    },[superUpdate])
  
    const exportPDF =async(item, dateTransformed_whitout_hour, dateTransformed_whit_hour)=>{

    let first_profesor_name_flag =true
    let simplenameteachers = ""
    let index = 1

    if(course_info['teachers'].length > 1){
        for(const currentTeacher of course_info['teachers']){
            if(first_profesor_name_flag){
                simplenameteachers=  currentTeacher.teachername
                first_profesor_name_flag=false
                index=index+1
            }else {
                if(index == course_info['teachers'].length){
                    simplenameteachers = simplenameteachers + "  y " + currentTeacher.teachername
                    index=index+1
                } else {
                    simplenameteachers = simplenameteachers + "  , " + currentTeacher.teachername
                    index=index+1
                }
            }   
        }
    } 
    else {
        simplenameteachers= course_info['teachers'][0]['teachername']
    }
        var transformDate = new Date(1970, 0, 1); // Epoch
        transformDate.setSeconds(item.fecha['seconds'] )

        const diadehoy = new Date()
        let today = diadehoy.toString()
        let todaytransform = ""
            index = 0 

        while(index < 16){
            todaytransform = todaytransform + today[index]
            index = index + 1
        }
        index = 0

        const diaAssistencia = new Date(item.fecha['seconds'])
        let newDiaAssistencia = diaAssistencia.toString()
        let newFinalDate = ""

        while(index < 21){
            newFinalDate = newFinalDate + newDiaAssistencia[index]
            index = index + 1
        }
        let html_line_spaces = ""
            index= 0

        while(index < 30){
            html_line_spaces = html_line_spaces + '&nbsp;'
            index = index + 1
        }

        let studentsHTMLtext =   '<h4 align="left" > El presente documento corresponde a la asistencia total de la asignatura de' + course_info['courseName']  + ' a cargo del profesor(es) '+ simplenameteachers  +' el dia ' +  dateTransformed_whit_hour +'. </h2>'  + '<h5 align="left" > '
        let studentsHTMLtext_before_studentes =studentsHTMLtext
            studentsHTMLtext = studentsHTMLtext + '<h4 align="center" >' +'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+ "Hora"+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+ 'Estado'  +html_line_spaces +' Asistencia </h4>'
        let total_spaces_jumps = 42 - course_info['students'].length
        let allTeachersCourse = ""
        let txt_spaces_jumps = ""
        let wasPresent = false
        let secondaryIndex = 0 
        let large_text = ""
        let large = 50
            index= 0

        while(index < total_spaces_jumps){
            txt_spaces_jumps = txt_spaces_jumps +'<br>'
            index= index +1
        } 
        index=0      

        for(const actualTeacher of course_info['teachers']){
            allTeachersCourse= allTeachersCourse + actualTeacher['teachername'] + '<br>'
        } 
        
        for(const registerStudent of course_info['students']){
            large=44
            large_text= ""
            secondaryIndex=0
            index= index +1
            studentsHTMLtext = studentsHTMLtext +index +")  "+   registerStudent['nombre_estudiante']
            large = large - registerStudent['nombre_estudiante'].length*1.4
        
            while(secondaryIndex <large){
                large_text = large_text + "&nbsp;"
                secondaryIndex= secondaryIndex + 1
            }
            let temporal_estado =""
            let final_hour = ""
            for(const presentStudent of item['students'] ){
                temporal_estado= registerStudent['EstadoCivil']
                if(registerStudent['nombre_estudiante'] == presentStudent['Student Name']){
                    wasPresent= true
                    var temporal_hour =   new Date(presentStudent['Hour Present']);
                    let temporal_hour_string = temporal_hour.toString() 
                    let index_temporal = 15
                        while(index_temporal < 21){
                        final_hour = final_hour +temporal_hour_string[index_temporal]
                        index_temporal = index_temporal + 1
                        }
                    studentsHTMLtext = studentsHTMLtext +large_text + final_hour    +large_text+ temporal_estado  +large_text + "Presente" 
                }
            } 
            if(!wasPresent){
                let index_aux = 0
                    studentsHTMLtext = studentsHTMLtext + '&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+ '&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+'&nbsp;'+large_text+temporal_estado + final_hour
                    
                    while(index_aux<31){
                        studentsHTMLtext= studentsHTMLtext + '&nbsp;'
                        index_aux = index_aux +1 
                    }
                    studentsHTMLtext =  studentsHTMLtext + "Ausente"             
            }
            studentsHTMLtext = studentsHTMLtext +    '<br>'
            wasPresent=false
        }
        studentsHTMLtext = studentsHTMLtext + '</h5>'

        let spacejumps = ""
            index = 0
        while(index < 34){
            spacejumps =  spacejumps + '<br>'
            index = index + 1
        }

        let currentDayText =""

        if(item['currentDay']){

        } else {
            currentDayText =  '<h5> La hora de ingreso de los estudiantes de este dia no debe ser considerada ya la que informacion de de este documento fue ingresada fue ingresada luego de realizada la clase.</h5>'
        }

        if(item.Asistencia_Nula == true ){
            studentsHTMLtext_before_studentes = studentsHTMLtext_before_studentes +  '<h4 align="left" > La Asistencia del dia de hoy fue anulada por los siguientes motivos :  ' + '<br> ' + '<br>'+  '"'  + item.justificationText +'" </h4>'
            await RNPrint.print({
                html:
                '<!doctype html>'+
                '<html lang="en">'+
                '<head>'+
                '<meta charset="utf-8">'+
                '<meta name="viewport" content="width=1024">'+
                '<title>Example 01: No CSS</title>'+
                '</head>'+
                '<body>'+
                '<div id="wrapper">'+
                '<div class="chart">'+
                '<br>'+
                '<br>'+
                '<br>'+
                '<br>'+
                '<h1 align="center" > '+
                '<h1 align="center" > ' + "Documento de Asistencia" + '</h1>'+
                 spacejumps+
                '<h3 align="center" > Profesor (es) : '  + allTeachersCourse+ '<br>'+ 'Curso : '+ course_info['courseName'] + '<br>'+ 'Fecha de Emision: ' + todaytransform + '<br>'+  'Fecha de Asistencia :' +  dateTransformed_whitout_hour +
                '<br>'+
                '<br>'+
                '<h4 >' + studentsHTMLtext_before_studentes + '</h4>' + 
                txt_spaces_jumps+
                currentDayText+
                '<h4 align="left" >Fecha de Emision :' +  todaytransform + '</h4>'+
               '</html>'
              })

        } else {
            await RNPrint.print({
                html:
                '<!doctype html>'+
                '<html lang="en">'+
                '<head>'+
                '<meta charset="utf-8">'+
                '<meta name="viewport" content="width=1024">'+
                '<title>Example 01: No CSS</title>'+
                '</head>'+
                '<body>'+
                '<div id="wrapper">'+
                '<div class="chart">'+
                '<br>'+
                '<br>'+
                '<br>'+
                '<br>'+
                '<h1 align="center" > '+
                '<h1 align="center" > ' + "Documento de Asistencia" + '</h1>'+
                 spacejumps+
                '<h3 align="center" > Profesor (es) : '  + allTeachersCourse+ '<br>'+ 'Curso : '+ course_info['courseName'] + '<br>'+ 'Fecha de Emision: ' + todaytransform + '<br>'+  'Fecha de Asistencia :' +  dateTransformed_whitout_hour + '</h3>'+
                '<h4 >' + studentsHTMLtext + '</h4>' + 
                txt_spaces_jumps+
                currentDayText+
                    '<h4 align="left" >Fecha de Emision :' +  todaytransform + '</h4>'+
               '</html>'
              })
        }
    }

    const exportExel =(item, dateTransformed_whitout_hour, dateTransformed_whit_hour)=>{
        let studentsData_transform_to_export = []
        const students_assistance_array = []
        let index = 0
        let fileTitle = dateTransformed_whitout_hour
        let wasPresent = false

        if(item['Asistencia_Nula'] == false){
            for(const registerStudent of course_info['students']){
                wasPresent= false
                let final_hour = ""
                for(const presentStudent of item['students'] ){
                    if(registerStudent['nombre_estudiante'] == presentStudent['Student Name']){
                        wasPresent= true
                        var temporal_hour =   new Date(presentStudent['Hour Present']);
                        let temporal_hour_string = temporal_hour.toString() 
                        let index_temporal = 15
                            while(index_temporal < 21){
                            final_hour = final_hour +temporal_hour_string[index_temporal]
                            index_temporal = index_temporal + 1
                            }
                    } 
                }
                if(wasPresent){
                    students_assistance_array.push( {studentName:registerStudent['nombre_estudiante'] , status:'Presente', estado :registerStudent['EstadoCivil'], PresentHour:final_hour})
                } else {
                    students_assistance_array.push( {studentName:registerStudent['nombre_estudiante'] , status:'Ausente', estado :registerStudent['EstadoCivil'], PresentHour:final_hour })
                }
                wasPresent=false
    
            }
            index = 0
    
            for(const currentStudent of students_assistance_array){
                studentsData_transform_to_export.push({
                    Estudiante:index + 1, 
                    Nombre:currentStudent['studentName'],
                    Estado: currentStudent['estado'],
                    'Hora de Llegada':currentStudent['PresentHour'],
                    Asistencia:currentStudent['status'],
                  })
                  index = index + 1
            }
    
            for(const current_teacher of course_info['teachers'] ){
                studentsData_transform_to_export.push({
                    'Profesor (es) y Curso':current_teacher['teachername'],
                })
            }
            studentsData_transform_to_export.push({
                'Profesor (es) y Curso' : course_info['courseName']
            })
    
            studentsData_transform_to_export.push({
                'Profesor (es) y Curso' :  "Asistencia del dia : " + dateTransformed_whit_hour
            })
            if(item['currentDay'] ){
                // Nothing
            } else  {            
                studentsData_transform_to_export.push({
                    'Profesor (es) y Curso' :  "La hora de ingreso de los estudiantes no debe ser considerada ya que la informacion de este documento se ingreso de manera posterior a la clase."
                })
            }
            let wb = XLSX.utils.book_new()
            let ws = XLSX.utils.json_to_sheet(studentsData_transform_to_export)
            XLSX.utils.book_append_sheet(wb, ws, fileTitle)
            const wbout = XLSX.write(wb, {type:'binary', bookType:'xlsx' })
        
            writeFile(
                DownloadDirectoryPath + '/' + fileTitle + '.xslx',
                wbout,
                'ascii',
            )
            .then(res =>{
                Alert.alert( "Exportacion exitosa !", "Revise su carpeta de descargas para vizualizar el documento, recuerde que si hay un archivo con el mismo nombre este se sobreescribira.",[
                    { text: "Continuar", onPress: () => {
                        return },
                    },
                    ,],{ cancelable: true })
            })
            .catch(e=>{
                console.log("Error durante la exportacion ....")
            })

        } else {
            studentsData_transform_to_export.push({
                'Asistencia Nula ' : 'La asistencia del dia ' + dateTransformed_whitout_hour +' fue anulada por los siguientes motivos : ' + item['justificationText']
            })
            
            for(const current_teacher of course_info['teachers'] ){
                studentsData_transform_to_export.push({
                    'Profesor (es) y Curso':current_teacher['teachername'],
                })
            }
            studentsData_transform_to_export.push({
                'Profesor (es) y Curso' : course_info['courseName']
            })
    
            studentsData_transform_to_export.push({
                'Profesor (es) y Curso' :  "Emitido el dia y hora : " + dateTransformed_whit_hour
            })

            if(item['currentDay'] ){
                // Nothing
            } else  {            
                studentsData_transform_to_export.push({
                    'Profesor (es) y Curso' :  "La hora de ingreso de los estudiantes no debe ser considerada ya que la informacion de este documento se ingreso de manera posterior a la clase."
                })

            }

            let wb = XLSX.utils.book_new()
            let ws = XLSX.utils.json_to_sheet(studentsData_transform_to_export)
            XLSX.utils.book_append_sheet(wb, ws, fileTitle)
            const wbout = XLSX.write(wb, {type:'binary', bookType:'xlsx' })
        
            writeFile(
                DownloadDirectoryPath + '/' + fileTitle + '.xslx',
                wbout,
                'ascii',
            )
            .then(res =>{
                Alert.alert( "Exportacion exitosa !", "Revise su carpeta de descargas para vizualizar el documento, recuerde que si hay un archivo con el mismo nombre este se sobreescribira.",[
                    { text: "Continuar", onPress: () => {
                        return },
                    },
                    ,],{ cancelable: true })
            })
            .catch(e=>{
                console.log("Error durante la exportacion ....")
            })
            
        }
    }

    const chooseFormat_assistance =(item, dateTransformed_whitout_hour, dateTransformed_whit_hour)=>{
        Alert.alert( "Escoga una opcion", "¿ En que formato desea exportar ?",[
            { text: "Cancelar", onPress: () => {
                return },
            },
            {text: "Exportar en formato PDF", onPress: () => { 
                if(true){
                    exportPDF(item, dateTransformed_whitout_hour, dateTransformed_whit_hour)
                } else {
                    Alert.alert( "Error ", "Su cuenta no posee permisos de administrador" ,[
                        { text: "Continuar", onPress: () => {
                          return },
                        }
                        ],{ cancelable: true })
                }

                },},
            {text: "Exportar en formato Exel", onPress: () => { 
                if(true){
                //    exportExel(item, dateTransformed_whitout_hour, dateTransformed_whit_hour)
                     navigation.navigate('DocumentNameScreen', {item:item, dateTransformed_whitout_hour:dateTransformed_whitout_hour, dateTransformed_whit_hour:dateTransformed_whit_hour,
                        courseid:courseid, course_info:course_info, coursename:coursename, pantera:pantera, specialPermission:specialPermission,userID:userID   })
                } else {
                    Alert.alert( "Error ", "Su cuenta no posee permisos de administrador" ,[
                        { text: "Continuar", onPress: () => {
                          return },
                        }
                        ],{ cancelable: true })
                }
                 },},
            ,],{ cancelable: true })
    }
    
    const render =(item)=>{

        var simpleDate = new Date(1970, 0, 1); // Epoch
            simpleDate.setSeconds(item['item']['date']['seconds'] - 10800);

        const simpleDateString = simpleDate.toString()
    
        let dateTransformed_whit_hour = ""
        let dateTransformed_whitout_hour= ""
        let index = 0
6
        if(item['item']['dateExpo']==true && item['item']['currentDay']==false){
            dateTransformed_whit_hour = item['item']['date']
        } else {
                while(index<24){
                    dateTransformed_whit_hour  =  dateTransformed_whit_hour + simpleDateString[index]
                    index=index + 1
                }
                index=0
                dateTransformed_whit_hour = getDateNewFormat(dateTransformed_whit_hour, true)
        }
        if(item['item']['dateExpo']==true && item['item']['currentDay']==false)
        {
            dateTransformed_whitout_hour = item['item']['date']
        } else {
            while(index<16){
                dateTransformed_whitout_hour  =  dateTransformed_whitout_hour + simpleDateString[index]
                index=index + 1
            }
            dateTransformed_whitout_hour = getDateNewFormat(dateTransformed_whitout_hour)
        }

        var transformDate = new Date(1970, 0, 1); // Epoch
            transformDate.setSeconds(item['item']['fecha']['seconds'] )

        const fechaTransformada = transformDate.toString()

        let finalDate=""
            index = 0

        while(index <24){
            finalDate = finalDate + fechaTransformada[index]
            index = index + 1
        }

        return(
        <>
            <View style={{marginTop:10, marginBottom:10}} >
                <TouchableOpacity onPress={() => chooseFormat_assistance(item['item'], dateTransformed_whitout_hour, dateTransformed_whit_hour)} >
                    <View style={{flexDirection:'row'}} >
                        <View style={{flexDirection:'column'}}>
                            <Text style={styles.mainTitle} >   Emitir Documento : </Text>

                            { item['item']['currentDay'] == false ?
                                <Text style={styles.secondaryTitle}>     {dateTransformed_whitout_hour}  </Text>
                                :
                                <Text style={styles.secondaryTitle}>     {dateTransformed_whit_hour} </Text>
                            }
                        </View>
                        <Image source={require("../../assets/exportarPDF.png")} style={styles.image}/>
                    </View>
                </TouchableOpacity>
            </View>
        </>
        )
    }

    const reloadAssistanes =()=>{
        setIsLoading(true)
        setSuperUpdate(!superUpdate)
        setIsLoading(false)
      }

  return (
    <>
        <View style={styles.container}>
            <View style={styles.box} >
                <View style={styles.SecondaryBox} >
                { internetConnection ? 
                <>
                       { allSavedAssistances &&
                         <FlatList refreshControl={
                            <RefreshControl
                                enabled={true}
                                refreshing={isLoading}
                                onRefresh={() => reloadAssistanes()} 
                                tintColor='blue'
                            />
                        } data={allSavedAssistances } renderItem={(item, index) => render(item)}  keyExtractor={(item, index) => index} />
                    }
                </>
                :
                <>
                <View style={{flexDirection:'row', alignSelf:'center'}} >
                    <MaterialCommunityIcons style={{marginTop:12}}  name={'wifi-off'}  size={30} color={'gray'}/>   
                    <Text style={styles.text} >  No hay internet ... </Text>
                </View>   
                </>
               }
                </View>
            </View> 
            <View style={{marginTop:20}} />
                { course_info &&
                    <ProfileButtonExportAll specialPermission={specialPermission} course_info={course_info} pantera={pantera} totalAsistencias={allSavedAssistances.length} coursename={coursename} courseStudents={course_info['students']}  title='Exportar Todas'  allSavedAssistances={allSavedAssistances} />
                }
        </View>
    </>
  )
}
export default AssistancesScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ffffff"
      },
      box:{
        marginTop: 10,
        paddingVertical: 8,
        borderWidth: 0,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#BFE2D0",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        height:'84%',
        width:'90%',
        alignSelf:'center',
        top:10
      },
      SecondaryBox:{
        marginTop: 15,
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
      image:{
        width: "80%",
        height: 50,
        resizeMode: "contain",
        alignItems: "center",
        left:'-60%',
        bottom:5
      },
      mainTitle:{
        fontSize:18,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'flex-start',
        fontWeight: '500',
        color:'#6D6D6D',
      },
      secondaryTitle:{
        fontSize:12,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'flex-start',
        fontWeight: '500',
        color:'#6D6D6D',
      },
      text:{
        fontSize:18,
        fontWeight: '400',
        color:'#6D6D6D',
        marginTop:15,
        alignSelf:'center'
      },
})