//----------REACT UTILS-----------
import React, { useState, useEffect } from "react";
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
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Pressable,
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
//-------INITIALIZATIONS-------
const auth = getAuth();
import { DEFAULT_PROFILE_IMAGE } from "@env";
import setUserLocation from "../Redux/Actions/setUserLocation.js";
//---------------------------------------------------------------------------------------//
import * as Animatable from "react-native-animatable";
import { Feather } from "@expo/vector-icons";
import * as Font from "expo-font";

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  //------LOGIN JOSE------------
  const [visibleModalGoogle, setVisibleModalGoogle] = useState(false);
  const [googleUser, setGoogleUser] = useState({
    name: "",
    lastName: "",
    cel: "",
    email: "",
  });
  const [usuarioGlobal, setUsuarioGlobal] = useState("");
  const [availableCommerces, setAvailableCommerces] = useState([]);
  const [flagCards, setFlagCards] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  //--------------FILTRADO MODAL-------------------------
  const [allRestos, setAllRestos] = useState();
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
      console.log("SNAP HOME 89");
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

        setFlagCards(true);
      }
    } catch (e) {
      console.log("error get", e);
    }
  };
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
  }

  const updateUser = (itemValue) => {
    if (itemValue === "A-Z") {
      const result = availableCommerces.sort((a, b) => (a.title > b.title) ? 1 : -1)
      setSelectedValue(result)
    } else if (itemValue === "Z-A") {
      const resulta = availableCommerces.sort((a, b) => (a.title < b.title) ? 1 : -1)
      setSelectedValu(resulta)
    }
  }

  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if(!fontLoaded){
     loadFonts();
    }
  });
const loadFonts = async () => {
  await Font.loadAsync({
    "CourierPrime-Bold": require("../assets/fonts/CourierPrime-Bold.ttf"),
    "CourierPrime-BoldItalic": require("../assets/fonts/CourierPrime-BoldItalic.ttf"),
    "CourierPrime-Italic": require("../assets/fonts/CourierPrime-Italic.ttf"),
    "CourierPrime-Regular": require("../assets/fonts/CourierPrime-Regular.ttf"),
  });
  setFontLoaded(true);
};
if (!fontLoaded) {
  return null;
}


  return (
    <View style={globalStyles.Home}>
      {/* <BottomSheet isVisible={false}>
    <View>
    <Text>Hola!</Text>
        </View>
      </BottomSheet> */}
      <Modal
        visible={visibleModalGoogle}
        animationType="slide"
        transparent={true}
      >
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalView}>
            <TextInput
              style={globalStyles.inputComponent}
              placeholder="Nombre"
              placeholderTextColor="#666"
              textAlign="center"
              onChangeText={(value) => {
                setGoogleUser({
                  ...googleUser,
                  name: value,
                });
              }}
            />
            <TextInput
              style={globalStyles.inputComponent}
              placeholder="Apellido"
              placeholderTextColor="#666"
              textAlign="center"
              onChangeText={(value) => {
                setGoogleUser({
                  ...googleUser,
                  lastName: value,
                });
              }}
            />
            <TextInput
              style={globalStyles.inputComponent}
              placeholder="Celular"
              placeholderTextColor="#666"
              textAlign="center"
              onChangeText={(value) => {
                setGoogleUser({
                  ...googleUser,
                  cel: value,
                });
              }}
            />
            <TouchableOpacity
              style={globalStyles.btnTodasComidas}
              onPress={() => {
                firebase.db.collection("Users").doc(auth.currentUser.uid).set({
                  id: auth.currentUser.uid,
                  name: googleUser.name,
                  lastName: googleUser.lastName,
                  cel: googleUser.cel,
                  email: googleUser.email,
                  commerce: false,
                  profileImage: DEFAULT_PROFILE_IMAGE,
                  reservations: [],
                  payments: [],
                });
                setVisibleModalGoogle(false);
              }}
            >
              <Text style={globalStyles.texts}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.textContainer}>
        {usuarioGlobal !== "" ? (
          <Text style={styles.text}>{` Welcome ${usuarioGlobal}`}</Text>
        ) : (
          <Text style={styles.text}>Welcome to Resto Book</Text>
        )}
      </View>
      {/*   ---------------------------------------Search ------------------------------------------------- */}
      <View style={styles.container} >
        <View style={styles.textInput}>
          <Animatable.View animation="zoomIn" duration={1200}>
            <TextInput
              style={styles.texto}
              onChangeText={(event) => {
                setSearchTerm(event);
              }}
              placeholder="Search..."
              placeholderTextColor="black"
              underlineColorAndroid="transparent"
            />
          </Animatable.View>
        </View>
        <View style={styles.touchableOpacity}>
          <Feather name="search" style={styles.iconStyle} />
        </View>
      </View>
      {/*  /----------------------------------------ORDENAMIENTO----------------------------------------/ */}
      {/*  <View style={globalStyles.btnHome}>
      <View style={globalStyles.btnFiltrosHome}>
      <Picker
        selectedValue={selectedValu}
        selectedValue={selectedValue}
        style={{ height: 17, width: 130 }}
        onValueChange={updateUser}
      >
        <Picker.Item label="Ordenado" value="Or" />
        <Picker.Item label="A-Z" value="A-Z" />
        <Picker.Item label="Z-A" value="Z-A" />
      </Picker>
    </View> */}
      <View>
        <Pressable onPress={() => isVisibleFiltro(true)}>
          <TextInput
            style={globalStyles.btnFiltrosHome}
            editable={false}
            placeholder="Ordenado por"
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
            containerStyle={{ backgroundColor: "rgba(0.5,0.25,0,0.7)" }}
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
                style={{ height: 35, color: "#fff", padding: 8 }}
              >
                A-Z
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem
            containerStyle={{ backgroundColor: "rgba(0.5,0.25,0,0.7)" }}
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
                style={{ height: 35, color: "#fff", padding: 8 }}
              >
                Z-A
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <ListItem
            key={999}
            containerStyle={{ backgroundColor: "#d14545" }}
            style={{ borderBottomWidth: 1, borderColor: "#333a" }}
            onPress={() => isVisibleFiltro(false)}
          >
            <ListItem.Content style={{ alignItems: "center" }}>
              <ListItem.Title
                style={{
                  height: 35,
                  color: "#FFF",
                  padding: 8,
                  fontSize: 20,
                }}
              >
                Cancelar
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </BottomSheet>
        {/*----------------------------------------BOTON MAPA------------------------------------------- */}
        <TouchableOpacity style={globalStyles.btnFiltrosHome}>
          <Text style={globalStyles.texts}><Icon
            reverse
            name="map-marker-alt"
            type="font-awesome-5"
            color="#FDFDFD"
            reverseColor="#161616"
            size={12}
          /></Text>
        </TouchableOpacity>
        {/*----------------------------------------FILTRADO------------------------------------------- */}
        <View>
          <Pressable onPress={() => isVisibleFiltros(true)}>
            <TextInput
              style={globalStyles.btnFiltrosHome}
              editable={false}
              placeholder="Buscar por Categoria"
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
              containerStyle={{ backgroundColor: "rgba(0.5,0.25,0,0.7)" }}
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
                  style={{ height: 35, color: "#fff", padding: 8 }}
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
              containerStyle={{ backgroundColor: "#d14545" }}
              style={{ borderBottomWidth: 1, borderColor: "#333a" }}
              onPress={() => isVisibleFiltros(false)}
            >
              <ListItem.Content style={{ alignItems: "center" }}>
                <ListItem.Title
                  style={{
                    height: 35, color: "#161616", fontSize: 20
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
    
    fontSize: 20,
    width: "100%",
    textAlign: "center",
    paddingVertical: 5,
   fontWeight: "bold",
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
