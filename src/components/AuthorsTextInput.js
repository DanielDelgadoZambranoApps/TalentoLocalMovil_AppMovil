import React, {useState} from 'react'
import { TextInput, View, TouchableOpacity, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const AuthorsTextInput = ({ holder="", setAuthors, setWarningEmptyAuthors, setTotalAuthors, authors }) => {
    const [ localName, setLocalName ] = useState(null)

    const addAuthor =()=>{ 
        let subLocalArray =  authors

        if(localName){ 
            subLocalArray.push(localName)
            setTotalAuthors(subLocalArray.length)
            setAuthors(subLocalArray)
            setLocalName('')
        } else {
            setWarningEmptyAuthors(true) 
        }
    }

  return (
    <>  
        <View style={{flexDirection:'row'}} >
            <TextInput
                style={styles.textInputStyle}
                onChangeText={(text) => {setLocalName(text)} }
                value={localName}
            // editable={!loading}
                underlineColorAndroid="transparent"
                placeholder={holder}
            />

            <View style={{marginLeft:20, top:10}} >  
                <TouchableOpacity onPress={()=>{addAuthor()}} >
                    <FontAwesome name={'user-plus'} size={30} color={'#5B8871'} />
                </TouchableOpacity>
            </View>
        </View>
    </>
  )
}

export default AuthorsTextInput

const styles = StyleSheet.create({
    textInputStyle: {
      width:'66%',
      height: 40,
      borderWidth: 1,
      paddingLeft: 20,
      margin: 5,
      borderColor: '#6EA789',   
      backgroundColor: '#ffffff',
      alignSelf:'center',
      borderRadius:5,
      left:10
    }
  })
  
  