//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView,Animated,StyleSheet,BackHandler,Dimensions, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CheckBox from 'react-native-checkbox';
import MapView, { Marker } from 'react-native-maps';
const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class GPSTruckList extends Component {
    state = {
        categoryBgColor: false,token:'',trucks:[],
        aspectRatio :0,
        latitudeDelta : 1,
        longitudeDelta : 1,        
        latitude: 78.3100319,
        longitude: 17.46247,
        animation : new Animated.Value(0),
        markers:[{coordinate:{latitude:0,
            longitude:0}}],
            view:'listshow'
    };

    componentWillMount() {

        const self = this;
        console.log(self.props,"token");
        this.getCredentailsData();
        navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log("wokeeey");
              console.log(position);
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
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
                                var catgryarr = response.data.trucks;                    
                                catgryarr = catgryarr.filter(function(item) {
                                        if(item.hasOwnProperty('attrs'))
                                        return item;
                                    });
                                this.setState({trucks:catgryarr});
                                console.log(catgryarr,'catgryarr0');
                                var catgryarr1 = [];                    
                                 for (let index = 0; index < 5; index++) {
                                     const element = catgryarr[index].attrs.latestLocation.location.coordinates;
                                    // console.log(element,'attrs.latestLocation.location.coordinates',element[0],element[1]);
                                    //latitude:0,longitude:0
                                    var obj = {coordinate:{latitude:element[1],longitude:element[0],image:'https://i.imgur.com/sNam9iJ.jpg'}};
                                     catgryarr1.push(obj);
                                     this.setState({latitude:element[1],longitude:element[0]});
                                     this.setState({markers:catgryarr1},()=>{console.log(this.state.markers,'markers');});
                                 }
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

    

    getParsedDate(date){
        var formattedDate = new Date(date);
        return formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getYear().toString() +"  "+ formattedDate.getHours() +' : '+ formattedDate.getMinutes();
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
    lookingForLoad(){
        this.setState({ rememberme: !this.state.rememberme });
    }


    getView(){
        switch (this.state.view) {
            case 'mapShow':
            console.log(this.state.markers.length,'--99999--','item');
                return(
                    <View style ={CustomStyles.mapcontainer}>
                        <MapView
                        style={CustomStyles.map}
                        maxZoomLevel={7}
                        initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.021,
                        longitudeDelta: 0.021,
                       
                        }}
                    >
                        {this.state.markers.map((marker, index) => {
                        return (
                        <MapView.Marker key={index} coordinate={marker.coordinate}>
                            <Animated.View style={[styles.markerWrap]}>
                            <Animated.View style={[styles.ring]} />
                            <View style={styles.marker} />
                            </Animated.View>
                        </MapView.Marker>
                        );
                    })}
                        </MapView>
                  </View>
                );
                break;
                case 'listshow':
                   return( <FlatList style={{ alignSelf: 'stretch', flex: 1,display:this.state.listshow }}
                    data={this.state.trucks}
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({ item }) =>                      
                        <View style={[CustomStyles.erpCategoryCardItems,{  backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                            <View style={CustomStyles.erpDriverItems}>
                                <View style={[CustomStyles.erpTextView,{flex:0.4,borderBottomWidth :0}]}>
                                    <Image resizeMode="contain"
                                            source={require('../images/truck_icon.png')}
                                            style={CustomStyles.imageWithoutradiusViewContainer} />    
                                    <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',textDecorationLine:'underline'}]}>
                                            {item.registrationNo}</Text>
                                            <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',fontSize:12}]}>
                                                {this.getParsedDate(item.updatedAt)}</Text>
                                            
                                </View>
                                <View style={{flex:1, flexDirection: 'column',padding:10}}>
                                    <View style={{ flexDirection: 'row',padding:10}}>
                                        <View style={{flex:1, flexDirection: 'column',padding:10}}>
                                            <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',}]}>
                                                Device ID {item.deviceId}</Text>
                                            <CheckBox
                                                label='Looking For '
                                                color={'#000000'}
                                                checked={this.state.rememberme}
                                                onChange={() => this.lookingForLoad()}
                                            />    
                                        </View>
                                        
                                    </View>
                                    
                                </View>                        
                            </View>
                        </View>
                    }
                keyExtractor={item => item._id} /> );
                break;
            default:
                break;
        }
    }

    render() {
        const self=this;
        const { region } = this.props; 
        const {width, height} = Dimensions.get('window');
         
        return(
                <View style={CustomStyles.viewStyle}>
                    <View style={CustomStyles.erpCategory}>
                        <View style={{ flexDirection: 'row',paddingTop:5,position:'absolute',
                        top:5,
                        right:10,
                        zIndex: 1}}>
                            <View style={{alignSelf:'stretch', flexDirection: 'row',alignItems:'center' ,paddingTop:5,paddingLeft:5}}>
                                <TouchableOpacity onPress={() => {  this.setState({ view: 'listshow'});}}>
                                        <Text style={[CustomStyles.erpText,{margin:5,fontFamily:'Gotham-Medium',fontSize: 16,backgroundColor:'#1e4495'}]}>
                                                ListView 
                                        </Text>
                                </TouchableOpacity>
                            </View>        
                            <View style={{flexDirection: 'row',paddingTop:5,paddingLeft:5}}>
                                <TouchableOpacity onPress={() => { this.setState({ view:'mapShow'});}}>
                                    <Text style={[CustomStyles.erpText,{margin:5,fontFamily:'Gotham-Medium',fontSize: 16,backgroundColor:'#1e4495'}]}>
                                        Map View
                                        </Text>
                                </TouchableOpacity>
                            </View>                                                          
                            </View>
                            {self.getView()}
                            
                             
                                 
                        </View>
                        
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