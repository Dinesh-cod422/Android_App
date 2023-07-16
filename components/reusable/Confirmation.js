import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native'
import { Icon, Card } from '@rneui/themed';
import React, { useEffect, useState, useContext } from 'react'
import { globalState } from '../../App';
import TimeLine from './TimeLine';
import axios from 'axios';
import { FlightLogo } from '../endpoint/Endpoint';
import { BookedUrl } from '../endpoint/Endpoint';
import { CancelTicket } from '../endpoint/Endpoint';
import { CardDivider } from '@rneui/base/dist/Card/Card.Divider';


export default function Confirmation({ navigation }){

    let { bottomTab, hideBottomTab, 
        travel, setTravel, 
        travelDetail, setTravelDetail, 
        selected, setSelected, 
        stage, setStage,
        bookingId, setBookingId,
        reprice, setReprice,
        cardName, setCardName, flightsListBackup } = useContext(globalState)
        let [popup, setPopup] = useState(false)
        let [popup1, setPopup1] = useState(false)
        let [popup2, setPopup2] = useState(false)
        let [popup3, setPopup3] = useState(false)
        let [yess, setYess] = useState(false)
        console.log(bookingId)


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
        paid: null, 
    })
    let [refund, setRefund] = useState({ refAmount: null })

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
            console.log(response.data);
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
    
    

      const CancelTickets = () => {
        axios.get(`${CancelTicket}${bookingId}`)
        .then((response) => {
            console.log(response.data);
            setInvoice({
                refAmount: response.data.data.amount,
            })
            setYess(true)

            setTimeout(() => {
                setYess(false);
                setPopup(false)
                navigation.navigate('Home')
                flightsListBackup = []
              }, 5000);
            })
            .catch((e) => {
              console.log('Error: ' + e);
            });
        
      }

      

    let RoundTripCard = () => {
        return(
            <>
            <View style={{ flexDirection: 'row', paddingVertical: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                <Image source={{ uri: `${FlightLogo}${selected.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 11 }}>Departing Information</Text>
                <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 11 }}>{travelDetail.calendar}</Text>
            </View>
            {/* Arrow */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14, width: '100%', justifyContent:"center", display:"flex"  }}>
                <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 19 }}>{selected.origin}</Text>
                <View style={{ flexDirection: 'row', width: '57%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                    <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                    <View style={{ position: 'absolute', left: '-5%' }}>
                        <Icon name='caret-back' type='ionicon' color='#0D3283' />
                    </View>
                    <View style={{ position: 'absolute', right: '-5%' }}>
                        <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                    </View>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11, position: 'absolute', left: '40%', top: '80%' }}>{`(${selected.duration})`}</Text>
                </View>
                <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 19 }}>{selected.destination}</Text>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent:"center", display:"flex" }}>
                <View style={{ width: '43%' }}>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.departure}</Text>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.from}</Text>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.stops} stop</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.carry}</Text>
                    </View>
                </View>
                <View style={{ width: '43%', alignItems: 'flex-end' }}>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.arrival}</Text>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.to}</Text>
                </View>
            </View>
            
            <View style={{ width: '100%', height: 1, marginVertical: 24 }}></View>
            <View style={{ flexDirection: 'row', paddingVertical: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                <Image source={{ uri: `${FlightLogo}${selected.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 11 }}>Returning Information</Text>
                <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 11 }}>{travelDetail.returnCal}</Text>
            </View>
            {/* Arrow */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14, width: '100%', justifyContent:"center", display:"flex"  }}>
                <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 19 }}>{selected.originR}</Text>
                <View style={{ flexDirection: 'row', width: '57%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                    <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                    <View style={{ position: 'absolute', left: '-5%' }}>
                        <Icon name='caret-back' type='ionicon' color='#0D3283' />
                    </View>
                    <View style={{ position: 'absolute', right: '-5%' }}>
                        <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                    </View>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11, position: 'absolute', left: '40%', top: '80%' }}>{`(${selected.durationR})`}</Text>
                </View>
                <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 19 }}>{selected.destinationR}</Text>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent:"center", display:"flex" }}>
                <View style={{ width: '43%' }}>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.departureR}</Text>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.fromR}</Text>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.stopsR} stops</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.carryR}</Text>
                    </View>
                </View>
                <View style={{ width: '43%', alignItems: 'flex-end' }}>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.arrivalR}</Text>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>{selected.toR}</Text>
                </View>
               
                
            </View>
            {/* <View style={{marginTop: "6%"}}>
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 11, color: "#0D3283", marginVertical: "2%", marginHorizontal: "1%" }}>Seat Selection summary</Text>
                <CardDivider color='#06122B'/>
                <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: "row", marginTop: "-2%", marginBottom: "8%" }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 11, marginHorizontal: "1%" }}>{selected.from} to {selected.to}</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 11, marginHorizontal: "1%" }}>{selected.to}</Text>
                </View>

                </View> */}
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
            <TimeLine goBack={() => { hideBottomTab('flex'), navigation.navigate('Home'), flightsListBackup = []}} /> 
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
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
                            {travel === "1"? (
                                <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Round trip</Text>
                            ):travel === "2"? (
                                <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Oneway trip</Text>
                            ): travel === "3"? (
                                <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Multicity trip</Text>
                            ) : null
                        }
                        </View>
                        {/* Card title ends here */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
                            <View>
                                <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 4 }}>{`From: ${invoice.onboard} airport`}</Text>
                                <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 4 }}>{`To: ${invoice.offboard} airport`}</Text>
                                <Text style={{ color: '#06122B', fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 4 }}>{`Departure by ${invoice.departure} on ${travelDetail.calendar}`}</Text>
                                {
                                    travel === "1" ? (
                                        <TouchableOpacity onPress={() => setPopup1(true)}>
                                        <Text style={{ color: '#3B78FF', fontFamily: 'poppins-bold', fontSize: 12, marginVertical: 4 }}>
                                            View full Itinerary
                                        </Text>
                                        </TouchableOpacity>
                                    ) : travel === "2" ? (
                                        <TouchableOpacity onPress={() => setPopup1(true)}>
                                        <Text style={{ color: '#3B78FF', fontFamily: 'poppins-bold', fontSize: 12, marginVertical: 4 }}>
                                            View full Itinerary
                                        </Text>
                                        </TouchableOpacity>
                                    ) : travel === "3" ? (
                                        <TouchableOpacity onPress={() => setPopup1(true)}>
                                        <Text style={{ color: '#3B78FF', fontFamily: 'poppins-bold', fontSize: 12, marginVertical: 4 }}>
                                            View full Itinerary
                                        </Text>
                                        </TouchableOpacity>
                                    ) : null
                                    }

                            </View>
                            <TouchableOpacity onPress={()=>setPopup(true)}>
                                <Text style={{ color: '#3B78FF', fontFamily: 'poppins-bold', fontSize: 12, textAlign: 'center' }}>Cancel{"\n"}Reservation?</Text>
                            </TouchableOpacity>

                            <Modal visible={popup} transparent={true}>
                                <ScrollView>
                                    <View style={_confirmation.authCard}>
                                        <Card containerStyle={{ borderRadius: 22,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 }}>
                                            <View>
                                                <View style={{marginLeft: "30%",flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283' }}>Cancel the ticket?</Text>
                                                    <Icon name="close" type='ionicon' color='#3B78FF' size={20} fontFamily='poppins-bold' justifyContent="flex-end" width={100} onPress={() =>setPopup(false)} />
                                                </View>
                                                <Card containerStyle={{borderRadius:10, backgroundColor: "#E7EDFB",shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5}}>
                                                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B', marginBottom: "1%" }}>Cancellation Policy</Text>
                                                    <CardDivider/>
                                                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#06122B' }}>Cancellation mode within 24hr or within specific date wii be given full refund. Otherwise charged may applied or taken from the refund amount.</Text>
                                                </Card>
                                                <View style={_confirmation.cancelButton}>
                                                    <TouchableOpacity style={{ backgroundColor: '#3B78FF', borderRadius: 10, paddingHorizontal: "16%", paddingVertical: 5,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 }}
                                                    onPress={()=>setPopup(false)}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>Payment Summary</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <Card containerStyle={{borderRadius: 10, flexDirection: "column", marginTop: "-10%", zIndex:-10, marginBottom: "5%",shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 }}>
                                                    <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: "5%", marginVertical: "1%" }}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Cost summary</Text>
                                                        {travel === "1"? (
                                                            <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Round trip</Text>
                                                        ):travel === "2"? (
                                                            <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Oneway trip</Text>
                                                        ): travel === "3"? (
                                                            <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Multicity trip</Text>
                                                        ) : null
                        }
                                                    </View>
                                                    <CardDivider color='#06122B'/>
                                                    {
                                                        travelDetail.adult !== 0 ?
                                                        <>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>{`${travelDetail.adult} x adult`}</Text>
                                                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>{`$${parseInt(travelDetail.adult)*reprice.adult_fare}`}</Text>
                                                        </View>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, color: '#0D3283' }}>({`${travelDetail.adult} x ${reprice.adult_fare}`})</Text>
                                                        </View>
                                                        </>:null
                                                    }
                                                    {
                                                        travelDetail.children !== 0 ?
                                                        <>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>{`${travelDetail.children} x children`}</Text>
                                                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>{`$${parseInt(travelDetail.children)*reprice.child_fare}`}</Text>
                                                        </View>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, color: '#0D3283' }}>({`${travelDetail.children} x ${reprice.child_fare}`})</Text>
                                                        </View>
                                                        </>:null
                                                    }
                                                    {
                                                        travelDetail.infant !== 0 ?
                                                        <>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>{`${travelDetail.infant} x infant`}</Text>
                                                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>{`$${parseInt(travelDetail.infant)*reprice.infant_fare}`}</Text>
                                                        </View>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, color: '#0D3283' }}>({`${travelDetail.infant} x ${reprice.infant_fare}`})</Text>
                                                        </View>
                                                        </>:null
                                                    }
                                                        
                                                        
                                                        <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: "2%"}}>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>Tax</Text>
                                                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>{`$${reprice.total_tax}`}</Text>
                                                        </View>
                                                    <CardDivider color='#06122B'/>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: "-1%", marginVertical: "3%"}}>
                                                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Total Charged</Text>
                                                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>{`$${reprice.grand_total}`}</Text>
                                                        </View>
                                                    <CardDivider color='#06122B'/>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: "-1%", marginVertical: "3%"}}>
                                                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#15A209' }}>Total refund</Text>
                                                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#15A209' }}>{`$${reprice.grand_total}`}</Text>
                                                        </View>
                                                    <CardDivider color='#06122B'/>
                                                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283', marginTop: "-1%", marginVertical: "3%" }}>Are you sure want to cancel this ticket ?</Text>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between", width: "50%", marginVertical: "3%"}}>
                                                                <TouchableOpacity style={{ backgroundColor: '#3B78FF', borderRadius: 10, width: "42%", height: 25, justifyContent: "center", alignItems: "center" }}
                                                                onPress={CancelTickets}>
                                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 17, color: 'white' }}>Yes</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity style={{ backgroundColor: '#3B78FF', borderRadius: 10, width: "42%", height: 25, justifyContent: "center", alignItems: "center" }}
                                                                onPress={()=>setPopup(false)}>
                                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 17, color: 'white' }}>No</Text>
                                                                </TouchableOpacity>
                                                        </View>

                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>By clicking yes, I understand this will permanently cancel my ticket. If you wish to cancel some but not all passengers, please contact customer care</Text>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: "1%" }}>
                                                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginTop: "4%" }}>Need help?</Text>
                                                        <View style={{display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 8, color: '#0D3283', marginTop: "22%" }}>Customer care</Text>
                                                        </View>
                                                        </View>
                                                    <CardDivider color='#06122B'/>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 7, color: '#0D3283', marginTop: "2%" }}>Give us a call</Text>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: "1%"}}>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 7, color: '#0D3283' }}>From united states</Text>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 8, color: '#0D3283' }}>(855) 650-FIKA</Text>
                                                        </View>
                                                        <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: "1%"}}>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 8, color: '#0D3283' }}>From other countries</Text>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 8, color: '#0D3283' }}>(855) 650-FIKA</Text>
                                                        </View>
                                                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 7, color: '#0D3283', width: "75%",marginVertical: "1%" }}>(Note: To talk to the customer care, you need ticket number and Booking reference number in hand)</Text>
                                                </Card>
                                            </View>
                                            
                                        </Card>
                                        
                                    </View>
                                </ScrollView>
                            </Modal>
                            <Modal visible={yess} transparent={true}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

                                    <View style={_confirmation.authCard1}>
                                    <View style={_confirmation.cancelButton1}>
                                        <TouchableOpacity style={{width: "93%", backgroundColor: '#3B78FF', borderRadius: 10, paddingHorizontal: 50, paddingVertical: 5,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 }}
                                         onPress={()=>setYess(false)}>
                                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>Cancellation Successful</Text>
                                        </TouchableOpacity>
                                    </View>
                                        <Card containerStyle={{ zIndex:-1,marginTop: "-10%",borderRadius: 22,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 }}>
                                            <View>
                                               
                                                <View style={{justifyContent: "center", alignItems: "center", marginTop: "17%", marginBottom: "7%"}}>
                                                <Image source={require('../../assets/checked.png')} style={{ height: 63, width: 63}} />
                                                </View>
                                                <View style={{textAlign: "center"}}>
                                                    <Text style={{fontSize: 12, fontFamily: "poppins-regular", textAlign:"center"}}>Your tickets has been cancelled successfully. Please check</Text>
                                                    <Text style={{fontSize: 12, fontFamily: "poppins-regular", textAlign:"center"}}>your bank account for refund.Your refund money </Text>
                                                    <Text style={{fontSize: 12, fontFamily: "poppins-regular", textAlign:"center"}}>will be generated witin 48 hours.</Text>
                                                    <Text style={{fontSize: 12, fontFamily: "poppins-regular", textAlign:"center", marginVertical: "5%", marginBottom: "7%"}}>Thank you for using Travelfika</Text>
                                                </View>
                                                
                                            </View>
                                            
                                        </Card>
                                        
                                    </View>
                                    </View>

                            </Modal>
                            {travel === "1"? (
                                <Modal visible={popup1} transparent={true}>
                                    <ScrollView>
                                        <View style={_confirmation.authCard}>
                                            <Card containerStyle={{marginTop: "50%", borderRadius: 22,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 }}>
                                            <View>
                                                <View style={{marginLeft: "30%", marginTop: "-1%", marginVertical: "2%",flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283' }}>View full Itinerary</Text>
                                                    <Icon name="close" type='ionicon' color='#3B78FF' size={20} fontFamily='poppins-bold' justifyContent="flex-end" width={100} onPress={() =>setPopup1(false)} />
                                                </View>
                                                <CardDivider color='#06122B'/>
                                                <Text style={{textAlign: "center", fontFamily: 'poppins-bold', fontSize: 12, color: "#0D3283", marginTop:'-1%'}}>Flight information</Text>
                                                <Card containerStyle={{borderRadius: 22, marginHorizontal: "1%", marginTop:"9%", marginBottom: "12%",shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5}}>
                                                
                                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                                                    <Image source={{ uri: `${FlightLogo}${selected.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 9 }}>Departing Information</Text>
                                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 9 }}>{travelDetail.calendar}</Text>
                                                </View>
                                                {/* Arrow */}
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
                                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 17 }}>{selected.origin}</Text>
                                                    <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                                                        <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                                                        <View style={{ position: 'absolute', left: '-5%' }}>
                                                            <Icon name='caret-back' type='ionicon' color='#0D3283' />
                                                        </View>
                                                        <View style={{ position: 'absolute', right: '-5%' }}>
                                                            <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                                                        </View>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, position: 'absolute', left: '40%', top: '80%' }}>{`(${selected.duration})`}</Text>
                                                    </View>
                                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 17 }}>{selected.destination}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                                    <View style={{ width: '50%' }}>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 9}}>{selected.departure}</Text>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize:  9 }}>{selected.from}</Text>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize:  9 }}>{selected.stops} stop</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize:  9 }}>{selected.carry}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize:  9 }}>{selected.arrival}</Text>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize:  9 }}>{selected.to}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ width: '100%', height: 1, marginVertical: 24 }}></View>
                                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                                                    <Image source={{ uri: `${FlightLogo}${selected.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize:  9 }}>Returning Information</Text>
                                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize:  9 }}>{travelDetail.returnCal}</Text>
                                                </View>
                                                {/* Arrow */}
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
                                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 17 }}>{selected.originR}</Text>
                                                    <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                                                        <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                                                        <View style={{ position: 'absolute', left: '-5%' }}>
                                                            <Icon name='caret-back' type='ionicon' color='#0D3283' />
                                                        </View>
                                                        <View style={{ position: 'absolute', right: '-5%' }}>
                                                            <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                                                        </View>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, position: 'absolute', left: '40%', top: '80%' }}>{`(${selected.durationR})`}</Text>
                                                    </View>
                                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 17 }}>{selected.destinationR}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                                    <View style={{ width: '50%' }}>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 9 }}>{selected.departureR}</Text>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 9 }}>{selected.fromR}</Text>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 9 }}>{selected.stopsR} stops</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 9 }}>{selected.carryR}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 9 }}>{selected.arrivalR}</Text>
                                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 9 }}>{selected.toR}</Text>
                                                    </View>
                                                </View>
                                                <View style={{marginTop: "6%", marginHorizontal: "-2%"}}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 9, color: "#0D3283", marginVertical: "2%", marginHorizontal: "1%" }}>Seat Selection summary</Text>
                                                        <CardDivider color='#06122B'/>
                                                        <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: "row", marginTop: "-2%", marginBottom: "8%" }}>
                                                                <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, marginHorizontal: "1%" }}>{selected.from} to {selected.to}</Text>
                                                                <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, marginHorizontal: "1%" }}>{selected.to}</Text>
                                                        </View>

                                                </View>
                                                </Card>

                                               
                                                </View>
                                                
                                            </Card>
                                            
                                        </View>
                                    </ScrollView>
                                </Modal>
                            ): travel === "2"? (
                                <Modal visible={popup1} transparent={true}>
                                <ScrollView>
                                    <View style={_confirmation.authCard}>
                                        <Card containerStyle={{marginTop: "50%", borderRadius: 22,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 }}>
                                            <View>
                                                <View style={{marginLeft: "30%", marginTop: "-1%", marginVertical: "2%",flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283' }}>View full Itinerary</Text>
                                                    <Icon name="close" type='ionicon' color='#3B78FF' size={20} fontFamily='poppins-bold' justifyContent="flex-end" width={100} onPress={() =>setPopup1(false)} />
                                                </View>
                                                <CardDivider color='#06122B'/>
                                                <Text style={{textAlign: "center", fontFamily: 'poppins-bold', fontSize: 12, color: "#0D3283", marginTop:'-1%'}}>Flight information</Text>

                                                <Card containerStyle={{borderRadius: 22, marginHorizontal: "1%", marginTop:"9%", marginBottom: "12%",shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5}}>
                                                <View >
                                                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: "1%"  }}>
                                                        <Image source={{ uri: `${FlightLogo}${selected.flight_logo}.gif.gif` }} style={{ width: 50, height: 30 }} />
                                                        <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 9 }}>{travelDetail.calendar}</Text>
                                                    </View>
                                                    {/* Arrow */}
                                                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', marginVertical: 14, justifyContent: 'space-around', marginHorizontal: "1%"  }}>
                                                        <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 17 }}>{selected.origin}</Text>
                                                        <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                                                            <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                                                            <View style={{ position: 'absolute', left: '-5%' }}>
                                                                <Icon name='caret-back' type='ionicon' color='#0D3283' size={20} />
                                                            </View>
                                                            <View style={{ position: 'absolute', right: '-5%' }}>
                                                                <Icon name='caret-forward' type='ionicon' color='#0D3283'size={20}  />
                                                            </View>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, position: 'absolute', left: '33%', top: '80%' }}>{`(${selected.duration})`}</Text>
                                                        </View>
                                                        <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 17 }}>{selected.destination}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', width: '100%', paddingRight:"2%" }}>
                                                        <View style={{ width: '50%' }}>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, marginHorizontal: "1%"  }}>{selected.departure}</Text>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, marginHorizontal: "1%"  }}>{selected.from}</Text>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, marginHorizontal: "1%"  }}>{selected.stops} stop</Text>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Icon name='luggage' type='material' color='#3B78FF' size={11}/>
                                                                <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, marginHorizontal: "1%" }}>{selected.carry}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ width: '53%', alignItems: 'flex-end' }}>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, marginHorizontal: "1%", textAlign: 'left' }}>{selected.arrival}</Text>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, marginHorizontal: "1%", textAlign: 'left' }}>{selected.to}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{marginTop: "6%", marginHorizontal: "-2%"}}>
                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 9, color: "#0D3283", marginVertical: "2%", marginHorizontal: "1%" }}>Seat Selection summary</Text>
                                                    <CardDivider color='#06122B'/>
                                                    <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: "row", marginTop: "-2%", marginBottom: "8%" }}>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, marginHorizontal: "1%" }}>{selected.from} to {selected.to}</Text>
                                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 9, marginHorizontal: "1%" }}>{selected.to}</Text>
                                                    </View>

                                                    </View>
                                                
                                                    

                                                </View>
                                                </Card>

                                                
                                            </View>
                                            
                                        </Card>
                                        
                                    </View>
                                </ScrollView>
                                </Modal>
                            ) : null
                            }
                            <Modal visible={popup2} transparent={true}>
                                <ScrollView>
                                    <View style={_confirmation.authCard}>
                                        <Card containerStyle={{borderRadius: 22,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 }}>
                                            <View style={{width: "100%", justifyContent: "center"}}>
                                                <View style={{ flex: 1, marginVertical: "2%", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', textAlign: "center", marginLeft:"3%" }}>Identification and Documentation Requirements</Text>
                                                    <Icon name="close" type='ionicon' color='#3B78FF' size={20} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50} onPress={() => setPopup2(false)} />
                                                </View>
                                                <CardDivider color='#06122B'/>
                                                <View>
                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "3%", marginTop:"1%" }}>Identification and Documentation Requirements</Text>
                                                    <Text>Lorem Ipsum has been the industry's  survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more</Text>
                                                    <View style={{marginTop:"4%", marginBottom: "2%"}}>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    
                                                    </View>

                                                </View>
                                                <View>
                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "3%", marginTop:"1%" }}>Identification and Documentation Requirements</Text>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    
                                                </View>
                                                <View>
                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "3%", marginTop:"1%" }}>International Travel-Adults and children</Text>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    
                                                </View>
                                                <View>
                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "3%", marginTop:"1%" }}>Other Required Documents</Text>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                </View>
                                                <View>
                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "3%", marginTop:"1%" }}>What I do if I last my ID ?</Text>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='#06122B' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <View style={{flexDirection: "row", marginBottom:"2%"}}>
                                                    <Icon name="ellipse" type='ionicon' color='white' justifyContent="center" size={9} fontFamily='poppins-bold' alignItems="flex-start" marginTop="-15%" height={50}  />
                                                    <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12, marginLeft: "1%"}}>Lorem Ipsum has been the industry's  survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more</Text>
                                                    </View>
                                                </View>

                                            </View>
                                            
                                        </Card>
                                        
                                    </View>
                                </ScrollView>
                            </Modal>
                            <Modal visible={popup3} transparent={true}>
                                <ScrollView>
                                    <View style={_confirmation.authCard}>
                                        <Card containerStyle={{borderRadius: 22,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 }}>
                                            <View style={{width: "100%", justifyContent: "center"}}>
                                                <View style={{ flex: 1, marginVertical: "2%", flexDirection: "row", alignItems: "center", justifyContent: "center", marginLeft:"10%"}}>
                                                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', textAlign: "center", marginLeft:"2%" }}>Frequently asked question</Text>
                                                    <Icon name="close" type='ionicon' color='#3B78FF' size={20} fontFamily='poppins-bold' marginLeft="2%" width={50} onPress={() =>setPopup3(false)} />
                                                </View>
                                                <CardDivider color='#06122B'/>
                                                <View style={{marginVertical:"1%"}}>
                                                    <View style={{marginVertical: "4%", marginTop:"1%"}}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "2%" }}>How do I print my receipt ?</Text>
                                                        <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <CardDivider color='#06122B'/>
                                                    <View style={{marginVertical: "4%", marginTop:"1%"}}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "2%" }}>How do I print my receipt ?</Text>
                                                        <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <CardDivider color='#06122B'/>
                                                    <View style={{marginVertical: "4%", marginTop:"1%"}}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "2%" }}>How do I print my receipt ?</Text>
                                                        <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <CardDivider color='#06122B'/>
                                                    <View style={{marginVertical: "4%", marginTop:"1%"}}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "2%" }}>How do I print my receipt ?</Text>
                                                        <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <CardDivider color='#06122B'/>
                                                    <View style={{marginVertical: "4%", marginTop:"1%"}}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "2%" }}>How do I print my receipt ?</Text>
                                                        <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <CardDivider color='#06122B'/>
                                                    <View style={{marginVertical: "4%", marginTop:"1%"}}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "2%" }}>How do I print my receipt ?</Text>
                                                        <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <CardDivider color='#06122B'/>
                                                    <View style={{marginVertical: "4%", marginTop:"1%"}}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "2%" }}>How do I print my receipt ?</Text>
                                                        <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <CardDivider color='#06122B'/>
                                                    <View style={{marginVertical: "4%", marginTop:"1%"}}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "2%" }}>How do I print my receipt ?</Text>
                                                        <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <CardDivider color='#06122B'/>
                                                    <View style={{marginVertical: "4%", marginTop:"1%"}}>
                                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', marginBottom: "2%" }}>How do I print my receipt ?</Text>
                                                        <Text style={{width:"87%",fontFamily: 'poppins-regular', fontSize: 12}} >Lorem Ipsum has been the industry's survived not only five centuries, but also the leap into electronic setting, remaining essentially unchanged. It </Text>
                                                    </View>
                                                    <CardDivider color='#06122B'/>

                                                    
                                                    

                                                </View>
                                                

                                            </View>
                                            
                                        </Card>
                                        
                                        
                                    </View>
                                </ScrollView>
                            </Modal>
                            
                        </View>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Flight Itinerary Information</Text>
                        </View>
                        {/* Flight Info start here */}
                        { travel === '1' ? <RoundTripCard /> : <OneWayCard />}
                        {/* Flight Info ends here */}

                    </View>
                    {/* Seat summary starts here */}
                    
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
                            <TouchableOpacity onPress={()=>setPopup2(true)}>
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
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.calendar}</Text>
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
                        <TouchableOpacity onPress={() => setPopup3(true)}>
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
        flex: 1,
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
    authCard: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        paddingVertical: 10,
    },
    authCard1: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        paddingVertical: 10,
        marginBottom:"95%",
    },
    cancelButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    cancelButton1: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})