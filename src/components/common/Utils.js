import {Platform,ToastAndroid,NetInfo, Alert} from 'react-native';
import AppNavigation from '../../AppNavigation';
var Utils = function() {};

Utils.prototype.ShowMessage = function (message) {
    return Platform.OS === 'ios' ? Alert.alert('', message, [{ text: 'OK', onPress: () => {}}], { cancelable: false }): ToastAndroid.show(message, ToastAndroid.SHORT);
};

Utils.prototype.TokenunAuthorized = function (error){
    const { navigate } = this.props.navigation;
    if (error.response.status === 401) {
        AsyncStorage.clear();// AsyncStorage.clear();
        let LoginInvalid = AppNavigation(false);
        return <LoginInvalid />;
     }
}

Utils.prototype.checkInternetConnection = function () {
    var status = false;
    NetInfo.isConnected.fetch().then(isConnected => {
        console.log('First, is ' + (isConnected ? 'online' : 'offline'));
        if(isConnected === 'online')
          {  
              status = true;
          }
      });
    return status;
};


export default new Utils();