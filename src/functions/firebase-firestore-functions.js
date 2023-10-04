import { Alert } from "react-native"

import { DeleteEventPictures } from './firebase-storage-functions'
import { CheckConnectivity } from '../functions/general-functions'
import firestore from '@react-native-firebase/firestore'; 

export const GetCollection = async (collection, setData) =>{
    if(CheckConnectivity()){
      console.log(collection  + " sacado desde Firebase")
      const subscriber = firestore().collection(collection).onSnapshot(
        (querySnapshot) => {
          let temp = []
          querySnapshot.forEach((documentSnapshot) => {
            let userDetails = {};
            userDetails = documentSnapshot.data();
            userDetails['id'] = documentSnapshot.id;
            temp.push(userDetails);
          })
          setData(temp);
        },
        (error) => {
          console.log('error', error);
        })
        return () => subscriber()  
        }
      else {
        Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
      }
  }

export const createUserIniatialDataInFirebase = (user, userName) => {
  firestore().collection('Usuarios').doc(user['user'].uid).set({
    userMail:user['user'].email ,
    userCompleteName : userName ,
    userID: user['user'].uid,
    cursos_ids:[]
  })
  .then((value) => {
    console.log("Registro en Firestore realizado satisfactoriamente !")
  }) 
}

export const deleteItem = async (itemID = null) => {
  await firestore().collection('Items').doc(itemID).delete().then(()=>{console.log("Item " + itemID + " eliminado con exito !")})
 // DeleteEventPictures("", itemID)
}

export const BuyItem = async (item , userInfo) => {

  const userRequestInfo =  await firestore().collection('Usuarios').doc(userInfo.userID).get()
  const userOwnerInfo =  await firestore().collection('Usuarios').doc(item['item'].userID).get()

  let newItemInfo = item['item']
  let newRequestReceive = []
  let newRequestSends = []

  newItemInfo.requesterUserName = userInfo.userCompleteName
  newItemInfo.requesterUserID=userInfo.userID
  

  if( Number(userInfo.Creditos) < Number(item['item'].credits)  ){
    Alert.alert("No tiene suficiente dinero para adquirir el articulo ...", "",
                [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
  } else {
    Alert.alert("Solicitud enviada !", "Revise la pantalla de solicitudes ...",
                [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })

                if(userRequestInfo){
                  if(userRequestInfo._data){
                    if(userRequestInfo._data.requestSends) newRequestSends = userRequestInfo._data.requestSends 
                  }
                }
                newRequestSends.push(newItemInfo)
                firestore().collection('Usuarios').doc(userInfo.userID).update({ requestSends:newRequestSends})
                .then(() => {})
                if(userOwnerInfo){
                  if(userOwnerInfo._data){
                    if(userOwnerInfo._data.requestReceive) newRequestReceive = userOwnerInfo._data.requestReceive 
                     
                  }
                }
                newRequestReceive.push(newItemInfo)
                firestore().collection('Usuarios').doc(item['item'].userID).update({ requestReceive:newRequestReceive})
                .then(() => {})
  }
}


export const deleteOrConfirmRequest = async (userInfo, item, setUpdate, update, addItem=false) => {

  const userRequestInfo =  await firestore().collection('Usuarios').doc(item['item'].requesterUserID).get()
  const userOwnerInfo =  await firestore().collection('Usuarios').doc(item['item'].userID).get()
  const itemInfo =  await firestore().collection('Items').doc(item['item'].id).get()

  let newRequestSends = []
  let newRequestReceive = []
  let newUserItems = []
  let updateUserCredits
  let itemAvailable = addItem
  let newAmount 
  let addItemInfo = false 

  if(userRequestInfo){
    if(userRequestInfo._data){
      if(userRequestInfo._data.requestSends){
        for(const [key, value] of  Object.entries(userRequestInfo._data.requestSends) ){
          if( !(value.itemID === item['item'].itemID) || addItemInfo ){
            newRequestSends.push(value)
          } else {
            addItemInfo=true
          }
        }
      } 
      if(userRequestInfo._data.userItems) newUserItems = userRequestInfo._data.userItems
      if(addItem){
        newUserItems.push(item['item'])
        if(itemInfo) if(itemInfo._data){
          if (itemInfo._data.cantidad)  newAmount = Number(itemInfo._data.cantidad) - 1
        } 
      } 
      updateUserCredits = Number(userRequestInfo._data.Creditos) - Number(item['item'].credits)
    }
  }
  addItemInfo=false

  firestore().collection('Usuarios').doc(userRequestInfo._data.userID).update({
    requestSends:newRequestSends,
  }).then((value)=>{
    setUpdate(!update)
  })

  if(itemAvailable){
    firestore().collection('Usuarios').doc(userRequestInfo._data.userID).update({
      userItems:newUserItems,
      Creditos:updateUserCredits
    }).then((value)=>{
      setUpdate(!update)
    }) 

    if(newAmount>0){
      firestore().collection('Items').doc(item['item'].id).update({
        cantidad:newAmount
      }).then((value)=>{
      })
    } else {
      deleteItem(item['item'].id)
      Alert.alert("Error", "No quedan unidades disponibles de este articulo ...",
      [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
    }
  }

  if(userOwnerInfo){
    if(userOwnerInfo._data){
      if(userOwnerInfo._data.requestReceive){
        for(const [key, value] of Object.entries(userOwnerInfo._data.requestReceive) ){
          if( !(value.itemID === item['item'].itemID) || (addItemInfo) ){
            newRequestReceive.push(value)
          } else {
            addItemInfo=true
          }
        }
      } 
    }
  }
  
  firestore().collection('Usuarios').doc(item['item'].userID).update({
    requestReceive:newRequestReceive
  }).then((value)=>{
    setUpdate(!update)
  })

  if(addItem){
    Alert.alert("Confirmacion exitosa !", "El articulo se agrego al inventario del usuario que realizo la solicitud.",
                [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })

  } else {
    Alert.alert("Eliminada", "La solicitud se elimino de manera satisfactoria.",
                [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })

    }
  }

export const GetSpecificDocCollection = async (collection, docID)=>{
  const userInfo =  await firestore().collection(collection).doc(docID).get()
  if(userInfo){
    if(userInfo._data){
      if(userInfo._data.credits)
      console.log("creditos del usuario ----> " + userInfo._data.credits)
    }
  }
}

export const GetAllUserData = async (collection, userDocID, setData)=>{
  const userInfo =  await firestore().collection(collection).doc(userDocID).get()
  if(userInfo) if(userInfo._data)setData(userInfo._data) 
}

export const GenerateHomeWork = async (date, date2, date3, date4, totalAuthors, courseName, authors, courseDescription, allteachers, daysArray, setSelectedTeachers)=> {
  let generatedCourseID =""

  let final_students_array = []

  for(const current_student of authors){
    final_students_array.push({nombre_estudiante :current_student, rut:""})
  }

   firestore().collection('Cursos').add({
    date:date,
    date2 : date2,
    fecha_Inicio:date3,
    fecha_termino:date4,
    totalAuthors:totalAuthors,
    courseName:courseName,
    students:final_students_array,
    courseDescription:courseDescription,
    teachers:allteachers,
    daysArray:daysArray,
    expoEditLastDate:false 
  }).then(async(value) => {
    generatedCourseID= value.id
    console.log("1.curso creado --->" + value.id)

    for(const currentTeacher of allteachers){

      const godID = currentTeacher['teacherid']
      let previus_ids = [] 
      let userInfo = await firestore().collection('Usuarios').doc(godID).get()
  
      if(userInfo){
        if(userInfo._data){
          if(userInfo._data['cursos_ids']){
            previus_ids  = userInfo._data['cursos_ids']
          }
        }
      }
      previus_ids.push(value.id)
      firestore().collection('Usuarios').doc(currentTeacher['teacherid']).update({
        cursos_ids:previus_ids
        }).then((value) => {})
    } 

    firestore().collection('Cursos').doc(generatedCourseID).update({
      cursoID:generatedCourseID
    }).then((value) => {
      console.log("2.id actualizado del curso ----> " )
    })

    let previus_courses_all_ids = [] 
    let specific_doc_whit_all_courses = await firestore().collection('AllCoursesDocument').doc('AllCoursesDocument').get()
    let documentoExists = false
    console.log("1 <-----------------------")
    if(specific_doc_whit_all_courses){
      console.log("2 <-----------------------")
      if(specific_doc_whit_all_courses._data){
        console.log("3 <-----------------------")
        if(specific_doc_whit_all_courses._data['AllCoursesDocument']){
          console.log("4 <-----------------------")
          previus_courses_all_ids = specific_doc_whit_all_courses._data['AllCoursesDocument']
          documentoExists = true
        }
      }
    }
    previus_courses_all_ids.push(generatedCourseID)

    if(documentoExists){
      console.log("5 <-----------------------" + documentoExists)
      firestore().collection('AllCoursesDocument').doc('AllCoursesDocument').update({
        AllCoursesDocument:previus_courses_all_ids
      }).then((value) => { 
        console.log("Curso Agregado a la coleccion allcoursesDocument " )
      })
    } else {
      console.log("6 <-----------------------" + documentoExists)
      firestore().collection('AllCoursesDocument').doc('AllCoursesDocument').set({
        AllCoursesDocument:previus_courses_all_ids
      }).then((value) => {
        console.log("Curso Agregado a la coleccion allcoursesDocument (creada x primera vez )" )
      })

    }

    



  })

  /*for(const currentTeacher of allteachers){
    let previus_ids = [] 
    let userInfo = await firestore().collection('Usuarios').doc(currentTeacher['teacherid']).get()

    if(userInfo){
      if(userInfo._data){
        if(userInfo._data['cursos_ids']){
          previus_ids  = userInfo._data['cursos_ids']
        }
      }
    }
    previus_ids.push(generatedCourseID)
    
    firestore().collection('Usuarios').doc(currentTeacher['teacherid']).update({
      cursos_ids:previus_ids
      }).then((value) => {})
  } */

}


export const getSpecificDoc = async (userID, setCourses, defaultcollection = 'Usuarios') => {
  let data
  const userInfo = await firestore().collection(defaultcollection).doc(userID).get()

  if(userInfo){
    if(userInfo._data){
      if(userInfo._data['cursos_ids']){
        data = userInfo._data['cursos_ids']
        setCourses(userInfo._data['cursos_ids'])
      } else {
        setCourses([])
      }
    } else {
      setCourses([])
    }
  } else {
    setCourses([])
  }
}
export const getSpecificDoc_whit_All_Courses =async (setCourses)=>{
  let data
  const userInfo = await firestore().collection('AllCoursesDocument').doc('AllCoursesDocument').get()

  if(userInfo){
    if(userInfo._data){
      if(userInfo._data['AllCoursesDocument']){
        data = userInfo._data['AllCoursesDocument']
        setCourses(userInfo._data['AllCoursesDocument'])
      } else {
        setCourses([])
      }
    } else {
      setCourses([])
    }
  } else {
    setCourses([])
  }

}


export const getSpecificClass = async (classID, setCourseData,) => {
  const userInfo = await firestore().collection('Cursos').doc(classID).get()

  if(userInfo){
    if(userInfo._data){
      setCourseData(userInfo._data)
    }
  }
}

export const saveStudentList = (students, courseid, teacherName, courseData, currentDay, nullAssistace, date, justificationText)=>{
  if(nullAssistace){
    firestore().collection('Cursos').doc(courseid).collection('SavedAssistances').doc().set({
      students:[],
      date:date,
      fecha:date,
      teacherName:teacherName,
      courseName:courseData['courseName'],
      currentDay:currentDay,
      Asistencia_Nula:true,
      justificationText:justificationText,
      dateExpo:false
    })
    .then((value) => {
      console.log("Asistencia nula guardada exitosamente !")
    }) 
  } else {
    firestore().collection('Cursos').doc(courseid).collection('SavedAssistances').doc().set({
      students:students,
      date:date,
      fecha:date,
      teacherName:teacherName,
      courseName:courseData['courseName'],
      currentDay:currentDay,
      Asistencia_Nula:false,
      dateExpo:false
    })
    .then((value) => {
      console.log("Asistencia guardada exitosamente !")
    }) 

  }
}

export const getAllAsistances = async(courseid, setAllSavedAssistances)=> {
  const subscriber = await firestore().collection("Cursos").doc(courseid).collection('SavedAssistances').onSnapshot(
    (querySnapshot) => {
      let temp = []
      querySnapshot.forEach((documentSnapshot) => {
        let userDetails = {};
        userDetails = documentSnapshot.data();
        userDetails['id'] = documentSnapshot.id;
        temp.push(userDetails);
      })
      setAllSavedAssistances(temp)
    },
    (error) => {
      console.log('error', error);
    })
    return () => subscriber()  
}

export const hasSpecialPermission = async (MyID, setSpecialPermission)=> {
    const userInfo = await firestore().collection('SpecialPermissions').doc(MyID).get()
    if(userInfo){
      if(userInfo._data){
        if(userInfo._data['HasSpecialPermission'] == true){
          console.log("Usted Tiene permisos especiales ")
          setSpecialPermission(true)
          return true
        } else {
          console.log("Usted NOOOOOOOOO Tiene permisos especiales ")
          setSpecialPermission(false)
          return false
        }
      } 
    }
    console.log("La Base de datos NOOOOOOOO esta habilitada ")
    setSpecialPermission(false)
    return false
  }

  export const Add_special_permission =async (userID, setSpecialPermission)=>{
    await firestore().collection('SpecialPermissions').doc(userID).set({
      HasSpecialPermission:true,
    }).then((value)=>{
      console.log("Permisos espciales asignados con exito")
      setSpecialPermission(true)
    })
  }

export const updateUserDataFirebase = (nombre_estudiante, nivelEducacional, nacimiento, direccion, estado, correo, genero, movil, rut, comuna, course_info, navigation, screenToChange)=>{
  let temporalStudentsArray = []
  for (const previusStudent of course_info['students']){
    if (previusStudent['nombre_estudiante'] ==  nombre_estudiante){
      temporalStudentsArray.push({
        nombre_estudiante: nombre_estudiante,
          Direccion:direccion,
          NivelEducacional: nivelEducacional,
          Movil: movil,
          Comuna: comuna,
          rut:  rut,
          Nacimiento: nacimiento,
          Genero: genero,
          Correo: correo,
          EstadoCivil: estado,
          Apellidos: ""
      })
    } else{
      temporalStudentsArray.push(previusStudent)
    }
  }
  
    firestore().collection('Cursos').doc(course_info['cursoID']).update({ students:temporalStudentsArray})
    .then(async() => {
      let course_info_new_data 
      const userInfo = await firestore().collection('Cursos').doc(course_info['cursoID']).get()

      if(CheckConnectivity()){
        if(userInfo){
          if(userInfo._data){
            course_info_new_data = userInfo._data
            navigation.navigate(screenToChange)
            Alert.alert( "Exito !", "Los datos se actualizaron de manera satisfactoria.",[
              { text: "Continuar", onPress: () => {
                  return },
              },
              ,],{ cancelable: true })
          }
        }
        
      } else {
        Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
      }
    })
}


export const uploadNewStudent = async (nombre_estudiante, nivelEducacional, nacimiento, estado, correo, genero, movil, rut, comuna, direccion, userID, cursoID, navigation)=>{
  const userInfo = await firestore().collection('Cursos').doc(cursoID).get()
  let temporal_previus_users = []
      if(userInfo){
          if(userInfo._data)
             console.log("usuarios previs  ------------> " + JSON.stringify( userInfo._data['students'])) 
             temporal_previus_users= userInfo._data['students']
        }
        temporal_previus_users.push({Comuna:comuna, Correo:correo, Direccion:direccion, EstadoCivil:estado, Genero:genero, Movil:movil, Nacimiento:nacimiento, NivelEducacional:nivelEducacional, nombre_estudiante:nombre_estudiante, rut:rut})
        firestore().collection('Cursos').doc(cursoID).update({ students:temporal_previus_users})
          .then(() => {
            console.log("Nuevo user agregado exitosamente ! ")
            navigation.navigate('Tu Cuenta')
            Alert.alert( "Exito !", "Se Agrego Existosamente al usuario",[
              { text: "Continuar", onPress: () => {
                  return },
              },
              ,],{ cancelable: true })
          })
}

export const newEvaluation = (cursoID, nombre_evaluacion, descripcion, studentsNotas, navigation) => {
  firestore().collection('Cursos').doc(cursoID).collection('Evaluaciones').doc().set({
    nombre_evaluacion:nombre_evaluacion,
    descripcion:descripcion,
    studentsNotas:studentsNotas,
  })
  .then((value) => {
    firestore().collection('Cursos').doc(cursoID).collection('Evaluaciones').doc(value.id).set({
      EvaluationID:value.id
    })  .then((value) => {
      navigation.navigate('Tu Cuenta')
      console.log("Evaluacion guardada exitosamente !")
      Alert.alert("Exito ...", "La evaluacion se guardo correctamente.", [{ text: "Continuar", onPress: () => {return null}}])
    })
  }) 
}

export const updateEvaluation = async (cursoID, nombre_evaluacion, descripcion, studentsNotas, navigation, evaluationID) => {
  console.log(" id curso  -------------> " + cursoID)
  console.log(" id evaluacion  -------------> " + evaluationID)
  console.log("nombre_evaluacion   -------------> " + nombre_evaluacion)
  console.log("descripcion   -------------> " + descripcion)
  console.log("studentsNotas   -------------> " + JSON.stringify(studentsNotas))

  firestore().collection('Cursos').doc(cursoID).collection('Evaluaciones').doc(evaluationID).update({
    nombre_evaluacion:nombre_evaluacion,
    descripcion:descripcion,
    studentsNotas:studentsNotas
  })
  .then((value) => {
      navigation.navigate('Tu Cuenta')
      console.log("Evaluacion actualizada exitosamente !")
      Alert.alert("Exito ...", "La evaluacion se actualizo correctamente.", [{ text: "Continuar", onPress: () => {return null}}])
  }) 
}

export const getAllEvaluations = async(courseid, SetData)=> {
  const subscriber = await firestore().collection("Cursos").doc(courseid).collection('Evaluaciones').onSnapshot(
    (querySnapshot) => {
      let temp = []
      querySnapshot.forEach((documentSnapshot) => {
        let userDetails = {};
        userDetails = documentSnapshot.data();
        userDetails['id'] = documentSnapshot.id;
        temp.push(userDetails);
      })
      SetData(temp)
    },
    (error) => {
      console.log('error', error);
    })
    return () => subscriber()  
}