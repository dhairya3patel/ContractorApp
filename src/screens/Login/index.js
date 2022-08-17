// import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
// import Pdf from 'react-native-pdf';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'

import BcryptReactNative from 'bcrypt-react-native';

import { useTogglePasswordVisibility } from "../../hooks/TogglePassword";
import { useLoginButton } from "../../hooks/HandleLogin";
import {API_URL} from "../../constants.js"
import { SALT } from "../../constants.js";

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState("");

  const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility();
  const [password, setPassword] = useState("");

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isSelected, setSelection] = useState(false)

  const validateEmail = (email) => {

    const expression = /(?!.*\.{2})^([a-zA-Z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-zA-Z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-zA-Z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-zA-Z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-zA-Z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-zA-Z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-zA-Z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email))

  }

  const encryptData = (plainText) => {

    Aes.randomKey(32).then(KEY => {
      console.log(KEY)
      let key = KEY.slice(0, 32)
      console.log('key', key)
      let iv = KEY.slice(32,64)
      console.log(iv)
      return Aes.encrypt(plainText, key, iv, 'aes-256-cbc').then(cipher => (
        cipher + '.' + key + '.' + iv
      ))
    })   
  }
  // const validatePassword = (password) => {

  //   const expression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/

  //   return expression.test(String(password))
  // }
  // let [cipher, setCipher] = useState('')

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem('token', value)
    } catch (e) {
      console.log(e)
    }
  }

  const handleLogin = async(event) => {

    event.preventDefault();

    if (!validateEmail(email))
      Alert.alert("Please enter a valid email address");
    
    else if (password.length < 8)
      Alert.alert("Please enter a valid password");

    else {
      // encryptData(
      //   password
      // )
      // .then( cipher => {
      //   console.log(cipher)
      // }).catch(err => {
      //   console.log(err)
      // })
      // Aes.randomKey(64).then(KEY => {
      //   console.log(KEY)
      //   let key = KEY.slice(0, 64)
      //   console.log('key', key)
      //   let iv = KEY.slice(64,96)
      //   console.log(iv)
      //   Aes.encrypt(password, key, iv, 'aes-256-cbc').then(cipherText => {
      //     let temp = cipherText.toString('hex');
      //     console.log(temp)
      //     setCipher(temp + '.' + key + '.' + iv);
      //     console.log(cipher)
        // let salt = await BcryptReactNative.getSalt(12);
        let hash = await BcryptReactNative.hash(SALT, password.toString());
        // console.log(hash)
        axios({
          method: 'post',
          url: `${API_URL}/login`,
          data: {
            email: email,
            password: hash
          },
          timeout: 4000,
        })
        .then( res => {
          // console.log(res);
          if (res.status == 200) {
  
            axios.defaults.headers.common["Authorization"] = `${res.data.token}`;
            storeData('token',res.data.token)
  
            if (res.data.role === 'Contractor')
              navigation.navigate("Jobs");
            else if (res.data.role === 'Manager')
              navigation.navigate("AddJob");
            else
              navigation.navigate("Admin")
          // await AsyncStorage.setItem('token', value)          
  
          }
        })
        .catch(error => {
          console.log(error);
          alert(error);            
        })  
    //   })
    // })
    }
  }


  // const source = require("../../../assets/data/docs/Work_Authorization_Agreement.pdf")

  // const handleModal = () => setIsModalVisible(() => !isModalVisible);
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style = {styles.headerText}>Log In</Text>
        <Image style={styles.headerImage} source={require("../../../assets/images/bhild-logo.png")} />
      </View>

      {/* <Modal isVisible={isModalVisible}>
        <View style={styles.DocPopup}>
          <View style={styles.pdfContainer}>
            <Pdf
              source={source}
              onLoadComplete={(numberOfPages,filePath) => {
                  console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page,numberOfPages) => {
                  console.log(`Current page: ${page}`);
              }}
              onError={(error) => {
                  console.log(error);
              }}
              // onPressLink={(uri) => {
              //     console.log(`Link pressed: ${uri}`);
              // }}
              style={styles.pdf}
            />
          </View>
        </View>
      </Modal> */}

      {/* <StatusBar style="auto" /> */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#BDBDBD"
          onChangeText={(email) => setEmail(email)}
          required
        />
      </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#BDBDBD"
            secureTextEntry={passwordVisibility}
            onChangeText={(password) => setPassword(password)}
            
          />
          <TouchableOpacity onPress={handlePasswordVisibility}>
              <Text style={styles.showButton}>{rightIcon}</Text>
          </TouchableOpacity>
        </View>
    
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgot_button}>Forgot Your Password?</Text>
        </TouchableOpacity>
        <View style={styles.bottomButton}>
          <TouchableOpacity>
            <Text style={styles.joinButton}>Want to join us?</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: 'rgba(99, 193, 39, 0.1)',
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
    Height: "100vh",
    width:"100%"
  },

  header:{
    Height: "40%",
    // marginBottom: "20%",
  },

  headerText: {
    top: "10%",
    // marginBottom: 20,
    color: "#63C127",
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: "bold",
    fontSize: 40,
    lineHeight: 36,
    textAlign: "center",    
  },
 
  headerImage: {
    // backgroundColor: "white",
    padding: 40,
    // borderRadius: 230 / 2,
    // top: "30%", 
    marginTop: 90,     
    marginBottom: 80,
    height: 80,
    width: 230,
  },
 
  // form:{

  // },
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
    color: "#334A65",
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
    alignSelf: "center"
  },
 
  loginBtn: {
    flexDirection: "row",
    width: "90%",
    borderRadius: 25,
    height: 50,
    textAlign: "center",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    backgroundColor: "#63C127",
  },

  loginText: {
      color: "#FFFFFF",
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: "600",
      fontSize: 16,
      lineHeight: 19,
      textAlign: "center",      
  },

  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
},

bottomButton:{
  marginTop: 100
},

joinButton: {
  marginTop: 15,
  height: 30,
  // marginBottom: 20,
  color: "#334A65",
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: "bold",
  fontSize: 22,
  lineHeight: 22,
  alignSelf: "center"
},
  
});

export default LoginScreen;