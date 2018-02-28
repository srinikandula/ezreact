import React, {Component} from 'react';
import{Text,TouchableOpacity,View,TabNavigator,Button,Image,StyleSheet} from 'react-native';

const CustomErpDateView =(props)=> {

   return (
     <View style={{flex:1,justifyContent:'center',padding:4}}> 
        <Text style={{width:70,textAlign: 'center',alignSelf:'center',margin:6}}>{props.name}</Text>
       <View style={[{borderWidth:0.5,alignItems:'center', justifyContent:'center'}, props.setStyle]}>
        <Image style={{ width: 30, height: 30,margin:5, resizeMode: 'contain' }} 
          source={require('../../images/erp_date.png')} />
       </View>
     </View>
   );
 }
export {CustomErpDateView};