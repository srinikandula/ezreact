import React,{Component} from 'react';
import {StyleSheet,Text,View, Image,TextInput,Button,TouchableOpacity,Platform,DatePickerAndroid,Modal,Dimensions} from 'react-native';

const TrackModal =({visible, onAccept, onDecline,onPickFromdate,onPickTodate,cancel,frmDate,toDate})=>{

  
    return ( 
 
    <Modal
    transparent={true}
    animationType={'slide'}
    visible={visible}
    onRequestClose={ () => {} }>  

        <View style={{height:(Dimensions.get('window').height)/2.3,width:(Dimensions.get('window').width)/1.2,backgroundColor:'white',margin:25}}>
            <View style={{borderBottomWidth:1}}>
                <Text style={{color:'#FFC300',margin:15,fontSize:15}}>Track Location</Text>
            </View>

            <View style={{borderWidth:2,margin:10,flexDirection:'row',}}>
                <TouchableOpacity style={{flexDirection:'row'}} onPress={onPickFromdate} >
                    <Text style={{fontSize:15,margin:15}}>From Date</Text>
                    <TextInput value={frmDate} 
                        underlineColorAndroid='transparent' 
                        editable={false}/>
                </TouchableOpacity>   
            </View>

            <View style={{borderWidth:2,margin:10,flexDirection:'row'}}>
                <TouchableOpacity style={{flexDirection:'row'}} onPress={onPickTodate} >
                <Text style={{fontSize:15,margin:15}}>From Date</Text>
                <TextInput value={toDate} 
                            underlineColorAndroid='transparent' 
                            editable={false}/>
                </TouchableOpacity>      
            </View>

            <View style={{flexDirection:'row',justifyContent:'space-between',margin:20}}>
            <Button color="#FFC300"  onPress={onDecline} title='Cancel'/>
            <Button color="#FFC300"  onPress={ onAccept } title='Track'/>
            </View>
            </View>
    </Modal>
    );

};
export { TrackModal };
