import React, { Component } from 'react';
import { View, ScrollView,BackHandler,Platform, ListView,NetInfo,FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText ,CustomEditText} from './common';
import Config from '../config/Config';
import Axios from 'axios';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { NoInternetModal } from './common';


export default class ExpenseList extends Component {
    state = {
        categoryBgColor: false,token:'',expenses:[],dummyexpenses:[],TruckNum:'', netFlaf: false
    };

    componentWillMount() {
        const self = this;
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
                        url: Config.routes.base + Config.routes.ExpensesList
                    })
                        .then((response) => {
                            if (response.data.status) {
                                console.log('ExpenseList ==>', response.data);
                                this.setState({expenses:response.data.expenses,dummyexpenses:response.data.expenses})
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
                data = item.attrs.truckName ;
            }else{
                data =  '-';
            }
            return data;
        }  

        getExpenseAmount(item){
            var data ='-';
            if(item.mode === 'Credit' || item.mode === 'credit' ){
                data = item.totalAmount;
            }else{
                data = item.cost;
            }
            return data;
        }


    getParsedDate(date){
        var formattedDate = new Date(date);
        return "Date :  "+formattedDate.getDate().toString() + "/" + (formattedDate.getMonth()+1) + "/" + formattedDate.getFullYear().toString();
      }

      renderSeparator = () => (
        <View
          style={{
            backgroundColor: '#d6d6d6',
            height: 0.7,
          }}
        />
      );

      refreshFunction = (nextProps) => {
        if(nextProps.refresh){
            console.log('hurra=refresh',nextProps.refresh);
            this.getCredentailsData();
        }
    }
    
    showResult(){
        if(this.state.expenses.length == 0)
         return 'No Expense Found';
    }

    FilterList(truck){
        const GetJsonArr = this.state.dummyexpenses;
        let text = truck.toLowerCase();
        this.setState({TruckNum:truck});
        if(text.length != 0){
            let catgryarr = [];
             catgryarr = GetJsonArr.filter((item) =>{
                if(this.getTruck(item).toLowerCase().match(text))
                {
                    return item;
                }
              });
              if(catgryarr.length > 0){
                this.setState({expenses:catgryarr})
              }else{
                this.setState({expenses:[]});
              }
        }else{
            this.setState({expenses:this.state.dummyexpenses});
        }
    }

    render() {
        const self=this;
        return(              
                <View style={CustomStyles.viewStyle}>
                    <View style={CustomStyles.erpCategory}>
                        <View style={{alignSelf:'stretch'}}>
                            <CustomEditText underlineColorAndroid='transparent' 
                                    placeholder={'Enter Truck Number'}
                                    value={this.state.TruckNum}
                                    inputTextStyle={{ alignSelf:'stretch',marginHorizontal: 16,borderBottomWidth:1,borderColor:'#727272' }}
                                    onChangeText={(truckNumber) => { this.FilterList(truckNumber) }}
                            />
                        </View>
                        <View style={[{ display: self.state.expenses.length === 0 ? 'flex' : 'none' }, CustomStyles.noResultView]}>
                            <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',
                                textDecorationLine:'underline',alignSelf:'stretch',alignItems:'center',}]}>
                                {this.showResult()}</Text>
                        </View>
                        <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                            data={this.state.expenses}
                            ItemSeparatorComponent={this.renderSeparator}
                            renderItem={({ item }) =>
                            // <TouchableOpacity
                            // onPress={() => { this.setState({
                            //                     categoryBgColor: !this.state.categoryBgColor
                            //                      });}}
                            // >
                        
                                <View style={[CustomStyles.erpCategoryCardItems,{ backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                    <View style={CustomStyles.erpDriverItems}>
                                        <View style={[CustomStyles.erpTextView,{flex:0.6,borderBottomWidth :0}]}>
                                            <Image resizeMode="contain"
                                                    source={require('../images/truck_icon.png')}
                                                    style={[CustomStyles.imageViewContainer,{borderRadius:0}]} />    
                                            <Text style={[CustomStyles.erpText,{
                                                 color:'#1e4495',fontWeight:'bold',textDecorationLine:'underline'}]}>
                                                    {this.getTruck(item)}</Text>                
                                            
                                        </View>
                                        <View style={{flex:1, flexDirection: 'column',padding:10}}>
                                           
                                                <Text style={[CustomStyles.erpText,{fontFamily:'Gotham-Medium',fontSize: 16,}]}>
                                                        {this.getExpenseName(item)}</Text>
                                                <Text style={CustomStyles.erpText}>  {item.description}</Text>
                                           
                                                <Text style={CustomStyles.erpText}>{this.getParsedDate(item.date)}</Text>
                                                <Text style={[CustomStyles.erpText,{color:'#1e4495',fontFamily:'Gotham-Medium',fontSize: 16}]}>
                                                    Mode : {item.mode}
                                                    </Text>
                                                <Text style={[CustomStyles.erpText,{color:'#1e4495',fontFamily:'Gotham-Medium',fontSize: 16}]}>
                                                    Amount : {this.getExpenseAmount(item)}
                                                    </Text>
                                                
                                        </View>
                                        <View style={[CustomStyles.erpTextView,{flex:0.2,alignItems:'flex-end',borderBottomWidth :0,paddingBottom:5}]}>
                                            <TouchableOpacity onPress={() => 
                                                                    {this.props.navigation.navigate('AddExpense',{token:this.state.token,id:item._id,edit:true,refresh: this.refreshFunction}) }
                                                                }>
                                                <Image resizeMode="contain"
                                                        source={require('../images/form_edit.png')} 
                                                            style={CustomStyles.drivervEditIcons} />    
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
                                        onPress={() => { this.props.navigation.navigate('AddExpense',{token:this.state.token,edit:false,refresh: this.refreshFunction})}}
                                    >
                            <Image source={require('../images/eg_expenes.png')} 
                            style= {CustomStyles.addImage}/>
                            </TouchableOpacity>
                        </View>
                    <NoInternetModal visible={this.state.netFlaf} 
                            onAccept={() => {this.setState({ netFlaf: false }) }}/>           
                </View>
                
            );           
        }
      
    }
       
