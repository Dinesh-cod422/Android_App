import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, FlatList } from 'react-native';
import { Icon, Card } from '@rneui/themed';
import React, { useState, useEffect, useContext } from 'react';
import { globalState } from '../../App';
import TimeLine from './TimeLine';
import axios from 'axios';
import LottieView from 'lottie-react-native'
import { FlightSearchUrl, FlightLogo } from '../endpoint/Endpoint'




export default function RoundTripFlights({ navigation }){

    // let { bottomTab, hideBottomTab, stage, setStage } = useContext(globalState)
    // let [sort, setSort] = useState(false)
    // let [flightInfo, setFlightInfo] = useState([
    //     {id: 1, data: 'one'},
    //     {id: 2, data: 'two'},
    //     {id: 3, data: 'three'},
    //     {id: 4, data: 'four'},
    //     {id: 5, data: 'five'},
    // ])

    // useEffect(() => {
    //     setStage({
    //         one: true,
    //         two: false,
    //         three: false
    //     })
    // }, [])
    
    let { bottomTab, hideBottomTab, 
        travelDetail, setTravelDetail, 
        orides1, setOrides1, 
        selected, setSelected,
        range, setRange,
        applyFilter, updateFilter, flightsListBackup } = useContext(globalState)
    let [sort, setSort] = useState(false)
    let [loading, setLoading] = useState(true)
    let [icon, setIcon] = useState(null)
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
            axios.post(FlightSearchUrl, orides1)
            
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
                        originR: flightsList.Itinerary[1].OriginDestination[0].OriginCode,
                        destination: flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].DestinationCode,
                        destinationR: flightsList.Itinerary[1].OriginDestination[flightsList.Itinerary[1].OriginDestination.length-1].DestinationCode,
                        departure: dateProcessor(flightsList.Itinerary[0].OriginDestination[0].DepartureTime),
                        departureR: dateProcessor(flightsList.Itinerary[1].OriginDestination[0].DepartureTime),
                        arrival: dateProcessor(flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].ArrivalTime),
                        arrivalR: dateProcessor(flightsList.Itinerary[1].OriginDestination[flightsList.Itinerary[1].OriginDestination.length-1].ArrivalTime),
                        duration: flightsList.Itinerary[0].JourneyInfo.TotalTravelDurationInMinutes,
                        durationR: flightsList.Itinerary[1].JourneyInfo.TotalTravelDurationInMinutes,
                        minutes: Math.round(Number(flightsList.Itinerary[0].JourneyInfo.totalDurationInMinutes) / 60),
                        minutesR: Math.round(Number(flightsList.Itinerary[1].JourneyInfo.totalDurationInMinutes) / 60),
                        from: flightsList.Itinerary[0].OriginDestination[0].OriginAirportName,
                        fromR: flightsList.Itinerary[1].OriginDestination[0].OriginAirportName,
                        to: flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].DestinationAirportName,
                        toR: flightsList.Itinerary[1].OriginDestination[flightsList.Itinerary[1].OriginDestination.length-1].DestinationAirportName,
                        stops: flightsList.Itinerary[0].JourneyInfo.NoOfStop,
                        stopsR: flightsList.Itinerary[1].JourneyInfo.NoOfStop,
                        carry: 'Carry-on bag included',
                        carryR: 'Carry-on bag included',
                        price: Math.round(Number(flightsList.GrossFare)),
                        departure_raw: Number(new Date(flightsList.Itinerary[0].OriginDestination[0].DepartureTime).getHours()),
                        departure_rawR: Number(new Date(flightsList.Itinerary[1].OriginDestination[0].DepartureTime).getHours()),
                        class: flightsList.Itinerary[0].OriginDestination[0].CabinClass,
                        classR: flightsList.Itinerary[1].OriginDestination[0].CabinClass,
                        cancellation: flightsList.cancellation,
                        baggage: flightsList.FareBreakdown[0].BaggageAllowance,
                        flight_logo: flightsList.Itinerary[0].OriginDestination[0].MarketingAirline,
                        flight_logoR: flightsList.Itinerary[1].OriginDestination[0].MarketingAirline,
                        flight_name: flightsList.Itinerary[0].OriginDestination[0].MarketingAirlineName,
                        flight_name: flightsList.Itinerary[1].OriginDestination[0].MarketingAirlineName,
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
                    time_minR: Math.min(...flightsListBackup.map(item => item.departure_raw)),
                    time_max: Math.max(...flightsListBackup.map(item => item.departure_raw)),
                    time_maxR: Math.max(...flightsListBackup.map(item => item.departure_raw)),
                    flight: [...new Set(flightsListBackup.map(item => item.flight_name))],
                    stop: [...new Set(flightsListBackup.map(item => item.stops))]
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
            if(data.departure_raw && data.departure_rawR <= applyFilter.depTime){
                filterThree.push(data)
            }}
            
        )

        let filterFour = []
        if(applyFilter.flight !== null){
            filterThree.map((data) => {
                if(data.flight_name == applyFilter.flight){
                    filterFour.push(data)
                }
            })
        }

        let filterFive = []
        if(filterFour.length !== 0){
            if(applyFilter.stops !== null){
                filterFour.map((data) => {
                    if(data.stops == applyFilter.stops){
                        filterFive.push(data)
                    }
                })
                setFlightInfo(filterFive)
            }
        }
        else{
            if(applyFilter.stops !== null){
                filterThree.map((data) => {
                    if(data.stops == applyFilter.stops){
                        filterFive.push(data)
                    }
                })
                setFlightInfo(filterFive)
            }
            else{
                setFlightInfo(filterThree)
            }
        }
    }, [applyFilter])

    const sortings1 = (options) => {
        let arr = [...flightInfo]; // Create a copy of the flightInfo array
        const sortedArr = arr.sort(function(a, b) {
          // Extract days, hours, and minutes from the duration strings
          var low = a.price
          var high = b.price
          return low - high;
        });
      
        console.log(sortedArr);
        setFlightInfo(sortedArr);
        setIcon(options);
        setSort(false);
    }

    const sortings2 = (options) => {
        let arr = [...flightInfo]; // Create a copy of the flightInfo array
        const sortedArr = arr.sort(function(a, b) {
          // Extract days, hours, and minutes from the duration strings
          var low = a.price
          var high = b.price
          return high - low;
        });
      
        console.log(sortedArr);
        setFlightInfo(sortedArr);
        setIcon(options);
        setSort(false);
    }

    const sortings3 = (options) => {
        let arr = [...flightInfo]; // Create a copy of the flightInfo array
        const sortedArr = arr.sort(function(a, b) {
          // Extract days, hours, and minutes from the duration strings
          var durationA = a.duration.match(/\d+/g).map(Number);
          var durationB = b.duration.match(/\d+/g).map(Number);
        
          // Convert duration values to total minutes
          var totalMinutesA = durationA[0] * 24 * 60 + durationA[1] * 60 + durationA[2];
          var totalMinutesB = durationB[0] * 24 * 60 + durationB[1] * 60 + durationB[2];
        
          return totalMinutesB - totalMinutesA;
        });
      
        console.log(sortedArr);
        setFlightInfo(sortedArr);
        setIcon(options);
        setSort(false);
    }
      
    const sortings4 = (options) => {
        let arr = [...flightInfo]; // Create a copy of the flightInfo array
        const sortedArr = arr.sort(function(a, b) {
          // Extract days, hours, and minutes from the duration strings
          var durationA = a.duration.match(/\d+/g).map(Number);
          var durationB = b.duration.match(/\d+/g).map(Number);
        
          // Convert duration values to total minutes
          var totalMinutesA = durationA[0] * 24 * 60 + durationA[1] * 60 + durationA[2];
          var totalMinutesB = durationB[0] * 24 * 60 + durationB[1] * 60 + durationB[2];
        
          return totalMinutesA - totalMinutesB;
        });
      
        console.log(sortedArr);
        setFlightInfo(sortedArr);
        setIcon(options);
        setSort(false);
    }

    const sortings5= (options) => {
            let arr = [...flightInfo]; // Create a copy of the flightInfo array
            const sortedArr = arr.sort(function(a, b) {
              // Extract the time values from the departure strings
              var timeA = a.departure.split(' ')[0];
              var timeB = b.departure.split(' ')[0];
            
              // Convert time values to a comparable format (e.g., 24-hour format)
              var formattedTimeA = convertTo24HourFormat(timeA);
              var formattedTimeB = convertTo24HourFormat(timeB);
            
              // Compare the time values
              if (formattedTimeA < formattedTimeB) {
                return -1;
              } else if (formattedTimeA > formattedTimeB) {
                return 1;
              }
              return 0;
            });
          
            console.log(sortedArr);
            setFlightInfo(sortedArr);
            setIcon(options);
            setSort(false);
    }
          
    const sortings6 = (options) => {
        let arr = [...flightInfo]; // Create a copy of the flightInfo array
        const sortedArr = arr.sort(function(a, b) {
          // Extract the time values from the arrival strings
          var timeA = a.arrival.split(' ')[0];
          var timeB = b.arrival.split(' ')[0];
        
          // Convert time values to a comparable format (e.g., 24-hour format)
          var formattedTimeA = convertTo24HourFormat(timeA);
          var formattedTimeB = convertTo24HourFormat(timeB);
        
          // Compare the time values
          if (formattedTimeA < formattedTimeB) {
            return -1;
          } else if (formattedTimeA > formattedTimeB) {
            return 1;
          }
          return 0;
        });
      
        console.log(sortedArr);
        setFlightInfo(sortedArr);
        setIcon(options);
        setSort(false);
    }
      
      // Function to convert time to 24-hour format
      function convertTo24HourFormat(time) {
        var [hours, minutes] = time.split(':');
        var period = time.slice(-2);
      
        if (period === 'AM' && hours === '12') {
          hours = '00';
        } else if (period === 'PM' && hours !== '12') {
          hours = (parseInt(hours) + 12).toString();
        }
      
        return hours + ':' + minutes;
      }
          
    

    return(
        <View style={_flights.container}>
            <TimeLine goBack={()=>{ hideBottomTab('flex'), navigation.navigate('Home'),flightsListBackup=[]}}/>
            {
                !loading ?
            <FlatList
                data={flightInfo}
                renderItem={({ item }) => (
                    <View>
                        {/* Round-trip flights list starts here */}
                        <TouchableOpacity onPress={()=>{
                            setSelected(item)
                            navigation.navigate('Baggage')
                        }}>
                            <Card containerStyle={{ borderRadius: 22, padding: 0 }}>
                                <View style={{ marginHorizontal: 12 }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                                    <Image source={{ uri: `${FlightLogo}${item.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Departing Information</Text>
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.calendar}</Text>
                                </View>
                                {/* Arrow */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
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
                                <View style={{ width: '100%', height: 1, marginVertical: 24 }}></View>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                                    <Image source={{ uri: `${FlightLogo}${item.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Returning Information</Text>
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.returnCal}</Text>
                                </View>
                                {/* Arrow */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.originR}</Text>
                                    <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                                        <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                                        <View style={{ position: 'absolute', left: '-5%' }}>
                                            <Icon name='caret-back' type='ionicon' color='#0D3283' />
                                        </View>
                                        <View style={{ position: 'absolute', right: '-5%' }}>
                                            <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                                        </View>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, position: 'absolute', left: '40%', top: '80%' }}>{`(${item.durationR})`}</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.destinationR}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={{ width: '50%' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.departureR}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.fromR}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.stopsR} stops</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.carryR}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.arrivalR}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.toR}</Text>
                                    </View>
                                </View>
                                </View>
                                <View style={{ width: '100%', backgroundColor: '#E7EDFB', marginTop: 20, paddingTop: 10, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                            <Icon name='checkmark' type='ionicon' color='#15A209' size={20}/>
                                            <Text style={{ fontFamily: 'poppins-bold', color: '#15A209', marginLeft: 4, fontSize: 12 }}>{item.cancellation}</Text>
                                        </View>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>{item.classR === 'E' ? 'Economy':'Business'}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>Round trip per person</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 25, color: '#3B78FF' }}>{`$${item.price}`}</Text>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                        {/* Round-trip flights list ends here */}
                    </View>
                )}
                keyExtractor={item => item.id}
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
                        <TouchableOpacity
                        onPress={()=>sortings1("low to high")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Price low to high</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color={icon === 'low to high' ? '#3B78FF' : 'white'}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>sortings2("high to low")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Price high to low</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color={icon === 'high to low' ? '#3B78FF' : 'white'}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={()=>sortings3("Longest duration")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Longest duration</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color={icon === 'Longest duration' ? '#3B78FF' : 'white'}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>sortings4("Shortest duration")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Shortest duration</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color={icon === 'Shortest duration' ? '#3B78FF' : 'white'}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={()=>sortings5("Departs first")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Departs first</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color={icon === 'Departs first' ? '#3B78FF' : 'white'}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={()=>sortings6("Arrives first")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Arrives first</Text>
                            <Icon name='checkmark-sharp' type='ionicon' color={icon === 'Arrives first' ? '#3B78FF' : 'white'}/>
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
        marginTop: 30
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