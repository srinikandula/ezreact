import {Platform,ToastAndroid, Alert} from 'react-native';
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



export default new Utils();