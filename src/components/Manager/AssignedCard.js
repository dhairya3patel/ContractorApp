import React from 'react';
import {TouchableOpacity, View, Image, Text, StyleSheet} from 'react-native';

const AssignedCard = ({item, viewItem}) => {
  const date = new Date(item.dateOfCompletion)
  const dateString = date.toLocaleDateString("en-us")
//   const windowDate = new Date(date.getTime() + item.bidWindow * 60000)
  // console.log(new Date())
  // console.log(windowDate)
  const diff = Math.abs(date - new Date());
  const remTime = Math.round((diff / 1000) / 60)
  // console.log(remTime)
  return (
    // <TouchableOpacity
    //    onPress={() => {
    //     viewItem(item);
    //   }}
    // >
      <View style={styles.wrapper}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.image}
            // source={{uri: `../../../assets/${item.image}`}}
            source={require("../../../assets/images/logo.png")}
          />
        </View>
        <View>
          <Text style={styles.title}>{item.po}</Text>
          <Text style={styles.subtitle}>Location: {item.city}, {item.zip}</Text>
          <Text style={styles.subtitle}>Date of Completion: {dateString}</Text>
          {/* <Text style={styles.subtitle}>Assigned To: {item.assignedTo.name}</Text> */}
          <Text style={styles.subtitle}>Bid: $ {item.cost}</Text>
          <Text style={styles.subtitle}>Time Remaining: {remTime} minutes</Text>
        </View>
      </View>
    // </TouchableOpacity>
  );
  //
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
});

export default AssignedCard;