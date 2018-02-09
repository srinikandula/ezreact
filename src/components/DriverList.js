//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView, BackHandler, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';



export default class DriverList extends Component {
    state = {
        categoryBgColor: false, token: '', driver: []
    };

    componentWillMount() {
        const self = this;
        console.log(self.props, "token");
        this.getCredentailsData();
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
        //Actions.pop();
        //var value = await this.getCache('credientails');
    }

    async getCredentailsData() {
        this.getCache((value) => {
            if (value !== null) {
                var egObj = {};
                egObj = JSON.parse(value);
                this.setState({ token: egObj.token });
                Axios({
                    method: 'get',
                    headers: { 'token': egObj.token },
                    url: Config.routes.base + Config.routes.driverList
                })
                    .then((response) => {
                        if (response.data.status) {
                            console.log('DriverList ==>', response.data);
                            this.setState({ driver: response.data.drivers })
                        } else {
                            console.log('error in DriverList ==>', response);
                            this.setState({ erpDashBroadData: [], expirydetails: [] });
                        }

                    }).catch((error) => {
                        console.log('error in DriverList ==>', error);
                    })
            } else {
                this.setState({ loading: false })
            }
        }
        );
    }
    async getCache(callback) {
        try {
            var value = await AsyncStorage.getItem('credientails');
            console.log('credientails', value);
            if (value !== null) {
                console.log('riyaz', value);
            } else {
                console.log('value', value);
            }
            callback(value);
        }
        catch (e) {
            console.log('caught error', e);
            // Handle exceptions
        }
    }


    callSubCategoryScreen(truckContactNum) {

        RNImmediatePhoneCall.immediatePhoneCall(''+truckContactNum);
        
       /*  const self = this;
        const args = {
            number: '' + truckContactNum, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
        }

        call(args)
            .catch(
            console.error) */

    }


    getParsedDate(date) {
        var formattedDate = new Date(date);
        return "Licence Valid till  " + formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getFullYear().toString();
    }

    renderSeparator = () => (
        <View
            style={{
                backgroundColor: '#d6d6d6',
                height: 0.7,
            }}
        />
    );

    refreshFunction = (nextProps) => {
        if(nextProps.refresh){
            console.log('hurra=refresh',nextProps.refresh);
            this.getCredentailsData();
        }
    }


    render() {
        const self = this;
        return (

            <View style={CustomStyles.viewStyle}>
                <View style={CustomStyles.erpCategory}>

                    <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                        data={this.state.driver}
                        ItemSeparatorComponent={this.renderSeparator}
                        renderItem={({ item }) =>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        categoryBgColor: !this.state.categoryBgColor
                                    });
                                }}
                            >

                                <View style={[CustomStyles.erpCategoryItems, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                    <View style={CustomStyles.erpDriverItems}>
                                        <View style={[CustomStyles.erpTextView, { flex: 0.4, borderBottomWidth: 0 }]}>
                                            <Image resizeMode="contain"
                                                source={require('../images/truck_icon.png')}
                                                style={CustomStyles.imageViewContainer} />
                                            <Text style={[CustomStyles.erpText, { fontWeight: 'bold', flex: 1, textDecorationLine: 'underline' }]}>
                                                {item.licenseNumber}</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>

                                            <Text style={[CustomStyles.erpText, { fontFamily: 'Gotham-Medium', fontSize: 16, }]}>{item.fullName}</Text>
                                            <Text style={CustomStyles.erpText}> +91 {item.mobile}</Text>

                                            <Text style={CustomStyles.erpText}>{this.getParsedDate(item.licenseValidity)}</Text>

                                        </View>
                                        <View style={[CustomStyles.erpTextView, { flex: 0.2, alignItems: 'flex-end', borderBottomWidth: 0, paddingBottom: 5 }]}>
                                            <TouchableOpacity onPress={() => 
                                                                    {this.props.navigation.navigate('AddDriver',{token:this.state.token,id:item._id,edit:true,refresh: this.refreshFunction})}
                                                                }>
                                                <Image resizeMode="contain"
                                                    source={require('../images/form_edit.png')}
                                                    style={CustomStyles.drivervEditIcons} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { this.callSubCategoryScreen(item.mobile) }
                                            }>
                                                <Image resizeMode="contain"
                                                    source={require('../images/call_user.png')}
                                                    style={CustomStyles.drivervCallIcons} />
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                        keyExtractor={item => item._id} />

                </View>
                <View style={CustomStyles.addGroupImageStyle}>
                    <TouchableOpacity
                    onPress={()=> this.props.navigation.navigate('AddDriver',{token:this.state.token})}
                    >
                        <Image source={require('../images/eg_driver.png')}
                        style={CustomStyles.addImage} />
                    </TouchableOpacity>
                </View>
            </View>

        );
    }

}

