import React from 'react'
import AwesomeAlert from 'react-native-awesome-alerts'

const WarningAlert = ({ status, setStatus, description, cancelButton=false, mainTitle="Cruso creado exitosamente !", navigation, changeScreen=true, special=false, course_info, userID, teacherName, coursename }) => {
  return (
    <>
        <AwesomeAlert
            show={status}
            showProgress={false}
            title={mainTitle}
            message={description}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={cancelButton}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Confirm"
            confirmButtonColor="#6EA789"
            onConfirmPressed={() => {
            console.log("confirm presed")
            setStatus(false)
            if(changeScreen) navigation.navigate('Mis Cursos')
            if(special){
              navigation.replace('CourseScreen',{         
                course_info:course_info,
                userID:userID,
                userCompleteName:teacherName,
                coursename:coursename
              }) 
            }
            }} 
        />
    </>
  )
}
export default WarningAlert
