import React, { useEffect, useState} from 'react'
import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { getAllEvaluations } from '../functions/firebase-firestore-functions'

const EvaluationSaves = ({route, navigation}) => {
    const { course_info } = route.params
    const [ evaluations, setEvaluations ] = useState(null)

    useEffect(()=>{
        getAllEvaluations(course_info['cursoID'], setEvaluations)
    },[])

    const render =(item)=>{
        return(
            <>
              <TouchableOpacity onPress={()=>{navigation.navigate('EvaluationPreviusScreen' , { item : item['item'], course_info:course_info})}  } >
                <View  style={{flexDirection:'row', alignItems:'flex-start', right:150, marginTop:15, marginBottom:15}} >  
                    <Image source={require("../../assets/evaluation.png")} style={styles.image}/>
                    <View style={{right:150, width:'60%'}} >   
                        <Text style ={styles.text_title} >{item['item']['nombre_evaluacion']} </Text>
                        <Text style ={styles.text} >{item['item']['descripcion']} </Text>
                    </View>
                </View>
              </TouchableOpacity>
            </>)
    }

  return (
    <View style= {styles.container} >
            <View style= {styles.box} >
                <View style={styles.SecondaryBox} >
                    { evaluations &&
                        <FlatList data={evaluations} renderItem={(item, index) => render(item)} keyExtractor={(item, index) => index}  />
                    }
                </View>
            </View>
    </View>

  )
}
export default EvaluationSaves

const styles = StyleSheet.create({
    container:{ 
        flex:1,
        backgroundColor:"#ffffff"
      },
      box:{
        marginTop: 30,
        paddingVertical: 8,
        borderWidth: 0,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#DEFCEC",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        height:'85%',
        width:'90%',
        alignSelf:'center',
        alignItems:'center'
      },
      SecondaryBox:{
        marginTop: 10,
        paddingVertical: 8,
        borderWidth: 0,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#ffffff",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        height:'95%',
        width:'90%',
        alignSelf:'center'
      },
      image:{
        height: 80,
        resizeMode: "contain",
        alignSelf:'flex-start',
      },
      text_title:{
        fontSize:16,
        fontWeight: '500',
        color:'#6D6D6D',
        alignSelf:'center'
      },
      text:{
        fontSize:12,
        fontWeight: '500',
        color:'#6D6D6D',
        textAlign:'justify',
        top:5
      },
})