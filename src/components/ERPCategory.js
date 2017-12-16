//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView,ListView,FlatList, Text,AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import {ExpiryDateItems,CustomText} from  './common';
import Config from '../config/Config';
import {Actions,Reducer} from 'react-native-router-flux';
import Axios from 'axios';


export default class ERPCategory extends Component {
    state = {recordsList:[] };
    componentWillMount() {
     console.log(this.props.token,
        this.props.Url,
        this.props.lable);
        Axios({
            method: 'get',
            headers: { 'token': this.props.token },
            url: this.props.Url
        })
            .then((response) => {
                console.log('baskets ==>', response.data);

                if (response.data.status) {
                    this.setState({recordsList:response.data.revenue});
                } else {
                    console.log('error in baskets ==>', response);
                }

            }).catch((error) => {
                console.log('error in baskets ==>', error);
            })
    }

    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: ds.cloneWithRows(['row 1', 'row 2']),
        };
      }

    
   
    

    getExpiryDateView(){
        return this.state.expirydetails.map((expirydetail, i) => {
         
            return   <ExpiryDateItems key={i} style={{flex:1}}  count={expirydetail.count} label={expirydetail.label}  />
            
       });
    }

    callcategoryScreen(data){
        switch(data) {
            case "Revenue":
               console.log("Revenue",data,Config.routes.base + Config.routes.totalRevenueByVechicle,);
                break;
            case "Expense":
            console.log("Expense",data);
                break;
            case "Payments":
            console.log("Expense",data);
                break;
            default:
                text = "I have never heard of that fruit...";
        }
    }

    

    render() {
        return (
            <View style={CustomStyles.ViewStyle}>
            <View style={CustomStyles.erpCategory}>
                <Text style={CustomStyles.headText}>{this.props.label}</Text>

                <FlatList data={this.state.recordsList} 
                            renderItem={({item}) => <View key={item.registrationNo} style={CustomStyles.erpCategoryItems}>
                                                    <Text style={CustomStyles.erpText}>{item.totalFreight}</Text>
                                                    <Text style={CustomStyles.erpText}>{item.totalExpense}</Text>
                                                    <Text style={CustomStyles.erpText}>{item.totalRevenue}</Text>
                                                </View>}/>
            </View>
            </View>
        );
    }


}
