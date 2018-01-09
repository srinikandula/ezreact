import React, { Component } from 'react';
import { View, ScrollView,BackHandler, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText } from './common';
import Config from '../config/Config';
import { Actions, Reducer } from 'react-native-router-flux';
import Axios from 'axios';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';



export default class ExpenseList extends Component {
    state = {
        categoryBgColor: false,token:'',expenses:[]
    };

    componentWillMount() {
        const self = this;
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
                        url: Config.routes.base + Config.routes.ExpensesList
                    })
                        .then((response) => {
                            if (response.data.status) {
                                console.log('ExpenseList ==>', response.data);
                                this.setState({expenses:response.data.expenses})
                            } else {
                                console.log('error in ExpenseList ==>', response);
                                this.setState({ erpDashBroadData: [],expirydetails:[] });
                            }
    
                        }).catch((error) => {
                            console.log('error in ExpenseList ==>', error);
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
        getExpenseName(item){
            var data ='-';
            if(item.hasOwnProperty("attrs")){
                data = item.attrs.expenseName;
            }else{
                data =  '-';
            }
            return data;
        }
        getTruck(item){
            var data ='-';
            if(item.hasOwnProperty("attrs")){
                data = item.attrs.truckName;
            }else{
                data =  '-';
            }
            return data;
        }  


    getParsedDate(date){
        var formattedDate = new Date(date);
        return "Date :  "+formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getYear().toString();
      }

      renderSeparator = () => (
        <View
          style={{
            backgroundColor: '#d6d6d6',
            height: 0.7,
          }}
        />
      );

    render() {
        const self=this;
        return(      
        
                <View style={CustomStyles.viewStyle}>
                    <View style={CustomStyles.erpCategory}>
                       
                        <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                            data={this.state.expenses}
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
                                            <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',textDecorationLine:'underline'}]}>
                                                    {this.getTruck(item)}</Text>                
                                            
                                        </View>
                                        <View style={{flex:1, flexDirection: 'column',padding:10}}>
                                           
                                                <Text style={[CustomStyles.erpText,{fontFamily:'Gotham-Medium',fontSize: 16,}]}>
                                                        {this.getExpenseName(item)}</Text>
                                                <Text style={CustomStyles.erpText}>  {item.description}</Text>
                                           
                                                <Text style={CustomStyles.erpText}>{this.getParsedDate(item.date)}</Text>
                                                <Text style={[CustomStyles.erpText,{color:'#1e4495',fontFamily:'Gotham-Medium',fontSize: 16}]}>Amount : {item.cost}</Text>
                                                
                                        </View>
                                        <View style={[CustomStyles.erpTextView,{flex:0.2,alignItems:'flex-end',borderBottomWidth :0,paddingBottom:5}]}>
                                            <TouchableOpacity onPress={() => 
                                                                    {/* this.callSubCategoryScreen(item.contact) */ }
                                                                }>
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
                        <TouchableOpacity
                                        onPress={() => { this.props.navigation.navigate('AddExpense',{token:this.state.token,edit:false})}}
                                    >
                            <Image source={require('../images/eg_expenes.png')} 
                            style= {CustomStyles.addImage}/>
                            </TouchableOpacity>
                        </View>
                </View>
                
            );           
        }
      
    }
       
