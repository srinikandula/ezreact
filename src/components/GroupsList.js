//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView, BackHandler, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText } from './common';
import Config from '../config/Config';
import { Actions, Reducer } from 'react-native-router-flux';
import Axios from 'axios';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';



export default class GroupsList extends Component {
    state = {
        categoryBgColor: false, token: '', groupsList: [],token:''
    };

    componentWillMount() {
        const self = this;
        console.log(self.props, "token");
        this.setState({token:self.props.token});
        Axios({
            method: 'get',
            headers: { 'token': self.props.token },
            url: Config.routes.base + Config.routes.getListofGroups
        })
            .then((response) => {
                if (response.data.status) {
                    console.log('GroupList ==>', response.data);
                    self.setState({ groupsList: response.data.accountGroup })
                    if(response.data.accountGroup.length == 0){
                        
                        ToastAndroid.show("No Record Found", ToastAndroid.SHORT);
                    }
                } else {
                    
                    let message ="";
                    if(response.data)
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    ToastAndroid.show(message, ToastAndroid.SHORT);
                }

            }).catch((error) => {
                console.log('error in GroupList ==>', error);
            })
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
        //this.props.navigation.navigatepop();
        //var value = await this.getCache('credientails');
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


    getTruckCount(trucks) {
        var arrr = []
        arrr = trucks;
        return "Assgined Trucks  " + arrr.length;
    }

    renderSeparator = () => (
        <View
            style={{
                backgroundColor: '#d6d6d6',
                height: 0.7,
            }}
        />
    );


    render() {
        const self = this;
        return (

            <View style={CustomStyles.viewStyle}>
                <View style={CustomStyles.erpCategory}>

                    <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                        data={this.state.groupsList}
                        ItemSeparatorComponent={this.renderSeparator}
                        renderItem={({ item }) =>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log(this.state.groupsList.indexOf(item) ,'==', this.state.groupsList.length-1);
                                    this.setState({
                                        categoryBgColor: !this.state.categoryBgColor
                                    });
                                }}
                            >
                                <View style={[CustomStyles.erpCategoryItems, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                    <View style={[CustomStyles.erpDriverItems,{marginBottom: this.state.groupsList.indexOf(item) == this.state.groupsList.length-1 ? 50 :0 }]}>
                                        <View style={[CustomStyles.erpTextView, { flex: 0.4, borderBottomWidth: 0 }]}>
                                            <Image resizeMode="contain"
                                                source={require('../images/truck_icon.png')}
                                                style={CustomStyles.imageViewContainer} />
                                            <Text style={[CustomStyles.erpText, { fontWeight: 'bold', flex: 1, textDecorationLine: 'underline' }]}>
                                                {item.groupName}</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>

                                            <Text style={[CustomStyles.erpText, { fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                                        {item.contactName}
                                            </Text>
                                            <Text style={CustomStyles.erpText}>{ this.getTruckCount(item.truckIds || item.truckId) }</Text>
                                            <Text style={CustomStyles.erpText}> +91 {item.contactPhone}</Text>
                                        </View>
                                        <View style={[CustomStyles.erpTextView, { flex: 0.2, alignItems: 'flex-end', borderBottomWidth: 0, paddingBottom: 5 }]}>
                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('AddGroup',{token:this.state.token,edit:true,id:item._id}) }
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
                <View style={[CustomStyles.addGroupImageStyle,{bottom:10,right:10,}]}>
                    <TouchableOpacity
                    onPress={()=> this.props.navigation.navigate('AddGroup',{token:this.state.token})}
                    >
                        <Image source={require('../images/eg_driver.png')}
                        style={CustomStyles.addImage} />
                    </TouchableOpacity>
                </View>
            </View>

        );
    }

}

