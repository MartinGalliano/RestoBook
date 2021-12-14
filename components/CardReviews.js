import React, { useState, useEffect } from "react";
import { Card, Text, AirbnbRating } from "react-native-elements";
import { View, Image, StyleSheet } from "react-native";
import globalStyles from "../Screens/GlobalStyles";
import { useSelector } from "react-redux";
import firebase from "../database/firebase";
import moment from "moment/min/moment-with-locales";
import { getAuth } from "firebase/auth";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

const auth = getAuth();
import { CLOUDINARY_CONSTANT, DEFAULT_PROFILE_IMAGE } from "@env";
export default function CardReviews({ reseña }) {
  const createReview = new Date(reseña.createAt.seconds * 1000)
  const [rating, setRating] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState(null);

  const getImage = async () => {
    const docRef = doc(firebase.db, "Users", reseña.idUser);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let obj = docSnap.data();
      let img = obj.profileImage;
      setUserProfileImage(img);
    }
  };
  useEffect(() => {
    getImage();
    // console.log(
    //   `${reseña.review} =>`,
    //   new Date(reseña.createAt.seconds * 1000)
    // );
    console.log("reseña", moment(reseña.createAt.seconds * 1000).format("LLL"));
  }, []);


  return (
    <View style={styles.cardsMenuContainer}>
      <View style={styles.cardsImg}>
        <Image
          style={styles.img}
          source={
            userProfileImage
              ? { uri: CLOUDINARY_CONSTANT + userProfileImage }
              : { uri: CLOUDINARY_CONSTANT + DEFAULT_PROFILE_IMAGE }
          }

        />
      </View>
      <View style={styles.viewInfo}>
        <AirbnbRating
          count={5}
          size={10}
          defaultRating={reseña.rating}
          showRating={false}
        ></AirbnbRating>
        <Text style={styles.cardsMenuTitle}>{reseña.review}</Text>
        <View></View>
      </View>
      <View style={styles.cardDate}>
        <Text style={styles.date}>
          {moment(reseña.createAt.seconds * 1000).format("LLL")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardsImg: {
    width: "15.6%",
    flex: 1,
    padding: 1,
    justifyContent: "space-between",
    alignSelf: "flex-start",
  },
  img: {
    width: 60,
    borderRadius: 7,
    height: 60,
  },
  cardsMenuContainer: {
    marginTop: 20,
    flex: 1,
    height: 80,
    padding: 7,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
    width: "100%",
    justifyContent: "space-around",
  },
  viewInfo: {
    marginBottom: 30,
    alignSelf: "center",
    width: "50.6%",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  viewRating: {
    backgroundColor: "#f2f2f2",
    justifyContent: "flex-start",
  },
  cardsMenuTitle: {
    justifyContent: "flex-start",
    fontWeight: "bold",
    fontSize: 12,
  },
  cardDate: {
    width: "100%",
    justifyContent: "flex-end",
  },
  date: {
    marginLeft: 270,
    color: "grey",
    fontSize: 10,
  },
});
