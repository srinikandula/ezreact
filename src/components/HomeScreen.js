//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React,{Component} from 'react';
import {View,Text} from 'react-native';
import CustomStyles from './common/CustomStyles';

export default class HomeScreen extends Component{
    render(){
        return(
            <View style={CustomStyles.ViewStyle}>
                <Text style={CustomStyles.textColor}>
                    Hello Sharath
                    </Text>
            </View>
        );
    }

    
}
 