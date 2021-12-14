import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
//-----STYLES----------
import globalStyles from "../Screens/GlobalStyles.js";
//------ICONS----------
import { Icon } from "react-native-elements";
//------ACTIONS---------
import empresaDetail from "../Redux/Actions/empresaDetail.js";
//-----FIREBASE---------
import firebase from "../database/firebase";
import { getAuth } from "firebase/auth";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

import { CLOUDINARY_CONSTANT } from "@env";

const auth = getAuth();

const CardFavourite = ({
  resto,
  navigation,
  setMyFavourites,
  myFavourites,
}) => {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const [hearthColor, setHearthColor] = useState("red");
  
  console.log('Resto in cardFavourites: ', resto)
  let infoFavourite = {
    idResto: resto.idResto,
    title: resto.title,
    phone: resto.phone,
    location: resto.location,
    img: resto.img,
    description: resto.description,
    reservationsParams: resto.reservationsParams
  };

  const handleOnPress = () => {
    console.log("resto", resto);

    dispatch(empresaDetail(resto));

    navigation.navigate("DetailsResto");
  };

  const removeFromFavourite = async () => {
    if (auth?.currentUser?.uid) {
      try {
        //console.log("info en prof", infoFavourite);
        setDeleting(true);
        setHearthColor("grey");
        let modifiedFavs = myFavourites.filter(
          (element) => element.idResto !== infoFavourite.idResto
        );
        // console.log(modifiedFavs);
        setMyFavourites(modifiedFavs);
        let docRef = doc(firebase.db, "Users", auth.currentUser.uid);
        await updateDoc(docRef, {
          favourites: arrayRemove(infoFavourite),
        });
      } catch (e) {
        console.log("error remove:", e);
      }
      setDeleting(false);
    }
  };

  return (
    <View style={globalStyles.cardsFavouriteContainer}>
      <TouchableOpacity onPress={() => handleOnPress()}>
        <View style={globalStyles.containerImgCard}>
          <Image
            style={globalStyles.cardsHomeimg}
            source={{ uri: CLOUDINARY_CONSTANT + resto.img }}
            resizeMode="contain"

          />
        </View>

        <View style={globalStyles.cardsDescriptionContainer}>
          <View>
            {deleting ? (
              <ActivityIndicator
                size="large"
                color="#5555"
              // style={globalStyles.imgProfile}
              />
            ) : (
              <Text style={globalStyles.cardsHomeTitle}>{resto.title}</Text>
            )}
          </View>


          <View style={{ margin: 5 }}>
            <Text style={globalStyles.cardsDescriptionText}>
              <Icon
                reverse
                name="map-marker-alt"
                type="font-awesome-5"
                color="#eecdaa"
                textAlign="beseline"
                reverseColor="#161616"
                size={11}
              />
              {resto.location.address.split(",")[0]},
              {resto.location.address.split(",")[1]}
            </Text>

            <Text style={globalStyles.cardsDescriptionText}>
              <Icon
                reverse
                name="phone-alt"
                type="font-awesome-5"
                color="#eecdaa"
                reverseColor="#161616"
                size={11}
              />
              {resto.phone}
            </Text>
          </View>
        </View>


        <View style={globalStyles.btnContainerCard}>
          <View>
            <TouchableOpacity
              onPress={() => {
                hearthColor === "red" ? removeFromFavourite() : null;
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

export default CardFavourite;
