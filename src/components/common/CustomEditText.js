import React from 'react';
import {TextInput, View, Image} from 'react-native';

const CustomEditText = ({
                        underlineColorAndroid,
                         maxLength,
                         keyboardType,
                         inputContainerStyle,
                         inputTextStyle,
                         value,
                         onChangeText,
                         onFocus,
                         onBlur,
                         placeholder,
                         secureTextEntry,
                         imageSource,
                         imageStyle,
                         editable
                     }) => {
    const {inputStyle, containerStyle} = styles;
    return (
        <View style={[containerStyle, inputContainerStyle]}>
            <TextInput
                underlineColorAndroid={underlineColorAndroid}            
                editable={editable}
                maxLength={maxLength}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                autoCorrect={false}
                style={[inputStyle, inputTextStyle]}
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                
            />
        </View>
    );
};
const styles = {
    containerStyle: {       
        marginBottom: 10,
        marginHorizontal: 0,
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignSelf:'stretch',
        marginTop:10
    },
    imageStyle: {
        flex: 1,
        alignSelf: 'center',
        marginLeft: 10,
        backgroundColor: '#FAFAFA'

    },
    inputStyle: {
        flex: 3,
        // fontFamily:'Gotham-Light',
        color: '#000',
        fontSize: 16,
        lineHeight: 23,
        height: 48,
        paddingLeft: 5,
        justifyContent: 'center',
        
    }
};

export {CustomEditText};
