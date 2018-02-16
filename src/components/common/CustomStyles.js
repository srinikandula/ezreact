
import {StyleSheet} from 'react-native';
const CustomStyles={
    mapcontainer: {
        ...StyleSheet.absoluteFillObject,
        // top:60,
        flex:1,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
        flex:1,
        height: '100%',
        width: '100%',
      },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null
    },
    loginViewStyle: {
        flex:1,
        justifyContent: 'space-between',
        flexDirection:'column',
        alignItems:'center',
        paddingBottom:10 
    },
    logintext: {
        flex:1,
        //fontFamily:'Gotham-Light',
        alignItems:'center',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 32
    },
    loginContainerStyle: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginTop: 60,
        marginBottom: 50,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft:10,
        paddingRight:10,
        justifyContent: 'center',
        alignItems:'flex-start',

    },
    loginInputStyle: {
        // fontFamily:'Gotham-Light',
        fontSize: 16,
        marginTop:3,
        backgroundColor: 'transparent'
    },
    loginlogoStyle:{
        padding:20,
    },
    loginInputbox: {
        flexDirection:'column',
        alignSelf:'stretch',
        alignItems:'flex-start',
        padding:3
    },
    loginForgotTextStyle: {
        // fontFamily:'Gotham-Light',
        textAlign: 'right',
        color: '#1e4495',
        paddingTop: 2
    },
    loginCheckForgotStyle:{
        flex: 1,
        alignSelf:'stretch',
        flexDirection: 'row',
        marginTop:10,
        marginBottom:20,
        justifyContent: 'space-between'
    },
    loginbuttonStyle:{
        alignSelf:'stretch',
        backgroundColor: '#d9d9d9',
    },
   loginInbutton: {
        alignSelf:'stretch',
        backgroundColor: '#ffffff',
        marginTop:1
    }, 
    loginInbuttonText: {
        alignSelf:'stretch',
       textAlign: 'center',
        color: '#e83a13',
        // fontFamily:'Gotham-Light',
       fontSize: 14,
       padding: 10,
       backgroundColor:'#ffffff'
   },   
   //forgotscreen -css
   forgotviewStyle: {
        flex:1,
        alignItems:'stretch',
        justifyContent: 'flex-start',
        flexDirection:'column',
        alignItems:'center',
        paddingBottom:10,
    },
    forgotcontainerStyle: {
        backgroundColor: '#ffffff',
        marginTop: 60,
        marginBottom: 50,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft:10,
        paddingRight:10,
        justifyContent: 'space-around',
        alignItems:'flex-start',
        alignSelf:'stretch'

    },
    forgotInputBox:{flexDirection:'column',alignSelf:'stretch',alignItems:'flex-start',marginTop:20},
    forgotInputStyle: {
        marginTop:3,
        backgroundColor: 'transparent'
    },
    forgotActionView:{
        alignItems:'stretch',
        flexDirection: 'row',
        marginTop:10,
        marginBottom:20,
        alignSelf:'flex-end',
        justifyContent:'space-between'
    },
    forgottext: {
        flex:1,
        // fontFamily:'Gotham-Light',
        alignItems:'center',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 32
    },
    forgotMainContainer:{flex:1,alignSelf:'stretch',justifyContent:'center'},
    forgotcancelTextStyle :{
        // fontFamily:'Gotham-Light',
        textAlign: 'right',
        color: '#1e4495',
        padding: 5
    },
    forgotsendTextStyle :{
        // fontFamily:'Gotham-Light',
        textAlign: 'right',
        color: '#e83a13',
        padding: 5
    },
    forgotActionpadding:{
        paddingLeft:5
    },
    //OTP Verification Screen
    otpViewStyle: {
        flex:1,
        alignItems:'stretch',
        justifyContent: 'center',
        flexDirection:'column',
        alignItems:'center'
    },
    otpMainContainer:{
        flex:1,
        alignSelf:'stretch',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column'
    },
        otpMessagetext: {
        flex:1,
        alignItems:'center',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',//rgba(0,0,0,0)
        //  fontFamily:'Gotham-Light',
        fontSize: 32,
        margin:10
    },    
    otpContainerStyle: {
        backgroundColor: 'white',
        flexDirection:'column',
        marginTop:10,
        marginLeft: 20,
        marginRight: 20,
        paddingTop:10,
        justifyContent: 'flex-start',
        alignItems:'flex-start',
        alignSelf:'stretch'
    },    
    otpInputBox:{
        backgroundColor: 'transparent',
        flexDirection:'column',
        alignSelf:'stretch',
        alignItems:'center',
        justifyContent:'center'
    },
    otpInputStyle: {
        alignSelf:'stretch',
        // fontFamily:'Gotham-Light',
       justifyContent:'center',
       marginTop:3,
       backgroundColor: 'transparent'
   },
   otpButtonStyle: {
       flex:1,
       alignSelf:'stretch',
       backgroundColor: '#ffffff',
       marginTop:1
   },
   otpVerifyTextStyle :{
        alignSelf:'stretch',
        // fontFamily:'Gotham-Light',
        textAlign: 'center',
        color: '#e83a13',
        padding: 5
    },   
//ResetPassword
resetPasswordviewStyle: {
    flex:1,
    alignItems:'stretch',
    justifyContent: 'center',
    flexDirection:'column',
    alignItems:'center',
    paddingBottom:10
},
resetPasswordconatiner:{
    flex:1,
    alignSelf:'stretch',
    alignItems:'center',
    justifyContent:'center'
},    
resetPasswordLabel: {
    flex:1,
    alignItems:'center',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
    //  fontFamily:'Gotham-Light',
    fontSize: 32,
    margin:10
},
resetPasswordSubcontainer: {
        backgroundColor: '#ffffff',
        marginTop:10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft:10,
        paddingRight:10,
        justifyContent: 'center',
        alignItems:'center',
        alignSelf:'stretch'
    },
resetPasswordInputBox:{
    marginTop:10,
    flexDirection:'column',
    alignSelf:'stretch',
    alignItems:'center',
    justifyContent:'center'
},    
resetPasswordinputStyle: {
    // fontFamily:'Gotham-Light',
   justifyContent:'center',
   marginTop:3,
   backgroundColor: 'transparent'
},
resetPasswordActionView:{
    alignItems:'flex-end',
    flexDirection: 'row',
    marginTop:10,
    marginBottom:20,
    alignSelf:'stretch',
    justifyContent:'flex-end'
},
resetPasswordButtonStyle: {
    alignSelf:'stretch',
    backgroundColor: '#ffffff',
    marginTop:1
},
resetPasswordButtonTextStyle :{
    // fontFamily:'Gotham-Light',
   textAlign: 'center',
   color: '#e83a13',
   padding: 5
}, 
//Profile-css
profileviewStyle: {
    flex:1,
    justifyContent: 'flex-start',
    flexDirection:'column',
    alignItems:'center',
    paddingBottom:10
},
profileheaderStyle:{
    alignSelf:'stretch',
    alignItems:'flex-end',
    height:60,
    paddingTop:5,
    paddingRight:10,
    backgroundColor:'#1e4495',
    position:'relative'
},
profileUserImage: {
    width:20,
    height:30,
    resizeMode: 'contain'
},
profileScroll:{
    alignSelf:'stretch',
    flex:1,
    marginBottom:10
},
profileScrollcontainerStyle: {
    flex: 1,
    alignSelf:'stretch',
    backgroundColor: 'transparent',
    alignItems:'flex-start',
    marginTop:40,
    marginRight:10,
    marginLeft:10

},
profileInputBox:{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', paddingTop:3,marginTop:5},
profileInputContainerStyle:{
    marginTop:10,
    marginBottom:0
},
profileInputStyle: {
    // fontFamily:'Gotham-Light',
    fontSize: 14,
    marginTop:6,
    backgroundColor: 'transparent',
    height:35
},
profileaAddGroupImageStyle:{
    padding:5,
    backgroundColor: 'transparent',
    position:'absolute',
    bottom:70,
    right:20,
    zIndex: 1 
},
profileResettext: {
    flex:1,
    // fontFamily:'Gotham-Light',
    color: '#000000',
    fontSize: 18
},
profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 100/2,
    backgroundColor:'#e22b0b',
    paddingLeft:15,
    justifyContent:'center',
},
profileImageStyle:{
    position:'absolute',
    top:20
},
profileViewActionStyle:{
    flex: 1,
    alignSelf:'stretch',
    flexDirection: 'row',
    marginTop:10,
    marginBottom:20,
    justifyContent: 'flex-end',
    marginRight:10
},
profileactionStyle:{
    paddingLeft:5,
     backgroundColor:'#1e4495'
},
profileButtonTextStyle :{
    // fontFamily:'Gotham-Light',
    textAlign: 'right',
    color: '#ffffff',
    padding: 5
},

viewStyle: {
    flex: 1,
    backgroundColor: '#ffffff'
},
headingTextColor: {
    // fontFamily:'Gotham-Light',
    color: '#494949'
},
subHeadingTextColor: {
    // fontFamily:'Gotham-Light',
    color: '#404040'
},
amountColor: {
    // fontFamily:'Gotham-Light',
    color: '#1e4495',
    marginTop: 10
},
textContainer: {
justifyContent: 'center',
paddingLeft: 40
},
Category: {
    flexDirection: 'row',
    //justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff'
},
headingTextColor: {
    alignSelf:'stretch',
    // fontFamily:'Gotham-Light',
    color: '#494949'
},
EtextContainer: {
    alignSelf:'stretch',
    flex:1,
    //justifyContent: 'center',
    paddingLeft: 40
    },
ECategory: {
    
    alignSelf:'stretch',
    flexDirection: 'row',
    //justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: 10,
},
imageDimensions: {
    width: 100,
    height: 100
},
expiryDateView:{flexDirection:'row', justifyContent:'space-around'},
expiryMainContainer:{alignSelf:'stretch',padding:2 },
expirySubContainer:{justifyContent:'space-around',height:60,alignSelf:'stretch',padding:3,borderWidth:1,borderColor: '#ddd' ,flex:1},
expiryCount:{textAlign:'center',justifyContent:'center',alignItems:'center',alignSelf:'stretch',fontSize:16,color:'blue',flex:1},
expiryLabel:{textAlign:'center',justifyContent:'center',alignItems:'center',alignSelf:'stretch',fontSize:12,flex:1},
headText: {
        // fontFamily:'Gotham-Light',
        alignItems:'center',
        color: 'black',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 16
        },
    erpCategory:{
        flex:1,
        alignSelf:'stretch',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 10
        //backgroundColor: '#ff00ff'
    },
    erpCategoryHeaderItems:{
        alignSelf:'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
        //justifyContent: 'flex-start',
       // backgroundColor: '#00ffff'
    },
    erpHeaderText:{
        alignSelf:'stretch',
        fontFamily:'Gotham-Medium',
        alignItems:'center',
        color: '#1e4495',
        fontSize: 16,
        padding:2,
        borderWidth:0,
        borderBottomWidth :0,
        borderBottomColor:'black'
    },

    erpText:{
        alignSelf:'stretch',
        // fontFamily:'Gotham-Light',
        alignItems:'center',
        color: '#727272',
        fontSize: 14,
        padding:2,
        borderWidth:0,
        borderBottomWidth :0,
        borderBottomColor:'black'
    },
    erpTextView:{
        flex:1,
        alignSelf:'stretch',
        //fontFamily:'Gotham-Light',
        alignItems:'center',
        //color: 'black',
        //backgroundColor: 'red',
        //fontSize: 16,
        padding:5,
        borderWidth:0,
        borderBottomWidth :1,
        borderBottomColor:'black'
    },
    erpCategoryItems:{
        flex:1,
        alignSelf:'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
        //justifyContent: 'flex-start',
       // backgroundColor: '#00ffff'
       borderWidth:0,
       borderBottomWidth :0,
       borderBottomColor:'black'
    },

    erpCategoryFooterItems:{
        alignSelf:'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
        bottom:1,
        //justifyContent: 'flex-start',
        backgroundColor: '#5d5d5d'
    },
    erpFooterText:{
        alignSelf:'stretch',
        // fontFamily:'Gotham-Light',
        alignItems:'center',
        color: '#ffffff',
        fontSize: 16,
        padding:2,
        borderWidth:0,
        borderBottomWidth :0,
        //borderBottomColor:'black'
    },

    erpSubCatHeaderText:{
        alignSelf:'stretch',
        fontFamily:'Gotham-Medium',
        alignItems:'center',
        color: '#1e4495',
        fontSize: 15,
        padding:2,
        borderWidth:0,
        borderBottomWidth :0,
        borderBottomColor:'black',
        padding:2
    },
    erpSubCatText:{
        alignSelf:'stretch',
        // fontFamily:'Gotham-Light',
        alignItems:'center',
        color: '#727272',
        fontSize: 14,
        padding:2,
        borderWidth:0,
        borderBottomWidth :0,
        borderBottomColor:'black'
    },
    erpexpiryCategory:{
        //flex:1,
        alignSelf:'stretch',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 10
        //backgroundColor: '#ff00ff'
    },
    epiryButtons: {
    width:100,
    // fontFamily:'Gotham-Light',
    justifyContent:'center',
        alignSelf:'center',
        alignItems:'center',
        textAlign:'center',
        margin:5,
        padding:15,
        color:'black',
        backgroundColor:'#ffffff',
        borderRadius:25,
        borderWidth: 1,
        borderColor: 'black',
        height:45
        },
    epirySelectedButtons: {
        width:100,
        // fontFamily:'Gotham-Light',
        justifyContent:'center',
        alignSelf:'center',
        alignItems:'center',
        textAlign:'center',
        margin:5,
        padding:15,
        color:'white',
        backgroundColor:'#1e4495',
        borderRadius:25,
        borderWidth: 1,
        borderColor: 'transparent',
        height:45
    },    
    separator: {
        height: 0.5,
        width: "80%",
        alignSelf: 'center',
        backgroundColor: "#555"
    },
    erpDriverItems:{
        flex:1,
        alignSelf:'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
        //justifyContent: 'flex-start',
       // backgroundColor: '#00ffff'
       borderWidth:0,
       borderBottomWidth :0,
       borderBottomColor:'black'
    },
    imageViewContainer: {
        width: '40%',
        height: 40 ,
        margin: 5,
        borderRadius : 20
    },
    imageWithoutradiusViewContainer: {
        width: '40%',
        height: 40 ,
        margin: 5,
        borderRadius : 0
    },
    drivervEditIcons:{
        width: 18,
        height: 16 ,
        padding: 5,
        margin: 5,
    },
    drivervCallIcons:{
        width: 30,
        height: 32 ,
        padding: 5,
    },
    separator: {
        flex: 1,
       // height: StyleSheet.hairlineWidth,
        height: 0.6,
        backgroundColor: '#d6d6d6',
      },
      addGroupImageStyle:{
        padding:5,
        backgroundColor: 'transparent',
        position:'absolute',
        bottom:10,
        right:10,
        zIndex: 1 
    },
    addImage:{
        height:60,
        width:60,
        resizeMode: 'contain'
    },
    redcircle: {
        width: 10,
        height:10,
        borderRadius: 100/2,
        backgroundColor: 'red'
    },
    orangecircle: {
        width: 10,
        height: 10,
        borderRadius: 100/2,
        backgroundColor: 'orange'
    },
    greencircle: {
        width: 10,
        height:10,
        borderRadius: 100/2,
        backgroundColor: 'green'
    },
    erpCategoryCardItems:{
        flex:1,
        alignSelf:'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
        //justifyContent: 'flex-start',
       // backgroundColor: '#00ffff'
       borderWidth: 1,
       borderRadius: 2,
       borderColor: '#ddd',
       borderBottomWidth: 0,
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.8,
       shadowRadius: 2,
       elevation: 1,
       margin:5
    },
    globalTabs: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-around'
    },
    homeButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    globalTabsIcon: {
        width: 40,
        height: 40,

    },
    notificationContainer: {
        margin:5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff'
    },
    notificationTextContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-around'
    },
    nTextRowOne: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

viewStyle: {
    flex: 1,
    backgroundColor: '#ffffff'
},
mLt10:{ marginLeft: 10 },
row :{flexDirection:'row'},
mTop10 :{marginTop:10},
mBottom10 :{marginBottom:10},
mBottom2 :{marginBottom:2},
radioStyle: {
        borderWidth:1, 
        borderColor:'#DDD', 
        borderRadius:20,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
radioActiveStyle:{ backgroundColor:'#1e4495', width:15, height:15, borderRadius:12 },
containerStyle: {
    flex: 1,
    alignSelf:'stretch',
    backgroundColor: 'transparent',
    alignItems:'flex-start',
    marginTop:40,
    marginRight:10,
    marginLeft:10

},
toogleStyle: {
    borderWidth:1, 
    borderColor:'#DDD', 
    borderRadius:20,
    justifyContent: 'center',
    alignItems: 'stretch'
},
toggleActiveStyle:{ margin:10,  borderRadius:12 },

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

  mapcard: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: 20,
    width: 20,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
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
  noResultView:{
    alignSelf:'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
    //justifyContent: 'flex-start',
   // backgroundColor: '#00ffff'
   borderWidth:0,
   borderBottomWidth :0,
   borderBottomColor:'black'
},
};

export default CustomStyles;