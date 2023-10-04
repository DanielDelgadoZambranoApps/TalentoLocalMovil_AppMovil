import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'

import CheckBox from '@react-native-community/checkbox';

const StudentComponent = ({item, selectedStudents, setSelectedStudents}) => {
    const [ toggleCheckBox, setToggleCheckBox ] = useState(false)

    useEffect(()=>{
      let students
      let emptyArray = []

      if(selectedStudents) students =  selectedStudents
      if(toggleCheckBox){
        students.push(item['item']['nombre_estudiante'])
        setSelectedStudents(students)
      } else {
        
        if(students){
          for(const currentStudent of students){
            if(currentStudent == item['item']['nombre_estudiante']){
              // nothing
            }else {
              emptyArray.push(currentStudent)
            }
          }
        }
        setSelectedStudents(emptyArray)
        emptyArray = []
      }
    },[toggleCheckBox])

    const addStudent =()=>{
      setToggleCheckBox(!toggleCheckBox)
    }
    
  return (
    <>
      <CheckBox
                disabled={false}
                value={toggleCheckBox}
                tintColors={{ true: '#009EFF', false: 'black' }}
                onValueChange={(value) => {addStudent()} }
                />
    <View style={styles.container} >
        <View style={{flexDirection:'row', bottom:30}} >
        <View style={{marginLeft:10}}  />
        <View style={{width:'50%'}} >
          <Text>               {item['item']['nombre_estudiante']} </Text>
        </View>
            <Text>               {item['item']['estado_estudiante']} </Text>
        </View>
    </View>
    </>
  )
}
export default StudentComponent

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ffffff",
      },
})