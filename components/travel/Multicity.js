import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MulticityFlights from '../reusable/MulticityFlights'
import Baggage from '../reusable/Baggage';
import Passenger from '../reusable/Passenger';
import Payment from '../reusable/Payment';
import Confirmation from '../reusable/Confirmation';
import Filter from '../reusable/Filter';

const Stack = createNativeStackNavigator();

export default function Multicity({ navigation }){

    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MulticityFlights" component={MulticityFlights} />
            <Stack.Screen name="Passenger" component={Passenger} />
            <Stack.Screen name="Baggage" component={Baggage} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="Confirmation" component={Confirmation} />
            <Stack.Screen name="Filter" component={Filter} />
        </Stack.Navigator>
    )
}