import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import EvaluationPreviusScreen from '../screens/EvaluationPreviusScreen'
import DocumentNameScreen from '../screens/DocumentNameScreen'
import StudentsDataScreen from '../screens/StudentsDataScreen'
import AssistancesScreen from '../screens/AssistancesScreen'
import DrawerNavigator from '../navigators/DrawerNavigator'
import EvaluationScreen from '../screens/EvaluationScreen'
import NewStudentScreen from '../screens/NewStudentScreen'
import EvaluationSaves from '../screens/EvaluationSaves'
import StudentsScreens from '../screens/StudentsScreens'
import RegisterScreen from '../screens/RegisterScreen'
import StudentScreen from '../screens/StudentScreen'
import CourseScreen from '../screens/CourseScreen'
import SplashScreen from '../screens/SplashScreen'
import LoginScreen from '../screens/LoginScreen'
import NewCourse from '../screens/NewCourse'


const Stack = createStackNavigator();

const MainNavigator = () => {
  return(
    <>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={({route}) =>({
              headerTintColor:'black',
              activeTintColor: '#ffffff',
              headerTitleAlign:'center',
              headerStyle:{backgroundColor:'#6EA789'},
              drawerStyle:{width:220},
              headerTitleStyle:{fontSize:20},
              // headerTitleStyle:{fontSize:20, activeTintColor:'#fff' },
              // drawerLabel:route.name
              headerShown:false,
            })}>
          <Stack.Screen name='DrawerNavigator' component={DrawerNavigator}  options={{unmountOnBlur: true}}/> 
          <Stack.Screen name='RegisterScreen' component={RegisterScreen}  options={{unmountOnBlur: true}}/> 
          <Stack.Screen name='SplashScreen' component={SplashScreen}  options={{unmountOnBlur: true}} />  
          <Stack.Screen name='New Course'component={NewCourse} options={{ groupName: 'Class App', unmountOnBlur:true, headerShown:true, headerTintColor:'#ffffff', title:'Crear Curso'}} />
          <Stack.Screen name='LoginScreen' component={LoginScreen}  options={{unmountOnBlur: true}}/>  
          <Stack.Screen name='CourseScreen' component={CourseScreen}  options={{unmountOnBlur: true, headerShown:true, headerTintColor:'#ffffff', title:'Informacion del Curso'}}/> 
          <Stack.Screen name='AssistancesScreen' component={AssistancesScreen}  options={{unmountOnBlur: true, headerShown:true, headerTintColor:'#ffffff', title:'Asistencias Guardadas'}}/>
          <Stack.Screen name='StudentsScreens' component={StudentsScreens}  options={{unmountOnBlur: true, headerShown:true, headerTintColor:'#ffffff', title:'Estudiantes Presentes'}}/>
          <Stack.Screen name='StudentsDataScreen' component={StudentsDataScreen}  options={{unmountOnBlur: true, headerShown:true, headerTintColor:'#ffffff', title:'Estudiantes'}}   />
          <Stack.Screen name='StudentScreen' component={StudentScreen}  options={{ unmountOnBlur: true, headerShown:true, headerTintColor:'#ffffff', title:'Informacion Personal'}}/>
          <Stack.Screen name='NewStudentScreen' component={NewStudentScreen}  options={{ unmountOnBlur: true, headerShown:true, headerTintColor:'#ffffff', title:'Nuevo Alumno'}}/>
          <Stack.Screen name='DocumentNameScreen' component={DocumentNameScreen}  options={{ unmountOnBlur: true, headerShown:true, headerTintColor:'#ffffff', title:'Nombre del Documento'}}/>
          <Stack.Screen name='EvaluationScreen' component={EvaluationScreen}  options={{ unmountOnBlur: true, headerShown:true, headerTintColor:'#ffffff', title:'Agregar Evaluacion'}}/>
          <Stack.Screen name='EvaluationSaves' component={EvaluationSaves}  options={{ unmountOnBlur: true, headerShown:true, headerTintColor:'#ffffff', title:'Evaluaciones Anteriores'}}/>
          <Stack.Screen name='EvaluationPreviusScreen' component={EvaluationPreviusScreen}  options={{ unmountOnBlur: true, headerShown:true, headerTintColor:'#ffffff', title:'Editar Evaluacion'}}/>
          </Stack.Navigator>
      </NavigationContainer> 
    </>
  )}

export default MainNavigator;