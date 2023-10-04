import { Alert } from 'react-native'
import NetInfo from "@react-native-community/netinfo"
import { SaveInStorage } from '../storage/storage-functions';

export const CheckConnectivity = () => {
  return NetInfo.fetch().then((response) => {
    if(response.isConnected === true){
    //  console.log("Hay intenet !!")
    //  console.log("Connection type", response.type)
    //  console.log("Is connected?", response.isConnected)
    //  Alert.alert("Hay Internet !!")
      return true

    } else {
    //  console.log("No hay intenet !!")
    //   Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
      return false
    }
  })
} 

export const lauchCameraOrLibrary = (isProfileImage="", setImages, update=null, setUpdate=null, userEmail)=>{
  Alert.alert( "Escoga una Opcion ", "¿Como quiere escoger la foto ?",[{text: "Cancelar", onPress: () => { return },
      },{text: "Seleccionar de la Bibloteca", onPress: () => { 
        ChooseProfilePick(isProfileImage, setImages, update, setUpdate, userEmail) },},
      { text: "Tomar Fotografia", onPress: () => {
        TakeProfilePick(isProfileImage, setImages, update, setUpdate, userEmail) },
      },],{ cancelable: true })}



export const get = (element, key, nullMessage=null) => {
  if (element) {
      if (element[key]) {
          return element[key]
      }
  }
  return nullMessage
}

export const getDateNewFormat =(date, whit_hour = false, extraMessage=false)=>{

  let day 
  let month
  let year

  if(date){
    day = date[8]+ date[9]
    month = date[4] + date[5]+ date[6]
    year =  date[11] + date[12]+ date[13] + date[14]
 
  switch(month){
    case "Jan":
    month = '01'
  break
    case "Feb":
    month = '02'
  break
    case "Mar":
    month = '03'
  break
    case "Apr":
    month = '04'
  break
    case "May":
    month = '05'
  break
    case "Jun":
    month = '06'
  break
    case "Jul":
    month = '07'
  break
    case "Aug":
    month = '08'
  break
    case "Sep":
    month = '09'
  break
    case "Oct":
    month = '10'
  break
      case "Nov":
    month = '11'
  break
      case "Dec":
    month = '12'  
  break
} 
  final_date = day + "/"+ month + '/' + year + "  "
  
  if(whit_hour){
    let hour_index = 16
    while(hour_index < 24){
      final_date = final_date + date[hour_index]
      hour_index = hour_index + 1
    }
  }
  return final_date
  
}
return "error during date trnasformation"

}


