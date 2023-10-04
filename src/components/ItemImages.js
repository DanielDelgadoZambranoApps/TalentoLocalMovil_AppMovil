import React, { useState, useEffect } from 'react'
import { StyleSheet, Modal, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

import { getFullStorageItemPath, listFilesAndDirectoriesGeneric } from '../functions/firebase-storage-functions'

const ItemImages = ({collection, itemId, hasImage}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [visible, setVisible] = useState(false)
    const [listData, setListData] = useState(null)
    let [imagesArray, setImagesArray] = useState(null)

    useEffect(()=>{
        listFilesAndDirectoriesGeneric("", collection, itemId, setListData)
    },[]) 
 
    useEffect(()=>{
      let imagesUrlsArray = []
      if(listData){
        let filename 
        for (const subitem of listData){
          filename = subitem.path.substring(subitem.path.lastIndexOf('/') ) // + 1 ????
           getFullStorageItemPath(collection, itemId, filename, imagesUrlsArray, setIsLoading )
        }
      } 
      setImagesArray(imagesUrlsArray)
      },[listData])

  return (
    <>
      { hasImage ?
        <>
                { isLoading || !imagesArray || !imagesArray['0'] || !imagesArray['0'].url ?
                <>
                  <ActivityIndicator style={styles.activityStyle} />
                </>
                  
                  :
                <>
                  <TouchableOpacity onPress={()=>{setVisible(!visible)}} >  
                    <Image source={{uri:imagesArray['0'].url}} style={styles.image} />
                  </TouchableOpacity>
                    <Modal visible={visible} transparent={true}>
                      <ImageViewer enableSwipeDown onSwipeDown={()=>setVisible(!visible)} imageUrls={imagesArray}/>
                    </Modal> 
                </>    
              }
      </>
      :
      <>
        <TouchableOpacity >
          <Image source={require('../../assets/no-photo.png')} style={styles.noImage} />
        </TouchableOpacity>  
      </>
      }     
    </>
  )
}

export default ItemImages;

const styles = StyleSheet.create({
  noImage:{
      width: 80,
      height:80,
      resizeMode: "contain",
      marginLeft:0,
      alignItems: "center",
      marginRight:10,
      marginTop:30,
      left:-10
  },
  activityStyle:{
    size:"large",
    color:"#0000ff"
  },
  hasImage:{
    marginLeft:300,
    marginTop:10,
    color:'#1894F8',
    marginBottom:10,    
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0080ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    right: 15,
    elevation: 5
  },
  image:{
    width: 80,
    height:100,
    resizeMode: "contain",
    right:5,
    alignItems: "center",
    borderRadius:5,
    marginTop:20
  },
  activityStyle:{
    size:"large",
    color:"#0000ff"
  }
})