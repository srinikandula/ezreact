import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';

class CustomButton extends Component {
    render() {
        const {buttonViewStyle} = styles;
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={[buttonViewStyle, this.props.customButtonStyle]}
            >
                {this.props.children}
            </TouchableOpacity>

        );
    }
}

const styles = {
    buttonViewStyle: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3,
        backgroundColor: '#02C9A6'
    }
};

export {CustomButton};