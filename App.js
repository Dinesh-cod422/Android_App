import { useState, useEffect, createContext } from 'react';
import * as Font from 'expo-font';
import Index from './components/router/Index'

export let globalState = createContext()

export default function App() {

  let [isFont, setFont] = useState(false)
  let [travel, setTravel] = useState("1") 
  console.log(travel)/* <- For travel (round-trip, one-way, multi-city) */
  let [bottomTab, hideBottomTab] = useState('flex')
  let [stage, setStage] = useState({ one: false, two: false, three: false })
  let [travelDetail, setTravelDetail] = useState({
    flying_from: null,
    origin_code: null,
    flying_to: null,
    destination_code: null,
    calendar: null,
    returnCal: null,
    date: null,
    dateRE: null,
    passengers: 1,
    adult: 1,
    children: 0,
    infant: 0,
    class_type: 'Economy',
    billname: null
  })
  console.log(travelDetail)
  let [orides, setOrides] = useState()
  let [orides1, setOrides1] = useState()
  console.log(orides1)
  let [selected, setSelected] = useState()
  let [range, setRange] = useState({
    flights_count: 0,
    trip_min: 0,
    trip_max: 0,
    price_min: 0,
    price_max: 0,
    time_min: 0,
    time_minR: 0,
    time_max: 0,
    time_maxR: 0,
    flight: [],
    stop: []
  })
  let [reprice, setReprice] = useState({
    adult_fare: 0,
    child_fare: 0,
    infant_fare: 0,
    total_tax: 0,
    grand_total: 0
  })
  let [applyFilter, updateFilter] = useState({
        tripTime: 0,
        priceRange: 0,
        depTime: 0,
        stops: null,
        flight: null
  })
  let [bookingId, setBookingId] = useState(null)
  let [cardName, setCardName] = useState(null)

  useEffect(() => {
    loadFonts()
  }, [])

  let loadFonts = async() => {
    await Font.loadAsync({
      'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf'),
      'poppins-regular': require('./assets/fonts/Poppins-Regular.ttf')
    });
    setFont(true)
  }

  if(isFont){
    return(
      <globalState.Provider value={{
        bottomTab, hideBottomTab, 
        travel, setTravel, 
        stage, setStage, 
        travelDetail, setTravelDetail, 
        orides, setOrides,
        orides1, setOrides1,
        selected, setSelected,
        range, setRange,
        reprice, setReprice,
        applyFilter, updateFilter,
        bookingId, setBookingId,
        cardName, setCardName
        }}>
        <Index />
      </globalState.Provider>
    )
  }
  else {
    return null
  }
}