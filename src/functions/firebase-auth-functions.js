import { Alert } from "react-native"
import auth from "@react-native-firebase/auth"

import { GetSpecificValueFromAsyncStorage, SaveInStorage } from "../storage/storage-functions"
import { createUserIniatialDataInFirebase } from "./firebase-firestore-functions"
import { GetAllPermissions, GetCameraPermisssion } from "./permission-functions"
import { CheckConnectivity } from "./general-functions"

export const Close =  (setUser) =>{
  const subscriber = auth().onAuthStateChanged((user) => {
      console.log("user", JSON.stringify(user));
      setUser(user);
  })
    return subscriber;
}

export const GetCurrentSpecificInfo = (userValue, setFunction) =>{
  auth().onAuthStateChanged((user) => {
    if(user){
      switch(userValue){
        case 'id':
          setFunction(user.uid)
        break
        case 'userCompleteName':
          setFunction(user.displayName)
        break
        case 'email':
          setFunction(user.email)
        break
      }
    }
  })
}

export const LoginAuthentification = (email, password, navigation, setErrortext, dispatch=null) => {
  if (CheckConnectivity()){
    setErrortext("")
      if (!email) {
        alert("Rellene su correo electronico !");
        return
      }
      if (!password) {
        alert("Please fill Password");
        return
      }
       auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          console.log(user)
          //GetAllPermissions()
          //GetCameraPermisssion()
          SetCurrentUserSpecificInfo()
        if(CheckConnectivity()){
          console.log("Hay conexion, se pudo realizar el Inicio de Sesion !!")
        }
          if (user){
            navigation.navigate("DrawerNavigator")
            if(GetSpecificValueFromAsyncStorage("alredayLauched")){
              console.log("Es la primera vez que se inicia la App")
              SaveInStorage("alredayLauched", true)
            }else{
              console.log("No la primera vez que se inicia la App")
            }
            SaveInStorage("isLogin", true)
          } 
        })
        .catch((error) => {
          console.log(error);
          if (error.code === "auth/invalid-email")
            setErrortext(error.message);
          else if (error.code === "auth/user-not-found")
            setErrortext("El usuario no existe ...");
          else {
            setErrortext("Por favor comprueba su email/password")}
    })
   } else {
    Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
  }
}

export const RegisterInFirebase = (userName, email, password, setErrortext, navigation) => {
  if(CheckConnectivity()){
    setErrortext("");
    if (!userName || !email || !password){
      Alert.alert("Error", "Complete todos los campos",
                [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
    } else {
      auth().createUserWithEmailAndPassword( email, password).then((user) => {
        console.log("Registration Successful. Please Login to proceed")
        if (user) {
          auth().currentUser.updateProfile({ displayName: userName, photoURL:"https://aboutreact.com/profile.png"})
          SetCurrentUserSpecificInfo()
          navigation.navigate("DrawerNavigator")
          Alert.alert("Bienvenido", "Registro realizado con exito !",
            [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
            createUserIniatialDataInFirebase(user, userName)

          }
        })
        .catch((error) => {
        console.log(error);
        if (error.code === "auth/email-already-in-use") {
          setErrortext("Existe una cuenta asosiada a este correo !")
          Alert.alert("Correo en uso !")
        } else {
          setErrortext(error.message);
  }})}} else {
    Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
  }
}

export const Logout = (navigation) => {
  Alert.alert("Alerta ", "¿Esta seguro que desea cerrar sesion ?",[{text: "Cancelar", onPress: () => {return null;},}
      ,{ text: "Confirmar", onPress: () => { auth().signOut().then(() =>
         navigation.navigate("LoginScreen"))
         SaveInStorage("isLogin", false)
         SaveInStorage('email', false)
         SaveInStorage('id', "none")
         SaveInStorage('userCompleteName', "none")
            .catch((error) => {console.log(error);
              if (error.code === "auth/no-current-user"){
                navigation.replace("LoginScreen");
              }
              else alert(error);
            });
        },
      },
    ],
    { cancelable: false }
  )
}

export const SetCurrentUserSpecificInfo = () =>{
  if(CheckConnectivity()){
    auth().onAuthStateChanged((user) => {
      if(user){
        SaveInStorage('id', user.uid)
        SaveInStorage('userCompleteName', user.displayName)
        SaveInStorage('email', user.email)
        
        // SaveInRedux('id', user.uid)
       // SaveInRedux('userCompleteName', user.displayName)
      //  SaveInRedux('email', user.email) 
    }})
  }
}