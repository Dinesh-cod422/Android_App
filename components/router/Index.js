import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import Landing from '../auth/Landing'
import Signin from '../auth/Signin';
import FikaTab from './FikaTab';
import PrivacyPolicy from '../auth/PrivacyPolicy';


const Stack = createNativeStackNavigator();

export default function Index() {

  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="Policy" component={PrivacyPolicy} />
          <Stack.Screen name="FikaTab" component={FikaTab} />
          <Stack.Screen name="Signin" component={Signin} options={{
            title: 'Signin',
            headerStyle: {
              backgroundColor: '#3B78FF',
            },
            headerTitleStyle: {
              fontFamily: 'poppins-bold',
              color: 'white',
            },
            headerTitleAlign: 'center',
            headerRight: () => (
              <TouchableOpacity onPress={() => setLogin(true)}>
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 14, color: 'white' }}>Skip</Text>
              </TouchableOpacity>
            )
          }}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}