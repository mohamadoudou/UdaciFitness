import { StatusBar } from 'expo-status-bar'
import React, { useState,Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Slider,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Image
} from 'react-native'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons';
import { gray, purple, white } from '../utils/colors'
import { setLocalNotification} from '../utils/helpers'
import entries from '../reducers'
import AddEntry from './AddEntry'
import History from './History'
import EntryDetail from './EntryDetail'
import Live from './Live'



const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          if (route.name === 'History') {
            return <FontAwesome name='history' size={24} color={purple} />
          } else if(route.name==='AddEntry') {
            return <Ionicons style={{ fontSize: 40 }} name="md-add" size={24} color={purple} />
          }else {
            return <Ionicons style={{ fontSize:30 }} name="md-timer" size={24} color={purple} />
          }
        },
      })}

      tabBarOptions={{
        activeTintColor: purple,
        inactiveTintColor: gray,
      }}
    >
      <Tab.Screen name='History' component={History} />
      <Tab.Screen name='AddEntry' component={AddEntry} />
      <Tab.Screen name='Live' component={Live} />
    </Tab.Navigator>
  )
}

function Stacks() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: white,
          headerStyle: { backgroundColor: purple },
        }}
      >
        <Stack.Screen name='History' component={Tabs} />
        <Stack.Screen name='EntryDetail' component={EntryDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


const store = createStore(entries)

export default class App extends Component {

  componentDidMount(){
    setLocalNotification()
  }

  render(){
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Stacks />
      </View>
    </Provider>
   )
  }

}


