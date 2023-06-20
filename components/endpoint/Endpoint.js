export let AirportSearchUrl = 'http://54.90.242.68/api/v1/utils/airportSearch/'
export let FlightSearchUrl = 'http://54.90.242.68/api/v1/flight/search/'
export let FlightLogo = 'https://assets.travelfika.com/airline-logo/'
export let FlightReprice = 'http://54.83.81.246:88/api/v1/flight/reprice/'
export let PaymentUrl = 'http://54.83.81.246:88/api/v1/flight/initPayBook/guest'
export let BookedUrl = 'http://54.83.81.246:88/api/v1/flight/bookingDetails/'

/*
Customer Service: http://54.90.242.68/api/v1
Core Service: http://54.83.81.246:88/api/v1
Airport List: /utils/airportSearch/amadeus/:data
Flight List: /flight/search/ (Post request)

{
    "JourneyType": "O",
    "OriginDestination": [
        {
            "Origin": "MAA",
            "Destination": "JFK",
            "DepartureDate": "06-10-2023"
        }
    ],
    "ClassType": "E",
    "NoOfInfant": {
        "Count": 0,
        "Age": {}
    },
    "NoOfChildren": {
        "Count": 0,
        "Age": {}
    },
    "NoOfAdult": {
        "Count": 1
    },
    "PreferredArilines": [],
    "PreferredCurrency": "INR",
    "OtherInfo": {
        "RequestedIP": "",
        "TransactionId": ""
    },
    "MultiCityTripdata": []
}

`${config.airlineLogo}${single.OriginDestination[0].MarketingAirline}.gif.gif`


old: export let AirportSearchUrl = 'http://54.90.242.68/api/v1/utils/airportSearch/amadeus/'


---- Reprice:POST

http://54.83.81.246:88/api/v1/flight/reprice/a39d3b68edd74e308d9d649970bc0b90
{
  "AdultCount": 1,
  "ChildCount": 1,
  "InfantCount": 0
}

---- Invoice:GET
http://54.83.81.246:88/api/v1/flight/bookingDetails/647d78eb30cb47fe838edeac


---- Payment:POST
http://54.83.81.246:88/api/v1/flight/initPayBook/guest

{
    "PassengerDetails": [
        {
            "PassengerTypeCode": "ADT",
            "FirstName": "Rathina Boopathi",
            "LastName": "Sundarraj",
            "Title": "Mr",
            "Gender": "Male",
            "DOB": "2000-08-20",
            "PassengerIssueCountry": "AD",
            "Nationality": "AD",
            "FrequentFlyerNumber": null,
            "IsWheelchair": false,
            "MealCode": null
        }
    ],
    "PassengerContactInfo": {
        "PhoneNumber": "6383604736",
        "PhoneCountryCode": "+1",
        "AlternatePhoneNumber": "1",
        "Email": "rathinaboopathi.srb@gmail.com"
    },
    "Currency": "USD",
    "SearchID": "SUdYQVMzMDYzNzA1NDY5ODM2MTY5ODAxMl9HRFM2MzcwNTQ2OTk0NTM3Nzc1NTg=",
    "IteneraryRefID": "47ed2a0195f04d11af820a32328e1ca9"


    To get booking confirmation
    ${config.secondApi}/flight/bookingDetails/${id}`

    {"data": {"__v": 2, "_id": "648b183d15ad6d1d5e8fb427", "airline": "Lufthansa", "api_pnr": "AAAAAA", "api_refNum": "1111111111111", "base_fare": 807, "booking_status": "confirmed", "cancelTimeLimit": "2023-06-16T13:55:15.086Z", "createdAt": "2023-06-15T13:55:09.070Z", "currency": "USD", "flight_journey": [[Object]], "flight_passenger_id": [[Object]], "gross_fare": 1163.21, "invoice_fare": 1200.17, "markup": 2, "passenger_contact_info": {"alternate_phone_number": 1, "email": "ragulofficialinbox@gmail.com", "phone_country_code": 91, "phone_number": 7010623482}, "pay_fare": 34.96, "payment_status": "unpaid", "target_api": "eab1b8fad9ad48c1976363bd91cccf05", "ticketing_mail_status": "init", "total_tax": 356.21, "transaction": {"__v": 0, "_id": "648b183f15ad6d1d5e8fb43f", "amountCharged": 1200.17, "card": [Object], "chargeId": "ch_3NJGdnJm9I4mlh4702bRVwQp", "clientSecret": "pi_3NJGdnJm9I4mlh470ENhIeij_secret_gxUzSNj0XAJ9ICQttABaSXT30", "currency": "usd", "payIntentId": "pi_3NJGdnJm9I4mlh470ENhIeij", "receiptURI": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTDBJVGFKbTlJNG1saDQ3KMKwrKQGMgbMzZrL-VI6LBZdyNLz77nswQ6dJRNRDzfj-ZWZshxwDOIWF_EecHw6xW5OTw007XKtpOP0", "service": "flights", "status": "paid"}, "updatedAt": "2023-06-15T13:55:15.086Z", "user_id": "647d78eb30cb47fe838edea3"}, "error": false}

}
*/