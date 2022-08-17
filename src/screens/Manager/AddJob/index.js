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
  Alert,
  Modal,
} from "react-native";
import {useForm, Controller} from 'react-hook-form'
import SegmentedControl from '@react-native-segmented-control/segmented-control';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Icon from 'react-native-vector-icons/dist/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/dist/FontAwesome5"
import { ScreenStackHeaderRightView } from "react-native-screens";
// import PictureGallery from "../../components/Carousel";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import CheckBox from '@react-native-community/checkbox'
import ImageModal from 'react-native-image-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import uuid from 'react-native-uuid';
import base64 from 'react-native-base64'
import RNFS from 'react-native-fs'
import { Buffer } from "safe-buffer";

import { API_URL } from "../../../constants.js";

var photos = [];

const createFormData = (photo, body = {}) => {
  const data = new FormData();

  data.append('photo',{
    // id: body.id,
    name: photo["assets"][0]['fileName'],
    type: photo['assets'][0]['type'],
    uri: Platform.OS === 'ios' ? photo['assets'][0]['uri'].replace('file://', '') : photo['assets'][0]['uri'],
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });
  return data;
};

const getAuth = async() => {
  const token = await AsyncStorage.getItem('token');
  // console.log(token);
  return token;
}


const AddJobScreen = ({ route, navigation}) => {

  const {
    control, 
    handleSubmit, 
    formState: {errors, isValid}
  } = useForm({mode: 'onBlur'})

    const onSubmit = data => {
      // const now = new Date().getTime()
      // const bidEnd = new Date(now + data.bidWindow * 60000)
      // console.log(bidEnd)
      // data['bidEnd'] = bidEnd
      data["pictures"] = photos
      data["date"] = date
      console.log(data);

      axios({
        method: 'post',
        url: `${API_URL}/createjob`,
        data: data,
        timeout: 4000,
      })
      .then( res => {
        // console.log(res);
        if (res.status == 201) {
          alert("Job Created")
        }
        else
          alert(res.data.message);
      })
      .catch(error => {
        console.log(error);
        alert(error);            
      })      

    }

    const colorScheme = useColorScheme();
    const [textColor, setTextColor] = useState('#000');
    useEffect(() => {
    setTextColor(colorScheme === 'dark' ? '#FFF' : '#000');
    }, [colorScheme]);

    const [photo, setPhoto] = useState(null);
    const [bid, setBid] = useState("");
    const [isSelected, setSelection] = useState(false)
    const screenHeight = Dimensions.get('window').height
    const[date, setSelectedDate] = useState('Select Date');
    const[dateColor, setDateColor] = useState('grey')
    const[opacity, setOpacity] = useState(0.5)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (date) => {
      setSelectedDate(date);
      setDateColor("black")
      setOpacity(1)
      // console.warn("A date has been picked: ", date);
      hideDatePicker();
    };

    const handleChoosePhoto = () => {
      launchImageLibrary({ noData: true }, (response) => {
        // console.log(response);
        if (response) {
          setPhoto(response);
        }
      });
    };

    const handleUploadPhoto = async() => {
      // console.log(pic["_parts"])
      // RNFS.readFile(pic["_parts"][0][1]["uri"], 'base64')
      // .then(res =>{
      //   // console.log(res)
      //   let img = Buffer.from(res,'base64')
      //   photos.push({"id": uuid.v4(), "image":img})
      // });
      // console.log(pic["_parts"])
      // console.log(pic)
      let id = uuid.v4()
      const pic = createFormData(photo, { id: id })
      fetch(`${API_URL}/uploadimage`, {
        method: 'POST',
        headers: {'Authorization': await AsyncStorage.getItem('token')},
        body: pic,
      })
        .then((response) => response.json())
        .then((response) => {
          // console.log('response', response);
          if (response.status == 201) {
            // console.log('response', response);
            photos.push(id)
            Alert.alert("Image uploaded!")
            setPhoto(null)
          }
          else
            Alert.alert("Error Uploading Image!\nPlease Try Again")
        })
        .catch((error) => {
          console.log('error', error);
        });
    };


    return (
        <SafeAreaView>
            <View style={{height:"auto", maxHeight: screenHeight,}}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        {/* <Text style = {styles.leftHeaderButton}>Settings</Text> */}
                      <Icon name={"arrow-left"} color={"#ffffff"} size={20} style={{margin: 10}} />
                    </TouchableOpacity>
                    <View style = {styles.centerHeader}>
                        <Text style = {styles.centerHeaderText}>AddJob</Text>
                    </View>
                </View>
              <KeyboardAwareScrollView enableOnAndroid={true} enableAutomaticScroll={true} extraScrollHeight={150}>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>PO</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="po"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                              style={styles.TextInput}
                              placeholder="PO"
                              placeholderTextColor="#BDBDBD"
                              value={value}
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                      />
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>Job Type</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="jobType"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                              style={styles.TextInput}
                              placeholder="Job Type"
                              placeholderTextColor="#BDBDBD"
                              value={value}
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                      />
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>Address Line 1</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="address1"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                              style={styles.TextInput}
                              placeholder="Address"
                              placeholderTextColor="#BDBDBD"
                              value={value}
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                      />                                
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>Address Line 2</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="address2"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                              style={styles.TextInput}
                              placeholder="Location"
                              placeholderTextColor="#BDBDBD"
                              value={value}
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                      />                                
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>City</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="city"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                              style={styles.TextInput}
                              placeholder="City"
                              placeholderTextColor="#BDBDBD"
                              value={value}
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                      />                                
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>State</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="state"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                              style={styles.TextInput}
                              placeholder="State"
                              placeholderTextColor="#BDBDBD"
                              value={value}
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                      />                                
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>Zip</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="zip"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                              keyboardType="numeric"
                              style={styles.TextInput}
                              placeholder="Zip"
                              placeholderTextColor="#BDBDBD"
                              value={value}
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                      />                                
                    </View>
                  </View>                                                                                          
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>Date of Completion</Text>
                    </View>
                    <View style={styles.dateView}>
                      <View style={styles.inputView}>
                        <Text style={{
                          color: dateColor, 
                          opacity: opacity, 
                          height: 55, 
                          flex: 1, 
                          padding: 15, 
                          textAlign: "center",
                          fontFamily: 'Inter',
                          fontStyle: 'normal',
                          fontWeight: "500",
                          fontSize: 20,}}
                        >{date !== 'Select Date' ? date.toLocaleDateString("en-us"): date}</Text>
                      </View>  
                    <TouchableOpacity style={styles.dateBtn}>
                      <Text style={styles.dateText} onPress={showDatePicker}>Date</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>Bid Window</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="bidWindow"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                              keyboardType="numeric"
                              style={styles.TextInput}
                              placeholder="Bid Window"
                              placeholderTextColor="#BDBDBD"
                              value={value}
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                      />
                    </View>
                  </View>                  
                  <View style={styles.row}>
                      <View style={styles.label}>
                          <Text style={styles.title}>Estimated Hours</Text>
                      </View>
                      <View style={styles.inputView}>
                        <Controller
                          control={control}        
                          name="estimatedHours"
                          render={({field: {onChange, value, onBlur}}) => (
                            <TextInput
                                style={styles.TextInput}
                                keyboardType="numeric"
                                placeholder="Estimated Hours"
                                placeholderTextColor="#BDBDBD"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                            />
                          )}
                          rules={{
                            required: {
                              value: true,
                              message: 'Field is required!'
                            }
                          }}                                
                        />                                
                      </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>Equipment Needed</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="equipment"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                            style={styles.TextInput}
                            multiline={true}
                            placeholder="Equipment Needed"
                            placeholderTextColor="#BDBDBD"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                      />                                
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>Notes</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="notes"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                            style={styles.TextInput}
                            multiline={true}
                            placeholder="Notes"
                            placeholderTextColor="#BDBDBD"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                      />                                
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>Lowest Bid</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="bidLow"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                            keyboardType="numeric"
                            style={styles.TextInput}
                            placeholder="Lowest Bid"
                            placeholderTextColor="#BDBDBD"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                        />                                
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.label}>
                        <Text style={styles.title}>Highest Bid</Text>
                    </View>
                    <View style={styles.inputView}>
                      <Controller
                        control={control}        
                        name="bidHigh"
                        render={({field: {onChange, value, onBlur}}) => (
                          <TextInput
                              keyboardType="numeric"
                              style={styles.TextInput}
                              placeholder="Highest Bid"
                              placeholderTextColor="#BDBDBD"
                              value={value}
                              onBlur={onBlur}
                              onChangeText={value => onChange(value)}
                          />
                        )}
                        rules={{
                          required: {
                            value: true,
                            message: 'Field is required!'
                          }
                        }}                                
                      />                                
                    </View>
                  </View>
                  <View style={styles.col}>
                    <View style={styles.label}>
                        <Text style={styles.title}>Pictures</Text>
                    </View>
                    <View style={styles.uploadContainer}>
                      {photo && (
                        <>
                          <Image
                            source={{ uri: photo["assets"][0]["uri"]}}
                            style={styles.image}
                          />
                          <TouchableOpacity style={styles.uploadBtn}>
                            <Text style={styles.loginText} onPress={handleUploadPhoto}>Upload Photo</Text>
                          </TouchableOpacity>
                        </>
                      )}
                      <TouchableOpacity style={styles.uploadBtn}>
                        <Text style={styles.loginText} onPress={handleChoosePhoto}>Choose Photo</Text>
                      </TouchableOpacity>                            
                    </View>
                  </View>                        
                  <View style={styles.bidView}>
                    <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit(onSubmit)} >
                        <Text style={styles.loginText}>Add Job</Text>
                    </TouchableOpacity>                            
                  </View>
                <View style={styles.dummy}></View>                                                 
              </KeyboardAwareScrollView>
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

  col: {
    // marginLeft: 20,
    marginTop: 20,    
  },

  row: {
    marginTop: 20,
    flexDirection: "row"
  },

  label: {
    marginLeft: 20,    
    width: "35%",
  },

  title: {
    fontWeight: "bold",
    color: "black",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 25,
    color: "#334A65",
    marginTop: 10,
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
    width: "55%",
    height: 55,
    marginBottom: 5,
    // marginLeft: 15,
    // marginTop: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E8E8E8"
 
    // alignItems: "left",
  },
 
  TextInput: {
    height: 55,
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
    // marginLeft: 20,
    borderRadius: 25,
    height: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#63C127",
    // bottom: 10
  },
 
  uploadBtn: {
    width: "60%",
    // marginLeft: 20,
    borderRadius: 25,
    height: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#63C127",
    // bottom: 10
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

  image: {
    marginTop: 10,
    alignSelf: 'center',
    width: 300, 
    height: 300, 
    borderColor:"#E8E8E8", 
    borderWidth: 2,
    resizeMode: "contain",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.50,
    shadowRadius: 1.41,
    
    // elevation: 5,
    // borderRadius: 20,    
  },

  dateView: {
    flexDirection: 'row',
    // backgroundColor: "#F6F6F6",
    // backgroundColor: "#E8E8E8",
    borderRadius: 10,
    width: "75%",
    height: 55,
    marginBottom: 5,
  },

  dateBtn: {
    width: "15%",
    marginLeft: 10,
    borderRadius: 10,
    height: 45,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 20,
    backgroundColor: "#63C127",
    // bottom: 10
  },  
 
  dateText: {
    color: "#FFFFFF",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 19,
    textAlign: "center",      
  },  

  dateBox: {
    height: 55,
    flex: 1,
    padding: 15,
    // marginLeft: "23%",
    textAlign: "center",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "500",
    fontSize: 20,
    // opacity: 0.5
    
  },

});

export default AddJobScreen;