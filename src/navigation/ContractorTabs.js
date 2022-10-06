import 'react-native-gesture-handler';
import React from "react";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import JobsScreen from "../screens/Contractor/Jobs";
import ProfileScreen from "../screens/Contractor/Profile";
import JobDetails from "../screens/Contractor/JobDetails";
import AssignedDetails from '../screens/Contractor/AssignedDetails';
import TrackScreen from '../screens/Contractor/Tracking';

const Stack = createNativeStackNavigator();

const JobStack = () => {
  return(
    <Stack.Navigator>
        <Stack.Screen
          name="Jobs"
          component={JobsScreen}
          options={{
            headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
          }}
        />
        <Stack.Screen
          name="JobDetails"
          component={JobDetails}
          options={{
            headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
          }}
        />
        <Stack.Screen
          name="AssignedDetails"
          component={AssignedDetails}
          options={{
            headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
          }}
        />          
        <Stack.Screen
          name="Tracking"
          component={TrackScreen}
          options={{
            headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
          }}
        />        

    </Stack.Navigator>


  )  
}


const Tab = createMaterialBottomTabNavigator();

function ContractorTabs() {
  return (
    <Tab.Navigator   
    activeColor="#f0edf6"
    inactiveColor="#000000"
    barStyle={{ backgroundColor: '#334A65' }}
    >
      <Tab.Screen 
        name="JobTab" 
        component={JobStack} 
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="briefcase" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />                
    </Tab.Navigator>
  );
}


export default ContractorTabs;
