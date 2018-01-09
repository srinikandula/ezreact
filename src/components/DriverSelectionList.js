//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView,BackHandler, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { DriverSelectionComponent,CustomText } from './common';
import Config from '../config/Config';
import { Actions, Reducer } from 'react-native-router-flux';
import Axios from 'axios';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';



export default class TruckList extends Component {
    state = {
       token:'',drviersList:[],selectionList:[]
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
                        url: Config.routes.base + Config.routes.trucksList
                    })
                        .then((response) => {
                            if (response.data.status) {
                                console.log('trucksList ==>', response.data);
                                var truckArr = response.data.trucks;
                                for (let index = 0; index < truckArr.length; index++) {
                                    truckArr[index].display = 'none';
                                    truckArr[index].selected = false;
                                    
                                }

                                this.setState({drviersList:truckArr})
                            } else {
                                console.log('error in trucksList ==>', response);
                                this.setState({ erpDashBroadData: [],expirydetails:[] });
                            }
    
                        }).catch((error) => {
                            console.log('error in trucksList ==>', error);
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
  
        onClick(data){
            for (var i =0;i< this.state.drviersList.length; i++) {
                if(this.state.drviersList[i].registrationNo === data.registrationNo){
                    
                    if(!this.state.drviersList[i].selected){
                        this.state.drviersList[i].selected = true;
                        this.state.drviersList[i].display = 'flex';
                    }else{
                        this.state.drviersList[i].selected = false;
                        this.state.drviersList[i].display = 'none';
                    }                   
                }                
            }
            this.setState({drviersList:this.state.drviersList,selectionList:[]});
            var tempArray =[];
            for (let index = 0; index < this.state.drviersList.length; index++) {
                const element = this.state.drviersList[index];
                if(element.selected){
                    tempArray.push(element._id);
                }                
            }
            this.setState({selectionList:tempArray});
            console.log(this.state.selectionList,'selectionList list');
         }
        renderItems(){
            return this.state.drviersList.map((data ,i) => 							      
              <DriverSelectionComponent  key={i} onPress={()=>{this.onClick(data)}} showSlected={data.display} 
              data={data.registrationNo}/>							      
                        );
        }
    
        sendData(){  
            console.log(JSON.stringify(this.state.selectionList),"asdasd");
            Actions.pop({ refresh: {selectedList:JSON.stringify(this.state.selectionList) }});
         }

    render() {
        const self=this;
        return(      
        
                <View style={CustomStyles.viewStyle}>
                    <View style={CustomStyles.erpCategory}>
                       <View>
                        <TouchableOpacity
                            style={{ backgroundColor: "#1e4495" }}
                            onPress={() => {this.sendData()}}>
                            <View style={{ alignItems: 'stretch' }}>
                                <Text style={{ color: '#fff', padding: 15, alignSelf: 'center' }}>
                                    Done
                                </Text>
                            </View>
                        </TouchableOpacity>
                      </View>
                    <View style={{flexWrap: 'wrap',flexDirection:'row',margin:5,alignItems:'flex-start'}}>
                        {this.renderItems()}
                    </View> 
                        
                    </View>
                        
                </View>
                
            );           
        }
      
    }
       
