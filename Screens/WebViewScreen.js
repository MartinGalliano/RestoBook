import React, { useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "react-native-animatable";
import { WebView } from "react-native-webview";
import WebViewNavigation from "./WebViewNavigation";
import { useSelector } from "react-redux";
import emailjs from "emailjs-com";
//--------------FIREBASE-----------------------//
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from "../database/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
//-------INITIALIZATIONS-------
const auth = getAuth();

export default function WebViewScreen({ route, navigation }) {
  const didMountRef = useRef(false);
  const webViewRef = useRef();
  const { url, cantLugares, unitPrice } = route.params;
  const [currentUrl, setCurrentUrl] = useState(url);
  const currentUser = useSelector( state => state.currentUser)
  const empresaDetail = useSelector((state) => state.empresaDetail);
  const [reserva, setReserva] = useState({});
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  //useEffect consologear la url para ver que tira
  //hacer un useEffect y useState y colocar la URL de la HOME para que la tome todo el tiempo
  //con OnNavigationStateChange evalúa las condiciones de la pantalla actual
  //Webview con OnNavigationStateChange{state{state.url}} pasar un cosole.log(state) para ver si muestra la URL
  //guardar esa URL en un estado local currentUrl y setCurrentUrl y setear el set al state.url del navigationStateChange
  const getInfo = async () => {
    console.log('Checking if approved...')
    if (currentUrl.includes("/approved")) {
      try {
        console.log('Its approved, working...')
        const reservaId = currentUrl.split("=");
        const newReserva = {
          idReserva: reservaId[1],
          statusReserva: "approved",
        };
        sendEmail(newReserva);
        reservaToDB(newReserva);
        // const docRef = doc(firebase.db, "Users", auth.currentUser.uid);
        // const docSnap = await getDoc(docRef);
        // if (docSnap.exists()) {
        //   let obj = docSnap.data();
        //   setCurrentUser(obj);
        // }
      } catch (error) {
        console.log(error);
      }
    }
  };
 
    const sendEmail = (reserva) => {
      console.log("Entro a sendEmail");
      console.log("reserva dentro de sendEmail: ", reserva);
      const templateParams = {
        subject: `Tu reserva en ${empresaDetail.title} fue confirmada`,
        name: currentUser.name,
        restoName: empresaDetail.title,
        email: currentUser.email,
        idReserva: reserva.idReserva,
        cantCupos: cantLugares,
        unitPrice: unitPrice
      };
      emailjs.send('service_w5zryen', 'template_zwe6qen', templateParams, 'user_IEK9t1hQIR3ugtExEH6BG'); 
        setTimeout(() => {
        navigation.navigate("confirmReservation", {
          empresa: empresaDetail,
          lugares: cantLugares,
          idReserva: reserva.idReserva
        });
        // alert(
        //   "Te enviamos un mail con la confirmacion y datos de tu Reserva, muchas gracias !"
        // );
      }, 4900);
    };
    const reservaToDB = async (reserva) => {
      //console.log("currentUser: ", currentUser);
      //console.log("reserva dentro de reserva ToDB : ", reserva);
      let date = new Date()
      let fecha = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
      let hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      console.log('fecha: ', fecha, 'time: ', hora)
      const reservation = {
        idReserva: reserva.idReserva,
        statusReserva: reserva.statusReserva,
        emailUser: currentUser.email,
        idUser: currentUser.id,
        nameResto: empresaDetail.title,
        idResto: empresaDetail.idResto,
        cantCupos: cantLugares,
        unitPrice: unitPrice,
        address: empresaDetail.location.address,
        date: {
          date: fecha,
          time: hora
        }
      };
      try {
        let userRef = doc(firebase.db, "Users", currentUser.id);
        await updateDoc(userRef, {
          reservations: arrayUnion(reservation),
        });
        //console.log(
         // `Reserva en Resto: ${empresaDetail.title}, con id: ${reservation.idReserva} para el usuario ${currentUser.name}`
        //);
      } catch (err) {
        console.log(err);
      }
      try {
        let restoRef = doc(firebase.db, "Restos", empresaDetail.idResto);
        await updateDoc(restoRef, {
          reservations: arrayUnion(reservation),
        });
       // console.log(
       //   `Reserva actualizada en User: ${currentUser.name}, con id: ${reservation.idReserva}`
       // );
      } catch (err) {
        console.log(err);
      }
    };

    const handleBackPress = () => {
      webViewRef.current.goBack();
    };
    const handleForwardPress = () => {
      webViewRef.current.goForward();
    };
    // useEffect(() => {
    //   // if (didMountRef.current) {
     
    //   // }
    // }, [currentUser]);

    useEffect(() => {
      // if (didMountRef.current) {
       // console.log("entro con didMountRef en true");
        getInfo();
      // } else {
        // didMountRef.current = true;
      // }
    }, [currentUrl]);

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          navigation={navigation}
          onNavigationStateChange={(state) => {
            const url = state.url;
            setCurrentUrl(url);
            const back = state.canGoBack;
            const forward = state.canGoForward;
            setCanGoBack(back);
            setCanGoForward(forward);
          }}
        ></WebView>
        <WebViewNavigation
          onBackPress={() => handleBackPress()}
          onForwardPress={() => handleForwardPress()}
        />
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
