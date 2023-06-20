import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, FlatList } from 'react-native';
import { Icon, Card } from '@rneui/themed';
import React, { useState, useEffect, useContext } from 'react';
import { globalState } from '../../App';
import TimeLine from './TimeLine';

export default function RoundTripFlights({ navigation }){

    let { bottomTab, hideBottomTab, stage, setStage } = useContext(globalState)
    let [sort, setSort] = useState(false)
    let [flightInfo, setFlightInfo] = useState([
        {id: 1, data: 'one'},
        {id: 2, data: 'two'},
        {id: 3, data: 'three'},
        {id: 4, data: 'four'},
        {id: 5, data: 'five'},
    ])

    useEffect(() => {
        setStage({
            one: true,
            two: false,
            three: false
        })
    }, [])

    return(
        <View style={_flights.container}>
            <TimeLine goBack={()=>{navigation.navigate('Home'), hideBottomTab('flex')}}/>
            <FlatList
                data={flightInfo}
                renderItem={({ item }) => (
                    <View>
                        {/* Round-trip flights list starts here */}
                        <TouchableOpacity onPress={()=>{
                            navigation.navigate('Baggage')
                        }}>
                            <Card containerStyle={{ borderRadius: 22, padding: 0 }}>
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
                        </TouchableOpacity>
                        {/* Round-trip flights list ends here */}
                    </View>
                )}
                keyExtractor={item => item.id}
            />
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