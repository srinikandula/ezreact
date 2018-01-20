
import {Platform,ToastAndroid} from 'react-native';
var Utils = function() {};

Utils.prototype.ShowMessage = function (phoneNumber) {


    return Platform.OS === 'ios' ? 200 : ToastAndroid.show('No Records Found', ToastAndroid.SHORT); ;
};






export default new Utils();