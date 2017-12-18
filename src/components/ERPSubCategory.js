//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View,BackHandler, ScrollView, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText } from './common';
import Config from '../config/Config';
import { Actions, Reducer } from 'react-native-router-flux';
import Axios from 'axios';


export default class ERPSubCategory extends Component {
    state = {
        trips: [], 
        expenses:[],
        totalExpenses:{},
        totalRevenue: {
        }
    };
    componentWillMount() {
        const self = this;
        console.log(self.props.token);
        Axios({
            method: 'get',
            headers: { 'token': self.props.token },
            url: self.props.Url
        })
            .then((response) => {
                console.log('sub expenses ==>', response.data.expenses);
                console.log('sub totalExpenses expenses ==>', response.data.totalExpenses);

                if (response.data.status) {
                    if(self.props.mode == 'Expense'){
                        self.setState({expenses:response.data.expenses,totalExpenses: response.data.totalExpenses});
                    }else if(self.props.mode == 'Revenue'){
                        self.setState({trips:response.data.trips,totalRevenue: response.data.totalRevenue});
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
            Actions.pop();
            //var value = await this.getCache('credientails');
           }
    constructor() {
        super();
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            totalRevenue: {
                totalFreight: 0,
                totalExpenses: 0
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

    callcategoryScreen(data) {
        switch (data) {
            case "Revenue":
                console.log("Revenue", data, Config.routes.base + Config.routes.totalRevenueByVechicle, );
                break;
            case "Expense":
                console.log("Expense", data);
                break;
            case "Payments":
                console.log("Expense", data);
                break;
            default:
                text = "I have never heard of that fruit...";
        }
    }

    getParsedDate(date){
        var formattedDate = new Date(date);
        return formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getYear().toString();
      }

      getExpenseFromData(expenseType,expenseCost){
          console.log('--->>',expenseType,expenseCost)
          var data='';
        if(expenseType == 'Diesel' || expenseType == 'Toll' || expenseType == 'Maintence' ){
            data = '-';
        }else{
            data = cost;
        }

        return data;
        /* else if(expenseType == 'Diesel'){
            return cost;
        }else  if(expenseType == 'Toll'){
            return cost;
        }else  if(expenseType == 'Maintence'){
            return cost;
        } */
        
      }

    render() {
        const self=this;
        switch (self.props.mode) {
            case "Revenue":
                console.log("Revenue", 'data', Config.routes.base + Config.routes.totalRevenueByVechicle, );
                return (
                    <View style={CustomStyles.viewStyle}>
                        <View style={CustomStyles.erpCategory}>
                            <Text style={CustomStyles.headText}>{this.props.label}</Text>
                            <View style={CustomStyles.erpCategoryHeaderItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Date</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Trip ID</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Party Name</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Freight</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Expense</Text>
                                </View>
                            </View>
                            <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                                data={this.state.trips}
                                renderItem={({ item }) =>
                                
                                    <View style={CustomStyles.erpCategoryItems}>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{this.getParsedDate(item.date)
                                                                                }</Text>
                                        </View>
                                         <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{item.tripId}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{item.attrs.partyName}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{item.freightAmount}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{item.cost}</Text>
                                        </View> 
                                    </View>
                                }
                                keyExtractor={item => item._id} />
                            <View style={CustomStyles.erpCategoryFooterItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>Total</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}></Text>
                                </View><View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}></Text>
                                </View>
                               <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalRevenue.totalFreight}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalRevenue.totalExpenses}</Text>
                                </View> 
                            </View>
                        </View>
                    </View>
                );
                break;
            case "Expense":
                console.log("Expense", 'data',this.state.expenses);
                return (
                    <View style={CustomStyles.viewStyle}>
                        <View style={CustomStyles.erpCategory}>
                            <Text style={CustomStyles.headText}>{this.props.label}</Text>
                            <View style={CustomStyles.erpCategoryHeaderItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Date</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Diesel</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Toll</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Maint...</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Miscel..</Text>
                                </View>
                            </View>
                            <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                                data={this.state.expenses}
                                renderItem={({ item }) =>
                                
                                    <View style={CustomStyles.erpCategoryItems}>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{this.getParsedDate(item.date)
                                                                                }</Text>
                                        </View>
                                         <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>item.tripId</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>item.attrs.partyName</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>item.freightAmount</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>'this.getExpenseFromData(item.attrs.expenseName,item.cost)'</Text>
                                        </View> 
                                    </View>
                                }
                                keyExtractor={item => item._id} />
                            <View style={CustomStyles.erpCategoryFooterItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>Total</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalExpenses.totalDieselExpense}</Text>
                                </View><View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalExpenses.totaltollExpense}</Text>
                                </View>
                               <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalExpenses.totalmExpense}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalExpenses.totalmisc}</Text>
                                </View> 
                            </View>
                        </View>
                    </View>
                );
                break;
            case "Payments":
                console.log("Expense", );
                break;
            default:
                text = "I have never heard of that fruit...";
        }
        
    }


}
