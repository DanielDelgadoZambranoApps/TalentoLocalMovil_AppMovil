import React, { useEffect, useState} from 'react'
import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

 const StudentsDataScreen = ({ navigation, route}) => {
    const { course_info, screenToChange } = route.params

    const render =(item)=>{
        return(
            <>
            <View style={{left:20, marginTop:20}} >
                <View style={{flexDirection:'row'}} >
                    <TouchableOpacity >
                        <FontAwesome name={'user'} size={50} color="#A5E2C3" />
                    </TouchableOpacity>
                    <View style={{flexDirection:'column', width:'60%'}} >
                        <Text style={styles.text}  >
                                {item['item']['nombre_estudiante']}
                        </Text>
                        <Text style={styles.subtext}  >
                                {item['item']['rut']}
                        </Text>
                        <Text style={styles.subtext}  >
                                {item['item']['Correo']}
                        </Text>
                        <Text style={styles.subtext}  >
                               Estado : {item['item']['EstadoCivil']}
                        </Text>
                        <Text style={styles.subtext}  >
                                {item['item']['Genero']}
                        </Text>
                        <Text style={styles.subtext}  >
                                {item['item']['Movil']}
                        </Text>
                        <Text style={styles.subtext}  >
                                {item['item']['Nacimiento']}
                        </Text>
                        <Text style={styles.subtext}  >
                              Nivel Educacion:  {item['item']['NivelEducacional']}
                        </Text>
                        <Text style={styles.subtext}  >
                        {item['item']['Comuna']}, {item['item']['Direccion']}
                        </Text>
                    </View>
                    <View style={{flexDirection:'column'}} > 
                        <TouchableOpacity onPress={()=>{navigation.navigate('StudentScreen', {item:item, course_info:course_info, screenToChange:screenToChange})}} >
                            <FontAwesome5 name={'user-edit'} size={23} color="#A5E2C3" />
                        </TouchableOpacity>
                        <View style={{marginTop:10}}  />
                        <TouchableOpacity onPress={()=>console.log("crear funcion para eliminar")} >
                            <FontAwesome5 name={'user-times'} size={23} color="#F2A2A2" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </>
        )
    }
  return (
    <>
        <SafeAreaView style={styles.container} >
            <View style={styles.box} >
                <View style={styles.SecondaryBox} >
                  <FlatList data={course_info['students']} 
                    renderItem={(item, index) => render(item)}  
                    keyExtractor={(item, index) => index} 
                  />
                </View>
            </View>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={()=>navigation.navigate('EvaluationScreen',{course_info:course_info})}>
              <Text style={styles.textStyle}>Evaluacion Nueva</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={()=>navigation.navigate('EvaluationSaves', {course_info:course_info})}>
              <Text style={styles.textStyle}>    Evaluaciones Guardadas</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={()=>navigation.navigate('NewStudentScreen', {course_info:course_info} ) }>
                    <FontAwesome5
                        name={'plus'}
                        size={20}
                        color={'#ffffff'}/>
                </TouchableOpacity>


        </SafeAreaView>
    </>
  )
}

export default StudentsDataScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ffffff"
      },
      box:{
        marginTop:22,
        paddingVertical: 8,
        borderWidth: 0,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#BFE2D0",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        height:'80%',
        width:'90%',
        alignSelf:'center'
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
      text:{
        fontSize:16,
        fontWeight: '500',
        color:'#6D6D6D',
        left:15,
        marginTop:-5
      },
      subtext:{
        fontSize:12,
        fontWeight: '500',
        color:'#A1A1A1',
        left:15,
        marginTop:0
      },
      button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6EA789',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 160,
        right: 20,
        elevation: 5,
        right:10
    },
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
      marginTop: 10,
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
})