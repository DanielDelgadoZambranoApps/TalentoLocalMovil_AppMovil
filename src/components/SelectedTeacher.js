import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import CheckBox from '@react-native-community/checkbox';

const SelectedTeacher = ({item, currentID, localSelected, setlocalSelected, superIDD}) =>{
    const [ teacher, setTeacher] = useState(false)
    const show =  currentID == item['item']['userID'] 

    const AddTeachertoArray =async()=>{
        let localTeacherArray = []
        let localTeacherArray2 = []

        if(localSelected)  localTeacherArray = localSelected
        setTeacher(!teacher)

        if(!teacher){
            console.log("antes --------------->"  + JSON.stringify(localTeacherArray))
            localTeacherArray.push({'teachername':item['item']['userCompleteName'], 'teacherid':item['item']['userID']})
            console.log("despues --------------->"  + JSON.stringify(localTeacherArray))
            setlocalSelected(localTeacherArray)
        } else {
            for(const currentTeacher of localSelected){
                if(item['item']['userID'] == currentTeacher['teacherid']){
                    //nothing
                } else {
                    localTeacherArray2.push(currentTeacher)
                }
            }
            setlocalSelected(localTeacherArray2)
        }
    }

  return (
    <>
    { !show &&
    <>
    <View style={{flexDirection:'row'}} >
        <View style={{width:'80%'}} >
        <Text style={styles.text} >    {item['item']['userCompleteName']} { '\n' } </Text>
        </View>
        <CheckBox
            disabled={false}
            value={teacher}
            tintColors={{ true: '#6EA789', false: 'black' }}
            onValueChange={(value) => {AddTeachertoArray()} }
        />
        <Text style={styles.text} >{ '\n' } </Text>
    </View>
    </>

    }
    </>
  )
}
export default SelectedTeacher

const styles = StyleSheet.create({
    text:{
        top:2
    }
})