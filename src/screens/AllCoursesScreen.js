import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { getSpecificDoc_whit_All_Courses } from '../functions/firebase-firestore-functions'
import { GetSpecificValueFromAsyncStorage } from '../storage/storage-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { CheckConnectivity} from '../functions/general-functions'
import CourseInfo from '../components/CourseInfo'

 const AllCoursesScreen = ({navigation}) => {
  const [ internetConnection , setInternetConnection] = useState(true)
  const [ userCompleteName , setUserCompleteName] = useState()
  const [ superUpdate, setSuperUpdate] = useState(false)
  const [ isLoading , setIsLoading ] = useState(false)
  const [ animating, setAnimating ] = useState(true)
  const [ courses , setCourses] = useState(null)
  const [ userID , setUserID ] = useState()

  useEffect(()=>{ 
    if(CheckConnectivity()){
      GetCurrentSpecificInfo('id', setUserID)
      GetCurrentSpecificInfo("userCompleteName", setUserCompleteName)
    } else {
      GetSpecificValueFromAsyncStorage('id', setUserID)
      GetSpecificValueFromAsyncStorage('userCompleteName', setUserCompleteName)
      setInternetConnection(false)
      } 
  },[])  

  useEffect(()=>{ 
    if(userID) getSpecificDoc_whit_All_Courses(setCourses)
  },[userID, superUpdate]) 

  const render =(item)=>{
    return <CourseInfo screenToChange={'Mis Cursos'} userCompleteName={userCompleteName} navigation={navigation} classID = { item['item']} userID = {userID} />
  }

  const reloadCourses =()=>{
    setIsLoading(true)
    setSuperUpdate(!superUpdate)
    setIsLoading(false)
  }

  return (
    <>
        <SafeAreaView style={styles.container} >
          <View style={styles.box} >
            <View style={styles.SecondaryBox} >
            { internetConnection ?
            <>
             { courses ?
              <>
                <FlatList data={courses} 
                  renderItem={(item, index) => render(item)}  
                  keyExtractor={(item, index) => index} 
                  refreshControl={
                    <RefreshControl
                        enabled={true}
                        refreshing={isLoading}
                        onRefresh={() => reloadCourses()} 
                        tintColor='blue'
                    />
                }
                />
              </>
              :
              <>
                <View style={{marginTop:'70%'}} />
                <ActivityIndicator  animating={animating}  color="#6EA789"size="large" style={styles.activityIndicator}/>
              </>
              }
            </>
            :
            <>
                <View style={{flexDirection:'row', alignSelf:'center'}} >
                  <MaterialCommunityIcons style={{marginTop:12}}  name={'wifi-off'}  size={30} color={'gray'}/>   
                  <Text style={styles.text} >  No hay internet ... </Text>
              </View>
            </>
            }
            </View>
          </View>
        </SafeAreaView>
    </>
  )
}
export default AllCoursesScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#ffffff"
  },
  box:{
    marginTop:22,
    paddingVertical: 8,
    borderWidth: 0,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#BFE2D0",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    height:'90%',
    width:'90%',
    alignSelf:'center'
  },
  SecondaryBox:{
    marginTop: 10,
    paddingVertical: 8,
    borderWidth: 0,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    height:'95%',
    width:'90%',
    alignSelf:'center'
  },
  button: {
    width: 57,
    height: 57,
    borderRadius: 30,
    backgroundColor: '#0080ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    right: 5,
    elevation: 10,
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
  text:{
    fontSize:18,
    fontWeight: '400',
    color:'#6D6D6D',
    marginTop:15,
    alignSelf:'center'
  },
})