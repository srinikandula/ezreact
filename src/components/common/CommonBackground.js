import React, {Component} from 'react';
import {View,Text,Image,ImageBackground} from 'react-native';

class CommonBackground extends Component {
    render() {
        const {backgroundImage} = styles;
        return (
                 <ImageBackground  
                    source={{uri : 'splash_screen'}}
                    style= {backgroundImage} 
                    resizeMode={Image.resizeMode.sretch}>
                    {this.props.children}
                </ImageBackground>
            );
    }
}

const styles = {
    backgroundImage: {
        flex: 1,
        width: null,
        height: null
    }
    /*style={{width: 16, height: 16}}*/

};

export {CommonBackground};