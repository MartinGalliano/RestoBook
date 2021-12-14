import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Input, Button, AirbnbRating, } from "react-native-elements";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { isEmpty } from "lodash";
//----------FIREBASE UTILS-----------
import firebase from "../database/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import globalStyles from "./GlobalStyles";
import { Card } from "react-native-elements/dist/card/Card";

export default function AddReviewsRestorant({ navigation, route }) {
  const { nameResto } = route.params

  const currentUser = useSelector((state) => state.currentUser);
  const empresaDetail = useSelector((state) => state.empresaDetail);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [errorReview, setErrorReview] = useState(null);

  const addReview = async () => {
    if (!validForm()) {
      return;
    }
    const newValues = {
      idUser: currentUser.id,
      fotoUser: currentUser.profileImage,
      idResto: empresaDetail.idResto,
      review: review,
      rating: rating,
      createAt: new Date(),
    };

    try {
      console.log("New Values =>", newValues)
      let restoRef = doc(firebase.db, "Restos", empresaDetail.idResto);
      await updateDoc(restoRef, {
        reviews: arrayUnion(newValues),
      });
      navigation.goBack();
    } catch (err) {
      console.log(err);
    }
  };
  const validForm = () => {
    setErrorReview(null);
    let isValid = true;
    if (isEmpty(review)) {
      setErrorReview("Completá tu comentario", 3000);
      isValid = false;
    }
    return isValid;
  };
  return (
    <View style={styles.container}>
      <Text style={{
        color: "#000",
        textAlign: "center",
        width: "100%",
        fontSize: 25,
        fontWeight: "bold",
        // marginBottom: -10,
        paddingVertical: 1,
      }}>{nameResto}</Text>

      <View>
        <View style={styles.viewRating}>
          <AirbnbRating
            count={5}
            reviews={["Malo", "Regular", "Normal", "Bueno", "Excelente"]}
            defaultRating={0}
            size={15}
            onFinishRating={(value) => setRating(value)}
          ></AirbnbRating>
        </View>
          <TextInput
            placeholder="  Tu opinion..."
            placeholderTextColor="#666"
            textAlign="center"
            fontSize={15}
            containerStyle={styles.containerInput}
            style={globalStyles.inputComponent}
            onChange={(e) => setReview(e.nativeEvent.text)}
          />
        {/* <Button
                title="Enviar Comentario"
                containerStyle={styles.containerButon}
                style={globalStyles.btnFiltrosHome}
                onPress={addReview}
                >
            </Button> */}
            <View style={styles.buton}>
             <TouchableOpacity 
                      style={globalStyles.btnFiltrosHome}
                      onPress={addReview}
                      errorMessage={errorReview}
                      >
                          <Text style={globalStyles.texts}>Escribe una opinion</Text>
                      </TouchableOpacity>
            </View>
            </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2",
    marginTop: 100,
    marginBottom: 2,
  },
  containerInput: {
  },
  input: {
  },
  buton: {
    padding: 30,
    marginTop: 20
  },
});
