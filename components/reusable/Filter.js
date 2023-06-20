import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { Icon, Card, Slider } from '@rneui/themed';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { globalState } from '../../App';
import { FlightLogo } from '../endpoint/Endpoint';

//source={{ uri: `${FlightLogo}${item.flight_logo}.gif` }}

let flight = null

export default function Filter({ navigation }){

    let { range, setRange,
          applyFilter, updateFilter } = useContext(globalState)
    let [tripTime, setTripTime] = useState(0)
    let [priceRange, setPriceRange] = useState(0)
    let [depTime, setDepTime] = useState(0)
    let [flight, setFlight] = useState(null)

    let flightsList = useRef(range.flight)

    useEffect(() => {
        setTripTime(range.trip_max)
        setPriceRange(range.price_max)
        setDepTime(range.time_max)
    }, [])

    return(
        <View style={_filter.container}>
            <View style={_filter.header}>
                <TouchableOpacity style={{ marginHorizontal: 16 }} onPress={()=>navigation.navigate('OneWayFlights')}>
                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: 'white' }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 22, color: 'white' }}>Filter</Text>
                <TouchableOpacity style={{ marginHorizontal: 16 }} onPress={()=>{
                    setTripTime(range.trip_max)
                    setPriceRange(range.price_max)
                    setDepTime(range.time_max)
                }}>
                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: 'white' }}>Reset all</Text>
                </TouchableOpacity>
            </View>
            <View style={_filter.countBar}>
                <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{`${range.flights_count} Flights available`}</Text>
            </View>
            <ScrollView>
                {/* Trip time card */}
                <Card containerStyle={{ borderRadius: 22 }}>
                    <View style={_filter.cardHeader}>
                        <TouchableOpacity>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Trip time</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setTripTime(range.trip_min)}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={_filter.sliderWrapper}>
                        <Slider
                            value={tripTime}
                            maximumValue={range.trip_max}
                            minimumValue={range.trip_min}
                            onValueChange={(value)=>{
                                setTripTime(value)
                                //console.log('Trip Time: ' + value);
                            }}
                            step={1}
                            allowTouchTrack
                            minimumTrackTintColor='#3B78FF'
                            trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                            thumbStyle={{ height: 20, width: 20, backgroundColor: '#FFFFFF', elevation: 6 }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{`${range.trip_min} hours`}</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{`${range.trip_max} hours`}</Text>
                        </View>
                    </View>
                </Card>

                {/* Stops card */}
                {
                    (range.stop_max > range.stop_min) ?
                    <Card containerStyle={{ borderRadius: 22 }}>
                        <View style={_filter.cardHeader}>
                            <TouchableOpacity>
                                <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>No of stops</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setTripTime(0)}>
                                <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Non stop</Text>
                                <Icon name='checkmark-sharp' type='ionicon' color='#3B78FF' />
                            </TouchableOpacity>
                            <View style={{ height: 1.5, width: '100%', backgroundColor: '#DBDBDB' }}></View>
                            <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>1 stop</Text>
                                <Icon name='checkmark-sharp' type='ionicon' color='#3B78FF' />
                            </TouchableOpacity>
                            <View style={{ height: 1.5, width: '100%', backgroundColor: '#DBDBDB' }}></View>
                            <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>2 stop</Text>
                                <Icon name='checkmark-sharp' type='ionicon' color='#3B78FF' />
                            </TouchableOpacity>
                            <View style={{ height: 1.5, width: '100%', backgroundColor: '#DBDBDB' }}></View>
                            <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>All options</Text>
                                <Icon name='checkmark-sharp' type='ionicon' color='#3B78FF' />
                            </TouchableOpacity>
                        </View>
                    </Card>:
                    <Card containerStyle={{ borderRadius: 22 }}>
                        <View style={_filter.cardHeader}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>No of stops</Text>
                        </View>
                        <View>
                            <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{`${range.stop_max} stop`}</Text>
                                <Icon name='checkmark-sharp' type='ionicon' color='#3B78FF' />
                            </TouchableOpacity>
                        </View>
                    </Card>
                }

                {/* Price range card */}
                <Card containerStyle={{ borderRadius: 22 }}>
                    <View style={_filter.cardHeader}>
                        <TouchableOpacity>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Price range</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setPriceRange(range.price_min)}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={_filter.sliderWrapper}>
                        <Slider
                            value={priceRange}
                            maximumValue={range.price_max}
                            minimumValue={range.price_min}
                            onValueChange={(price)=>{
                                setPriceRange(price)
                                //console.log('Price Range: ' + price);
                            }}
                            step={1}
                            allowTouchTrack
                            minimumTrackTintColor='#3B78FF'
                            trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                            thumbStyle={{ height: 20, width: 20, backgroundColor: '#FFFFFF', elevation: 6 }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'center' }}>${range.price_min}{"\n"}Min price</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'center' }}>${range.price_max}{"\n"}Max price</Text>
                        </View>
                    </View>
                </Card>

                {/* Flight timings card */}
                <Card containerStyle={{ borderRadius: 22 }}>
                    <View style={_filter.cardHeader}>
                        <TouchableOpacity>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Flight timings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setDepTime(range.time_min)}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={_filter.sliderWrapper}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'center' }}>Departure Flight time</Text>
                            {/*
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'center' }}>LHR - JFK</Text>
                            */}
                        </View>
                        <Slider
                            value={depTime}
                            maximumValue={range.time_max}
                            minimumValue={range.time_min}
                            onValueChange={(time)=>{
                                setDepTime(time)
                                //console.log('Flight Time: ' + depTime);
                            }}
                            step={1}
                            allowTouchTrack
                            minimumTrackTintColor='#3B78FF'
                            trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                            thumbStyle={{ height: 20, width: 20, backgroundColor: '#FFFFFF', elevation: 6 }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'center' }}>{`${range.time_min}:00`}</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'center' }}>{`${range.time_max}:00`}</Text>
                        </View>
                    </View>
                    {/*
                    <View style={{ height: 1.5, width: '100%', backgroundColor: '#DBDBDB' }}></View>
                    <View style={_filter.sliderWrapper}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'center' }}>Returning Flight time</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'center' }}>JFK - LHR</Text>
                        </View>
                        <Slider
                            value={priceRange}
                            maximumValue={range.time_max}
                            minimumValue={range.time_min}
                            onValueChange={(price)=>{
                                setPriceRange(price)
                                console.log(price);
                            }}
                            step={1}
                            allowTouchTrack
                            minimumTrackTintColor='#3B78FF'
                            trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                            thumbStyle={{ height: 20, width: 20, backgroundColor: '#FFFFFF', elevation: 6 }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'center' }}>0:00</Text>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, textAlign: 'center' }}>24:00</Text>
                        </View>
                    </View>
                    */}
                </Card>

                {/* Airlines card */}
                <Card containerStyle={{ borderRadius: 22 }}>
                    <View style={_filter.cardHeader}>
                        <TouchableOpacity>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Airlines</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setTripTime(0)}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 12, color: '#0D3283' }}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View>
                        {
                            flightsList.current.map((data, i) => (
                            <>
                                <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between' }}
                                onPress={() => setFlight(data)}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {/*
                                        <Image source={require('../../assets/airways.png')} style={{ width: 60, resizeMode: 'contain' }} />
                                        */}
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginLeft: 6 }}>{data}</Text>
                                    </View>
                                    <Icon name='checkmark-sharp' type='ionicon' color={flight === data ? '#3B78FF' : 'white'} />
                                </TouchableOpacity>
                                <View style={{ height: 1.5, width: '100%', backgroundColor: '#DBDBDB' }} key={i}></View>
                            </>
                            ))
                        }
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginLeft: 6 }}>All Airlines</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color={flight === 'All Airlines' ? '#3B78FF' : 'white'} />
                        </TouchableOpacity>
                    </View>
                </Card>
                <View style={_filter.button}>
                    <TouchableOpacity style={{ backgroundColor: '#3B78FF', borderRadius: 10, paddingHorizontal: 100, paddingVertical: 10 }}
                    onPress={()=>{
                        updateFilter({
                            tripTime: tripTime,
                            priceRange: priceRange,
                            depTime: depTime,
                            flight: flight
                        })
                        navigation.navigate('OneWayFlights')
                    }}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

let _filter = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    header: {
        width: '100%',
        height: '5%',
        flexDirection: 'row',
        backgroundColor: '#3B78FF',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    countBar: {
        width: '100%',
        height: '3%',
        backgroundColor: '#E7EDFB',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2
    },
    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#DBDBDB',
        paddingBottom: 8
    },
    sliderWrapper: {
        width: '100%',
        marginVertical: 18
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 24
    }
})