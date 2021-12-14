//----------REACT UTILS-----------
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
//
//----------REDUX UTILS-----------
import { useSelector } from "react-redux";
//
//
//----------REACT-NATIVE UTILS-----------
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Badge, Icon } from 'react-native-elements'
//---------------------GEOLOCATION-------------------
import { GOOGLE_API_KEY } from "@env";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
//----------------------------------------------------
//import DateTimePicker from '@react-native-community/datetimepicker';
//
//
//----------FIREBASE UTILS-----------
import { getAuth } from "firebase/auth";
import { onSnapshot, collection, query, doc, getDoc } from "firebase/firestore";

import firebase from "../database/firebase";
import { MaterialIcons } from "@expo/vector-icons";
//
//
//---------SCREENS & COMPONENTS---------------
import CardMenu from "../components/CardMenu";
import ListReviews from "./ListReviews";
import AddReviewsRestorant from "./AddReviewsRestorant";
//
//
//-------STYLES-------
import globalStyles from "./GlobalStyles";
//
//
//-----------SPINNER + - ----------------------
import InputSpinner from "react-native-input-spinner";
//
//-------INITIALIZATIONS-------
const auth = getAuth();
//
//---------------------------------------------------------------------------------------//
//
const DetailsResto = ({ navigation }) => {
  //--------------------------REVIEWS-------------------------------
  const [reviews, setReviews] = useState();

  //--------------------------MERCADO PAGO--------------------------
  const [precioCabeza, setPrecioCabeza] = useState();
  const [cantLugares, setCantLugares] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMenuVisible, setmodalMenuVisible] = useState(false);
  //--------------------------FILTROS CATEGORY--------------------------
  const [menuArr, setMenuArr] = useState([]);
  const [menuFiltered, setMenuFiltered] = useState([]);
  const [menuHeader, setMenuHeader] = useState("Menu");
  const [menuCategory, setMenuCategory] = useState();
  const empresaDetail = useSelector((state) => state.empresaDetail);
  console.log('Empresa detail: ', empresaDetail)
  //--------------------GEOLOCATION-------------------------------
  const { location } = empresaDetail;
  const [distance, setDistance] = useState({});
  const userLocation = useSelector((state) => state.userCoordinates);
  const mapRef = useRef(null);
  //--------------------------------------------------------------
  const number = "+541168020511";
  //WhatsApp
  // const handleWhatsAppPress = async () => {
  //   await Linking.openURL(
  //     `whatsapp://send?text=Hola RestoBook&phone=${number}`
  //   );
  // };
  const onPressReservar = async (cantLugares, precioCabeza) => {
    const url = await axios({
      method: "POST",
      url: "http://192.168.0.10:19006/checkout",
      data: {
        restoName: empresaDetail.title,
        quantity: cantLugares,
        unit_price: precioCabeza,
      },
    });
    setModalVisible(false);
    navigation.navigate("WebViewScreen", {
      url: url.data,
      cantLugares,
      unitPrice: empresaDetail.reservationsParams?.precioPorLugar
    })
  }
  useEffect(() => {
    if (Object.entries(userLocation).length === 0 || !location) return;
    //Zoom & fit to markers
    mapRef.current.fitToSuppliedMarkers(["userLocation", "restoLocation"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, []);

  const getInfo = () => {
    const q = doc(firebase.db, "Restos", empresaDetail.idResto);
    const unsubscribe = onSnapshot(q, (doc) => {
      let obj = doc.data();
      let categories = obj.menu.map((element) => element.category);
      let categoriesNoRepeat = [...new Set(categories)];
      setMenuCategory(categoriesNoRepeat);
      setMenuArr(obj.menu);
      setReviews(obj.reviews);
    });
  };

  const { timeRange } = empresaDetail?.reservationsParams;
  let horaInicio = timeRange.split("-")[0];
  let horaFin = timeRange.split("-")[1];
  const handleHorarioReserva = () => {
    let horaActual = new Date().getHours();

    //console.log(horaActual, horaInicio, horaFin)
    if (horaActual >= horaInicio && horaActual < horaFin) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const handleCategory = async (category) => {
    if (!category) {
      setMenuFiltered(menuArr);
      setMenuHeader("Menu");
    } else {
      let filtered = menuArr.filter((element) => element.category === category);
      setMenuFiltered(filtered);
      setMenuHeader(category);
    }
  };

  const foodInfo = (target) => {
    let filtered;
    if (target === "vegan") {
      filtered = menuArr.filter((element) => element.vegan === true);
      setMenuFiltered(filtered);
      setMenuHeader("Veggie");
    }
    if (target === "glutenFree") {
      filtered = menuArr.filter((element) => element.glutenFree === true);
      setMenuFiltered(filtered);
      setMenuHeader("Glutenfree");
    }
  };


  return (
    <View style={globalStyles.Home}>
      <View style={globalStyles.headerResto}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            paddingVertical: 3,
            color: "#161616",
            letterSpacing: 1,
            textTransform: "capitalize",
          }}
        >
          {empresaDetail.title}
        </Text>
            <Badge status={handleHorarioReserva() ? "success" : "error"}   containerStyle={{ position: 'absolute', top: 20, right: 15}}/>
      </View>

    <ScrollView style={globalStyles.Home}>
      <View style={globalStyles.descriptionRestoContainer}>
        <Text  style={globalStyles.textoDescription}>{empresaDetail.description}</Text>
        <Text style={globalStyles.textoDescription}>
                <Icon
                  reverse
                  name="phone-alt"
                  type="font-awesome-5"
                  color="#eecdaa"
                  reverseColor="#161616"
                  size={11}
                />
                {empresaDetail.phone}
        </Text>
        <Text style={globalStyles.textoDescription}>
                <Icon
                  reverse
                  name="map-marker-alt"
                  type="font-awesome-5"
                  color="#eecdaa"
                  reverseColor="#161616"
                  size={11}
                />
                {empresaDetail.location.address},
        </Text>
      </View>
        <View onTouchStart={() => setmodalMenuVisible(!modalMenuVisible)}>
          <TouchableOpacity style={globalStyles.btnDetail}>
            <Text style={globalStyles.btnTextFiltro}>
              <MaterialIcons
                name="restaurant"
                size={20}
                color="#161616"
              ></MaterialIcons>{" "}
              Ver Menu
            </Text>
          </TouchableOpacity>
        </View>

        {handleHorarioReserva() ? (
          <View onTouchStart={() => setModalVisible(!modalVisible)}>
            <TouchableOpacity style={globalStyles.btnDetail}>
              <Text style={globalStyles.btnTextFiltro}>
                <MaterialIcons
                  name="payment"
                  size={20}
                  color="#161616"
                ></MaterialIcons>{" "}
                Quiero Reservar!
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity style={globalStyles.btnDetail}>
              <Text style={globalStyles.btnTextFiltro}>
                <MaterialIcons
                  name="block"
                  size={20}
                  color="#161616"
                ></MaterialIcons>{" "}
                {horaInicio && horaFin
                  ? `El horario de Reserva es de ${horaInicio} a ${horaFin}`
                  : "No hay Horario de Reserva"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.googleMapsContainer}>
          <MapView
            ref={mapRef}
            style={styles.googleMaps}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.004757,
              longitudeDelta: 0.006866,
            }}
          >
            <Marker
              title={empresaDetail.title}
              pinColor="#0072B5"
              coordinate={location}
              description={`Distancia: ${distance.distance} Km - ETA: ${distance.ETA} Min`}
              identifier="restoLocation"
            ></Marker>

            {Object.entries(userLocation).length > 0 && (
              <Marker
                title="Your Location"
                coordinate={userLocation}
                pinColor="#0072B5"
                identifier="userLocation"
              />
            )}
           { Object.entries(userLocation).length > 0 && location && (
            <MapViewDirections
              lineDashPattern={[0]}
              apikey={GOOGLE_API_KEY}
              strokeWidth={1.5}
              strokeColor="brown"
              origin={userLocation}
              destination={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              onReady={ resultado => {
                const { distance, duration } = resultado;
                const travelTime = Math.round(duration)
                // const distanceSpliteado = distance.split('.')
                // console.log(distanceSpliteado)
                const travelDistance = distance.toString().slice(0, 4)
                setDistance({distance: travelDistance, ETA: travelTime})
              }}
              />
            )}
          </MapView>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <TouchableOpacity
                style={globalStyles.btnTodasComidas}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text
                  style={globalStyles.texts}
                  onPress={() => setModalVisible(false)}
                >
                  {" "}
                  X{" "}
                </Text>
              </TouchableOpacity>
              <Text style={globalStyles.modalText}>
                Selecciona la cantidad de lugares
              </Text>

              <InputSpinner
                style={{
                  maxWidth: "100%",
                  width: "65%",
                  marginVertical: 10,
                }}
                value={cantLugares}
                max={50}
                min={1}
                buttonFontSize={25}
                onChange={(num) => setCantLugares(num)}
                skin="clean"
                colorPress="#eccdaa"
                background="#f2f2f2"
                colorAsBackground={true}
                fontSize={20}
              />

              <Text style={globalStyles.modalText}>
                Precio por Persona $
                {empresaDetail.reservationsParams?.precioPorLugar}
              </Text>
              <TouchableOpacity
                style={globalStyles.btnLogin}
                onPress={() =>
                  onPressReservar(
                    cantLugares,
                    empresaDetail.reservationsParams?.precioPorLugar
                  )
                }
              >
                <Text style={globalStyles.texts}>
                  Completar reserva por $
                  {cantLugares *
                    empresaDetail.reservationsParams?.precioPorLugar}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*----------------------------Nuevo Modal Menu------------------------------------ */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalMenuVisible}
          onRequestClose={() => {
            setmodalMenuVisible(!modalMenuVisible);
          }}
        >
          <View style={globalStyles.centeredMenuView}>
            <View style={globalStyles.modalMenuView}>
              <TouchableOpacity
                style={globalStyles.btnCloseMenu}
                onPress={() => setmodalMenuVisible(!modalMenuVisible)}
              >
                <MaterialIcons
                  onPress={() => setmodalMenuVisible(false)}
                  name="arrow-back-ios"
                  size={20}
                  color="#161616"
                ></MaterialIcons>
              </TouchableOpacity>
              <Text style={globalStyles.modalMenuText}>{menuHeader}</Text>
              <View style={styles.categoriesFilterContainer}>
                {menuArr.length ? (
                  <View style={globalStyles.categoriesViewDetail} key={"empty"}>
                    <TouchableOpacity onPress={() => foodInfo("vegan")}>
                      <Text style={globalStyles.categoriesText}>Vegan</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {menuArr.length ? (
                  <View style={globalStyles.categoriesViewDetail} key={"vegan"}>
                    <TouchableOpacity onPress={() => handleCategory()}>
                      <Text style={globalStyles.categoriesText}>Limpiar</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {menuArr.length ? (
                  <View
                    style={globalStyles.categoriesViewDetail}
                    key={"glutenFree"}
                  >
                    <TouchableOpacity onPress={() => foodInfo("glutenFree")}>
                      <Text style={globalStyles.categoriesText}>Sin TACC</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
              <View style={styles.categoriesContainer}>
                {menuCategory?.map((categoria) => {
                  return (
                    <View
                      style={globalStyles.categoriesViewDetail}
                      key={`${categoria}_${Math.random()}`}
                    >
                      <TouchableOpacity
                        onPress={() => handleCategory(categoria)}
                      >
                        <Text style={globalStyles.categoriesText}>
                          {categoria}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>

              {menuArr.length > 0 ? (
                <ScrollView style={styles.showMenu}>
                  {menuFiltered.length
                    ? menuFiltered.map((menu, index) => {
                        return (
                          <CardMenu key={index} menu={menu}>
                            {" "}
                          </CardMenu>
                        );
                      })
                    : menuArr.map((menu, index) => {
                        return (
                          <CardMenu key={index} menu={menu}>
                            {" "}
                          </CardMenu>
                        );
                      })}
                </ScrollView>
              ) : (
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 30,
                    marginVertical: 30,
                  }}
                >
                  {" "}
                  Menu No Disponible!
                </Text>
              )}

              {/* <InputSpinner
                style={{
                  maxWidth: "100%",
                  width: "65%",
                  marginVertical: 10,
                }}
                value={cantLugares}
                max={50}
                min={1}
                buttonFontSize={25}
                onChange={(num) => setCantLugares(num)}
                skin="clean"
                colorPress="#eccdaa"
                background="#f2f2f2"
                colorAsBackground={true}
                fontSize={20}
              />

              <Text style={globalStyles.modalText}>
                Precio por Lugar $
                {empresaDetail.reservationsParams?.precioPorLugar}
              </Text>
              <TouchableOpacity
                style={globalStyles.btnLogin}
                onPress={() =>
                  onPressReservar(
                    cantLugares,
                    empresaDetail.reservationsParams?.precioPorLugar
                  )
                }
              >
                <Text style={globalStyles.texts}>
                  Completar reserva por $
                  {cantLugares *
                    empresaDetail.reservationsParams?.precioPorLugar}
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </Modal>
      </ScrollView >
        <View style={styles.listReviews}>
          <ListReviews navigation={navigation} reviews={reviews} />
        </View>
    </View >
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
  },
  titleContainer: {
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "skyblue",
  },
  title: {
    padding: 10,
    fontWeight: "bold",
    fontSize: 30,
    color: "#333",
    letterSpacing: 1,
  },

  categoriesContainer: {
    width: "100%",
    height: 33,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 20,
    margin: 5,
  },
  categoriesFilterContainer: {
    width: "50%",
    height: 33,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 20,
    margin: 5,
  },
  showMenu: {
    width: "100%",
    height: 250,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
  },
  googleMapsContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 50,
  },
  googleMaps: {
    height: 250,
    borderRadius: 100,
  },
  wppIcon: {
    height: 30,
    marginLeft: 10,
    borderRadius: 10,
    width: 40,
    backgroundColor: "#ffd964",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#b39138",
  },
  img: {
    margin: 5,
    height: 20,
    width: 20,
    alignItems: "center",
  },
  textContainer2: {
    alignSelf: "center",
    justifyContent: "center",
    width: "60%",
    borderRadius: 10,
    borderWidth: 3,
    marginTop: 10,
    backgroundColor: "#ffd964",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
    //backgroundColor: "blur",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    height: "90%",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 100,
  },
});

export default DetailsResto;
