import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'

import { GetCollection } from '../functions/firebase-firestore-functions'
import SelectedTeacher from './SelectedTeacher';

const SelectTeachers = ({currentID, selectedTeachers, setSelectedTeachers, superIDD}) => {
    const [ teachers, setTeachers ] = useState([])
    const [ localSelected, setlocalSelected ] = useState([])

    useEffect(()=>{
        GetCollection("Usuarios", setTeachers)
    },[])

    useEffect(()=>{
        setSelectedTeachers(localSelected)
    },[localSelected])

    const render = (item)=>{
        return(
            <>
            <SelectedTeacher superIDD={superIDD} item ={item} currentID={currentID} localSelected={localSelected} setlocalSelected={setlocalSelected} />
            </>
        )
    }
    
  return (
    <>
    <View style={styles.box} >
        { teachers &&
            <FlatList data={teachers} renderItem={(item, index) => render(item)}  keyExtractor={(item, index) => index} />
        }
    </View>
    </>
  )
}

export default SelectTeachers

const styles = StyleSheet.create({
    box:{
        borderColor: "red",
        borderRadius: 6,
        backgroundColor: "#BFE2D0",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        width:'60%',
        height: 120,
        right :40,
        top:10,
        elevation:10,
        marginLeft:-70
      }
})