import React, {Component} from 'react';
 import{Text,TouchableOpacity,View,Image,StyleSheet} from 'react-native';

 const ERPSettingItem =(props)=> {

    return (
      <View style={{justifyContent:'center',padding:4}}> 
        <View style={{height:100,width:75,borderWidth:0.5,}}>
          <TouchableOpacity >
               <Text style={{alignSelf:'center'}}>{props.name}</Text>
               <View style={{justifyContent:'center'}}>
               <Image source={require('../../images/erp_date.png')} style={{height:65,width:55,marginLeft:10,resizeMode: 'contain'}}/>
               </View>  
          </TouchableOpacity>
        </View>
      </View>
    );
  };
export  {ERPSettingItem};