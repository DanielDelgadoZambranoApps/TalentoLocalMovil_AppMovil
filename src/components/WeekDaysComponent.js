import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'

import CheckBox from '@react-native-community/checkbox';

const WeekDaysComponent = ({setDaysArray, daysArray}) => {

    const [lunesCheckbox , setLunesCheckbox] = useState(false)
    const [martesCheckbox , setMartesCheckbox] = useState(false)
    const [miercolesCheckbox , setMiercolesCheckbox] = useState(false)
    const [juevesCheckbox , setJuevesCheckbox] = useState(false)
    const [viernesCheckbox , setViernesCheckbox ] = useState(false)
    const [sabadoCheckbox , setSabadoCheckbox] = useState(false)
    const [domingoCheckbox , setDomingoCheckbox] = useState(false)

    const addDayToArray =(day)=>{
        let localDaysArray = []
        localDaysArray = daysArray
        localDaysArray.push(day)
        console.log("agregando --------------> " + JSON.stringify(localDaysArray))
        setDaysArray(localDaysArray)
    }
    const removeDayToArray =(day)=>{
        let localDaysArray = []
        let alreadyDaysArray = daysArray

        for(const currentDay of alreadyDaysArray){
            if(currentDay != day ){
                localDaysArray.push(currentDay)
            } else {

            }
        }
        console.log("eliminando --------------> " + JSON.stringify(localDaysArray))

        setDaysArray(localDaysArray)
    }

    const addDay =(selectedDay)=>{

        switch(selectedDay){

            case 'Lunes':
                setLunesCheckbox(!lunesCheckbox)
                if(!lunesCheckbox){
                    addDayToArray('Lunes')
                } else{
                    removeDayToArray('Lunes')
                }
            break

            case 'Martes':
                setMartesCheckbox(!martesCheckbox)
                if(!martesCheckbox){
                    addDayToArray('Martes')
                } else{
                    removeDayToArray('Martes')
                }
            break

            case 'Miercoles':
                setMiercolesCheckbox(!miercolesCheckbox)
                if(!miercolesCheckbox){
                    addDayToArray('Miercoles')
                } else{
                    removeDayToArray('Miercoles') 
                }
            break

                    
            case 'Jueves':
                setJuevesCheckbox(!juevesCheckbox)
                if(!juevesCheckbox){
                    addDayToArray('Jueves')
                } else{
                    removeDayToArray('Jueves')
                }
            break

            case 'Viernes':
                setViernesCheckbox(!viernesCheckbox)
                if(!viernesCheckbox){
                    addDayToArray('Viernes')
                } else{
                    removeDayToArray('Viernes')
                }
            break

            case 'Sabado':
                setSabadoCheckbox(!sabadoCheckbox)
                if(!sabadoCheckbox){
                    addDayToArray('Sabado')
                } else{
                    removeDayToArray('Sabado')
                }
            break
        }
    }

  return (
    <>    
    <View style={{flexDirection:'row', alignSelf:'center', marginBottom:20}} >
        <Text style={{bottom:-5}} >Lun</Text>
        <CheckBox
            disabled={false}
            value={lunesCheckbox}
            tintColors={{ true: '#009EFF', false: 'black' }}
            onValueChange={(value) => {addDay('Lunes')} }
        />
                <Text style={{bottom:-5}} >Mar</Text>
        <CheckBox
            disabled={false}
            value={martesCheckbox}
            tintColors={{ true: '#009EFF', false: 'black' }}
            onValueChange={(value) => {addDay('Martes')} }
        />
                <Text style={{bottom:-5}} >Mier</Text>
        <CheckBox
            disabled={false}
            value={miercolesCheckbox}
            tintColors={{ true: '#009EFF', false: 'black' }}
            onValueChange={(value) => {addDay('Miercoles')} }
        />
                <Text style={{bottom:-5}} >Jue</Text>
        <CheckBox
            disabled={false}
            value={juevesCheckbox}
            tintColors={{ true: '#009EFF', false: 'black' }}
            onValueChange={(value) => {addDay('Jueves')} }
        />
                <Text style={{bottom:-5}} >Vie</Text>
        <CheckBox
            disabled={false}
            value={viernesCheckbox}
            tintColors={{ true: '#009EFF', false: 'black' }}
            onValueChange={(value) => {addDay('Viernes')} }
        />
                <Text style={{bottom:-5}} >Sab</Text>
        <CheckBox
            disabled={false}
            value={sabadoCheckbox}
            tintColors={{ true: '#009EFF', false: 'black' }}
            onValueChange={(value) => {addDay('Sabado')} }
        />
    </View>
    </>
    )

}
export default WeekDaysComponent

const styles = StyleSheet.create({})