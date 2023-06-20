import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, FlatList } from 'react-native';
import { Icon, Card } from '@rneui/themed';
import React, { useState, useEffect, useContext } from 'react';
import { globalState } from '../../App';
import TimeLine from './TimeLine';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { FlightSearchUrl, FlightLogo } from '../endpoint/Endpoint'

let flightsListBackup = []

export default function OneWayFlights({ navigation }){

    let { bottomTab, hideBottomTab, 
        travelDetail, setTravelDetail, 
        orides, setOrides, 
        selected, setSelected,
        range, setRange,
        applyFilter, updateFilter } = useContext(globalState)
    let [sort, setSort] = useState(false)
    let [loading, setLoading] = useState(true)
    let [flightInfo, setFlightInfo] = useState([])

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

    /* Fetch data from server (API) */
    useEffect(() => {
        let loadData = new Promise((resolve, reject) => {
            let itineraryList = []
            axios.post(FlightSearchUrl, orides)
            
            .then((response) => {
                let resultedItinerary = response.data.result.SearchResult
                resultedItinerary.map((itineraries) => {
                    itineraryList.push(itineraries)
                })
    
                itineraryList.map((flightsList, i) => {

                    let dosplitup = () => {
                        let extract = []
                        if(travelDetail.passengers > 1){
                            flightsList.FareBreakdown.map((ele) => {
                                extract.push({
                                    type: ele.PassengerType,
                                    fare: ele.GrossFare
                                })
                            })
                            return extract
                        }
                        else{
                            return []
                        }
                    }

                    let metadata = {
                        origin: flightsList.Itinerary[0].OriginDestination[0].OriginCode,
                        destination: flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].DestinationCode,
                        departure: dateProcessor(flightsList.Itinerary[0].OriginDestination[0].DepartureTime),
                        arrival: dateProcessor(flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].ArrivalTime),
                        duration: flightsList.Itinerary[0].JourneyInfo.TotalTravelDurationInMinutes,
                        minutes: Math.round(Number(flightsList.Itinerary[0].JourneyInfo.totalDurationInMinutes) / 60),
                        from: flightsList.Itinerary[0].OriginDestination[0].OriginAirportName,
                        to: flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].DestinationAirportName,
                        stops: flightsList.Itinerary[0].JourneyInfo.NoOfStop,
                        carry: 'Carry-on bag included',
                        price: Math.round(Number(flightsList.GrossFare)),
                        departure_raw: Number(new Date(flightsList.Itinerary[0].OriginDestination[0].DepartureTime).getHours()),
                        class: flightsList.Itinerary[0].OriginDestination[0].CabinClass,
                        cancellation: flightsList.cancellation,
                        baggage: flightsList.FareBreakdown[0].BaggageAllowance,
                        flight_logo: flightsList.Itinerary[0].OriginDestination[0].MarketingAirline,
                        flight_name: flightsList.Itinerary[0].OriginDestination[0].MarketingAirlineName,
                        itenerary_id: flightsList.IteneraryRefID,
                        total_tax: flightsList.TotalTax,
                        fare_splitup: dosplitup(),
                        adult_fare: flightsList.FareBreakdown[0] !== undefined ? flightsList.FareBreakdown[0].GrossFare : null,
                        child_fare: flightsList.FareBreakdown[1] !== undefined ? flightsList.FareBreakdown[1].GrossFare : null,
                        infant_fare: flightsList.FareBreakdown[2] !== undefined ? flightsList.FareBreakdown[2].GrossFare : null,
                        search_id: response.data.result.SearchID
                    }

                    setFlightInfo(prevList => [
                        ...prevList,
                        metadata
                    ])

                    flightsListBackup.push(metadata)
                })
                setRange(prevRange => ({
                    ...prevRange,
                    flights_count: flightsListBackup.length,
                    trip_min: Math.min(...flightsListBackup.map(item => item.minutes)),
                    trip_max: Math.max(...flightsListBackup.map(item => item.minutes)),
                    price_min: Math.min(...flightsListBackup.map(item => item.price)),
                    price_max: Math.max(...flightsListBackup.map(item => item.price)),
                    time_min: Math.min(...flightsListBackup.map(item => item.departure_raw)),
                    time_max: Math.max(...flightsListBackup.map(item => item.departure_raw)),
                    stop_min: Math.min(...flightsListBackup.map(item => item.stops)),
                    stop_max: Math.max(...flightsListBackup.map(item => item.stops)),
                    flight: [...new Set(flightsListBackup.map(item => item.flight_name))]
                }))
                resolve('Success')
            })
            .catch((err) => {
                console.log('Error: ' + err);
                reject('Error')
            })
        })
        .then((res) => {
            console.log('Backup Length: ' + flightsListBackup.length);
            setLoading(false)
        })
        .catch((e) => {
            console.log(e);
        })
    }, [])


    /* Apply filter */
    useEffect(() => {
        /*
        tripTime: tripTime,
        priceRange: priceRange,
        depTime: depTime
        */

        let filterOne = []
        flightsListBackup.map((data) => {
            if(data.minutes <= applyFilter.tripTime){
                filterOne.push(data)
            }
        })
        
        let filterTwo = []
        filterOne.map((data) => {
            if(data.price <= applyFilter.priceRange){
                filterTwo.push(data)
            }
        })

        let filterThree = []
        filterTwo.map((data) => {
            if(data.departure_raw <= applyFilter.depTime){
                filterThree.push(data)
            }
        })

        let filterFour = []
        if(applyFilter.flight !== null){
            filterThree.map((data) => {
                if(data.flight_name == applyFilter.flight){
                    filterFour.push(data)
                }
            })
            setFlightInfo(filterFour)
        }
        else{
            setFlightInfo(filterThree)
        }
    }, [applyFilter])

    return(
        <View style={_flights.container}>
            <TimeLine goBack={()=>{hideBottomTab('flex'), navigation.navigate('Home')}}/>
            {
                !loading ?
                <FlatList
                data={flightInfo}
                renderItem={({ item }) => (
                    <View>
                        {/* Oneway flights list starts here */}
                        <TouchableOpacity onPress={()=>{
                            setSelected(item)
                            navigation.navigate('Baggage')
                        }}>
                            <Card containerStyle={{ borderRadius: 22, padding: 0 }}>
                                <View style={{ marginHorizontal: 12 }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Image source={{ uri: `${FlightLogo}${item.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.calendar}</Text>
                                </View>
                                {/* Arrow */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14, justifyContent: 'space-around' }}>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.origin}</Text>
                                    <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                                        <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                                        <View style={{ position: 'absolute', left: '-5%' }}>
                                            <Icon name='caret-back' type='ionicon' color='#0D3283' />
                                        </View>
                                        <View style={{ position: 'absolute', right: '-5%' }}>
                                            <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                                        </View>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, position: 'absolute', left: '40%', top: '80%' }}>{`(${item.duration})`}</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.destination}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={{ width: '50%' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.departure}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.from}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.stops} stop</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.carry}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.arrival}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.to}</Text>
                                    </View>
                                </View>
                                </View>
                                <View style={{ width: '100%', backgroundColor: '#E7EDFB', marginTop: 20, paddingTop: 10, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                            <Icon name='checkmark' type='ionicon' color='#15A209' size={20}/>
                                            <Text style={{ fontFamily: 'poppins-bold', color: '#15A209', marginLeft: 4, fontSize: 12 }}>{item.cancellation}</Text>
                                        </View>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>{item.class === 'E' ? 'Economy':'Business'}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>Oneway trip per person</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 25, color: '#3B78FF' }}>{`$${item.price}`}</Text>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                        {/* Oneway flights list ends here */}
                    </View>
                )}
            />:
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <LottieView
                    autoPlay
                    style={{
                    width: 200,
                    height: 200,
                    backgroundColor: 'white',
                    }}
                    source={require('../../assets/flightLoading.json')}
                    />
            </View>
            }

            {/* Filter & Sort button starts here */}
            <View style={[_flights.buttons, { display: sort ? 'none' : 'flex' }]}>
                <TouchableOpacity style={{ backgroundColor: '#3B78FF', flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 30, paddingVertical: 15, elevation: 2 }}
                onPress={() => navigation.navigate('Filter')}>
                    <Icon name='funnel' type='ionicon' color='white' />
                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white', marginLeft: 10 }}>Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#3B78FF', flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 30, paddingVertical: 15, elevation: 2 }}
                onPress={()=>setSort(true)}>
                    <Icon name='filter' type='ionicon' color='white' />
                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white', marginLeft: 10 }}>Sort</Text>
                </TouchableOpacity>
            </View>
            {/* Filter & Sort button ends here */}
            {/* Sorting modal starts here */}
            <Modal visible={sort} transparent={true}>
                <View style={_flights.sortCard}>
                    <Card containerStyle={{ borderRadius: 22 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Price low to high</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color='#3B78FF' />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Price high to low</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color='#3B78FF' />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Longest duration</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color='#3B78FF' />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Shortest duration</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color='#3B78FF' />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Departs first</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color='#3B78FF' />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Arrives first</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color='#3B78FF' />
                        </TouchableOpacity>
                    </Card>
                    <View style={_flights.cancelButton}>
                        <TouchableOpacity style={{ backgroundColor: '#3B78FF', borderRadius: 10, paddingHorizontal: 100, paddingVertical: 10 }}
                        onPress={()=>setSort(false)}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Sorting modal ends here */}
        </View>
    )
}

let _flights = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    progressLine: {
        width: '100%',
        height: 200,
        backgroundColor: '#3B78FF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttons: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 20,
        width: '100%',
        justifyContent: 'space-around'
    },
    sortCard: {
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

/*
84 to 97
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14, justifyContent: 'space-around' }}>
        <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.origin}</Text>
        <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
            <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
            <View style={{ position: 'absolute', left: '-5%' }}>
                <Icon name='caret-back' type='ionicon' color='#0D3283' />
            </View>
            <View style={{ position: 'absolute', right: '-5%' }}>
                <Icon name='caret-forward' type='ionicon' color='#0D3283' />
            </View>
            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, position: 'absolute', left: '40%', top: '80%' }}>{`(${item.duration})`}</Text>
        </View>
        <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.destination}</Text>
    </View>
*/