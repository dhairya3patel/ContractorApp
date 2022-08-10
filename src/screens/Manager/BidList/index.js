// import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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

import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import CheckBox from '@react-native-community/checkbox'
import axios from 'axios';

import API_URL from "../../../constants";
import BidCard from "../../../components/Manager/BidCard";

const BidList = ({route, navigation}) => {


  const job = route.params.item;
  // console.log(job)
  const getBids = () => {
    axios({
    method: 'post',
    url: `${API_URL}/getbidsbyjob`,
    data: {
        "job": job._id,
        // "status": "Open"
    },
    timeout: 4000,
    })
    .then( res => {
      // console.log(res.data);
      if (res.status == 200) {
          setDataSource(res.data.bids)
      }
      else
          alert(res.data.message);
      })
      .catch(error => {
      console.log(error);
      alert(error);            
    })    
  }

  const acceptBid = () => {
    axios({
      method: 'post',
      url: `${API_URL}/acceptbid`,
      data: {
          "bid": bid._id,
          "contractor": bid.contractor._id,
          "amount": bid.amount,
          "job": bid.job
          // "status": "Open"
      },
      timeout: 4000,
    })
    .then( res => {
      // console.log(res.data);
      if (res.status == 201) {
        handleModal;
        navigation.navigate("BidJobs");
      }
      else
        alert(res.data.message);
      })
      .catch(error => {
        console.log(error);
      alert(error);            
    })
  }

  const [flatListRef, setFlatListRef] = useState("");
  const colorScheme = useColorScheme();
  const [textColor, setTextColor] = useState('#000');
  const [value, setValue] = useState('Unselected');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [bid, setBid] = useState({
    _id: '',
    contractor: {
      _id: '',
      name: '',
      user: '',
      services: '',
      contact: '',
      serviceLocation: '',
      authPersonnel: '',
      logo: '',
      rating: '',
    },
    job: '',
    amount: '',
    status: '',
  })

  const [dataSource, setDataSource] = useState('');

  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  useEffect (() => {

    getBids();
    
  },[])

  const ItemSeparator = () => <View style={{
    height: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    marginLeft: 10,
    marginRight: 10,
  }}
  />
  const _onChange = (event) => {
    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
  };

  // const _onValueChange = (val) => {
  //   setValue(val);
  //   getJobs(val)
  //   flatListRef.scrollToOffset({ animated: true, offset: 0 });
  //   // setRefreshing(false)
  // };

  const onPressFunction = () => {
    flatListRef.scrollToOffset({ animated: true, offset: 0 });
  };

  const viewItem = item => {
    setBid(item)
    console.log(bid)
    handleModal();
  };


  const renderJob = ({item}) => {
    return <BidCard item={item} viewItem={viewItem}/>;
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name={"arrow-left"} color={"#ffffff"} size={20} style={{margin: 10}} />
            </TouchableOpacity>            
            <Text style = {styles.centerHeaderText}>Bids</Text>
          </View>
          <View style={styles.job}>
            <View style={styles.section}>
              <Text style={styles.title}>PO:</Text>
              <Text style={styles.subtitle}>{job.po}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.title}>Estimated Bid:</Text>
              <Text style={styles.subtitle}>$ {job.bidLow} - {job.bidHigh}</Text>
            </View>
            <View style={{
              height: 2,
              backgroundColor: "rgba(0,0,0,0.3)",
              marginLeft: 10,
              marginRight: 10,
            }}
            />                        
          </View>
          <Modal isVisible={isModalVisible}>
            <View style={styles.modalWrapper}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleModal}>
                  <Icon name={"times"} color={"#334A65"} size={20} style={{margin: 10, marginTop: 15, marginRight: "90%",}} />
                </TouchableOpacity>            
              </View>
              <View style={styles.modalDetails}>
                <View style={styles.modalSection}>
                  <Text style={styles.title}>Company:</Text>
                  <Text style={styles.subtitle}>{bid.contractor.name}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.title}>Bid Amount:</Text>
                  <Text style={styles.subtitle}>$ {bid.amount}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.loginBtn} onPress={acceptBid} >
                <Text style={styles.loginText}>Accept Bid</Text>
              </TouchableOpacity>              
            </View>
          </Modal>
          <FlatList
            ref={(ref) => { setFlatListRef(ref); }}
            data={dataSource}
            renderItem={renderJob}
            // contentContainerStyle={{flex: 1}}
            keyExtractor={item => item._id.toString()}
            ItemSeparatorComponent={ItemSeparator}
            
            ListFooterComponent={
              <>
                <View style={{
                    height: 2,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                  />                
                <View style={{height: 320}}>
                  <Text style={styles.footerText}>That's it for now!</Text>
                </View>
              </>
            }
            removeClippedSubviews={true}
            initialNumToRender={5}
            // refreshing={refreshing}
            // onRefresh={useRefresh}       
            />

        <Pressable style={styles.button} onPress={onPressFunction}>
          <Text style={styles.arrow}>^</Text>
        </Pressable>            
      </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    // alignSelf: "center",
    marginLeft: '30%',
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
    // lineHeight: 25,
    color: "#334A65"
  },

  subtitle: {
    // fontWeight: "bold",
    // color: "black",
    color: "rgba(0,0,0,0.4)",
    // marginTop: 5,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    margin: 10,
    fontSize: 20,
    // lineHeight: 25,
    // alignSelf: "center",
  },

  footerText: {
    color: "rgba(0,0,0,0.3)",
    // marginTop: 5,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    margin: 10,
    fontSize: 20,
    // lineHeight: 25,
    alignSelf: "center",    
  },

  job: {
    height: 110,
    // borderWidth: 1,
    // borderColor: 'whitesmoke',
    // borderBottomColor: 'black'
  },

  section: {
    flexDirection: 'row',
    height: 50
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
    bottom: 40,
    // top: "85%",
    // left: 0
    right: 10,
    // marginLeft: "80%"
  },
  arrow: {
    color: "#ffffff",
    fontSize: 48,
    top: 3
    // bottom: 0,
    // textAlign: "center"
  },

  bidWrapper: {
    height: 400,
    width: 300,
    backgroundColor: "red"
  },

  modalWrapper: {
    backgroundColor: "whitesmoke",
    height: "auto",
    borderRadius: 25,
  },

  modalDetails: {
    margin: 10
  },

  modalSection: {
    flexDirection: 'row'
  },

});

export default BidList;