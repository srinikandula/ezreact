import React, { Component } from 'react';
import { View, Picker, Platform, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import styles from './CustomStyles';
import { CustomInput, Confirm, CustomText } from './index';

class CPicker extends Component {
    state = { showModal: false }

    getCourseValue(){
        console.log('this.props.selectedValue',this.props.selectedValue,"++++",this.props.placeholder)
        if(this.props.selectedValue && this.props.selectedValue !==''){
            return this.props.selectedValue;
        } else {
            return this.props.placeholder;
        }
    }

    checkValue(value){
        // console.warn(value)
        if(value!=="undefined"){
            return value;
        } else {
            return this.props.placeholder;
        }
    }

    renderPicker() {
        if (Platform.OS === 'ios') {
            return (
                <TouchableOpacity onPress={() => { this.setState({ showModal: true })}} 
                                style={[styles.inputStyle,{ justifyContent: 'center', marginLeft:20}]}>
                    <CustomText customTextStyle={{color: '#000'}}>{this.getCourseValue()} </CustomText>
                    {/* <Image style={{alignSelf: 'flex-end',resizeMode:'contain', width: 20, height: 20 }} source={require('../../images/down_arrow.png')}/>  */}
                </TouchableOpacity>
            );
        } else {
            return <Picker  style={[styles.pickerStyle, this.props.cStyle]} 
                            selectedValue={this.props.selectedValue} 
                            onValueChange={this.props.onValueChange}>
                {this.props.children}
            </Picker>
        }
    }
    onAccept() {
        this.setState({ showModal: false })
    }

    onDecline() {
        this.setState({ showModal: false })
    }

    render() {
        return (
            <View selectedProp={this.props.selectedProp} style={[styles.pickerWrapStyle]}>
                {this.renderPicker()}
                <Confirm visible={this.state.showModal}
                    onAccept={this.onAccept.bind(this)}
                    onDecline={this.onDecline.bind(this)}
                    sayYes="Confirm"
                    sayNo="Cancel"
                >
                    <View style={{ padding: 20 }}>
                        <Picker style={[styles.pickerStyle, this.props.cStyle]} 
                        selectedValue={this.props.selectedValue} 
                        onValueChange={this.props.onValueChange}>
                            {this.props.children}
                        </Picker>
                    </View>
                </Confirm>
            </View>
        );
    }
}

export { CPicker };