// import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ReactNative,
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
  SectionList,
  Dimensions,
  requireNativeComponent,
} from "react-native";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/dist/FontAwesome5"
import { ScreenStackHeaderRightView } from "react-native-screens";
// import PictureGallery from "../../components/Carousel";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import CheckBox from '@react-native-community/checkbox'
import ImageModal from 'react-native-image-modal';
import Pdf from 'react-native-pdf';
import Modal from "react-native-modal";
import axios from "axios";
// import getImage from '../../../server/files/images'

import API_URL from "../../../constants";

const JobDetails = ({route, navigation}) => {


  const job = route.params;

  const date = new Date(job.item.dateTime)
  const dateString = date.toLocaleDateString("en-us")

  const doc = new Date(job.item.dateOfCompletion)
  const docString = date.toLocaleDateString("en-us")

  const [disabled, setDisabled] = useState(true)
  const [opacity, setOpacity] = useState(0.3)
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [pdf, setPdf] = useState("")

  const pictures = job.item.pictures;
  // console.log(pictures[1].image)

  // const [image, setImage] = useState("")
  useEffect(() => {
    axios({
      method: 'post',
      url: `${API_URL}/getdoc`,
      data: {
        name: "WorkAuth"
      },
      timeout: 4000,
    })
    .then( res => {
      // console.log(res.status);
      if (res.status == 200) {
        setPdf(res.data.doc)
      }
    })
    .catch(error => {
      console.log(error);
      alert(error);            
    })
  },[])

  const submitBid = () => {
    axios({
      method: 'post',
      url: `${API_URL}/createbid`,
      data: {
        id: job.item._id,
        amount: bid
      },
      timeout: 4000,
    })
    .then( res => {
      // console.log(res.status);
      if (res.status == 201) {
        alert("Bid Submitted!");
        navigation.navigate("Jobs");
      }
    })
    .catch(error => {
      console.log(error);
      alert(error);            
    })
  }
  // console.log(pdf)
  const colorScheme = useColorScheme();
  const [textColor, setTextColor] = useState('#000');
  // useEffect(() => {
  // setTextColor(colorScheme === 'dark' ? '#FFF' : '#000');
  // }, [colorScheme]);

  const [bid, setBid] = useState("");
  const [isSelected, setSelection] = useState(false)
  // console.log("First" + isSelected)
  const screenHeight = Dimensions.get('window').height

  const handleModal = () => setIsModalVisible(() => !isModalVisible);      
  // if (bid != "" && isSelected){
  //   setDisabled(true)
  //   setOpacity(1)
  // }

  const ItemRender = ({ uri }) => (

    <TouchableOpacity style={styles.listItem}>
      <ImageModal
        swipeToDismiss={false}
        resizeMode="cover"
        modalImageResizeMode="contain"
        overlayBackgroundColor='rgba(52, 52, 52, 0.5)'
        // imageBackgroundColor="#000000"
        style={styles.listImage}
        source={{uri:`data:image/jpeg;base64,${uri}`}}
        isTranslucent={true}
      />
      {/* <Text>{uri}</Text> */}
      {/* <Image  source={{uri:uri}} /> */}
      {/* <Text style={styles.itemText}>{name}</Text> */}
    </TouchableOpacity>
  );
  
  const Separator = () => {
    return (
      <View
        style={{
          height: 50,
          width: 1,
          backgroundColor: "white",
        }}
      />
    );
  }

  return (
      <SafeAreaView>
          <View style={{height:"auto", maxHeight: screenHeight,}}>
              <View style={styles.header}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                      {/* <Text style = {styles.leftHeaderButton}>Settings</Text> */}
                      <Icon name={"arrow-left"} color={"#ffffff"} size={20} style={{margin: 10}} />
                  </TouchableOpacity>
                  <View style = {styles.centerHeader}>
                      <Text style = {styles.centerHeaderText}>{job.item.po}</Text>
                  </View>
                  {/* <TouchableOpacity>
                      <Text style = {styles.rightHeaderButton}>Filter</Text>
                  </TouchableOpacity> */}
              </View>
              <Modal isVisible={isModalVisible} style={styles.modalPdf}>
                <View style={styles.Popup}>
                  <TouchableOpacity onPress={handleModal}>
                    <Icon name={"times"} color={"#334A65"} size={20} style={{margin: 10, marginTop: 15, marginRight: "90%",}} />
                  </TouchableOpacity>
                <Pdf
                  source={{uri: `data:application/pdf;base64,${pdf}`}}
                  style={styles.pdf}
                />
                </View>
              </Modal>
              {/* <View style={{height: "auto", maxHeight: screenHeight, flex: 1}}> */}
                  <KeyboardAwareScrollView enableOnAndroid={true} enableAutomaticScroll={true} extraScrollHeight={150}>
                      <View style={styles.row}>
                          <Text style={styles.title}>PO: </Text>
                          <Text style={styles.subtitle}>{job.item.po}</Text>
                      </View>
                      <View style={styles.row}>
                          <View style={styles.details}>
                              <Text style={styles.title}>Details: </Text>
                              <Text style={styles.subtitle}>Location: {job.item.address1}, {job.item.address2}</Text>
                              <Text style={styles.subtitle}>Date: {dateString}</Text>
                              <Text style={styles.subtitle}>Estimated Bid: ${job.item.bidLow} - {job.item.bidHigh}</Text>                            
                              {/* <Text style={styles.subtitle}>{job.item.name}</Text>
                              <Text style={styles.subtitle}>{job.item.name}</Text>
                              <Text style={styles.subtitle}>{job.item.name}</Text>
                              <Text style={styles.subtitle}>{job.item.name}</Text> */}
                          </View>
                      </View>
                      <View style={styles.row}>
                          <Text style={styles.title}>Date of Completion: </Text>
                          <Text style={styles.subtitle}>{docString}</Text>
                      </View>
                      <View style={styles.row}>
                          <Text style={styles.title}>Estimated Hours: </Text>
                          <Text style={styles.subtitle}>{job.item.estimatedHours}</Text>
                      </View>
                      <View style={styles.row}>
                          <View style={styles.details}>
                              <Text style={styles.title}>Equipment Needed: </Text>
                              <Text style={styles.subtitle}>{job.item.equipment}</Text>
                          </View>
                      </View>
                      <View style={styles.row}>
                          <View style={styles.pictures}>
                              <Text style={styles.title}>Pictures: </Text>
                              <FlatList
                                data={pictures}
                                renderItem={({ item }) => <ItemRender uri={`${item.image}`} />}
                                keyExtractor={item => item._id}
                                ItemSeparatorComponent={Separator}
                                horizontal={true}
                              />
                          </View>
                      </View>
                      <View style={styles.row}>
                          <View style={styles.details}>
                              <Text style={styles.title}>Notes: </Text>
                              <Text style={styles.subtitle}>{job.item.notes}</Text>
                          </View>
                      </View>
                      <View style={styles.inputView}>
                          <TextInput
                          // ref={bidRef}
                          style={styles.TextInput}
                          placeholder="Bid"
                          placeholderTextColor="#BDBDBD"
                          onChangeText={(bid) => {
                            setBid(bid)
                            if (bid === "") {
                              setDisabled(true)
                              setOpacity(0.3)
                            }
                            else if (isSelected) {
                              setDisabled(false);
                              setOpacity(1);
                            }
                          }}
                          />
                      </View>
                      <View style={styles.termsView}>
                        <CheckBox
                            style={styles.termsBox}                                
                            value={isSelected}
                            onValueChange={(newValue) => {
                              setSelection(newValue)
                              if (newValue === false) {
                                setDisabled(true);
                                setOpacity(0.3);
                              }
                              else if (bid !== "") {
                                setDisabled(false)
                                setOpacity(1)
                              }
                            }}
                          />
                          <TouchableOpacity>
                            <Text style={styles.termsText} onPress={handleModal}>Terms and Conditions</Text>
                          </TouchableOpacity>
                      </View>
                      <View style={styles.bidView}>
                        <TouchableOpacity style={{
                          width: "90%",
                          marginLeft: 20,
                          borderRadius: 25,
                          height: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#63C127",
                          opacity: opacity
                        }}
                          disabled={disabled} 
                          onPress={submitBid}
                        >
                          <Text style={styles.loginText}>Submit Bid</Text>
                        </TouchableOpacity>                            
                      </View>
                      <View style={styles.dummy}></View>                                                 
                  </KeyboardAwareScrollView>
              {/* </View>     */}
          </View>
      </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
    
  container: {
    flex: 1,
    // backgroundColor: 'rgba(99, 193, 39, 0.1)',
    // backgroundColor: "whitesmoke",
    alignItems: "center",
    justifyContent: "center",
  },

  header:{
    flexDirection: "row",
    // backgroundColor: "#63C127",
    backgroundColor: "#334A65",
    // top:'10%',
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
    textAlign: "left",      
    marginLeft: 10,
  },

  centerHeader: {
    alignItems: "center",
    // textAlign: "center",
    width: "80%"
  },

  centerHeaderText: {
    top: "40%",
    color: "#ffffff",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "bold",
    fontSize: 30,
    lineHeight: 36,
  },

  rightHeaderButton: {
    top: "60%",
    color: "#ffffff",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 36,
    textAlign: "right",      
    marginLeft: 50,
  },

  row: {
    marginLeft: 20,
    marginTop: 20,
    flexDirection: "row"
  },

  title: {
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
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 25,
  },

  termsView: {
    marginLeft: "20%",
    flexDirection: "row",
  },

  termsBox: {
    alignSelf: "center"
  },

  termsText: {
    margin: 5,
    fontWeight: "bold",
    color: "black",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 25,    
  },

  dummy: {
    height: 70,
  },

  listItem: {
    marginTop: 5,
    // padding: 8,
    // backgroundColor: '#00C853',
    // borderRadius: 0.25 * 90, overflow: "hidden",
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center'
  },

  listImage: {
    width: 230,
    height: 230,
    borderRadius: 0.25 * 90, overflow: "hidden",
    // height: "100%",
  },

  Popup: {
    // height: 400,
    backgroundColor: "whitesmoke",
    borderRadius: 25,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    // Left: 0
  },

  modalPdf: {
    margin: 0
  },

  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },

  pictures:{
      // marginTop:5,
      width: "100%",
      // height: "35%",
  },

  // img: {
  //   width: 193,
  //   height: 110,
  // },

  inputView: {
    flexDirection: 'row',
    // backgroundColor: "#F6F6F6",
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    width: "30%",
    height: 45,
    marginBottom: 5,
    marginLeft: "35%",
    marginTop: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E8E8E8"
 
    // alignItems: "left",
  },
 
  TextInput: {
    height: 50,
    flex: 1,
    padding: 15,
    // marginLeft: "23%",
    textAlign: "center",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "600",
    fontSize: 20,
    // lineHeight: 36,

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
    marginLeft: 20,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 25,
    backgroundColor: "#63C127",
    // bottom: "-10%"
  },

  loginText: {
      color: "#FFFFFF",
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: "bold",
      fontSize: 20,
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
    marginTop: 5,
    marginBottom: 10,
  },
  segmentSection: {
    marginBottom: 25,
  },
  container: {

  },



});

export default JobDetails;