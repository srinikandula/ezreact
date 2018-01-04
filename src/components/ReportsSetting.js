import React, {Component} from 'react';
import {View,Image,Text,ToastAndroid,TouchableOpacity,ScrollView,Keyboard, FlatList,BackHandler} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {CustomInput,Card,CustomEditText,CustomErpDateView,CustomText} from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import {Actions,Reducer} from 'react-native-router-flux';
import CustomStyles from './common/CustomStyles';

class ReportsSetting extends Component{
     state = {};

    constructor(props) {
        super(props);
        this.state = {
            RData:[{key:'Day'},{key:'Week'},{key:'Month'},{key:'Year'},{key:'Custom'}],
            itemIndex:0
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

    callSubCategoryScreen(item) {
        var data = this.state.RData;
        this.setState({itemIndex:this.state.RData.indexOf(item),RData:data});
    }

    renderItem(item) {
        if (this.state.RData.indexOf(item) == this.state.itemIndex) {
            //console.log('in if', item.title);
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item)}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#e1e1e1'}}/>
                </TouchableOpacity>
            );
        } else {
            //console.log('in else', item.title);
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item)}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'transparent'}}/>
                </TouchableOpacity>
            );
        }
    }
        

 render() {
                    
        return (
            <View style={CustomStyles.viewStyle}>   
                
                    <ScrollView style={{alignSelf:'stretch',flex:1,marginBottom:10}}>
                    <View style={CustomStyles.containerStyle}>                        
                       <Card>                          
                            <View style={{ alignSelf: 'stretch' }}>
                            <Text style={CustomStyles.headText}>{'Revenue'}</Text>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.RData}
                                        renderItem={({item}) => this.renderItem(item)}
                                        keyExtractor={(item, index) => index}
                                        extraData={this.state.RData}
                                        selected={this.state.categoryBgColor}
                                    />
                            </View>       
                        </Card>
                    </View>
               </ScrollView>
                
                    
             </View>   
        );
    }
}


export default ReportsSetting;