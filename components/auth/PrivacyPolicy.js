import { Icon } from '@rneui/base';
import { useState } from 'react';
import { ScrollView, StyleSheet, Linking,TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";

export default function PrivacyPolicy({navigation}){
    const [icon, setIcon] = useState(false)

    const travelFika = () => {
        Linking.openURL('https://www.travelfika.com');
    }
   return(
    <View style={_privacy.container}>
        <View style={_privacy.con1}>
        <View >
          <Image source={require('../../assets/Travelfika_header_Logo.png')} style={{
              height: 48,
              width: 264,
              
            }} />
      </View>
        </View>
        <ScrollView>
        <View style={_privacy.box1}>
        <Text style= {{fontFamily: 'poppins-regular', fontSize: 12, marginTop: "3%"}}>Please read these terms and conditions carefully before using our services. By accessing our website and booking any travel arrangements through <Text style={_privacy.hyperlinkStyle} onPress={travelFika}>Travelfika.com,</Text> you agree to be bound by the following terms and conditions:</Text>
        <Text style= {_privacy.text1}>1. Introduction</Text>
        <Text style= {_privacy.text2}>- Welcome to <Text style={_privacy.hyperlinkStyle} onPress={travelFika}>Travelfika.com,</Text> These terms and conditions govern your use of our website and the services we provide. By accessing our website, you agree to comply with these terms and conditions. Please refrain from using our services if you disagree with any of the terms and conditions which has been listed here.</Text>
        <Text style= {_privacy.text1}>2. For Your Understanding</Text>
        <Text style= {_privacy.text2}>- "<Text style={_privacy.hyperlinkStyle} onPress={travelFika}>Travelfika.com,</Text>" refers to our travel company.</Text>
        <Text style= {_privacy.text2}>- "Website" refers to the official website of Travelfika.</Text>
        <Text style= {_privacy.text1}>3. Booking and Confirmation</Text>
        <Text style= {_privacy.text2}>- When you make a booking through our website, you are making an offer to purchase travel services. All bookings are subject to availability and confirmation.</Text>
        <Text style= {_privacy.text2}>- After submitting a booking request, you will receive a confirmation email containing the details of your booking. Please review the confirmation carefully and contact us immediately if there are any errors or discrepancies.</Text>
        <Text style= {_privacy.text1}>4. Payments</Text>
        <Text style= {_privacy.text2}>- All prices listed on our website are  currency specified and are subjected to change without notice.</Text>
        <Text style= {_privacy.text2}>- Payment methods accepted include credit cards, debit cards, and other forms of online payment as specified on the website.</Text>
        <Text style= {_privacy.text2}>- By giving us your payment details, you give us permission to charge the full cost of your reservation to the specified payment method.</Text>
        <Text style= {_privacy.text1}>5. Cancellations and Refunds</Text>
        <Text style= {_privacy.text2}>- Cancellation policies vary depending on the type of travel arrangement booked and may be subject to fees or penalties.</Text>
        <Text style= {_privacy.text2}>- Refund eligibility is determined by the terms and conditions of our suppliers (e.g., airlines, hotels, tour operators).</Text>
        <Text style= {_privacy.text2}>- To request a cancellation or refund, please contact our customer service team directly.</Text>
        <Text style= {_privacy.text1}>6. Travel Documents and Requirements</Text>
        <Text style= {_privacy.text2}>- It is your duty to make sure you carry the necessary travel documentation (such as passports and visas) essential for your intended destination(s).</Text>
        <Text style= {_privacy.text2}>- We recommend you to review the travel restrictions, entry requirements, and health advisories of your destination(s) before booking.</Text>
        <Text style= {_privacy.text1}>7. Travel Insurance</Text>
        <Text style= {_privacy.text2}>- We strongly recommend that you obtain travel insurance to protect yourself against unexpected events, cancellations, or emergencies.</Text>
        <Text style= {_privacy.text2}>- It is your responsibility to review and understand the terms, coverage, and limitations of any insurance policy you purchase.</Text>
        <Text style= {_privacy.text1}>8. Limitation of Liability</Text>
        <Text style= {_privacy.text2}>- <Text style={_privacy.hyperlinkStyle} onPress={travelFika}>Travelfika.com,</Text> acts as an intermediary between yourself and the suppliers (e.g., airlines, hotels, tour operators) and is not liable for any acts, errors, omissions, or negligence of the suppliers.</Text>
        <Text style= {_privacy.text2}>- We are not responsible for any personal injury, property damage, or loss incurred during your travel arrangements.</Text>
        <Text style= {_privacy.text1}>9. Intellectual Property</Text>
        <Text style= {_privacy.text2}>- All content on our website, including text, images, logos, and trademarks, is the property of <Text style={_privacy.hyperlinkStyle} onPress={travelFika}>Travelfika.com,</Text> and is protected by intellectual property laws.</Text>
        <Text style= {_privacy.text2}>- You are not permitted to reproduce, modify, distribute, or use any content from our website without our prior written consent.</Text>
        <Text style= {_privacy.text1}>10. Privacy Policy</Text>
        <Text style= {_privacy.text2}>- We respect your privacy and are committed to protecting your personal information. Please review our Privacy Policy for details on how we collect, use, and protect your data.</Text>
        <Text style= {_privacy.text1}>11. Amendments to Terms and Conditions.</Text>
        <Text style= {_privacy.text2}>- <Text style={_privacy.hyperlinkStyle} onPress={travelFika}>Travelfika.com,</Text> reserves the right to modify or update these terms and conditions at any time without prior notice.</Text>
        <Text style= {_privacy.text2}>- Any changes will be effective immediately upon posting on our website.</Text>
        <Text style= {_privacy.text1}>12. Governing Law and Jurisdiction</Text>
        <Text style= {_privacy.text2}>- These terms and conditions are governed by the laws of [Jurisdiction].</Text>
        <Text style= {_privacy.text2}>- Any disputes arising from the usage of our services shall be subjected to the exclusive jurisdiction of the courts of [Jurisdiction].</Text>
        <Text style= {{fontFamily: 'poppins-regular', fontSize: 12, marginTop: "3%"}}>If you have any questions or concerns regarding these terms and conditions, please contact our customer service team for assistance.</Text>

        </View>
        <TouchableOpacity onPress={() => setIcon(!icon)}>
        <View style={_privacy.box2}>
            <View style={[_privacy.box3, { borderWidth: icon ? 0 : 1 }]}>
            <Icon name='checkmark-circle' type='ionicon' color={icon ? "#3B78FF" : "white"} size={20} marginLeft="-2%" marginTop="-9%"/>

            </View>
            <Text style={_privacy.text}>I accept Privacy Policy + Terms of Use</Text>
        </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[_privacy.button, { opacity: icon ? 1 : 0.5 }]}
          onPress={() => navigation.navigate('FikaTab')}
          disabled={!icon}
        >
          <Text style={{ color: 'white', fontFamily: 'poppins-regular', fontSize: 20 }}>confirm</Text>
        </TouchableOpacity>
        
        </ScrollView>
        
    </View>
   )
}
let _privacy = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "7%",
    },
    con1: {
        marginBottom: "1%", 
        marginRight: "6%",
        padding: 8,
    },
    box1: {
        width: "100%", 
    },
    box2: {
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center",
        marginTop: "5%",
        marginBottom: "5%"
    },
     box3: {
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        width: 20,
        height: 20, 
        borderWidth: 1,
        borderRadius: 100
    }, 
    text:{
        marginLeft: "4%",
        marginTop: "1%",
        fontSize: 12,
        fontFamily: 'poppins-bold',         
        color: "#0D3283"

    },
    button: {
        display: "flex", 
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 50,
        padding: 5,
        backgroundColor: '#3C77FF',
        marginTop: "4%",
        marginBottom: "4%"
    },
    hyperlinkStyle: {
        color: 'blue',
        textDecorationLine: "underline"
      }, 
    text1: {
        fontFamily: 'poppins-bold',
        fontSize: 12, 
        marginTop: "5%", 
        color: "#0D3283"
    },
    text2: {
        fontFamily: 'poppins-regular', 
        fontSize: 12, 
        marginLeft: "4%"
    }
})
