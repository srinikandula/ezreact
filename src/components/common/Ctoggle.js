import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {CustomText} from './';
import CustomStyles from './CustomStyles';

const Ctoggle = ({label,labelStyle, onPress, activeStyle}) => {
    return (
        <View style={{flex:1,flexDirection:'column', justifyContent: 'center',
        alignItems: 'center', marginHorizontal:10}}>
            <TouchableOpacity onPress={onPress} style={[CustomStyles.toogleStyle, [activeStyle]]}>
                <View style={[CustomStyles.toggleActiveStyle]}>
                         <CustomText customTextStyle={[CustomStyles.mLt10,{color:'#000000'},[labelStyle]]}>{label}</CustomText>
                </View>
            </TouchableOpacity>
           
        </View>
    );
};

export {Ctoggle};
