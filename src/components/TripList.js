import React, { Component } from 'react';
import { View, ScrollView,BackHandler, ListView,NetInfo,FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText,CustomEditText } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { NoInternetModal } from './common';

export default class TripList extends Component {
    state = {
        categoryBgColor: false,token:'',trips:[],dummytrips:[],tripID:'', netFlaf: false
    };

    componentWillMount() {
        const self = this;
        console.log(self.props,"token");
        
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
                        url: Config.routes.base + Config.routes.tripsList
                    })
                        .then((response) => {
                            if (response.data.status) {
                                console.log('trips ==>', response.data);
                                this.setState({trips:response.data.trips,dummytrips:response.data.trips})
                            } else {
                                console.log('error in trips ==>', response);
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
        RNImmediatePhoneCall.immediatePhoneCall(''+truckContactNum);        
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
        return formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getFullYear().toString();
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

    gettruckName(item){
        var data ='-';
        if(item.hasOwnProperty("attrs")){
            data = item.attrs.truckName;
        }else{
            data =  '-';
        }
        return data;
    }  
    getpartyName(item){
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
            data = item.attrs.mobile;
        }else{
            data =  '-';
        }
        return data;
    }

    refreshFunction = (nextProps) => {
        if(nextProps.refresh){
            console.log('hurra=refresh',nextProps.refresh);
            this.getCredentailsData();
        }
    }

    showResult(){
        if(this.state.trips.length == 0)
         return 'No Trip Found';
    }


    FilterList(truck){
        const GetJsonArr = this.state.dummytrips;
        let text = truck.toLowerCase();
        this.setState({tripID:truck});
        if(text.length != 0){
            let catgryarr = [];
             catgryarr = GetJsonArr.filter((item) =>{
                if(item.tripId.toLowerCase().match(text))
                {
                    return item;
                }
              });
              if(catgryarr.length > 0){
                this.setState({trips:catgryarr})
              }else{
                this.setState({trips:[]});
              }
        }else{
            this.setState({trips:this.state.dummytrips});
        }
    }
    render() {
        const self=this;
        return(      
        
                <View style={CustomStyles.viewStyle}>
                    <View style={CustomStyles.erpCategory}>
                    <View style={{alignSelf:'stretch'}}>
                            <CustomEditText underlineColorAndroid='transparent' 
                                    placeholder={'Enter Trip ID'}
                                    value={this.state.tripID}
                                    inputTextStyle={{ alignSelf:'stretch',marginHorizontal: 16,borderBottomWidth:1,borderColor:'#727272' }}
                                    onChangeText={(tripID) => { this.FilterList(tripID) }}
                            />
                        </View>
                        <View style={[{ display: self.state.trips.length === 0 ? 'flex' : 'none' }, CustomStyles.noResultView]}>
                            <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',
                                textDecorationLine:'underline',alignSelf:'stretch',alignItems:'center',}]}>
                                {this.showResult()}</Text>
                        </View>
                        <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                            data={this.state.trips}
                            ItemSeparatorComponent={this.renderSeparator}
                            renderItem={({ item }) =>
                            // <TouchableOpacity
                            // onPress={() => { this.setState({
                            //                     categoryBgColor: !this.state.categoryBgColor
                            //                      });}}
                            // >
                        
                                <View style={[CustomStyles.erpCategoryCardItems,{  backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                    <View style={CustomStyles.erpDriverItems}>
                                        <View style={{flex:1, flexDirection: 'column',padding:3}}>
                                            <View style={{flexDirection: 'row',padding:2}}>
                                                <View style={{flex:1, flexDirection: 'column'}}>
                                                        <Text style={[CustomStyles.erpText,{fontFamily:'Gotham-Medium',fontSize: 15,textDecorationLine:'underline',fontWeight:'bold'}]}>
                                                                {item.tripId} </Text>
                                                        <Text style={[CustomStyles.erpText,{fontFamily:'Gotham-Medium',fontSize: 15,padding:1}]}>
                                                                {this.getpartyName(item)} </Text>
                                                        <Text style={CustomStyles.erpText}> 
                                                                {item.tripLane} </Text>
                                                </View>
                                                <View style={[CustomStyles.erpTextView,{flex:0.2,alignItems:'flex-end',borderBottomWidth :0,paddingBottom:5}]}>
                                                    <TouchableOpacity onPress={() => 
                                                                            {this.props.navigation.navigate('AddTrip',{token:this.state.token,id:item._id,edit:true,refresh: this.refreshFunction}) }
                                                                        }>
                                                        <Image resizeMode="contain"
                                                                source={require('../images/form_edit.png')} 
                                                                    style={CustomStyles.drivervEditIcons} />    
                                                    </TouchableOpacity>
                                                       
                                                </View>
                                            </View>
                                            <View style={{backgroundColor: '#d6d6d6',height: 0.8,}}
                                                />
                                            <View style={{flex:1, flexDirection: 'column'}}>
                                                <View style={CustomStyles.erpCategoryHeaderItems}>
                                                    <View style={[CustomStyles.erpTextView,{borderBottomWidth:0}]}>
                                                        <Text style={[CustomStyles.erpSubCatHeaderText,{fontSize: 11}]}>Date</Text>
                                                    </View>
                                                    <View style={[CustomStyles.erpTextView,{borderBottomWidth:0}]}>
                                                        <Text style={[CustomStyles.erpSubCatHeaderText,{fontSize: 11}]}>V. No</Text>
                                                    </View>
                                                    <View style={[CustomStyles.erpTextView,{borderBottomWidth:0}]}>
                                                        <Text style={[CustomStyles.erpSubCatHeaderText,{fontSize: 11}]}>Rate</Text>
                                                    </View>
                                                    <View style={[CustomStyles.erpTextView,{borderBottomWidth:0}]}>
                                                        <Text style={[CustomStyles.erpSubCatHeaderText,{fontSize: 11}]}>Tonnage</Text>
                                                    </View>
                                                    <View style={[CustomStyles.erpTextView,{borderBottomWidth:0}]}>
                                                        <Text style={[CustomStyles.erpSubCatHeaderText,{fontSize: 11}]}>Freight</Text>
                                                    </View>
                                                </View>
                                                <View style={CustomStyles.erpCategoryItems}>
                                                    <View style={[CustomStyles.erpTextView,{borderBottomWidth:0}]}>
                                                        <Text style={[CustomStyles.erpSubCatText,{fontSize: 10}]}>{this.getParsedDate(item.date)}</Text>
                                                    </View>
                                                    <View style={[CustomStyles.erpTextView,{borderBottomWidth:0}]}>
                                                        <Text style={[CustomStyles.erpSubCatText,{fontSize: 10}]}>{this.gettruckName(item)}</Text>
                                                    </View>
                                                    <View style={[CustomStyles.erpTextView,{borderBottomWidth:0}]}>
                                                        <Text style={[CustomStyles.erpSubCatText,{fontSize: 10}]}>{item.rate}</Text>
                                                    </View>
                                                    <View style={[CustomStyles.erpTextView,{borderBottomWidth:0}]}>
                                                        <Text style={[CustomStyles.erpSubCatText,{fontSize: 10}]}>{item.tonnage}</Text>
                                                    </View>
                                                    <View style={[CustomStyles.erpTextView,{borderBottomWidth:0}]}>
                                                        <Text style={[CustomStyles.erpSubCatText,{fontSize: 10}]}>{item.freightAmount}</Text>
                                                    </View> 
                                                </View>
                                                
                                            </View>
                                        </View>                        
                                    </View>
                                </View>
                                // </TouchableOpacity>
                            }
                            keyExtractor={item => item._id} />
                        
                    </View>
                        <View style={CustomStyles.addGroupImageStyle}>
                            <TouchableOpacity
                                        onPress={() => { this.props.navigation.navigate('AddTrip',{token:this.state.token,edit:false})}}
                                    >
                                <Image source={require('../images/eg_trip.png')} 
                                        style= {CustomStyles.addImage}/>
                            </TouchableOpacity>
                        </View>
                    <NoInternetModal visible={this.state.netFlaf} 
                            onAccept={() => {this.setState({ netFlaf: false }) }}/>
                </View>
                
            );           
        }
      
    }
       
