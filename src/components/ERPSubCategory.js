//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View,BackHandler, ScrollView, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText } from './common';
import Config from '../config/Config';
import Axios from 'axios';


export default class ERPSubCategory extends Component {
    state = {
        trips: [], 
        expenses:[],
        payementsResults:[],
        totalExpenses:{},
        totalPendingPayments:{},
        totalPayablePayments:{},
        totalRevenue: {
        }
    };
    componentWillMount() {
        const self = this;
        console.log(self.props.navigation.state.params.token);
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: self.props.navigation.state.params.Url
        })
            .then((response) => {              
                if (response.data.status) {
                    if(self.props.navigation.state.params.mode == 'Expense'){
                        self.setState({expenses:response.data.expenses,totalExpenses: response.data.totalExpenses});
                    }else if(self.props.navigation.state.params.mode == 'Revenue'){
                        self.setState({trips:response.data.trips,totalRevenue: response.data.totalRevenue});
                    
                    }else if(self.props.navigation.state.params.mode == 'Payments'){
                        self.setState({payementsResults:response.data.partyData,totalPayablePayments: response.data.grossAmounts});
                    }else if(self.props.navigation.state.params.mode == 'Receivables'){
                        self.setState({payementsResults:response.data.results,totalPendingPayments: response.data.totalPendingPayments});
                    }                       
                } else {
                    console.log(self.props.navigation.state.params.mode,'error in ERP SUB Cat ==>', response);
                }
            }).catch((error) => {
                console.log(self.props.navigation.state.params.mode,'error in ERP SUB Cat ==>', error);
            })
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }
        componentWillUnmount(){
         BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }

        onBackAndroid() {
            // Actions.pop();
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
            totalPendingPayments: {
                totalFreight: 0,
                totalPaid: 0
            },
            totalPayablePayments:{
                totalAmount: 0,
                paidAmount: 0,
                payableAmount: 0
            },
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
        };
    }

    getExpiryDateView() {
        return this.state.expirydetails.map((expirydetail, i) => {

            return <ExpiryDateItems key={i} style={{ flex: 1 }} count={expirydetail.count} label={expirydetail.label} />

        });
    }

    getParsedDate(date){
        var formattedDate = new Date(date);
        return formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getYear().toString();
      }

      getExpenseFromData(expenseType,expenseCost,num){
          var data='';
        if(expenseType == 'Diesel' || expenseType == 'Toll' || expenseType == 'Maintenance' ){
            data = '-';
        }else{
            data = expenseCost;
        }
        return data;        
      }


      getExpenseDieselData(expenseType,expenseCost){
        var data='';
        if(expenseType == 'Diesel'){
            data = expenseCost;
        }else{
            data = '-';
        }
        return data;
        }

    getExpenseTollData(expenseType,expenseCost){
        var data='';
        if(expenseType == 'Toll'){
            data = expenseCost;
        }else{
            data = '-';
        }
        return data;
    }
    getExpenseMaintenanceData(expenseType,expenseCost){
        var data='';
        if(expenseType == 'Maintenance'){
            data = expenseCost;
        }else{
            data = '-';
        }
        return data;
    }

    //item.attrs.truckName
    getTruck(item){
        var data ='-';
        if(item.hasOwnProperty("attrs")){
            data = item.attrs.truckName;
        }else{
            data =  '-';
        }
        return data;
    }

    render() {
        const self=this;
        switch (self.props.navigation.state.params.mode) {
            case "Revenue":
                return (
                    <View style={CustomStyles.viewStyle}>
                        <View style={CustomStyles.erpCategory}>
                            <Text style={CustomStyles.headText}>{this.props.navigation.state.params.label}</Text>
                            <View style={CustomStyles.erpCategoryHeaderItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Date</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Trip ID</Text>
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
                                            <Text style={[CustomStyles.erpText,{fontWeight:'bold'}]}>{item.tripId}</Text>
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
                return (
                    <View style={CustomStyles.viewStyle}>
                        <View style={CustomStyles.erpCategory}>
                            <Text style={CustomStyles.headText}>{this.props.navigation.state.params.label}</Text>
                            <View style={CustomStyles.erpCategoryHeaderItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Date</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpSubCatHeaderText}>Diesel</Text>
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
                                            <Text style={CustomStyles.erpSubCatText}>{this.getExpenseDieselData(item.attrs.expenseName,item.totalAmount)}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{this.getExpenseTollData(item.attrs.expenseName,item.totalAmount)}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{this.getExpenseMaintenanceData(item.attrs.expenseName,item.totalAmount)}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{this.getExpenseFromData(item.attrs.expenseName,item.totalAmount)}</Text>
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
                return (
                    <View style={CustomStyles.viewStyle}>
                        <View style={CustomStyles.erpCategory}>
                            <Text style={CustomStyles.headText}>{this.props.label}</Text>
                            <View style={CustomStyles.erpCategoryHeaderItems}>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={[CustomStyles.erpSubCatHeaderText,{fontSize:13}]}>Date</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={[CustomStyles.erpSubCatHeaderText,{fontSize:13}]}>Expense</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={[CustomStyles.erpSubCatHeaderText,{fontSize:13}]}>Total Amt. </Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={[CustomStyles.erpSubCatHeaderText,{fontSize:13}]}>Paid Amt.</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={[CustomStyles.erpSubCatHeaderText,{fontSize:13}]}>Payable</Text>
                                    </View>
                            </View>
                            <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                                data={this.state.payementsResults}
                                renderItem={({ item }) =>
                                
                                    <View style={CustomStyles.erpCategoryItems}>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{this.getParsedDate(item.date)
                                                                                }</Text>
                                        </View>
                                         <View style={CustomStyles.erpTextView}>
                                            <Text style={[CustomStyles.erpText,{fontWeight:'bold'}]}>{item.expenseType.expenseName}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{item.totalAmount}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{item.paidAmount}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={[CustomStyles.erpSubCatText,{}]}>{item.payableAmount}</Text>
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
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalPayablePayments.totalAmount}</Text>
                                </View>
                               <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalPayablePayments.paidAmount}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalPayablePayments.payableAmount}</Text>
                                </View> 
                            </View>
                        </View>
                    </View>
                );
                break;
            case "Receivables":
                return (
                    <View style={CustomStyles.viewStyle}>
                        <View style={CustomStyles.erpCategory}>
                            <Text style={CustomStyles.headText}>{this.props.navigation.state.params.label}</Text>
                            <View style={CustomStyles.erpCategoryHeaderItems}>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpSubCatHeaderText}>Date</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpSubCatHeaderText}>Trip ID</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpSubCatHeaderText}>V.no</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpSubCatHeaderText}>Freight</Text>
                                    </View>
                                    <View style={CustomStyles.erpTextView}>
                                        <Text style={CustomStyles.erpSubCatHeaderText}>Paid</Text>
                                    </View>
                            </View>
                            <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                                data={this.state.payementsResults}
                                renderItem={({ item }) =>
                                
                                    <View style={CustomStyles.erpCategoryItems}>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{this.getParsedDate(item.date)
                                                                                }</Text>
                                        </View>
                                         <View style={CustomStyles.erpTextView}>
                                            <Text style={[CustomStyles.erpText,{fontWeight:'bold'}]}>{item.tripId}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{this.getTruck(item)}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpSubCatText}>{item.freightAmount}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={[CustomStyles.erpSubCatText,{}]}>{item.amount}</Text>
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
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalPendingPayments.totalFreight}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalPendingPayments.totalPaid}</Text>
                                </View> 
                            </View>
                        </View>
                    </View>
                );
                break;
            default:
                text = "I have never heard of that fruit...";
        }
        
    }


}
