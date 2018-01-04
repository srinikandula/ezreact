import React, {Component} from 'react';
import{Text,TouchableOpacity,View,TabNavigator,Button,Image,StyleSheet} from 'react-native';

const CustomErpDateView =(props)=> {

   return (
     <View style={{flex:1,justifyContent:'center',padding:4}}> 
        <Text style={{width:60,textAlign: 'center',alignSelf:'center',margin:6}}>{props.name}</Text>
       <View style={[{flex:1,borderWidth:0.5,alignItems:'center'}, props.setStyle]}>
         <TouchableOpacity >              
              <View style={{justifyContent:'center'}}>
              <Image style={{ width: 30, height: 30,margin:5, resizeMode: 'contain' }} source={require('../../images/calanderLogo.png')} />
              </View>  
         </TouchableOpacity>
       </View>
     </View>
   );
 }
export {CustomErpDateView};