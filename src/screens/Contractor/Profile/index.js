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
} from "react-native";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { useTogglePasswordVisibility } from "../../../hooks/TogglePassword";
import { useLoginButton } from "../../../hooks/HandleLogin";
import { useIndexChange } from "../../hooks/HandleIndexChange";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/dist/FontAwesome5"
import { ScreenStackHeaderRightView } from "react-native-screens";
// import PictureGallery from "../../components/Carousel";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import CheckBox from '@react-native-community/checkbox'
import ImageModal from 'react-native-image-modal';
import axios from "axios";

import API_URL from "../../../constants.js"

const ProfileScreen = ({ route, navigation}) => {

    // const prevScreen = route.params;
    useEffect(() => {
      axios({
        method: 'get',
        url: `${API_URL}/getuserdetails`,
        timeout: 4000,
      })
      .then( res => {
        // console.log(res);
        if (res.status == 200) {
          // console.log(res.data)
          setJob(res.data)
          setRating(res.data.rating)
          // const rating = JSON.parse(res.data.rating)
        }
      })
      .catch(error => {
        console.log(error);
        alert(error);            
      })      
    },[])

    const [job, setJob] = useState("")
    const [rating, setRating] = useState("")
    // const job = {
    //     "item": {
    //         id: 0,
    //         name: "Nidera",
    //         image:
    //         "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.brandsoftheworld.com%2Flogo%2Fnidera&psig=AOvVaw1nkVVKEnyrcGGb0LwVHUC7&ust=1644094107900000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCLDCpP315vUCFQAAAAAdAAAAABAD",
    //         location:
    //         "Gainesville",
    //         date:
    //         "05/23/2022",
    //         estimatedBid: "70-90"  
    //   }
    // }
    // console.log(job);

    const data = [
      {
        id: 0,
        uri: 'https://images.unsplash.com/photo-1607326957431-29d25d2b386f',
        title: 'Dahlia',
      }, // https://unsplash.com/photos/Jup6QMQdLnM
      {
        id: 1,
        uri: 'https://images.unsplash.com/photo-1512238701577-f182d9ef8af7',
        title: 'Sunflower',
      }, // https://unsplash.com/photos/oO62CP-g1EA
      {
        id: 2,
        uri: 'https://images.unsplash.com/photo-1627522460108-215683bdc9f6',
        title: 'Zinnia',
      }, // https://unsplash.com/photos/gKMmJEvcyA8
      {
        id: 3,
        uri: 'https://images.unsplash.com/photo-1587814213271-7a6625b76c33',
        title: 'Tulip',
      }, // https://unsplash.com/photos/N7zBDF1r7PM
      {
        id: 4,
        uri: 'https://images.unsplash.com/photo-1588628566587-dbd176de94b4',
        title: 'Chrysanthemum',
      }, // https://unsplash.com/photos/GsGZJMK0bJc
      {
        id: 5,
        uri: 'https://images.unsplash.com/photo-1501577316686-a5cbf6c1df7e',
        title: 'Hydrangea',
      }, // https://unsplash.com/photos/coIBOiWBPjk
    ];    

    const colorScheme = useColorScheme();
    const [textColor, setTextColor] = useState('#000');
    useEffect(() => {
    setTextColor(colorScheme === 'dark' ? '#FFF' : '#000');
    }, [colorScheme]);

    const [bid, setBid] = useState("");
    const [isSelected, setSelection] = useState(false)
    const screenHeight = Dimensions.get('window').height

    const ItemRender = ({ name }) => (
      <View style={styles.listItem}>
        <Text style={styles.itemText}>{name}</Text>
      </View>
    );
   
    const Separator = () => {
      return (
        <View
          style={{
            height: 50,
            width: 10,
            backgroundColor: "whitesmoke",
          }}
        />
      );
    }

    return (
        <SafeAreaView>
            <View style={{height:"auto", maxHeight: screenHeight,}}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style = {styles.leftHeaderButton}>Settings</Text>
                        {/* <Icon name={"arrow-left"} color={"#ffffff"} size={20} style={{margin: 10}} /> */}
                    </TouchableOpacity>
                    <View style = {styles.centerHeader}>
                        <Text style = {styles.centerHeaderText}>{job.name}</Text>
                    </View>
                    {/* <TouchableOpacity>
                        <Text style = {styles.rightHeaderButton}>Filter</Text>
                    </TouchableOpacity> */}
                </View>
                {/* <View style={{height: "auto", maxHeight: screenHeight, flex: 1}}> */}
                    <KeyboardAwareScrollView enableOnAndroid={true} enableAutomaticScroll={true} extraScrollHeight={150}>
                        <View style={styles.details}>
                            <View style={styles.detailsLeft}>
                                <Image style={styles.logo} source={require("../../../../assets/images/logo.png")}/>
                                <Text style={styles.companyTitle}>{job.name}</Text>
                            </View>
                            <View style={styles.detailsRight}>
                                <Text style={styles.title}>Authorized Personnel: </Text>
                                <Text style={styles.subtitle}>{job.authPersonnel}</Text>
                                {/* <Text style={styles.subtitle}>{'\n'}</Text> */}
                                <Text style={styles.title}>Contact: </Text>
                                <Text style={styles.subtitle}>{job.contact}</Text>                                
                                <Text style={styles.title}>Email: </Text>
                                <Text style={styles.subtitle}>{job.email}</Text>                                
                                <Text style={styles.title}>Service Location: </Text>
                                <Text style={styles.subtitle}>{job.serviceLocation}</Text>                                                                                                
                            </View>
                        </View>
                        <View style={styles.servicesProvided}>
                            <View style={styles.pictures}>
                                <Text style={styles.servicesText}>Services Provided: </Text>
                                <FlatList
                                  data={job.services}
                                  renderItem={({ item }) => <ItemRender name={item.name} />}
                                  keyExtractor={item => item.id}
                                  ItemSeparatorComponent={Separator}
                                  horizontal={true}
                                />
                            </View>
                        </View>    
                        <View style={styles.eval}>
                            <View style={styles.row}>
                                <View style={styles.metric}>
                                    <Text style={styles.metricTitle}>{rating.avg}</Text>
                                    <Text style={styles.metricSubtitle}>Average{'\n'}Rating</Text>
                                </View>
                                <View style={styles.evalSeparator}>
                                </View>
                                <View style={styles.metric}>
                                    <Text style={styles.metricTitle}>{rating.jobsCompleted}</Text>
                                    <Text style={styles.metricSubtitle}>Jobs{'\n'}Completed</Text>
                                </View>
                                <View style={styles.evalSeparator}>
                                </View>
                                <View style={styles.metric}>
                                    <Text style={styles.metricTitle}>{rating.ongoing}</Text>
                                    <Text style={styles.metricSubtitle}>Ongoing</Text>
                                </View>                                
                            </View>
                            <View style={styles.row}>
                                <View style={styles.metric}>
                                    <Text style={styles.metricTitle}>{rating.availability}</Text>
                                    <Text style={styles.metricSubtitle}>Availability</Text>
                                </View>
                                <View style={styles.evalSeparator}>
                                </View>
                                <View style={styles.metric}>
                                    <Text style={styles.metricTitle}>{rating.quality}</Text>
                                    <Text style={styles.metricSubtitle}>Quality</Text>
                                </View>
                                <View style={styles.evalSeparator}>
                                </View>
                                <View style={styles.metric}>
                                    <Text style={styles.metricTitle}>{rating.service}</Text>
                                    <Text style={styles.metricSubtitle}>Service</Text>
                                </View>                                
                            </View>                            
                        </View>                      
                        <View style={styles.bidView}>
                            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("Jobs")} >
                                <Text style={styles.loginText}>Update Profile</Text>
                            </TouchableOpacity>                            
                        </View>
                        {/* <View style={styles.dummy}></View>                                                  */}
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
    width: "60%"
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



  details: {
    margin: 10,
    flexDirection: "row",
    height: 200,
  },

  detailsLeft: {
    backgroundColor: "rgba(99, 193, 39, 0.1)",
    width: "50%",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 10,

  },

  detailsRight: {
    //   flexDirection: "row"
  },

  logo: {
    top: "20%",
    width: "50%",
    height: "50%",
    // border: 'solid',
    borderRadius: 500
  },

  companyTitle: {
    top: '25%',
    fontWeight: "bold",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 25,
    color: "#334A65"      
  },

  title: {
    fontWeight: "bold",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 18,
    // lineHeight: 20,
    color: "#334A65"
  },

  subtitle: {
    // fontWeight: "bold",
    // color: "black",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 15,
    marginBottom: 5,
    color: "#63C127",
    // lineHeight: 25,
  },

  servicesProvided: {
    height: 120,
    // marginBottom: 5,
    marginLeft: 10,

  },

  servicesText: {
    fontWeight: "bold",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 18,
    color: "#334A65",
    textAlign: "center"
  },

  listItem: {
    marginBottom: 10,
    marginTop: 10,
    marginRight: 5,
    marginLeft: 5,
    padding: 10,
    backgroundColor: "whitesmoke",
    // backgroundColor: '#00C853',
    width: 100,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: "#00",
    shadowColor: "black",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.50,
    shadowRadius: 1.41,
    
    elevation: 5,
    borderRadius: 20,
    borderColor: "grey"
  },
 
  itemText: {
    fontWeight: "400",
    fontSize: 15,
    color: '#63C127',
    textAlign: 'center'
  },

  eval: {
    // margin: 10,
    marginHorizontal: 10,
    marginBottom: 13,
    // flexDirection: "row",
    height: 180,
    backgroundColor: "#63C127",
    // backgroundColor: "rgba(99, 193, 39, 0.1)",
    borderRadius: 20,
  },

  row: {
    flexDirection: "row",
    marginTop: 5,
  },

  evalSeparator: {
    width: 30
  },

  metricTitle: {
    fontWeight: "bold",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 30,
    // marginTop: 5,
    marginLeft: 30,
    // lineHeight: 20,
    // color: "#334A65"
    color: "white"
  },

  metricSubtitle: {
    fontWeight: "600",
    color: "white",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 15,
    // marginBottom: 5,
    marginLeft: 35,
  },

  loginBtn: {
    width: "95%",
    // marginLeft: "35%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 25,
    backgroundColor: "#63C127",
    // bottom: "-10%"
    // marginTop: 5,
    marginLeft: 10,
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
  container: {

  },



});

export default ProfileScreen;