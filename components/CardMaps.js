import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AirbnbRating, Rating, Card, Text, Icon, Badge } from "react-native-elements";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
//------ACTIONS---------
import empresaDetail from "../Redux/Actions/empresaDetail.js";
//-----STYLES----------
//------ICONS----------
//----------FIREBASE UTILS-----------
import firebase from "../database/firebase";
import { getAuth } from "firebase/auth";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
//

const auth = getAuth();
import { CLOUDINARY_CONSTANT } from "@env";

const CardMaps = ({ resto, navigation }) => {
  // const userFavourites = useSelector((state) => state.favourites);
  const [userFavourites, setUserFavourites] = useState();
  const CurrentId = useSelector((state) => state.currentId);
  const [hearthColor, setHearthColor] = useState("grey");
  const [resultRating, setResultRating] = useState(0);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categoriesResto);
  const isFocused = useIsFocused();

  // console.log(resto)
  const getFavs = async () => {
    if (CurrentId) {
      const docRef = doc(firebase.db, "Users", CurrentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        let obj = docSnap.data().favourites;
        setUserFavourites(obj);
      }
    } else {
      setUserFavourites(null);
    }
  };
  const getRating = () => {
    let totalRating = 0;
    if (resto.reviews.length) {
      for (let i = 0; i < resto.reviews.length; i++) {
        totalRating += resto.reviews[i].rating;
      }
      let resultRatingg = totalRating / resto.reviews.length;
      setResultRating(resultRatingg);
    } else {
      setResultRating(totalRating);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getFavs();
      getRating();
    }
  }, [isFocused]);

  let infoFavourite = {
    idResto: resto.idResto,
    title: resto.title,
    phone: resto.phone,
    location: resto.location,
    img: resto.restoImage,
    reservationsParams: resto.reservationsParams
  };
  const celphone = "+54 9" + resto.phone;
  const trimmedName = auth?.currentUser?.email?.split("@")[0];

  useEffect(() => {
    if (CurrentId) {
      let idFavourites = userFavourites?.map((element) => element.idResto);
      if (idFavourites?.includes(resto.idResto)) {
        setHearthColor("red");
      } else {
        setHearthColor("grey");
      }
    } else {
      setHearthColor("grey");
    }
  }, [userFavourites, CurrentId]);

  const handleOnPress = () => {
    dispatch(empresaDetail(resto));
    navigation.navigate("DetailsResto");
  };

  const handleWhatsapp = async () => {
    await Linking.openURL(
      `whatsapp://send?text=Hola ${resto.title}, mi nombre es ${trimmedName} y quiero generar una reserva&phone=${celphone}`
    );
  };

  const addToFavourite = async () => {
    if (auth?.currentUser?.uid) {
      try {
        console.log('consolelog en InfoFavourite: ', infoFavourite)
        setHearthColor("red");
        let docRef = doc(firebase.db, "Users", auth.currentUser.uid);
        await updateDoc(docRef, {
          favourites: arrayUnion(infoFavourite),
        });
      } catch (e) {
        setHearthColor("grey");
        // alert("no estas logueado");
        console.log("error add:", e);
      }
    }
  };

  const removeFromFavourite = async () => {
    if (auth?.currentUser?.uid) {
      try {
        setHearthColor("grey");
        let docRef = doc(firebase.db, "Users", auth.currentUser.uid);
        await updateDoc(docRef, {
          favourites: arrayRemove(infoFavourite),
        });
      } catch (e) {
        console.log("error remove:", e);
      }
    }
  };

  let horaInicio = resto.commerceTimeRange ? resto.commerceTimeRange.split("-")[0] : null;
  let horaFin = resto.commerceTimeRange ? resto.commerceTimeRange.split("-")[1] : null;
  const handleHorarioReserva = () => {
    let horaActual = new Date().getHours();
    //console.log(horaActual, horaInicio, horaFin)
    if (horaActual >= horaInicio && horaActual < horaFin) {
      return true
    } else {
      return false
    }
  }


  return (
    <View style={stylesMap.cardsContainer}>
      <Badge status={handleHorarioReserva() ? "success" : "error"} />
      <TouchableOpacity onPress={() => handleOnPress()}>
        <View style={stylesMap.containerImgCard}>

          <Image
            style={stylesMap.cardsMapimg}
            source={{
              uri: CLOUDINARY_CONSTANT + resto.restoImage,
            }}
          />
        </View>

        <View style={stylesMap.cardsDescriptionContainer}>
          <View>
            <Text style={stylesMap.cardsMapTitle}>{resto.title}</Text>
          </View>

          <View>
            <AirbnbRating
              starContainerStyle={{position:'absolute', bottom: -2}}
              showRating={false}
              size={11}
              isDisabled={true}
              selectedColor="#f1c40f"
              unSelectedColor="lightgrey"
              defaultRating={resultRating}
            />
            {/* <Rating
              // count={10}
              imageSize={20}
              readonly
              startingValue={resultRating}
              // startingValue={0}
            /> */}

            {/* <Rating
          showRating
            type= 'custom'
            // readonly={true} // este es para que los users no puedan cambiar
            ratingColor='#f1c40f' // color stars seleccionadas
            ratingBackgroundColor='lightgrey' // color stars sin seleccion
            tintColor='#f6efd3' // fondo
            imageSize={25}
          /> */}
          </View>

          <View>
            <View style={stylesMap.categoriesView}>
              <Text style={stylesMap.categoriesText}>{resto.category}</Text>
            </View>
          </View>
        </View>

        <View style={stylesMap.btnContainerCard}>
          <View style={stylesMap.btnWsp}>
            <TouchableOpacity onPress={() => handleWhatsapp()}>
              <Image
                style={stylesMap.wspImage}
                // resizeMode="contain"
                source={require("../assets/whatsAppIcon.png")}
              />
            </TouchableOpacity>
          </View>

          <View style={stylesMap.heart}>
            <TouchableOpacity
              onPress={() => {
                // pressed === true && usuario logueado === false ? alert('logeate primero') : //ESTO ES PARA DECIR QUE
                // SI UN USARUIO NO LOGUEADO QUIERE GUARDAR ALGO EN FAVS QUE SE LOGUEE PRIMERO
                hearthColor === "grey"
                  ? addToFavourite()
                  : removeFromFavourite();
              }}
            >
              <Icon
                raised
                name="heart"
                type="antdesign"
                color={hearthColor}
                style={{ border: "1px solid blue" }}
                iconStyle="red"
                size={19}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const stylesMap = StyleSheet.create({
    cardsContainer: {
        alignSelf: "center",
        backgroundColor: "#f2f2f2",
        marginHorizontal: 10,
        marginVertical: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 25,
        width: 250,
        height: 120,
        shadowColor: "#000",
        shadowOffset: {
        width: 12,
        height: 12,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4.84,
        elevation: 5,
    },
    containerImgCard: {
        position: 'absolute',
        top: 10,
        left: -4,
        width: 65,
        maxHeight: "5%",
        padding: 5,
        alignSelf: "flex-start",
        alignItems: "center",
      },
    cardsMapimg: {
        resizeMode: "contain",
        width: 60,
        height: 60,
        borderRadius: 25,
    },
    wspImage: {
        width: 40,
        height: 40,
        borderRadius: 25,
    },
    cardsDescriptionContainer: {
        maxHeight: "120%",
        height: "90%",
        width: "70%",
        alignSelf: "center",
        justifyContent: "space-around",
    },
    cardsMapTitle: {
        marginLeft: 11,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        color: "#161616",
        textTransform: "capitalize"
    },
    categoriesView: {
        position: 'absolute',
        bottom: -15,
        left: 23,
        backgroundColor: "black",
        width: '80%',
        borderRadius: 15,
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderWidth: 1,
    },
    categoriesText: {
        fontSize: 13,
        padding: 1,
        textAlign: "center",
        color: "#ECCEAB",
        textTransform: "capitalize",
        fontWeight: "bold",
    },
    btnContainerCard: {
        maxHeight: "120%",
        height: 120,
        width: "1.6%",
        alignSelf: "flex-end",
        alignItems: "center",
        marginTop: -120,
        justifyContent: "space-around",
    },
    btnWsp: {
        position: 'absolute',
        top: 30,
        right: 5
    },
    heart: {
        position: 'absolute',
        top: 71,
        right: -3
    }
})

export default CardMaps;
