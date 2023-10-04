import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AllCoursesScreen from '../screens/AllCoursesScreen'
import CustomSidebarMenu from '../../CustomSidebarMenu'
import ProfileScreen from '../screens/ProfileScreen'
import JSON_Screen from '../screens/JSON_Screen'
import MainScreen from '../screens/MainScreen'
import UserScreen from '../screens/UserScreen'

import { hasSpecialPermission } from '../functions/firebase-firestore-functions'
import { GetSpecificValueFromAsyncStorage } from '../storage/storage-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { CheckConnectivity} from '../functions/general-functions'

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [ specialPermission, setSpecialPermission] = useState(false)
  const [ userID , setUserID ] = useState(null)

  useEffect(()=>{
    if(CheckConnectivity()){
      GetCurrentSpecificInfo('id', setUserID)
    } else {
      GetSpecificValueFromAsyncStorage('id', setUserID)
    }
  },[])

  useEffect(()=>{
    if(userID){
      hasSpecialPermission(userID, setSpecialPermission)
    }
  },[userID]) 

  return(
      <Drawer.Navigator
        initialRouteName="Mis Cursos"
        drawerContent={(props) => <CustomSidebarMenu {...props} />}
          screenOptions={({route}) =>({
            headerTintColor:'white',
            activeTintColor: '#6EA789',
            headerTitleAlign:'center',
            headerStyle:{backgroundColor:'#6EA789'},
            drawerStyle:{width:220},
            headerTitleStyle:{fontSize:20}, 
            drawerLabel:route.name 
          })}>
          <Drawer.Screen name='Mis Cursos'component={MainScreen} options={{ groupName: 'Class App', unmountOnBlur:true}} />
          { true &&
            <>
            <Drawer.Screen name='Todos los Cursos'component={AllCoursesScreen} options={{ groupName: 'Class App', unmountOnBlur:true}} />
            <Drawer.Screen name='Profesores 'component={UserScreen} options={{ groupName: 'Class App', unmountOnBlur:true}} />
            { false &&
              <Drawer.Screen name='JSON 'component={JSON_Screen} options={{ groupName: 'Class App', unmountOnBlur:true}} />
            }
            </>
          }
            <Drawer.Screen name='Tu Cuenta' component={ProfileScreen} options={{ groupName: 'Class App', unmountOnBlur:true}} />
      </Drawer.Navigator> 
  )}

export default DrawerNavigator;
