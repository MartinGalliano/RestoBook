//----------REACT UTILS-----------
import React, { useEffect, useRef, useState } from "react";
//
//
//----------REDUX UTILS-----------
import { useDispatch, useSelector } from "react-redux";
//
//
//----------REACT-NATIVE UTILS-----------
import {
  Button,
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
//
//----------FORMIK y YUP------------------
import { Formik } from "formik";
import * as yup from "yup";
//
//
//----------GOOGLE MAPS---------------
import MapView, { Marker } from "react-native-maps";
import { GOOGLE_API_KEY } from "@env";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
//
//
//----------FIREBASE UTILS-----------
import firebase from "../database/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  doc,
  onSnapshot,
  collection,
  query,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
//
//
//---------------------EXPO----------------------
import * as Location from "expo-location";
//---------SCREENS & COMPONENTS---------------
//
//
//-------STYLES-------
import globalStyles from "./GlobalStyles";
import { BottomSheet, ListItem } from "react-native-elements";
//
//------IMAGINE PICKER---------
import SetCommerce from "../Redux/Actions/setCommerce";
import { init } from "emailjs-com";
init("user_IEK9t1hQIR3ugtExEH6BG");

//
//
//-------INITIALIZATIONS-------
const auth = getAuth();
import { DEFAULT_RESTO_IMAGE } from "@env";
//
//---------------------------------------------------------------------------------------//
//

const registerRestoSchema = yup.object({
  email: yup.string().required("Por favor, ingresa un email"),
  title: yup
    .string()
    .required("El titulo debe tener entre 3 y 25 caracteres.")
    .min(3)
    .max(25),
  description: yup
    .string()
    .required("La descripcion debe tener entre 10 y 100 caracteres.")
    .min(10)
    .max(100),
  phone: yup.number().required("Por favor, ingresá un telefono con Whatsapp"),
  phone2: yup.number(),
  cuit: yup.number().required("Por favor, ingresá tu CUIT/CUIL"),
});

const RegisterResto = ({ navigation }) => {
  const currentId = useSelector((state) => state.currentId);
  const [currentUser, setcurrentUser] = useState({});
  useEffect(() => {
    const getInfo = async () => {
      const docRef = doc(firebase.db, "Users", currentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let obj = docSnap.data();
        setcurrentUser(obj);
      } else {
        alert("NO HAY INFO");
      }
    };
    getInfo();
  }, []);

  const initialRegion = {
    latitude: -34.61315,
    longitude: -58.37723,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const dispatch = useDispatch();
  const empresaDetail = useSelector((state) => state.empresaDetail);
  const [isVisible, setIsVisible] = useState(false);

  //-------------GEOLOCATION-------------
  const userCoordinates = useSelector((state) => state.userCoordinates);
  const [userLocation, setUserLocation] = useState(
    userCoordinates || initialRegion
  );
  const [restoLocation, setRestoLocation] = useState();
  const [state, setState] = useState({
    lat: -34.61315,
    lng: -58.37723,
    address: "",
    category: "",
  });
  const mapRef = useRef(null);
  //----------------------------------------
  const categories = useSelector((state) => state.categoriesResto);

  let id = null;
  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      id = usuarioFirebase.uid;
    }
  });

  useEffect(() => {
    const getUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      console.log("Location permissions granted");
      let { coords } = await Location.getCurrentPositionAsync();
      const userRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.004757,
        longitudeDelta: 0.006866,
      };
      setUserLocation(userRegion);
    };
    getUserLocation();
  }, []);

  useEffect(() => {
    if (!userLocation || !restoLocation) return;
    //Zoom & fit to markers
    mapRef.current.fitToSuppliedMarkers(["userLocation", "restoLocation"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [userLocation, restoLocation]);

  const setStateAndRegion = (newLocation, formatedAddress) => {
    const { lat, lng } = newLocation;
    setRestoLocation({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.004757,
      longitudeDelta: 0.006866,
    });
    setState({
      ...state,
      address: formatedAddress,
      lat: lat,
      lng: lng,
    });
  };

  return (
    <View style={globalStyles.Home}>
      <View
        style={{
          // backgroundColor: '#e8b595',
          width: "80%",
          alignSelf: "center",
          marginTop: 10,
          // borderRadius: 15,
          maxWidth: "100%",
        }}
      >
        <GooglePlacesAutocomplete
          placeholder="Completa tu direccion"
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          enablePoweredByContainer={false}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
          minLength={3}
          onPress={(data, details = null) =>
            setStateAndRegion(
              details.geometry.location,
              details.formatted_address
            )
          }
          fetchDetails={true}
          styles={{
            container: {
              flex: 0,
              borderRadius: 10,
              width: "75%",
              backgroundColor: "#e8e8e8",
              padding: 0,
              alignSelf: "center",
            },
            textInput: {
              marginTop: 4,
              fontSize: 14.5,

              fontWeight: "bold",
              width: "80%",
              backgroundColor: "rgba(22, 22, 22, .2)",
              borderRadius: 10,
              textAlign: "center",
              overflow: "hidden",
            },
            textInputContainer: {
              alignItems: "center",
              height: 30,
              overflow: "hidden",
              borderRadius: 10,
            },
            listView: {
              borderRadius: 15,
              backgroundColor: "#161616",
              // borderRadius: 25,
            },
            description: {},
            row: {
              backgroundColor: "#eccdaa",
              // borderRadius: 25,
            },
          }}
        />
      </View>

      <Formik
        initialValues={{
          email: "",
          title: "",
          description: "",
          phone: "",
          phone2: "",
          cuit: "",
          category: state.category,
          //img: "",
          lat: "",
          lng: "",
          address: "",
        }}
        validationSchema={registerRestoSchema}
        onSubmit={(values) => {
          if (id) {
            try {
              firebase.db
                .collection("Restos")
                .doc()
                .set({
                  idUser: id,
                  email: values.email.toLowerCase(),
                  title: values.title.toLowerCase(),
                  description: values.description.toLowerCase(),
                  phone: values.phone,
                  phone2: values.phone2,
                  cuit: values.cuit,
                  category: state.category.toLowerCase(),
                  // img: values.img,
                  restoImage: DEFAULT_RESTO_IMAGE,
                  menu: [],
                  quantityVoting: 0,
                  ratingTotal: 0,
                  ratingResult: 0,
                  reservations: [],
                  location: {
                    latitude: state.lat,
                    longitude: state.lng,
                    address: state.address.toLowerCase(),
                  },
                  reviews: [],
                  reservationsParams: {
                    places: 1,
                    precioPorLugar: 100,
                    timeRange: "0-24",
                  },
                  commerceTimeRange: "0-24",
                })
                .then(
                  currentUser.commerce
                    ? firebase.db.collection("Users").doc(id).update({
                        multiCommerce: true,
                      })
                    : firebase.db.collection("Users").doc(id).update({
                        commerce: true,
                      })
                )

                .then(dispatch(SetCommerce()))
                .then(navigation.navigate("RestoBook"));
            } catch (error) {
              console.log(error);
            }
          } else {
            alert("logueate!!");
          }
        }}
      >
        {(props) => (
          <View>
            <ScrollView>
              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Email"
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                  onBlur={props.handleBlur("email")}
                />
              </View>

              {props.touched.email && props.errors.email ? (
                <Text style={globalStyles.errorText}>{props.errors.email}</Text>
              ) : null}

              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Titulo"
                  onChangeText={props.handleChange("title")}
                  value={props.values.title}
                  onBlur={props.handleBlur("title")}
                />
              </View>

              {props.touched.title && props.errors.title ? (
                <Text style={globalStyles.errorText}>{props.errors.title}</Text>
              ) : null}

              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Descripcion"
                  onChangeText={props.handleChange("description")}
                  value={props.values.description}
                  onBlur={props.handleBlur("description")}
                />
              </View>

              {props.touched.description && props.errors.description ? (
                <Text style={globalStyles.errorText}>
                  {props.errors.description}
                </Text>
              ) : null}

              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Numero de whatsapp"
                  onChangeText={props.handleChange("phone")}
                  value={props.values.phone}
                  onBlur={props.handleBlur("phone")}
                  keyboardType="numeric"
                />
              </View>

              {props.touched.phone && props.errors.phone ? (
                <Text style={globalStyles.errorText}>{props.errors.phone}</Text>
              ) : null}

              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Telefono 2"
                  onChangeText={props.handleChange("phone2")}
                  value={props.values.phone2}
                  onBlur={props.handleBlur("phone2")}
                  keyboardType="numeric"
                />
              </View>

              {props.touched.phone2 && props.errors.phone2 ? (
                <Text style={globalStyles.errorText}>
                  {props.errors.phone2}
                </Text>
              ) : null}

              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="CUIT/CUIL"
                  onChangeText={props.handleChange("cuit")}
                  value={props.values.cuit}
                  onBlur={props.handleBlur("cuit")}
                  keyboardType="numeric"
                />
              </View>

              {props.touched.cuit && props.errors.cuit ? (
                <Text style={globalStyles.errorText}>{props.errors.cuit}</Text>
              ) : null}

              <Pressable onPress={() => setIsVisible(true)}>
                <View style={globalStyles.inputComponent}>
                  <TextInput
                    style={globalStyles.texts}
                    editable={false}
                    placeholder="Selecciona categoria de local"
                    value={state.category}
                    onPressIn={() => setIsVisible(true)}
                  />
                </View>
              </Pressable>

              <View style={{ alignItems: "center" }}>
                {/* <TouchableOpacity
                  style={globalStyles.touchLog}
                  onPress={() => {
                    handleOnPressPickImage(props.handleChange("img"));
                  }}
                >
                  <Text style={globalStyles.fontLog}>
                    {props.values.img && props.values.img.length > 0
                      ? "Change Image"
                      : "Select Image"}
                  </Text>
                </TouchableOpacity> */}
              </View>

              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={globalStyles.btnLogin}
                  onPress={() => props.handleSubmit()}
                >
                  <Text style={globalStyles.texts}>Crear</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>

      <View style={globalStyles.inputComponent}>
        <BottomSheet
          isVisible={isVisible}
          containerStyle={{ backgroundColor: "#333a" }}
        >
          {categories.map((categoria, index) => (
            <ListItem
              key={index}
              containerStyle={{ backgroundColor: "rgba(251, 245, 245,0.8)" }}
              style={{
                borderBottomWidth: 1,
                borderColor: "#161616",
                backgroundColor: "#fff0",
              }}
              onPress={() => {
                setState({ ...state, category: categoria });
                setIsVisible(false);
              }}
            >
              <ListItem.Content
                style={{ backgroundColor: "#0000", alignItems: "center" }}
              >
                <ListItem.Title
                  style={{
                    height: 35,
                    color: "#161616",
                    paddingVertical: 5,
                    fontWeight: "bold",
                  }}
                >
                  {categoria}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
          <ListItem
            key={999}
            containerStyle={{ backgroundColor: "#eccdaa" }}
            style={{ borderBottomWidth: 1, borderColor: "#ffff" }}
            onPress={() => setIsVisible(false)}
          >
            <ListItem.Content style={{ alignItems: "center" }}>
              <ListItem.Title
                style={{ height: 35, color: "#161616", fontSize: 20 }}
              >
                Cancelar
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </BottomSheet>
      </View>

      <View style={{ flex: 3 }}>
        <View style={styles.googleMapsContainer}>
          <MapView ref={mapRef} style={styles.googleMaps} region={userLocation}>
            {userLocation && (
              <Marker
                draggable
                title="Your location"
                coordinate={userLocation}
                onDragEnd={(event) => {
                  const { latitude, longitude } = event.nativeEvent.coordinate;
                  const newLocation = {
                    lat: latitude,
                    lng: longitude,
                  };
                  setStateAndRegion(newLocation);
                }}
                pinColor="#eccdaa"
                identifier="userLocation"
              />
            )}
            {restoLocation && (
              <Marker
                draggable
                title="Resto location"
                coordinate={restoLocation}
                onDragEnd={(event) => {
                  const { latitude, longitude } = event.nativeEvent.coordinate;
                  const newLocation = {
                    lat: latitude,
                    lng: longitude,
                  };
                  setStateAndRegion(newLocation);
                }}
                pinColor="#0072B5"
                identifier="restoLocation"
              />
            )}
            {userLocation && restoLocation && (
              <MapViewDirections
                lineDashPattern={[0]}
                apikey={GOOGLE_API_KEY}
                strokeWidth={1.5}
                strokeColor="gray"
                origin={userLocation}
                destination={restoLocation}
              />
            )}
          </MapView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  inputGroup: {
    height: 15,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  googleMapsContainer: {
    padding: 5,
  },
  googleMaps: {
    borderColor: "#034F84",
    borderWidth: 1,
    borderRadius: 50,
    height: 250,
  },
});
export default RegisterResto;
