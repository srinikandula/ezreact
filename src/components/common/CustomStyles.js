const CustomStyles={
viewStyle: {
    flex: 1,
    backgroundColor: '#ffffff'
},
headingTextColor: {
    fontFamily:'gothamlight',
    color: '#494949'
},
subHeadingTextColor: {
    fontFamily:'gothamlight',
    color: '#404040'
},
amountColor: {
    fontFamily:'gothamlight',
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
    fontFamily:'gothamlight',
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
expirySubContainer:{justifyContent:'space-around',height:60,alignSelf:'stretch',padding:3,borderWidth:0.5,flex:1},
expiryCount:{textAlign:'center',justifyContent:'center',alignItems:'center',alignSelf:'stretch',fontSize:16,color:'blue',flex:1},
expiryLabel:{textAlign:'center',justifyContent:'center',alignItems:'center',alignSelf:'stretch',fontSize:12,flex:1}
};

export default CustomStyles;