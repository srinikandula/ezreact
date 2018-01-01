import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {CustomText} from './';
import CustomStyles from './CustomStyles';

const CRadio = ({label, onPress, activeStyle}) => {
    return (
        <View style={{flexDirection:'row', marginHorizontal:10}}>
            <TouchableOpacity onPress={onPress} style={[CustomStyles.radioStyle]}>
                <View style={[CustomStyles.radioActiveStyle, [activeStyle]]}></View>
            </TouchableOpacity>
            <CustomText customTextStyle={[CustomStyles.mLt10,{color:'#000000'}]}>{label}</CustomText>
        </View>
    );
};

export {CRadio};
