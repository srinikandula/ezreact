import React, {Component} from 'react';
import {View,Image,Text,DatePickerAndroid,ToastAndroid,TouchableOpacity,ScrollView,Keyboard, FlatList,BackHandler} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {CustomInput,Card,CustomEditText,CustomErpDateView,CustomText} from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import {Actions,Reducer} from 'react-native-router-flux';
import CustomStyles from './common/CustomStyles';

class ReportsSetting extends Component{
     state = {
                RData:[{key:'Day',selectedItem:false},{key:'Week',selectedItem:false},{key:'Month',selectedItem:false},{key:'Year',selectedItem:false},{key:'Custom',selectedItem:false}],
                itemIndex:1,
                rMaxDate:'',rMaxPassdate:'',rMinDate:'',rMinPassdate:'',rcustomBool:'none',
               
                PData:[{key:'Day',selectedItem:false},{key:'Week',selectedItem:false},{key:'Month',selectedItem:false},{key:'Year',selectedItem:false},{key:'Custom',selectedItem:false}],
                PitemIndex:1,
                pMaxDate:'',pMaxPassdate:'',pMinDate:'',pMinPassdate:'',pcustomBool:'none',
               
                expData:[{key:'Day',selectedItem:false},{key:'Week',selectedItem:false},{key:'Month',selectedItem:false},{key:'Year',selectedItem:false},{key:'Custom',selectedItem:false}],
                expitemIndex:1,
                expMaxDate:'',expMaxPassdate:'',expMinDate:'',expMinPassdate:'',expcustomBool:'none',
               
                tcData:[{key:'Day',selectedItem:false},{key:'Week',selectedItem:false},{key:'Month',selectedItem:false},{key:'Year',selectedItem:false},{key:'Custom',selectedItem:false}],
                tcitemIndex:1,
                tcMaxDate:'',tcMaxPassdate:'',tcMinDate:'',tcMinPassdate:'',tccustomBool:'none',
               
                fcData:[{key:'Day',selectedItem:false},{key:'Week',selectedItem:false},{key:'Month',selectedItem:false},{key:'Year',selectedItem:false},{key:'Custom',selectedItem:false}],
                fcitemIndex:1,
                fcMaxDate:'',fcMaxPassdate:'',fcMinDate:'',fcMinPassdate:'',fccustomBool:'none',
               
                expiryData:[{key:'Day',selectedItem:false},{key:'Week',selectedItem:false},{key:'Month',selectedItem:false},{key:'Year',selectedItem:false},{key:'Custom',selectedItem:false}],
                expiryitemIndex:1,
                expiryMaxDate:'',expiryMaxPassdate:'',expiryMinDate:'',expiryMinPassdate:'',expirycustomBool:'none'
            
            
            };

    


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

    callSubCategoryScreen(item,category) {
        switch(category){
            case "revenue" :
                var display='none';
                if(item.key === 'Custom'){
                    display='flex'
                }
                return this.setState({itemIndex:this.state.RData.indexOf(item),rcustomBool:display},()=> {
                    console.log('itemIndex',this.state.itemIndex,'\n',this.state.RData);                                     
                });
            break;
            case "payment" :
                var display='none';
                if(item.key === 'Custom'){
                    display='flex'
                }
                return this.setState({PitemIndex:this.state.PData.indexOf(item),pcustomBool:display},()=> {
                    console.log('itemIndex',this.state.PitemIndex,'\n',this.state.PData);                                     
                });
            break;
            case "expense" :
                var display='none';
                if(item.key === 'Custom'){
                    display='flex'
                }
                return this.setState({expitemIndex:this.state.expData.indexOf(item),expcustomBool:display},()=> {
                    console.log('expitemIndex',this.state.expitemIndex,'\n',this.state.expData);                                     
                });
            break;
            case "tollcard" :
                var display='none';
                if(item.key === 'Custom'){
                    display='flex'
                }
                return this.setState({tcitemIndex:this.state.tcData.indexOf(item),tccustomBool:display},()=> {
                    console.log('expitemIndex',this.state.tcitemIndex,'\n',this.state.tcData);                                     
                });
            break;
            case "fuelcard" ://fuelcard
                var display='none';
                if(item.key === 'Custom'){
                    display='flex'
                }
                return this.setState({fcitemIndex:this.state.fcData.indexOf(item),fccustomBool:display},()=> {
                    console.log('fuelcarditemIndex',this.state.fcitemIndex,'\n',this.state.fcData);                                     
                });
            break;
            case "expiry" ://fuelcard
            var display='none';
            if(item.key === 'Custom'){
                display='flex'
            }
            return this.setState({expiryitemIndex:this.state.expiryData.indexOf(item),expirycustomBool:display},()=> {
                console.log('expiryitemIndex',this.state.fcitemIndex,'\n',this.state.expiryData);                                     
            });
        break;
        }
        
    }

    renderItem(item) {
        if (this.state.RData.indexOf(item) == this.state.itemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'revenue')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#404040'}}/>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'revenue')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#ffffff'}}/>
                </TouchableOpacity>
            );
        }
    }

    payementRenderItem(item) {
        if (this.state.PData.indexOf(item) == this.state.PitemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'payment')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#404040'}}/>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'payment')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#ffffff'}}/>
                </TouchableOpacity>
            );
        }
    }

    expenseRenderItem(item) {
        if (this.state.expData.indexOf(item) == this.state.expitemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'expense')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#404040'}}/>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'expense')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#ffffff'}}/>
                </TouchableOpacity>
            );
        }
    }

    tollcardRenderItem(item) {
        if (this.state.tcData.indexOf(item) == this.state.tcitemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'tollcard')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#404040'}}/>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'tollcard')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#ffffff'}}/>
                </TouchableOpacity>
            );
        }
    }

    fuelcardRenderItem(item) {
        if (this.state.fcData.indexOf(item) == this.state.fcitemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'fuelcard')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#404040'}}/>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'fuelcard')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#ffffff'}}/>
                </TouchableOpacity>
            );
        }
    }
    //expiryRenderItem
    expiryRenderItem(item) {
        if (this.state.expiryData.indexOf(item) == this.state.expiryitemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'expiry')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#404040'}}/>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item,'expiry')}>
                    <CustomErpDateView name={item.key} setStyle={{backgroundColor:'#ffffff'}}/>
                </TouchableOpacity>
            );
        }
    }

    onPickdate(str,category) {
        const self = this;
        try {
            const { action, year, month, day } = DatePickerAndroid.open({
                        
                        minDate: str == 'min'? new Date() :new Date('1-1-2007'),
                    }).then((response) => {
                if (response.action === "dateSetAction") {
                    var month = response.month + 1
                    let date =  response.day+"/"+month+"/"+ response.year;
                   
                    switch(category){
                        case "revenue" :
                            if(str === 'max'){
                                this.setState({ rMaxDate:date,rMaxPassdate:month+"/"+response.day+"/"+ response.year });
                            }else{
                                this.setState({ rMinDate:date,rMinPassdate:month+"/"+response.day+"/"+ response.year });
                            }
                        return;
                    break;
                    case "payment" :
                        if(str === 'max'){
                            this.setState({ pMaxDate:date,pMaxPassdate:month+"/"+response.day+"/"+ response.year });
                        }else{
                            this.setState({ pMinDate:date,pMinPassdate:month+"/"+response.day+"/"+ response.year });
                        }
                    return;
                    break;
                    case "expense" :
                        if(str === 'max'){
                            this.setState({ expMaxDate:date,expMaxPassdate:month+"/"+response.day+"/"+ response.year });
                        }else{
                            this.setState({ expMinDate:date,expMinPassdate:month+"/"+response.day+"/"+ response.year });
                        }
                    return;
                    break;
                    case "tollcard" :
                        if(str === 'max'){
                            this.setState({ tcMaxDate:date,tcMaxPassdate:month+"/"+response.day+"/"+ response.year });
                        }else{
                            this.setState({ tcMinDate:date,tcMinPassdate:month+"/"+response.day+"/"+ response.year });
                        }
                    return;
                    break;
                    case "fuelcard" :
                        if(str === 'max'){
                            this.setState({ fcMaxDate:date,fcMaxPassdate:month+"/"+response.day+"/"+ response.year });
                        }else{
                            this.setState({ fcMinDate:date,fcMinPassdate:month+"/"+response.day+"/"+ response.year });
                        }
                    return;
                    break;
                    case "expiry" :
                        if(str === 'max'){
                            this.setState({ expiryMaxDate:date,expiryMaxPassdate:month+"/"+response.day+"/"+ response.year });
                        }else{
                            this.setState({ expiryMinDate:date,expiryMinPassdate:month+"/"+response.day+"/"+ response.year });
                        }
                    return;
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


    sendSettingData(category){
        switch(category){
            case "revenue" :
                if(this.state.rMinDate.includes('/')){
                    if(this.state.rMaxDate.includes('/')){
                        if(this.getDaysfunction(new Date(this.state.rMinPassdate),new Date(this.state.rMaxPassdate)) > 0){
                            ToastAndroid.show("Huhrrraaa", ToastAndroid.SHORT);
                        }else{
                            ToastAndroid.show("Please Check Mini./Max. Date", ToastAndroid.SHORT);
                        }
                    }else{
                        ToastAndroid.show("Please Enter Revenue Max. Date", ToastAndroid.SHORT);
                    }
                }else{
                    ToastAndroid.show("Please Enter Revenue Mini. Date", ToastAndroid.SHORT);
                }
            return;
            break;
           case "payment" :
                if(this.state.pMinDate.includes('/')){
                    if(this.state.pMaxDate.includes('/')){
                        if(this.getDaysfunction(new Date(this.state.pMinPassdate),new Date(this.state.pMaxPassdate)) > 0){
                            ToastAndroid.show("Huhrrraaa", ToastAndroid.SHORT);
                        }else{
                            ToastAndroid.show("Please Check Mini./Max. Date", ToastAndroid.SHORT);
                        }
                    }else{
                        ToastAndroid.show("Please Enter Payment Max. Date", ToastAndroid.SHORT);
                    }
                }else{
                    ToastAndroid.show("Please Enter Payment Mini. Date", ToastAndroid.SHORT);
                }
            return;
            break;
            case "expense" :
                if(this.state.expMinDate.includes('/')){
                    if(this.state.expMaxDate.includes('/')){
                        if(this.getDaysfunction(new Date(this.state.expMinPassdate),new Date(this.state.expMaxPassdate)) > 0){
                            ToastAndroid.show("Huhrrraaa", ToastAndroid.SHORT);
                        }else{
                            ToastAndroid.show("Please Check Mini./Max. Date", ToastAndroid.SHORT);
                        }
                    }else{
                        ToastAndroid.show("Please Enter Expense Max. Date", ToastAndroid.SHORT);
                    }
                }else{
                    ToastAndroid.show("Please Enter Expense Mini. Date", ToastAndroid.SHORT);
                }
            return;
            break;
            case "tollcard" :
                if(this.state.tcMinDate.includes('/')){
                    if(this.state.tcMaxDate.includes('/')){
                        if(this.getDaysfunction(new Date(this.state.tcMinPassdate),new Date(this.state.tcMaxPassdate)) > 0){
                            ToastAndroid.show("Huhrrraaa", ToastAndroid.SHORT);
                        }else{
                            ToastAndroid.show("Please Check Mini./Max. Date", ToastAndroid.SHORT);
                        }
                    }else{
                        ToastAndroid.show("Please Enter Toll Card Max. Date", ToastAndroid.SHORT);
                    }
                }else{
                    ToastAndroid.show("Please Enter Toll Card Mini. Date", ToastAndroid.SHORT);
                }
            return;
            break;
            case "fuelcard" :
                if(this.state.fcMinDate.includes('/')){
                    if(this.state.fcMaxDate.includes('/')){
                        if(this.getDaysfunction(new Date(this.state.fcMinPassdate),new Date(this.state.fcMaxPassdate)) > 0){
                            ToastAndroid.show("Huhrrraaa", ToastAndroid.SHORT);
                        }else{
                            ToastAndroid.show("Please Check Mini./Max. Date", ToastAndroid.SHORT);
                        }
                    }else{
                        ToastAndroid.show("Please Enter Fuel Card  Max. Date", ToastAndroid.SHORT);
                    }
                }else{
                    ToastAndroid.show("Please Enter Fuel Card Mini. Date", ToastAndroid.SHORT);
                }
            return;
            break;
            case "expiry" :
                if(this.state.expiryMinDate.includes('/')){
                    if(this.state.expiryMaxDate.includes('/')){
                        if(this.getDaysfunction(new Date(this.state.expiryMinPassdate),new Date(this.state.expiryMaxPassdate)) > 0){
                            ToastAndroid.show("Huhrrraaa", ToastAndroid.SHORT);
                        }else{
                            ToastAndroid.show("Please Check Mini./Max. Date", ToastAndroid.SHORT);
                        }
                    }else{
                        ToastAndroid.show("Please Enter Fuel Card  Max. Date", ToastAndroid.SHORT);
                    }
                }else{
                    ToastAndroid.show("Please Enter Fuel Card Mini. Date", ToastAndroid.SHORT);
                }
            return;
            break;
        }
    }

    getDaysfunction(date1,date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;
        var today = new Date();
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
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
                                        selected={this.state.itemIndex}
                                    />
                                    <View style={{display:this.state.rcustomBool,flex:1,flexDirection:'row',justifyContent: 'flex-end' }}>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('min','revenue') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                        borderWidth: 0,
                                                        borderBottomWidth:1, 
                                                        borderBottomColor:'black', 
                                                        borderColor: '#000',justifyContent: 'flex-end' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end', }}>
                                                        <View style={{ flex: 4, justifyContent: 'flex-end' }}>                                
                                                            
                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }} 
                                                                value={this.state.rMinDate} />
                                                                
                                                        </View>
                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('max','revenue') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                            borderWidth: 0,
                                                            borderBottomWidth:1, 
                                                            borderBottomColor:'black' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end' }}>
                                                        <View style={{ flex: 4 , justifyContent: 'flex-end'}}>                                

                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }}
                                                                value={this.state.rMaxDate} />                                                                
                                                        </View>                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                    </View>
                                    <View style={{flex:2,justifyContent:'flex-end',marginLeft:2}}>
                                        <TouchableOpacity
                                            onPress={() => {this.sendSettingData('revenue') }}>
                                            <View style={{ backgroundColor: "#e83b13"}}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>  
                                </View>  
                            </View>       
                        </Card>
                        {/* //Payment */}
                        <Card>                          
                            <View style={{ alignSelf: 'stretch' }}>
                            <Text style={CustomStyles.headText}>{'Payement'}</Text>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.PData}
                                        renderItem={({item}) => this.payementRenderItem(item)}
                                        keyExtractor={(item, index) => index}
                                        extraData={this.state.PData}
                                        selected={this.state.PitemIndex}
                                    />
                                    <View style={{display:this.state.pcustomBool,flex:1,flexDirection:'row',justifyContent: 'flex-end' }}>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('min','payment') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                        borderWidth: 0,
                                                        borderBottomWidth:1, 
                                                        borderBottomColor:'black', 
                                                        borderColor: '#000',justifyContent: 'flex-end' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end', }}>
                                                        <View style={{ flex: 4, justifyContent: 'flex-end' }}>                                
                                                            
                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }} 
                                                                value={this.state.pMinDate} />
                                                                
                                                        </View>
                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('max','payment') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                            borderWidth: 0,
                                                            borderBottomWidth:1, 
                                                            borderBottomColor:'black' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end' }}>
                                                        <View style={{ flex: 4 , justifyContent: 'flex-end'}}>                                

                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }}
                                                                value={this.state.pMaxDate} />                                                                
                                                        </View>                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                    </View>
                                    <View style={{flex:2,justifyContent:'flex-end',marginLeft:2}}>
                                        <TouchableOpacity
                                            onPress={() => {this.sendSettingData('payment') }}>
                                            <View style={{ backgroundColor: "#e83b13"}}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>  
                                </View>  
                            </View>       
                        </Card>
                        {/* //Expense */}
                        <Card>                          
                            <View style={{ alignSelf: 'stretch' }}>
                            <Text style={CustomStyles.headText}>{'Expense'}</Text>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.expData}
                                        renderItem={({item}) => this.expenseRenderItem(item)}
                                        keyExtractor={(item, index) => index}
                                        extraData={this.state.expData}
                                        selected={this.state.expitemIndex}
                                    />
                                    <View style={{display:this.state.expcustomBool,flex:1,flexDirection:'row',justifyContent: 'flex-end' }}>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('min','expense') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                        borderWidth: 0,
                                                        borderBottomWidth:1, 
                                                        borderBottomColor:'black', 
                                                        borderColor: '#000',justifyContent: 'flex-end' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end', }}>
                                                        <View style={{ flex: 4, justifyContent: 'flex-end' }}>                                
                                                            
                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }} 
                                                                value={this.state.expMinDate} />
                                                                
                                                        </View>
                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('max','expense') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                            borderWidth: 0,
                                                            borderBottomWidth:1, 
                                                            borderBottomColor:'black' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end' }}>
                                                        <View style={{ flex: 4 , justifyContent: 'flex-end'}}>                                

                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }}
                                                                value={this.state.expMaxDate} />                                                                
                                                        </View>                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                    </View>
                                    <View style={{flex:2,justifyContent:'flex-end',marginLeft:2}}>
                                        <TouchableOpacity
                                            onPress={() => {this.sendSettingData('expense') }}>
                                            <View style={{ backgroundColor: "#e83b13"}}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>  
                                </View>  
                            </View>       
                        </Card>

                        {/* //Toll Card */}
                        <Card>                          
                            <View style={{ alignSelf: 'stretch' }}>
                            <Text style={CustomStyles.headText}>{'Toll Card'}</Text>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.tcData}
                                        renderItem={({item}) => this.tollcardRenderItem(item)}
                                        keyExtractor={(item, index) => index}
                                        extraData={this.state.tcData}
                                        selected={this.state.tcitemIndex}
                                    />
                                    <View style={{display:this.state.tccustomBool,flex:1,flexDirection:'row',justifyContent: 'flex-end' }}>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('min','tollcard') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                        borderWidth: 0,
                                                        borderBottomWidth:1, 
                                                        borderBottomColor:'black', 
                                                        borderColor: '#000',justifyContent: 'flex-end' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end', }}>
                                                        <View style={{ flex: 4, justifyContent: 'flex-end' }}>                                
                                                            
                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }} 
                                                                value={this.state.tcMinDate} />
                                                                
                                                        </View>
                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('max','tollcard') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                            borderWidth: 0,
                                                            borderBottomWidth:1, 
                                                            borderBottomColor:'black' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end' }}>
                                                        <View style={{ flex: 4 , justifyContent: 'flex-end'}}>                                

                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }}
                                                                value={this.state.tcMaxDate} />                                                                
                                                        </View>                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                    </View>
                                    <View style={{flex:2,justifyContent:'flex-end',marginLeft:2}}>
                                        <TouchableOpacity
                                            onPress={() => {this.sendSettingData('tollcard') }}>
                                            <View style={{ backgroundColor: "#e83b13"}}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>  
                                </View>  
                            </View>       
                        </Card>

                        {/* //fuel Card */}
                        <Card>                          
                            <View style={{ alignSelf: 'stretch' }}>
                            <Text style={CustomStyles.headText}>{'Fuel Card'}</Text>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.fcData}
                                        renderItem={({item}) => this.fuelcardRenderItem(item)}
                                        keyExtractor={(item, index) => index}
                                        extraData={this.state.fcData}
                                        selected={this.state.fcitemIndex}
                                    />
                                    <View style={{display:this.state.fccustomBool,flex:1,flexDirection:'row',justifyContent: 'flex-end' }}>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('min','fuelcard') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                        borderWidth: 0,
                                                        borderBottomWidth:1, 
                                                        borderBottomColor:'black', 
                                                        borderColor: '#000',justifyContent: 'flex-end' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end', }}>
                                                        <View style={{ flex: 4, justifyContent: 'flex-end' }}>                                
                                                            
                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }} 
                                                                value={this.state.fcMinDate} />
                                                                
                                                        </View>
                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('max','fuelcard') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                            borderWidth: 0,
                                                            borderBottomWidth:1, 
                                                            borderBottomColor:'black' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end' }}>
                                                        <View style={{ flex: 4 , justifyContent: 'flex-end'}}>                                

                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }}
                                                                value={this.state.fcMaxDate} />                                                                
                                                        </View>                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                    </View>
                                    <View style={{flex:2,justifyContent:'flex-end',marginLeft:2}}>
                                        <TouchableOpacity
                                            onPress={() => {this.sendSettingData('fuelcard') }}>
                                            <View style={{ backgroundColor: "#e83b13"}}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>  
                                </View>  
                            </View>       
                        </Card>

                        {/* //expiry Card */}
                        <Card>                          
                            <View style={{ alignSelf: 'stretch' }}>
                            <Text style={CustomStyles.headText}>{'Expiry'}</Text>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.expiryData}
                                        renderItem={({item}) => this.expiryRenderItem(item)}
                                        keyExtractor={(item, index) => index}
                                        extraData={this.state.expiryData}
                                        selected={this.state.expiryitemIndex}
                                    />
                                    <View style={{display:this.state.expirycustomBool,flex:1,flexDirection:'row',justifyContent: 'flex-end' }}>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('min','expiry') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                        borderWidth: 0,
                                                        borderBottomWidth:1, 
                                                        borderBottomColor:'black', 
                                                        borderColor: '#000',justifyContent: 'flex-end' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end', }}>
                                                        <View style={{ flex: 4, justifyContent: 'flex-end' }}>                                
                                                            
                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }} 
                                                                value={this.state.expiryMinDate} />
                                                                
                                                        </View>
                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex:4,justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPickdate('max','expiry') }}
                                            >
                                                <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, 
                                                            borderWidth: 0,
                                                            borderBottomWidth:1, 
                                                            borderBottomColor:'black' }}>
                                                    <View style={{ flexDirection: 'row',justifyContent: 'flex-end' }}>
                                                        <View style={{ flex: 4 , justifyContent: 'flex-end'}}>                                

                                                            <CustomEditText underlineColorAndroid='transparent'
                                                                editable={false} 
                                                                placeholder={'Select Date'}
                                                                inputContainerStyle={{justifyContent:'flex-end', height:30}}
                                                                inputTextStyle={{ fontSize:11,justifyContent:'flex-end',marginHorizontal: 16,lineHeight:5 }}
                                                                value={this.state.expiryMaxDate} />                                                                
                                                        </View>                                                    
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} 
                                                                        source={require('../images/down_arrow.png')} />
                                                        </View>
                                                        
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                    </View>
                                    <View style={{flex:2,justifyContent:'flex-end',marginLeft:2}}>
                                        <TouchableOpacity
                                            onPress={() => {this.sendSettingData('expiry') }}>
                                            <View style={{ backgroundColor: "#e83b13"}}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>  
                                </View>  
                            </View>       
                        </Card>

                    </View>
               </ScrollView>
                
                    
             </View>   
        );
    }
}


export default ReportsSetting;

{/*  <View style={{flex:2,justifyContent:'flex-end',paddingBottom:2}}>
                                        <TouchableOpacity
                                            onPress={() => { alert('max','revenue') }}>
                                            <View style={{ backgroundColor: "transparent",borderWidth: 1,borderColor:'#000000'}}>
                                                <Text style={{ color: '#000', fontSize:10,padding: 5, alignSelf: 'center' }}>
                                                    15 SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>    */}