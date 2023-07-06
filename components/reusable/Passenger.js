import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native'
import { Icon, Card, ListItem } from '@rneui/themed';
import React, { useEffect, useState, useContext } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalState } from '../../App';
import TimeLine from './TimeLine';
import { FlightLogo } from '../endpoint/Endpoint';
import { CardField, StripeProvider, useStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import { PaymentUrl } from '../endpoint/Endpoint';

let passengerVariable = []
let addressVariable = {
    address: null,
    city: null,
    zipcode: null,
    email: null,
    numcode: null,
    mobile: null
}

let cardVariable = null
let checkpoint = false

export default function Passenger({ navigation }){

    const stripe = useStripe()
    const {confirmPayment, loading} = useConfirmPayment();

    let { bottomTab, hideBottomTab, 
        stage, setStage, 
        travel, setTravel, 
        travelDetail, setTraveDetail, 
        selected, setSelected,
        orides, setOrides,
        reprice, setReprice,
        bookingId, setBookingId,
        cardName, setCardName } = useContext(globalState)

    let [passengers, setPassengersCount] = useState({
        adult: 0,
        children: 0,
        infant: 0
    })
    let [dobModal, openDobModal] = useState({
        state: false,
        id: null,
        type: null
    })
    let [expand, setExpand] = useState({
        trigger: false,
        payload: 'Gender'
    })
    let [ticketLoader, setTicketLoader] = useState(false)

    useEffect(() => {
        setStage(prevStage => ({
            ...prevStage,
            two: true
        }))

        setPassengersCount(prevList => ({
            ...prevList,
            adult: travelDetail.adult,
            children: travelDetail.children,
            infant: travelDetail.infant
        }))

        console.log('Search ID: ' + selected.search_id);
    }, [])

    let RroundTripCard = () => {
        return(
            <Card containerStyle={{ borderRadius: 22, padding: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 3 }}>
                <View style={{ marginHorizontal: 12 }}>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Image source={require('../../assets/airways.png')} style={{ width: 60, resizeMode: 'contain' }} />
                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Departing Information</Text>
                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>Mon, April 14, 2023</Text>
                </View>
                {/* Arrow */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>LHR</Text>
                    <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                        <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                        <View style={{ position: 'absolute', left: '-5%' }}>
                            <Icon name='caret-back' type='ionicon' color='#0D3283' />
                        </View>
                        <View style={{ position: 'absolute', right: '-5%' }}>
                            <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                        </View>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, position: 'absolute', left: '40%', top: '80%' }}>(8h30m)</Text>
                    </View>
                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>JFK</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>7:00am</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Heathrow</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>0 stops</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Carry-on bag included</Text>
                        </View>
                    </View>
                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>2:00pm</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>John. F. Kennedy Intl</Text>
                    </View>
                </View>
                <View style={{ width: '100%', height: 1, marginVertical: 24 }}></View>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Image source={require('../../assets/airways.png')} style={{ width: 60, resizeMode: 'contain' }} />
                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Returning Information</Text>
                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>Mon, April 14, 2023</Text>
                </View>
                {/* Arrow */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>JFK</Text>
                    <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                        <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                        <View style={{ position: 'absolute', left: '-5%' }}>
                            <Icon name='caret-back' type='ionicon' color='#0D3283' />
                        </View>
                        <View style={{ position: 'absolute', right: '-5%' }}>
                            <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                        </View>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, position: 'absolute', left: '40%', top: '80%' }}>(8h30m)</Text>
                    </View>
                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>LHR</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>7:00am</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>John. F. Kennedy Intl</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>0 stops</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Carry-on bag included</Text>
                        </View>
                    </View>
                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>2:00pm</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Heathrow</Text>
                    </View>
                </View>
                </View>
                <View style={{ width: '100%', backgroundColor: '#E7EDFB', marginTop: 20, paddingTop: 10, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                    <View>
                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                            <Icon name='checkmark' type='ionicon' color='#15A209' size={20}/>
                            <Text style={{ fontFamily: 'poppins-bold', color: '#15A209', marginLeft: 4, fontSize: 12 }}>Free cancellation within 48 hours</Text>
                        </View>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>Economy</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>Round trip per person</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 25, color: '#3B78FF' }}>$520</Text>
                    </View>
                </View>
            </Card>
        )
    }

    let OneViewCard = () => {
        return(
            <Card containerStyle={{ borderRadius: 22, padding: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 3 }}>
                <View style={{ marginHorizontal: 12 }}>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Image source={{ uri: `${FlightLogo}${selected.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.calendar}</Text>
                </View>
                {/* Arrow */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14, justifyContent: 'space-around' }}>
                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{selected.origin}</Text>
                    <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                        <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                        <View style={{ position: 'absolute', left: '-5%' }}>
                            <Icon name='caret-back' type='ionicon' color='#0D3283' />
                        </View>
                        <View style={{ position: 'absolute', right: '-5%' }}>
                            <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                        </View>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, position: 'absolute', left: '40%', top: '80%' }}>{`(${selected.duration})`}</Text>
                    </View>
                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{selected.destination}</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.departure}</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.from}</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.stops} stop</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.carry}</Text>
                        </View>
                    </View>
                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.arrival}</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.to}</Text>
                    </View>
                </View>
                </View>
                <View style={{ width: '100%', backgroundColor: '#E7EDFB', marginTop: 20, paddingTop: 10, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                    <View>
                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                            <Icon name='checkmark' type='ionicon' color='#15A209' size={20}/>
                            <Text style={{ fontFamily: 'poppins-bold', color: '#15A209', marginLeft: 4, fontSize: 12 }}>{selected.cancellation}</Text>
                        </View>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>{selected.class === 'E' ? 'Economy':'Business'}</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>Oneway trip per person</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 25, color: '#3B78FF' }}>{`$${reprice.grand_total}`}</Text>
                    </View>
                </View>
            </Card>
        )
    }


    let updateTextValue = (text, name, id, type) => {
        let newArr = [...passengerVariable]
        newArr[id] = {...newArr[id], [name]: text, PassengerTypeCode: type, FrequentFlyerNumber: null, IsWheelchair: false, MealCode: null}
        
        if(newArr[id]['Nationality']){
            newArr[id] = {...newArr[id], PassengerIssueCountry: newArr[id]['Nationality'], PassengerTypeCode: type, FrequentFlyerNumber: null, IsWheelchair: false, MealCode: null}
        }

        if(newArr[id]['Gender']){
            newArr[id] = {...newArr[id], Title: (newArr[id]['Gender'] == 'Male')?'Mr':'Miss', PassengerTypeCode: type, FrequentFlyerNumber: null, IsWheelchair: false, MealCode: null}
        }
        passengerVariable = newArr
        console.log(passengerVariable)
    }

    let PassengerForm = ({ num, type }) => {
        return(
            <Card containerStyle={{ borderRadius: 22 ,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 3}}>
                <View style={_passenger.cardHeader}>
                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#3B78FF' }}>Passenger #{num+1}</Text>
                    <TouchableOpacity>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#3B78FF' }}>{type}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 8, color: '#06122BB3' }}>{"(Spelling of the name must match with your government issued photo ID)"}</Text>
                <View style={_passenger.inputBox}>
                    <TextInput placeholder='First name*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateTextValue(e, 'FirstName', num, type)} value={passengerVariable[num] != undefined ? passengerVariable[num]['FirstName'] : null}/>
                </View>
                <View style={_passenger.inputBox}>
                    <TextInput placeholder='Last name*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateTextValue(e, 'LastName', num, type)} value={passengerVariable[num] != undefined ? passengerVariable[num]['LastName'] : null}/>
                </View>
                <View style={_passenger.inputBox}>
                    <TextInput placeholder='Middle name (optional)' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateTextValue(e, 'MiddleName', num, type)} value={passengerVariable[num] != undefined ? passengerVariable[num]['MiddleName'] : null}/>
                </View>
                <TouchableOpacity style={_passenger.inputBox} onPress={() => openDobModal({state: true, id: num, type: type})}>
                    <TextInput placeholder='Date of birth*' editable={false} style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateTextValue(e, 'DOB', num, type)} value={passengerVariable[num] != undefined ? passengerVariable[num]['DOB'] : null}/>
                </TouchableOpacity>
                <View style={_passenger.inputBox}>
                    <TextInput placeholder='Country*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateTextValue(e, 'Nationality', num, type)} value={passengerVariable[num] != undefined ? passengerVariable[num]['Nationality'] : null}/>
                </View>
                
                <ListItem.Accordion content={
                    <ListItem.Content>
                        <ListItem.Title>{expand.payload}</ListItem.Title>
                    </ListItem.Content>
                }
                isExpanded={expand.trigger}
                onPress={() => {
                    if(expand.trigger == true){
                        setExpand(prev => ({
                            ...prev,
                            trigger: false
                        }))
                    }
                    else if(expand.trigger == false){
                        setExpand(prev => ({
                            ...prev,
                            trigger: true
                        }))
                    }
                }}
                containerStyle={_passenger.inputBox}>
                    <ListItem>
                        <ListItem.Content>
                            <ListItem.Title onPress={()=>{
                                updateTextValue('Male', 'Gender', num, type)
                                setExpand({
                                    trigger: false,
                                    payload: 'Male'
                                })
                                }
                            }>Male</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    <ListItem>
                        <ListItem.Content>
                            <ListItem.Title onPress={()=>{
                                updateTextValue('Female', 'Gender', num, type)
                                setExpand({
                                    trigger: false,
                                    payload: 'Female'
                                })
                                }
                            }>Female</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                </ListItem.Accordion>            
            </Card>
        )
    }

    let updateAddress = (data, type) => {
        switch (type) {
            case 'address':
                addressVariable.address = data
                break;
            case 'city':
                addressVariable.city = data
                break;
            case 'zipcode':
                addressVariable.zipcode = data
                break;
            case 'email':
                addressVariable.email = data
                break;
            case 'numcode':
                addressVariable.numcode = data
                break;
            case 'mobile':
                addressVariable.mobile = data
                break;
            default:
                break;
        }
    }

    let processPayment = async () => {
        if(passengerVariable.length === travelDetail.passengers){
            passengerVariable.map(async(data) => {
                if(data.FirstName !== undefined && 
                    data.FirstName.length !== 0 &&
                    data.LastName !== undefined && 
                    data.LastName.length !== 0 && 
                    data.DOB !== undefined && 
                    data.DOB.length !== 0 && 
                    data.Nationality !== undefined && 
                    data.Nationality.length !== 0 && 
                    data.Gender !== undefined && 
                    data.Gender.length !== 0){
                        console.log('Passenger details validated');
                        checkpoint = true
                }
                else{
                    console.log('Passenger details incomplete');
                }
            })
        }

        if(checkpoint){
            //address validation
            checkpoint = false
            if(addressVariable.address !== null &&
                addressVariable.address.length !== 0 &&
                addressVariable.city !== null &&
                addressVariable.city.length !== 0 &&
                addressVariable.zipcode !== null &&
                addressVariable.zipcode.length !== 0 &&
                addressVariable.email !== null && 
                addressVariable.email.includes('@') &&
                addressVariable.numcode !== null &&
                addressVariable.numcode.length !== 0 &&
                addressVariable.mobile !== null &&
                addressVariable.mobile.length == 10){
                    console.log('Billing address validated');

                    if(cardVariable !== null && cardVariable.length !== 0){
                        checkpoint = true
                        console.log('Card name validated');
                    }

                    if(checkpoint){
                        setCardName(cardVariable)
                        setTicketLoader(true)

                        axios.post(PaymentUrl, {
                            "PassengerDetails": passengerVariable,
                            "PassengerContactInfo": {
                                "PhoneNumber": addressVariable.mobile,
                                "PhoneCountryCode": addressVariable.numcode,
                                "AlternatePhoneNumber": "1",
                                "Email": addressVariable.email
                            },
                            "Currency": "USD",
                            "SearchID": selected.search_id,
                            "IteneraryRefID": selected.itenerary_id
                        })
                        .then(async (response) => {
                            console.log(response.data.paymentIntents);
                            let clientSceret = response.data.paymentIntents
                            let booking_id = response.data.bookingId
                            console.log(booking_id);
                            try{                         
                                if(clientSceret){
                                console.log(clientSceret);
                                const billingDetails = {
                                    email: addressVariable.email,
                                };
                                const {paymentIntent, error} = await confirmPayment(clientSceret, {
                                    paymentMethodType: 'Card',
                                    paymentMethodData: billingDetails,
                                    });
                                
                                    if (error) {
                                    console.log('Payment confirmation error', error);
                                    } else if (paymentIntent) {
                                    console.log('Success from promise', paymentIntent);
                                    setBookingId(booking_id)
                                    setTicketLoader(false)
                                    navigation.navigate('Confirmation')
                                    }
                                
                                checkpoint = false
                                }
                            }
                            catch(e){
                                console.log('Catch: ' + e);
                            }
                        })
                        .catch((e) => {
                            console.log('Error: ' + e);
                        })
                    }
            }
            else{
                console.log('Billing details incomplete');
            }
        }
    }

    return(
        <StripeProvider publishableKey='pk_test_51L0ITaJm9I4mlh47eNhy5oqKprW4hKF9iSkGGzlZDbxbh9v9Y83JmH5UFnKg3JBddSlZHogXZd734g4CPzlky21x00iAGKf8Vp'>
        <View style={_passenger.container}>
            <TimeLine goBack={()=>navigation.navigate('Baggage')}/>
            <ScrollView>
                {/* Roundtrip flight start */}
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>Flight Summary</Text>
                { travel === '1' ? <RroundTripCard /> : <OneViewCard /> }

                {/* Passenger details starts here */}
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>Passenger details</Text>
                {
                    passengers.adult >= 1 ?
                    [...Array(passengers.adult)].map((e, i) => (
                        <PassengerForm num={i} key={i} type={'ADT'}/>
                    )):null
                }
                {
                    passengers.children >= 1 ?
                    [...Array(passengers.children)].map((e, i) => (
                        <PassengerForm num={i+passengers.adult} key={i} type={'CHD'}/>
                    )):null
                }
                {
                    passengers.infant >= 1 ?
                    [...Array(passengers.infant)].map((e, i) => (
                        <PassengerForm num={i+passengers.adult+passengers.children} key={i} type={'INF'}/>
                    )):null
                }
                {/* Passenger details ends here */}

                {/* Billing address details starts here */}
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>Billing details</Text>
                <Card containerStyle={{ borderRadius: 22,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 3 }}>
                    <View style={_passenger.cardHeader}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#0D3283' }}>Billing address</Text>
                    </View>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 8, color: '#06122BB3' }}>{"(Please enter your complete address with email)"}</Text>
                    <View style={_passenger.inputBox}>
                        <TextInput placeholder='Address*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateAddress(e, 'address')}/>
                    </View>
                    <View style={_passenger.inputBox}>
                        <TextInput placeholder='City*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateAddress(e, 'city')}/>
                    </View>
                    <View style={_passenger.inputBox}>
                        <TextInput placeholder='Postal code' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateAddress(e, 'zipcode')}/>
                    </View>
                    <View style={_passenger.inputBox}>
                        <TextInput placeholder='Email*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateAddress(e, 'email')}/>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[_passenger.inputBox, {width: '23%'}]}>
                            <TextInput placeholder='Code*' style={{ width: '100%', height: '100%' }} onChangeText={(e)=>updateAddress(e, 'numcode')}/>
                        </View>
                        <View style={[_passenger.inputBox, {width: '75%'}]}>
                            <TextInput placeholder='Mobile number*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e)=>updateAddress(e, 'mobile')}/>
                        </View>
                    </View>
                </Card>
                {/* Billing address details ends here */}

                {/* Fare summary starts here */}
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>Fare summary</Text>
                <Card containerStyle={{ borderRadius: 22,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 3}}>
                    <View style={_passenger.cardHeader}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#0D3283' }}>Cost summary</Text>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#0D3283' }}>Oneway trip</Text>
                    </View>
                    {
                        travelDetail.adult !== 0 ?
                        <View style={_passenger.fareSummary}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 11, color: '#06122B' }}>{`${travelDetail.adult} x adults\n(${travelDetail.adult} x ${reprice.adult_fare})`}</Text>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#06122B' }}>{`$${parseInt(travelDetail.adult)*reprice.adult_fare}`}</Text>
                        </View>:null
                    }
                    {
                        travelDetail.children !== 0 ?
                        <View style={_passenger.fareSummary}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 11, color: '#06122B' }}>{`${travelDetail.children} x children\n(${travelDetail.children} x ${reprice.child_fare})`}</Text>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#06122B' }}>{`$${parseInt(travelDetail.children)*reprice.child_fare}`}</Text>
                        </View>:null
                    }
                    {
                        travelDetail.infant !== 0 ?
                        <View style={_passenger.fareSummary}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 11, color: '#06122B' }}>{`${travelDetail.infant} x infant\n(${travelDetail.infant} x ${reprice.infant_fare})`}</Text>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#06122B' }}>{`$${parseInt(travelDetail.infant)*reprice.infant_fare}`}</Text>
                        </View>:null
                    }
                    <View style={_passenger.fareSummary}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 11, color: '#06122B' }}>Tax</Text>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#06122B' }}>{`$${reprice.total_tax}`}</Text>
                    </View>
                    <View style={_passenger.grandTotal}>
                        <View style={{ backgroundColor: '#3B78FF', marginVertical: 20, paddingVertical: 6, paddingHorizontal: 55, borderRadius: 10, elevation: 2 }}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>{`Grand total : $${reprice.grand_total}`}</Text>
                        </View>
                    </View>
                    <View style={[_passenger.cardHeader, { marginBottom: 8 }]}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#0D3283' }}>Important Information</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                        <Icon name='checkmark' type='ionicon' color='#15A209' size={20}/>
                        <Text style={{ fontFamily: 'poppins-bold', color: '#15A209', marginLeft: 4, fontSize: 12 }}>Free cancellation within 48 hours</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                        <Icon name='checkmark' type='ionicon' color='#06122B' size={20}/>
                        <Text style={{ fontFamily: 'poppins-regular', color: '#06122B', marginLeft: 4, fontSize: 12 }}>
                            Connecting flight other than final destination will have special transit requirements.
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                        <Icon name='checkmark' type='ionicon' color='#06122B' size={20}/>
                        <Text style={{ fontFamily: 'poppins-regular', color: '#06122B', marginLeft: 4, fontSize: 12 }}>
                            By selecting complete booking, you agree to the terms and conditions and privacy policy.
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                        <Icon name='checkmark' type='ionicon' color='#06122B' size={20}/>
                        <Text style={{ fontFamily: 'poppins-regular', color: '#06122B', marginLeft: 4, fontSize: 12 }}>
                            Prices in USD.
                        </Text>
                    </View>
                </Card>
                {/* Fare summary details ends here */}

                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>Payment method</Text>
                <View style={{ flexDirection: 'row', marginVertical: 4, alignItems: 'center', marginLeft: 18 }}>
                    <TouchableOpacity>
                        <View style={{ backgroundColor: '#3B78FF', width: 20, height: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'white', width: 8, height: 8, borderRadius: 100 }}></View>
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginLeft: 10 }}>Credit card or Debit card</Text>
                </View>
                <Card containerStyle={{ borderRadius: 22,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 3 }}>
                    <View style={_payment.cardHeader}>
                        <Image source={require('../../assets/visa.png')} style={{ marginHorizontal: 4 }}/>
                        <Image source={require('../../assets/american-express.png')} style={{ marginHorizontal: 4 }}/>
                        <Image source={require('../../assets/discover.png')} style={{ marginHorizontal: 4 }}/>
                    </View>
                    <View style={_payment.inputBox}>
                        <TextInput placeholder='Name on the card*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e) => {
                            cardVariable = e
                        }}/>
                    </View>
                    <View style={[_payment.inputBox, {paddingHorizontal: 0}]}>
                        <CardField
                            postalCodeEnabled={false}
                            placeholders={{
                            number: '4242 4242 4242 4242',
                            }}
                            cardStyle={{
                            backgroundColor: '#FFFFFF',
                            textColor: '#000000',
                            borderRadius: 10
                            }}
                            style={{
                            width: '100%',
                            height: '100%',
                            }}
                            onCardChange={(cardDetails) => {
                            console.log('cardDetails', cardDetails);
                            }}
                            onFocus={(focusedField) => {
                            console.log('focusField', focusedField);
                            }}
                        />
                    </View>
                    {/*
                    <View style={_payment.inputBox}>
                        <TextInput placeholder='Card number*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e) => updateCard(e, 'cardno')}/>
                    </View>
                    <View style={_payment.inputBox}>
                        <TextInput placeholder='Expiration month*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e) => updateCard(e, 'expmon')}/>
                    </View>
                    <View style={_payment.inputBox}>
                        <TextInput placeholder='Expiration year*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e) => updateCard(e, 'expyea')}/>
                    </View>
                    <View style={_payment.inputBox}>
                        <TextInput placeholder='CVV code*' style={{ width: '100%', height: '100%', paddingLeft: 6 }} onChangeText={(e) => updateCard(e, 'cvv')}/>
                    </View>
                    <View style={{ position: 'absolute', bottom: '33%', right: '2%' }}>
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
                */}
                </Card>

                {/* Help details starts here */}
                <View style={_passenger.customerCare}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283' }}>Need help?</Text>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Customer care</Text>
                    </View>
                    <View style={{ height: 1.5, marginHorizontal: 10, backgroundColor: '#ABAEB5', marginVertical: 8 }}></View>
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B', marginVertical: 4 }}>Give us a call</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B' }}>From United States</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B' }}>(855) 650- FIKA</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B' }}>From other countries</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B' }}>(855) 650- FIKA</Text>
                        </View>
                    </View>
                </View>
                {/* Help details ends here */}
                <View style={_payment.paymentButton}>
                        <TouchableOpacity style={{ backgroundColor: '#15A209', marginVertical: 20, paddingVertical: 10, paddingHorizontal: 140, borderRadius: 10, elevation: 2 }}
                        onPress={processPayment}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>Pay</Text>
                        </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal visible={dobModal.state} transparent={true}>
                <View style={_passenger.dobStyle}>
                <DateTimePicker
                    testID="dateTimePicker"
                    mode={"date"}
                    value={new Date()}
                    minimumDate={dobModal.type === "ADT" ? new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate()) : new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate()) && dobModal.type === "CHD" ? new Date(new Date().getFullYear() - 12, new Date().getMonth(), new Date().getDate()) : new Date(new Date().getFullYear() - 12, new Date().getMonth(), new Date().getDate()) && dobModal.type === "INF" ? new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDate()) : new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDate()) }
                    maximumDate={ dobModal.type === "CHD" ? new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDate()) : dobModal.type === "INF" ? new Date() : dobModal.type === "ADT" ? new Date(new Date().getFullYear() - 13, new Date().getMonth(), new Date().getDate()) : undefined }
                    onChange={(date) => {
                        var d = new Date(date.nativeEvent.timestamp).getDate()
                        var m = new Date(date.nativeEvent.timestamp).getMonth() + 1
                        var y = new Date(date.nativeEvent.timestamp).getFullYear()

                        d = d.toString().length === 1 ? '0'+d : d.toString()
                        m = m.toString().length === 1 ? '0'+m : m.toString()

                        let dob = y+'-'+m+'-'+d
                        updateTextValue(dob, 'DOB', dobModal.id, dobModal.type)
                        openDobModal(prevDob => ({
                            ...prevDob,
                            state: false,
                            id: null,
                            type: null
                        }))
                        console.log(dobModal);
                    }}
                />
                </View>
            </Modal>
            <Modal visible={ticketLoader}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView
                        autoPlay
                        style={{
                        width: 200,
                        height: 200,
                        backgroundColor: 'white',
                        }}
                        source={require('../../assets/ticketLoading.json')}
                    />
                </View>
            </Modal>
        </View>
        </StripeProvider>
    )
}

let _passenger = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#DBDBDB',
        paddingBottom: 8
    },
    grandTotal: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
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
    fareSummary: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8
    },
    paymentButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    customerCare: {
        width: '100%',
        backgroundColor: '#E7EDFB',
        marginVertical: 24,
        paddingVertical: 14
    }
})

let _payment = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
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