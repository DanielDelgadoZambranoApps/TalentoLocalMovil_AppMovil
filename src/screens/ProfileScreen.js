import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { CheckConnectivity, lauchCameraOrLibrary} from '../functions/general-functions'
import { GetSpecificValueFromAsyncStorage } from '../storage/storage-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { GetAllUserData } from '../functions/firebase-firestore-functions'

import ProfileButton from '../components/ProfileButton'

const ProfileScreen = ({ navigation }) => {
    const [userCompleteName, setUserCompleteName] = useState('Cargando Nombre ...')
    const [userEmail, setUserEmail] = useState('Cargando Mail')
    const [userInfo, setUserInfo] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [credits, setCredits] =useState('Cargando...')
    const [update, setUpdate] = useState(false)

    let [userID, setUserID] = useState(null)
    let collection = 'Usuarios'

    useEffect(()=>{
        GetSpecificValueFromAsyncStorage('ProfilePicturePath'+ userEmail, setImageUrl)
        if(CheckConnectivity()){
            GetCurrentSpecificInfo("userCompleteName", setUserCompleteName)
            GetCurrentSpecificInfo("email", setUserEmail)
            GetCurrentSpecificInfo('id', setUserID)
        } else {
            GetSpecificValueFromAsyncStorage('userCompleteName', setUserCompleteName)
            GetSpecificValueFromAsyncStorage('email', setUserEmail)
            GetSpecificValueFromAsyncStorage('id', setUserID)
        }
    },[update]) 

    useEffect(()=>{
        GetSpecificValueFromAsyncStorage('ProfilePicturePath'+ userEmail, setImageUrl)
    },[userEmail]) 

    useEffect(()=>{
       if(userID) GetAllUserData(collection, userID, setUserInfo)
    },[userID])

    return( 
        <SafeAreaView style={styles.container} >
            <View style={styles.box} > 
            { !imageUrl ?
            <>
                <Image style={styles.userImg} source={require('../../assets/ProfilePic.png')} /> 
                    <TouchableOpacity
                    style={styles.plusButton}
                    onPress={()=>lauchCameraOrLibrary("Profile", null, update, setUpdate, userEmail) }>
                        <FontAwesome5
                            name={'plus'}
                            size={20}
                            color={'#ffffff'}/>
                    </TouchableOpacity>
            </>
                :
                <Image style={styles.userImg} source={{uri: imageUrl}} /> 
            }
            <Text style={styles.text}> {userCompleteName} </Text>
            <Text style={styles.credits}> Correo : {userEmail} </Text>
                <View style={{marginTop:'20%'}} />
                <ProfileButton mail={userEmail} title='Cerrar Sesion' navigation={navigation} nextScreen='Cerrar Sesion' />
            </View>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ffffff"
    },
    text:{
        fontSize:20,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'center',
        marginTop:90,
        marginBottom:20
    },
    credits:{
        fontSize:15,
        justifyContent:'center',
        alignItems:'flex-start',
        alignContent:'flex-start',
        alignSelf:'center',
        marginTop:10,
       
    },
    email:{
        fontSize:14,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'center',
        marginTop:20
    },
    userImg: {
        height: 180,
        width: 180,
        borderRadius: 75,
        alignSelf:'center',
        marginTop:30,
        resizeMode: "contain",
    },
    box:{
        marginTop: 30,
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
      plusButton: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: '#6EA789',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: '65%',
        right: 110,
        elevation: 5,
    }
})
