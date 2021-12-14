import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//
//----------IMP SCREENS-----------
import Home from "../Screens/Home";
import RegisterResto from "../Screens/RegisterResto.js";
import AddUserScreen from "../Screens/RegisterUser.js";
import AddMenuResto from "../Screens/AddMenuResto.js";
import DetailsResto from "../Screens/DetailsResto";
import ProfileUser from "../Screens/ProfileUser.js";
import GlobalLogin from "../Screens/GlobalLogin.js";
import WebViewScreen from "../Screens/WebViewScreen";
import AwaitEmail from "../Screens/AwaitEmail.js";
import NavHome from "../Screens/NavHome.js";
import NavDetail from "../Screens/NavDetail";
import SelectCommerce from "../Screens/SelectCommerce";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProfileResto from "../Screens/ProfileResto";
import ListReviews from "../Screens/ListReviews";
import AddReviewsRestorant from "../Screens/AddReviewsRestorant";
import ConfirmReservation from "../Screens/ConfirmReservation";
//
//
//------------Styles y otros ---------
import globalStyles from "../Screens/GlobalStyles";
import { Text } from "react-native";
import Btn from "../Screens/Helpers/Btns";

const Stack = createNativeStackNavigator();
const auth = getAuth();

export default Navigator = () => {
  const [usuarioGlobal, setUsuarioGlobal] = useState("");

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase?.emailVerified) {
      if (usuarioFirebase.displayName) {
        setUsuarioGlobal(usuarioFirebase.displayName);
      } else {
        const trimmedName = usuarioFirebase.email.split("@")[0];
        setUsuarioGlobal(trimmedName);
      }
    } else {
      setUsuarioGlobal("");
    }
  });

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
              backgroundColor: "#161616",
            },
          })}
        />
          <Stack.Screen
            name="AwaitEmail"
            component={AwaitEmail}
            options={{
              headerTitle: "Verify Email",
              title: "Confirmacion Email",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: "#161616",
              },  
              headerTintColor: "#ECCDAA",
              headerTitleStyle: {
                fontSize: 25,
              },
            }}
          />
        <Stack.Screen name="RegisterUser" component={AddUserScreen} />
        <Stack.Screen
          name="RegisterResto"
          component={RegisterResto}
          options={{
            headerTitle: "Register Resto",
            title: "Register Resto",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#161616",
            },
            headerTintColor: "#ECCDAA",
            headerTitleStyle: {
              fontSize: 25,
            },
          }}
        />
        <Stack.Screen
          name="AddMenuResto"
          component={AddMenuResto}
          options={{
            title: "Agregar Menu",
            headerTitle: "Agregar Menu",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#161616",
            },
            headerTintColor: "#ECCDAA",
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
              backgroundColor: "#161616",
            },
            headerTintColor: "#ECCDAA",
          })}
        />

        {/* Mercado Pago */}
        <Stack.Screen
          name="WebViewScreen"
          component={WebViewScreen}
          options={{
            headerTitle: "Pague Su Reserva",
            title: "WebViewScreen",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#161616",
            },
            headerTintColor: "#ECCDAA",
            headerTitleStyle: {
              fontSize: 25,
            },
          }}
        />
        {/* //============// */}
        <Stack.Screen
          name="ListReviews"
          component={ListReviews}
          options={{
            headerTitle: "ListReviews",
            title: "ListReviews",
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
          name="AddReviewsRestorant"
          component={AddReviewsRestorant}
          options={{
            headerTitle: " Agregar una opinión",
            title: "Agregar una opinión",

            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#161616",
            },
            headerTintColor: "#ECCDAA",
            headerTitleStyle: {
              fontSize: 25,
            },
          }}
        />
        <Stack.Screen
          name="GlobalLogin"
          component={GlobalLogin}
          options={{
            headerTitle: "",
            title: "Resto Book",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#161616",
            },
            headerTintColor: "#ECCDAA",
            headerTitleStyle: {
              fontSize: 25,
            },
          }}
        />

        <Stack.Screen
          name="ProfileUser"
          component={ProfileUser}
          options={({ navigation }) => ({
            headerTitle: "Perfil",
            title: "Perfil",
            headerTitleAlign: "left",
            headerRight: () => (
              <Btn
                nombre={
                  usuarioGlobal !== "" ? `Crea tu resto!` : `Crea tu resto!`
                }
                ruta="RegisterResto"
                navigation={navigation}
              />
            ),
            headerStyle: {
              backgroundColor: "#161616",
            },
            headerTintColor: "#ECCDAA",
            headerTitleStyle: {
              fontSize: 25,
            },
          })}
        />
        <Stack.Screen
          name="ProfileResto"
          component={ProfileResto}
          options={{
            headerTitle: " Mi Empresa",
            title: "Perfil Resto",

            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#161616",
            },
            headerTintColor: "#ECCDAA",
            headerTitleStyle: {
              fontSize: 25,
            },
          }}
        />

        <Stack.Screen
          name="SelectCommerce"
          component={SelectCommerce}
          options={{
            headerTitle: "Selecciona tu local",
            title: "Mis Sucursales",

            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#161616",
            },
            headerTintColor: "#ECCDAA",
            headerTitleStyle: {
              fontSize: 25,
            },
          }}
        />

        <Stack.Screen
          name='confirmReservation'
          component={ConfirmReservation}
          options={{
            headerTitle: "Su reserva fue confirmada",
            title: "Reservations",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#161616",
            },
            headerTintColor: "#ECCDAA",
            headerTitleStyle: {
              fontSize: 25,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
