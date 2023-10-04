import React, { useState, useEffect } from "react";
import { SafeAreaView, ActivityIndicator, View, StyleSheet, Image} from "react-native";
import { GetSpecificValueFromAsyncStorage2 } from "../storage/storage-functions"

const SplashScreen = ({ navigation }) => {
  const [animating, setAnimating] = useState(true)
  const [user, setUser] = useState(null)
  const [ userMail, setUserMail ] = useState(null)
  
  useEffect(()=>{
    GetSpecificValueFromAsyncStorage2('email', setUserMail)
  },[])

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false)
      console.log("mail ------------------> " + userMail)
      if(userMail != "none" && userMail!=null ){
        navigation.replace("DrawerNavigator") 
      }else{
        navigation.replace("LoginScreen")
      }
    }, 3000);
  }, [userMail])  

  return (
    <SafeAreaView style={styles.stylesheet}>
      <View style={styles.container}>
        <Image source={require("../../assets/calendar_no_background.png")} style={styles.image} />
        <ActivityIndicator animating={animating} color="#6EA789"size="large" style={styles.activityIndicator}/>
      </View>
    </SafeAreaView>
  )}

export default SplashScreen;

const styles = StyleSheet.create({
  stylesheet:{
    flex:1,
    backgroundColor:'#BFE2D0'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
    bottom:40
  },
  image:{
    width: "90%",
    resizeMode: "contain",
    margin: 30,
  }
})