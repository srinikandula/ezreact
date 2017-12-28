import React,{ Component } from 'react';
import {TextInput, View, Text} from 'react-native';


class FloatingLabelInput extends Component {
  state = {
    isFocused: false,
  };

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  render() {
    const { label, ...props } = this.props;
    const { isFocused } = this.state;
    const styles ={
      labelStyle : {
          position: 'absolute',
          left: 0,
          top: !isFocused ? 16 : 0,
          fontSize: !isFocused ? 18 : 12,
          color: !isFocused ? '#aaa' : '#000',
          // fontFamily:'Gotham-Light',
        },
        containerStyle: {       
          marginBottom: 10,
          marginHorizontal: 0,
          flexDirection: 'row',
          alignItems: 'flex-start',
          alignSelf:'stretch',
        },
        inputStyle: {
            flex: 3,
            color: '#000',
            fontSize: 18,
            lineHeight: 23,
            height: 48,
            paddingLeft: 5,
            justifyContent: 'center'
        }
      };
    return (
      <View style={[styles.containerStyle, styles.inputContainerStyle]}>
        <Text style={styles.labelStyle}>
          {label}
        </Text>
        <TextInput
          {...props}
           style={[styles.inputStyle, props.inputTextStyle]}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
      </View>
    );
  }
}

export {FloatingLabelInput};