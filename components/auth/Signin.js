import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import React, { useState, useContext } from 'react';
import { globalState } from '../../App';

export default function Signin(){

    let [secureText, setSecureText] = useState(true)
    let {header, setHeader, logged, setLogin} = useContext(globalState)

    return(
        <View style={_signin.container}>
            <ScrollView>
                <Card containerStyle={_signin.card}>
                    <View style={_signin.header}>
                        <Text style={{ fontFamily: 'poppins-bold', fontSize: 35, color: '#3C77FF' }}>TravelFika</Text>
                    </View>
                    <View style={_signin.inputWrapper}>
                        <TextInput placeholder='Email address' style={_signin.inputBox}/>
                        <TextInput placeholder='Password' secureTextEntry={secureText} style={_signin.inputBox}/>
                        <TouchableOpacity style={{ 
                            position: 'absolute',
                            bottom: 17,
                            right: 10 
                        }} onPress={secureText ? ()=>{setSecureText(false)}:()=>setSecureText(true)}>
                            <Icon
                                name={secureText ? 'eye-off' : 'eye'}
                                type='ionicon'
                                color='#06122B'
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={{ fontFamily: 'poppins-bold', color: '#3B78FF', marginLeft: 12 }}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={_signin.buttons} onPress={() => setLogin(true)}>
                        <Text style={{ fontSize: 18,  fontFamily: 'poppins-bold', color: 'white' }}>Signin</Text>
                    </TouchableOpacity>
                    <View style={_signin.textContent}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>Create an account if you are new to Travelfika</Text>
                    </View>
                    <TouchableOpacity style={_signin.buttons}>
                        <Text style={{ fontSize: 18,  fontFamily: 'poppins-bold', color: 'white' }}>Create account</Text>
                    </TouchableOpacity>
                    <View style={_signin.textContent}>
                        <Text style={{ fontFamily: 'poppins-regular', fontSize: 11 }}>Or</Text>
                    </View>
                    <TouchableOpacity style={[_signin.buttons, {backgroundColor: 'white'}]}>
                        <Icon
                            name='logo-google'
                            type='ionicon'
                            color='#06122B'
                        />
                        <Text style={{ fontSize: 18,  fontFamily: 'poppins-bold', color: '#06122B' }}>Sign with Google</Text>
                    </TouchableOpacity>
                </Card>
            </ScrollView>
        </View>
    )
}

const _signin = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    card: {
        paddingVertical: 40,
        paddingHorizontal: 30,
        borderRadius: 22
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    inputWrapper: {
        marginVertical: 14
    },
    inputBox: {
        borderWidth: 1,
        borderRadius: 10,
        height: 40,
        padding: 0,
        paddingLeft: 14,
        marginVertical: 10
    },
    buttons: {
        flexDirection: 'row',
        backgroundColor: '#3B78FF',
        height: 40,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 14,
        borderRadius: 10,
        elevation: 2
    },
    textContent: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})