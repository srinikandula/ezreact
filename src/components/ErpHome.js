//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, BackHandler, NetInfo, ScrollView, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { LoadingSpinner, ExpiryDateItems, CustomText } from './common';
import Utils from './common/Utils';
import { NavigationActions } from 'react-navigation';
import Config from '../config/Config';
import Axios from 'axios';
import { NoInternetModal } from './common';
const category = [
    {
        'name': 'Revenue',
        'subname': 'From all vehicles',
        'amount': 1000000,
        'imagepath': '../images/revenue.png'
    }]

export default class ErpHome extends Component {
    state = {
        loadSpinner: false, categoryBgColor: false, token: '', netFlaf: false,
        erpDashBroadData: { paybleAmount: 0, pendingDue: 0, expensesTotal: 0, totalRevenue: 0 }, expirydetails: [], update: false
    };

    componentWillMount() {
        const self = this;

        // console.log('props',this.props.order, this.props.navigation);
        // this.setState({ order: this.props.order });

        self.setState({ loadSpinner: true }, () => {
            
                    this.getCredentailsData();
                
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        });
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
        //Actions.pop();
        //var value = await this.getCache('credientails');
    }
    renderLoadingSpinner() {
        if (this.state.loadSpinner)
            return <LoadingSpinner />;
        return false;
    }
    async getCredentailsData() {
        this.getCache((value) => {
            if (value !== null) {
                var egObj = {};
                egObj = JSON.parse(value);
                this.setState({ token: egObj.token }, () => {
                    Axios({
                        method: 'get',
                        headers: { 'token': egObj.token },
                        url: Config.routes.base + Config.routes.easygaadiDashBroad
                    }).then((response) => {
                        //result{expensesTotal: 236497, pendingDue: 599461, totalRevenue: 1114081, expiring: {…}}
                        if (response.data.status) {
                            console.log('ErpHome ==>', response.data);
                            //Object.values()== array convetion
                            var temp = response.data.result.expiring;
                            var Aarr = [];
                            var tempObj = { label: "", count: "" };

                            tempObj.label = "   Permit   ";
                            tempObj.count = temp.permitExpiryCount;
                            Aarr.push(tempObj);
                            tempObj = { label: "", count: "" };
                            tempObj.label = "Insurance";
                            tempObj.count = temp.insuranceExpiryCount;
                            Aarr.push(tempObj);
                            tempObj = { label: "", count: "" };
                            tempObj.label = "  Fitness  ";
                            tempObj.count = temp.fitnessExpiryCount;
                            Aarr.push(tempObj);
                            tempObj = { label: "", count: "" };
                            tempObj.label = "Pollution";
                            tempObj.count = temp.pollutionExpiryCount;
                            Aarr.push(tempObj);
                            tempObj = { label: "", count: "" };
                            tempObj.label = "     Tax      ";
                            tempObj.count = temp.taxExpiryCount;
                            Aarr.push(tempObj);
                            //this.onChange();
                            this.setState({ erpDashBroadData: response.data.result, expirydetails: Aarr, loadSpinner: false });
                            //console.log('expiry ==>', this.state.expirydetails);
                        } else {
                            console.log('error in ErpHome ==>', response);
                            this.setState({ erpDashBroadData: [], expirydetails: [] });
                        }
                    }).catch((error) => {
                        console.log('error in ErpHome ==>', error);
                        if (error.response.status === 401) {
                            AsyncStorage.clear();// AsyncStorage.clear();
                            this.reset();

                        }
                    })
                });

            } else {
                // this.setState({ loadSpinner: false })
            }
        }
        );
    }

    reset() {
        const { navigate } = this.props.navigation
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'login' })
            ],
            key: null
        });
        this.props.navigation.dispatch(resetAction);
    }
    async getCache(callback) {
        try {
            var value = await AsyncStorage.getItem('credientails');
            callback(value);
        }
        catch (e) {
            console.log('caught error', e);
            // Handle exceptions
        }
    }



    getExpiryDateView() {
        return this.state.expirydetails.map((expirydetail, i) => {
            return <ExpiryDateItems key={i} style={{ flex: 1 }} count={expirydetail.count} label={expirydetail.label} />

        });
    }

    callcategoryScreen(data) {
        NetInfo.isConnected.fetch().then(isConnected => {
            console.log('isConnected',isConnected);
            if (isConnected) {
                this.setState({netFlaf:false});
            const { navigate } = this.props.navigation;
            switch (data) {
                case "Revenue":
                    navigate('Erpcategory', {
                        token: this.state.token,
                        Url: Config.routes.base + Config.routes.totalRevenueByVechicle,
                        mode: data,
                        label: 'Total Revenue Details'
                    });

                    break;
                case "Expense":
                    navigate('Erpcategory', {
                        token: this.state.token,
                        Url: Config.routes.base + Config.routes.totalExpensesForAllVehicles,
                        mode: data,
                        label: 'Total Expenses Details'
                    });
                    break;
                case "Payments":
                    console.log("Payments", data);
                    navigate('Erpcategory', {
                        token: this.state.token,
                        Url: Config.routes.base + Config.routes.totalPayeblesPayment,
                        //Url: Config.routes.base + Config.routes.totalPayeblesPayment,
                        mode: data,
                        label: 'Total Payments Details'
                    });
                    break;
                case "Expiry":
                    console.log("Expiry", data);
                    navigate('ExpiryDate', {
                        token: this.state.token,
                        Url: Config.routes.base + Config.routes.permitExpiryTrucks,
                        mode: data,
                        baseExpiry: 'Permit',
                        label: 'Permit Details'
                    });
                    break;
                default:
                    text = "I have never heard of that fruit...";
            }
        } else {
            return this.setState({netFlaf:true});
        }
    });

    }

    render() {
        return (

            <View style={CustomStyles.viewStyle}>
                {this.renderLoadingSpinner()}
                <ScrollView>
                    <TouchableOpacity
                        onPress={() => { this.callcategoryScreen('Revenue') }}
                    >
                        <View style={[CustomStyles.Category, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                            <Image
                                style={CustomStyles.imageDimensions}
                                resizeMode="contain"
                                source={require('../images/revenue.png')}
                            />
                            <View style={CustomStyles.textContainer}>
                                <CustomText customTextStyle={CustomStyles.headingTextColor}>
                                    Revenue
                        </CustomText>
                                <CustomText customTextStyle={CustomStyles.subHeadingTextColor}>
                                    From all vehicles
                        </CustomText>
                                <CustomText customTextStyle={CustomStyles.amountColor}>
                                    {`₹${this.state.erpDashBroadData.totalRevenue}`}
                                </CustomText>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* this.renderCategories() */}
                    <TouchableOpacity
                        onPress={() => { this.callcategoryScreen('Expense') }}
                    >
                        <View style={[CustomStyles.Category, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                            <Image
                                style={CustomStyles.imageDimensions}
                                resizeMode="contain"
                                source={require('../images/expenses.png')}
                            />
                            <View style={CustomStyles.textContainer}>
                                <CustomText customTextStyle={CustomStyles.headingTextColor}>
                                    Expenses
                        </CustomText>
                                <CustomText customTextStyle={CustomStyles.subHeadingTextColor}>
                                    From all vehicles
                        </CustomText>
                                <CustomText customTextStyle={CustomStyles.amountColor}>
                                    {`₹${this.state.erpDashBroadData.expensesTotal}`}
                                </CustomText>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { this.callcategoryScreen('Payments') }}
                    >
                        <View style={[CustomStyles.Category, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                            <Image
                                style={CustomStyles.imageDimensions}
                                resizeMode="contain"
                                source={require('../images/payments.png')}
                            />
                            <View style={CustomStyles.textContainer}>
                                <CustomText customTextStyle={CustomStyles.headingTextColor}>
                                    Payments
                                </CustomText>
                                <CustomText customTextStyle={CustomStyles.subHeadingTextColor}>
                                    From all vehicles
                                </CustomText>
                                <CustomText customTextStyle={CustomStyles.amountColor}>
                                    {`payables        ₹${this.state.erpDashBroadData.paybleAmount}`}
                                </CustomText>
                                <CustomText customTextStyle={CustomStyles.amountColor}>

                                    {`Receivables    ₹${this.state.erpDashBroadData.pendingDue}`}
                                </CustomText>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { this.callcategoryScreen('Expiry') }}
                    >
                        <View style={[CustomStyles.ECategory, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                            <Image
                                style={CustomStyles.imageDimensions}
                                resizeMode="contain"
                                source={require('../images/expirydetails.png')}
                            />
                            <View style={CustomStyles.EtextContainer}>
                                <CustomText customTextStyle={CustomStyles.headingTextColor}>
                                    Expiry Details
                            </CustomText>
                                <CustomText customTextStyle={CustomStyles.subHeadingTextColor}>
                                    From all vehicles
                            </CustomText>
                                <ScrollView horizontal={true}>
                                    {/* <View style={{alignSelf: 'stretch',alignItems: 'stretch',  flexDirection:'row',padding:2}}> */}
                                    <View style={CustomStyles.expiryDateView}>
                                        {this.getExpiryDateView()}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <NoInternetModal visible={this.state.netFlaf} 
                        onAccept={() => {this.setState({ netFlaf: false }) }}/>
                </ScrollView>                
            </View>
        );
    }


}
