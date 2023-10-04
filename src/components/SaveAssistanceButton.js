import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'

import { saveStudentList } from '../functions/firebase-firestore-functions'
 
const SaveAssistanceButton = ({coursename, courseData, teacherName, title, navigation, asisstencia=false, selectedStudents, courseid, userID}) => {

  const checkNextScreen =()=>{
    //  navigation.navigate('UserItemsScreen')
    if(asisstencia){
      Alert.alert( "Alerta ", "Esta a punto de guardar la asistencia de este dia, esta seguro que los datos son correctos ?",[
        {text: "Subir Asistencia", onPress: () => { 
      saveStudentList(coursename, selectedStudents, courseid, teacherName, navigation, courseData, userID)}},
    { text: "Volver", onPress: () => {
      return },
    },],{ cancelable: true })}
  }

  return (
    <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={()=>checkNextScreen()}>
              <Text style={styles.textStyle}> {title} </Text>
            </TouchableOpacity>
  );
};

export default SaveAssistanceButton;

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
    marginTop:30,
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
