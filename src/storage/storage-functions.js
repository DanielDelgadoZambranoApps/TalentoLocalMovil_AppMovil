import AsyncStorage from '@react-native-async-storage/async-storage'
import { getMessageType, get } from '../functions/general-functions'

 export const SaveInStorage = async (key=null, value)=> {
        try{    
            if(key && value){
                await AsyncStorage.setItem(key, JSON.stringify(value))
                console.log(key + " saved sussesfully !")
            }   
        }catch(error){
            console.log(error)
        }
}

export const GetCollectionValuesFromAsyncStorage = async (key=null, setData=null, collectionValue) => {
  let genericArray = []
    genericArray.push(getMessageType(key))
    try {
      const value = await AsyncStorage.getItem(key)
      if (value) {
        for (const item of JSON.parse(value) ){
            genericArray.push(get(item, collectionValue))
        } 
        if(setData){
            setData(genericArray)
        }
        return genericArray
      }else{
        console.log("No existe contenido en el AsyncStorage para "+ key )
        return false
      }
    } catch (error) {
      console.log(key + " isn't save in AsyncStorage !")
    }
  }

  export const GetSpecificValueFromAsyncStorage = async (key=null, setData) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value) {
        console.log("El contenido en el AsyncStorage para "+ key + " es " +  JSON.parse( value) )
        if(setData){
          setData( JSON.parse( value) )
        }
        return  JSON.parse( value)
      }else{
        console.log("No existe contenido en el AsyncStorage para "+ key )
        return null
      }
    } catch (error) {
      console.log( " No se pudo realizar la buesqueda de "+ key + " en el AsyncStorage")
    }
  }

export const poto = async (key=null, setData=null, collectionValue) => {
  let genericArray = []
    genericArray.push(getMessageType(key))
    try {
      const value = await AsyncStorage.getItem(key)
      if (value) {
        for (const item of JSON.parse(value) ){
            genericArray.push(get(item, collectionValue))
        } 
        setData(genericArray)
        return genericArray
      }else{
        console.log("No existe contenido en el AsyncStorage para "+ key )
        return false
      }
    } catch (error) {
      console.log(key + " isn't save in AsyncStorage !")
    }
  }

  export const GetSpecificValueFromAsyncStorage2 = async (key=null, setData) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value) {
        // console.log("El contenido en el AsyncStorage para "+ key + " es " +  JSON.parse( value) )
        if(setData){
          setData( JSON.parse( value) )
        }
        return  JSON.parse( value)
      }else{
        console.log("No existe contenido en el AsyncStorage para "+ key )
        return null
      }
    } catch (error) {
      console.log( " No se pudo realizar la buesqueda de "+ key + " en el AsyncStorage")
    }
  }



