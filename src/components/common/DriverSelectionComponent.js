import React from 'react';
import {View,Image,TouchableOpacity,ViewPagerAndroid,Text, TextInput} from 'react-native';

const DriverSelectionComponent   = ({cStyle, onPress,data,showSlected}) => {
    return (
        <View >
            <TouchableOpacity style={[cStyle]} onPress={onPress}>
                <View style={{flexWrap: 'wrap',margin:10,alignItems:'center'}}>
                    <View style={{borderWidth:0.5,justifyContent:'center'}} >
                    <Image source={require('../../images/truck_icon.png')} style={{height:40,width:40,resizeMode:'contain',margin:5}}/>
                        <Text style={{alignSelf:'center',fontSize:10,margin:2}}>{data}</Text>
                    </View>
                    <View style={[{borderWidth:0.5,justifyContent:'center',position:'absolute',  backgroundColor:'#2f2f2f'}, {display: showSlected}]} >
                        <Image source={require('../../images/select.png')} style={{height:40,width:40,resizeMode:'contain',margin:5}}/>
                    </View>

                </View> 
            </TouchableOpacity>
        </View>
    );
}
export {DriverSelectionComponent };