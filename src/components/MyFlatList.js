import React from 'react';
import { Text, StyleSheet, FlatList, View} from 'react-native';

const MyFlatList = ({data}) => {
    
    return (
        <FlatList
            data={data}
          //  ItemSeparatorComponent={ItemSeparatorView}
            renderItem={(item)=>ItemView(item)}
            keyExtractor={(item, index) => index.toString()} />
        )}

    const ItemView = (item) => {
        return (
          <View style={styles.view2}>
            <Text style={styles.item}> {item['item'].itemName} </Text>
          </View>
        )}
    
      const ItemSeparatorView = () => {
        return <View style={styles.view}/>
    }
     
 
const styles = StyleSheet.create({
    view:{
        height: 0.5,
        width: "100%",
        backgroundColor: "#C8C8C8",
      },
    view2:{ 
        padding: 10 ,
        width:'80%',
        height:'80%',
        backgroundColor:'red',
        alignSelf:'center'
    },
    text:{ 
        color: "#1894F8"
    }
})

export default MyFlatList;