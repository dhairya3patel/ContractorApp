import {React, Component, useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import MapView from 'react-native-maps'

const TrackScreen = (navigation) => {

    return (
        <MapView
            initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}
        />        
    )
}

const styles = StyleSheet.create({

})

export default TrackScreen