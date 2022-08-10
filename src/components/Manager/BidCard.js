import React from 'react';
import {TouchableOpacity, View, Image, Text, StyleSheet, PermissionsAndroid} from 'react-native';

const BidCard = ({item, viewItem}) => {
  return (
    <TouchableOpacity
       onPress={() => {
        viewItem(item);
      }}
    >
        <View style={styles.wrapper}>
        {/* <View style={styles.imageWrapper}>
            <Image
            style={styles.image}
            source={require("../../assets/images/logo.png")}
            />
        </View> */}
            <View style={styles.leftWrapper}>
              <View style={styles.head}>
                <Text style={styles.title}>Company: </Text>
                <Text style={styles.subtitle}>{item.contractor.name}</Text>
              </View>
              <View style={styles.head}>
                <Text style={styles.title}>Bid Amount: </Text>
                <Text style={styles.subtitle}>$ {item.amount}</Text>
              </View>
            </View>
            <View style={styles.rightWrapper}>
                <Text style={styles.subtitle}>Average Rating: {item.contractor.rating.avg}</Text>
                <Text style={styles.subtitle}>Jobs Completed: {item.contractor.rating.jobsCompleted}</Text>
                <Text style={styles.subtitle}>Quality of Service: {item.contractor.rating.quality}</Text>
                <Text style={styles.subtitle}>Availability: {item.contractor.rating.availability}</Text>                
            </View>
        </View>
    </TouchableOpacity>
  );
  //
};

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row'
  },

  leftWrapper: {
    // flexDirection:'row',
    // Padding: 50,
    marginTop: 30,
    margin: 10
  },

  rightWrapper: {
    margin: 10,
    marginLeft: 50
  },

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
    // marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: "#334A65"
  },
  subtitle: {
    fontSize: 16,
    // color: '#303540',
    color: "rgba(0,0,0,0.4)",
  },
});

export default BidCard;