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
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import CheckBox from '@react-native-community/checkbox'
import axios from 'axios';
import {useForm, Controller} from 'react-hook-form'

import UserCard from "../../../components/Admin/UserCard.js";
import { API_URL } from "../../../constants.js";

const UsersScreen = ({navigation}) => {

  const getUsers = (role) => {
    axios({
      method: 'post',
      url: `${API_URL}/getusers`,
      data: {
        "role": role,
      },
      // headers: {'Authorization': await AsyncStorage.getItem('token')},
      timeout: 4000,
    })
    .then( res => {
      // console.log(res);
      if (res.status == '200') {
        setDataSource(res.data.users)
      }
      // else
      //   alert(res.data.message);
    })
    .catch(error => {
      // console.log(res.data)
      // console.log(error);
      alert(error);            
    })    
  }

  const deleteItem = (item) => {
    axios({
        method: 'post',
        url: `${API_URL}/deleteuser`,
        data: {
          "id": item.user._id,
          "childId": item._id,
          "role": item.user.role
        },
        timeout: 4000,
      })
      .then( res => {
        // console.log(res.data);
        if (res.status == 200) {
            alert('User Deleted!')
        }
        else
          alert(res.data.message);
      })
      .catch(error => {
        // console.log(error);
        alert(error);            
      })    
  
  };

  const [flatListRef, setFlatListRef] = useState("");
  const colorScheme = useColorScheme();
  const [textColor, setTextColor] = useState('#000');
  const [value, setValue] = useState('Admin');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [services, setServices] = useState([]);

  const [dataSource, setDataSource] = useState("");

  const [isContractorModalVisible, setIsContractorModalVisible] = React.useState(false);
  const [isManagerModalVisible, setIsManagerModalVisible] = React.useState(false);
  const handleContractorModal = () => setIsContractorModalVisible(() => !isContractorModalVisible);
  const handleManagerModal = () => setIsManagerModalVisible(() => !isManagerModalVisible);

  const [isRatingModalVisible, setIsRatingModalVisible] = React.useState(false);
  const handleRatingModal = () => setIsRatingModalVisible(() => !isRatingModalVisible);
  const displayRatingModal = () => {
    setIsContractorModalVisible(() => !isContractorModalVisible)
    setIsRatingModalVisible(() => !isRatingModalVisible)
  }
  const [contractor, setContractor] = useState({
    _id: "",
    name: "",
    user: {
        _id: "",
        name: "",
        email: "",
        role: ""
    },
    services: [],
    contact: "",
    serviceLocation: [],
    authPersonnel: "",
    logo: "",
    rating: {
        avg: "",
        jobsCompleted: "",
        ongoing: "",
        availability: "",
        service: "",
        quality: ""
    }
  })

  const [manager, setManager] = useState({
    contact: "",
    _id: "",
    user: {
        _id: "",
        name: "",
        email: "",
        password: "",
        role: "",
    },
  })

  useEffect (() => {

    getUsers('Admin')
    
  },[])


  const {
    control, 
    handleSubmit, 
    formState: {errors, isValid}
  } = useForm({mode: 'onBlur'})

  const onSubmit = data => {

    console.log(data);

    axios({
      method: 'post',
      url: `${API_URL}/rateuser`,
      data: {
        contractor: contractor._id,
        rating:data,
      },
      timeout: 4000,
    })
    .then( res => {
      console.log(res);
      if (res.status == 200) {
        alert("Rating Updated")
        handleRatingModal
      }
      else
        alert(res.data.message);
    })
    .catch(error => {
      console.log(error);
      alert(error);            
    })      

  }  

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

  const _onValueChange = (val) => {
    setValue(val);
    getUsers(val);
    // getJobs(val)
    flatListRef.scrollToOffset({ animated: true, offset: 0 });
    // setRefreshing(false)
  };

  const onPressFunction = () => {
    flatListRef.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderJob = ({item}) => {
    var disabled = false;
    if (value == 'Admin') {
      disabled = true
      item.user = item;
    }
    return <UserCard item={item} viewItem={viewItem} disabled={disabled}/>;
  };

  const viewItem = item => {
    if (item.user.role == "Manager") {
      setManager(item)
      handleManagerModal();  
    }
    else if (item.user.role == 'Contractor') {
      setContractor(item)
      var serv = []
      for (var i = 0; i < item.services.length - 1; i++) {
        serv.push(item.services[i].name + '\n')
      }
      serv.push(item.services[i].name)
      setServices(serv)
      handleContractorModal();        
    }

  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
              <Text style = {styles.leftHeaderButton}>Settings</Text>
          </TouchableOpacity>
          <Text style = {styles.centerHeaderText}>Users</Text>
        </View>

        <View style={styles.segmentContainer}>
          <SegmentedControl
            style= {{height: 50}}
            values={['Admin', 'Manager', 'Contractor']}
            selectedIndex={selectedIndex}
            onChange={_onChange}
            onValueChange={_onValueChange}
          />
        </View>
        <Modal isVisible={isContractorModalVisible}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleContractorModal}>
                <Icon name={"times"} color={"#334A65"} size={20} style={{margin: 10, marginTop: 15, marginRight: "90%",}} />
              </TouchableOpacity>            
            </View>
            <View style={styles.modalDetails}>
              <View style={styles.modalSection}>
                <Text style={styles.modalTitle}>Company:</Text>
                <Text style={styles.subtitle}>{contractor.name}</Text>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalTitle}>E-mail:</Text>
                <Text style={styles.subtitle}>{contractor.user.email}</Text>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalTitle}>Contact:</Text>
                <Text style={styles.subtitle}>{contractor.contact}</Text>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalTitle}>Services:</Text>
                <Text style={styles.subtitle}>{services}</Text>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalTitle}>Service Location:</Text>
                <Text style={styles.subtitle}>{contractor.serviceLocation}</Text>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalTitle}>Rating:</Text>
              </View>
              <View style={styles.modalSection}>
                <View style ={styles.leftModal}>
                <Text style={styles.subtitle}>Average: {contractor.rating.avg}</Text>
                <Text style={styles.subtitle}>Completed: {contractor.rating.jobsCompleted}</Text>
                <Text style={styles.subtitle}>Ongoing: {contractor.rating.ongoing}</Text>
                </View>
                <View style ={styles.rightModal}>
                <Text style={styles.subtitle}>QoS: {contractor.rating.quality}</Text>
                <Text style={styles.subtitle}>Availability: {contractor.rating.availability}</Text>                
                 </View>
              </View>              
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={() => deleteItem(contractor)} >
              <Text style={styles.loginText}>Delete Contractor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ratingBtn} onPress={displayRatingModal}>
              <Text style={styles.loginText}>Rate Contractor</Text>
            </TouchableOpacity>                          
          </View>
        </Modal>

        <Modal isVisible={isRatingModalVisible}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleRatingModal}>
                <Icon name={"times"} color={"#334A65"} size={20} style={{margin: 10, marginTop: 15, marginRight: "90%",}} />
              </TouchableOpacity>            
            </View>
            <View style={styles.modalDetails}>
              <View style={styles.modalSection}>
              {/* <View style={styles.row}> */}
                <View style={styles.label}>
                    <Text style={styles.title}>Availability</Text>
                </View>
                <View style={styles.inputView}>
                  <Controller
                    control={control}        
                    name="availability"
                    render={({field: {onChange, value, onBlur}}) => (
                      <TextInput
                          keyboardType="numeric"
                          style={styles.TextInput}
                          placeholder="Availability"
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
              <View style={styles.modalSection}>
              {/* <View style={styles.row}> */}
                <View style={styles.label}>
                    <Text style={styles.title}>Quality</Text>
                </View>
                <View style={styles.inputView}>
                  <Controller
                    control={control}        
                    name="quality"
                    render={({field: {onChange, value, onBlur}}) => (
                      <TextInput
                          keyboardType="numeric"
                          style={styles.TextInput}
                          placeholder="Quality"
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
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit(onSubmit)} >
              <Text style={styles.loginText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        </Modal>        
        <Modal isVisible={isManagerModalVisible}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleManagerModal}>
                <Icon name={"times"} color={"#334A65"} size={20} style={{margin: 10, marginTop: 15, marginRight: "90%",}} />
              </TouchableOpacity>            
            </View>
            <View style={styles.modalDetails}>
              <View style={styles.modalSection}>
                <Text style={styles.modalTitle}>Name:</Text>
                <Text style={styles.subtitle}>{manager.user.name}</Text>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalTitle}>Contact:</Text>
                <Text style={styles.subtitle}>{manager.contact}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={() => deleteItem(manager)} >
              <Text style={styles.loginText}>Delete Manager</Text>
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
              <View style={{height: 360}}>
                {/* <Text style={styles.subtitle}>That's it for now!</Text> */}
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
    width: "50%",
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

  ratingBtn: {
    width: "90%",
    borderRadius: 25,
    height: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 15,
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

  modalTitle: {
    margin: 10,
    marginLeft: 5,
    fontWeight: "bold",
    color: "black",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 25,
    color: "#334A65"
  },

  modalSubtitle: {
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
  leftModal: {
    width: '50%'
  },
  rightModal: {
    width: '50%'
  },

  label: {
    // marginLeft: 20,    
    width: "40%",
  },  

});

export default UsersScreen;