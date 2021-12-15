//----------REACT UTILS-----------
import React, { useState, useEffect, useRef } from "react";
//
//----------REDUX UTILS-----------
import { useDispatch, useSelector } from "react-redux";
import CurrentId from "../Redux/Actions/CurrentId.js";
import CurrentUser from "../Redux/Actions/CurrentUser.js";
//----------REACT-NATIVE UTILS-----------
import { BottomSheet, ListItem, Icon } from "react-native-elements";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
//---------------------EXPO----------------------
import * as Location from "expo-location";
//----------FIREBASE UTILS-----------
import firebase from "../database/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, collection, query, getDoc } from "firebase/firestore";
//---------SCREENS---------------
import CardHome from "../components/CardHome.js";
//-------STYLES-------
import globalStyles from "./GlobalStyles.js";
//
//---------------------GEOLOCATION-------------------
import MapView, { Callout, Marker } from "react-native-maps";
//----------------------------------------------------
//
//-------INITIALIZATIONS-------
const auth = getAuth();
import { DEFAULT_PROFILE_IMAGE } from "@env";
import { CLOUDINARY_CONSTANT } from "@env";
import setUserLocation from "../Redux/Actions/setUserLocation.js";
//
//---------------------------------------------------------------------------------------//
import * as Animatable from "react-native-animatable";
import { Feather } from "@expo/vector-icons";
import * as Font from "expo-font";
//-------YUP(Validacion)------
import * as yup from "yup";
//----------FORMIK UTILS-----------
import { Formik } from "formik";
//
import CardMaps from "../components/CardMaps.js";

//-------VALIDATION SCHEMA GOOGLE LOGIN--------------
const googleLoginSchema = yup.object({
  name: yup.string().required(),
  lastName: yup.string().required(),
  cel: yup.number().required(),
});

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  //------LOGIN JOSE------------
  const [visibleModalGoogle, setVisibleModalGoogle] = useState(false);
  const [usuarioGlobal, setUsuarioGlobal] = useState("");
  const [availableCommerces, setAvailableCommerces] = useState([]);
  const [flagCards, setFlagCards] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  //-------------------GEOLOCATION---------------------------//
  const [mapaVisible, setMapaVisible] = useState(false);
  const userLocation = useSelector((state) => state.userCoordinates);
  const mapRef = useRef(null);
  //--------------FILTRADO MODAL-------------------------
  const [allRestos, setAllRestos] = useState([]);
  const [category, setCategory] = useState();
  const [visibleFiltros, isVisibleFiltros] = useState(false);
  const loggedUser = useSelector((state) => state.currentUser);
  const loggedId = useSelector((state) => state.currentId);
  const categories = useSelector((state) => state.categoriesResto);

  //---------------SEARCH BAR-------------------------
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValu, setSelectedValu] = useState("");
  const [visibleFiltro, isVisibleFiltro] = useState(false);

  useEffect(() => {
    const q = query(collection(firebase.db, "Restos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let arr = [];
      console.log("SNAP HOME 84");
      querySnapshot.forEach((doc) => {
        let obj = doc.data();
        obj.idResto = doc.id;
        arr.push(obj);
      });
      setAvailableCommerces(arr);
      setAllRestos(arr);
    });
  }, []);

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase?.emailVerified) {
      if (loggedId !== usuarioFirebase.uid) {
        dispatch(CurrentId(usuarioFirebase.uid));
        // const unsub = onSnapshot(
        //   doc(firebase.db, "Users", usuarioFirebase.uid),
        //   (doc) => {
        //     if (doc.exists()) {
        //       console.log("SNAP HOME 103");
        //       dispatch(CurrentUser(doc.data()));
        //       //console.log("data user en home : ", doc.data());
        //     }
        //   }
        // );
      }
    } else {
      dispatch(CurrentUser(null));
    }
  });

  // useEffect(() => {
  //   const getUser = async () => {
  //     const docRef = doc(collection(firebase.db, "Users", usuarioFirebase.uid));
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       let obj = docSnap.data();
  //       dispatch(CurrentUser(obj));
  //     }
  //   };
  // }, [loggedId]);

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    console.log("Permission granted, reading user coordinates...");
    let { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    //console.log(coords);
    const location = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.004757,
      longitudeDelta: 0.006866,
    };
    dispatch(setUserLocation(location));
  };

  const getInfo = async () => {
    try {
      // console.log("getInfo!!!");
      const docRef = doc(firebase.db, "Users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      // console.log("dsnap", docSnap.exists());
      if (!docSnap.exists()) {
        // console.log("if de getinfo!");
        setGoogleUser({ ...googleUser, email: auth.currentUser.email });
        setVisibleModalGoogle(true);
      } else {
        //console.log("else de getinfo!");
        let obj = docSnap.data();
        dispatch(CurrentUser(obj));
        setFlagCards(true);
      }
    } catch (e) {
      console.log("error get", e);
    }
  };
  // const calculateDistances = async (userLocation, restoLocation) => {
  //   const arrayDistances = await axios(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userLocation}&destinations=${restoLocation}&key=${GOOGLE_API_KEY}`)
  //   console.log(arrayDistances)
  // }
  // const orderByDistance = (allRestos) => {
  // }
  useEffect(() => {
    if (loggedId && auth.currentUser.uid) {
      getInfo();
      getUserLocation();
    }
    setFlagCards(true);
  }, [loggedId]);

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase?.emailVerified) {
      if (usuarioFirebase.displayName) {
        setUsuarioGlobal(usuarioFirebase.displayName);
      } else {
        const trimmedName = usuarioFirebase.email.split("@")[0];
        setUsuarioGlobal(trimmedName);
      }
    } else {
      setUsuarioGlobal("");
    }
  });

  const handleCategory = async (category) => {
    setCategory(category);
    if (!category) setAvailableCommerces(allRestos);
    const result = availableCommerces.filter(
      (resto) => resto.category === category.toLowerCase()
    );
    if (result.length === 0) {
      alert("No hay Empresas con esta Categoria");
      setCategory("");
      setAvailableCommerces(allRestos);
    } else {
      setAvailableCommerces(result);
    }
  };

  const updateUser = (itemValue) => {
    if (itemValue === "A-Z") {
      const result = availableCommerces.sort((a, b) =>
        a.title > b.title ? 1 : -1
      );
      setSelectedValue(result);
    } else if (itemValue === "Z-A") {
      const resulta = availableCommerces.sort((a, b) =>
        a.title < b.title ? 1 : -1
      );
      setSelectedValu(resulta);
    }
  }
/* //------------logica fuentes -----------------------  */
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if(!fontLoaded){
     loadFonts();
    }
  });
const loadFonts = async () => {
  await Font.loadAsync({
    "BeVietnamPro-Black": require("../assets/fonts/BeVietnamPro-Black.ttf"),
    "BeVietnamPro-Bold": require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    "BeVietnamPro-ExtraBold": require("../assets/fonts/BeVietnamPro-ExtraBold.ttf"),
    "BeVietnamPro-Light": require("../assets/fonts/BeVietnamPro-Light.ttf"),
    "BeVietnamPro-Medium": require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    "BeVietnamPro-Regular": require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    "BeVietnamPro-SemiBold": require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
  });
  setFontLoaded(true);
};
if (!fontLoaded) {
  return null; 
}

/* //------------logica fuentes cierre -----------------------  */
  return (
    <View style={globalStyles.Home}>
      {/* <BottomSheet isVisible={false}>
    <View>
    <Text>Hola!</Text>
        </View>
      </BottomSheet> */}

      {/*--------------------MODAL GOOGLE LOGIN--------------------------- */}
      <Modal visible={false} animationType="slide" transparent={true}>
        <Formik
          initialValues={{
            name: "",
            lastName: "",
            cel: "",
            email: "",
          }}
          validationSchema={googleLoginSchema}
          onSubmit={({ name, lastName, cel }) => {
            firebase.db.collection("Users").doc(auth.currentUser.uid).set({
              id: auth.currentUser.uid,
              name: name,
              lastName: lastName,
              cel: cel,
              email: auth.currentUser.email,
              commerce: false,
              multiCommerce: false,
              favourites: [],
              profileImage: DEFAULT_PROFILE_IMAGE,
              reservations: [],
              payments: [],
            });
            setVisibleModalGoogle(false);
          }}
        >
          {(props) => (
            <View style={globalStyles.centeredView}>
              <View style={globalStyles.modalView}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 30,
                    paddingVertical: 5,
                    color: "#161616",
                    letterSpacing: 1,
                  }}
                >
                  Registrarse
                </Text>
                <View style={globalStyles.inputComponent}>
                  <TextInput
                    style={globalStyles.texts}
                    placeholder="Nombre"
                    placeholderTextColor="#666"
                    textAlign="center"
                    onChangeText={props.handleChange("name")}
                    value={props.values.name}
                    onBlur={props.handleBlur("name")}
                  />
                </View>
                {props.touched.name && props.errors.name ? (
                  <Text style={globalStyles.errorText}>
                    {props.errors.name}
                  </Text>
                ) : null}
                <View style={globalStyles.inputComponent}>
                  <TextInput
                    style={globalStyles.texts}
                    placeholder="Apellido"
                    placeholderTextColor="#666"
                    textAlign="center"
                    onChangeText={props.handleChange("lastName")}
                    value={props.values.lastName}
                    onBlur={props.handleBlur("lastName")}
                  />
                </View>
                {props.touched.lastName && props.errors.lastName ? (
                  <Text style={globalStyles.errorText}>
                    {props.errors.lastName}
                  </Text>
                ) : null}
                <View style={globalStyles.inputComponent}>
                  <TextInput
                    style={globalStyles.texts}
                    placeholder="Celular"
                    placeholderTextColor="#666"
                    textAlign="center"
                    onChangeText={props.handleChange("cel")}
                    value={props.values.cel}
                    onBlur={props.handleBlur("cel")}
                  />
                </View>
                {props.touched.cel && props.errors.cel ? (
                  <Text style={globalStyles.errorText}>{props.errors.cel}</Text>
                ) : null}
                <TouchableOpacity
                  style={globalStyles.btnTodasComidas}
                  onPress={() => props.handleSubmit()}
                >
                  <Text style={globalStyles.texts}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </Modal>

      {/*--------------FIN MODAL GOOGLE LOGIN------------------------- */}

      <View style={styles.textContainer}>
        {usuarioGlobal !== "" ? (
          <Text style={styles.text}>{` Bienvenido ${usuarioGlobal}`}</Text>
        ) : (
          <Text style={styles.text}>Bienvenido a Resto Book</Text>
        )}
      </View>
      {/*   ---------------------------------------Search ------------------------------------------------- */}
      <View style={styles.container}>
        <View style={styles.textInput}>
          <Animatable.View animation="zoomIn" duration={1200}>
            <TextInput
              style={styles.texto}
              onChangeText={(event) => {
                setSearchTerm(event);
              }}
              placeholder="Buscar local..."
              placeholderTextColor="grey"
              underlineColorAndroid="transparent"
           
            />
          </Animatable.View>
        </View>
        <View style={styles.touchableOpacity}>
          <Feather name="search" style={styles.iconStyle} />
        </View>
      </View>
      {/*  /----------------------------------------ORDENAMIENTO----------------------------------------/ */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => isVisibleFiltro(true)}>
          <TextInput
            style={globalStyles.btnFiltrosHome}
            editable={false}
            placeholder="Ordenar por"
           /*  fontWeight={'bold'} */
            fontSize={15}
            textAlign="center"
            placeholderTextColor="#161616"
            value={selectedValue}
            value={selectedValu}
            onPressIn={() => isVisibleFiltro(true)}
          />
        </Pressable>
        <BottomSheet
          isVisible={visibleFiltro}
          containerStyle={{ backgroundColor: "#333a" }}
        >
          <ListItem
            containerStyle={{ backgroundColor: "rgba(242, 242, 242,0.8)" }}
            style={{
              borderBottomWidth: 1,
              borderColor: "#333a",
              backgroundColor: "#fff0",
             
            }}
            onPress={() => {
              updateUser("A-Z");
              isVisibleFiltro(false);
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
                  /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
                }}
              >
                A-Z
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem
            containerStyle={{ backgroundColor: "rgba(242, 242, 242,0.8)" }}
            style={{
              borderBottomWidth: 1,
              borderColor: "#333a",
              backgroundColor: "#fff0",
            }}
            onPress={() => {
              updateUser("Z-A");
              isVisibleFiltro(false);
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
                /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
              
                }}
              >
                Z-A
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <ListItem
            key={999}
            containerStyle={{ backgroundColor: "#eccdaa" }}
            style={{ borderBottomWidth: 1, borderColor: "#ffff" }}
            onPress={() => isVisibleFiltro(false)}
          >
            <ListItem.Content style={{ alignItems: "center" }}>
              <ListItem.Title
                style={{
                  height: 35, color: "#161616", fontSize: 20,
                   /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
                }}
              >
                Cancelar
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </BottomSheet>
        {/*----------------------------------------BOTON MAPA------------------------------------------- */}
        <TouchableOpacity
          style={globalStyles.btnFiltrosHome}
          onPress={() => {
            if (loggedUser) {
              setMapaVisible(!mapaVisible);
            } else {
              Alert.alert(
                "Debes estar logeado para ver el Mapa de tu zona",
                "Desea ir a la pantalla de Login?",
                [
                  {
                    text: "Ahora no",
                    onPress: () => console.log("No quiere logearse"),
                    style: "cancel",
                  },
                  {
                    text: "Si, por favor",
                    onPress: () => navigation.navigate("GlobalLogin"),
                  },
                ]
              );
            }
          }}
        >
          <Text style={globalStyles.texts}>
            <Icon
              reverse
              name="map-marker-alt"
              type="font-awesome-5"
              color="#FDFDFD"
              reverseColor="#161616"
              size={12}
            />
          </Text>
        </TouchableOpacity>
        {/*----------------------------------------FILTRADO------------------------------------------- */}
        <View>
          <Pressable onPress={() => isVisibleFiltros(true)}>
            <TextInput
              style={globalStyles.btnFiltrosHome}
              editable={false}
              placeholder="Categorias"
              fontSize={15}
              textAlign="center"
              placeholderTextColor="#161616"
              value={category}
              onPressIn={() => isVisibleFiltros(true)}
            />
          </Pressable>
          <BottomSheet
            isVisible={visibleFiltros}
            containerStyle={{ backgroundColor: "#333a" }}
          >
            <ListItem
              containerStyle={{ backgroundColor: "rgba(242, 242, 242,0.8)" }}
              style={{
                borderBottomWidth: 1,
                borderColor: "#333a",
                backgroundColor: "#fff0",
              }}
              onPress={() => {
                handleCategory(null);
                isVisibleFiltros(false);
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
               /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
                  }}
                >
                  Todos
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
            {categories.map((categoria, index) => (
              <ListItem
                key={index}
                containerStyle={{ backgroundColor: "rgba(242, 242, 242,0.8)" }}
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#333a",
                  backgroundColor: "#fff0",
                }}
                onPress={() => {
                  handleCategory(categoria);
                  isVisibleFiltros(false);
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
                    /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
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
              onPress={() => isVisibleFiltros(false)}
            >
              <ListItem.Content style={{ alignItems: "center" }}>
                <ListItem.Title
                  style={{
                    height: 35, color: "#161616", fontSize: 20,
                    /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
                    }}
                >
                  Cancelar
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </BottomSheet>
        </View>
      </View>
      <ScrollView>
        {availableCommerces.length && flagCards ? (
          <View>
            {availableCommerces
              .filter((resto) => {
                if (searchTerm === "") {
                  return resto;
                } else {
                  return resto.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                }
              })
              .map((resto) => {
                return (
                  <CardHome
                    key={resto.idResto}
                    resto={resto}
                    navigation={navigation}
                  ></CardHome>
                );
              })}
          </View>
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#5555" />
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={mapaVisible}
        onRequestClose={() => {
          setMapaVisible(!mapaVisible);
        }}
      >
        <View style={globalStyles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.googleMapsContainer}>
              <TouchableOpacity
                style={globalStyles.btnTodasComidas}
                onPress={() => setMapaVisible(!mapaVisible)}
              >
                <Text style={globalStyles.texts}>X</Text>
              </TouchableOpacity>
              {Object.entries(userLocation).length > 0 && (
                <MapView
                  ref={mapRef}
                  userInterfaceStyle="light"
                  style={styles.googleMaps}
                  initialRegion={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }}
                >
                  {Object.entries(userLocation).length > 0 && (
                    <Marker
                      title="Your location"
                      pinColor="#0072B5"
                      coordinate={userLocation}
                      identifier="userLocation"
                    />
                  )}
                  {allRestos.length > 0 &&
                    allRestos.map((resto) => {
                      return (
                        <Marker
                          key={resto.idResto}
                          title={resto.title}
                          description={resto.description}
                          pinColor="red"
                          coordinate={resto.location}
                          identifier={resto.title}
                        >
                          <Callout tooltip>
                            <CardMaps
                              key={resto.idResto}
                              resto={resto}
                              navigation={navigation}
                            ></CardMaps>
                          </Callout>
                        </Marker>
                      );
                    })}
                </MapView>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    alignSelf: "center",
    justifyContent: "center",
    width: "90%",
    borderColor: "#000000",
    backgroundColor: "#161616",
    borderRadius: 10,
    borderWidth: 4,
    marginTop: 10,
  },
  googleMapsContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    borderRadius: 20,
  },
  googleMaps: {
    marginTop: 10,
    flex: 1,
    borderRadius: 18,
  },
  modalView: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
    padding: 5,
    width: "95%",
    height: "95%",
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
    display: "flex",
    elevation: 100,
  },
  textContainer2: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    width: "40%",
    borderRadius: 10,
    borderWidth: 3,
    marginTop: 10,
  },
  text: {
   //dejo las otras fuentes proba la que quieras usar ! 
   /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
    fontSize: 20,
    width: "100%",
    textAlign: "center",
    paddingVertical: 5,
   /* fontWeight: "bold", */
    color: "#FDFDFD",
  },

  textContainer2: {
    alignSelf: "center",
    justifyContent: "center",
    width: "40%",
    borderRadius: 10,
    borderWidth: 3,
    marginTop: 10,
  },
  forgottenPass: {
    backgroundColor: "antiquewhite",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    borderBottomWidth: 5,
    borderBottomColor: "black",
  },

  inputForgotten: {
    marginTop: 200,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "orange",
  },
  // googleUserModal: {
  //   backgroundColor: "#f0f",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  googleUserForm: {
    backgroundColor: "grey",
    padding: 20,
    // textAlign: "center",
    // justifyContent: "center",
    // alignContent: "center",
  },
  googleTextinput: {
    padding: 10,
  },
  loading: {
    height: 500,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginVertical: 10,
    backgroundColor: "#F0EEEE",
    height: 35,
    flexDirection: "row",
    width: "90%",
    borderRadius: 40,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.84,
    elevation: 7,
  },
  textInput: {
    fontFamily: "Gotham-Book",
    // color: "#ECCDAA",
    fontSize: 40,
    flex: 1,
    paddingLeft: 3,
    width: "70%",
  },
  texto: {
   /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
    paddingHorizontal: 15,
    marginVertical: 5,
    textAlign: "left",
    justifyContent: "center",
  },
  iconStyle: {
    fontSize: 20,
    width: 20,
    height: 20,
    color: "#ECCDAA",
  },
  touchableOpacity: {
    justifyContent: "center",
    alignItems: "center",
    width: "15%",
    height: "100%",
    borderRadius: 40,
    backgroundColor: "#161616",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.84,
    elevation: 5,
  },
});
