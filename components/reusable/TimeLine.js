import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, SafeAreaView } from 'react-native';
import { Icon } from '@rneui/themed';
import React, { useContext } from 'react';
import { globalState } from '../../App';

export default function TimeLine({ goBack }){

    let { bottomTab, 
        hideBottomTab, 
        stage, setStage, 
        travel, setTravel,
        travelDetail, setTravelDetail } = useContext(globalState)

    let ProgressCircle = () => {
        return(
            <View style={{ width: '100%', alignItems: 'center', marginVertical: 24 }}>
                <View style={{ height: 1, width: '75%', backgroundColor: 'white', marginVertical: 10 }}></View>
                {/*one*/}
                <View style={{ alignItems: 'center', position: 'absolute', top: '6%', left: '3%' }}>
                    {
                        stage.one ?
                        <View style={{ width: 20, height: 20, borderRadius: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name='checkmark-outline' type='ionicon' color='#3B78FF' size={16} />
                        </View>:
                        <View style={{ width: 20, height: 20, borderRadius: 100, backgroundColor: 'white' }}></View>
                    }
                    <Text style={{ marginVertical: 12, fontSize: 12, fontFamily: stage.one ? 'poppins-bold':'poppins-regular', textAlign: 'center', color: 'white'}}>Choose Flight</Text>
                </View>
                {/*two*/}
                <View style={{ alignItems: 'center', position: 'absolute', top: '6%', left: '38%' }}>
                    {
                        stage.two ?
                        <View style={{ width: 20, height: 20, borderRadius: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name='checkmark-outline' type='ionicon' color='#3B78FF' size={16} />
                        </View>:
                        <View style={{ width: 20, height: 20, borderRadius: 100, backgroundColor: 'white' }}></View>
                    }
                    <Text style={{ marginVertical: 12, fontSize: 12, fontFamily: stage.two ? 'poppins-bold':'poppins-regular', textAlign: 'center', color: 'white'}}>Passenger &{"\n"}payment details</Text>
                </View>
                {/*three*/}
                <View style={{ alignItems: 'center', position: 'absolute', top: '6%', left: '76%' }}>
                    {
                        stage.three ?
                        <View style={{ width: 20, height: 20, borderRadius: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name='checkmark-outline' type='ionicon' color='#3B78FF' size={16} />
                        </View>:
                        <View style={{ width: 20, height: 20, borderRadius: 100, backgroundColor: 'white' }}></View>
                    }
                    <Text style={{ marginVertical: 12, fontSize: 12, fontFamily: stage.three ? 'poppins-bold':'poppins-regular', textAlign: 'center', color: 'white'}}>Booking{"\n"}confirmation</Text>
                </View>
            </View>
        )
    }

    return(
        <>
        
        {(travel === "2" || travel === "1") && <View style={_flights.progressLine}>
            <View style={{ flexDirection: 'row', marginVertical: '1%', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>{`${travelDetail.origin_code} - ${travelDetail.destination_code}`}</Text>
                <TouchableOpacity>
                    <Icon name='create-outline' type='ionicon' color='white' style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
            <Text style={{ fontFamily: 'poppins-regular', fontSize: 15, color: 'white' }}>{`${travelDetail.calendar} - ${travelDetail.passengers} passengers`}</Text>
            <TouchableOpacity style={{ position: 'absolute', left: 20, top: 35 }} onPress={() => {
                goBack()
            }}>
                <Icon name='chevron-back' type='ionicon' color='white' size={40} />
            </TouchableOpacity>
            {/* Progress bar */}
            <ProgressCircle />
            {/* Progress bar */}
        </View>}

        {travel === "3" &&
         <View style={_flights.progressLine}>
            <View style={{ flexDirection: 'row', marginTop: '4%', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 20, color: 'white' }}>{`${travelDetail.origin_code1? travelDetail.origin_code1 :""} ${travelDetail.destination_code1? '-' + travelDetail.destination_code1: ""} ${travelDetail.destination_code2? '-' + travelDetail.destination_code2: ""} ${travelDetail.destination_code3? '-' + travelDetail.destination_code3: ""} ${travelDetail.destination_code4? '-' + travelDetail.destination_code4: ""} ${travelDetail.destination_code5? '-' + travelDetail.destination_code5: ""}`}</Text>
                <TouchableOpacity>
                    <Icon name='create-outline' type='ionicon' color='white' style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
            <ScrollView >
                {travelDetail.calendar1? (
                <Text style={{ fontFamily: 'poppins-regular', fontSize: 15, color: 'white' }}>{`${travelDetail.calendar1} - ${travelDetail.passengers} passengers`}</Text>
                ) : null}
                {travelDetail.calendar2? (
                <Text style={{ fontFamily: 'poppins-regular', fontSize: 15, color: 'white' }}>{`${travelDetail.calendar2} - ${travelDetail.passengers} passengers`}</Text>
                ):null}
                {travelDetail.calendar3? (
                <Text style={{ fontFamily: 'poppins-regular', fontSize: 15, color: 'white' }}>{`${travelDetail.calendar3} - ${travelDetail.passengers} passengers`}</Text>
                ) : null}
                {travelDetail.calendar4? (
                <Text style={{ fontFamily: 'poppins-regular', fontSize: 15, color: 'white' }}>{`${travelDetail.calendar4} - ${travelDetail.passengers} passengers`}</Text>
                ) : null}
                {travelDetail.calendar5? (
                <Text style={{ fontFamily: 'poppins-regular', fontSize: 15, color: 'white' }}>{`${travelDetail.calendar5} - ${travelDetail.passengers} passengers`}</Text>
                ) : null}
            </ScrollView>

            <TouchableOpacity style={{ position: 'absolute', left: 20, top: 35 }} onPress={() => {
                goBack()
            }}>
                <Icon name='chevron-back' type='ionicon' color='white' size={40} />
            </TouchableOpacity>
            {/* Progress bar */}
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 15 }}>

            <ProgressCircle />
            </View>
            {/* Progress bar */}
        </View>}
        
        </>
    )
}

let _flights = StyleSheet.create({
    progressLine: {
        width: '100%',
        height: 200,
        backgroundColor: '#3B78FF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20
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