import React, {Component} from 'react';
import {View,Text,Image,ImageBackground} from 'react-native';
import CustomStyles from './CustomStyles';
class CommonBackground extends Component {
    render() {
        return (
                 <ImageBackground  
                    source={{uri : 'splash_screen'}}
                    style= {CustomStyles.backgroundImage} 
                    resizeMode={Image.resizeMode.sretch}>
                    {this.props.children}
                </ImageBackground>
            );
    }
};

export {CommonBackground};