import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { GetCollection, Add_special_permission } from '../functions/firebase-firestore-functions'
import { GetSpecificValueFromAsyncStorage } from '../storage/storage-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { CheckConnectivity} from '../functions/general-functions'
import WarningAlert from '../components/WarningAlert.js'

const UserScreen = ({navigation}) => {
    const [ internetConnection , setInternetConnection] = useState(true)
    const [ specialPermission, setSpecialPermission] = useState(false)
    const [ superUpdate, setSuperUpdate] = useState(false)
    const [ isLoading , setIsLoading ] = useState(false)
    const [ teachers , setTeachers ] = useState(null)
    const [animating, setAnimating] = useState(true)
    const [ userID , setUserID ] = useState(null)

    useEffect(()=>{ 
        if(CheckConnectivity()){
          GetCurrentSpecificInfo('id', setUserID)
        } else {
          GetSpecificValueFromAsyncStorage('id', setUserID)
          setInternetConnection(false)
          } 
      },[]) 

      useEffect(()=>{ 
        if(userID) GetCollection("Usuarios", setTeachers)
      },[userID, superUpdate]) 

      const reloadCourses =()=>{
        setIsLoading(true)
        setSuperUpdate(!superUpdate)
        setIsLoading(false)
      }

      const add_special_permission_to_teacher =(item)=>{
        Alert.alert( "Alerta", "¿ Esta seguro que desea dar permisos especiales a " + item['item']['userCompleteName'] + " ?",[
            { text: "Cancelar", onPress: () => {
                return },
            },
            {text: "Si, asignar permisos especiales.", onPress: () => { 
                Add_special_permission(item['item']['userID'], setSpecialPermission)},}
            ,],{ cancelable: true })
      }

      const render =(item)=>{
        return (
            <>
            <View style={{marginTop:20}} />
                <View style={{marginTop:0, marginBottom:0}} >
                    <TouchableOpacity onPress={()=>{} } >
                        <View style={{flexDirection:'row', left:10}} >  
                            <FontAwesome name={'user-circle-o'} size={40} color={'gray'}/>
                            <Text style={styles.text} > {item['item']['userCompleteName']} </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'column', bottom:20}} >
                    <TouchableOpacity onPress={()=>{ navigation.navigate('New Course',{item:item['item'], superIDD:item['item']['userID'] })} } >
                        <View style={{left:-8, bottom:30, alignSelf:'flex-end'}} > 
                            <Ionicons name={'add-circle'} size={25} color={'#6EA789'}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{ add_special_permission_to_teacher(item)} } >
                        <View style={{left:-8, bottom:20, alignSelf:'flex-end'}} > 
                            <EvilIcons name={'star'} size={25} color={'#D4AF37'}/>
                        </View>
                    </TouchableOpacity>
                </View>            
            </>
        )
      }

  return (
    <>
    <View style={styles.container}>
    <WarningAlert changeScreen={false} mainTitle={'Exito !'} special={false} status={specialPermission} setStatus={setSpecialPermission} description={"Permisos Asignados de manera exitosa."} />
        <View style={styles.box} >
            <View style={styles.SecondaryBox} >
            { internetConnection ?
            <>
             { teachers ?
                <>
                    <FlatList                   refreshControl={
                    <RefreshControl
                        enabled={true}
                        refreshing={isLoading}
                        onRefresh={() => reloadCourses()} 
                        tintColor='blue'
                    />
                } data={teachers} renderItem={(item, index) => render(item)}  keyExtractor={(item, index) => index} />
                </>
                :
                <>
                    <ActivityIndicator  animating={animating} color="#BFE2D0"size="large" style={styles.activityIndicator}/>
                </>    
                }
            </>
            :
            <>
               <View style={{flexDirection:'row', alignSelf:'center'}} >
                <MaterialCommunityIcons style={{marginTop:12}}  name={'wifi-off'}  size={30} color={'gray'}/>   
                <Text style={styles.text_secondary} >  No hay internet ... </Text>
              </View>
            </>
            }
            </View>
        </View>
    </View>
    </>

  )
}
export default UserScreen

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
        height:'90%',
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
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'center',
        fontWeight: 'bold',
        left:10 
    },
    text_secondary:{
        fontSize:18,
        fontWeight: '400',
        color:'#6D6D6D',
        marginTop:15,
        alignSelf:'center'
      },
})