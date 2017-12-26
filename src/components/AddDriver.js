import React, { Component } from 'react';
import {
    View, Image, Text, Picker, DatePickerAndroid,
    CheckBox, TouchableOpacity, ToastAndroid, ScrollView, Keyboard, Dimensions, BackHandler
} from 'react-native';
import { CustomInput, renderIf, CustomEditText, CustomButton, CustomText, CommonBackground } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';
import { Actions } from 'react-native-router-flux';

export default class AddDriver extends Component {
    state = {
        selectedName: '',
        licenseValidityDate: {
            day: '',
            month: '',
            year: ''
        },

    };
    componentWillMount() {

    }

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { bottom: 50 }, selectedName: value });
    }

    onPickdate() {
        try {
            let currDate = new Date();
            const { action, year, month, day } = DatePickerAndroid.open({
                date: new Date(),
                //minDate: currDate.setDate(currDate.getDate() + 2),
                minDate: new Date(),
            }).then((response) => {
                if (response.action === "dateSetAction") {
                    let licenseValidityDate = {
                        day: response.day,
                        month: response.month + 1,
                        year: response.year
                    };
                    this.setState({ licenseValidityDate });
                }
            }).catch((error) => {
                console.log(error);
            });
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }

    }
    onSubmitDriverDetails() {

    }


    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                    <View style={{ backgroundColor: '#ffffff', margin: 5 }}>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field0]}>Full Name</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.name}
                                onChangeText={(name) => this.moveInputLabelUp(0, name)} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field1]}>Contact Number</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.mobile}
                                onChangeText={(mobile) => this.moveInputLabelUp(1, mobile)} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field2]}>License Number</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.licenseNo}
                                onChangeText={(licenseNo) => this.moveInputLabelUp(2, licenseNo)} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 5 }}>
                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field3]}>License Validity</CustomText>
                                    <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={`${this.state.licenseValidityDate.day}/${this.state.licenseValidityDate.month}/${this.state.licenseValidityDate.year}`}
                                        onChangeText={(licenseValidityDate) => this.moveInputLabelUp(3, licenseValidityDate)} />
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => { this.onPickdate() }}
                                    >
                                        <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../images/calanderLogo.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            <Picker
                                style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                selectedValue={this.state.language}
                                onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}>
                                <Picker.Item label="Java" value="java" />
                                <Picker.Item label="JavaScript" value="js" />
                            </Picker>
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field4]}>Salary Per Month</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.salaryPM}
                                onChangeText={(salaryPM) => this.moveInputLabelUp(4, salaryPM)} />
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: "#dfdfdf", alignSelf: 'stretch' }}
                        onPress={() => { Actions.Drivers() }}
                    >
                        <View style={{ alignItems: 'stretch' }}>
                            <Text style={{ padding: 15, alignSelf: 'center' }}>
                                CANCEL
                        </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: "#1e4495", alignSelf: 'stretch' }}
                        onPress={() => { this.onSubmitDriverDetails() }}>
                        <View style={{ alignItems: 'stretch' }}>
                            <Text style={{ color: '#fff', padding: 15, alignSelf: 'center' }}>
                                SUBMIT
                        </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}