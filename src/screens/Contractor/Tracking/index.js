import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Pressable,
  useColorScheme,
  ScrollView,
  FlatList,
  SectionList
} from "react-native";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/dist/FontAwesome5"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import CheckBox from '@react-native-community/checkbox'
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';

import ListCard from "../../../components/Contractor/ListCard";
import BidCard from "../../../components/Contractor/BidCard";
import { API_URL } from "../../../constants.js";
import { MAPS_KEY } from "../../../constants.js";
import MapView, {Marker, PROVIDER_GOOGLE, AnimatedRegion} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions';
import { PermissionsAndroid, Platform, Dimensions } from 'react-native';


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const locationPermission = () => new Promise(async (resolve, reject) => {
  if (Platform.OS === 'ios') {
      try {
          const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
          if (permissionStatus === 'granted') {
              return resolve("granted");
          }
          reject('Permission not granted');
      } catch (error) {
          return reject(error);
      }
  }
  return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ).then((granted) => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve("granted");
      }
      return reject('Location Permission denied');
  }).catch((error) => {
      console.log('Ask Location permission error: ', error);
      return reject(error);
  });
});

const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
          position => {
              const cords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  heading: position?.coords?.heading,
              };
              console
              resolve(cords);
          },
          error => {
              reject(error.message);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
      )
})


const TrackScreen = ({route,navigation}) => {

  const job = route.params;
  const mapRef = useRef();
  const markerRef = useRef();
  const [state, setState] = useState({
    curLoc:{
      latitude: 0,
      longitude: 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,

    },
    finalCoords:{
      latitude: job.item.latitude,
      longitude: job.item.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },    
    coordinate: new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }),    
  })
  

  const { time, distance,coordinate,heading, curLoc, finalCoords} = state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    getLiveLocation()
}, [])

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == 'android') {
        if (markerRef.current) {
            markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
        }
    } else {
        coordinate.timing(newCoordinate).start();
    }
  }

  const onCenter = () => {
    mapRef.current.animateToRegion({
        latitude: curLoc.latitude,
        longitude: curLoc.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    })
  }

  const getLiveLocation = async () => {
      const locPermissionDenied = await locationPermission()
      if (locPermissionDenied) {
          const { latitude, longitude, heading } = await getCurrentLocation()
          // console.log("get live location after 4 second",latitude)
          updateState({
            curLoc: {
              latitude: latitude,
              longitude: longitude
            }
          })
          animate(latitude, longitude);
          updateState({
              // heading: heading,
              curLoc: { latitude, longitude },
              coordinate: new AnimatedRegion({
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA
              })
          })
      }
  }

  useEffect(() => {
      const interval = setInterval(() => {
          getLiveLocation()
      }, 6000);
      return () => clearInterval(interval)
  }, [])


  return (
    <SafeAreaView>
        {/* <Text></Text>curLoc */}
        <View style={styles.container}>
            <MapView 
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={curLoc}
            >
              <Marker.Animated
                ref={markerRef}
                coordinate={coordinate}
                icon={require('../../../../assets/images/user-marker.png')}
              />
              <Marker
                coordinate={finalCoords}
                icon={require('../../../../assets/images/destination-marker.png')}                
              />              
              <MapViewDirections
                  origin={curLoc}
                  destination={finalCoords}
                  apikey={MAPS_KEY}
                  strokeWidth={3}
                  strokeColor='red'
                  optimizeWaypoints={true}
                  onReady={result => {
                    mapRef.current.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: 30,
                        bottom: 300,
                        left: 30,
                        top: 100,
                      }
                    });                    
                  }}
                />
            </MapView>
            <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0
                    }}
                    onPress={onCenter}
                >
                    <Image source={require('../../../../assets/images/center-marker.png')} />
                </TouchableOpacity>            
        </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: 'rgba(99, 193, 39, 0.1)',
    alignItems: "center",
    justifyContent: "center",
  },

  header:{
    flexDirection: "row",
    // backgroundColor: "#63C127",
    backgroundColor: "#334A65",
    // top:'-5%',
    width: '100%',
    height: 100
  },

  leftHeaderButton: {
    top: "60%",
    color: "#ffffff",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 36,
    // textAlign: "left",      
    marginLeft: 10,
  },

  centerHeaderText: {
    top: "10%",
    color: "#ffffff",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "bold",
    fontSize: 30,
    lineHeight: 36,
    // textAlign: "center",
    marginLeft: '20%',
  },

  rightHeaderButton: {
    top: "60%",
    color: "#ffffff",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 36,
    // textAlign: "left",      
    marginLeft: '45%',
  },

  img: {
    width: 193,
    height: 110,
  },

  inputView: {
    flexDirection: 'row',
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    width: "90%",
    height: 45,
    marginBottom: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E8E8E8"
 
    // alignItems: "left",
  },
 
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 10,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
  },
 
  showButton: {
    marginTop: 3,
    height: 50,
    flex: 1,
    padding: 10,
    color: "#63C127",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 19,
  },

  forgot_button: {
    marginTop: 15,
    height: 30,
    // marginBottom: 20,
    color: "#63C127",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 22,    
  },
 
  loginBtn: {
    width: "90%",
    borderRadius: 25,
    height: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    backgroundColor: "#63C127",
    // top: "0%",
    marginBottom: 20,
  },

  loginText: {
    color: "#FFFFFF",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",      
  },

  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
  },
  segmentContainer: {
    // top: "-10%",
    // margin: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  segmentSection: {

  },
  container: {

  },

  category: {
    alignItems: "center",
  },


  termsView: {
    marginLeft: 10,
    flexDirection: "row",
  },

  termsBox: {
    alignSelf: "center"
  },

  termsText: {
    margin: 5,
    fontWeight: "500",
    color: "black",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 25,    
  },

  title: {
    margin: 10,
    fontWeight: "bold",
    color: "black",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 25,
    color: "#334A65"
  },

  subtitle: {
    // fontWeight: "bold",
    // color: "black",
    color: "rgba(0,0,0,0.3)",
    marginTop: 5,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 25,
    alignSelf: "center",
  },

  filterPopup: {
    height: "auto",
    backgroundColor: "whitesmoke",
    borderRadius: 25,
  }, 

  row: {
    flexDirection: "row",
    marginBottom: 20,
    // alignItems: "center",
    alignSelf: "center",
  },

  button: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    backgroundColor: "#63C127",
    alignItems: 'center',
    justifyContent: 'center',
    // right: 30,
    // bottom: 0,
    top: 600,
    left: "80%"
    // right: 10,
    // marginLeft: "80%"
  },
  arrow: {
    color: "#ffffff",
    fontSize: 48,
    top: 3
    // bottom: 0,
    // textAlign: "center"
  },
  map: {

    width: "100%",
    height: "100%"
  }

});

export default TrackScreen;