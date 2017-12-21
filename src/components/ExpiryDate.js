//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView,BackHandler, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText } from './common';
import Config from '../config/Config';
import { Actions, Reducer } from 'react-native-router-flux';
import Axios from 'axios';
const data = [
    {
        selectedItem:true,
      title: "Permit"
    },
    {
        selectedItem:false,
      title: "Tax"
    },
    {
        selectedItem:false,
      title: "Insurance"
    },
    {
        selectedItem:false,
      title: "Pollution"
    },
    {
        selectedItem:false,
      title: "Fittness"
    }
  ];

export default class ExpiryDate extends Component {
    
    state = {
        categoryBgColor: false,
         data : []
    };
    componentWillMount() {
        const self = this;
        self.setState({
            data: data
          });
        
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
        
    }

    getExpiryDateView() {
        return this.state.expirydetails.map((expirydetail, i) => {

            return <ExpiryDateItems key={i} style={{ flex: 1 }} count={expirydetail.count} label={expirydetail.label} />

        });
    }

    callSubCategoryScreen(item){
        for (var i=0; i<this.state.data.length; i++) {
            
            if(this.state.data[i].title ==item.title){
                this.state.data[i].selectedItem = true;
                console.log(item ," ==", this.state.data[i].title );
            }else{
                this.state.data[i].selectedItem = false;
            }
            //a b c
        }
        
    }
    getSelectedITem(Item){
        if(Item.selectedItem){
            console.log('epirySelectedButtons' );
            return (
                    <View style={{height:70,alignItem:'center', flexDirection: 'row',padding:5}}>
                        <Text style={CustomStyles.epirySelectedButtons}>
                            {Item.title}
                        </Text>
                    </View>
                    );
        }else{
            console.log('epiryButtons');
            return(
                    <View style={{height:70,alignItem:'center', flexDirection: 'row',padding:5}}>
                        <Text style={CustomStyles.epiryButtons}>
                            {Item.title}
                        </Text>
                    </View>
                    );
        }

        
    }

    render() {
        console.log(this.state.data);
        const self=this;
        return(
                <View style={CustomStyles.viewStyle}>
                    <View style={CustomStyles.erpCategory}>
                    <FlatList 
                        horizontal={true}
                        data={this.state.data}
                        renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {this.callSubCategoryScreen(item)}}
                                >
                            {this.getSelectedITem(item)}
                            </TouchableOpacity>
                        );
                        }}
                        keyExtractor={(item, index) => index}
                        extraData={this.state}
                    />
                        <Text style={CustomStyles.headText}>{this.props.label}</Text>
                        
                        
                    </View>
                </View>
        );   
    }


}
