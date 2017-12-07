import React from 'react';
import {TextInput, View, Image} from 'react-native';

const CustomInput = ({
                         maxLength,
                         keyboardType,
                         inputContainerStyle,
                         inputTextStyle,
                         value,
                         onChangeText,
                         placeholder,
                         secureTextEntry,
                         imageSource,
                         imageStyle,
                         editable
                     }) => {
    const {inputStyle, containerStyle} = styles;
    return (
        <View style={[containerStyle, inputContainerStyle]}>
            <Image
                resizeMode='stretch'
                style={imageStyle}
                source={imageSource}
            />
            <TextInput
                editable={editable}
                maxLength={maxLength}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                autoCorrect={false}
                style={[inputStyle, inputTextStyle]}
                value={value}
                onChangeText={onChangeText}
                underlineColorAndroid='transparent'
            />
        </View>
    );
};
const styles = {
    containerStyle: {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#02C9A6',
        marginBottom: 10,
        paddingLeft: 10,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA'
    },
    imageStyle: {
        flex: 1,
        alignSelf: 'center',
        marginLeft: 10,
        backgroundColor: '#FAFAFA'

    },
    inputStyle: {
        flex: 3,
        color: '#000',
        fontSize: 18,
        lineHeight: 23,
        height: 48,
        paddingLeft: 15,
        justifyContent: 'center'
    }
};

export {CustomInput};
