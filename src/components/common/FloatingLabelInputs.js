import React,{ Component } from 'react';
import {TextInput, View, Text} from 'react-native';

class FloatingLabelInputs extends Component {
    state = {
      isFocused: false,
      value:''
    };
  
    handleFocus = () => this.setState({ isFocused: true });
    handleBlur = () => this.setState({ isFocused: false });
  
    render() {
      const { label,secureTextEntry,editable,maxLength,keyboardType,underlineColorAndroid, ...props } = this.props;
      const { isFocused,value } = this.state;
      const labelStyle = {
        position: 'absolute',
        left: 0,
        top: !isFocused ? 20 : 0,
        fontSize: !isFocused ? 20 : 14,
        color: !isFocused ? '#aaa' : '#000',
      };
      return (
        <View style={{ paddingTop: 18,alignSelf:'stretch' }}>
          <Text style={labelStyle}>
            {label}
          </Text>
          <TextInput
            {...props}
            style={{ height: 40, fontSize: 20, color: '#000', borderBottomWidth: 1, borderBottomColor: 'transparent' }}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            secureTextEntry={secureTextEntry}
            editable={editable}
            maxLength={maxLength}
            keyboardType={keyboardType}
            underlineColorAndroid={underlineColorAndroid}  
          />
        </View>
      );
    }
  }
  export {FloatingLabelInputs};