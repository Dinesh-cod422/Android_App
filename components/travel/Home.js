import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Image, Alert } from "react-native";
import { Card, Icon, SearchBar } from '@rneui/themed';
import React, { useState, useContext, useEffect } from "react";
import { globalState } from "../../App";
import { Calendar } from 'react-native-calendars';
import axios from "axios";
import { AirportSearchUrl } from "../endpoint/Endpoint";

export default function Home({ navigation }){

    let { bottomTab, hideBottomTab, 
        stage, setStage, 
        travel, setTravel, 
        travelDetail, setTravelDetail, 
        orides, setOrides } = useContext(globalState)
    let [menu, setMenu] = useState('2') /* <- For Menu */
    let [calendarModal, openCalendarModal] = useState(false)
    let [searchModal, openSearchModal] = useState(false)
    let [searchFlights, setSearchFlights] = useState()
    let [airportList, setAirportList] = useState([]) /* City_Name, Country_Name - Airport_Name (Airport_Code) */
    let [jump, setJump] = useState('from')
    let [sort, setSort] = useState(false)
    let [countModal, openCountModal] = useState(false)

    let selectionStyle = {
        padding: 4,
        backgroundColor: '#E7EDFB',
        borderRadius: 4,
        borderWidth: 1,
        color: '#3B78FF',
        borderColor: '#3B78FF',
    }

    useEffect(() => {
        if(searchFlights !== undefined){
            axios.get(`${AirportSearchUrl}${searchFlights}`)
            .then((response) => {
                let loop = response.data.result
                setAirportList(loop)
            })
            .catch((err) => {
                console.log('Error: ' + err);
            })
        }
    }, [searchFlights])

    let initCalendar = () => {
        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        let d = new Date()
        d = days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate()
        return d
    }
    
    useEffect(() => {
        setTravelDetail(prevDetail => ({
            ...prevDetail,
            calendar: initCalendar()
        }))
    }, [])

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
                            textAlign: 'center'
                        },
                        props.style
                    ]}>{props.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }


    let TravelType = (props) => {
        return(
            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 18 }}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={()=>setTravel(props.id)}>
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

    let PlacesList = () => {
        return(
            <View style={{ marginVertical: 40, marginHorizontal: 20 }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: '90%' }}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 15 }}>Top cities to visit around United Kingdom</Text>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 12 }}>Popular places where users used to travel a lot. Explore and have fun</Text>
                    </View>
                    <View>
                        <Icon name='chevron-forward-outline' type='ionicon' color='#3B78FF' reverse size={14} />
                    </View>
                </View>
                <Card>
                    <Card.Image
                        source={{
                        uri:
                            'https://awildgeographer.files.wordpress.com/2015/02/john_muir_glacier.jpg',
                        }}
                    />
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                        <Icon name='location' type='ionicon' />
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 16 }}>Scotland</Text>
                    </View>
                </Card>
            </View>
        )
    }

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
                        "DepartureDate": travelDetail.date
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

    let triggerAlert = () =>{
        Alert.alert('Please choose Origin & Destination airports.', '', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
    }

    return(
        <View style={_home.container}>
            <View style={_home.header}>
                {/*
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 24, color: '#3C77FF' }}>TravelFika</Text>
                */}
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
                        <TravelType title="Round trip" id='2' style={travel === '1' ? {backgroundColor: '#3B78FF', borderWidth: 0} : null}/>
                        <TravelType title="One way" id='2' style={travel === '2' ? {backgroundColor: '#3B78FF', borderWidth: 0} : null}/>
                        <TravelType title="Multi city" id='2' style={travel === '3' ? {backgroundColor: '#3B78FF', borderWidth: 0} : null}/>
                    </View>
                    <View style={_home.inputWrapper}>
                        <TouchableOpacity style={_home.inputBox} onPress={()=>{setJump('from'), openSearchModal(true)}}>
                            <Icon name='flight-takeoff' type='material' color='#3B78FF' />
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: travelDetail.flying_from == null ? '100%' : null }}>
                                <TextInput placeholder='Flying from' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.flying_from}/>
                            </ScrollView>
                        </TouchableOpacity>
                        <TouchableOpacity style={_home.inputBox} onPress={()=>{setJump('to'), openSearchModal(true)}}>
                            <Icon name='flight-land' type='material' color='#3B78FF' />
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: travelDetail.flying_to == null ? '100%' : null }}>
                                <TextInput placeholder='Flying to' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.flying_to}/>
                            </ScrollView>
                        </TouchableOpacity>
                        <TouchableOpacity style={_home.inputBox} onPress={()=>openCalendarModal(true)}>
                            <Icon name='calendar' type='ionicon' color='#3B78FF' />
                            <TextInput placeholder='Calendar' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.calendar}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={_home.inputBox} onPress={()=>openCountModal(true)}>
                            <Icon name='person' type='ionicon' color='#3B78FF' />
                            <TextInput placeholder='passenger' style={{ width: '100%', height: '100%', paddingLeft: 6, color: 'black', fontFamily: 'poppins-regular' }} editable={false} value={travelDetail.passengers.toString()} />
                            {/*
                            <View style={_home.countButton}>
                                <Icon name='add' type='ionicon' color='#3B78FF' onPress={()=>{
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        passengers: prevDetail.passengers + 1
                                    }))
                                }} />
                                <View style={{ borderRightWidth: 1, margin: 4, borderColor: '#707070' }}></View>
                                <Icon name='remove' type='ionicon' color='#3B78FF' onPress={()=>{
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        passengers: prevDetail.passengers > 1 ? prevDetail.passengers - 1 : 1
                                    }))
                                }}/>
                            </View>
                            */}
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
                    <TouchableOpacity style={_home.searchButton} onPress={() => {
                        if(travel === '1'){
                            hideBottomTab('none')
                            navigation.navigate('RoundTrip')
                        }
                        else if(travel === '2'){
                            hideBottomTab('none')
                            navigateToOneWayFlights()
                        }
                    }}>
                        <Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 20 }}>Search Flights</Text>
                    </TouchableOpacity>
                </Card>
                <PlacesList />
                <PlacesList />
                <PlacesList />
            </ScrollView>
            <Modal visible={calendarModal}>
                <View style={_home.calendarView}>
                    <Calendar onDayPress={(date)=>{
                        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                        let temp = date.dateString.split('-')
                        temp = temp[1]+'-'+temp[2]+'-'+temp[0]
                        setTravelDetail(prevDetail => ({
                            ...prevDetail,
                            calendar: `${days[new Date(date.dateString.toString()).getDay()]}, ${months[date.month-1]} ${date.day}`,
                            date: temp
                        }))
                        openCalendarModal(false)
                    }}/>
                </View>
            </Modal>
            <Modal visible={searchModal}>
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
            </Modal>
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
                                <TouchableOpacity style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                                onPress={()=>{
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        adult: prevDetail.adult + 1
                                    }))
                                }}>
                                    <Icon name="add" type="material" />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 20, fontFamily: 'poppins-bold', color: '#3B78FF' }}>{travelDetail.adult}</Text>
                                <TouchableOpacity style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                                onPress={()=>{
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        adult: prevDetail.adult > 1 ? prevDetail.adult - 1 : 1
                                    }))
                                }}>
                                    <Icon name="remove" type="material" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>
                            <View style={{ width: '45%', alignItems: 'flex-start' }}>
                                <Text style={{ fontSize: 16, fontFamily: 'poppins-bold', color: '#3B78FF' }}>Childern</Text>
                                <Text style={{ fontSize: 12, fontFamily: 'poppins-regular', color: '#3B78FF' }}>Age 2-12</Text>
                            </View>
                            <View style={{ width: '45%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <TouchableOpacity style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                                onPress={()=>{
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        children: prevDetail.children + 1
                                    }))
                                }}>
                                    <Icon name="add" type="material" />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 20, fontFamily: 'poppins-bold', color: '#3B78FF' }}>{travelDetail.children}</Text>
                                <TouchableOpacity style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                                onPress={()=>{
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        children: prevDetail.children > 0 ? prevDetail.children - 1 : 0
                                    }))
                                }}>
                                    <Icon name="remove" type="material" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>
                            <View style={{ width: '45%', alignItems: 'flex-start' }}>
                                <Text style={{ fontSize: 16, fontFamily: 'poppins-bold', color: '#3B78FF' }}>Infants</Text>
                                <Text style={{ fontSize: 12, fontFamily: 'poppins-regular', color: '#3B78FF' }}>Age 0-2</Text>
                            </View>
                            <View style={{ width: '45%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                                onPress={()=>{
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        infant: prevDetail.infant + 1
                                    }))
                                }}>
                                    <Icon name="add" type="material" />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 20, fontFamily: 'poppins-bold', color: '#3B78FF' }}>{travelDetail.infant}</Text>
                                <TouchableOpacity style={{ borderWidth: 1, borderRadius: 100, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 }}
                                onPress={()=>{
                                    setTravelDetail(prevDetail => ({
                                        ...prevDetail,
                                        infant: prevDetail.infant > 0 ? prevDetail.infant - 1 : 0
                                    }))
                                }}>
                                    <Icon name="remove" type="material" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 18 }}>
                        <TouchableOpacity style={{ backgroundColor: '#3B78FF', borderRadius: 10, paddingHorizontal: 100, paddingVertical: 10 }}
                        onPress={()=>{
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
        borderRadius: 22
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
        position: 'absolute', 
        flexDirection: 'row', 
        right: 8,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'space-around',
        paddingHorizontal: 6,
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