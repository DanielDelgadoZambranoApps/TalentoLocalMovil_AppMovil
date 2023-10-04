import { Alert } from 'react-native'  
import firestore from '@react-native-firebase/firestore'
import { CheckConnectivity } from './general-functions'
import storage from '@react-native-firebase/storage'

export function getPlatformPath ({ path, uri }) {
    return Platform.select({
        android: { "value": path },
        ios: { "value": uri }
    })}

export function getFileName (name, path) {
    if (name != null) { return name; }
        if (Platform.OS === "ios") {
            path = "~" + path.substring(path.indexOf("/Documents"));
        }
    return path.split("/").pop()
}

export const UploadItem = (itemName, itemDescription, images=null, credits, amount, userName, userMail, userID) => {
  let hasImage = false
  let filnename
  if(CheckConnectivity()) {
    if(images)  hasImage=true
    firestore().collection('Items').add({
      itemName: itemName.replace(/['"]+/g, ''),
      itemDescription:itemDescription.replace(/['"]+/g, ''),
      credits:Number(credits),
      userName:userName,
      userMail:userMail,
      userID:userID,
      hasImage:hasImage,
      cantidad:amount
    }).then((value) => {
      firestore().collection('Items').doc(value.id).update({
        itemID:value.id
      }).then((value) => {})

      if(images){
        for(const item of images){
          filnename = item.path.substring(item.path.lastIndexOf('/') + 1)
          uploadImageToStorage(item.path, value.id, 'Items', filnename) 
        } 
      } Alert.alert("Exito", "Se agrego el articulo en el inventario",
      [{ text: "Continuar", onPress: () => { return null}},],
      { cancelable: false })
    })} else {
      Alert.alert("No hay Conexion ...", "",
      [{ text: "Continuar", onPress: () => { return null}},],
      { cancelable: false })
    }
  }

  export function uploadImageToStorage  ( pathMain, id, collectionName="", imageName ) {
    let reference
    reference = storage().ref(collectionName + "/" + id + "/" + imageName); // linea de los dioses
    let task =  reference.putFile( pathMain );
     task.then(() => {
        console.log('Image uploaded to the bucket!');
    }).catch((e) => {
        console.log('uploading image error => ', e)
    })
  }

export const listFilesAndDirectories = (pageToken, setData , storageCollection ) => {
      let reference = storage().ref(storageCollection +'/')
      reference.list({ pageToken }).then((result) => {
      if (result.nextPageToken) {
        return  (
          reference,
          result.nextPageToken
        );
      }
      setData(result.items);
  })}

  export const getFullStorageItemPath = async (collection='', itemID, fileName, imagesUrlsArray, setIsLoading) => {
    const url = await storage().ref(collection + '/' + itemID + "/" + fileName).getDownloadURL().catch((e) => {
        console.error(e);
      })
      imagesUrlsArray.push({url:url})
      if(setIsLoading){
        setIsLoading(false)
      } 
  }

  export const listFilesAndDirectoriesGeneric = async (pageToken, collection="", id="", setListData) => {
    if(CheckConnectivity()){
      const reference = storage().ref(collection + '/' + id );
      await reference.list({ pageToken }).then((result) => {
        result.items.forEach((ref) => {
        })
        if (result.nextPageToken) {
          return listFilesAndDirectories(
            reference,
            result.nextPageToken
          );
        }
        setListData(result.items)
      });
    } else {
      Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
    }
  }

export const DeleteEventPictures  =async (pageToken="", id)=>{
  const reference = storage().ref('Items' + '/' + id )
    await reference.list({ pageToken }).then((result) => {
      result.items.forEach((ref) => {
      ref.delete()
        console.log('Eliminado de Firebase Storage exitosamente ') 
      })    
    }
  )
}
