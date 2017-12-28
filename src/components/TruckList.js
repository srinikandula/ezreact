//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView,BackHandler, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText } from './common';
import Config from '../config/Config';
import { Actions, Reducer } from 'react-native-router-flux';
import Axios from 'axios';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';



export default class TruckList extends Component {
    state = {
        categoryBgColor: false,token:'',trucks:[]
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
                                this.setState({trucks:response.data.trucks})
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


    callSubCategoryScreen(truckContactNum){

        RNImmediatePhoneCall.immediatePhoneCall(''+truckContactNum);
        
      /*   const self = this;
        const args = {
            number: ''+truckContactNum, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
          }

         call(args)
         .catch(
             console.error)  
         */
    }


    getcolorDate(item,dateType,typeLabel) {
        var formattedDate = new Date(item);
        //console.log(this.functiona(formattedDate),"difference b/w");
        if (this.functiona(formattedDate) > 15 ) {
            return (
                <Image resizeMode="contain"
                    source={require('../images/green.png')}
                    style={{width:10,height:10,marginTop:5}} />
            );
        } else if(this.functiona(formattedDate) <15 && this.functiona(formattedDate) <10){
            return (
                <Image resizeMode="contain"
                    source={require('../images/orange.png')}
                    style={{width:10,height:10,marginTop:5}} />
                   );
        } else {
            return (
                <Image resizeMode="contain"
                    source={require('../images/red.png')}
                    style={{width:10,height:10,marginTop:5}} />
                   );
        }
    }

    getParsedDate(date){
        var formattedDate = new Date(date);
        return formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getYear().toString();
      }

    functiona(date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;
        var today = new Date();
        // Convert both dates to milliseconds
        var date1_ms = today.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    }

      renderSeparator = () => (
        <View
          style={{
            backgroundColor: '#d6d6d6',
            height: 0,
          }}
        />
      );

    getName(item){
        var data ='-';
        if(item.hasOwnProperty("attrs")){
            data = item.attrs.fullName;
        }else{
            data =  '-';
        }
        return data;
    }

    getmobile(item){
        var data ='-';
        if(item.hasOwnProperty("attrs")){
            data = item.attrs.mobile;
        }else{
            data =  '-';
        }
        return data;
    }

    render() {
        const self=this;
        return(      
        
                <View style={CustomStyles.viewStyle}>
                    <View style={CustomStyles.erpCategory}>
                       
                        <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                            data={this.state.trucks}
                            ItemSeparatorComponent={this.renderSeparator}
                            renderItem={({ item }) =>
                            <TouchableOpacity
                            onPress={() => { this.setState({
                                                categoryBgColor: !this.state.categoryBgColor
                                                 });}}
                            >
                        
                                <View style={[CustomStyles.erpCategoryCardItems,{  backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                    <View style={CustomStyles.erpDriverItems}>
                                        <View style={[CustomStyles.erpTextView,{flex:0.4,borderBottomWidth :0}]}>
                                            <Image resizeMode="contain"
                                                    source={require('../images/truck_icon.png')}
                                                    style={CustomStyles.imageWithoutradiusViewContainer} />    
                                            <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',textDecorationLine:'underline'}]}>
                                                    {item.registrationNo}</Text>
                                            <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',}]}>
                                                    {item.tonnage}k  {item.modelAndYear}</Text>
                                        </View>
                                        <View style={{flex:1, flexDirection: 'column',padding:10}}>
                                            <View style={{ flexDirection: 'row',padding:10}}>
                                                <View style={{flex:1, flexDirection: 'column',padding:10}}>
                                                
                                                        <Text style={[CustomStyles.erpText,{fontFamily:'Gotham-Medium',fontSize: 16,}]}>
                                                                {this.getName(item)}
                                                                </Text>
                                                        <Text style={CustomStyles.erpText}> +
                                                                91 {this.getmobile(item)}
                                                                </Text>
                                                </View>
                                                <View style={[CustomStyles.erpTextView,{flex:0.2,alignItems:'flex-end',borderBottomWidth :0,paddingBottom:5}]}>
                                                    <TouchableOpacity onPress={() => 
                                                                           {Actions.AddTruck({token:this.state.token,id:item._id,edit:true}) }
                                                                        }>
                                                        <Image resizeMode="contain"
                                                                source={require('../images/form_edit.png')} 
                                                                    style={CustomStyles.drivervEditIcons} />    
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => 
                                                                {this.callSubCategoryScreen(item.mobile) }
                                                            }>                
                                                        <Image resizeMode="contain"
                                                                source={require('../images/call_user.png')}
                                                                style={CustomStyles.drivervCallIcons} /> 
                                                </TouchableOpacity>            
                                                </View>
                                            </View>
                                            <View style={{flex:1, flexDirection: 'column',padding:5}}>
                                                <View style={{flex:1, flexDirection: 'row',paddingTop:5}}>
                                                        <View style={{flex:1, flexDirection: 'row',paddingTop:5,paddingLeft:5}}>
                                                            {this.getcolorDate(item.permitExpiry)}
                                                            <Text style={[CustomStyles.erpText,{paddingLeft:2,paddingBottom:2,fontFamily:'Gotham-Medium',fontSize: 10,}]}>
                                                                        Permit 
                                                                </Text>
                                                        </View>        
                                                        <View style={{flex:1, flexDirection: 'row',paddingTop:5,paddingLeft:5}}>
                                                            {this.getcolorDate(item.pollutionExpiry)}
                                                            <Text style={[CustomStyles.erpText,{paddingLeft:2,paddingBottom:2,fontFamily:'Gotham-Medium',fontSize: 10,}]}>
                                                                Pollution
                                                                </Text>
                                                        </View>  
                                                        <View style={{flex:1, flexDirection: 'row',paddingTop:5,paddingLeft:5}}>
                                                            {this.getcolorDate(item.insuranceExpiry)}
                                                            <Text style={[CustomStyles.erpText,{paddingLeft:2,paddingBottom:2,fontFamily:'Gotham-Medium',fontSize: 10,}]}>
                                                                Insurance
                                                                </Text>
                                                        </View>         
                                                </View>
                                                <View style={{flex:1, flexDirection: 'row',paddingTop:5}}>
                                                        <View style={{flex:1, flexDirection: 'row',paddingTop:5,paddingLeft:5}}>
                                                            {this.getcolorDate(item.fitnessExpiry)}
                                                            <Text style={[CustomStyles.erpText,{paddingLeft:2,paddingBottom:2,fontFamily:'Gotham-Medium',fontSize: 10,}]}>
                                                                    Fitness 
                                                                </Text>
                                                        </View>        
                                                        <View style={{flex:1, flexDirection: 'row',paddingTop:5,paddingLeft:5}}>
                                                            {this.getcolorDate(item.taxDueDate)}
                                                            <Text style={[CustomStyles.erpText,{paddingLeft:2,paddingBottom:2,fontFamily:'Gotham-Medium',fontSize: 10,}]}>
                                                                Tax
                                                                </Text>
                                                        </View>  
                                                        
                                                </View>
                                            </View>
                                        </View>                        
                                    </View>
                                </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item._id} />
                        
                    </View>
                        <View style={CustomStyles.addGroupImageStyle}>
                            <TouchableOpacity
                                    onPress={() => { Actions.AddTruck({token:this.state.token,edit:false})}}
                                >
                                    <Image source={require('../images/eg_truck.png')} 
                                    style= {CustomStyles.addImage}/>
                            </TouchableOpacity>
                        </View>
                </View>
                
            );           
        }
      
    }
       
