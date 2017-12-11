import React, {Component} from 'react';
import {View,Image,Text,ToastAndroid,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {CustomInput,Card,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import {Actions,Reducer} from 'react-native-router-flux';

class GpsSetting extends Component{
     state = {};

    constructor(props) {
        super(props);
        this.state = {
            mstop: ' ',OverSpeed: '',interval:'',stopTime:'', source: '',destination:'', message: '',
            mstoplbl: false,OverSpeedlbl: false,intervallbl:false,stopTimelbl:false, sourcelbl: false,destinationlbl:false
        };
    }


    componentWillMount() {
      // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
       SplashScreen.hide();
       BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }
    componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
     Actions.pop();
    }

        

 render() {
        const {
            viewStyle,
            loginbuttonStyle,
            containerStyle,
            profileImageStyle,
            editProfileImageStyle,
            actionStyle,
            addGroupImageStyle,
            sendTextStyle,
            forgotTextStyle,
            rememberTextStyle,
            inputStyle,
            imageStyle,
            inputContainerStyle,
            text,
            backgroundImage,
            headerStyle,
            checkForgotStyle,
            checkboxStyle
        } = styles;

        const miniStoplabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.mstoplbl ? 16 : 0,
                  fontSize: ! this.state.mstoplbl ? 16 : 14,
                  color: ! this.state.mstoplbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:1,
                  height:30,
                }

        const overSpeedlabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.OverSpeedlbl ? 16 : 0,
                  fontSize: ! this.state.OverSpeedlbl ? 16 : 14,
                  color: ! this.state.OverSpeedlbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }


        const intervallbl= {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.intervallbl ? 16 : 0,
                  fontSize: ! this.state.intervallbl ? 16 : 14,
                  color: ! this.state.intervallbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }
        
        const stoplabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.stopTimelbl ? 16 : 0,
                  fontSize: ! this.state.stopTimelbl ? 16 : 14,
                  color: ! this.state.stopTimelbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }
                
        const sourcelabelStyle = {
            position: 'absolute',
            left: 0,
            fontFamily:'gothamlight',
            top: ! this.state.sourcelbl ? 16 : 0,
            fontSize: ! this.state.sourcelbl ? 16 : 14,
            color: ! this.state.sourcelbl ? '#aaa' : '#000',
            fontFamily:'gothamlight',
            padding:3
        }    
        const destlabelStyle = {
            position: 'absolute',
            left: 0,
            fontFamily:'gothamlight',
            top: ! this.state.destinationlbl ? 16 : 0,
            fontSize: ! this.state.destinationlbl ? 16 : 14,
            color: ! this.state.destinationlbl ? '#aaa' : '#000',
            fontFamily:'gothamlight',
            padding:3
        }        
        


        return (
            <View style={viewStyle}>            
                
                    <ScrollView style={{alignSelf:'stretch',flex:1,marginBottom:10}}>
                    <View style={containerStyle}>                        
                       <Card>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', paddingTop:3,marginTop:5}}>
                                <Text style={miniStoplabelStyle} >
                                        Minimum stop duration
                                </Text>
                                <CustomEditText
                                    keyboardType='numeric'                                    
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.mstop}
                                    onChangeText={(value) => {
                                        this.setState({mstop: value,mstoplbl:true})
                                    }}
                                />
                            </View>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={overSpeedlabelStyle} >
                                        OverSpeed Limit Km ph
                                </Text>
                            
                                <CustomEditText
                                    maxLength={Config.limiters.mobileLength}
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.OverSpeed}
                                    onChangeText={(value) => {
                                        this.setState({OverSpeed: value,OverSpeedlbl:true})
                                    }}
                                />
                            </View>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={intervallbl} >
                                        Route Notification interval
                                </Text>
                            
                                <CustomEditText
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.interval}
                                    onChangeText={(value) => {
                                        this.setState({interval: value,intervallbl:true})
                                    }}
                                />
                            </View>
        
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                               <Text style={stoplabelStyle} >
                                    Stop Alert Time
                                </Text>                     
                                <CustomEditText
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.stopTime}
                                    onChangeText={(value) => {
                                        this.setState({stopTime: value,stopTimelbl:true})
                                    }}
                                />
                            </View>
                       </Card>

                       <Card>
                           <View >
                                <Text style={text}>
                                   Set operating Routes
                                </Text>
                            </View>
                            
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={sourcelabelStyle} >
                                       Source
                                </Text>
                                <CustomEditText
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.source}
                                    onChangeText={(value) => {
                                        this.setState({source: value,sourcelbl:true})
                                    }}
                                />
                            </View>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={destlabelStyle} >
                                    Destination
                                </Text>
                            
                                <CustomEditText
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.destination}
                                    onChangeText={(value) => {
                                        this.setState({destination: value,destinationlbl:true})
                                    }}
                                />
                            </View>

                            <View style={checkForgotStyle}>

                                     <TouchableOpacity style={actionStyle} >
                                        <CustomText customTextStyle={sendTextStyle}>
                                            Clear
                                        </CustomText>   
                                     </TouchableOpacity>
                                    <TouchableOpacity style={actionStyle} >
                                        <CustomText customTextStyle={sendTextStyle}>
                                            Submit
                                        </CustomText>   
                                     </TouchableOpacity>
                                   
                            </View>
                       </Card>


                    </View>
               </ScrollView>
                
                    
             </View>   
        );
    }
}
const winW = Dimensions.get('window').width;
const winH = Dimensions.get('window').width;
const styles = {
    circle: {
        width: 60,
        height: 60,
        borderRadius: 100/2,
        backgroundColor:'#e22b0b',
        paddingLeft:15,
        justifyContent:'center',
    },
    backgroundImage: {
         width:20,
         height:30,
         resizeMode: 'contain'
    },
    viewStyle: {
        flex:1,
        justifyContent: 'flex-start',
        flexDirection:'column',
        alignItems:'center',
        paddingBottom:10
        
    },
    containerStyle: {
        flex: 1,
        alignSelf:'stretch',
        backgroundColor: 'transparent',
        alignItems:'flex-start',
        marginTop:40,
        marginRight:10,
        marginLeft:10

    },
    profileImageStyle:{
        position:'absolute',
        top:20
    },
    editProfileImageStyle:{
        padding:5,
        borderRadius: 5,
        backgroundColor: '#a7a4a4',
        position:'absolute',
        top:40,
        right:winW-250
    },
    addGroupImageStyle:{
        padding:5,
        backgroundColor: 'transparent',
        position:'absolute',
        bottom:70,
        right:20,
        zIndex: 1 
    },
    inputContainerStyle:{
        margiTop:10,
        marginBottom:0
    },
    inputStyle: {
        fontFamily:'gothamlight',
        fontSize: 14,
        marginTop:6,
        backgroundColor: 'transparent',
        height:35
    },
    sendTextStyle :{
        fontFamily:'gothamlight',
        textAlign: 'right',
        color: '#ffffff',
        padding: 5
    },
    signInButtonStyle: {
        alignSelf:'stretch',
        backgroundColor: '#ffffff',
        marginTop:1
    },
    actionStyle:{
        paddingLeft:5,
         backgroundColor:'#1e4495'
    },
    forgotTextStyle: {
        fontFamily:'gothamlight',
        textAlign: 'right',
        color: '#1e4495',
        paddingTop: 2
    },
    
    imageStyle: {
        width: 25,
        height: 30
    },
    text: {
        flex:1,
        fontFamily:'gothamlight',
        color: '#000000',
        fontSize: 18,
        paddingLeft:10
    },
    rememberTextStyle:{
        textAlign: 'center',
        color: '#3B3B3B',
        paddingTop: 2
    },
    headerStyle:{
        alignSelf:'stretch',
        alignItems:'flex-end',
        height:60,
        paddingTop:5,
        paddingRight:10,
        backgroundColor:'#1e4495',
        position:'relative'
    },
    checkForgotStyle:{
        flex: 1,
        alignItems:'flex-end',
        flexDirection: 'row',
        marginTop:10,
        marginBottom:20,
        justifyContent: 'space-around',
       
    },
    checkboxStyle:{
        color:'#000000'
    }  

};

export default GpsSetting;