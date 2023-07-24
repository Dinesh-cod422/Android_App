import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Image, Alert } from "react-native";
import { Card, Icon, SearchBar } from '@rneui/themed';
import React, { useState, useContext, useEffect } from "react";
import { globalState } from "../../App";
import { Calendar } from 'react-native-calendars';
import axios from "axios";
import LottieView from 'lottie-react-native';
import { AirportSearchUrl } from "../endpoint/Endpoint";
import { CardDivider } from "@rneui/base/dist/Card/Card.Divider";
import { StatusBar } from "expo-status-bar";

export default function Home({ navigation }){
    const openCalendar = (dateType) => {
        setJumpDate(dateType);
        openCalendarModal(true);
      };

    let { bottomTab, hideBottomTab, 
        stage, setStage, 
        travel, setTravel, 
        travelDetail, setTravelDetail, 
        orides, setOrides,
        orides1, setOrides1,
        orides2, setOrides2,  } = useContext(globalState)
    let [menu, setMenu] = useState('2') /* <- For Menu */
    const [menuss, setMenuss] = useState([1]);
    const [menuss1, setMenuss1] = useState();
    
    let [calendarModal, openCalendarModal] = useState(false)
    let [searchModal, openSearchModal] = useState(false)
    let [searchFlights, setSearchFlights] = useState()
    console.log(searchFlights)
    let [airportList, setAirportList] = useState([])
     /* City_Name, Country_Name - Airport_Name (Airport_Code) */
    let [jump, setJump] = useState('from')
    let [jumpDate, setJumpDate] = useState('from')
    let [sort, setSort] = useState(false)
    let [countModal, openCountModal] = useState(false)
    let [jump3, setJump3] = useState("from")
    const [searchPlaceholder, setSearchPlaceholder] = useState('Flying from');
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    let [loading, setLoading] = useState(true)
    let [direct, setDirect] = useState(false)
    let [plusIcon, setPlusIcon] = useState(false)



    let selectionStyle = {
        fontFamily: 'poppins-regular',
        color: '#3B78FF',
    }
    let box1 = {
        display:"flex"
    }
    let box11 = {
        display:"none"
    }

    
    
    useEffect(() => {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }

        const delay = 1000;
        let debounceTimeout;

    
        debounceTimeout = setTimeout(() => {
            if (searchFlights !== undefined) {
                setLoading(true);
        
            axios
              .get(`${AirportSearchUrl}${searchFlights}`)
              .then((response) => {
                let loop = response.data.result;
                setAirportList(loop);
              })
              .catch((err) => {
                console.log('Error: ' + err);
              }).finally(() => {
                setLoading(false);
              });
          }
        }, delay);
    
        return () => {
          clearTimeout(debounceTimeout);
        };
      }, [searchFlights]);

    // let initCalendar = () => {
    //     let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    //     let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
    //     let d = new Date();
    //     d = days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
    //     console.log(d);
    //     return d;
        
    // };
    
    
    
    // useEffect(() => {
    //     setTravelDetail(prevDetail => ({
    //         ...prevDetail,
    //         calendar: initCalendar(), 
    //         returnCal: initCalendar(), 
    //     }))
    // }, [])

    let Services = (props) => {
        return(
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={()=>setMenu(props.id)}>
                    <View style={{ width: 40, height: 40, backgroundColor: '#3C77FF', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 30, height: 30, backgroundColor: 'white', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name={props.name} type="material" size={20} color='#3C77FF' />
                        </View>
                    </View>
                    <Text style={[
                        {
                            marginVertical: 12, 
                            fontSize: 12,
                            fontFamily: 'poppins-regular',
                            textAlign: 'center',
                        },
                        props.style
                    ]}>{props.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }



    let AddAnother = (props) => {
        return (
            <View style={_home.inputWrapper}>
                <View style={{flexDirection: "row", justifyContent:"space-between", alignItems:"center", marginHorizontal:"2%"}}>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize:15}}>Flight {props.id}</Text>
                    <TouchableOpacity onPress={props.onRemove}>
                        <Icon name="close" type="ionicons"></Icon>
                    </TouchableOpacity>
                </View>
            <TouchableOpacity style={_home.inputBox} onPress={()=>{setJump3('from'), setSearchPlaceholder("Flying from"), openSearchModal(true), setMenuss1(props.id)}}>
                <Icon name='flight-takeoff' type='material' color='#3B78FF' />
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: travelDetail.flying_from == null ? '100%' : null }}>
                    <TextInput placeholder='Flying from' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false}  value={
                        props.id === 1
                        ? travelDetail.flying_from1
                        : props.id === 2
                        ? travelDetail.flying_from2
                        : props.id === 3
                        ? travelDetail.flying_from3
                        :  props.id === 4
                        ? travelDetail.flying_from4
                        : props.id === 5
                        ? travelDetail.flying_from5
                        :  ""
                    }/>
                </ScrollView>
            </TouchableOpacity>
            <TouchableOpacity style={_home.inputBox} onPress={()=>{setJump3('to'), setSearchPlaceholder("Flying to"),openSearchModal(true), setMenuss1(props.id)}}>
                <Icon name='flight-land' type='material' color='#3B78FF' />
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: travelDetail.flying_to == null ? '100%' : null }}>
                    <TextInput placeholder='Flying to' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={
                         props.id === 1
                        ? travelDetail.flying_to1
                        : props.id === 2
                        ? travelDetail.flying_to2
                        : props.id === 3
                        ? travelDetail.flying_to3
                        :  props.id === 4
                        ? travelDetail.flying_to4
                        : props.id === 5
                        ? travelDetail.flying_to5
                        :  ""}/>
                </ScrollView>
            </TouchableOpacity>
            <TouchableOpacity style={_home.inputBox} onPress={()=> {setJumpDate('from'),openCalendarModal(true),setMenuss1(props.id)}}>
                <Icon name='calendar' type='ionicon' color='#3B78FF' />
                <TextInput placeholder='Departure date' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={
                     props.id === 1
                     ? travelDetail.calendar1
                     : props.id === 2
                     ? travelDetail.calendar2
                     : props.id === 3
                     ? travelDetail.calendar3
                     :  props.id === 4
                     ? travelDetail.calendar4
                     : props.id === 5
                     ? travelDetail.calendar5
                     :  ""
                }/>
            </TouchableOpacity>

            
            <View style={{flex: 1, height: 1, backgroundColor: '#d6d7db', marginBottom:"4%", marginTop:"1%", marginHorizontal:"2%"}} />

        </View>
        )
    }
   


    let TravelType = (props) => {
        return(
            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 18 }}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={()=>{setTravelDetail({
                       flying_from: null,
                       flying_from1: null,
                       flying_from2: null,
                       flying_from3: null,
                       flying_from4: null,
                       flying_from5: null,
                       origin_code: null,
                       origin_code1: null,
                       origin_code2: null,
                       origin_code3: null,
                       origin_code4: null,
                       origin_code5: null,
                       flying_to: null,
                       flying_to1: null,
                       flying_to2: null,
                       flying_to3: null,
                       flying_to4: null,
                       flying_to5: null,
                       destination_code: null,
                       destination_code1: null,
                       destination_code2: null,
                       destination_code3: null,
                       destination_code4: null,
                       destination_code5: null,
                       calendar: null,
                       calendar1: null,
                       calendar2: null,
                       calendar3: null,
                       calendar4: null,
                       calendar5: null,
                       date: null,
                       date1: null,
                       date2: null,
                       date3: null,
                       date4: null,
                       date5: null,
                       dateRE: null,
                       returnCal: null,
                       passengers: 1,
                       adult: 1,
                       children: 0,
                       infant: 0,
                       class_type: 'Economy',
                       billname: null,
                    }), setMenuss([]),setTravel(props.id), setDirect(direct)}}>
                    <View style={[ 
                        {
                            width: 18, 
                            height: 18, 
                            justifyContent: 'center',
                            alignItem: 'center', 
                            borderRadius: 50,
                            borderWidth: 1,
                        },
                        props.style
                    ]}><Icon name='checkmark' type='ionicon' color='white' size={15}/></View>
                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginLeft: 6 }}>{props.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    // let PlacesList = () => {
    //     return(
    //         <View style={{ marginVertical: 40, marginHorizontal: 20 }}>
    //             <View style={{ flexDirection: "row" }}>
    //                 <View style={{ width: '90%' }}>
    //                     <Text style={{ fontFamily: 'poppins-bold', fontSize: 15 }}>Top cities to visit around United Kingdom</Text>
    //                     <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Popular places where users used to travel a lot. Explore and have fun</Text>
    //                 </View>
    //                 <View>
    //                     <Icon name='chevron-forward-outline' type='ionicon' color='#3B78FF' reverse size={14} />
    //                 </View>
    //             </View>
    //             <Card>
    //                 <Card.Image
    //                     source={{
    //                     uri:
    //                         'https://awildgeographer.files.wordpress.com/2015/02/john_muir_glacier.jpg',
    //                     }}
    //                 />
    //                 <View style={{ flexDirection: 'row', marginTop: 12 }}>
    //                     <Icon name='location' type='ionicon' />
    //                     <Text style={{ fontFamily: 'poppins-bold', fontSize: 16 }}>Scotland</Text>
    //                 </View>
    //             </Card>
    //         </View>
    //     )
    // }

    let navigateToOneWayFlights = () => {
        setStage({ one: true, two: false, three: false })
        let { flying_from, flying_to, calendar } = travelDetail
        if(flying_from && flying_to !== null){
            setOrides({
                "JourneyType": "O",
                "OriginDestination": [
                    {
                        "Origin": travelDetail.origin_code,
                        "Destination": travelDetail.destination_code,
                        "DepartureDate": travelDetail.date,
                    }
                ],
                "ClassType": `${travelDetail.class_type === 'Economy' ? 'E' : travelDetail.class_type === 'Business' ? 'B' : travelDetail.class_type === 'FirstClass' ? 'F' : travelDetail.class_type === 'Premium' ? 'P' : 'E'}`,
                "NoOfInfant": {
                    "Count": travelDetail.infant,
                    "Age": {}
                },
                "NoOfChildren": {
                    "Count": travelDetail.children,
                    "Age": {}
                },
                "NoOfAdult": {
                    "Count": travelDetail.adult
                },
                "PreferredArilines": [],
                "PreferredCurrency": "INR",
                "OtherInfo": {
                    "RequestedIP": "",
                    "TransactionId": ""
                },
                "MultiCityTripdata": []
            })
            navigation.navigate('Oneway')
        }
        else{
            triggerAlert()
        }
    }
    let navigateToRoundWayFlights = () => {
        setStage({ one: true, two: false, three: false })
        let { flying_from, flying_to, calendar } = travelDetail
        if(flying_from && flying_to !== null){
            setOrides1({
                "JourneyType": "R",
                "OriginDestination": [
                    {
                        "Origin": travelDetail.origin_code,
                        "Destination": travelDetail.destination_code,
                        "DepartureDate": travelDetail.date,
                    },
                    {    
                        "Origin": travelDetail.destination_code,
                        "Destination": travelDetail.origin_code,
                        "DepartureDate": travelDetail.dateRE,
                    }
                ],
                "ClassType": `${travelDetail.class_type === 'Economy' ? 'E' : travelDetail.class_type === 'Business' ? 'B' : travelDetail.class_type === 'FirstClass' ? 'F' : travelDetail.class_type === 'Premium' ? 'P' : 'E'}`,
                "NoOfInfant": {
                    "Count": travelDetail.infant,
                    "Age": {}
                },
                "NoOfChildren": {
                    "Count": travelDetail.children,
                    "Age": {}
                },
                "NoOfAdult": {
                    "Count": travelDetail.adult
                },
                "PreferredArilines": [],
                "PreferredCurrency": "INR",
                "OtherInfo": {
                    "RequestedIP": "",
                    "TransactionId": ""
                },
                "MultiCityTripdata": []
            })
            navigation.navigate('RoundTrip')
            hideBottomTab("none")

        }
        else{
            triggerAlert()
        }
    }

    let navigateToMulticityWayFlights = () => {
        setStage({ one: true, two: false, three: false })
        let { flying_from1, flying_to1, flying_from2, flying_to2, flying_from3, flying_to3, flying_from4, flying_to4, flying_from5, flying_to5 } = travelDetail
        const OriginDestination = [];

            if (flying_from1 && flying_to1 !== null) {
                OriginDestination.push({
                "Origin": travelDetail.origin_code1,
                "Destination": travelDetail.destination_code1,
                "DepartureDate": travelDetail.date1,
                });
            }

            if (flying_from2 && flying_to2 !== null) {
                OriginDestination.push({
                "Origin": travelDetail.origin_code2,
                "Destination": travelDetail.destination_code2,
                "DepartureDate": travelDetail.date2,
                });
            }

            if (flying_from3 && flying_to3 !== null) {
                OriginDestination.push({
                "Origin": travelDetail.origin_code3,
                "Destination": travelDetail.destination_code3,
                "DepartureDate": travelDetail.date3,
                });
            }

            if (flying_from4 && flying_to4 !== null) {
                OriginDestination.push({
                "Origin": travelDetail.origin_code4,
                "Destination": travelDetail.destination_code4,
                "DepartureDate": travelDetail.date4,
                });
            }

            if (flying_from5 && flying_to5 !== null) {
                OriginDestination.push({
                "Origin": travelDetail.origin_code5,
                "Destination": travelDetail.destination_code5,
                "DepartureDate": travelDetail.date5,
                });
            }

            setOrides2({
                "JourneyType": "M",
                "OriginDestination": OriginDestination,
                "ClassType": `${travelDetail.class_type === 'Economy' ? 'E' : travelDetail.class_type === 'Business' ? 'B' : travelDetail.class_type === 'FirstClass' ? 'F' : travelDetail.class_type === 'Premium' ? 'P' : 'E'}`,
                "NoOfInfant": {
                  "Count": travelDetail.infant,
                  "Age": {}
                },
                "NoOfChildren": {
                  "Count": travelDetail.children,
                  "Age": {}
                },
                "NoOfAdult": {
                  "Count": travelDetail.adult
                },
                "PreferredAirlines": [],
                "PreferredCurrency": "INR",
                "OtherInfo": {
                  "RequestedIP": "",
                  "TransactionId": ""
                },
                "MultiCityTripdata": []
              });
              

              if (OriginDestination.length > 0) {
                navigation.navigate('Multicity');
                hideBottomTab("none")
                console.log("Moving to Multicity");
              } else {
                triggerAlert();
              }
    }


    let triggerAlert = () =>{
        Alert.alert('Please choose Origin & Destination airports.', '', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
    }
    const renderAddAnother = (id) => {
        return (
          <View>
            <AddAnother id={id} style={id === 1 ? box1 : box11} onRemove={() => removeFlight(id)} />
          </View>
        );
      };

      const removeFlight = (id) => {
        setMenuss((prevMenuss) => prevMenuss.filter((item) => item !== id));
      };


    return(
        <View style={_home.container}>
        <StatusBar animated={true} backgroundColor="white" />
            <View style={_home.header}>
                
                <Image source={require('../../assets/Travelfika_header_Logo.png')} style={{
                    height: 60,
                    width: 280
                }} />
            </View>
            <ScrollView style={_home.scrollView}>
                <Card containerStyle={_home.cardOne}>
                    <View style={_home.logoButtons}>
                        <Services title="Hotels" id="2" name="location-city" style={menu === '1' ? selectionStyle : null}/>
                        <Services title="Flights" id="2" name="flight" style={menu === '2' ? selectionStyle : null}/>
                        <Services title="Airport transfer" id="2" name="drive-eta" style={menu === '3' ? selectionStyle : null}/>
                        <Services title="Experiences" id="2" name="explore" style={menu === '4' ? selectionStyle : null}/>
                    </View>
                    <View style={_home.travelButtons}>
                        <TravelType title="Round trip" id='1' style={travel === '1' ? {backgroundColor: '#3B78FF', borderWidth: 0} : null}/>
                        <TravelType title="One way" id='2' style={travel === '2' ? {backgroundColor: '#3B78FF', borderWidth: 0} : null}/>
                        <TravelType title="Multi city" id='3' style={travel === '3' ? {backgroundColor: '#3B78FF', borderWidth: 0} : null}/>
                    </View>

                    {/* RoundTrip */}
                    {travel === "1" && (
                        <View style={_home.inputWrapper}>
                            <TouchableOpacity style={_home.inputBox} onPress={()=>{setJump('from'), setSearchPlaceholder("Flying from"), openSearchModal(true)}}>
                                <Icon name='flight-takeoff' type='material' color='#3B78FF' />
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: travelDetail.flying_from == null ? '100%' : null }}>
                                    <TextInput placeholder='Flying from' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.flying_from}/>
                                </ScrollView>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={_home.inputBox} onPress={()=>{setJump('to'), setSearchPlaceholder("Flying to"), openSearchModal(true)}}>
                                <Icon name='flight-land' type='material' color='#3B78FF' />
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: travelDetail.flying_to == null ? '100%' : null }}>
                                    <TextInput placeholder='Flying to' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.flying_to}/>
                                </ScrollView>
                            </TouchableOpacity>
                            <TouchableOpacity style={_home.inputBox} onPress={() => openCalendar('from')}>
                            <Icon name='calendar' type='ionicon' color='#3B78FF' />
                            <TextInput placeholder='Depart' style={{ width: '40%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.calendar} />
                            <Icon name='calendar' type='ionicon' color='#3B78FF' onPress={() => openCalendar('to')} />
                            <TextInput placeholder='Return' style={{ width: '50%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.returnCal} />
                            </TouchableOpacity>
                            <TouchableOpacity style={_home.inputBox} onPress={() => openCountModal(true)}>
                                    <Icon name='person' type='ionicon' color='#3B78FF' />
                                    <TextInput placeholder='passenger' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.passengers.toString()} />
                                    <View style={{flexDirection: "row", right: 8, width:"27%", justifyContent: 'space-around', paddingHorizontal: 6, borderColor: '#00000029', position:"absolute"}}>
                                    
                                    <View style={_home.countButton}>
                                        {/* <View style={{ borderRightWidth: 1, margin: 4, borderColor: '#707070' }}></View> */}
                                        <Icon name='remove-circle' type='ionicon' color={plusIcon && travelDetail.passengers !== 1 ? '#3B78FF' : "#6f6f70"} size={28} onPress={() => {
                                            setTravelDetail(prevDetail => ({
                                                ...prevDetail,
                                                passengers: prevDetail.adult > 1 ? prevDetail.adult - 1 : 1,
                                                adult: prevDetail.adult > 1 ? prevDetail.adult - 1 : 1,
                                                children: 0,
                                                infant: 0
                                            }))
                                        }} />
                                    </View>

                                    <View style={_home.countButton}>
                                        <Icon name='add-circle' type='ionicon' color='#3B78FF' size={28} onPress={() => {
                                            setTravelDetail(prevDetail => ({
                                                ...prevDetail,
                                                passengers: prevDetail.adult < 10 ? prevDetail.adult + 1 : prevDetail.adult,
                                                adult: prevDetail.adult < 10 ? prevDetail.adult + 1 : prevDetail.adult,
                                                children: 0,
                                                infant: 0
                                            }))
                                            setPlusIcon(true)

                                        }} />
                                     </View>
                                    </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={_home.inputBox} onPress={() => setSort(true)}>
                                <Icon name='airline-seat-recline-normal' type='material' color='#3B78FF' />
                                <TextInput placeholder='Economy' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.class_type}/>
                            </TouchableOpacity>
                            
                            <View style={{ marginVertical: 6 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: "2%" }} onPress={() => {setDirect(!direct)}}>
                                    <View style={[ 
                                        {
                                            width: 16, 
                                            height: 16, 
                                            justifyContent: 'center',
                                            alignItem: 'center',
                                            backgroundColor: direct ? 'white' : '#3B78FF',
                                            borderWidth: direct ? 1 : 0,
                                            borderColor:"#5b5b5c"
                                        }
                                    ]}><Icon name='checkmark' type='ionicon' color='white' size={15}/></View>
                                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginLeft: 6 }}>Direct Flights</Text>
                                </TouchableOpacity>
                            </View>
                           
                        </View>
                    )}

                    {/* oneway */}
                    {travel === "2" && (
                        <View style={_home.inputWrapper}>
                            <TouchableOpacity style={_home.inputBox} onPress={()=>{setJump('from'), setSearchPlaceholder("Flying from"), openSearchModal(true)}}>
                                <Icon name='flight-takeoff' type='material' color='#3B78FF' />
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: travelDetail.flying_from == null ? '100%' : null }}>
                                    <TextInput placeholder='Flying from' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.flying_from}/>
                                </ScrollView>
                            </TouchableOpacity>
                            <TouchableOpacity style={_home.inputBox} onPress={()=>{setJump('to'), setSearchPlaceholder("Flying to"), openSearchModal(true)}}>
                                <Icon name='flight-land' type='material' color='#3B78FF' />
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: travelDetail.flying_to == null ? '100%' : null }}>
                                    <TextInput placeholder='Flying to' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.flying_to}/>
                                </ScrollView>
                            </TouchableOpacity>
                            <TouchableOpacity style={_home.inputBox} onPress={()=> {setJumpDate('from'),openCalendarModal(true)}}>
                                <Icon name='calendar' type='ionicon' color='#3B78FF' />
                                <TextInput placeholder='Departure date' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.calendar}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={_home.inputBox} onPress={() => openCountModal(true)}>
                                    <Icon name='person' type='ionicon' color='#3B78FF' />
                                    <TextInput placeholder='passenger' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.passengers.toString()} />
                                    <View style={{flexDirection: "row", right: 8, width:"27%", justifyContent: 'space-around', paddingHorizontal: 6, borderColor: '#00000029', position:"absolute"}}>
                                    
                                    <View style={_home.countButton}>
                                        {/* <View style={{ borderRightWidth: 1, margin: 4, borderColor: '#707070' }}></View> */}
                                        <Icon name='remove-circle' type='ionicon' color={plusIcon && travelDetail.passengers !== 1 ? '#3B78FF' : "#6f6f70"} size={28} onPress={() => {
                                            setTravelDetail(prevDetail => ({
                                                ...prevDetail,
                                                passengers: prevDetail.adult > 1 ? prevDetail.adult - 1 : 1,
                                                adult: prevDetail.adult > 1 ? prevDetail.adult - 1 : 1,
                                                children: 0,
                                                infant: 0
                                            }))
                                        }} />
                                    </View>

                                    <View style={_home.countButton}>
                                        <Icon name='add-circle' type='ionicon' color='#3B78FF' size={28} onPress={() => {
                                            setTravelDetail(prevDetail => ({
                                                ...prevDetail,
                                                passengers: prevDetail.adult < 10 ? prevDetail.adult + 1 : prevDetail.adult,
                                                adult: prevDetail.adult < 10 ? prevDetail.adult + 1 : prevDetail.adult,
                                                children: 0,
                                                infant: 0
                                            }))
                                            setPlusIcon(true)

                                        }} />
                                     </View>
                                    </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={_home.inputBox} onPress={() => setSort(true)}>
                                <Icon name='airline-seat-recline-normal' type='material' color='#3B78FF' />
                                <TextInput placeholder='Economy' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.class_type}/>
                            </TouchableOpacity>
                            {/*
                            <View style={{ marginVertical: 6 }}>
                                <TouchableOpacity style={{ flexDirection: 'row' }}>
                                    <View style={[ 
                                        {
                                            width: 18, 
                                            height: 18, 
                                            justifyContent: 'center',
                                            alignItem: 'center',
                                            backgroundColor: '#3B78FF', 
                                            borderWidth: 0
                                        }
                                    ]}><Icon name='checkmark' type='ionicon' color='white' size={15}/></View>
                                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginLeft: 6 }}>Direct Flights</Text>
                                </TouchableOpacity>
                            </View>
                            */}
                        </View>
                    )}
                    
                    {/* multicity */}
                    {travel === "3" && (
                            <View style={_home.inputWrapper}>


                                <View>
                                
                                {menuss.map((id) => renderAddAnother(id))}

                                
                                </View>
                                <TouchableOpacity onPress={() => {
                                    if (menuss.length < 5) {
                                        setMenuss((prevMenuss) => [...prevMenuss, menuss.length + 1]);
                                    }
                                    console.log(menuss);
                                    console.log(`card ${menuss.length}`);
                                    }}  >
                                <Text style={{ color: '#3B78FF', fontFamily: 'poppins-bold', fontSize: 15, textAlign: "right", marginRight:"2%" }}>+ Add flight</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={_home.inputBox} onPress={() => openCountModal(true)}>
                                    <Icon name='person' type='ionicon' color='#3B78FF' />
                                    <TextInput placeholder='passenger' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.passengers.toString()} />
                                    <View style={{flexDirection: "row", right: 8, width:"27%", justifyContent: 'space-around', paddingHorizontal: 6, borderColor: '#00000029', position:"absolute"}}>
                                    
                                    <View style={_home.countButton}>
                                        {/* <View style={{ borderRightWidth: 1, margin: 4, borderColor: '#707070' }}></View> */}
                                        <Icon name='remove-circle' type='ionicon' color={plusIcon && travelDetail.passengers !== 1 ? '#3B78FF' : "#6f6f70"} size={28} onPress={() => {
                                            setTravelDetail(prevDetail => ({
                                                ...prevDetail,
                                                passengers: prevDetail.adult > 1 ? prevDetail.adult - 1 : 1,
                                                adult: prevDetail.adult > 1 ? prevDetail.adult - 1 : 1,
                                                children: 0,
                                                infant: 0
                                            }))
                                        }} />
                                    </View>

                                    <View style={_home.countButton}>
                                        <Icon name='add-circle' type='ionicon' color='#3B78FF' size={28} onPress={() => {
                                            setTravelDetail(prevDetail => ({
                                                ...prevDetail,
                                                passengers: prevDetail.adult < 10 ? prevDetail.adult + 1 : prevDetail.adult,
                                                adult: prevDetail.adult < 10 ? prevDetail.adult + 1 : prevDetail.adult,
                                                children: 0,
                                                infant: 0
                                            }))
                                            setPlusIcon(true)

                                        }} />
                                     </View>
                                    </View>
                            </TouchableOpacity>
                            
                                <TouchableOpacity style={_home.inputBox} onPress={() => setSort(true)}>
                                    <Icon name='airline-seat-recline-normal' type='material' color='#3B78FF' />
                                    <TextInput placeholder='Economy' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.class_type1} />
                                </TouchableOpacity>
                                <View style={{ marginVertical: 6 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: "2%" }} onPress={() => {setDirect(!direct)}}>
                                    <View style={[ 
                                        {
                                            width: 16, 
                                            height: 16, 
                                            justifyContent: 'center',
                                            alignItem: 'center',
                                            backgroundColor: direct ? 'white' : '#3B78FF',
                                            borderWidth: direct ? 1 : 0,
                                            borderColor:"#5b5b5c"
                                        }
                                    ]}><Icon name='checkmark' type='ionicon' color='white' size={15}/></View>
                                    <Text style={{ fontFamily: 'poppins-regular', fontSize: 12, marginLeft: 6 }}>Direct Flights</Text>
                                </TouchableOpacity>
                            </View>
                            </View>
                        )}

                    <TouchableOpacity style={_home.searchButton} onPress={() => {
                        if(travel === '1'){
                            hideBottomTab('none')
                            navigateToRoundWayFlights()
                        }
                        else if(travel === '2'){
                            hideBottomTab('none')
                            navigateToOneWayFlights()
                        }else if(travel === '3'){
                            hideBottomTab('none')
                            navigateToMulticityWayFlights()
                            console.log("ok")
                        }
                    }}>
                        <Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 20 }}>Search Flights</Text>
                    </TouchableOpacity>
                </Card>
                <View style={{ height:"auto",marginTop: 30, marginHorizontal: 20, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" }}>
                <View style={{ width:"100%", flexDirection: "row", marginVertical: "2%", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: '85%' }}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 15 }}>Top cities to visit around United States</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Popular places where users used to travel a lot. Explore and have fun</Text>
                    </View>
                    <View style={{ marginLeft:"4%" }}>
                        <View style={{backgroundColor: "#3B78FF", borderRadius:60,marginTop:"45%"}}>
                        <Icon name='chevron-forward' type='ionicon' color='#FFFFFF' size={14} />
                        </View>
                    </View>
                </View>
                <View style={{ marginVertical: 2, marginTop:"3%", marginHorizontal: 13 }}>
                        <Image
                            source={require('../../assets/losangeles.jpg')} style={{
                                height: 189,
                                width: 339,
                                position: "relative", borderRadius: 20
                            }} 
                        />
                        <View style={{ flexDirection: 'row', position:"absolute", marginTop: "45%", marginLeft:"4%" }}>
                            <Icon name='location' type='ionicon' size={15} color="#FFFFFF" marginTop="22%"/>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 16, color:"#FFFFFF" }}>Los Angeles</Text>
                        </View>
                </View>

                <View style={{ marginVertical: 2,marginTop:"3%", marginHorizontal: 13 }}>
                    
                        <Image
                            source={require('../../assets/atlanta.jpg')} style={{
                                height: 189,
                                width: 339,
                                position: "relative", borderRadius: 20

                            }} 
                        />
                        <View style={{ flexDirection: 'row', position: "absolute", marginTop: "45%", marginLeft:"4%" }}>
                            <Icon name='location' type='ionicon'size={15} color="#FFFFFF" marginTop="22%"/>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 16, color:"#FFFFFF" }}>Atlanta</Text>
                        </View>

                </View>

                <View style={{ marginVertical: 2,marginTop:"3%", marginHorizontal: 13 }}>
                    
                        <Image
                            source={require('../../assets/sandiegoj.jpg')} style={{
                                height: 189,
                                width: 339,
                                position: "relative", borderRadius: 20
                            }} 
                        />
                        <View style={{ flexDirection: 'row', position:"absolute", marginTop: "45%", marginLeft:"4%" }}>
                            <Icon name='location' type='ionicon'size={15} color="#FFFFFF" marginTop="22%" />
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 16, color:"#FFFFFF" }}>San Diego</Text>
                        </View>

                </View>
                <View style={{ marginVertical: 2, marginTop:"3%",marginHorizontal: 13 }}>
                
                        <Image
                            source={require('../../assets/sanfranciso.jpg')} style={{
                                height: 189,
                                width: 339,
                                position: "relative", borderRadius: 20
                            }} 
                        />
                        <View style={{ flexDirection: 'row',position:"absolute", marginTop: "45%", marginLeft:"4%"}}>
                            <Icon name='location' type='ionicon' size={15} color="#FFFFFF" marginTop="22%" />
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 16, color:"#FFFFFF" }}>San Francisco</Text>
                        </View>

                </View>

                <View style={{ marginVertical: 2, marginTop:"3%",marginHorizontal: 13 }}>
                
                        <Image
                            source={require('../../assets/newyork.jpg')} style={{
                                height: 189,
                                width: 339,
                                position: "relative", borderRadius: 20
                            }} 
                        />
                        <View style={{ flexDirection: 'row', position: "absolute", marginTop: "45%", marginLeft:"4%" }}>
                            <Icon name='location' type='ionicon' size={15} color="#FFFFFF" marginTop="22%" />
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 16, color:"#FFFFFF" }}>New York</Text>
                        </View>

                </View>
                <View style={{ marginVertical: 2, marginTop:"3%", marginHorizontal: 13 }}>
                
                        <Image
                            source={require('../../assets/miami.jpg')} style={{
                                height: 189,
                                width: 339,
                                position: "relative", borderRadius: 20
                            }} 
                        />
                        <View style={{ flexDirection: 'row',position:"absolute", marginTop: "45%", marginLeft:"4%" }}>
                            <Icon name='location' type='ionicon' size={15} color="#FFFFFF" marginTop="22%" />
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 16, color:"#FFFFFF" }}>Miami</Text>
                        </View>

                </View>

                <View style={{ marginVertical: 2,marginTop:"3%", marginHorizontal: 13 }}>
                
                        <Image
                            source={require('../../assets/seattle.jpg')} style={{
                                height: 189,
                                width: 339,
                                position: "relative", borderRadius: 20
                            }} 
                        />
                        <View style={{ flexDirection: 'row', position:'absolute', marginTop: "45%", marginLeft:"4%" }}>
                            <Icon name='location' type='ionicon' size={15} color="#FFFFFF" marginTop="22%"/>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 16, color:"#FFFFFF" }}>Seattle</Text>
                        </View>
                    

                </View>

                <View style={{ marginVertical: 2,marginTop:"3%", marginHorizontal: 13 }}>
                
                        <Image
                            source={require('../../assets/denver.jpg')} style={{
                                height: 189,
                                width: 339,
                                position: "relative", borderRadius: 20
                            }} 
                        />
                        <View style={{ flexDirection: 'row', position:'absolute', marginTop: "45%", marginLeft:"4%" }}>
                            <Icon name='location' type='ionicon' size={15} color="#FFFFFF" marginTop="22%"/>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 16, color:"#FFFFFF" }}>Denver</Text>
                        </View>

                </View>

                <View style={{ marginVertical: 2,marginTop:"3%", marginHorizontal: 13 }}>
                
                        <Image
                            source={require('../../assets/orlando.jpg')} style={{
                                height: 189,
                                width: 339,
                                position: "relative", borderRadius: 20
                            }} 
                        />
                        <View style={{ flexDirection: 'row', position:"absolute", marginTop: "45%", marginLeft:"4%" }}>
                            <Icon name='location' type='ionicon'size={15} color="#FFFFFF" marginTop="22%"/>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 16, color:"#FFFFFF" }}>Orlando</Text>
                        </View>

                </View>

                <View style={{ marginVertical: 2,marginTop:"3%", marginHorizontal: 13 }}>
                
                        <Card.Image
                            source={require('../../assets/dallas.jpg')} style={{
                                height: 189,
                                width: 339,
                                position: "relative", borderRadius: 20
                            }} 
                        />
                        <View style={{ flexDirection: 'row', position:'absolute', marginTop: "45%", marginLeft:"4%" }}>
                            <Icon name='location' type='ionicon' size={15} color="#FFFFFF" marginTop="22%" />
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 16, color:"#FFFFFF" }}>Dallas</Text>
                        </View>

                </View>
                </View>

        
            </ScrollView>

            {/* calender  */}
            
            <Modal visible={calendarModal} >
                <View style={_home.calendarView}>
                {jumpDate === "from" && <View style={{ width:"100%",justifyContent: "center", alignItems:"center"}}><Text style={{backgroundColor:"#dbeafe", color:"#3b82f6",borderRadius:20, paddingVertical:"2%", paddingHorizontal:"5%",fontFamily: 'poppins-bold', fontSize: 16 }}>Departure Date</Text></View> }
                {jumpDate === "to" && <View style={{ width:"100%",justifyContent: "center", alignItems:"center"}}><Text style={{backgroundColor:"#dbeafe",color:"#3b82f6", borderRadius:20, paddingVertical:"2%", paddingHorizontal:"5%",fontFamily: 'poppins-bold', fontSize: 16 }}>Return Date</Text></View> }

                        <Calendar onDayPress={(date) => {
                            let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            let temp = date.dateString.split('-');
                            temp = temp[1] + '-' + temp[2] + '-' + temp[0];

                            if (travel === "1") {
                                if (jumpDate === "from") {
                                  // "from" date selection
                                  setSelectedFromDate(new Date(date.dateString));
                                  setTravelDetail(prevDetail => ({
                                    ...prevDetail,
                                    calendar: `${days[new Date(date.dateString).getDay()]}, ${months[date.month - 1]} ${date.day}`,
                                    date: temp
                                  }));
                                  setJumpDate('to');
                                } else if (jumpDate === "to") {
                                  // "to" date selection
                                  const selectedDate = new Date(date.dateString);
                                  const fromDate = selectedFromDate || new Date(); // If no "from" date is selected, default to today's date
                          
                                  if (selectedDate > fromDate) {
                                    setTravelDetail(prevDetail => ({
                                      ...prevDetail,
                                      returnCal: `${days[selectedDate.getDay()]}, ${months[date.month - 1]} ${date.day}`,
                                      dateRE: temp
                                    }));
                                    openCalendarModal(false);
                                  }
                                }
                              } else if (travel === "2") {
                                if (jumpDate === "from") {
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        calendar: `${days[new Date(date.dateString.toString()).getDay()]}, ${months[date.month - 1]} ${date.day}`,
                                        date: temp
                                    }));
                                    openCalendarModal(false);
                                }
                            }else if (travel === "3") {
                                if(menuss && menuss1 === 1){
                                if (jumpDate === "from") {
                                    let temptD = `${days[new Date(date.dateString.toString()).getDay()]}, ${months[date.month - 1]} ${date.day}`
                                    let temp1 = temp
                                    let datas = travelDetail
                                    datas.calendar1 = temptD
                                    datas.date1 = temp1
                                
                                    setTravelDetail(datas)
                                    console.log(travelDetail)
                                }
                                openCalendarModal(false);
                            }else if(menuss && menuss1 === 2){
                                    if (jumpDate === "from") {
                                        let temptD = `${days[new Date(date.dateString.toString()).getDay()]}, ${months[date.month - 1]} ${date.day}`
                                        let temp1 = temp
                                        let datas = travelDetail
                                        datas.calendar2 = temptD
                                        datas.date2 = temp1
                                    
                                        setTravelDetail(datas)
                                        console.log(travelDetail)
                                    }
                                    openCalendarModal(false);

                                }else if(menuss && menuss1 === 3){
                                    if (jumpDate === "from") {
                                        let temptD = `${days[new Date(date.dateString.toString()).getDay()]}, ${months[date.month - 1]} ${date.day}`
                                        let temp1 = temp
                                        let datas = travelDetail
                                        datas.calendar3 = temptD
                                        datas.date3 = temp1
                                    
                                        setTravelDetail(datas)
                                        console.log(travelDetail)
                                    }
                                    openCalendarModal(false);

                                }else if(menuss && menuss1 === 4){
                                    if (jumpDate === "from") {
                                        let temptD = `${days[new Date(date.dateString.toString()).getDay()]}, ${months[date.month - 1]} ${date.day}`
                                        let temp1 = temp
                                        let datas = travelDetail
                                        datas.calendar4 = temptD
                                        datas.date4 = temp1
                                    
                                        setTravelDetail(datas)
                                        console.log(travelDetail)
                                    }
                                    openCalendarModal(false);

                                }else if(menuss && menuss1 === 5){
                                    if (jumpDate === "from") {
                                        let temptD = `${days[new Date(date.dateString.toString()).getDay()]}, ${months[date.month - 1]} ${date.day}`
                                        let temp1 = temp
                                        let datas = travelDetail
                                        datas.calendar5 = temptD
                                        datas.date5 = temp1
                                    
                                        setTravelDetail(datas)
                                        console.log(travelDetail)
                                    }
                                    openCalendarModal(false);
                                }
                            }
                        }} />



                </View>
            </Modal>

            {/* Search box */}
            <Modal visible={searchModal}>
            <View style={_home.searchView}>
                <SearchBar
                placeholder={searchPlaceholder}
                platform="android"
                containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#3B78FF',
                }}
                inputStyle={{
                    color: '#3B78FF',
                    fontFamily: 'poppins-regular',
                }}
                onChangeText={inputs => setSearchFlights(inputs)}
                onCancel={() => openSearchModal(false)}
                />
                <View style={{ width: '100%', height: '100%', marginVertical: 8 }}>
                {loading ? ( 

                    <View style={{ flex: 1, flexDirection:"row", justifyContent: 'center', marginTop:"5%" }}>
                        <Text style={{ fontSize:17, fontFamily: 'poppins-regular', color: 'black', alignItems:"center"}}>Searching for airports in {searchFlights} ...
                        </Text>
                    
                    </View>

                ) : (
                <FlatList
                    data={airportList}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            if(travel === "1"){
                                if(jump === 'from'){
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        flying_from: item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')',
                                        origin_code: item.Airport_Code
                                    }))
                                }
                                else if(jump === 'to'){
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        flying_to: item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')',
                                        destination_code: item.Airport_Code
                                    }))
                                }
                                openSearchModal(false)
                            }else if(travel === "2"){
                                if(jump === 'from'){
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        flying_from: item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')',
                                        origin_code: item.Airport_Code
                                    }))
                                }
                                else if(jump === 'to'){
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        flying_to: item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')',
                                        destination_code: item.Airport_Code
                                    }))
                                }
                                openSearchModal(false)
                            }else if(travel === "3"){
                             if(menuss && menuss1 === 1){
                                if(jump3 === 'from'){
                                    let temp = item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')'
                                    let temp1 = item.Airport_Code
                                    let datas = travelDetail
                                    datas.flying_from1 = temp
                                    datas.origin_code1 = temp1
                                
                                    setTravelDetail(datas)
                                    console.log(travelDetail)

                                }
                                else if(jump3 === 'to'){
                                    let temp = item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')'
                                    let temp1 = item.Airport_Code
                                    let datas = travelDetail
                                    datas.flying_to1 = temp
                                    datas.destination_code1 = temp1
                                    
                                    setTravelDetail(datas)
                                    console.log(travelDetail)

                                }
                            }else if(menuss && menuss1 === 2) 
                            {
                                if(jump3 === 'from'){
                                    let temp = item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')'
                                    let temp1 = item.Airport_Code
                                    let datas = travelDetail
                                    datas.flying_from2 = temp
                                    datas.origin_code2 = temp1
                                
                                    setTravelDetail(datas)
                                    console.log(travelDetail)
                                }
                                else if(jump3 === 'to'){
                                    let temp = item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')'
                                    let temp1 = item.Airport_Code
                                    let datas = travelDetail
                                    datas.flying_to2 = temp
                                    datas.destination_code2 = temp1
                                    
                                    setTravelDetail(datas)
                                    console.log(travelDetail)

                                }
                            }else if(menuss && menuss1 === 3)
                            {
                                if(jump3 === 'from'){
                                    let temp = item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')'
                                    let temp1 = item.Airport_Code
                                    let datas = travelDetail
                                    datas.flying_from3 = temp
                                    datas.origin_code3 = temp1
                                
                                    setTravelDetail(datas)
                                    console.log(travelDetail)

                                }
                                else if(jump3 === 'to'){
                                    let temp = item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')'
                                    let temp1 = item.Airport_Code
                                    let datas = travelDetail
                                    datas.flying_to3 = temp
                                    datas.destination_code3 = temp1
                                    
                                    setTravelDetail(datas)
                                    console.log(travelDetail)

                                }
                            }else if(menuss && menuss1 === 4)
                            {
                                if(jump3 === 'from'){
                                    let temp = item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')'
                                    let temp1 = item.Airport_Code
                                    let datas = travelDetail
                                    datas.flying_from4 = temp
                                    datas.origin_code4 = temp1
                                
                                    setTravelDetail(datas)
                                    console.log(travelDetail)

                                }
                                else if(jump3 === 'to'){
                                    let temp = item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')'
                                    let temp1 = item.Airport_Code
                                    let datas = travelDetail
                                    datas.flying_to4 = temp
                                    datas.destination_code4 = temp1
                                    
                                    setTravelDetail(datas)
                                    console.log(travelDetail)

                                }
                            }else if(menuss && menuss1 === 5)
                            {
                                if(jump3 === 'from'){
                                    let temp = item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')'
                                    let temp1 = item.Airport_Code
                                    let datas = travelDetail
                                    datas.flying_from5 = temp
                                    datas.origin_code5 = temp1
                                
                                    setTravelDetail(datas)
                                    console.log(travelDetail)

                                }
                                else if(jump3 === 'to'){
                                    let temp = item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')'
                                    let temp1 = item.Airport_Code
                                    let datas = travelDetail
                                    datas.flying_to5 = temp
                                    datas.destination_code5 = temp1
                                    
                                    setTravelDetail(datas)
                                    console.log(travelDetail)

                                }
                            }
                            
                        openSearchModal(false);
                        console.log(travelDetail)
                        }}
                    }
                        style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 6,
                        paddingHorizontal: 8,
                        }}>
                        <Icon
                        name="airplane"
                        type="ionicon"
                        color="#3B78FF"
                        style={{ transform: [{ rotate: '-90deg' }] }}
                        />
                        <Text
                        style={{
                            fontFamily: 'poppins-bold',
                            color: '#3B78FF',
                            fontSize: 20,
                            marginLeft: 18,
                            flexWrap: 'wrap',
                        }}>
                        {item.City_name +
                            ', ' +
                            item.Country_Name +
                            ' - ' +
                            item.Airport_Name +
                            ' (' +
                            item.Airport_Code +
                            ')'}
                        </Text>
                    </TouchableOpacity>
                    )}
                />
                )}
                </View>
            </View>
            </Modal>


            {/* type of class */}
            <Modal visible={sort} transparent={true}>
                <View style={_home.sortCard}>
                    <Card containerStyle={{ borderRadius: 22 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}
                        onPress={()=> {
                            setTravelDetail(prevDetail => ({
                            ...prevDetail,
                            class_type: 'Economy'
                            }))
                            setSort(false)
                        }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Economy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}
                        onPress={()=> {
                            setTravelDetail(prevDetail => ({
                            ...prevDetail,
                            class_type: 'Business'
                            }))
                            setSort(false)
                        }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Business</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#C9C9C9' }}
                        onPress={()=> {
                            setTravelDetail(prevDetail => ({
                            ...prevDetail,
                            class_type: 'FirstClass'
                            }))
                            setSort(false)
                        }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>First Class</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between' }}
                        onPress={()=> {
                            setTravelDetail(prevDetail => ({
                            ...prevDetail,
                            class_type: 'Premium'
                            }))
                            setSort(false)
                        }}>
                            <Text style={{ fontFamily: 'poppins-regular', fontSize: 20, color: '#0D3283' }}>Premium</Text>
                        </TouchableOpacity>
                    </Card>
                    <View style={_home.cancelButton}>
                        <TouchableOpacity style={{ backgroundColor: '#3B78FF', borderRadius: 10, paddingHorizontal: 100, paddingVertical: 10 }}
                        onPress={()=>setSort(false)}>
                            <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* passenger details */}
            <Modal visible={countModal} transparent={true}>
            <View style={_home.countStyle}>
                <Card containerStyle={{ borderRadius: 22 }}>
                <Card.Title style={{ fontSize: 18, color: '#3B78FF' }}>Passengers</Card.Title>
                <Card.Divider />
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>
                    <View style={{ width: '45%', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'poppins-bold', color: '#3B78FF' }}>Adult</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'poppins-regular', color: '#3B78FF' }}>Age 13 or above</Text>
                    </View>
                    <View style={{ width: '45%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                        onPress={() => {
                        setTravelDetail(prevDetail => ({
                            ...prevDetail,
                            adult: prevDetail.adult > 1 ? prevDetail.adult - 1 : 1
                        }))
                        }}
                    >
                        <Icon name="remove" type="material" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontFamily: 'poppins-bold', color: '#3B78FF' }}>{travelDetail.adult}</Text>
                    <TouchableOpacity
                        style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                        onPress={() => {
                        setTravelDetail(prevDetail => ({
                            ...prevDetail,
                            adult: prevDetail.adult < (10 - prevDetail.children - prevDetail.infant) ? prevDetail.adult + 1 : prevDetail.adult
                        }))
                        }}
                    >
                        <Icon name="add" type="material" />
                    </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>
                    <View style={{ width: '45%', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'poppins-bold', color: '#3B78FF' }}>Children</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'poppins-regular', color: '#3B78FF' }}>Age 2-12</Text>
                    </View>
                    <View style={{ width: '45%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                        onPress={() => {
                        setTravelDetail(prevDetail => ({
                            ...prevDetail,
                            children: prevDetail.children > 0 ? prevDetail.children - 1 : 0
                        }))
                        }}
                        >
                        <Icon name="remove" type="material" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontFamily: 'poppins-bold', color: '#3B78FF' }}>{travelDetail.children}</Text>
                    <TouchableOpacity
                        style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                        onPress={() => {
                        setTravelDetail(prevDetail => ({
                            ...prevDetail,
                            children: prevDetail.children < (10 - prevDetail.adult - prevDetail.infant)? prevDetail.children + 1 : prevDetail.children
                        }))
                        }}
                    >
                        <Icon name="add" type="material" />
                    </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>
                    <View style={{ width: '45%', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'poppins-bold', color: '#3B78FF' }}>Infants</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'poppins-regular', color: '#3B78FF' }}>Age 0-2</Text>
                    </View>
                    <View style={{ width: '45%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                        onPress={() => {
                        setTravelDetail(prevDetail => ({
                            ...prevDetail,
                            infant: prevDetail.infant > 0 ? prevDetail.infant - 1 : 0
                        }))
                        }}
                        >
                        <Icon name="remove" type="material" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontFamily: 'poppins-bold', color: '#3B78FF' }}>{travelDetail.infant}</Text>
                    <TouchableOpacity
                        style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                        onPress={() => {
                        setTravelDetail(prevDetail => ({
                            ...prevDetail,
                            infant: prevDetail.infant < (10 - prevDetail.children - prevDetail.adult) ? prevDetail.infant + 1 : prevDetail.infant
                        }))
                        }}
                        >
                        <Icon name="add" type="material" />
                    </TouchableOpacity>
                    </View>
                </View>
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 18 }}>
                    <TouchableOpacity
                    style={{ backgroundColor: '#3B78FF', borderRadius: 10, paddingHorizontal: 100, paddingVertical: 10 }}
                    onPress={() => {
                        setTravelDetail(prevDetail => ({
                        ...prevDetail,
                        passengers: travelDetail.adult + travelDetail.children + travelDetail.infant
                        }))
                        openCountModal(false)
                    }}>
                    <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>Done</Text>
                    </TouchableOpacity>
                </View>
                </Card>
            </View>
            </Modal>

        </View>
    )
}

let _home = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    header: {
        width: '100%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    cardOne: {
        borderRadius: 22, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 3, 
        elevation: 3
    },
    logoButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    travelButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around'
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
        borderColor: '#06122BB3',
    },
    countButton: {
        width: 29,
        height:29,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        borderColor: '#00000029',
    },
    searchButton: {
        height: 42,
        backgroundColor: '#3B78FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 16
    },
    placesList: {
        marginVertical: 40,
        marginHorizontal: 20
    },
    calendarView: {
        marginTop: 30,
        width: '100%',
        height: '100%'
    },
    searchView: {
        width: '100%',
        height: '100%',
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginTop: 30
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
    },
    countStyle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

   {/* <Modal visible={searchModal}>
                <View style={_home.searchView}>
                    <SearchBar placeholder="Flying from" platform="android" 
                        containerStyle={{ 
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: '#3B78FF',
                        }}
                        inputStyle={{
                            color: '#3B78FF',
                            fontFamily: 'poppins-regular'
                        }}
                        onChangeText={(inputs) => setSearchFlights(inputs)}
                        onCancel={() => openSearchModal(false)} />
                    <View style={{ width: '100%', height: '100%', marginVertical: 8 }}>
                        <FlatList 
                            data={airportList}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => {
                                    if(jump === 'from'){
                                        setTravelDetail(prevDetail => ({
                                            ...prevDetail,
                                            flying_from: item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')',
                                            origin_code: item.Airport_Code
                                        }))
                                    }
                                    else if(jump === 'to'){
                                        setTravelDetail(prevDetail => ({
                                            ...prevDetail,
                                            flying_to: item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')',
                                            destination_code: item.Airport_Code
                                        }))
                                    }
                                    openSearchModal(false)
                                }} style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginVertical: 6,
                                    paddingHorizontal: 8
                                }}>
                                    <Icon name="airplane" type="ionicon" color='#3B78FF' style={{ transform: [{rotate: '-90deg'}] }}/>
                                    <Text style={{ fontFamily: 'poppins-bold', color: '#3B78FF', fontSize: 20, marginLeft: 18, flexWrap: 'wrap' }}>{item.City_name+', '+item.Country_Name+' - '+item.Airport_Name+' ('+item.Airport_Code+')'}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal> */}