//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView,BackHandler, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText } from './common';
import Config from '../config/Config';
import { Actions, Reducer } from 'react-native-router-flux';
import Axios from 'axios';
import call from 'react-native-phone-call'


export default class PaymentList extends Component {
    state = {
        categoryBgColor: false,token:'',paymentsList:[]
    };

    componentWillMount() {
        const self = this;
        console.log(self.props,"token");
        this.getCredentailsData();
    }
        componentWillUnmount(){
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
                    this.setState({token:egObj.token});
                    Axios({
                        method: 'get',
                        headers: { 'token': egObj.token },
                        url: Config.routes.base + Config.routes.paymentList
                    })
                        .then((response) => {
                            if (response.data.status) {
                                console.log('driver ==>', response.data);
                                this.setState({paymentsList:response.data.paymentsCosts})
                            } else {
                                console.log('error in driver ==>', response);
                                this.setState({ erpDashBroadData: [],expirydetails:[] });
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


    callSubCategoryScreen(truckContactNum){
        const self = this;
        const args = {
            number: ''+truckContactNum, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
          }

         call(args)
         .catch(
             console.error)  
        
    }


    getParsedDate(date){
        var formattedDate = new Date(date);
        return "Date : "+formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getYear().toString();
      }

      renderSeparator = () => (
        <View
          style={{
            backgroundColor: '#d6d6d6',
            height: 0.7,
          }}
        />
      );

    getName(item){
        var data ='-';
        if(item.hasOwnProperty("attrs")){
            data = item.attrs.partyName;
        }else{
            data =  '-';
        }
        return data;
    }

    getmobile(item){
        var data ='-';
        if(item.hasOwnProperty("attrs")){
            data = item.attrs.partyContact;
        }else{
            data =  '-';
        }
        return data;
    }  


    getTripLanes(arrLanes){
        return arrLanes.map((party, i) => {
                if(party.name)
                    return ( <Text style={[CustomStyles.erpText,{fontFamily:'gothammedium',color:'#1e4495',fontWeight:'bold',flex:1}]}
                        key={i}> {party.name} </Text>);
        });
    }

    render() {
        const self=this;
        return(      
        
                <View style={CustomStyles.viewStyle}>
                    <View style={CustomStyles.erpCategory}>
                       
                        <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                            data={this.state.paymentsList}
                            ItemSeparatorComponent={this.renderSeparator}
                            renderItem={({ item }) =>
                            <TouchableOpacity
                            onPress={() => { this.setState({
                                                categoryBgColor: !this.state.categoryBgColor
                                                 });}}
                            >
                        
                                <View style={[CustomStyles.erpCategoryItems,{ backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                    <View style={CustomStyles.erpDriverItems}>
                                        <View style={[CustomStyles.erpTextView,{flex:0.4,borderBottomWidth :0}]}>
                                            <Image resizeMode="contain"
                                                    source={require('../images/truck_icon.png')}
                                                    style={[CustomStyles.imageViewContainer,{borderRadius:0}]} />    
                                            
                                        </View>
                                        <View style={{flex:1, flexDirection: 'column',padding:10}}>
                                           
                                                <Text style={[CustomStyles.erpText,{fontWeight: 'bold',fontFamily:'gothamBook',fontSize: 16,}]}>
                                                                {this.getName(item)}</Text>
                                                {/* <Text style={CustomStyles.erpText}> +91 {this.getmobile(item)}</Text> */}
                                           
                                                <Text style={CustomStyles.erpText}>{item.description}</Text>
                                                <Text style={CustomStyles.erpText}>{this.getParsedDate(item.date)}</Text>
                                                <Text style={[CustomStyles.erpText,{color:'#1e4495',fontFamily:'gothammedium',fontSize: 16}]}>Amount : {item.amount}</Text>
                                                
                                        </View>
                                        <View style={[CustomStyles.erpTextView,{flex:0.2,alignItems:'flex-end',borderBottomWidth :0,paddingBottom:5}]}>
                                            <TouchableOpacity onPress={() => {}}>
                                                <Image resizeMode="contain"
                                                        source={require('../images/form_edit.png')} 
                                                            style={CustomStyles.drivervEditIcons} />    
                                            </TouchableOpacity>
                                                      
                                        </View>

                                    </View>
                                </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item._id} />
                        
                    </View>
                        <View style={CustomStyles.addGroupImageStyle}>
                            <Image source={require('../images/eg_payments.png')} 
                            style= {CustomStyles.addImage}/>
                        </View>
                </View>
                
            );           
        }
      
    }
       