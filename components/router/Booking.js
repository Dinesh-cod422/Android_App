import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../travel/Home';
import RoundTrip from '../travel/RoundTrip';
import Oneway from '../travel/Oneway';
import Multicity from '../travel/Multicity';

const Stack = createNativeStackNavigator();

export default function Booking(){
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="RoundTrip" component={RoundTrip} />
            <Stack.Screen name="Oneway" component={Oneway} />
            <Stack.Screen name="Multicity" component={Multicity} />
        </Stack.Navigator>
    )
}