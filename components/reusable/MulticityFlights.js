import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, FlatList } from 'react-native';
import { Icon, Card } from '@rneui/themed';
import React, { useState, useEffect, useContext } from 'react';
import { globalState } from '../../App';
import TimeLine from './TimeLine';
import axios from 'axios';
import LottieView from 'lottie-react-native'
import { FlightSearchUrl, FlightLogo } from '../endpoint/Endpoint'
import { StatusBar } from 'expo-status-bar';


let flightsListBackup12 = []

export default function RoundTripFlights({ navigation }){
    
    let { bottomTab, hideBottomTab, 
        travelDetail, setTravelDetail, 
        orides2, setOrides2, 
        selected, setSelected,
        range, setRange,
        applyFilter, updateFilter, flightsListBackup } = useContext(globalState)
    let [sort, setSort] = useState(false)
    let [loading, setLoading] = useState(true)
    let [icon, setIcon] = useState(null)
    let [flightInfo, setFlightInfo] = useState([])
    let [iconsf, setIconsf] = useState(false)

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
            axios.post(FlightSearchUrl, orides2)
            
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
                        origin1: flightsList.Itinerary[1]? flightsList.Itinerary[1].OriginDestination[0].OriginCode : null,
                        origin2: flightsList.Itinerary[2]? flightsList.Itinerary[2].OriginDestination[0].OriginCode : null,
                        origin3: flightsList.Itinerary[3]? flightsList.Itinerary[3].OriginDestination[0].OriginCode : null,
                        origin4: flightsList.Itinerary[4]? flightsList.Itinerary[4].OriginDestination[0].OriginCode : null,
                        
                        destination: flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].DestinationCode,
                        destination1: flightsList.Itinerary[1]? flightsList.Itinerary[1].OriginDestination[flightsList.Itinerary[1].OriginDestination.length-1].DestinationCode : null,
                        destination2: flightsList.Itinerary[2]? flightsList.Itinerary[2].OriginDestination[flightsList.Itinerary[2].OriginDestination.length-1].DestinationCode : null,
                        destination3: flightsList.Itinerary[3]? flightsList.Itinerary[3].OriginDestination[flightsList.Itinerary[3].OriginDestination.length-1].DestinationCode : null,
                        destination4: flightsList.Itinerary[4]? flightsList.Itinerary[4].OriginDestination[flightsList.Itinerary[4].OriginDestination.length-1].DestinationCode : null,
                       
                        departure: dateProcessor(flightsList.Itinerary[0].OriginDestination[0].DepartureTime),
                        departure1: flightsList.Itinerary[1]? dateProcessor(flightsList.Itinerary[1].OriginDestination[0].DepartureTime) : null,
                        departure2: flightsList.Itinerary[2]? dateProcessor(flightsList.Itinerary[2].OriginDestination[0].DepartureTime) : null,
                        departure3: flightsList.Itinerary[3]? dateProcessor(flightsList.Itinerary[3].OriginDestination[0].DepartureTime) : null,
                        departure4: flightsList.Itinerary[4]? dateProcessor(flightsList.Itinerary[4].OriginDestination[0].DepartureTime) : null,
                        
                        arrival: dateProcessor(flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].ArrivalTime),
                        arrival1: flightsList.Itinerary[1]? dateProcessor(flightsList.Itinerary[1].OriginDestination[flightsList.Itinerary[1].OriginDestination.length-1].ArrivalTime) : null,
                        arrival2: flightsList.Itinerary[2]? dateProcessor(flightsList.Itinerary[2].OriginDestination[flightsList.Itinerary[2].OriginDestination.length-1].ArrivalTime) : null,
                        arrival3: flightsList.Itinerary[3]? dateProcessor(flightsList.Itinerary[3].OriginDestination[flightsList.Itinerary[3].OriginDestination.length-1].ArrivalTime) : null,
                        arrival4: flightsList.Itinerary[4]? dateProcessor(flightsList.Itinerary[4].OriginDestination[flightsList.Itinerary[4].OriginDestination.length-1].ArrivalTime) : null,
                       
                        duration: flightsList.Itinerary[0].JourneyInfo.TotalTravelDurationInMinutes,
                        duration1: flightsList.Itinerary[1]? flightsList.Itinerary[1].JourneyInfo.TotalTravelDurationInMinutes : null,
                        duration2: flightsList.Itinerary[2]? flightsList.Itinerary[2].JourneyInfo.TotalTravelDurationInMinutes : null,
                        duration3: flightsList.Itinerary[3]? flightsList.Itinerary[3].JourneyInfo.TotalTravelDurationInMinutes : null,
                        duration4: flightsList.Itinerary[4]? flightsList.Itinerary[4].JourneyInfo.TotalTravelDurationInMinutes : null,
                        
                        minutes: Math.round(Number(flightsList.Itinerary[0].JourneyInfo.totalDurationInMinutes) / 60),
                        minutes1: flightsList.Itinerary[1]? Math.round(Number(flightsList.Itinerary[1].JourneyInfo.totalDurationInMinutes) / 60) : null,
                        minutes2: flightsList.Itinerary[2]? Math.round(Number(flightsList.Itinerary[2].JourneyInfo.totalDurationInMinutes) / 60) : null,
                        minutes3: flightsList.Itinerary[3]? Math.round(Number(flightsList.Itinerary[3].JourneyInfo.totalDurationInMinutes) / 60) : null,
                        minutes4: flightsList.Itinerary[4]? Math.round(Number(flightsList.Itinerary[4].JourneyInfo.totalDurationInMinutes) / 60) : null,
                       
                        from: flightsList.Itinerary[0].OriginDestination[0].OriginAirportName,
                        from1: flightsList.Itinerary[1]? flightsList.Itinerary[1].OriginDestination[0].OriginAirportName : null,
                        from2: flightsList.Itinerary[2]? flightsList.Itinerary[2].OriginDestination[0].OriginAirportName : null,
                        from3: flightsList.Itinerary[3]? flightsList.Itinerary[3].OriginDestination[0].OriginAirportName : null,
                        from4: flightsList.Itinerary[4]? flightsList.Itinerary[4].OriginDestination[0].OriginAirportName : null,
                       
                        to: flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].DestinationAirportName,
                        to1: flightsList.Itinerary[1]? flightsList.Itinerary[1].OriginDestination[flightsList.Itinerary[1].OriginDestination.length-1].DestinationAirportName : null,
                        to2: flightsList.Itinerary[2]? flightsList.Itinerary[2].OriginDestination[flightsList.Itinerary[2].OriginDestination.length-1].DestinationAirportName : null,
                        to3: flightsList.Itinerary[3]? flightsList.Itinerary[3].OriginDestination[flightsList.Itinerary[3].OriginDestination.length-1].DestinationAirportName : null,
                        to4: flightsList.Itinerary[4]? flightsList.Itinerary[4].OriginDestination[flightsList.Itinerary[4].OriginDestination.length-1].DestinationAirportName : null,
                        
                        stops: flightsList.Itinerary[0].JourneyInfo.NoOfStop,
                        stops1: flightsList.Itinerary[1]? flightsList.Itinerary[1].JourneyInfo.NoOfStop : null,
                        stops2: flightsList.Itinerary[2]? flightsList.Itinerary[2].JourneyInfo.NoOfStop : null,
                        stops3: flightsList.Itinerary[3]? flightsList.Itinerary[3].JourneyInfo.NoOfStop : null,
                        stops4: flightsList.Itinerary[4]? flightsList.Itinerary[4].JourneyInfo.NoOfStop : null,
                        
                        carry: 'Carry-on bag included',
                        
                        price: Math.round(Number(flightsList.GrossFare)),

                        departure_raw: Number(new Date(flightsList.Itinerary[0].OriginDestination[0].DepartureTime).getHours()),
                        departure_raw1: flightsList.Itinerary[1]? Number(new Date(flightsList.Itinerary[1].OriginDestination[0].DepartureTime).getHours()) : null,
                        departure_raw2: flightsList.Itinerary[2]? Number(new Date(flightsList.Itinerary[2].OriginDestination[0].DepartureTime).getHours()) : null,
                        departure_raw3: flightsList.Itinerary[3]? Number(new Date(flightsList.Itinerary[3].OriginDestination[0].DepartureTime).getHours()) : null,
                        departure_raw4: flightsList.Itinerary[4]? Number(new Date(flightsList.Itinerary[4].OriginDestination[0].DepartureTime).getHours()) : null,

                        class: flightsList.Itinerary[0].OriginDestination[0].CabinClass,
                        class1: flightsList.Itinerary[1]? flightsList.Itinerary[1].OriginDestination[0].CabinClass : null,
                        class2: flightsList.Itinerary[2]? flightsList.Itinerary[2].OriginDestination[0].CabinClass : null,
                        class3: flightsList.Itinerary[3]? flightsList.Itinerary[3].OriginDestination[0].CabinClass : null,
                        class4: flightsList.Itinerary[4]? flightsList.Itinerary[4].OriginDestination[0].CabinClass : null,
                       
                        cancellation: flightsList.cancellation,

                        baggage: flightsList.FareBreakdown[0].BaggageAllowance,
                        
                        flight_logo: flightsList.Itinerary[0].OriginDestination[0].MarketingAirline,
                        flight_logo1: flightsList.Itinerary[1]? flightsList.Itinerary[1].OriginDestination[0].MarketingAirline : null,
                        flight_logo2: flightsList.Itinerary[2]? flightsList.Itinerary[2].OriginDestination[0].MarketingAirline : null,
                        flight_logo3: flightsList.Itinerary[3]? flightsList.Itinerary[3].OriginDestination[0].MarketingAirline : null,
                        flight_logo4: flightsList.Itinerary[4]? flightsList.Itinerary[4].OriginDestination[0].MarketingAirline : null,

                        flight_name: flightsList.Itinerary[0].OriginDestination[0].MarketingAirlineName,
                        flight_name1: flightsList.Itinerary[1]? flightsList.Itinerary[1].OriginDestination[0].MarketingAirlineName : null,
                        flight_name2: flightsList.Itinerary[2]? flightsList.Itinerary[2].OriginDestination[0].MarketingAirlineName : null,
                        flight_name3: flightsList.Itinerary[3]? flightsList.Itinerary[3].OriginDestination[0].MarketingAirlineName : null,
                        flight_name4: flightsList.Itinerary[4]? flightsList.Itinerary[4].OriginDestination[0].MarketingAirlineName : null,
               
                        itenerary_id: flightsList.IteneraryRefID,
                        total_tax: flightsList.TotalTax,
                        fare_splitup: dosplitup(),
                        adult_fare: flightsList.FareBreakdown[0] !== undefined ? flightsList.FareBreakdown[0].GrossFare : null,
                        child_fare: flightsList.FareBreakdown[1] !== undefined ? flightsList.FareBreakdown[1].GrossFare : null,
                        infant_fare: flightsList.FareBreakdown[2] !== undefined ? flightsList.FareBreakdown[2].GrossFare : null,
                        search_id: response.data.result.SearchID
                    }

                    
                    // let metadata = {
                    //     origin: flightsList.Itinerary[0].OriginDestination[0].OriginCode,
                    //     origin1: flightsList.Itinerary[1].OriginDestination[0].OriginCode,
                    //     destination: flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].DestinationCode,
                    //     destination1: flightsList.Itinerary[1].OriginDestination[flightsList.Itinerary[1].OriginDestination.length-1].DestinationCode,
                    //     departure: dateProcessor(flightsList.Itinerary[0].OriginDestination[0].DepartureTime),
                    //     arrival: dateProcessor(flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].ArrivalTime),
                    //     duration: flightsList.Itinerary[0].JourneyInfo.TotalTravelDurationInMinutes,
                    //     minutes: Math.round(Number(flightsList.Itinerary[0].JourneyInfo.totalDurationInMinutes) / 60),
                    //     from: flightsList.Itinerary[0].OriginDestination[0].OriginAirportName,
                    //     to: flightsList.Itinerary[0].OriginDestination[flightsList.Itinerary[0].OriginDestination.length-1].DestinationAirportName,
                    //     stops: flightsList.Itinerary[0].JourneyInfo.NoOfStop,
                    //     carry: 'Carry-on bag included',
                    //     price: Math.round(Number(flightsList.GrossFare)),
                    //     departure_raw: Number(new Date(flightsList.Itinerary[0].OriginDestination[0].DepartureTime).getHours()),
                    //     class: flightsList.Itinerary[0].OriginDestination[0].CabinClass,
                    //     cancellation: flightsList.cancellation,
                    //     baggage: flightsList.FareBreakdown[0].BaggageAllowance,
                    //     flight_logo: flightsList.Itinerary[0].OriginDestination[0].MarketingAirline,
                    //     flight_name: flightsList.Itinerary[0].OriginDestination[0].MarketingAirlineName,
                    //     itenerary_id: flightsList.IteneraryRefID,
                    //     total_tax: flightsList.TotalTax,
                    //     fare_splitup: dosplitup(),
                    //     adult_fare: flightsList.FareBreakdown[0] !== undefined ? flightsList.FareBreakdown[0].GrossFare : null,
                    //     child_fare: flightsList.FareBreakdown[1] !== undefined ? flightsList.FareBreakdown[1].GrossFare : null,
                    //     infant_fare: flightsList.FareBreakdown[2] !== undefined ? flightsList.FareBreakdown[2].GrossFare : null,
                    //     search_id: response.data.result.SearchID
                    // }

                    setFlightInfo(prevList => [
                        ...prevList,
                        metadata
                    ])

                    flightsListBackup.push(metadata)
                    flightsListBackup12.push(metadata)
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
            console.log('Backup Length: ' + flightsListBackup12.length);
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
        flightsListBackup12.map((data) => {
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
                    console.log(data)
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
            <StatusBar animated={true} backgroundColor="#3B78FF" />
            <TimeLine goBack={()=>{ hideBottomTab('flex'), navigation.navigate('Home'),flightsListBackup=[], flightsListBackup12=[]}}/>
            {
                !loading ?
            <FlatList
                data={flightInfo}
                renderItem={({ item, index }) => (
                    <View>
                        {/* Multicity flights list starts here */}
                        <TouchableOpacity onPress={()=>{
                            setSelected(item)
                            navigation.navigate('Baggage')
                        }}>
                            <Card key={index} containerStyle={{ borderRadius: 22, padding: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 }}>
                                
                                {item.origin && item.destination? (
                                <View style={{ marginHorizontal: 12 }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                                    <Image source={{ uri: `${FlightLogo}${item.flight_logo}.gif.gif` }} style={{ width: 60, height: 40 }} />
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Departing Information</Text>
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.calendar1}</Text>
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

                                <View style={{ width: '100%', height: 1, marginVertical: 8 }}></View>

                                </View>
                                ):null}

                                {item.origin1 && item.destination1? (
                                <View style={{ marginHorizontal: 12 }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                                    <Image source={{ uri: `${FlightLogo}${item.flight_logo1}.gif.gif` }} style={{ width: 60, height: 40 }} />
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Departing Information</Text>
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.calendar2}</Text>
                                </View>
                                {/* Arrow */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.origin1}</Text>
                                    <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                                        <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                                        <View style={{ position: 'absolute', left: '-5%' }}>
                                            <Icon name='caret-back' type='ionicon' color='#0D3283' />
                                        </View>
                                        <View style={{ position: 'absolute', right: '-5%' }}>
                                            <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                                        </View>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, position: 'absolute', left: '40%', top: '80%' }}>{`(${item.duration1})`}</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.destination1}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={{ width: '50%' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.departure1}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.from1}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.stops1} stop</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.carry}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.arrival1}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.to1}</Text>
                                    </View>
                                </View>

                                <View style={{ width: '100%', height: 1, marginVertical: 8 }}></View>

                                </View>
                                ):null}

                                {item.origin2 && item.destination2? (
                                <View style={{ marginHorizontal: 12 }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                                    <Image source={{ uri: `${FlightLogo}${item.flight_logo2}.gif.gif` }} style={{ width: 60, height: 40 }} />
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Departing Information</Text>
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.calendar3}</Text>
                                </View>
                                {/* Arrow */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.origin2}</Text>
                                    <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                                        <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                                        <View style={{ position: 'absolute', left: '-5%' }}>
                                            <Icon name='caret-back' type='ionicon' color='#0D3283' />
                                        </View>
                                        <View style={{ position: 'absolute', right: '-5%' }}>
                                            <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                                        </View>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, position: 'absolute', left: '40%', top: '80%' }}>{`(${item.duration2})`}</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.destination2}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={{ width: '50%' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.departure2}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.from2}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.stops2} stop</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.carry}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.arrival2}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.to2}</Text>
                                    </View>
                                </View>

                                <View style={{ width: '100%', height: 1, marginVertical: 8 }}></View>

                                </View>
                                ):null}

                                {item.origin3 && item.destination3? (
                                <View style={{ marginHorizontal: 12 }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                                    <Image source={{ uri: `${FlightLogo}${item.flight_logo3}.gif.gif` }} style={{ width: 60, height: 40 }} />
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Departing Information</Text>
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.calendar4}</Text>
                                </View>
                                {/* Arrow */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.origin3}</Text>
                                    <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                                        <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                                        <View style={{ position: 'absolute', left: '-5%' }}>
                                            <Icon name='caret-back' type='ionicon' color='#0D3283' />
                                        </View>
                                        <View style={{ position: 'absolute', right: '-5%' }}>
                                            <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                                        </View>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, position: 'absolute', left: '40%', top: '80%' }}>{`(${item.duration3})`}</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.destination3}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={{ width: '50%' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.departure3}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.from3}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.stops3} stop</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.carry}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.arrival3}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.to3}</Text>
                                    </View>
                                </View>

                                <View style={{ width: '100%', height: 1, marginVertical: 8 }}></View>

                                </View>
                                ): null}

                                {item.origin4 && item.destination4? (
                                <View style={{ marginHorizontal: 12 }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 8, borderColor: '#00000021', alignItems: 'center', justifyContent: 'space-around' }}>
                                    <Image source={{ uri: `${FlightLogo}${item.flight_logo4}.gif.gif` }} style={{ width: 60, height: 40 }} />
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-bold', fontSize: 12 }}>Departing Information</Text>
                                    <Text style={{ color: '#0D3283', fontFamily: 'poppins-regular', fontSize: 12 }}>{travelDetail.calendar5}</Text>
                                </View>
                                {/* Arrow */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.origin4}</Text>
                                    <View style={{ flexDirection: 'row', width: '70%', height: '60%', alignItems: 'center', marginVertical: 18, marginHorizontal: 12 }}>
                                        <View style={{width: '100%', height: 2, backgroundColor: '#0D3283'}} />
                                        <View style={{ position: 'absolute', left: '-5%' }}>
                                            <Icon name='caret-back' type='ionicon' color='#0D3283' />
                                        </View>
                                        <View style={{ position: 'absolute', right: '-5%' }}>
                                            <Icon name='caret-forward' type='ionicon' color='#0D3283' />
                                        </View>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, position: 'absolute', left: '40%', top: '80%' }}>{`(${item.duration4})`}</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#0D3283', fontSize: 20 }}>{item.destination4}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={{ width: '50%' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.departure4}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.from4}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.stops4} stop</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name='luggage' type='material' color='#3B78FF' size={14}/>
                                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.carry}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.arrival4}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>{item.to4}</Text>
                                    </View>
                                </View>

                                <View style={{ width: '100%', height: 1, marginVertical: 8 }}></View>

                                </View>
                                ): null}
                                


                                <View style={{ width: '100%', backgroundColor: '#E7EDFB', marginTop: 20, paddingTop: 10, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                            <Icon name='checkmark' type='ionicon' color='#15A209' size={20}/>
                                            <Text style={{ fontFamily: 'poppins-bold', color: '#15A209', marginLeft: 4, fontSize: 12 }}>{item.cancellation}</Text>
                                        </View>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>{item.class === 'E' ? 'Economy':'Business'}</Text>
                                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginVertical: 2 }}>Round trip per person</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 25, color: '#3B78FF' }}>{`$${item.price}`}</Text>
                                    </View>
                                </View>
                                
                            </Card>
                        </TouchableOpacity>
                        {/* Multicity flights list ends here */}
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
             <TouchableOpacity style={{ padding: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5, bottom:30, right:10, zIndex:10, width:80, height:80, borderRadius:50, backgroundColor: '#3B78FF',display:"flex", justifyContent:"center", alignItems:"center", position:"absolute"}} onPress={() => setIconsf(true)}>
                    <Icon name='options' type='ionicon' color='white' size={30}/>
            </TouchableOpacity>
            <Modal visible={iconsf} transparent={true}>
             <TouchableOpacity onPress={() => setIconsf(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>

            <View style={_flights.buttons}>
                <TouchableOpacity style={{ backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 }}
                onPress={() => {navigation.navigate('Filter'), setIconsf(false)}}>
                    <Icon name='funnel-outline' type='ionicon' color='#3B78FF' />
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 22, color: '#3B78FF', marginLeft: 10 }}>Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12}}
                onPress={()=>{setSort(true), setIconsf(false)}}>
                    <Icon name="swap-vertical-outline" type='ionicon' color='#3B78FF' />
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 22, color: '#3B78FF', marginLeft: 10 }}>Sort</Text>
                </TouchableOpacity>
            </View>
            </TouchableOpacity>

            </Modal>
            {/* Filter & Sort button ends here */}
            {/* Sorting modal starts here */}
            <Modal visible={sort} transparent={true}>
            <TouchableOpacity onPress={() => setSort(false)} style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
                <>
                    <Card containerStyle={{ width:"80%", marginBottom:"0%", borderRadius: 22,borderRadius: 22, padding: 0,shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5 }}>
                    <Text style={{width:"80%", marginLeft:"10%", marginTop:"5%",fontFamily: 'poppins-regular', fontSize: 15 }}>Sort by</Text>

                        <View style={{width:"80%", marginLeft:"10%", paddingBottom:"7%"}}>

                        <TouchableOpacity
                        onPress={()=>sortings1("low to high")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'flex-start', borderColor: '#C9C9C9' }}>
                            <View style={[ 
                                {
                                    backgroundColor : icon === 'low to high' ? '#3B78FF' : 'transparent',
                                    borderWidth: icon === 'low to high' ? 0 : 2,
                                    width: 18, height: 18, justifyContent: 'center', alignItem: 'center', borderRadius: 50, borderColor:"#5b5b5c" 
                                },
                                
                            ]}><Icon name='checkmark' type='ionicon' color="white" size={15}/></View>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 17, color: '#0D3283', marginLeft:"8%", marginTop:"3%" }}>Price low to high</Text>
                            {/* <Icon name='checkmark-sharp' type='ionicon' color={icon === 'low to high' ? '#3B78FF' : 'white'}/> */}
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>sortings2("high to low")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'flex-start', borderColor: '#C9C9C9' }}>
                            <View style={[ 
                                {
                                    backgroundColor : icon === 'high to low' ? '#3B78FF' : 'transparent',
                                    borderWidth: icon === 'high to low' ? 0 : 2,
                                    width: 18, height: 18, justifyContent: 'center', alignItem: 'center', borderRadius: 50, borderColor:"#5b5b5c"
                                },
                                
                            ]}><Icon name='checkmark' type='ionicon' color="white" size={15}/></View>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 17, color: '#0D3283', marginLeft:"8%", marginTop:"3%" }}>Price high to low</Text>
                            {/* <Icon name='checkmark-sharp' type='ionicon' color={icon === 'low to high' ? '#3B78FF' : 'white'}/> */}
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>sortings3("Longest duration")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'flex-start', borderColor: '#C9C9C9' }}>
                            <View style={[ 
                                {
                                    backgroundColor : icon === 'Longest duration' ? '#3B78FF' : 'transparent',
                                    borderWidth: icon === 'Longest duration' ? 0 : 2,
                                    width: 18, height: 18, justifyContent: 'center', alignItem: 'center', borderRadius: 50, borderColor:"#5b5b5c"
                                },
                                
                            ]}><Icon name='checkmark' type='ionicon' color="white" size={15}/></View>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 17, color: '#0D3283', marginLeft:"8%", marginTop:"3%" }}>Longest duration</Text>
                            {/* <Icon name='checkmark-sharp' type='ionicon' color={icon === 'low to high' ? '#3B78FF' : 'white'}/> */}
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>sortings4("Shortest duration")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'flex-start', borderColor: '#C9C9C9' }}>
                            <View style={[ 
                                {
                                    backgroundColor : icon === 'Shortest duration' ? '#3B78FF' : 'transparent',
                                    borderWidth: icon === 'Shortest duration' ? 0 : 2,
                                    width: 18, height: 18, justifyContent: 'center', alignItem: 'center', borderRadius: 50, borderColor:"#5b5b5c" 
                                },
                                
                            ]}><Icon name='checkmark' type='ionicon' color="white" size={15}/></View>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 17, color: '#0D3283', marginLeft:"8%", marginTop:"3%" }}>Shortest duration</Text>
                            {/* <Icon name='checkmark-sharp' type='ionicon' color={icon === 'low to high' ? '#3B78FF' : 'white'}/> */}
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>sortings5("Departs first")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'flex-start', borderColor: '#C9C9C9' }}>
                            <View style={[ 
                                {
                                    backgroundColor : icon === 'Departs first' ? '#3B78FF' : 'transparent',
                                    borderWidth: icon === 'Departs first' ? 0 : 2,
                                    width: 18, height: 18, justifyContent: 'center', alignItem: 'center', borderRadius: 50, borderColor:"#5b5b5c" 
                                },
                                
                            ]}><Icon name='checkmark' type='ionicon' color="white" size={15}/></View>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 17, color: '#0D3283', marginLeft:"8%", marginTop:"3%" }}>Departs first</Text>
                            {/* <Icon name='checkmark-sharp' type='ionicon' color={icon === 'low to high' ? '#3B78FF' : 'white'}/> */}
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>sortings6("Arrives first")}
                        style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'flex-start', borderColor: '#C9C9C9' }}>
                            <View style={[ 
                                {
                                    backgroundColor : icon === 'Arrives first' ? '#3B78FF' : 'transparent',
                                    borderWidth: icon === 'Arrives first' ? 0 : 2,
                                    width: 18, height: 18, justifyContent: 'center', alignItem: 'center', borderRadius: 50, borderColor:"#5b5b5c" 
                                },
                                
                            ]}><Icon name='checkmark' type='ionicon' color="white" size={15}/></View>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 17, color: '#0D3283', marginLeft:"8%", marginTop:"3%" }}>Arrives first</Text>
                            {/* <Icon name='checkmark-sharp' type='ionicon' color={icon === 'low to high' ? '#3B78FF' : 'white'}/> */}
                        </TouchableOpacity>
                        
                        </View>

                    </Card>
                
                </>
                </TouchableOpacity>
            </Modal>
            {/* Sorting modal ends here */}
        </View>
    )
}

let _flights = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: "5%"
    },
    progressLine: {
        width: '100%',
        height: 200,
        backgroundColor: '#3B78FF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttons: {
        borderRadius: 22, 
        padding: 0,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 0 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 2, 
        elevation: 5,
        backgroundColor: "#FFFFFF",
        flexDirection:"column",
        bottom: 30,
        right:10,
        width: '35%',
        justifyContent: 'center',
        alignItems:"center",
        marginTop:"10%",
        position:"absolute"
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