import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AirbnbRating,
  Rating,
  Card,
  Text,
  Icon,
  Badge,
} from "react-native-elements";
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
import globalStyles from "../Screens/GlobalStyles.js";
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

const CardMenu = ({ resto, navigation }) => {
  // const userFavourites = useSelector((state) => state.favourites);
  const [userFavourites, setUserFavourites] = useState();
  const CurrentId = useSelector((state) => state.currentId);
  const [hearthColor, setHearthColor] = useState("grey");
  const [resultRating, setResultRating] = useState(0);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categoriesResto);
  const isFocused = useIsFocused();

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

  useEffect(() => {
    console.log("84 cardHome");
    getFavs();
  }, [CurrentId]);

  let infoFavourite = {
    idResto: resto.idResto,
    title: resto.title,
    phone: resto.phone,
    location: resto.location,
    img: resto.restoImage,
    description: resto.description,
    reservationsParams: resto.reservationsParams,
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
        // console.log("consolelog en InfoFavourite: ", infoFavourite);
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

  let horaInicio = resto.reservationsParams
    ? resto.reservationsParams.timeRange.split("-")[0]
    : null;
  let horaFin = resto.reservationsParams.timeRange
    ? resto.reservationsParams.timeRange.split("-")[1]
    : null;
  //console.log(resto.title, horaFin)
  const handleHorarioReserva = () => {
    let horaActual = new Date().getHours();
    //console.log(horaActual, horaInicio, horaFin)
    if (horaActual >= horaInicio && horaActual < horaFin) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <View style={globalStyles.cardsContainer}>
      <Badge
        status={handleHorarioReserva() ? "success" : "error"}
        containerStyle={{ position: "absolute", top: 25, left: 20 }}
      />
      <TouchableOpacity onPress={() => handleOnPress({ resto })}>
        <View style={globalStyles.containerImgCard}>
          <Image
            style={globalStyles.cardsHomeimg}
            source={{
              uri: CLOUDINARY_CONSTANT + resto.restoImage,
            }}
          />
        </View>

        <View style={globalStyles.cardsDescriptionContainer}>
          <View>
            <Text style={globalStyles.cardsHomeTitle}>{resto.title}</Text>
          </View>

          <View>
            <AirbnbRating
              showRating={false}
              size={20}
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
            <View style={globalStyles.categoriesView}>
              <Text style={globalStyles.categoriesText}>{resto.category}</Text>
            </View>
          </View>
        </View>

        <View style={globalStyles.btnContainerCard}>
          <View>
            <TouchableOpacity onPress={() => handleWhatsapp()}>
              <Image
                style={globalStyles.wspImage}
                // resizeMode="contain"
                source={require("../assets/whatsAppIcon.png")}
              />
            </TouchableOpacity>
          </View>

          <View>
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
                style={{ border: "solid 1px blue" }}
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

export default CardMenu;
