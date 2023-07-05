import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { Icon, Card } from '@rneui/themed';
import React, { useEffect, useState, useContext } from 'react'
import { globalState } from '../../App';
import TimeLine from './TimeLine';

export default function Payment({ navigation }){

    let { bottomTab, hideBottomTab, stage, setStage } = useContext(globalState)

    return(
        <View style={_payment.container}>
            <TimeLine goBack={()=>navigation.navigate('Passenger')}/>
            <ScrollView>
                {/* Passenger details starts here */}
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>Payment method</Text>
                <View style={{ flexDirection: 'row', marginVertical: 4, alignItems: 'center', marginLeft: 18 }}>
                    <TouchableOpacity>
                        <View style={{ backgroundColor: '#3B78FF', width: 20, height: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'white', width: 8, height: 8, borderRadius: 100 }}></View>
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginLeft: 10 }}>Credit card or Debit card</Text>
                </View>
                <Card containerStyle={{ borderRadius: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 3}}>
                    <View style={_payment.cardHeader}>
                        <Image source={require('../../assets/visa.png')} style={{ marginHorizontal: 4 }}/>
                        <Image source={require('../../assets/american-express.png')} style={{ marginHorizontal: 4 }}/>
                        <Image source={require('../../assets/discover.png')} style={{ marginHorizontal: 4 }}/>
                    </View>
                    <View style={_payment.inputBox}>
                        <TextInput placeholder='Name on the card*' style={{ width: '100%', height: '100%', paddingLeft: 6 }}/>
                    </View>
                    <View style={_payment.inputBox}>
                        <TextInput placeholder='Card number*' style={{ width: '100%', height: '100%', paddingLeft: 6 }}/>
                    </View>
                    <View style={_payment.inputBox}>
                        <TextInput placeholder='Expiration month*' style={{ width: '100%', height: '100%', paddingLeft: 6 }}/>
                    </View>
                    <View style={_payment.inputBox}>
                        <TextInput placeholder='Expiration year*' style={{ width: '100%', height: '100%', paddingLeft: 6 }}/>
                    </View>
                    <View style={_payment.inputBox}>
                        <TextInput placeholder='CVV code*' style={{ width: '100%', height: '100%', paddingLeft: 6 }}/>
                    </View>
                    <View style={{ position: 'absolute', bottom: '44%', right: '2%' }}>
                        <Image source={require('../../assets/cvv.png')}/>
                    </View>
                    <View style={_payment.saveLater}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={{ flexDirection: 'row', marginVertical: 4, alignItems: 'center' }}>
                                <TouchableOpacity style={{ backgroundColor: '#3B78FF', justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name='checkmark' type='ionicon' color='white' size={16} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B', marginLeft: 10 }}>Save your information to pay faster with link</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                                <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B', marginLeft: 26 }}>Pay faster at Travelfika corporation and everywhere where link is accepted.</Text>
                            </View>
                        </View>
                    </View>
                    <View style={_payment.paymentButton}>
                        <TouchableOpacity style={{ backgroundColor: '#15A209', marginVertical: 20, paddingVertical: 10, paddingHorizontal: 140, borderRadius: 10, elevation: 2 }}
                        onPress={()=>{
                            navigation.navigate('Confirmation')
                        }}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>Pay</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
                {/* Passenger details ends here */}
            </ScrollView>
        </View>
    )
}

let _payment = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 30
    },
    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#DBDBDB',
        paddingBottom: 8
    },
    inputBox: {
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        marginVertical: 10,
        padding: 0,
        height: 40,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderColor: '#06122BB3'
    },
    paymentButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    saveLater: {
        width: '100%',
        backgroundColor: '#E7EDFB',
        marginVertical: 24,
        paddingVertical: 14,
        borderRadius: 10,
        elevation: 2
    }
})