import React,{Component} from 'react';
import {StyleSheet,Text,View, Image,TextInput,Button,TouchableOpacity,Platform,DatePickerAndroid,Modal,Dimensions} from 'react-native';

const TrackModal =({visible, onAccept, onDecline,onPickFromdate,onPickTodate,cancel,frmDate,toDate})=>{
    const { containerStyle, textStyle, cardSectionStyle, viewContainerStyle } = styles;
  
    return ( 
    <Modal
        transparent={true}
        animationType={'slide'}
        visible={visible}
        onRequestClose={ () => {} }>  
        <View style={containerStyle}>
            <View style={[viewContainerStyle,cardSectionStyle,{backgroundColor:'#ffffff'}]}>
                <View style={[viewContainerStyle,cardSectionStyle,{backgroundColor:'#ffffff',borderBottomWidth: 1,borderBottomColor: 'black',alignItems:'center'}]}>
                    <Text style={{color:'#3b3b3b',fontWeight:'bold',margin:15,fontSize:15,alignContent:'center'}}>
                            Track Location</Text>
                </View>
            <TouchableOpacity style={{flexDirection:'row',justifyContent: 'space-between',borderBottomWidth: 1,
                        borderBottomColor: 'black',marginLeft:10,marginRight:10}} 
                    onPress={onPickFromdate} >
            {/* <View style={{borderBottomWidth: 1,borderBottomColor: 'black',margin:10,flexDirection:'row',
                borderColor: '#000', alignContent:'space-between'}}> */}
                
                    <Text style={{fontSize:15,margin:15}}>{frmDate}</Text>
                    <Image style={{ width: 25, height: 20, resizeMode: 'contain',margin:15 }}
                            source={require('../../images/erp_date.png')} />
            {/* </View> */}
            </TouchableOpacity>   
           
            <TouchableOpacity style={{flexDirection:'row',justifyContent: 'space-between',borderBottomWidth: 1,
            borderBottomColor: 'black',marginLeft:10,marginRight:10}} 
                onPress={onPickTodate} >
                <Text style={{fontSize:15,margin:15}}>{toDate}</Text>
                <Image style={{ width: 25, height: 20, resizeMode: 'contain',margin:15 }}
                            source={require('../../images/erp_date.png')} />
            </TouchableOpacity>      
          

                <View style={{flexDirection:'row',justifyContent:'flex-end',margin:20}}>
                    <TouchableOpacity style={{margin:2,width:110,backgroundColor:'#454545',borderRadius:8,alignItems:'center'}}  onPress={onDecline} >
                        <Text style={{fontSize:15,margin:15,color:'white'}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{margin:2,width:110,backgroundColor:'#454545',borderRadius:8,alignItems:'center'}}  onPress={ onAccept } >
                        <Text style={{fontSize:15,margin:15,color:'white'}}>Track</Text>
                    </TouchableOpacity>
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
export { TrackModal };
