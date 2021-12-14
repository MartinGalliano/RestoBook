import React, { useState, useEffect } from "react";
import { Card, Text, Badge } from "react-native-elements";
import { View, Image, StyleSheet, TouchableOpacity, Touchable } from "react-native";
import TeamOutlined from 'react-native-vector-icons/AntDesign'
import globalStyles from "../Screens/GlobalStyles";
import { getAuth } from "firebase/auth";
import { Icon } from 'react-native-elements';




const auth = getAuth();

const CardReservation = ({ date, cantCupos, nameResto, statusReserva, address, navigation, idResto }) => {

  const restos = [];

  // const celphone = "+54 9" + "NUMERO RESTO";
  // const trimmedName = auth?.currentUser?.email?.split("@")[0];
  // const handleWhatsapp = async () => {
  //   await Linking.openURL(
  //     `whatsapp://send?text=Hola ${nameResto}, mi nombre es ${trimmedName} y quiero generar una reserva&phone=${'+5492477313700'}`
  //   );
  // };


  return (
    <View style={globalStyles.cardsContainer}>
      <View>
        <Text style={globalStyles.cardsHomeTitle}>{nameResto}</Text>
        <Card.Divider
          orientation="horizontal"
          width={1.5}
          inset={true}
          insetType={"middle"}
          color={"#0005"}
        />
        <Text style={{ textAlign: "center", marginTop: -10, fontSize: 15 }}>{address.split(",")[0]}</Text>
      </View>
      <View style={styles.descriptionContainer}>
        <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Text style={{ marginVertical: 5 }}>{date}</Text>
          <Text style={{ marginVertical: 5 }}>{statusReserva}</Text>
          <Badge status={statusReserva === "approved" ? "success" : "warning"} />
        </View>

        <View style={{}}>
          <Text><TeamOutlined name='team' color="#161616" size={20} />{cantCupos}</Text>
        </View>

        <View style={{ flexDirection: "column" }}>

          <TouchableOpacity
            style={{ marginVertical: 5 }}
            onPress={() => navigation.navigate("AddReviewsRestorant", {
              nameResto: nameResto,
            })}
          >
            <Text>Crear Reseña</Text>
            <Icon name='square-edit-outline' type='material-community' color='#161616' size={25} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => handleWhatsapp()}>
            <Image
              style={globalStyles.wspImage}
              // resizeMode="contain"
              source={require("../assets/whatsAppIcon.png")}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
    marginVertical: -8,
    alignItems: "center",
    justifyContent: "space-around"
  },
})

export default CardReservation;