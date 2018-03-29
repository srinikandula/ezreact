//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView,Animated,DatePickerAndroid,StyleSheet,Platform,TouchableHighlight,BackHandler,Dimensions, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems,TrackModal, CustomText,CSpinner,CustomEditText, NoInternetModal } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CheckBox from 'react-native-checkbox';
import Utils from './common/Utils';
import MapView, { Marker,Callout } from 'react-native-maps';
const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const ASPECT_RATIO = width / height

const LATITUDE_DELTA = 10
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class GPSTruckMap extends Component {
    state = {
        categoryBgColor: false,token:'',trucks:[],dummytrucks:[],
        showTrack:false,
        showHeader:'none',
        truckNumber:'',
        fromDate:'',
        fromPassdate:'',
        toDate:'',
        toPassdate:'',
        passData:{},
        aspectRatio :0,
        latitudeDelta : LATITUDE_DELTA,
        longitudeDelta :LONGITUDE_DELTA,        
        latitude: Number(17.46247),
        longitude: Number(78.3100319),
        animation : new Animated.Value(0),
        markers:[{coordinate:{latitude:0,
            longitude:0}}],
            view:'no',
        spinnerBool: false,

    };

    componentWillMount() {
        const self = this;
        console.log('this.props gpstractlocation',self.props);
        let currDate = new Date();
        let showHeaderBool = self.props.showHeader;
        if(self.props.showHeader === undefined || self.props.showHeader === 'undefined'){
            showHeaderBool = self.props.navigation.state.params.showHeader;
            console.log(self.props.navigation.state.params.showHeader,"GPSTruckMap-token");            
        }
        console.log(self.props.showHeader,"GPSTruckMap-token");
        this.setState({showHeader: showHeaderBool ? 'flex':'none',fromDate:currDate.toDateString(),toDate:currDate.toDateString(),fromPassdate:currDate.toDateString(),toPassdate:currDate.toDateString()});
        this.getCredentailsData();
        navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setState({
                latitude: Number(position.coords.latitude),
                longitude: Number(position.coords.longitude),
                error: null,
              });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
          );
          
          
    }
        componentWillUnmount(){
         BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }

        onBackAndroid() {
            //Actions.pop();
            //var value = await this.getCache('credientails');
           }

           async getCredentailsData() {
            this.setState({ spinnerBool:true });
            this.getCache((value) => {
                if (value !== null) {
                    var egObj = {};
                    egObj = JSON.parse(value);
                    this.setState({ token: egObj.token });
                    if(Utils.checkInternetConnection())
                    {
                        console.log(Utils.checkInternetConnection(),'network')
                        return (<NoInternetModal visible={true}/>);
                    }

                    Axios({
                        method: 'get',
                        headers: { 'token': egObj.token },
                        url: Config.routes.base + Config.routes.gpsTrackingByMapView
                    })
                        .then((response) => {
                            if (response.data.status) {
                                console.log('GPSTruckMap-trucksList ==>', response.data);
                                if (response.data.data.length == 10) {
                                    this.setState({ spinnerBool: false,view:'no' });
                                } else {
                                    this.setState({ spinnerBool: false,view:'mapShow' });
                                    var catgryarr = response.data.data;
                                    catgryarr = catgryarr.filter(function (item, index) {
                                        if (item.hasOwnProperty('attrs'))
                                            return item;
                                    });
    
                                    this.setState({ trucks: catgryarr });
    
                                    var dump = [];
                                    for (let index = 0; index < catgryarr.length; index++) {
                                        const element = catgryarr[index];
                                        element.rememberme = false;
                                        //console.log(this.state.location[index], 'element.location');
                                        dump.push(element);
                                        this.setState({ trucks: dump,dummytrucks:dump });
                                    }
    
                                    console.log(catgryarr, 'vignesh == ', dump);
                                    var catgryarr1 = [];
                                    for (let index = 0; index < catgryarr.length; index++) {//catgryarr.length
                                        const truckElement = this.state.trucks[index];                                        
                                        if (catgryarr[index].attrs.hasOwnProperty('latestLocation')) {
                                            const element = catgryarr[index].attrs.latestLocation.location.coordinates;
                                             //console.log(element,'attrs.latestLocation.location.coordinates',element[0],element[1]);
                                            //latitude:0,longitude:0
                                            var obj = { coordinate: { latitude: Number(element[1]), longitude: Number(element[0]), image: 'https://i.imgur.com/sNam9iJ.jpg' },
                                                        registrationNo:catgryarr[index].registrationNo,
                                                        speed:catgryarr[index].attrs.latestLocation.speed,
                                                        address:catgryarr[index].attrs.latestLocation.address,
                                                        date:catgryarr[index].attrs.latestLocation.updatedAt,
                                                        isStopped:catgryarr[index].attrs.latestLocation.isStopped,
                                                        isIdle:catgryarr[index].attrs.latestLocation.isIdle};
                                            catgryarr1.push(obj);
                                            truckElement.updatedAt = catgryarr[index].attrs.latestLocation.updatedAt;
                                            truckElement.speed = catgryarr[index].attrs.latestLocation.speed;
                                            this.setState({ latitude: element[1], longitude: element[0] });
                                            this.setState({ markers: catgryarr1 }, () => { console.log(this.state.markers, 'markers'); });
                                        }
                                        this.state.trucks[index] = truckElement;
                                    }
                                }
                                this.setState({ spinnerBool: false,trucks: this.state.trucks});
    
                            } else {
                                console.log('error in trucksList ==>', response);
                                this.setState({ erpDashBroadData: [], expirydetails: [], spinnerBool: false });
                            }
                        }).catch((error) => {
                            console.log('error in trucksList ==>', error);
                            //504
                            if (error.response.status === 504) {
                                Utils.ShowMessage('Something went wrong. Please try later');
                             }
                             this.setState({ spinnerBool: false })
                             
                        })
                } else {
                    this.setState({ spinnerBool: false })
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

    

    getParsedDate(date){
        var formattedDate = new Date(date);
        return formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getFullYear().toString() +" \n "+ formattedDate.getHours() +' : '+ formattedDate.getMinutes();
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

    componentWillReceiveProps(nextProps){
        console.log('nextProps====',nextProps);
    }

    coordinate() {        
        //markers
        return this.state.markers.map((item,index)=>{           
            <Marker
            key={index}
            coordinate = {{
                latitude: item.coordinate.latitude,
                longitude: item.coordinate.longitude
            }}
            />
        });
    }
    lookingForLoad(items){
        var temparr=[];
        for (let index = 0; index < this.state.trucks.length; index++) {
            const element = this.state.trucks[index];
            if(items._id == element._id){
                if(element.rememberme){
                element.rememberme =false;                
               }else{
                element.rememberme =true;    
                }
                this.state.trucks[index] = element;
                this.setState({trucks:this.state.trucks});
                break;
            }
        }
    }
    markerClick(markerData) {
        console.log(markerData,'markerData');
        const data = {truckId:markerData.registrationNo,startDate:this.getDateISo(this.state.fromPassdate),
            endDate:this.getDateISo(this.state.toPassdate)}
        this.setState({passData:data});
        this.ShowModalFunction(!this.state.showTrack);
    }

    getDateISo(dateString) {
        var date = new Date(dateString);
        var passdateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        console.log('passdateStr', passdateStr);
        var passdate = new Date(passdateStr);
        return passdate.toISOString();
    }
    ShowModalFunction(visible) {
        this.setState({ showTrack: visible });
    }

    getSpeed(speed){
        var strSpeed = speed;
        if(strSpeed.length > 4){
            strSpeed = strSpeed.substring(0,5)+"..."
        }
        return strSpeed;
    }

    getAddress(item){
        var data ='-';
        if(item.hasOwnProperty("attrs")){
            if(item.attrs.hasOwnProperty('latestLocation')){
                var address='';
                if(item.attrs.latestLocation.hasOwnProperty('address')){
                    address  = item.attrs.latestLocation.address;
                }
                 if(address.length > 30){
                    address = address.substring(0,30)+"..."
                 }
                data = address;
            }else{
                data = '-'
            }
        }else{
            data =  '-';
        }
        return data;
    }

    //this.getParsedDate(item.updatedAt)
    getupdateDate(item){
        var data ='Date : \n'+'';
        if(item.hasOwnProperty("updatedAt")){
            data = 'Date : \n'+ this.getParsedDate(item.updatedAt);
        }else{
            data =  'Date : \n'+'';
        }
        return data;
    }

    getView(){
        switch (this.state.view) {
            case 'mapShow':
            console.log(this.state.markers.length,'--99999--','item');
                return(
                    <View style ={CustomStyles.mapcontainer}>
                        <MapView
                        style={CustomStyles.map}
                        zoomEnabled ={true}
                        initialRegion={{
                        latitude: Number(this.state.latitude),
                        longitude: Number(this.state.longitude),
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta:LONGITUDE_DELTA,
                       
                        }}
                    >
                        {this.state.markers.map((marker, index) => {
                            var imgsrc = require('../images/truck_running.png');
                            if(marker.isStopped){                                      
                                imgsrc = require('../images/truck_stopped.png');
                            }
                            if(marker.isIdle && !marker.isStopped){
                                imgsrc = require('../images/truck_idle.png');       
                            }

                        return (
                        <MapView.Marker key={index} 
                            image={imgsrc}
                            coordinate={marker.coordinate}
                            >
                            <MapView.Callout  style={CustomStyles.mapcard}
                                 onPress={()=>{this.markerClick(marker)}}>
                                    <View style={CustomStyles.mapContent}>
                                    <Text>{'Reg.No :'}{marker.registrationNo}</Text>
                                    <Text>{'Speed :'}{marker.speed }'-km/hr'</Text>   
                                    <Text>{'Odemeter :'}{'*****km'}</Text>
                                    <Text>{'Date :'}{marker.date}</Text>
                                    <Text>{'Address :'}{marker.address}</Text>                                  
                                    
                                    </View>
                                      <TouchableHighlight style={{alignSelf:'stretch'}}                                         
                                            underlayColor='#dddddd'>
                                          <View style={{alignSelf:'stretch',alignItems:'center',padding:2,borderBottomWidth :0,}}>
                                              <Text>{'Track'}</Text>
                                          </View>
                                      </TouchableHighlight>
                                    </MapView.Callout>
                        </MapView.Marker>
                        );
                    })}
                        </MapView>
                  </View>
                );
                break;
        case 'listshow':
                   return( 
                   <View style={{flex:1,alignSelf:'stretch',flexDirection: 'column',
                   top:50,
                    justifyContent:'space-around'}}>
                     <View style={{alignSelf:'stretch'}}>
                        <CustomEditText underlineColorAndroid='transparent' 
                                placeholder={'Enter Truck Number'}
                                value={this.state.truckNumber}
                                inputTextStyle={{ alignSelf:'stretch',marginHorizontal: 16,borderWidth:1,borderColor:'#3085d6',borderRadius:5 }}
                                onChangeText={(truckNumber) => { this.FilterList(truckNumber) }}
                        />
                    </View>
                   
                   <FlatList style={{ alignSelf: 'stretch', flex: 1,display:'flex' }}
                    data={this.state.trucks}
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({ item }) =>                      
                        <View style={[CustomStyles.erpCategoryCardItems,{flexDirection:'column' }]}>
                            <View style={CustomStyles.erpDriverItems}>
                                
                                <View style={[CustomStyles.erpTextView,{flex:0.4,borderBottomWidth :0}]}>
                                    <Image resizeMode="contain"
                                            source={require('../images/truck_icon.png')}
                                            style={CustomStyles.imageWithoutradiusViewContainer} />
                                </View>
                               
                                <View style={{flex:1, flexDirection: 'column',padding:2 }}>
                                    <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',textDecorationLine:'underline'}]}>
                                            {item.registrationNo}</Text>
                                    <Text style={[CustomStyles.erpText,{color:'#1e4495', fontSize:10}]}>
                                        Location :{this.getAddress(item)}</Text>
                                    
                                </View>                        
                            </View>
                            <View style={{alignSelf:'stretch', flexDirection: 'row',justifyContent:'space-between',padding:2,alignItems:'center' }}>
                                <Text style={[CustomStyles.erpText,{textAlign:'center', color:'#1e4495',fontWeight:'bold',fontSize:12}]}>
                                        {this.getupdateDate(item)}</Text>  
                                <Text style={[CustomStyles.erpText,{textAlign:'center', color:'#1e4495',fontWeight:'bold',fontSize:12}]}>
                                        {'speed \n'+ this.getSpeed(item.speed)}</Text>  
                                <CheckBox style={{width:10,height:10,fontSize:12}}
                                        label='Looking For Load'
                                        color={'#000000'}
                                        checked={item.rememberme}
                                        onChange={() => this.lookingForLoad(item)}
                                    />      

                            </View>
                        </View>
                    }
                keyExtractor={item => item._id} 
                extraData={this.state}/> 
                </View>);
                break;
                

            case 'no':
             return (<Text style={[CustomStyles.erpText,{textAlign:'center', color:'#1e4495',fontWeight:'bold',fontSize:12,top:50}]}>
                No Data Found</Text>);
                break;
            default:
                break;
        }
    }

    FilterList(truck){
        const GetJsonArr = this.state.dummytrucks;
        let text = truck.toLowerCase();
        this.setState({truckNumber:truck});
        if(text.length != 0){
            let catgryarr = [];
             catgryarr = GetJsonArr.filter((item) =>{
                if(item.registrationNo.toLowerCase().match(text))
                {
                    return item;
                }
              });
              if(catgryarr.length > 0){
                this.setState({trucks:catgryarr})
              }else{
                this.setState({trucks:[]});
              }
        }else{
            this.setState({trucks:this.state.dummytrucks});
        }
    }

    onPickdate(category) {
        const self = this;
        if (Platform.OS === 'ios') {
            this.setState({ showModal: !this.state.showModal, str: str, category: category })
        } else {
            try {
                const { action, year, month, day } = DatePickerAndroid.open({

                    //minDate: str == 'min'? new Date() :new Date('1-1-2007'),
                }).then((response) => {
                    if (response.action === "dateSetAction") {
                        var month = response.month + 1
                        let date = response.day + "/" + month + "/" + response.year;
                        switch (category) {
                            case "fromDate":
                                this.setState({ fromDate: date, fromPassdate: month + "/" + response.day + "/" + response.year });
                                return;
                            break;
                            case "toDate":
                                this.setState({ toDate: date, toPassdate: month + "/" + response.day + "/" + response.year });
                                return;
                            break;
                            default:
                            return ;
                            break;
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                });
            } catch ({ code, message }) {
                console.warn('Cannot open date picker', message);
            }
        }
    }

    /*const data = {truckId:markerData.registrationNo,,
    }
    this.setState({passData:data})*/
    moveToTrackScreen(){
        this.ShowModalFunction(!this.state.showTrack);
        const Data = this.state.passData
        Data.startDate = this.getDateISo(this.state.fromPassdate);
        Data.endDate = this.getDateISo(this.state.toPassdate);
        console.log('asd',Data.toString());
        if(this.props.showHeader === undefined || this.props.showHeader === 'undefined'){
            this.props.navigation.state.params.nav.navigation.navigate('GPSTrack',{token:this.state.token,sendingDate:JSON.stringify(Data)})
        }else{
            
            this.props.nav.navigation.navigate('GPSTrack',{token:this.state.token,sendingDate:JSON.stringify(Data)})
        }
    }

    refreshFunction = (nextProps) => {
        if(nextProps.view){
            console.log('hurra=refresh',nextProps.view);
            this.setState({ view: nextProps.view});
        }
    }

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner/>;
        return false;
    }
    render() {
        const self=this;
        const { region } = this.props; 
        const {width, height} = Dimensions.get('window');         
        return(
                <View style={CustomStyles.viewStyle}>
                        <View style={[{ alignSelf:'stretch',flexDirection: 'row',paddingTop:5,position:'absolute',
                            top:0,justifyContent:'space-between',
                            zIndex: 1,backgroundColor:'#1e4495',width:'100%'},{display:self.state.showHeader}]}>
                            
                                <View style={{alignSelf:'stretch',flexDirection:'row', alignItems:'flex-start',margin:5}}>
                                    <TouchableOpacity onPress={() => {this.props.navigation.goBack(null);  }}>
                                        <Image style={{ width: 25, height: 20, resizeMode: 'contain',margin:10,marginHorizontal:5 }}
                                        source={require('../images/back_icon.png')} />                                    
                                    </TouchableOpacity>
                                    <Text style={[CustomStyles.erpText, {color:'white', fontFamily: 'Gotham-Medium', fontSize: 14,margin:10,marginLeft:3 }]}>
                                    All Vehicles Location</Text>
                                </View>
                                

                                <View style={{flexDirection: 'row',alignItems:'flex-end',margin:5}}>
                                    
                                    <TouchableOpacity onPress={() => {  this.setState({ view:'mapShow'});}}>
                                        <Image style={{ width: 26, height: 25, resizeMode: 'contain',margin:10,marginHorizontal:5 }}
                                        source={require('../images/gps_map_lap_icon.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {  
                                        this.setState({ view: 'listshow'});}}>
                                        <Image style={{ width: 26, height: 25, resizeMode: 'contain',margin:10,marginHorizontal:5 }}
                                            source={require('../images/gps_truck_list_icon.png')} />
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('GPSDistReport',{refresh: this.refreshFunction}) }}>
                                        <Image style={{ width: 26, height: 25, resizeMode: 'contain',margin:10,marginHorizontal:5 }}
                                        source={require('../images/gps_truck_reports.png')} />
                                    </TouchableOpacity> */}
                                </View>                                              
                        </View>
                        
                     <View style={CustomStyles.erpCategory}> 
                        <View style={[CustomStyles.noResultView,{alignSelf:'stretch',position:'absolute',top:20,backgroundColor:'transparent'}]}>
                            <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',
                                textDecorationLine:'underline',alignSelf:'stretch',alignItems:'center',}]}>
                                {self.state.trucks.length == 0?'No Trucks Found':''}</Text>
                        </View>
                        {this.spinnerLoad()}
                            {self.getView()}      
                         </View> 
                        <TrackModal 
                            visible={this.state.showTrack}  cancel={'cancel'}
                            onAccept={() => {this.moveToTrackScreen(); }}
                            onDecline={() => { this.ShowModalFunction(!this.state.showTrack) }}
                            onPickFromdate={()=>{this.onPickdate('fromDate') }}
                            onPickTodate={()=>{this.onPickdate('toDate') }}
                            frmDate = {this.state.fromDate}
                            toDate={this.state.toDate} />
                </View>
                
            );           
        }      
    }
       
    const styles = StyleSheet.create({
        container: {
          flex: 1,
        },
        scrollView: {
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          paddingVertical: 10,
        },
        endPadding: {
          paddingRight: width - CARD_WIDTH,
        },
        card: {
          padding: 10,
          elevation: 2,
          backgroundColor: "#FFF",
          marginHorizontal: 10,
          shadowColor: "#000",
          shadowRadius: 5,
          shadowOpacity: 0.3,
          shadowOffset: { x: 2, y: -2 },
          height: CARD_HEIGHT,
          width: CARD_WIDTH,
          overflow: "hidden",
        },
        cardImage: {
          flex: 3,
          width: "100%",
          height: "100%",
          alignSelf: "center",
        },
        textContent: {
          flex: 1,
        },
        cardtitle: {
          fontSize: 12,
          marginTop: 5,
          fontWeight: "bold",
        },
        cardDescription: {
          fontSize: 12,
          color: "#444",
        },
        markerWrap: {
          alignItems: "center",
          justifyContent: "center",
        },
        marker: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "rgba(130,4,150, 0.9)",
        },
        ring: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: "rgba(130,4,150, 0.3)",
          position: "absolute",
          borderWidth: 1,
          borderColor: "rgba(130,4,150, 0.5)",
        },
      });