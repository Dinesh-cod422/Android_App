import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function Landing({ navigation }){

    return(
        <View style={_landing.container}>
            <View style={_landing.parentCurve}>
                <View style={_landing.childCurve}>
                    <Image
                    style={_landing.theImage}
                    source={require('../../assets/_one.jpg')}
                    />
                </View>
            </View>
            <View style={_landing.theContent}>
                <Text style={{ fontFamily: 'poppins-bold', fontSize: 50 }}>Travelfika</Text>
                <Text style={{ fontFamily: 'poppins-regular', fontSize: 15, textAlign: 'center' }}>{'Travel always exciting and\ncreate unforgettable memories\nin our life'}</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('Policy')}>
                <Text style={{ fontFamily: 'poppins-regular', fontSize: 15, textAlign: 'center', textDecorationLine: 'underline', color: 'blue' }}>Terms & Conditions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={_landing.button} onPress={()=>navigation.navigate('FikaTab')}>
                    <Text style={{ color: 'white', fontFamily: 'poppins-regular', fontSize: 20 }}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const _landing = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    theImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    },
    parentCurve : {
        height : '55%',
        width : '100%',
        transform : [ { scaleX : 2 } ],
        borderBottomStartRadius : 200,
        borderBottomEndRadius : 200,
        overflow : 'hidden',
    },
    childCurve : {
        flex : 1,
        transform : [ { scaleX : 0.5 } ],
        backgroundColor : 'yellow',
        alignItems : 'center',
        justifyContent : 'center'
    },
    theContent: {
        width: '100%',
        height: '40%',
        backgroundColor: 'white',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    button: {
        paddingHorizontal: 60,
        paddingVertical: 16,
        borderRadius: 50,
        backgroundColor: '#3C77FF',
    }
})