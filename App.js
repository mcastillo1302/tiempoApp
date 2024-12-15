import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, TextInput } from 'react-native';
import tw from 'twrnc';
import {MagnifyingGlassIcon, CalendarDaysIcon} from 'react-native-heroicons/outline';
import {MapPinIcon} from 'react-native-heroicons/solid';
import React, {useState} from 'react';

import { debounce } from 'lodash';
import { fetchLocations } from './api/weather';
import { fetchWeatherForecast } from './api/weather';


export default function App() {

  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});

  const handleLocation = (loc) => {
    //console.log('ciudad',loc);
    //setLoading(true);
    toggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data=>{
      console.log('datos del tiempo: ', data);
      //setLoading(false);
      setWeather(data);
      //storeData('city',loc.name);
    })
  }

  const handleSearch = search=>{
    console.log('value: ',search);
    if(search && search.length>2)
      fetchLocations({cityName: search}).then(data=>{
        console.log('got locations: ',data);
        setLocations(data);
      })
  }

  const {current, location} = weather;

  return (
    <View style={tw`flex-1 relative`}>
      <StatusBar style="light" />
      <Image source={require('./assets/images/bg.png')} style={tw` absolute h-full w-full`} blurRadius={70}/>
      <SafeAreaView style={tw`flex flex-1`}>
        <View style={tw`mx-4 relative z-50`}>
          <View style={tw`flex-row items.center h-12 bg-neutral-300 rounded-full mt-11 flex justify-between items-center`}>

            {
              showSearch?(
                <TextInput 
                onChangeText={handleSearch}
                placeholder='Buscar ciudad' placeholderTextColor={'gray'}
                style={tw` text-black pl-6 h-10 flex-1 text-base`}/>
              ):null
            }
        

            <TouchableOpacity style={tw` rounded-full p-1 m-1 bg-white flex justify-center items-center`}
            onPress={()=> toggleSearch(!showSearch)}>
              <MagnifyingGlassIcon size="25" color="black"/>
            </TouchableOpacity>

          </View>

          {
            locations.length>0 && showSearch?(
              <View style={tw` absolute w-full bg-gray-300 top-16 rounded-3xl mt-10`}>
                {
                  locations.map((loc, index) => {
                    let showborder = index + 1 != locations.length;
                    if (showborder){
                        return(
                          <TouchableOpacity key={index} style={tw` flex-row items-center border-0 p-3 px-4 mb-1 border-b-2 border-b-gray-400`} onPress={()=>handleLocation(loc)}>
                            <MapPinIcon size="20" color="gray"/>
                            <Text style={tw` text-black text-lg ml-2`}>{loc?.name}, {loc?.country}</Text>
                          </TouchableOpacity>
                        );
                    }
                    else{
                      return(
                        <TouchableOpacity key={index} style={tw` flex-row items-center border-0 p-3 px-4 mb-1`} onPress={()=>handleLocation(loc)}>
                            <MapPinIcon size="20" color="gray"/>
                            <Text style={tw` text-black text-lg ml-2`}>Santa Cruz, Bolivia</Text>
                        </TouchableOpacity>
                      );
                    }
                      
                    
                  })
                }
              </View>
            ):null
          }
        </View>
        <View style={tw` flex justify-around flex-1 mb-2`}>

            <Text style={tw` text-white text-center text-2xl font-bold`}>
              {location?.name}, 
              <Text style={tw` text-lg font-semibold text-gray-300`}>
              {" "+location?.country}
              </Text>
            </Text>
            <View style={tw` flex-row justify-center`}>
              <Image source={{uri: 'https:'+current?.condition?.icon}} style={tw` w-52 h-52`}/>
            </View>
            <View style={tw` space-y-2`}> 
              <Text style={tw` text-center text-6xl text-white ml-5`}>
                {current?.temp_c} &#176;
              </Text>
              <Text style={tw` text-center text-white ml-5 tracking-widest`}>
                {current?.condition?.text}
              </Text>
            </View>

            <View style={tw` flex-row justify-between mx-4`}>
              <View style={tw` flex-row space-x-2 items-center`}>
                <Image source={require("./assets/icons/wind.png")} style={tw` h-6 w-6`}/>
                <Text style={tw` text-white font-semibold text-base`}>
                  25Km
                </Text>
              </View>
              <View style={tw` flex-row space-x-2 items-center`}>
                <Image source={require("./assets/icons/drop.png")} style={tw` h-6 w-6`}/>
                <Text style={tw` text-white font-semibold text-base`}>
                  34%
                </Text>
              </View>
              <View style={tw` flex-row space-x-2 items-center`}>
                <Image source={require("./assets/icons/sun.png")} style={tw` h-6 w-6`}/>
                <Text style={tw` text-white font-semibold text-base`}>
                  5:30am
                </Text>
              </View>
            </View>          
        </View>

        <View style={tw` mb-2 spaye-y-3`}>
          <View style={tw` flex-row items-center mx-5 space-x-2`}>
            <CalendarDaysIcon size="22" color="white"/>
            <Text style={tw` text-white text-base`}>
              Tiempo diario
            </Text>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
