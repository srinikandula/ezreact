import React, {Component} from 'react';
import {View,Text,Image,ImageBackground} from 'react-native';
import CustomStyles from './CustomStyles';
class CommonBackground extends Component {
    render() {
        return (
                 <ImageBackground  
                 
                 //TODO add uri: that should work both for ios and android 
                     source={require('../../images/splash_screen.png')}
                    style= {CustomStyles.backgroundImage} 
                    resizeMode={Image.resizeMode.sretch}>
                    {this.props.children}
                </ImageBackground>
            );
    }
};

export {CommonBackground};