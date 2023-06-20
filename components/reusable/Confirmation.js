import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { Icon, Card } from '@rneui/themed';
import React, { useEffect, useState, useContext } from 'react'
import { globalState } from '../../App';
import TimeLine from './TimeLine';
import axios from 'axios';
import { FlightLogo } from '../endpoint/Endpoint';
import { BookedUrl } from '../endpoint/Endpoint';

export default function Confirmation({ navigation }){

    let { bottomTab, hideBottomTab, 
        travel, setTravel, 
        travelDetail, setTravelDetail, 
        selected, setSelected, 
        stage, setStage,
        bookingId, setBookingId,
        reprice, setReprice,
        cardName, setCardName } = useContext(globalState)

    let [invoice, setInvoice] = useState({
        api_pnr: null,
        onboard: null,
        offboard: null,
        departure: null,
        arrival: null,
        email: null,
        brand: null,
        last4: null,
        subtotal: null,
        tax: null,
        paid: null
    })

    let dateProcessor = (data) => {
        let d = new Date(data.toString())
        const time = d.getHours()

        if(time > 12){
            let temp = time - 12
            if(d.getMinutes().toString().length === 1){
                let flight_timings = temp.toString()+':'+'0'+d.getMinutes().toString()+' PM'
                return flight_timings
            }
            else {
                let flight_timings = temp.toString()+':'+d.getMinutes().toString()+' PM'
                return flight_timings
            }
        }
        else if(d.getHours() == 0){
            if(d.getMinutes().toString().length == 1){
                let flight_timings = '12:'+'0'+d.getMinutes().toString()+' AM'
                return flight_timings
            }
            else {
                let flight_timings = '12'+':'+d.getMinutes().toString()+' AM'
                return flight_timings
            }
        }
        else if(d.getHours() == 12){
            if(d.getMinutes().toString().length == 1){
                let flight_timings = '12:'+'0'+d.getMinutes().toString()+' PM'
                return flight_timings
            }
            else {
                let flight_timings = '12'+':'+d.getMinutes().toString()+' PM'
                return flight_timings
            }
        }
        else{
            if(d.getMinutes().toString().length == 1){
                let flight_timings = d.getHours().toString()+':'+'0'+d.getMinutes().toString()+' AM'
                return flight_timings
            }
            else{
                let flight_timings = d.getHours().toString()+':'+d.getMinutes().toString()+' AM'
                return flight_timings
            }
        }
    }

    useEffect(() => {
        setStage(prevStage => ({
            ...prevStage,
            three: true
        }))

        axios.get(`${BookedUrl}${bookingId}`)
        .then((response) => {
            setInvoice({
                api_pnr: response.data.data.api_pnr,
                onboard: response.data.data.flight_journey[0].journey_segments[0].origin_airport_name,
                offboard: response.data.data.flight_journey[0].journey_segments[response.data.data.flight_journey[0].journey_segments.length - 1].destination_airport_name,
                departure: dateProcessor(response.data.data.flight_journey[0].journey_segments[0].departure_dateTime),
                arrival: dateProcessor(response.data.data.flight_journey[0].journey_segments[response.data.data.flight_journey[0].journey_segments.length - 1].departure_dateTime),
                email: response.data.data.passenger_contact_info.email,
                brand: response.data.data.transaction.card.brand,
                last4: response.data.data.transaction.card.last4,
                subtotal: response.data.data.gross_fare + response.data.data.markup,
                tax: response.data.data.pay_fare,
                paid: response.data.data.invoice_fare
            })
        })
        .catch((e) => {
            console.log('Error: ' + e);
        })
    }, [])

    let RoundTripCard = () => {
        return(
            <>
            <View style={{ flexDirection: 'row', paddingVertical: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                <Image source={require('../../assets/airways.png')} style={{ width: 60, resizeMode: 'contain' }} />
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
            <View style={{ flexDirection: 'row', paddingVertical: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                <Image source={require('../../assets/airways.png')} style={{ width: 60, resizeMode: 'contain' }} />
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
            </>
        )
    }

    let OneWayCard = () => {
        return(
            <>
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
            </>
        )
    }

    return(
        <View style={_confirmation.container}>
            <TimeLine goBack={() => {hideBottomTab('flex'), navigation.navigate('Home')}}/>
            <ScrollView>
                {/* Selected details starts here */}
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>Booking Complete</Text>
                <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B', marginLeft: 18, marginTop: 14 }}>
                    {`Confirmation email sent to ${invoice.email}`}
                </Text>
                <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B', marginLeft: 18, marginTop: 14 }}>
                    Kindly check your email for complete Itinerary details
                </Text>
                <View style={_confirmation.options}>
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name='print' type='ionicon' color='#0D3283' />
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283', marginLeft: 4 }}>Print ticket</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name='mail' type='ionicon' color='#0D3283' />
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283', marginLeft: 4 }}>Email ticket</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name='calendar' type='ionicon' color='#0D3283' />
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283', marginLeft: 4 }}>Add to calendar</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>{`PNR: ${invoice.api_pnr}`}</Text>
                <Card containerStyle={{ borderRadius: 22, padding: 0 }}>
                    <View style={{ marginHorizontal: 12 }}>
                        {/* Card title starts here */}
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 11 }}>Flight Departure Information</Text>
                            <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Oneway trip</Text>
                        </View>
                        {/* Card title ends here */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
                            <View>
                                <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 4 }}>{`From: ${invoice.onboard} airport`}</Text>
                                <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 4 }}>{`To: ${invoice.offboard} airport`}</Text>
                                <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 4 }}>{`Departure by ${invoice.departure} on ${travelDetail.calendar}`}</Text>
                                <TouchableOpacity>
                                    <Text style={{ color: '#3B78FF', fontFamily: 'poppins-bold', fontSize: 12, marginVertical: 4 }}>View full Itinerary</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity>
                                <Text style={{ color: '#3B78FF', fontFamily: 'poppins-bold', fontSize: 12, textAlign: 'center' }}>Cancel{"\n"}Reservation?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Flight Itinerary Information</Text>
                        </View>
                        {/* Flight Info start here */}
                        { travel === '1' ? <RoundTripCard /> : <OneWayCard />}
                        {/* Flight Info ends here */}

                    </View>
                    {/* Seat summary starts here */}
                    {/*
                    <View style={{ marginHorizontal: 12, marginVertical: 16 }}>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 11 }}>Seat Selection summary</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
                            <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12 }}>London to New York</Text>
                            <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12 }}>41J</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
                            <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12 }}>New York to London</Text>
                            <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12 }}>Assign at Check-in</Text>
                        </View>
                    </View>
                    */}
                    {/* Seat summary ends here */}
                    <View style={{ marginHorizontal: 12 }}>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 11 }}>Important Information</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
                            <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'justify' }}>
                            Airline schedules can change.Please visit your airlines website to reconfirm your flight information and check-in location prior to each departure.
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
                            <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'justify' }}>
                            Airline tickets are non-transferrable.Name changes and adjustments are not allowed. You will be issued electronic tickets.Remember to bring a Identification and Documentation Requirements with you to check-in.
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
                            <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'justify' }}>
                            Federal laws forbids the hazardous materials such as aerosols,fireworks, and flammable liquids aboard aircraft in your luggage or on your person.For full details on prohibited materials contact your airline or visit the FAA website.
                            </Text>
                        </View>
                        <View style={{ marginVertical: 16 }}>
                            <TouchableOpacity>
                                <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: '#3B78FF' }}>More info about airlines {">"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>
                {/* Selected details end here */}

                {/* Summary charges starts here */}
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>Summary of charges</Text>
                <Card containerStyle={{ borderRadius: 22 }}>
                    <View>
                        <View style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Billing name</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{cardName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Purchase date</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>31-03-2023</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Payment method</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{`${invoice.brand}(${invoice.last4})`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Flight subtotal</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{`$${invoice.subtotal}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Tax</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{`$${invoice.tax}`}</Text>
                        </View>
                        {/*
                        <View style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Conveience fee</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>$10.00</Text>
                        </View>
                        */}
                        <View style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Number of travellers</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.passengers}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 18, color: '#3B78FF' }}>Paid</Text>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 18, color: '#3B78FF' }}>{`$${invoice.paid}`}</Text>
                        </View>
                    </View>
                </Card>
                {/* Summary charges starts here */}

                {/* FAQ starts here */}
                <View style={_confirmation.customerCare}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283' }}>FAQ’s</Text>
                    </View>
                    <View style={{ height: 1.5, marginHorizontal: 10, backgroundColor: '#ABAEB5', marginVertical: 8 }}></View>
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B', marginVertical: 4 }}>Can I Change my date?</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B', marginVertical: 4 }}>How do I print my receipt?</Text>
                        <TouchableOpacity>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#3B78FF', marginVertical: 4 }}>See all FAQ’s here</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 18 }}>
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
                    <View style={{ paddingHorizontal: 18, marginVertical: 14 }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122BB3' }}>
                        (Note: To talk to the customer care, you need ticket number and Booking reference number in hand)
                        </Text>
                    </View>
                </View>
                {/* FAQ ends here */}
            </ScrollView>
            <View style={_confirmation.buttons}>
                <TouchableOpacity style={{ backgroundColor: '#3B78FF', flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 30, paddingVertical: 15, elevation: 2 }}
                onPress={()=>{
                    hideBottomTab('flex')
                    navigation.navigate('Home')
                }}>
                    <Icon name='home' type='ionicon' color='white' />
                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white', marginLeft: 10 }}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#3B78FF', flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 30, paddingVertical: 15, elevation: 2 }}>
                    <Icon name='luggage' type='material' color='white' />
                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white', marginLeft: 10 }}>Trip</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

let _confirmation = StyleSheet.create({
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
    options: {
        flexDirection: 'row',
        marginHorizontal: 17,
        marginVertical: 14,
        justifyContent: 'space-between'
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
    },
    buttons: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 20,
        width: '100%',
        justifyContent: 'space-around'
    },
})