//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView,BackHandler, ListView, FlatList, Text, AsyncStorage,Platform,NetInfo, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText,CustomEditText } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { NoInternetModal } from './common';


export default class PartyList extends Component {
    state = {
        categoryBgColor: false,token:'',parties:[],dummyparties:[],partyName:'',netFlaf:false
    };

    componentWillMount() {
        const self = this;
        console.log(self.props,"token");
        
        this.connectionInfo();
       
    }

    async connectionInfo() {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) { 
                this.setState({netFlaf:false});
                    this.getCredentailsData();
             }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected',isConnected);
                if (isConnected) {
                    this.setState({netFlaf:false});
                    this.getCredentailsData();
                } else {
                return this.setState({netFlaf:true});
            }
        });
        }
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
                    url: Config.routes.base + Config.routes.partyList
                })
                    .then((response) => {
                        if (response.data.status) {
                            console.log('PartyList ==>', response.data);
                            this.setState({parties:response.data.parties,dummyparties:response.data.parties})
                        } else {
                            console.log('error in PartyList ==>', response);
                            this.setState({ erpDashBroadData: [],expirydetails:[] });
                        }

                    }).catch((error) => {
                        console.log('error in PartyList ==>', error);
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
    }


    getParsedDate(date){
        var formattedDate = new Date(date);
        return "Licence Valid till  "+ formattedDate.getDate().toString() + "/" + (formattedDate.getMonth()+1) + "/" + formattedDate.getFullYear().toString();
    }

    renderSeparator = () => (
    <View
        style={{
        backgroundColor: '#d6d6d6',
        height: 0.7,
        }}
    />
    );


    getTripLanes(arrLanes){
        return arrLanes.map((party, i) => {
                if(party.name)
                    return ( <Text style={[CustomStyles.erpText,{fontFamily:'Gotham-Medium',color:'#1e4495',fontWeight:'bold',flex:1}]}
                        key={i}> {party.name} </Text>);
        });
    }

    refreshFunction = (nextProps) => {
        if(nextProps.refresh){
            console.log('hurra=refresh',nextProps.refresh);
            this.getCredentailsData();
        }
    }

    showResult(){
        if(this.state.parties.length == 0)
         return 'No Party Found';
    }

    FilterList(truck){
        const GetJsonArr = this.state.dummyparties;
        let text = truck.toLowerCase();
        this.setState({partyName:truck});
        if(text.length != 0){
            let catgryarr = [];
             catgryarr = GetJsonArr.filter((item) =>{
                if(item.name.toLowerCase().match(text))
                {
                    return item;
                }
              });
              if(catgryarr.length > 0){
                this.setState({parties:catgryarr})
              }else{
                this.setState({parties:[]});
              }
        }else{
            this.setState({parties:this.state.dummyparties});
        }
    }

    render() {
        const self=this;
        return(      
        
                <View style={CustomStyles.viewStyle}>
                    <View style={CustomStyles.erpCategory}>
                        <View style={{alignSelf:'stretch'}}>
                                <CustomEditText underlineColorAndroid='transparent' 
                                        placeholder={'Enter Party Name'}
                                        value={this.state.partyName}
                                        inputTextStyle={{ alignSelf:'stretch',marginHorizontal: 16,borderBottomWidth:1,borderColor:'#727272' }}
                                        onChangeText={(truckNumber) => { this.FilterList(truckNumber) }}
                                />
                        </View>
                        <View style={[{ display: self.state.parties.length === 0 ? 'flex' : 'none' }, CustomStyles.noResultView]}>
                            <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',
                                textDecorationLine:'underline',alignSelf:'stretch',alignItems:'center',}]}>
                                {this.showResult()}</Text>
                        </View>
                        <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                            data={this.state.parties}
                            ItemSeparatorComponent={this.renderSeparator}
                            renderItem={({ item }) =>
                            // <TouchableOpacity
                            // onPress={() => { this.setState({
                            //                     categoryBgColor: !this.state.categoryBgColor
                            //                      });}}
                            // >
                        
                                <View style={[CustomStyles.erpCategoryCardItems,{ backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                    <View style={CustomStyles.erpDriverItems}>
                                        <View style={[CustomStyles.erpTextView,{flex:0.4,borderBottomWidth :0}]}>
                                            <Image resizeMode="contain"
                                                    source={require('../images/truck_icon.png')}
                                                    style={[CustomStyles.imageViewContainer,{borderRadius:0}]} />    
                                            
                                        </View>
                                        <View style={{flex:1, flexDirection: 'column',padding:10}}>
                                           
                                                <Text style={[CustomStyles.erpText,{fontFamily:'Gotham-Medium',fontSize: 16,}]}>{item.name}</Text>
                                                <Text style={CustomStyles.erpText}> +91 {item.contact}</Text>
                                           
                                                <Text style={CustomStyles.erpText}>{item.email}</Text>
                                                {this.getTripLanes(item.tripLanes)}
                                        </View>
                                        <View style={[CustomStyles.erpTextView,{flex:0.2,alignItems:'flex-end',borderBottomWidth :0,paddingBottom:5}]}>
                                            <TouchableOpacity onPress={() => 
                                                                    {this.props.navigation.navigate('AddParty',{token:this.state.token,edit:true,id:item._id,edit:true,refresh: this.refreshFunction})}
                                                                }>
                                                <Image resizeMode="contain"
                                                        source={require('../images/form_edit.png')} 
                                                            style={CustomStyles.drivervEditIcons} />    
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => 
                                                        {this.callSubCategoryScreen(item.contact) }
                                                    }>                
                                                <Image resizeMode="contain"
                                                        source={require('../images/call_user.png')}
                                                        style={CustomStyles.drivervCallIcons} /> 
                                        </TouchableOpacity>            
                                        </View>

                                    </View>
                                </View>
                                // </TouchableOpacity>
                            }
                            keyExtractor={item => item._id} />
                        
                    </View>
                        <View style={CustomStyles.addGroupImageStyle}>
                            <TouchableOpacity
                                        onPress={() => { this.props.navigation.navigate('AddParty',{token:this.state.token, edit: false, refresh: this.refreshFunction})}}
                                    >
                                    <Image source={require('../images/eg_party.png')} 
                                    style= {CustomStyles.addImage}/>
                            </TouchableOpacity>        
                        </View>
                        <NoInternetModal visible={this.state.netFlaf} 
                                            onAccept={() => {this.setState({ netFlaf: false }) }}/>
                </View>
                
            );           
        }
      
    }
       
