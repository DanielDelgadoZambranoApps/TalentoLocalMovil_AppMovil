import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, SafeAreaView } from 'react-native'

import { RegisterInFirebase } from '../functions/firebase-auth-functions'
import WarningAlert from '../components/WarningAlert.js'
import FormInput from '../components/FormInput'

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [userName, setUserName] = useState("")
    const [confirmPassword, setConfirmPassword] = useState()
    const [errortext, setErrortext] = useState("")

    const [ invalidMail, setInvalidMail] = useState(false)

    const checkMailFormat =()=> {
      var value = email.includes("@")
      if(value){
        checkPassword()
      } else {
        setInvalidMail(true)
      }
    }

    const checkPassword =()=>{
      if(password === confirmPassword ){
        if(password.length > 5){
          RegisterInFirebase(userName, email, password, setErrortext, navigation)
        }else{
          Alert.alert("La contraseña es muy corta ...", "" , [{ text: "Continuar", onPress: () => {return null}}])
        }
      } else {
        Alert.alert("Error", "Las contraseñas no coinciden" , [{ text: "Continuar", onPress: () => {return null}}])
      }
    }

    return(
        <SafeAreaView style={styles.container} >  
          <WarningAlert changeScreen={false}  mainTitle="Error ..." status={invalidMail} setStatus={setInvalidMail} description={"Ingrese un correo valido."} navigation={navigation} />
            <Image source={require("../../assets/calendar_no_background.png")} style={styles.image}/>
            <FormInput
              labelValue={userName}
              onChangeText={(value) => setUserName(value)}
              placeholderText="Nombre Completo"
              iconType="idcard"
              autoCapitalize="none"
              autoCorrect={false}
          />
           <View style={{marginBottom:15}}/>
            <FormInput
              labelValue={email}
              onChangeText={(userEmail) => setEmail(userEmail)}
              placeholderText="Email"
              iconType="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
          />
            <FormInput
              labelValue={password}
              onChangeText={(userPassword) => setPassword(userPassword)}
              placeholderText="Contraseña"
              iconType="lock"
              secureTextEntry={true}
            />
            <FormInput
              labelValue={confirmPassword}
              onChangeText={(userPassword) => setConfirmPassword(userPassword)}
              placeholderText="Repita la Contraseña"
              iconType="lock"
              secureTextEntry={true}
            />
             <View style={{marginBottom:12}}/>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={()=>checkMailFormat() }>
              <Text style={styles.buttonTextStyle}> Registrarme !</Text>
            </TouchableOpacity>
            <Text style={styles.registerTextStyle} onPress={() => navigation.navigate("LoginScreen")}>
                Ya posees una cuenta ?  Inicia Sesion ! 
              </Text>
          </SafeAreaView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container:{
      flex:1,
      backgroundColor:"#BFE2D0"
  },
  image:{
      width: "70%",
      height: 160,
      resizeMode: "contain",
      margin: 30,
      alignItems: "center",
      marginTop:40,
      alignSelf:'center',
      marginBottom:50
  },
  buttonStyle: {
    backgroundColor: "#6EA789",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "# ",
    height: 42,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 50,
    marginBottom: 25,
    elevation:10
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 17,
  },
  registerTextStyle: {
    color: "#5B8871",
    textAlign:'center',
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
    marginLeft:120,
    marginTop:0
  }
})