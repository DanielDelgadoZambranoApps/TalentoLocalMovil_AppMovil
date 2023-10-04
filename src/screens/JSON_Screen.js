import React, { useState, useEffect} from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import firestore from '@react-native-firebase/firestore'; 
//import data from '../../xxx.json'

const data = []

const JSON_Screen  = () => {

    const subirwea =  () => {
        console.log("Empenzando ...")
        let final_students_array = []
        for(const item of data){
        /*  console.log("item ------------->"  + JSON.stringify(item['Rut']))
            console.log("item ------------->"  + JSON.stringify(item['Estado']))
            console.log("item ------------->"  + JSON.stringify(item['Nombre']))
            console.log("item ------------->"  + JSON.stringify(item['Apellidos']))
            console.log("item ------------->"  + JSON.stringify(item['Genero']))
            console.log("item ------------->"  + JSON.stringify(item['Nacimiento']))
            console.log("item ------------->"  + JSON.stringify(item['Móvil']))
            console.log("item ------------->"  + JSON.stringify(item['Correo']))
            console.log("item ------------->"  + JSON.stringify(item['Direccion']))
            console.log("item ------------->"  + JSON.stringify(item['Comuna']))
            console.log("item ------------->"  + JSON.stringify(item['Nivel Educacional'])) */

            final_students_array.push({nombre_estudiante :item['Nombre y Apellido'], rut:item['Rut'], EstadoCivil:'Sin Informacionn',
                Apellidos:'', Genero:item['Genero'], Nacimiento:item['Nacimiento'],Movil:item['Móvil'],
                    Correo:item['Correo'], Direccion:item['Direccion'], Comuna:item['Comuna'], NivelEducacional:'Sin Informacion' })
        }

       /* final_students_array.push({nombre_estudiante :'Kevin ramirez', rut:""})
        final_students_array.push({nombre_estudiante :'Felipe aspee', rut:""})
        final_students_array.push({nombre_estudiante :'Paola enero', rut:""}) */

        console.log("contenido final --->" + JSON.stringify(final_students_array))
        uploadfire(final_students_array)
   }

    const uploadfire = async (final_students_array)=>{

        await firestore().collection('Cursos').doc('nrdah6WYW7H6cEwYWXE8').update({
            students:final_students_array
          }).then((value) => {
            console.log("2.id actualizado del curso ----> " )
          })

    }

  return (
    <>
        <View>
            <Button title="Subirr la wea po"  onPress={()=>{subirwea()}} />
            <Text>JSON_Screen</Text>
        </View>
    </>
    )}
export default JSON_Screen

const styles = StyleSheet.create({})