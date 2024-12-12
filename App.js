import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, TextInput } from 'react-native';
import tw from 'twrnc';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';


export default function App() {
  return (
    <View style={tw`flex-1 relative`}>
      <StatusBar style="light" />
      <Image source={require('./assets/images/bg.png')} style={tw` absolute h-full w-full`} />
      <SafeAreaView style={tw`flex flex-1`}>
        <View style={tw`mx-4 relative z-50`}>
          <View style={tw`flex-row items.center h-12 bg-neutral-300 rounded-full mt-11 flex justify-between items-center`}>

            <TextInput placeholder='Buscar ciudad' placeholderTextColor={'gray'}
            style={tw` text-white pl-6 h-10 flex-1 text-base`}/>

            <TouchableOpacity style={tw` rounded-full p-1 m-1 bg-white flex justify-center items-center`}>
              <MagnifyingGlassIcon size="25" color="black"/>
            </TouchableOpacity>

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
