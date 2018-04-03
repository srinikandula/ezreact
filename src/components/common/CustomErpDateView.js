import React, {Component} from 'react';
import{Text,TouchableOpacity,View,TabNavigator,Button,Image,StyleSheet} from 'react-native';

const CustomErpDateView =(props)=> {

   return (
     <View style={{flex:1,justifyContent:'center',padding:5,margin:5}}> 
        <Text style={{textAlign: 'center',alignSelf:'center',margin:5}}>{props.name}</Text>
       <View style={[{borderWidth:1,alignItems:'center', justifyContent:'center'}, props.setStyle]}>
        <Image style={{ width: 30, height: 30,margin:10, resizeMode: 'contain' }} 
          source={require('../../images/erp_date.png')} />
       </View>
     </View>
   );
 }
export {CustomErpDateView};