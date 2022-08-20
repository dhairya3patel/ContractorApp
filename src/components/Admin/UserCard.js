import React from 'react';
import {TouchableOpacity, View, Image, Text, StyleSheet, Pressable} from 'react-native';
import Icon from "react-native-vector-icons/dist/FontAwesome5"

const UserCard = ({item, viewItem, disabled}) => {

  return (
    <TouchableOpacity
    onPress={() => viewItem(item)} 
    disabled={disabled}
    >
      <View style={styles.wrapper}>
        <View style={styles.leftDetails}>
          <Text style={styles.title}>{item.user.name}</Text>
          <Text style={styles.subtitle}>{item.user.email}</Text>
        </View>        
      </View>
    </TouchableOpacity>

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