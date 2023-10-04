import React, { useState, useEffect}  from 'react'
import { Text, TouchableOpacity, Alert, View, FlatList, StyleSheet, TextInput } from 'react-native'
import CheckBox from '@react-native-community/checkbox';

const DeleteComponent = ({setNames_to_Delete_Array, names_to_Delete_Array, studentName}) => {
    const [ addAction , setAddAction ]  = useState(false)

    const delete_or_add = ()=>{ 
        let previusNamesToDelete =[]
        if(!addAction){
            if(names_to_Delete_Array){
                if(names_to_Delete_Array.length>0){
                    previusNamesToDelete =  names_to_Delete_Array
                }
            }
            previusNamesToDelete.push(studentName)
        } else {
            console.log("1.deberia entra aqui")
            if(names_to_Delete_Array){
                console.log("2.deberia entra aqui")
                if(names_to_Delete_Array.length>0){
                    console.log("3.deberia entra aqui")
                    for(const previusStudent of names_to_Delete_Array){
                        console.log("comparando name guardado " + previusStudent + " con "+ studentName)
                        if(previusStudent == studentName){
                        // nothing
                        } else {
                            previusNamesToDelete.push(previusStudent)
                        }
                    }
                }
            }
            
        }
        setNames_to_Delete_Array(previusNamesToDelete)
        setAddAction(!addAction)
    }

  return (
    <>
        <CheckBox
                  disabled={false}    
                  value={addAction}
                  onValueChange={(value) => {delete_or_add()} }
                  />  
    </>
  )
}

export default DeleteComponent

const styles = StyleSheet.create({})