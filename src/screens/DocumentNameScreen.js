import React, { useEffect, useState } from 'react'
import { Text, View, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { writeFile, DownloadDirectoryPath } from 'react-native-fs'
import XLSX from 'xlsx'

const DocumentNameScreen = ({route, navigation}) => {
  const { item, dateTransformed_whitout_hour, dateTransformed_whit_hour,  courseid,
           course_info, coursename, pantera, specialPermission, userID  } = route.params
  const [ documentName, setDocumentName ] = useState('')

  const exportExel =()=>{
    let studentsData_transform_to_export = []
    const students_assistance_array = []
    let index = 0
    let fileTitle = documentName
    if(fileTitle.length == 0) fileTitle='Exel Document'
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
                  navigation.navigate('AssistancesScreen', { userID:userID, courseid:courseid, course_info:course_info, coursename:coursename, pantera:pantera, specialPermission:specialPermission})
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
                  navigation.navigate('AssistancesScreen', { userID:userID, courseid:courseid, course_info:course_info, coursename:coursename, pantera:pantera, specialPermission:specialPermission})
                    return },
                },
                ,],{ cancelable: true })
        })
        .catch(e=>{
            console.log("Error durante la exportacion ....")
        })
    }
}

  return (
    <>
    <View style={styles.container} >
      <View style={styles.box} >
        <View style={{alignSelf:'center', width:'100%', left:25, marginTop:'60%'}} >
          <Text  style={styles.titleStyle} > Nombre Documento  :</Text>
          <TextInput style={styles.input} onChangeText={setDocumentName} value={documentName} placeholder={'Ingrese un nombre para exportar'} />
        </View>
      </View>
      <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={()=>exportExel()}>
              <Text style={styles.textStyle}> Generar Documento </Text>
            </TouchableOpacity>
    </View>
    </>
  )
}

export default DocumentNameScreen

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
      height:'84%',
      width:'90%',
      alignSelf:'center'
    },
    titleStyle:{
      fontSize:16,
      fontWeight: '500',
      color:'#6D6D6D',
      right:10,
      marginBottom:10,
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
      marginTop: 18,
      marginBottom: 10,
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