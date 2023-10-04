import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import { windowHeight, windowWidth } from '../utils/Dimentions';

import Foundation from 'react-native-vector-icons/Foundation';

const FormInputAlternative = ({labelValue, placeholderText, iconType, hasIcon=true, ...rest}) => {
  return (
    <View style={styles.inputContainer}>
      { hasIcon ?
        <View style={styles.iconStyle}>
          <Foundation name={iconType} size={25} color="#666" />
        </View>
      : <></>
      }
      <TextInput
        value={labelValue}
        style={styles.input}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor="#666" 
        {...rest}
      />
    </View>
  );
};

export default FormInputAlternative;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width:"95%",
    alignSelf:'center',
    borderRadius: 10,
   borderColor: "#6EA789",
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});
