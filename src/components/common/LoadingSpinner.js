import React from 'react';
import { View, ActivityIndicator, Dimensions } from 'react-native';

const LoadingSpinner = ({ size }) => {
    return (
        <View style={[styles.loadingWrapper]}>
            <View>
                <ActivityIndicator size={size || 'large'} />
            </View>
        </View>
    );
};

const styles = {
    loadingWrapper:{
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: 'absolute',
        zIndex: 99999,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2
    }
};

export {LoadingSpinner};