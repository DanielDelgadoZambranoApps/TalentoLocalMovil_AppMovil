import React, {useState} from 'react';
import { Text, TouchableOpacity, Alert, StyleSheet } from 'react-native'

import { writeFile, readFile, DownloadDirectoryPath } from 'react-native-fs'
import RNPrint from 'react-native-print'
import XLSX from 'xlsx'

import { getDateNewFormat } from '../functions/general-functions'

const ProfileButtonExportAll = ({specialPermission, course_info, pantera, coursename, title=false, allSavedAssistances=null, courseStudents, totalAsistencias}) => {
  const name =coursename

  const chooseFormat_All_Assistances = () =>{
    Alert.alert( "Escoga una opcion", "¿ En que formato desea exportar ?",[
      { text: "Cancelar", onPress: () => {
          return },
      },
      {text: "Exportar en formato PDF", onPress: () => { 
        if(true){
          GeneratePDF_All_Assistances()
        } else{
          Alert.alert( "Error ", "Su cuenta no posee permisos de administrador" ,[
            { text: "Continuar", onPress: () => {
              return },
            }
            ],{ cancelable: true })
        }
        },},
      {text: "Exportar en formato Exel", onPress: () => { 
        if(true){
          Generate_Exel_All_Assistances() 
        } else{
          Alert.alert( "Error ", "Su cuenta no posee permisos de administrador" ,[
            { text: "Continuar", onPress: () => {
              return },
            }
            ],{ cancelable: true })
        }
        },},
      ,],{ cancelable: true })
  }

  const GeneratePDF_All_Assistances =async()=>{
    let simplenameteachers = ""
    if(course_info['teachers'].length>1){
        let teacherindex = 1
        let first_teacher_flag =true
        for(const current_Teacher of course_info['teachers']){
            if(first_teacher_flag){
                simplenameteachers = current_Teacher.teachername
                first_teacher_flag = false
                teacherindex = teacherindex + 1
            }else {
                if(teacherindex == course_info['teachers'].length){
                    simplenameteachers = simplenameteachers + "  y " + current_Teacher.teachername
                } else {
                    simplenameteachers = simplenameteachers + "  , " + current_Teacher.teachername
                }
                teacherindex=teacherindex + 1
            }   
        }
    } else {
        simplenameteachers= course_info['teachers'][0]['teachername']
    }
    
      const currentDay = new Date()
      let currentDayString = currentDay.toString()
      let previusFinalDate = ""
      let finalDate = "" 
      let index = 0 

      while(index < 16){
        previusFinalDate = previusFinalDate + currentDayString[index]
        index = index + 1
      }
      finalDate = previusFinalDate

      let currentStudent= 1
      let amountAssistances= 0
      let studentsHTMLtext =   '<h4 align="left" > El presente documento corresponde a la asistencia total de la asignatura de '+name  +' a cargo del profesor(es) '+simplenameteachers +' a lo largo de todo el semestre . </h2> <h5 align="left" > ' 
      let secondaryIndex=0
      let large =100
      let large_text= ""
      let total_spaces_jumps = 42 - courseStudents.length
      let txt_spaces_jumps = ""
          index= 0
      let total_null_asistances = 0
      let txt_spaces_jumps_secondary = ""

      while(index < total_spaces_jumps){
        txt_spaces_jumps = txt_spaces_jumps +'<br>'
        index= index +1
      } 
      console.log("total de salto de linea -------> " + total_spaces_jumps )

      let all_tables_students_state_info_tablesArray =  []
      let all_tables_assistances_days_tablesArray =  []
      
      let html_dates = '<tr>'+'<th>Estudiante</th>'
      let html_students_assistanceData = '<tr>' 

      let table_matrix_number = 5
      let index_dimebag = 0
      let save = true
      for(const currentAssistance of allSavedAssistances){
        var simpleDate = new Date(1970, 0, 1)
        simpleDate.setSeconds(currentAssistance['date']['seconds'] - 10800);
        const simpleDateString = simpleDate.toString()
        let dateTransformed_whitout_hour= ""
        let index = 0
            save = true
        if(currentAssistance['dateExpo']==true && currentAssistance['currentDay']==false) {
          dateTransformed_whitout_hour = currentAssistance['date']
        } else {
                while(index<24){
                  dateTransformed_whitout_hour  =  dateTransformed_whitout_hour + simpleDateString[index]
                    index=index + 1
                }
                dateTransformed_whitout_hour = getDateNewFormat(dateTransformed_whitout_hour)
                index=0
        }
        if(currentAssistance['Asistencia_Nula'] == true) total_null_asistances = total_null_asistances + 1
          html_dates = html_dates +'<th>' + dateTransformed_whitout_hour +' </th>'
          index_dimebag = index_dimebag + 1
        if(index_dimebag > table_matrix_number){
          html_dates = html_dates + '</tr>'
          all_tables_assistances_days_tablesArray.push(html_dates)
          html_dates = '<table  align="center"  id="data-table" border="1" cellpadding="1" cellspacing="1">' + '<tr>'+'<th>Estudiante</th>' 
          index_dimebag = 0
          save = false
          }
      }
      if(save){
        html_dates = html_dates + '</tr>'
        all_tables_assistances_days_tablesArray.push(html_dates)
      } 
      index=0  
      studentsHTMLtext = studentsHTMLtext + '<h4 align="center" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ 'Estado' +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Asistencia </h4>'

      let iteraciones =  Math.trunc(allSavedAssistances.length/ (table_matrix_number +1))  
      let last_tables = (allSavedAssistances.length % (table_matrix_number +1))
      let interaciones_index = 0
      let base = 0
      let index_course = 0

      while (index_course < courseStudents.length) { 
        amountAssistances = 0
        large = large - courseStudents[index_course]['nombre_estudiante'].length*1.6
        console.log("1. para el alumno ------------> " + courseStudents[index_course]['nombre_estudiante'])
        while(secondaryIndex <large){
          large_text = large_text + "&nbsp;"
          secondaryIndex= secondaryIndex + 1
        }
        let assistance_index = 0
        while(assistance_index < allSavedAssistances.length){
          if(allSavedAssistances[assistance_index ]['Asistencia_Nula'] == true){
            // Nothing
          } else {
            let third_index = 0
            while( third_index <  allSavedAssistances[assistance_index]['students'].length) { 
              if(courseStudents[index_course]['nombre_estudiante'] == allSavedAssistances[assistance_index]['students'][third_index]['Student Name']  ){
                amountAssistances =    amountAssistances +1
              }
              third_index = third_index + 1
            }       
             
          }
          assistance_index = assistance_index +1 
        }
      // let secondaryindex = 65 - courseStudents[index_course]['nombre_estudiante'].length*2.0
        let secondaryindex = 36
        let another_index= 0

        while(another_index < secondaryindex){
          txt_spaces_jumps_secondary =  txt_spaces_jumps_secondary +  '&nbsp;'
          another_index = another_index +1
        }
        studentsHTMLtext = studentsHTMLtext + currentStudent+') '+ courseStudents[index_course]['nombre_estudiante'] + txt_spaces_jumps_secondary  + courseStudents[index_course]['EstadoCivil']   + txt_spaces_jumps_secondary +parseFloat((amountAssistances/(totalAsistencias - total_null_asistances)*100).toFixed(2)) +" % " +"&nbsp;&nbsp;&nbsp" +   amountAssistances + " Asistencias"     +'<br>'
        currentStudent = currentStudent +1
        txt_spaces_jumps_secondary=""
        index_course = index_course + 1
        assistance_index = assistance_index + 1
      }
      index_course = 0

      while(interaciones_index < iteraciones){  // cantidad de tablas
        html_students_assistanceData = '<tr>' 
        index_course = 0
        while (index_course < courseStudents.length) { 
          html_students_assistanceData = html_students_assistanceData + '<td>'+courseStudents[index_course]['nombre_estudiante']+'</td>'
          let assistance_index = 0
            while(assistance_index < (table_matrix_number + 1 ) ){ 
              if(allSavedAssistances[assistance_index + base]['Asistencia_Nula'] == true){
                html_students_assistanceData = html_students_assistanceData + '<td>Anulada</td>'
              } else {
                let was_present = false
                let third_index = 0
                while( third_index <  allSavedAssistances[assistance_index]['students'].length) { 
                  if(courseStudents[index_course]['nombre_estudiante'] == allSavedAssistances[assistance_index]['students'][third_index]['Student Name']  ){
                    was_present=true
                  }
                  third_index = third_index + 1
                }//
                if(was_present){
                  html_students_assistanceData = html_students_assistanceData + '<td>Presente</td>'
                } else {
                  html_students_assistanceData = html_students_assistanceData + '<td>Ausente</td>'
                }           
              }
            assistance_index = assistance_index +1
          }    
        // let secondaryindex = 65 - courseStudents[index_course]['nombre_estudiante'].length*2.0
          let secondaryindex = 36
          let another_index= 0

          while(another_index < secondaryindex){
            txt_spaces_jumps_secondary =  txt_spaces_jumps_secondary +  '&nbsp;'
            another_index = another_index +1
          }
          currentStudent = currentStudent +1
          txt_spaces_jumps_secondary=""
          index_course = index_course + 1
          assistance_index = assistance_index + 1
          html_students_assistanceData  =  html_students_assistanceData + '</tr>'
          html_students_assistanceData = html_students_assistanceData +'<tr>'
        }
        all_tables_students_state_info_tablesArray.push(html_students_assistanceData)
        base = base + (table_matrix_number )
        interaciones_index = interaciones_index  + 1 
    }
      
      let night_index = 0
      let final_fixed_html 

      if(last_tables> 0 ){
        html_students_assistanceData = '<tr>' 
        index_course = 0
        while (index_course < courseStudents.length) {
          html_students_assistanceData = html_students_assistanceData + '<td>'+courseStudents[index_course]['nombre_estudiante']+'</td>'
            let last_tables_aux = last_tables
            while(last_tables_aux > 0 ){ 
              if(allSavedAssistances[allSavedAssistances.length - last_tables_aux]['Asistencia_Nula'] == true){
                  html_students_assistanceData = html_students_assistanceData + '<td>Anulada</td>'
              } else {
                let was_present = false
                let third_index = 0
                while( third_index <  allSavedAssistances[allSavedAssistances.length - last_tables_aux]['students'].length) { 
                  if(courseStudents[index_course]['nombre_estudiante'] == allSavedAssistances[allSavedAssistances.length - last_tables_aux]['students'][third_index]['Student Name']  ){
                    amountAssistances = amountAssistances + 1
                    was_present=true
                  }
                  third_index = third_index + 1
                }//
                if(was_present){
                  html_students_assistanceData = html_students_assistanceData + '<td>Presente</td>'
                } else {
                  html_students_assistanceData = html_students_assistanceData + '<td>Ausente</td>'
                }           
              }
              last_tables_aux = last_tables_aux  - 1
          }    
          html_students_assistanceData = html_students_assistanceData +'<tr>'
          index_course = index_course +1
        }
        all_tables_students_state_info_tablesArray.push(html_students_assistanceData)
      } 

      while(night_index < all_tables_assistances_days_tablesArray.length) {
        final_fixed_html = final_fixed_html +  '<table  align="center"  id="data-table" border="1" cellpadding="1" cellspacing="1">'  +all_tables_assistances_days_tablesArray[night_index] +all_tables_students_state_info_tablesArray[night_index] + '</table>' +'<br>'
        night_index = night_index + 1
      }
      let html_tables_fixed = ''
      let fix_index = 9

      while(final_fixed_html[fix_index]){
        html_tables_fixed = html_tables_fixed + final_fixed_html[fix_index]
        fix_index = fix_index + 1
      }

      index = 0
      let saltos_de_linea_portada = ""
          html_students_assistanceData  = html_students_assistanceData +'</tr>' 
      
      while(index<34){
        saltos_de_linea_portada = saltos_de_linea_portada + '<br>'
        index = index +1
      }
      console.log("nimu ---------------> " + studentsHTMLtext)

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
        '<h1 align="center" > ' + "Asistencia Completa" + '</h1>'+
          saltos_de_linea_portada + 
        '<h3 align="center" > Profesor (es): '  + pantera+  '<br>'+ 'Fecha de Emision: '+ finalDate+ '<br>'+'Curso : '+name +'<br>'+ '</h3>'+
        '<br>'+
        '<h4 >' + studentsHTMLtext + '</h4>' + 
        '<br>'+
        txt_spaces_jumps +
        '<h4 align="center" >    El total de asistencias anuladas durante el transcurso de este curso fueron un total de : ' + total_null_asistances + '</h4>' + 
        html_tables_fixed+
        '<h4 align="left" >Fecha de Emision :'+ finalDate+'</h4>'+
       '</html>'
    })
  }

  const Generate_Exel_All_Assistances = () => {
    let total_assistances_students_array = []
    const currentDay = new Date()
    let amountAssistances = 0
    let currentDayString = currentDay.toString()
    let previusFinalDate = ""
    let date_of_emition = "" 
    let fileTitle = "" 
    let index = 0 

    while(index < 16){
      previusFinalDate = previusFinalDate + currentDayString[index]
      index = index + 1
    }
    fileTitle=previusFinalDate
    previusFinalDate=""
    index=0

    while(index < 24){
      previusFinalDate = previusFinalDate + currentDayString[index]
      index = index + 1
    }
    date_of_emition= previusFinalDate
    let total_null_asistances= 0

    for(const currentAssistance of allSavedAssistances){
      if(currentAssistance['Asistencia_Nula'] == true){ 
          total_null_asistances = total_null_asistances + 1
      }
    }

    for(const registerStudent of courseStudents){
      amountAssistances=0
      for(const currentAssistance of allSavedAssistances){
        for(const studentPresent of currentAssistance['students']){
          if(registerStudent['nombre_estudiante'] == studentPresent['Student Name'] ){
            amountAssistances = amountAssistances + 1
          }
        }
      }
      total_assistances_students_array.push({studentName: registerStudent['nombre_estudiante'],estado :registerStudent['EstadoCivil'] ,totalAssistances:amountAssistances, porcentaje:parseFloat((amountAssistances/ (totalAsistencias-total_null_asistances)*100).toFixed(2)) +" % " })
    }
    let studentsData_transform_to_export = []
        index = 0

    for(const currentStudent of total_assistances_students_array){
      studentsData_transform_to_export.push({
        Estudiante:index + 1, 
        Nombre:currentStudent['studentName'],
        Estado: currentStudent['estado'],
        Asistencias:currentStudent['totalAssistances'],
        Porcentaje:currentStudent['porcentaje'],
      })
        index = index + 1

        for(const currentAssistance of allSavedAssistances){
            var simpleDate = new Date(1970, 0, 1)
            simpleDate.setSeconds(currentAssistance['date']['seconds'] - 10800);
            const simpleDateString = simpleDate.toString()
            let dateTransformed_whitout_hour= ""
            let index = 0
            
            if(currentAssistance['dateExpo']==true && currentAssistance['currentDay']==false) {
              dateTransformed_whitout_hour = currentAssistance['date']
            } else {
                    while(index<24){
                      dateTransformed_whitout_hour  =  dateTransformed_whitout_hour + simpleDateString[index]
                        index=index + 1
                    }
                    dateTransformed_whitout_hour = getDateNewFormat(dateTransformed_whitout_hour)
                    index=0
            }

          let was_present = 'Ausente'
          for(const studentPresent of currentAssistance['students']){
            if(currentAssistance['Asistencia_Nula'] == true  ){
              was_present = 'Anulada'
            } else {
              if(currentStudent['studentName'] == studentPresent['Student Name'] ){
                was_present = 'Presente'
            }
          }
          }
              studentsData_transform_to_export.push({
              [dateTransformed_whitout_hour] :was_present
         })
        }
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
      'Profesor (es) y Curso' :  "Emitido el dia y hora : " + date_of_emition
    })

    studentsData_transform_to_export.push({
      'Asistencias Nulas' : total_null_asistances
    })

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


  return (
    <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={()=>chooseFormat_All_Assistances()}>
              <Text style={styles.textStyle}> {title} </Text>
            </TouchableOpacity>
  );
};

export default ProfileButtonExportAll;

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
    marginTop: 10,
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
});
