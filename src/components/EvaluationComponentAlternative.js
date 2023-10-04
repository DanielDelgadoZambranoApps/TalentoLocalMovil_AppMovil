import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'

const EvaluationComponentAlternative = ({item, setStudentsNotas, studentsNotas}) => {
    const [ nota_local, setNota_local ] = useState(item['item']['nota'])
    let previusNotes = []

    const updateNotas = (newText)=>{
        if (studentsNotas.length > 0) {
            for(const previusstudentinfo of studentsNotas){
                if(previusstudentinfo['nombre_estudiante'] == item['item']['nombre_estudiante'])
                {
                    //Nothing
                } else {
                    previusNotes.push(previusstudentinfo)
                }
            }
        }
      
        previusNotes.push({nombre_estudiante:item['item']['nombre_estudiante'], nota:newText})
        setStudentsNotas(previusNotes)
        setNota_local(newText)
    }
  return (
    <>
    <View style={styles.container} >
        <View style={{flexDirection:'row', marginTop:30}} >
        <Text style={styles.text}  > {item['item']['nombre_estudiante']} </Text>
        <TextInput
        onChangeText={newText => updateNotas(newText)}
        defaultValue={nota_local}
         style={styles.input_nota} placeholderTextColor="#666"  fontStyle={nota_local.length == 0 ? 'italic' : 'normal'} placeholder={ "Nota"} />
        </View>
    </View>
</>
  )
}

export default EvaluationComponentAlternative

const styles = StyleSheet.create({
    container:{ 
        flex:1,
        backgroundColor:"#ffffff"
      },
    text:{
        fontSize:16 ,
        fontWeight: '400',
        color:'#6D6D6D',
        left:15,
        marginTop:-5,
        width:'45%'
      },
      input_nota: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        backgroundColor:'#ffffff',
        elevation:10,
        borderRadius:10,
        right:10,
        width:'30%',
        borderRightColor:'#6D6D6D',
        borderBottomColor:'#6D6D6D',
        borderTopColor:'#6D6D6D',
        borderLeftColor:'#6D6D6D',
        borderWidth:1,
        fontSize: 16,
        left:60,
        color: '#333',
        bottom:15
      },
})