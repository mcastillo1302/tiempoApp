import {StatusBar} from 'expo-status-bar';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    SafeAreaView,
    TextInput,
    Alert,
    Dimensions
} from 'react-native';
import tw from 'twrnc';
import {MagnifyingGlassIcon, CalendarDaysIcon} from 'react-native-heroicons/outline';
import {MapPinIcon} from 'react-native-heroicons/solid';
import React, {useState} from 'react';
import axios from 'axios';
import Moment from 'moment';

// 👉 API Key de WeatherAPI
const API_KEY = 'd2bd7effd8c44129a6820730241412';
const BASE_URL = 'https://api.weatherapi.com/v1';

export default function App() {
    const [showSearch, toggleSearch] = useState(false); // Estado para mostrar/ocultar el buscador
    const [locations, setLocations] = useState([]); // Estado para almacenar los resultados de búsqueda
    const [weather, setWeather] = useState(null); // Estado para almacenar los datos del clima
    const [query, setQuery] = useState(''); // Estado para almacenar el texto del buscador
    const [hours, setHours] = useState([]);
    const [days, setDays] = useState([]);

    const screenWidth = Dimensions.get('window').width;
    const viewWidth = screenWidth * 0.9; // 80% del ancho de la pantalla
    const screenHeight = Dimensions.get('window').height;
    const viewHeight1 = screenHeight * 0.55;
    const viewHeight2 = screenHeight * 0.12;


    // 📝 Función para buscar ciudades en tiempo real
    const searchLocations = async (text) => {
        setQuery(text); // Actualiza el texto del buscador
        if (text.length > 2) {
            try {
                // 👉 Llama a la API de búsqueda de WeatherAPI
                const response = await axios.get(`${BASE_URL}/search.json?key=${API_KEY}&q=${text}`);
                setLocations(response.data); // Actualiza el estado con los resultados de búsqueda
            } catch (error) {
                Alert.alert('Error', 'No se pudo obtener los datos de ubicación.');
                console.error(error);
            }
        } else {
            setLocations([]); // Limpia los resultados si el texto es muy corto
        }
    };

    // 📝 Función para obtener el clima de la ciudad seleccionada
    const handleLocation = async (location) => {
        try {
            // 👉 Llama a la API de clima actual de WeatherAPI
            const response = await axios.get(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${location.name}&days=6&aqi=no&alerts=no`);

            const date = new Date(response.data.current.last_updated);
            const hr = date.getHours()
            setHours(response.data.forecast.forecastday[0].hour.slice(hr + 1, hr + 6 > 23 ? 23 : hr + 6))
            setDays(response.data.forecast.forecastday.slice(1,5))

            setWeather(response.data); // Guarda los datos del clima en el estado
            setLocations([]); // Limpia los resultados de búsqueda
            toggleSearch(false); // Cierra el buscador
            setQuery(''); // Limpia el texto del buscador
        } catch (error) {
            Alert.alert('Error', 'No se pudo obtener el clima de la ubicación seleccionada.');
            console.error(error);
        }
    };

    //👉 Función para formatear la fecha y hora
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return {
            time: `${hours}:${minutes}`,
            date: `${day}/${month}/${year}`,
        };
    };

    return (
        <View style={tw`flex-1 relative`}>
            <StatusBar style="light"/>
            <Image source={require('./assets/images/bg.png')} style={tw`absolute h-full w-full`} blurRadius={70}/>
            <SafeAreaView style={tw`flex flex-1`}>
                <View style={tw`mx-4 relative z-50`}>
                    {/* 📝 Barra de búsqueda */}
                    <View style={tw`flex-row items-center h-12 bg-neutral-300 rounded-full mt-11 justify-between`}>
                        {showSearch && (
                            <TextInput
                                placeholder="Buscar ciudad"
                                placeholderTextColor={'gray'}
                                style={tw`text-black pl-6 h-10 flex-1 text-base`}
                                value={query}
                                onChangeText={searchLocations} // 👉 Llama a searchLocations cuando el texto cambia
                            />
                        )}
                        <TouchableOpacity style={tw`rounded-full p-1 m-1 bg-white`}
                                          onPress={() => toggleSearch(!showSearch)}>
                            <MagnifyingGlassIcon size="25" color="black"/>
                        </TouchableOpacity>
                    </View>

                    {/* 📝 Resultados de búsqueda */}
                    {locations.length > 0 && showSearch && (
                        <View style={tw`absolute w-full bg-gray-300 top-16 rounded-3xl mt-10`}>
                            {locations.map((loc, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={tw`flex-row items-center p-3 px-4 border-b-2 border-b-gray-400`}
                                    onPress={() => handleLocation(loc)} // 👉 Llama a handleLocation cuando se selecciona una ciudad
                                >
                                    <MapPinIcon size="20" color="gray"/>
                                    <Text style={tw`text-black text-lg ml-2`}>{loc.name}, {loc.country}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={tw`flex-col justify-center items-center`}>
                    {weather ? (
                        <>
                            <View style={[tw`mt-8 justify-center items-center`, {width: viewWidth, height: viewHeight1}]}>
                                <View style={tw`absolute bg-black opacity-20 w-full h-full rounded-4`}/>

                                <Text style={tw`text-white text-center text-2xl font-bold`}>
                                    {weather.location.name},{' '}
                                    <Text
                                        style={tw`text-lg font-semibold text-gray-300`}>{weather.location.country}</Text>
                                </Text>
                                <Text style={tw`mt-2 text-white text-center text-xl font-semibold`}>
                                    {Moment(weather.current.last_updated).format('dddd, D of MMMM')}
                                </Text>
                                <View style={tw`flex-row justify-center mt-5`}>
                                    <Image
                                        source={{uri: `https:${weather.current.condition.icon}`}}
                                        style={tw`w-30 h-30`}
                                    />
                                </View>
                                <View style={tw`space-y-2`}>
                                    <Text
                                        style={tw`text-center text-6xl text-white ml-5`}>{weather.current.temp_c} °c</Text>
                                    <Text style={tw`text-center text-white ml-5 tracking-widest`}>
                                        {weather.current.condition.text}
                                    </Text>
                                </View>
                                <View style={tw`flex-row w-full justify-between mt-9 px-4`}>
                                    <View style={tw`flex-col space-x-2 items-center mr-3`}>
                                        <Image source={require('./assets/icons/wind.png')} style={tw`h-5 w-5`}/>
                                        <Text
                                            style={tw`text-white font-semibold text-sm`}>Wind</Text>
                                        <Text
                                            style={tw`text-white text-sm`}>{' '}{weather.current.wind_kph} Km/h</Text>
                                    </View>
                                    <View style={tw`flex-col space-x-2 items-center mr-3`}>
                                        <Image source={require('./assets/icons/drop.png')} style={tw`h-5 w-5`}/>
                                        <Text
                                            style={tw`text-white font-semibold text-sm`}>Humidity</Text>
                                        <Text
                                            style={tw`text-white text-sm`}>{' '}{weather.current.humidity} %</Text>
                                    </View>
                                    <View style={tw`flex-col space-x-2 items-center mr-3`}>
                                        <Image source={require('./assets/icons/sun.png')} style={tw`h-5 w-5`}/>
                                        <Text
                                            style={tw`text-white font-semibold text-sm`}>Precip</Text>
                                        <Text
                                            style={tw`text-white text-sm`}>{' '}{weather.current.precip_mm} mm</Text>
                                    </View>
                                    <View style={tw`flex-col space-x-2 items-center mr-3`}>
                                        <Image source={require('./assets/icons/sun.png')} style={tw`h-5 w-5`}/>
                                        <Text
                                            style={tw`text-white font-semibold text-sm`}>Pressure</Text>
                                        <Text
                                            style={tw`text-white text-sm`}>{' '}{weather.current.pressure_mb} mb</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[tw`mt-6 justify-center items-center`, {width: viewWidth, height: viewHeight2}]}>
                                <View style={tw`absolute bg-black opacity-20 w-full h-full rounded-4`}/>
                                <View style={tw`flex-row w-full justify-between px-5`}>
                                    {hours.map((item, index) => (
                                        <View key={index} style={tw`flex-colum items-center`}>
                                            <Image
                                                source={{uri: `https:${item.condition.icon}`}}
                                                style={tw`w-10 h-10`}
                                            />
                                            <Text style={tw`text-white font-semibold text-xs`}>
                                                {' '}{formatDateTime(item.time).time}
                                            </Text>
                                            <Text style={tw`text-white text-xs`}>
                                                {item.temp_c}°
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <View style={[tw`mt-2 justify-center items-center`, {width: viewWidth, height: viewHeight2}]}>
                                <View style={tw`absolute bg-black opacity-20 w-full h-full rounded-4`}/>
                                <View style={tw`px-5 flex-row w-full justify-between`}>
                                    {days.map((item, index) => (
                                        <View key={index} style={tw`flex-colum items-center`}>
                                            <Image
                                                source={{uri: `https:${item.day.condition.icon}`}}
                                                style={tw`w-10 h-10`}
                                            />
                                            <Text style={tw`text-white font-semibold text-xs`}>
                                                {' '}{Moment(item.date).format('ddd').toUpperCase()}
                                            </Text>
                                            <View style={tw`flex-row justify-between`}>
                                                <Text style={tw`text-white text-xs mr-2`}>
                                                    {item.day.mintemp_c}°
                                                </Text>
                                                <Text style={tw`text-white text-xs`}>
                                                    {item.day.maxtemp_c}°
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>
                    ) : (
                        <View style={tw`mt-9`}>
                            <Text style={tw`text-white text-center text-lg`}>Busca una ciudad para ver el clima</Text>
                        </View>
                    )}
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
