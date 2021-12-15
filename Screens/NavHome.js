//----------REACT UTILS-----------
import React, { useState, useEffect } from "react";
//
//
//----------REDUX UTILS-----------
import { useDispatch, useSelector } from "react-redux";
import CurrentId from "../Redux/Actions/CurrentId.js";
import CurrentUser from "../Redux/Actions/CurrentUser.js";
import UserFavourites from "../Redux/Actions/userFavourites.js";
import getCommerceInfo from "../Redux/Actions/getCommerceInfo.js";
//
//
//----------REACT-NATIVE UTILS-----------
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import UserOutlined from "react-native-vector-icons/AntDesign";
import RestOutlined from "react-native-vector-icons/AntDesign";
//
//
//----------FIREBASE UTILS-----------
import firebase from "../database/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
//
//
//---------SCREENS & COMPONENTS---------------
import Btn from "./Helpers/Btns.js";
//
//
//-------STYLES-------
import globalStyles from "./GlobalStyles.js";

//
//
//-------INITIALIZATIONS-------

const auth = getAuth();

export default function NavHome({ title, navigation }) {
  const dispatch = useDispatch();

  const hasCommerce = useSelector((state) => state.commerce);
  //Esto lo tenemos que manejar con una propiedad de cada user, dsps lo corregimos
  const [commerce, isCommerce] = useState(0);
  const [commerceId, setcommerceId] = useState([]);
  const loggedId = useSelector((state) => state.currentId);

  // useEffect(() => {
  //   const q = query(
  //     collection(firebase.db, "Restos"),
  //     where("idUser", "==", loggedId)
  //   );
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     let arr = [];
  //     console.log("SNAP HOME 84");
  //     querySnapshot.forEach((doc) => {
  //       let obj = doc.data();
  //       obj.idResto = doc.id;
  //       arr.push(obj);
  //     });
  //     setAvailableCommerces(arr);
  //     setAllRestos(arr);
  //   });
  // }, []);

  useEffect(() => {
    console.log("effect 54");

    const q = query(
      collection(firebase.db, "Restos"),
      where("idUser", "==", loggedId)
    );

    const querySnapshot = onSnapshot(q, (querySnapshot) => {
      let arr = [];
      querySnapshot.forEach((doc) => {
        let obj = doc.data();
        let infoCard = {
          id: doc.id,
        };
        arr.push(infoCard);
      });
      if (arr.length === 1) {
        isCommerce(1);
      }
      if (arr.length > 1) {
        isCommerce(2);
      }
      setcommerceId(arr);
    });
  }, [hasCommerce]);

  useEffect(() => {
    if (commerce === 1) {
      dispatch(getCommerceInfo(commerceId[0]?.id));
    }
  }, [commerceId]);

  // useEffect(() => {
  //   const q = query(
  //     collection(firebase.db, "Users"),
  //     where("id", "==", loggedId)
  //   );
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       let obj = doc.data();
  //       if (obj.commerce === true && obj.multiCommerce === false) {
  //         isCommerce(1);
  //       }
  //       if (obj.commerce === true && obj.multiCommerce === true) {
  //         isCommerce(2);
  //       }
  //     });
  //   });
  // }, [loggedId, hasCommerce]);

  //__________________________________________________________________________________
  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (!usuarioFirebase?.emailVerified) {
      dispatch(CurrentId(null));
      isCommerce(false);
    }
  });

  const signOutAndClearRedux = () => {
    signOut(auth);
    dispatch(CurrentUser(null));
    dispatch(CurrentId(null));
    dispatch(UserFavourites([]));
    dispatch(getCommerceInfo(null));
  };

  return (
    <View style={globalStyles.navHome}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          paddingHorizontal: 5,
          marginHorizontal: -10,
        }}
      >
        <View style={globalStyles.containerTitle}>
          {/* <Image
            source={require("../assets/icon.png")}
            style={globalStyles.img}
          /> */}
          <Text style={globalStyles.title}>{title}</Text>
        </View>
        <View style={globalStyles.btnContainer}>
          {/* <Btn nombre="Login" ruta="GlobalLogin" navigation={navigation} /> */}
          <TouchableOpacity
            style={globalStyles.btn}
            onPress={() =>
              loggedId
                ? signOutAndClearRedux()
                : navigation.navigate("GlobalLogin")
            }
          >
            <Text style={globalStyles.btnText}>
              {loggedId ? "Salir" : "Iniciar Sesion"}
            </Text>
          </TouchableOpacity>

          {loggedId && (
            <Btn
              nombre={<UserOutlined name="user" color="#ECCDAA" size={15} />}
              ruta="ProfileUser"
              navigation={navigation}
            />
          )}

          {commerce === 1 && loggedId && (
            <Btn
              nombre={<RestOutlined name="rest" color="#ECCDAA" size={15} />}
              ruta="ProfileResto"
              navigation={navigation}
            />
          )}
          {commerce > 1 && loggedId && (
            <Btn
              nombre={<RestOutlined name="rest" color="#ECCDAA" size={15} />}
              ruta="SelectCommerce"
              navigation={navigation}
            />
          )}
        </View>
      </View>
    </View>
  );
}
