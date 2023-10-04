
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, Image, LogBox } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import { GetSpecificValueFromAsyncStorage } from './src/storage/storage-functions'
import { GetCurrentSpecificInfo } from './src/functions/firebase-auth-functions'
import { CheckConnectivity} from './src/functions/general-functions'

LogBox.ignoreAllLogs();

const CustomSidebarMenu = (props) => {
  const {state, descriptors, navigation} = props;
  const [internetConnection , setInternetConnection] = useState(true)
  const [photoLink , setPhotoLink] = useState(null)
  const [userID, setUserID] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState(null)
  const [userEmail, setUserEmail] = useState(null)

  let lastGroupName = '';
  let newGroup = true;

  useEffect(()=>{
    GetSpecificValueFromAsyncStorage('ProfilePicturePath', setImageUrl)
    if(CheckConnectivity){
      GetCurrentSpecificInfo('id', setUserID)
      GetCurrentSpecificInfo("email", setUserEmail)
    } else {
      GetSpecificValueFromAsyncStorage('id', setUserID)
      GetSpecificValueFromAsyncStorage('email', setUserEmail)
      setInternetConnection(false)
    }
  },[])
  useEffect(()=>{
    if(userEmail)  GetSpecificValueFromAsyncStorage('ProfilePicturePath'+ userEmail, setImageUrl)
},[userEmail]) 

  return (
       <SafeAreaView style={{flex: 1}}>
          <DrawerContentScrollView {...props}>
            {state.routes.map((route, _index) => {
              const {
                drawerLabel,
                activeTintColor,
                groupName } = descriptors[route.key].options;
                  if (lastGroupName !== groupName) {
                    newGroup = true;
                    lastGroupName = groupName;
                  } else newGroup = false;
                    return (
                      <>
                      <React.Fragment key={route.key} >
                        {newGroup ? (
                          <View style={styles.sectionContainer}>
                            <Text key={groupName}> {groupName} </Text>
                          <View style={styles.sectionLine} />
                          <>
                          { imageUrl ?
                          <>
                            <Image style={styles.userImg} source={{uri: imageUrl}} /> 
                          </>
                          :
                          <>
                           <Image source={require("./assets/ProfilePic.png")} style={{ height: 150, width: 150, borderRadius: 0, marginTop:30, marginBottom:30  }} />
                          </>
                          } 
                            <View style={{marginTop:10}} />
                          </>
                        </View> ) : null}
  
                        <DrawerItem
                          key={route.key}
                          label={({color}) =>
                            <Text style={{color}}> {drawerLabel} </Text>}
                          focused={state.routes.findIndex(
                          (e) => e.name === route.name) === state.index}
                          activeTintColor={activeTintColor}
                          onPress={() => navigation.navigate(route.name)}/>
                      </React.Fragment > 
                    </>
              )})}
      </DrawerContentScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexDirection:'column'
  },
  sectionLine: {
    backgroundColor: 'gray',
    flex: 1,
    height: 1,
  },
  userImg:{
    height: 180,
    width: 180,
    borderRadius: 75,
    alignSelf:'center',
    marginTop:30,
    resizeMode: "contain",
  }
});

export default CustomSidebarMenu;


