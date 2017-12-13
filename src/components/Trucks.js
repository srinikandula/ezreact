//display all the trucks along
import React,{Component} from 'react';
import {View,Text} from 'react-native';
import CustomStyles from './common/CustomStyles';

export default class HomeScreen extends Component{
    render(){
        return(
            <View style={CustomStyles.ViewStyle}>
                <Text style={CustomStyles.textColor}>
                    Trucks Screen
                    </Text>
            </View>
        );
    }

    
}
 