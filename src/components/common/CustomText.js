import React, {Component} from 'react';
import {Text, Platform} from 'react-native';

class CustomText extends Component {
    render() {
        const {textStyle} = styles;
        return (
            <Text style={[textStyle, this.props.customTextStyle]}>
                {this.props.children}
            </Text>
        );
    }
}

const styles = {
    textStyle: {
        fontSize: 16,
        // fontFamily:'Gotham-Light',
        color: '#ffffff',
        //backgroundColor: Platform.OS==='ios'? 'transparent': 'none'
    }
};

export {CustomText};