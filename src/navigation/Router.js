// import React from "react";
// import {NavigationContainer} from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createAppContainer } from "react-navigation";
// import LoginScreen from "../screens/Login";
// import JobsScreen from "../screens/Jobs";

// // import HomeTabNavigator from "./HomeTabNavigator";
// // import PostScreen from "../screens/PostScreen";

// const Stack = createNativeStackNavigator();

// const Router = (props) => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{
//             animationEnabled: false, headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
//           }}
//         />
//         <Stack.Screen
//           name="Jobs"
//           component={JobsScreen}
//           options={{
//             headerShown: false, cardStyle: { backgroundColor: '#ffffff' }
//           }}
//         /> 
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default Router;