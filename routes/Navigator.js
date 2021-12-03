import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";

//----------IMP SCREENS-----------
import Home from "../Screens/Home";
import RegisterResto from "../Screens/RegisterResto.js";
import AddUserScreen from "../Screens/RegisterUser.js";
import AddMenuResto from "../Screens/AddMenuResto.js";
import DetailsResto from "../Screens/DetailsResto";
import ProfileUser from '../Screens/ProfileUser.js';
import GlobalLogin from "../Screens/GlobalLogin.js";
import PaymentCalc from "../Screens/PaymentCalc"

import AwaitEmail from "../Screens/AwaitEmail.js";
import NavHome from "../Screens/NavHome.js";
import NavDetail from "../Screens/NavDetail";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProfileResto from "../Screens/ProfileResto";
//------------Styles y otros ---------
import globalStyles from "../Screens/GlobalStyles";
import { Text } from 'react-native'

const Stack = createNativeStackNavigator();

export default Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={"RestoBook"}
          component={Home}
          options={({ navigation }) => ({
            headerTitle: () => (
              <NavHome navigation={navigation} title={"Resto Book"} />
            ),
            headerStyle: {
              backgroundColor: "#f6efd2",
            },
          })}
        />

        <Stack.Screen
          name="PaymentCalc"
          component={PaymentCalc}
          options={{
            headerShown: false
          }}
        />



        <Stack.Screen name="RegisterUser" component={AddUserScreen} />
        <Stack.Screen
          name="RegisterResto"
          component={RegisterResto}
          options={{
            headerTitle: "RegisterResto",
            title: "Register Resto",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#f6efd2",
            },
            headerTintColor: "#392c28",
            headerTitleStyle: {
              fontSize: 25,
            },
          }}
        />
        <Stack.Screen
          name="AddMenuResto"
          component={AddMenuResto}
          options={{
            headerTitle: "AddMenuResto",
            title: "Add Your Menu",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#f6efd2",
            },
            headerTintColor: "#392c28",
            headerTitleStyle: {
              fontSize: 25,
            },
          }}
        />
        <Stack.Screen
          name="DetailsResto"
          component={DetailsResto}
          options={({ navigation }) => ({
            headerTitle: () => <NavDetail navigation={navigation} />,
            headerStyle: {
              backgroundColor: "#f6efd2",
            },
          })}
        />
        <Stack.Screen
          name="GlobalLogin"
          component={GlobalLogin}
          options={{
            headerTitle: "",
            title: "RestoBook",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#f6efd2",
            },
            headerTintColor: "#392c28",
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: "bold",
            },
          }}
        />


        <Stack.Screen
          name="AwaitEmail"
          component={AwaitEmail}
          options={{
            headerTitle: "Verify Email",
            title: "Verify Email",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#f6efd2",
            },
            headerTintColor: "#392c28",
            headerTitleStyle: {
              fontSize: 25,
            },
          }}
        />
        <Stack.Screen
          name="ProfileUser"
          component={ProfileUser}
          options={{
            headerTitle: "Profile",
            title: 'Profile',
            headerTitleAlign: "center",
            headerRight: () => (
              <TouchableOpacity
                style={globalStyles.btn}
                onPress={() =>
                  navigation.navigate('NavHome')
                }
              >
                <Text>Log out</Text>
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#f6efd2',
            },
            headerTintColor: '#392c28',
            headerTitleStyle: {
              fontSize: 25
            },

          }}
        />
        <Stack.Screen
          name="ProfileResto"
          component={ProfileResto}
          options={{
            headerTitle: "Profile",
            title: 'Profile',
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: '#f6efd2',
            },
            headerTintColor: '#392c28',
            headerTitleStyle: {
              fontSize: 25
            },

          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
