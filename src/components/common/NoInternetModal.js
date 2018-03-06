import React,{Component} from 'react';
import {StyleSheet,Text,View, Image,TextInput,Button,TouchableOpacity,Platform,DatePickerAndroid,Modal,Dimensions} from 'react-native';

const NoInternetModal =({visible})=>{
    const { containerStyle, textStyle, cardSectionStyle, viewContainerStyle } = styles;
  
    return ( 
    <Modal
        transparent={true}
        animationType={'slide'}
        visible={visible}
        onRequestClose={ () => {} }>  
        <View style={containerStyle}>
            <View style={[viewContainerStyle,cardSectionStyle,{backgroundColor:'#ffffff'}]}>
                <View style={[viewContainerStyle,cardSectionStyle,{backgroundColor:'#ffffff',borderBottomWidth: 0,borderBottomColor: 'black',alignItems:'center'}]}>
                    <Image style={{ width: 50, height: 60, resizeMode: 'contain',marginTop:15 }}
                            source={require('../../images/no_internet.png')} />
                    
                    <Text style={{color:'red',fontWeight:'bold',marginBottom:25,fontSize:15,alignContent:'center'}}>
                            OH NO !</Text>
                </View>
           
            <View style={{borderBottomWidth: 0,borderBottomColor: 'black',margin:10,flexDirection:'column',
                borderColor: '#000', alignItems:'center'}}>                
                    <Text style={{fontSize:15,marginTop:15}}>SLOW OR NO </Text>
                    <Text style={{fontSize:15,marginBottom:15}}>NETWORK CONNECTION </Text>
                   
            </View> 
            </View>
        </View>
    </Modal>
    );
};
    const styles = {
        cardSectionStyle: {
            justifyContent: 'center',
            flexDirection:'column'
        },
        textStyle: {
            flex: 1,
            color: '#fff',
            fontSize: 18,
            textAlign: 'center',
            lineHeight: 35
        },
        containerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            position: 'relative',
            flex: 1,
            justifyContent: 'center',
            padding: 20
        },
        viewContainerStyle: {
            padding: 5,
            backgroundColor: '#ffffff',
            justifyContent: 'flex-end',
            flexDirection: 'column',
    
            position: 'relative'
        }
    };
export { NoInternetModal };
