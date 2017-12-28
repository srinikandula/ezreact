import React, {Component} from 'react';
import {Text} from 'react-native';

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
        color: '#ffffff'
    }
};

export {CustomText};