import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import React, { useContext } from 'react'
import { globalState } from '../../App';
import Home from '../travel/Home';
import Flights from '../travel/RoundTrip';
import Booking from './Booking';

const Tab = createBottomTabNavigator();

export default function FikaTab() {

  let { bottomTab, hideBottomTab } = useContext(globalState)

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Booking" component={Booking}         
      options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <Icon
            name='home'
            type='material'
            color='#3C77FF'
            />
          ),
          tabBarStyle: {
            display: `${'none'}`
          }
      }}/>
      <Tab.Screen name="Trips" component={Flights}         
      options={{
          tabBarLabel: 'Trips',
          tabBarIcon: () => (
            <Icon
            name='luggage'
            type='material'
            color='#3C77FF'
            />
          ),
      }}/>
      <Tab.Screen name="Plan" component={Home}         
      options={{
          tabBarLabel: 'Plan',
          tabBarIcon: () => (
            <Icon
            name='explore'
            type='material'
            color='#3C77FF'
            />
          ),
      }}/>
      <Tab.Screen name="My Profile" component={Home}         
      options={{
          tabBarLabel: 'My Profile',
          tabBarIcon: () => (
            <Icon
            name='person'
            type='material'
            color='#3C77FF'
            />
          ),
      }}/>
    </Tab.Navigator>
  );
}