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

import UserCard from "../../../components/Admin/UserCard.js";
import API_URL from "../../../constants.js";

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
      // alert(error);            
    })    
  }

  const deleteItem = (item) => {
    axios({
        method: 'post',
        url: `${API_URL}/deleteuser`,
        data: {
          "id": item._id
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

  const [dataSource, setDataSource] = useState("");

  useEffect (() => {

    getUsers('Admin')
    
  },[])


  const handleModal = () => setIsModalVisible(() => !isModalVisible);  

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
    var visible = 'flex'
    if (value == 'Admin')
      visible = 'none'
    return <UserCard item={item} func={deleteItem} visible={visible}/>;
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
        {/* <View style={{flex: 1}}> */}
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

});

export default UsersScreen;