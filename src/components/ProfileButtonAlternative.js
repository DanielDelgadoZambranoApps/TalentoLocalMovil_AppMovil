import React, {allteacherss, useState} from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
 
const ProfileButtonAlternative = ({specialPermission, pantera, coursename, course_info, courseid, title, navigation, asisstencia=false, userID}) => {
  const checkNextScreen =async()=>{
    if(asisstencia){
      navigation.navigate('AssistancesScreen', { userID:userID, courseid:courseid, course_info:course_info, coursename:coursename, pantera:pantera, specialPermission:specialPermission})
    }
  }

  return (
    <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={()=>checkNextScreen()}>
              <Text style={styles.textStyle}> {title} </Text>
            </TouchableOpacity>
  );
};

export default ProfileButtonAlternative;

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "#6EA789",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
    marginBottom: 10,
    elevation:10
  },
  textStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
    padding: 10
  },
});
