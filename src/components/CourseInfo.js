import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { getSpecificClass } from '../functions/firebase-firestore-functions'

 const CourseInfo = ({screenToChange, userCompleteName, navigation, classID, userID}) => {
    const [ courseData, setCourseData ] = useState(null)
    
    useEffect(()=>{
        getSpecificClass(classID, setCourseData)
    },[])
    
    const changeScreen = () =>{
      navigation.navigate('CourseScreen', {
        course_info:courseData,
        userID:userID,
        userCompleteName:userCompleteName,
        coursename :courseData['courseName'] ,
        screenToChange:screenToChange
      })
    }

    let shortCourseName = ""
    let index = 0

    if(courseData){
      for(const letra of courseData['courseName']){
        shortCourseName = shortCourseName + letra
        index = index +1 
        if( index >15){
          shortCourseName = shortCourseName + " ..."
          break
        } 
      }
    }

  return (
    <>
     <View style={styles.container} >
      { courseData &&
        <>
        <View style={{flexDirection:'row', marginBottom:20}} >
          <View style={{flexDirection:'row', marginTop:10, marginBottom:10, width:'74%'}} >
            <Image source={require("../../assets/teacherclass.png")} style={styles.image}/>
            <Text style={styles.text} >{ shortCourseName }  </Text>
          </View>
          <View style={{flexDirection:'column', left:35}} >
            <TouchableOpacity onPress={()=>{changeScreen()}} >
              <FontAwesome5 name={'chalkboard-teacher'} size={26} color="#A5E2C3" />
            </TouchableOpacity>
            <View style={{marginBottom:8}} />
            <TouchableOpacity onPress={()=>{navigation.navigate('StudentsDataScreen' ,{ course_info:courseData, screenToChange:screenToChange} )} } >
              <FontAwesome5 name={'users'} size={25} color="#A5E2C3" />
            </TouchableOpacity>
          </View>
        </View>
      </>
      }
    </View>
  </>
  )
}
export default CourseInfo

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#ffffff"
  },
  text:{
    fontSize:18,
    fontWeight: '500',
    color:'#6D6D6D',
    marginTop:15,
    marginLeft:-155,
    left:5
  },
  image:{
    height: 50,
    resizeMode: "contain",
    left:-70
  },
})