import React, {Component} from 'react';
import{Text,Dimensions,Alert,Show,TextInput,Modal,TouchableOpacity,View,TabNavigator,Button,Image,StyleSheet} from 'react-native';
import CustomStyles from './CustomStyles';
 const ExpiryDateItems=(props)=>{
    return (
      <View style={CustomStyles.expiryMainContainer} >
            <View style={[CustomStyles.expirySubContainer,{ backgroundColor: !props.selectedItem ? '#ff0000' : '#f6f6f6' }]}>
                <Text style={CustomStyles.expiryCount}>{props.count}</Text>
                <Text style={CustomStyles.expiryLabel}>{props.label}</Text>
            </View>  
      </View>
    );
  }

export  {ExpiryDateItems};