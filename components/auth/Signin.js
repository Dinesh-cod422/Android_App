import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import React, { useState, useContext } from 'react';
import { globalState } from '../../App';

export default function Signin(){

    let [secureText, setSecureText] = useState(true)
    let {header, setHeader, logged, setLogin} = useContext(globalState)

    return(
        <View style={_signin.container}>
            <ScrollView>
                <Card containerStyle={_signin.card}>
                    <View style={_signin.header}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 35, color: '#3C77FF' }}>TravelFika</Text>
                    </View>
                    <View style={_signin.inputWrapper}>
                        <TextInput placeholder='Email address' style={_signin.inputBox}/>
                        <TextInput placeholder='Password' secureTextEntry={secureText} style={_signin.inputBox}/>
                        <TouchableOpacity style={{ 
                            position: 'absolute',
                            bottom: 17,
                            right: 10 
                        }} onPress={secureText ? ()=>{setSecureText(false)}:()=>setSecureText(true)}>
                            <Icon
                                name={secureText ? 'eye-off' : 'eye'}
                                type='ionicon'
                                color='#06122B'
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={{ fontFamily: 'poppins-bold', color: '#3B78FF', marginLeft: 12 }}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={_signin.buttons} onPress={() => setLogin(true)}>
                        <Text style={{ fontSize: 18,  fontFamily: 'poppins-bold', color: 'white' }}>Signin</Text>
                    </TouchableOpacity>
                    <View style={_signin.textContent}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>Create an account if you are new to Travelfika</Text>
                    </View>
                    <TouchableOpacity style={_signin.buttons}>
                        <Text style={{ fontSize: 18,  fontFamily: 'poppins-bold', color: 'white' }}>Create account</Text>
                    </TouchableOpacity>
                    <View style={_signin.textContent}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>Or</Text>
                    </View>
                    <TouchableOpacity style={[_signin.buttons, {backgroundColor: 'white'}]}>
                        <Icon
                            name='logo-google'
                            type='ionicon'
                            color='#06122B'
                        />
                        <Text style={{ fontSize: 18,  fontFamily: 'poppins-bold', color: '#06122B' }}>Sign with Google</Text>
                    </TouchableOpacity>
                </Card>
            </ScrollView>
        </View>
    )
}

const _signin = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    card: {
        paddingVertical: 40,
        paddingHorizontal: 30,
        borderRadius: 22
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    inputWrapper: {
        marginVertical: 14
    },
    inputBox: {
        borderWidth: 1,
        borderRadius: 10,
        height: 40,
        padding: 0,
        paddingLeft: 14,
        marginVertical: 10
    },
    buttons: {
        flexDirection: 'row',
        backgroundColor: '#3B78FF',
        height: 40,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 14,
        borderRadius: 10,
        elevation: 2
    },
    textContent: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})



// let updateTextValue = (text, name, id, type) => {
//     let newArr = [...passengerVariable]
//     newArr[id] = {...newArr[id], [name]: text, PassengerTypeCode: type, FrequentFlyerNumber: null, IsWheelchair: false, MealCode: null}
    
//     if(newArr[id]['Nationality']){
//         newArr[id] = {...newArr[id], PassengerIssueCountry: newArr[id]['Nationality'], PassengerTypeCode: type, FrequentFlyerNumber: null, IsWheelchair: false, MealCode: null}
//     }

//     if(newArr[id]['Gender']){
//         newArr[id] = {...newArr[id], Title: (newArr[id]['Gender'] == 'Male')?'Mr':'Miss', PassengerTypeCode: type, FrequentFlyerNumber: null, IsWheelchair: false, MealCode: null}
//     }
//     passengerVariable = newArr
//     console.log(passengerVariable)
// }

// let PassengerForm = ({ num, type }) => {
//     return(
//         <Card containerStyle={{ borderRadius: 22 ,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 3}}>
//             <View style={_passenger.cardHeader}>
//                 <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#3B78FF' }}>Passenger #{num+1}</Text>
//                 <TouchableOpacity>
//                     <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#3B78FF' }}>{type}</Text>
//                 </TouchableOpacity>
//             </View>
//             <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 8, color: '#06122BB3' }}>{"(Spelling of the name must match with your government issued photo ID)"}</Text>
//             <View style={_passenger.inputBox}>
//                 <TextInput placeholder='First name*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateTextValue(e, 'FirstName', num, type)} value={passengerVariable[num] != undefined ? passengerVariable[num]['FirstName'] : null}/>
//             </View>
//             <View style={_passenger.inputBox}>
//                 <TextInput placeholder='Last name*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateTextValue(e, 'LastName', num, type)} value={passengerVariable[num] != undefined ? passengerVariable[num]['LastName'] : null}/>
//             </View>
//             <View style={_passenger.inputBox}>
//                 <TextInput placeholder='Middle name (optional)' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateTextValue(e, 'MiddleName', num, type)} value={passengerVariable[num] != undefined ? passengerVariable[num]['MiddleName'] : null}/>
//             </View>
//             <TouchableOpacity style={_passenger.inputBox} onPress={() => openDobModal({state: true, id: num, type: type})}>
//                 <TextInput placeholder='Date of birth*' editable={false} style={{ width: '100%', height: '100%', paddingLeft: 6, color:"#06122B" }} onChangeText={(e)=>updateTextValue(e, 'DOB', num, type)} value={passengerVariable[num] != undefined ? passengerVariable[num]['DOB'] : null}/>
//             </TouchableOpacity>
//             <View style={_passenger.inputBox}>
//                 <TextInput placeholder='Country*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateTextValue(e, 'Nationality', num, type)} value={passengerVariable[num] != undefined ? passengerVariable[num]['Nationality'] : null}/>
//             </View>
            
//             <ListItem.Accordion content={
//                 <ListItem.Content>
//                     <ListItem.Title>{expand.payload}</ListItem.Title>
//                 </ListItem.Content>
//             }
//             isExpanded={expand.trigger}
//             onPress={() => {
//                 if(expand.trigger == true){
//                     setExpand(prev => ({
//                         ...prev,
//                         trigger: false
//                     }))
//                 }
//                 else if(expand.trigger == false){
//                     setExpand(prev => ({
//                         ...prev,
//                         trigger: true
//                     }))
//                 }
//             }}
//             containerStyle={_passenger.inputBox}>
//                 <ListItem>
//                     <ListItem.Content>
//                         <ListItem.Title onPress={()=>{
//                             updateTextValue('Male', 'Gender', num, type)
//                             setExpand({
//                                 trigger: false,
//                                 payload: 'Male'
//                             })
//                             }
//                         }>Male</ListItem.Title>
//                     </ListItem.Content>
//                 </ListItem>
//                 <ListItem>
//                     <ListItem.Content>
//                         <ListItem.Title onPress={()=>{
//                             updateTextValue('Female', 'Gender', num, type)
//                             setExpand({
//                                 trigger: false,
//                                 payload: 'Female'
//                             })
//                             }
//                         }>Female</ListItem.Title>
//                     </ListItem.Content>
//                 </ListItem>
//             </ListItem.Accordion>            
//         </Card>
//     )
// }


// <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>Passenger details</Text>
//                 {
//                     passengers.adult >= 1 ?
//                     [...Array(passengers.adult)].map((e, i) => (
//                         <PassengerForm num={i} key={i} type={'ADT'}/>
//                     )):null
//                 }
//                 {
//                     passengers.children >= 1 ?
//                     [...Array(passengers.children)].map((e, i) => (
//                         <PassengerForm num={i+passengers.adult} key={i} type={'CHD'}/>
//                     )):null
//                 }
//                 {
//                     passengers.infant >= 1 ?
//                     [...Array(passengers.infant)].map((e, i) => (
//                         <PassengerForm num={i+passengers.adult+passengers.children} key={i} type={'INF'}/>
//                     )):null
//                 }