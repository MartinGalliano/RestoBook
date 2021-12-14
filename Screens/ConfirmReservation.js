//`Hola ${nombre del resto}, mi nombre es ${nombre del usuario}. Acabo de reservar ${lugares} lugares a traves de RestoBook, mi token de reserva es ${id de reserva}`

//----------REACT UTILS-----------
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { Icon } from 'react-native-elements'
import { useSelector } from "react-redux";

const ConfirmReservation = ({ route, navigation }) => {
  // initialize timeLeft with the seconds prop
  const { empresa, lugares, idReserva } = route.params;
  const currentUser = useSelector( state => state.currentUser)
  const [timeLeft, setTimeLeft] = useState(5);

  const handleWhatsapp = async () => {
    const celphone = "+54 9" + empresa.phone
    await Linking.openURL(
      `whatsapp://send?text=Hola ${empresa.title}, mi nombre es ${currentUser.name}. Acabo de reservar lugar para ${lugares} personas a traves de RestoBook, mi token de reserva es ${idReserva}&phone=${celphone}`
    );
    navigation.navigate("RestoBook")
  };

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) {
      handleWhatsapp()
      return;
    }

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  return (
    <View style={{padding: 10}}>
      <View style={styles.caja}>
        <Text style={styles.title}> GRACIAS POR RESERVAR CON RESTOBOOK ! </Text>
      </View>
      <View style={styles.caja}>
        <Text style={styles.description}>EN BREVE SERAS REDIRIGIDO PARA PODER COMUNICARTE CON EL NEGOCIO VIA WHATSAPP <Icon name='whatsapp' type='material-community' /> </Text>
      </View>
      <View style={styles.caja}>
        <Text style={styles.description}>Redirigiendo en <Text style={{color: 'blue', fontSize: 24}}>{timeLeft}...</Text> <Icon name='timer' type='material-community'/> </Text>
      </View>
      <View style={styles.caja}>
        <Text style={styles.description}> Te enviamos un mail con la confirmacion y datos de tu Reserva !</Text>
      </View>
    </View>
  )

}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign:'center'
  },
  description: {
    fontSize: 17,
    textAlign: 'center'
  },
  caja: { 
    fontFamily: 'sans-serif', 
    fontSize: 18,
    padding: 10,
    fontWeight: '400', 
    backgroundColor:'transparent',
  }
})


export default ConfirmReservation;
