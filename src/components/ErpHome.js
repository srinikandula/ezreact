//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView,Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import {ExpiryDateItems} from  './common';
import Config from '../config/Config';
import Axios from 'axios';
const category = [
    {
        'name': 'Revenue',
        'subname': 'From all vehicles',
        'amount': 1000000,
        'imagepath': '../images/revenue.png'
    }]

export default class ErpHome extends Component {
    state = { categoryBgColor: false, erpDashBroadData: {},expirydetails:[] ,update:false};

    componentWillMount() {
        this.setState({ order: this.props.order });
        this.getCredentailsData();
       
        

    }

   

    async getCredentailsData() {
        this.getCache((value) => {
            if (value !== null) {
                var egObj = {};
                egObj = JSON.parse(value);
                console.log('rock ==>', Config.routes.base + Config.routes.easygaadiDashBroad);
                console.log('token ==>', "" + egObj.token.toString());
                Axios({
                    method: 'get',
                    headers: { 'token': egObj.token },
                    url: Config.routes.base + Config.routes.easygaadiDashBroad
                })
                    .then((response) => {
                        //result{expensesTotal: 236497, pendingDue: 599461, totalRevenue: 1114081, expiring: {…}}

                        if (response.data.status) {
                            console.log('baskets ==>', response.data);
                            
                            //Object.values()== array convetion
                            var temp =response.data.result.expiring;
                            var Aarr =[];
                            var tempObj ={label:"",count:""};
                            
                            tempObj.label="   Permit   ";
                            tempObj.count = temp.permitExpiryCount;
                            Aarr.push(tempObj);
                             tempObj ={label:"",count:""};
                            tempObj.label="Insurance";
                            tempObj.count = temp.insuranceExpiryCount;
                            Aarr.push(tempObj);
                             tempObj ={label:"",count:""};
                            tempObj.label="  Fitness  ";
                            tempObj.count = temp.fitnessExpiryCount;
                            Aarr.push(tempObj);
                             tempObj ={label:"",count:""};
                            tempObj.label="Pollution";
                            tempObj.count = temp.pollutionExpiryCount;
                            Aarr.push(tempObj);
                             tempObj ={label:"",count:""};
                            tempObj.label="     Tax      ";
                            tempObj.count = temp.taxExpiryCount;
                            Aarr.push(tempObj);
                            //this.onChange();
                            this.setState({ erpDashBroadData: response.data.result,expirydetails:Aarr });
                            console.log('expiry ==>', this.state.expirydetails);


                        } else {
                            console.log('error in baskets ==>', response);
                        }

                    }).catch((error) => {
                        console.log('error in baskets ==>', error);
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

    

    getExpiryDateView(){
        return this.state.expirydetails.map((expirydetail, i) => {
           console.log("sadasd",expirydetail.count,expirydetail.label);
            return   <ExpiryDateItems key={i} style={{flex:1}}  count={expirydetail.count} label={expirydetail.label}  />
            
       });
    }

    render() {
        return (
            
            <View style={CustomStyles.ViewStyle}>
            <ScrollView>
                <TouchableOpacity
                    onPress={() => { this.setState({ categoryBgColor: !this.state.categoryBgColor }) }}
                >
                    <View style={[CustomStyles.Category, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                        <Image
                            style={CustomStyles.imageDimensions}
                            resizeMode="contain"
                            source={require('../images/revenue.png')}
                        />
                        <View style={CustomStyles.textContainer}>
                            <Text style={CustomStyles.headingTextColor}>
                                Revenue
                        </Text>
                            <Text style={CustomStyles.subHeadingTextColor}>
                                From all vehicles
                        </Text>
                            <Text style={CustomStyles.amountColor}>
                            {`₹${this.state.erpDashBroadData.totalRevenue}`}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {/* this.renderCategories() */}
                <TouchableOpacity
                    onPress={() => { this.setState({ categoryBgColor: !this.state.categoryBgColor }) }}
                >
                    <View style={[CustomStyles.Category, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                        <Image
                            style={CustomStyles.imageDimensions}
                            resizeMode="contain"
                            source={require('../images/expenses.png')}
                        />
                        <View style={CustomStyles.textContainer}>
                            <Text style={CustomStyles.headingTextColor}>
                                Expenses
                        </Text>
                            <Text style={CustomStyles.subHeadingTextColor}>
                                From all vehicles
                        </Text>
                            <Text style={CustomStyles.amountColor}>
                                {`₹${this.state.erpDashBroadData.expensesTotal}`}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { this.setState({ categoryBgColor: !this.state.categoryBgColor }) }}
                >
                    <View style={[CustomStyles.Category, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                        <Image
                            style={CustomStyles.imageDimensions}
                            resizeMode="contain"
                            source={require('../images/payments.png')}
                        />
                        <View style={CustomStyles.textContainer}>
                            <Text style={CustomStyles.headingTextColor}>
                                payments
                        </Text>
                            <Text style={CustomStyles.subHeadingTextColor}>
                                From all vehicles
                        </Text>
                            <Text style={CustomStyles.amountColor}>
                                {`payables       ₹${this.state.erpDashBroadData.pendingDue}`}
                            </Text>
                            <Text style={CustomStyles.amountColor}>
                                {`Receivables  ₹1,20,000`}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                
                    <View style={[CustomStyles.ECategory,]}>
                        <Image
                            style={CustomStyles.imageDimensions}
                            resizeMode="contain"
                            source={require('../images/expirydetails.png')}
                        />
                        <View style={CustomStyles.EtextContainer}>
                            <Text style={CustomStyles.headingTextColor}>
                                Expiry Details
                            </Text>
                            <Text style={CustomStyles.subHeadingTextColor}>
                                From all vehicles
                            </Text>
                            <ScrollView horizontal={true}>
                            {/* <View style={{alignSelf: 'stretch',alignItems: 'stretch',  flexDirection:'row',padding:2}}> */}
                                <View style={CustomStyles.expiryDateView}>
                                    {this.getExpiryDateView()}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }


}
