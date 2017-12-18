//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView,BackHandler, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText } from './common';
import Config from '../config/Config';
import { Actions, Reducer } from 'react-native-router-flux';
import Axios from 'axios';


export default class ERPCategory extends Component {
    state = {
        categoryBgColor: false,
        recordsList: [], 
        expenses: [], 
        totalExpenses:{
            totalDieselExpense: 0,
            totaltollExpense: 0,
            totalmExpense: 0,
            totalmisc: 0
            },
        grossAmounts: {
            grossFreight: 0,
            grossExpenses: 0,
            grossRevenue: 0
        },
        dechileID:''
    };
    componentWillMount() {
        const self = this;
        
        Axios({
            method: 'get',
            headers: { 'token': self.props.token },
            url: self.props.Url
        })
            .then((response) => {
                console.log('baskets ==>', response.data);

                if (response.data.status) {
                    if(self.props.mode == 'Expense'){
                        self.setState({expenses:response.data.expenses,totalExpenses: response.data.totalExpenses});
                    }else if(self.props.mode == 'Revenue'){
                        self.setState({recordsList:response.data.revenue,grossAmounts: response.data.grossAmounts});
                    }
                    
                } else {
                    console.log('error in baskets ==>', response);
                }

            }).catch((error) => {
                console.log('error in baskets ==>', error);
            })
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }
        componentWillUnmount(){
         BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }

        onBackAndroid() {
            //Actions.pop();
            //var value = await this.getCache('credientails');
           }

    constructor() {
        super();
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            categoryBgColor: false,
            grossAmounts: {
                grossFreight: 0,
                grossExpenses: 0,
                grossRevenue: 0
            },
            totalExpenses:{
                totalDieselExpense: 0,
                totaltollExpense: 0,
                totalmExpense: 0,
                totalmisc: 0
                },
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
        };
    }

    getExpiryDateView() {
        return this.state.expirydetails.map((expirydetail, i) => {

            return <ExpiryDateItems key={i} style={{ flex: 1 }} count={expirydetail.count} label={expirydetail.label} />

        });
    }

    callSubCategoryScreen(truckNum,truckAmount,truckID){
        const self = this;
        console.log(self.props.token);
        switch(self.props.mode) {
            case "Revenue":
               Actions.erpsubcategory({
                token: self.props.token,
                Url: Config.routes.base + Config.routes.detailsRevenueFromVechicle+truckID,
                label:'Total Revenue From '  +truckNum +""+ truckAmount,
                mode:self.props.mode
                });

                break;
            case "Expense":
            console.log("Expense",'data',);
            Actions.erpsubcategory({
                token: self.props.token,
                Url: Config.routes.base + Config.routes.detailsExpensesForAllVehicles+truckID,
                label:'Total Revenue From '  +truckNum +""+ truckAmount,
                mode:self.props.mode
                });
                break;
            case "Payments":
            console.log("Expense",data);
                break;
            default:
                text = "I have never heard of that fruit...";
        }
    }





    render() {
        const self=this;
      
        switch(self.props.mode) {
            case "Revenue":
            return (
                <View style={CustomStyles.viewStyle}>
                    <View style={CustomStyles.erpCategory}>
                        <Text style={CustomStyles.headText}>{this.props.label}</Text>
                        <View style={CustomStyles.erpCategoryHeaderItems}>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>V.No</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>Freight</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>Expense</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>Revenue</Text>
                            </View>
                        </View>
                        <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                            data={this.state.recordsList}
                            renderItem={({ item }) =>
                            <TouchableOpacity
                            onPress={() => { this.setState({
                                                categoryBgColor: !this.state.categoryBgColor
                                                 });
                                                this.callSubCategoryScreen(item.attrs.truckName,item.totalRevenue,item.registrationNo) }}
                        >
                        
                                <View style={[CustomStyles.erpCategoryItems,{ backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpText}>{item.attrs.truckName}</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpText}>{item.totalFreight}</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpText}>{item.totalExpense}</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpText}>{item.totalRevenue}</Text>
                                    </View>
                                </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.registrationNo} />
                        <View style={CustomStyles.erpCategoryFooterItems}>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpFooterText}>Total</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpFooterText}>{this.state.grossAmounts.grossFreight}</Text>
                            </View>
                           <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpFooterText}>{this.state.grossAmounts.grossExpenses}</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpFooterText}>{this.state.grossAmounts.grossRevenue}</Text>
                            </View> 
                        </View>
                    </View>
                </View>
            );

                break;
            case "Expense":
            return (
                <View style={CustomStyles.viewStyle}>
                    <View style={CustomStyles.erpCategory}>
                        <Text style={CustomStyles.headText}>{this.props.label}</Text>
                        <View style={CustomStyles.erpCategoryHeaderItems}>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>V.No</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>Freight</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>Expense</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>Revenue</Text>
                            </View>
                        </View>
                        <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                            data={this.state.expenses}
                            renderItem={({ item }) =>
                            <TouchableOpacity
                                onPress={() => { this.setState({
                                                    categoryBgColor: !this.state.categoryBgColor
                                                    });
                                                    this.callSubCategoryScreen(item.regNumber,'',item.id) }}
                            >
                        
                                <View style={[CustomStyles.erpCategoryItems,{ backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpText}>{item.regNumber}</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpText}>{item.exps[0].dieselExpense}</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpText}>{item.exps[0].mExpense}</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpText}>{item.exps[0].misc}</Text>
                                    </View>
                                </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.id} />
                        <View style={CustomStyles.erpCategoryFooterItems}>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpFooterText}>Total</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpFooterText}>{this.state.grossAmounts.totaltollExpense}</Text>
                            </View>
                           <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpFooterText}>{this.state.grossAmounts.totalmExpense}</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpFooterText}>{this.state.grossAmounts.totalmisc}</Text>
                            </View> 
                        </View>
                    </View>
                </View>
            );
                break;
            
        }
      
      
        
    }


}
