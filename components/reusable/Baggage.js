import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal } from 'react-native'
import { Icon, Card } from '@rneui/themed';
import React, { useEffect, useState, useContext } from 'react'
import { globalState } from '../../App';
import TimeLine from './TimeLine';
import LottieView from 'lottie-react-native';
import { FlightLogo } from '../endpoint/Endpoint';
import axios from 'axios';
import { FlightReprice } from '../endpoint/Endpoint';

export default function Baggage({ navigation }){

    let { bottomTab, hideBottomTab, 
        travel, setTravel, 
        travelDetail, setTravelDetail, 
        selected, setSelected, 
        reprice, setReprice } = useContext(globalState)
    let [popup, setPopup] = useState(false)
    let [baginfo, setBaginfo] = useState([])
    let [infocard, setInfocard] = useState(false)
    let [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log(selected.itenerary_id);

        let promise = new Promise((resolve, reject) => {
            axios.post(`${FlightReprice}${selected.itenerary_id}`, {
                AdultCount: travelDetail.adult,
                ChildCount: travelDetail.children,
                InfantCount: travelDetail.infant
            })
            .then((response) => {
                setReprice({})
                let loop = response.data.Fares.reprice.Result.FareBreakdown
                let adultFare = 0
                let childFare = 0
                let infantFare = 0
                loop.map((ele) => {
                    if(ele.PassengerType == 'ADT'){
                        adultFare = ele.GrossFare
                        setReprice(prevPrice => ({
                            ...prevPrice,
                            adult_fare: ele.GrossFare + 2
                        }))
                    }
                    else if(ele.PassengerType == 'CHD'){
                        childFare = ele.GrossFare
                        setReprice(prevPrice => ({
                            ...prevPrice,
                            child_fare: ele.GrossFare + 2
                        }))
                    }
                    else if(ele.PassengerType == 'INF'){
                        infantFare = ele.GrossFare
                        setReprice(prevPrice => ({
                            ...prevPrice,
                            infant_fare: ele.GrossFare + 2
                        }))
                    }
                })
    
                let af = adultFare * travelDetail.adult
                let cf = childFare * travelDetail.children
                let inf = infantFare * travelDetail.infant

                console.log('Adult Fare: ' + af);
                console.log('Child Fare: ' + cf);
                console.log('Infant Fare: ' + inf)

                let acinf = af + cf + inf + 2 * travelDetail.passengers

                console.log('Combined: ' + acinf);
    
                let totalTax = acinf / 100 * 3

                console.log('Tax: ' + totalTax);

                let grandTotal = acinf + totalTax
                console.log('Grand Total: ' + grandTotal);
    
                setReprice(prevPrice => ({
                    ...prevPrice,
                    total_tax: Math.round(totalTax),
                    grand_total: Math.round(grandTotal)
                }))
                resolve('success')
            })
            .catch((err) => {
                console.log('Error: ' + err);
                reject(err)
            })
    
            setBaginfo([])
            Object.keys(selected.baggage).map((ele) => {
                if(selected.baggage[ele][1] != undefined){
                    setBaginfo(prevInfo => [
                        ...prevInfo,
                        {
                            flight: ele,
                            type_a: selected.baggage[ele][0]['type'],
                            allow_a: selected.baggage[ele][0]['noOfPieces'],
                            type_b: selected.baggage[ele][1]['type'],
                            allow_b: selected.baggage[ele][1]['noOfPieces']
                        }
                    ])
                }
                else{
                    setBaginfo(prevInfo => [
                        ...prevInfo,
                        {
                            flight: ele,
                            type_a: selected.baggage[ele][0]['type'],
                            allow_a: selected.baggage[ele][0]['noOfPieces'],
                            type_b: null,
                            allow_b: null
                        }
                    ])
                }
            })
        })
        .then((res) => {
            setLoading(false)
        })
        .catch((e) => {
            console.log('Promise Error: ' + e);
        })
    }, [])

    let RoundTripCard = () => {
        return(
            <Card containerStyle={{ borderRadius: 22, padding: 0 }}>
                <View style={{ marginHorizontal: 12 }}>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Image source={{ uri: `${FlightLogo}${selected.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Departing Information</Text>
                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.calendar}</Text>
                </View>
                {/* Arrow */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
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
                <View style={{ width: '100%', height: 1, marginVertical: 24 }}></View>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Image source={{ uri: `${FlightLogo}${selected.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Returning Information</Text>
                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.returnCal}</Text>
                </View>
                {/* Arrow */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{selected.originR}</Text>
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
                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{selected.destinationR}</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.departureR}</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.fromR}</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.stopsR} stops</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.carryR}</Text>
                        </View>
                    </View>
                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.arrivalR}</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{selected.toR}</Text>
                    </View>
                </View>
                </View>
                <View style={{ width: '100%', backgroundColor: '#E7EDFB', marginTop: 20, paddingTop: 10, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                    <View>
                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                            <Icon name='checkmark' type='ionicon' color='#15A209' size={20}/>
                            <Text style={{ fontFamily: 'poppins-bold', color: '#15A209', marginLeft: 4, fontSize: 12 }}>{selected.cancellation}</Text>
                        </View>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>{selected.classR === 'E' ? 'Economy':'Business'}</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>Round trip per person</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 25, color: '#3B78FF' }}>{`$${selected.price}`}</Text>
                    </View>
                </View>
            </Card>
        )
    }
    
    let OneWayCard = () => {
        return(
            <Card containerStyle={{ borderRadius: 22, padding: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5  }}>
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
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 25, color: '#3B78FF' }}>{`$${selected.price}`}</Text>
                    </View>
                </View>
            </Card>
        )
    }

    return(
        <View style={_baggage.container}>
            <TimeLine goBack={()=>{
                if(travel === '1'){
                    navigation.navigate('RoundTripFlights')
                }
                else if(travel === '2'){
                    navigation.navigate('OneWayFlights')
                }
            }}/>
            {
                loading == false ?
                <>
                <ScrollView>
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>Flight Selection</Text>
                { travel === '1' ? <RoundTripCard />:<OneWayCard />}

                {/* Baggage info starts here */}
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: '#0D3283', marginLeft: 18, marginTop: 18 }}>Baggage Information</Text>
                <Card containerStyle={{ borderRadius: 22,shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 3  }}>
                    <View style={_baggage.cardHeader}>
                        <Image source={{ uri: `${FlightLogo}${selected.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                        <TouchableOpacity onPress={() => setInfocard(!infocard ? true : false)}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#3B78FF' }}>More details {">"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>Personal item</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>Included</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>Carry-on Bag</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>Included</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>Check-in Bag</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>Included</Text>
                    </View>
                </Card>
                {/* Baggage info ends here */}

                {/* Baggage collapse starts here */}
                <Card containerStyle={{ borderRadius: 22, display: infocard ? 'flex':'none', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 3  }}>
                    <View style={_baggage.cardHeader}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', width: '33.3%', textAlign: 'left' }}>Flight</Text>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', width: '33.3%', textAlign: 'center' }}>Type</Text>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283', width: '33.3%', textAlign: 'right' }}>Allowance</Text>
                    </View>
                    {
                        baginfo.map((einfo, i) => (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }} key={i}>
                                <View style={{ width: '33.3%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>{einfo.flight}</Text>
                                </View>
                                <View style={{ width: '33.3%', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>{einfo.type_a}</Text>
                                    {
                                        einfo.type_b != null ?
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>{einfo.type_b}</Text>:null
                                    }
                                </View>
                                <View style={{ width: '33.3%', alignItems: 'flex-end' }}>
                                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>{einfo.allow_a}</Text>
                                    {
                                        einfo.allow_b != null ?
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, color: '#0D3283' }}>{einfo.allow_b}</Text>:null
                                    }
                                </View>
                            </View>
                        ))
                    }
                </Card>
                {/* Baggage collapse ends here */}
                <View style={[_baggage.paymentButton, { display: popup ? 'none' : 'flex' }]}>
                    <TouchableOpacity style={{ backgroundColor: '#15A209', marginVertical: 20, paddingVertical: 10, paddingHorizontal: 70, borderRadius: 10, elevation: 2 }}
                    onPress={()=>setPopup(true)}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>Continue Payment</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal visible={popup} transparent={true}>
                <View style={_baggage.authCard}>
                    <Card containerStyle={{ borderRadius: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 4, elevation: 3  }}>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Sign in</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1.5, backgroundColor: '#D9D9D9' }}></View>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'center' }}
                        onPress={()=>{
                            hideBottomTab('none')
                            setPopup(false)
                            navigation.navigate('Passenger')
                        }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Continue as guest</Text>
                        </TouchableOpacity>
                    </Card>
                    <View style={_baggage.cancelButton}>
                        <TouchableOpacity style={{ backgroundColor: '#3B78FF', borderRadius: 10, paddingHorizontal: 100, paddingVertical: 10 }}
                        onPress={()=>setPopup(false)}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal></>:
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
                autoPlay
                style={{
                width: 200,
                height: 200,
                backgroundColor: 'white',
                }}
                source={require('../../assets/repriceLoading.json')}
                />
            </View>
            }
        </View>
    )
}

let _baggage = StyleSheet.create({
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
    paymentButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    authCard: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        paddingVertical: 10
    },
    cancelButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    }
})