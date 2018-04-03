import React, {Component} from 'react';
import{Text,Dimensions,Alert,Show,TextInput,Modal,TouchableOpacity,View,TabNavigator,Button,Image,StyleSheet} from 'react-native';
import CustomStyles from './CustomStyles';
import {CustomText} from './index';
 const ExpiryDateItems=(props)=>{
    return (
      <View style={CustomStyles.expiryMainContainer} >
            <View style={[CustomStyles.expirySubContainer]}>
                <CustomText customTextStyle={CustomStyles.expiryCount}>{props.count}</CustomText>
                <CustomText customTextStyle={CustomStyles.expiryLabel}>{props.label}</CustomText>
                
            </View>  
      </View>
    );
  }

export  {ExpiryDateItems};