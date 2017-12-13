//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';

const category = [
    {
        'name': 'Revenue',
        'subname': 'From all vehicles',
        'amount': 1000000,
        'imagepath': '../images/revenue.png'
    }]

export default class ErpHome extends Component {
    state = { categoryBgColor: false };

    renderCategories() {
        return category.map((category, i) => {
            <View key={i} style={CustomStyles.Category}>
                <Image
                    style={CustomStyles.imageDimensions}
                    resizeMode="contain"
                    source={require('../images/revenue.png')}
                />
                <View style={CustomStyles.textContainer}>
                    <Text style={CustomStyles.headingTextColor}>
                        {category.name}
                    </Text>
                    <Text style={CustomStyles.subHeadingTextColor}>
                        {category.subname}
                    </Text>
                    <Text style={CustomStyles.amountColor}>
                        {category.amount}
                    </Text>
                </View>
            </View>
        });
    }

    render() {
        return (
            <View style={CustomStyles.ViewStyle}>
                <TouchableOpacity
                    onPress={() => { this.setState({ categoryBgColor: !this.state.categoryBgColor }) }}
                >
                    <View style={[CustomStyles.Category, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                        <Image
                            style={CustomStyles.imageDimensions}
                            resizeMode="contain"
                            source={require('../images/revenue.png')}
                        />
                        <View style={CustomStyles.textContainer}>
                            <Text style={CustomStyles.headingTextColor}>
                                Revenue
                        </Text>
                            <Text style={CustomStyles.subHeadingTextColor}>
                                From all vehicles
                        </Text>
                            <Text style={CustomStyles.amountColor}>
                                10000000
                        </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {/* this.renderCategories() */}
                <TouchableOpacity
                    onPress={() => { this.setState({ categoryBgColor: !this.state.categoryBgColor }) }}
                >
                    <View style={[CustomStyles.Category, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                        <Image
                            style={CustomStyles.imageDimensions}
                            resizeMode="contain"
                            source={require('../images/expenses.png')}
                        />
                        <View style={CustomStyles.textContainer}>
                            <Text style={CustomStyles.headingTextColor}>
                                Expenses
                        </Text>
                            <Text style={CustomStyles.subHeadingTextColor}>
                                From all vehicles
                        </Text>
                            <Text style={CustomStyles.amountColor}>
                                2000000
                        </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { this.setState({ categoryBgColor: !this.state.categoryBgColor }) }}
                >
                    <View style={[CustomStyles.Category, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                        <Image
                            style={CustomStyles.imageDimensions}
                            resizeMode="contain"
                            source={require('../images/payments.png')}
                        />
                        <View style={CustomStyles.textContainer}>
                            <Text style={CustomStyles.headingTextColor}>
                            payments
                        </Text>
                            <Text style={CustomStyles.subHeadingTextColor}>
                                From all vehicles
                        </Text>
                            <Text style={CustomStyles.amountColor}>
                               {`payables       ₹2,50,000`}
                        </Text>
                        <Text style={CustomStyles.amountColor}>
                               {`Receivables  ₹1,20,000`}
                        </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { this.setState({ categoryBgColor: !this.state.categoryBgColor }) }}
                >
                    <View style={[CustomStyles.Category, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                        <Image
                            style={CustomStyles.imageDimensions}
                            resizeMode="contain"
                            source={require('../images/expirydetails.png')}
                        />
                        <View style={CustomStyles.textContainer}>
                            <Text style={CustomStyles.headingTextColor}>
                                Expiry Details
                        </Text>
                            <Text style={CustomStyles.subHeadingTextColor}>
                                From all vehicles
                        </Text>
                            <Text style={CustomStyles.amountColor}>
                                1000000
                        </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }


}
