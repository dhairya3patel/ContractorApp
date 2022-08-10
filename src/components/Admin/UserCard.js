import React from 'react';
import {TouchableOpacity, View, Image, Text, StyleSheet, Pressable} from 'react-native';
import Icon from "react-native-vector-icons/dist/FontAwesome5"

const UserCard = ({item, func, visible}) => {

  return (
      <View style={styles.wrapper}>
        <View style={styles.leftDetails}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>{item.email}</Text>
        </View>
        <View 
          style={{
            display: visible,
          }}
        >
            <TouchableOpacity onPress={(func(item))} style={styles.deleteButton}>
                <Icon name={"minus"} color={"#ffffff"} size={20} style={{margin: 10, marginTop: 10}} />                
            </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    // marginBottom: 15,
  },
  imageWrapper: {
    marginRight: 10,
  },
  image: {
    margin: 10,
    width: 100,
    height: 100,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: "#334A65"
  },
  subtitle: {
    fontSize: 16,
    color: '#303540',
  },
  leftDetails: {
    marginLeft: 10,
    width: '80%'
  },
  deleteButton: {
    marginTop: 10,
    marginLeft: 25,
    backgroundColor: 'red',
    borderRadius: 50,
    height: 40,
    weight: 50
  }
});

export default UserCard;