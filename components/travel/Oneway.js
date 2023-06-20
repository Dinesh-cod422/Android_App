import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute, useNavigationState } from '@react-navigation/native';
import { Icon, Card } from '@rneui/themed';
import React, { useState, useEffect, useContext } from 'react';
import { globalState } from '../../App';
import OneWayFlights from '../reusable/OneWayFlights'
import Baggage from '../reusable/Baggage';
import Passenger from '../reusable/Passenger';
import Payment from '../reusable/Payment';
import Confirmation from '../reusable/Confirmation';
import Filter from '../reusable/Filter';

const Stack = createNativeStackNavigator();

export default function Oneway({ navigation }){

    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OneWayFlights" component={OneWayFlights} />
            <Stack.Screen name="Passenger" component={Passenger} />
            <Stack.Screen name="Baggage" component={Baggage} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="Confirmation" component={Confirmation} />
            <Stack.Screen name="Filter" component={Filter} />
        </Stack.Navigator>
    )
}