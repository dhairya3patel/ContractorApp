/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import LoginScreen from './src/screens/Login'
import {
  SafeAreaView,
  StatusBar
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/navigation/Router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ContractorTabs from './src/navigation/ContractorTabs';
import ManagerTabs from './src/navigation/ManagerTabs';
import AdminTabs from './src/navigation/AdminTabs';
import {enableLatestRenderer} from 'react-native-maps';

enableLatestRenderer();

const Tab = createMaterialBottomTabNavigator();

const Stack = createNativeStackNavigator();

const App: () => React$Node = () => {
  return (
    // <>
    //   <StatusBar barStyle='dark-content' />
    //   <SafeAreaView>
    //     {/* <Router /> */}
    //     {/* <LoginScreen /> */}
    //     {/* <JobsScreen /> */}
    //     {/* <JobDetails /> */}
    //     {/* <ProfileScreen prevScreen="Login"/> */}
    //     <AddJobScreen />
    //   </SafeAreaView>
    // </>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            animationEnabled: false, headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
          }}
        />
        <Stack.Screen
          name="AddJob"
          component={ManagerTabs}
          options={{
            animationEnabled: false, headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
          }}
        />        
        <Stack.Screen
          name="Jobs"
          component={ContractorTabs}
          options={{
            headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
          }}
        /> 
        <Stack.Screen
          name="Admin"
          component={AdminTabs}
          options={{
            headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
          }}
        />
      </Stack.Navigator>      
    </NavigationContainer>
  );
};

export default App;