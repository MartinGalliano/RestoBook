import React, { useState, useRef, useEffect } from "react";
import {
  CLOUDINARY_URL,
  CLOUDINARY_CONSTANT,
  DEFAULT_PROFILE_IMAGE,
} from "@env";
import { useSelector } from "react-redux";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  useWindowDimensions,
  Alert,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Divider } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
//------FIREBASE----------------
import firebase from "../database/firebase";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  doc,
  onSnapshot,
  collection,
  query,
  getDoc,
  getDocs,
  updateDoc,
  where,
} from "firebase/firestore";
//--------------------------------
//---------STYLES-----------------
import globalStyles from "./GlobalStyles";
//--------------------------------
//-------COMPONENTS---------------
import CardReservation from "../components/CardReservation";
import CardFavourite from "../components/CardFavourite";
//---------------------------------

//
//
//---------SCREENS & COMPONENTS---------------

//
//
//-------ICONS-------
import { Icon } from "react-native-elements";
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

const ProfileResto = ({ navigation }) => {
  const loggedId = useSelector((state) => state.currentId);
  const commerceInfo = useSelector((state) => state.commerceInfo);
  const [availableCommerces, setAvailableCommerces] = useState({});
  const [image, setImage] = useState("");
  const [currentUser, setCurrentUser] = useState({});

  const sectoresResto = useSelector((state) => state.sectoresResto);

  const [modalAdminReservasVisible, setModalAdminReservasVisible] =
    useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalAdminHorarioVisible, setModalAdminHorarioVisible] =
    useState(false);

  const [places, setPlaces] = useState(1);
  const [timeReservaInicio, setTimeReservaInicio] = useState(0);
  const [timeReservaFin, setTimeReservaFin] = useState(0);
  const [timeHorarioComInicio, setTimeHorarioComInicio] = useState(0);
  const [timeHorarioComFin, setTimeHorarioComFin] = useState(0);
  const [precioXLugar, setPrecioXLugar] = useState(0);

  const [newCommerceInfo, setNewCommerceInfo] = useState({});
  const [uploading, setUploading] = useState(false);

  //cantidad de favoritos
  const [favoritesQty, setFavoritesQty] = useState(null);
  //promedio del rating
  const [resultRating, setResultRating] = useState(null);
  useEffect(() => {
    const getInfo = async () => {
      const docRef = doc(firebase.db, "Restos", commerceInfo);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let obj = docSnap.data();
        obj.id = docSnap.id;
        let totalRating = 0;
        if (obj.reviews.length) {
          for (let i = 0; i < obj.reviews.length; i++) {
            totalRating += obj.reviews[i].rating;
          }
          let resultado = totalRating / obj.reviews.length;
          setResultRating(resultado);
        } else {
          setResultRating(totalRating);
        }
        setAvailableCommerces(obj);
        setImage(obj.restoImage);
        setNewCommerceInfo(obj);
      } else {
        alert("NO HAY INFO");
      }
    };
    getInfo();
  }, [commerceInfo]);

  const getRating = () => {
    let totalRating = 0;
    if (availableCommerces?.reviews?.length) {
      for (let i = 0; i < availableCommerces?.reviews?.length; i++) {
        totalRating += availableCommerces?.reviews[i]?.rating;
      }
      let resultado = totalRating / availableCommerces?.reviews?.length;
      setResultRating(resultado);
    } else {
      setResultRating(totalRating);
    }
  };

  const getFavQty = async () => {
    try {
      const docRef = query(
        collection(firebase.db, "Users"),
        where("favourites", "!=", "[]")
      );
      const docSnap = await getDocs(docRef);
      if (!docSnap.empty) {
        let totalFavs = 0;
        docSnap.forEach((doc) => {
          let obj = doc.data();
          if (obj.favourites.length) {
            let favourites = obj.favourites.filter(
              (element) => element.idResto === availableCommerces?.id
            );
            totalFavs += favourites.length;
          }
        });
        setFavoritesQty(totalFavs);
      }
    } catch (e) {
      console.log("e", e);
    }
  };

  useEffect(() => {
    getFavQty();
    getRating();
  }, [commerceInfo]);

  useEffect(() => {
    return () => {
      setAvailableCommerces({});
    };
  }, []);

  let openImagePickerAsync = async () => {
    setUploading(true);
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Se necesita el permiso para acceder a la galería!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (pickerResult.cancelled === true) {
      setUploading(false);
      return;
    }

    let base64Img = `data:image/jpg;base64,${pickerResult.base64}`;

    let data = {
      file: base64Img,
      upload_preset: "restohenry",
    };

    fetch(CLOUDINARY_URL, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    })
      .then(async (r) => {
        let data = await r.json();
        let str = data.secure_url.split("restohenry/")[1];
        setImage(str);
        firebase.db.collection("Restos").doc(availableCommerces.id).update({
          restoImage: str,
        });
        setUploading(false);
      })
      .catch((err) => console.log(err));
  };

  const clearStates = () => {
    setTimeReservaInicio();
    setTimeReservaFin();
    setSectorState();
    setPlaces();
    setTimeHorarioComInicio();
    setTimeHorarioComFin();
  };

  const timesReserva = timeReservaInicio + "-" + timeReservaFin;
  const handleGuardarAdmReservas = async () => {
    //if (flagValidate) {
    const obj = {
      timeRange: timesReserva,
      places: places,
      precioPorLugar: precioXLugar,
    };
    try {
      let restoRef = doc(firebase.db, "Restos", commerceInfo);
      await updateDoc(restoRef, {
        reservationsParams: obj,
      });
      alert("Cambios Guardados con Exito!");
      setModalAdminReservasVisible(!modalAdminReservasVisible);
      clearStates();
    } catch (err) {
      console.log(err);
    }
    // } else {
    //   alert('Complete bien los campos')
    // }
  };

  const horarioCom = timeHorarioComInicio + "-" + timeHorarioComFin;
  const handleGuardarAdmHorarios = async () => {
    try {
      let restoRef = doc(firebase.db, "Restos", commerceInfo);
      await updateDoc(restoRef, {
        commerceTimeRange: horarioCom,
      });
      alert("Cambios Guardados con Exito!");
      setModalAdminHorarioVisible(false);
      clearStates();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={globalStyles.Perfilcontainer}>

      <View style={globalStyles.imgContainer}>
        {image && !uploading ? (
          <TouchableOpacity onPress={openImagePickerAsync}>
            <Image
              source={{
                uri: CLOUDINARY_CONSTANT + image,
              }}
              style={globalStyles.imgProfile}
              
            />
          </TouchableOpacity>
        ) : (
          <ActivityIndicator
            size="large"
            color="#5555"
            style={globalStyles.imgProfile}
          />
        )}
        <View style={globalStyles.nombreContainer}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              color: "#161616",
              textAlignVertical: "top",
              textTransform: "capitalize",
            }}
          >
            {availableCommerces?.title}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#161616",
              paddingVertical: 15,
              textTransform: "capitalize",
            }}
          >
            {availableCommerces?.location?.address.split(",")[0]},
            {availableCommerces?.location?.address.split(",")[1]}
          </Text>
          <TouchableOpacity
            style={globalStyles.btnLogin}
            onPress={() => setModalEditVisible(true)}
          >
            <Text style={globalStyles.texts}>Editar</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalEditVisible}
            onRequestClose={() => {
              setModalEditVisible(!modalEditVisible);
            }}
          >
            <View style={globalStyles.centeredView}>
              <View style={globalStyles.modalView}>
                <TouchableOpacity
                  style={globalStyles.btnTodasComidas}
                  onPress={() => setModalEditVisible(!modalEditVisible)}
                >
                  <Text style={globalStyles.texts}>X</Text>
                </TouchableOpacity>
                <Text style={globalStyles.modalText}>Editar información</Text>
                {/* <Text style={globalStyles.texts}>Nombre del Resto:</Text>
                  <TextInput
                    style={globalStyles.inputComponent}
                    placeholder={availableCommerces?.title}
                    placeholderTextColor="#666"
                    textAlign="center"
                    onChangeText={(value) =>
                      setNewUserInfo({
                        ...newUserInfo,
                        title: value,
                      })
                    }
                  /> */}
                <Text style={globalStyles.texts}>Telefono:</Text>
                <TextInput
                  style={globalStyles.inputComponent}
                  placeholder={availableCommerces?.phone}
                  placeholderTextColor="#666"
                  textAlign="center"
                  onChangeText={(value) =>
                    setNewCommerceInfo({
                      ...newCommerceInfo,
                      phone: value,
                    })
                  }
                />
                <Text style={globalStyles.texts}>Telefono 2:</Text>
                <TextInput
                  style={globalStyles.inputComponent}
                  placeholder={availableCommerces?.phone2}
                  placeholderTextColor="#666"
                  textAlign="center"
                  onChangeText={(value) =>
                    setNewCommerceInfo({
                      ...newCommerceInfo,
                      phone2: value,
                    })
                  }
                />
                <Text style={globalStyles.texts}>Email:</Text>
                <TextInput
                  style={globalStyles.inputComponent}
                  placeholder={availableCommerces?.email}
                  placeholderTextColor="#666"
                  textAlign="center"
                  onChangeText={(value) =>
                    setNewCommerceInfo({
                      ...newCommerceInfo,
                      email: value,
                    })
                  }
                />
                {/* <TouchableOpacity
                    style={globalStyles.btnLogin}
                    onPress={() => {
                      sendPasswordResetEmail(auth, currentUser?.email)
                        .then(alert("Revisa tu casilla y volve a ingresar!"))
                        .then(signOut(auth))
                        .then(setModalVisible(false))
                        .then(navigation.navigate("RestoBook"));
                    }}
                  >
                    <Text style={globalStyles.texts}>Cambiar contraseña</Text>
                  </TouchableOpacity> */}
                <TouchableOpacity
                  style={globalStyles.btnLogin}
                  onPress={() => {
                    firebase.db
                      .collection("Restos")
                      .doc(availableCommerces.id)
                      .update({
                        phone: newCommerceInfo.phone,
                        phone2: newCommerceInfo.phone2,
                        email: newCommerceInfo.email,
                      })
                      .then(alert("cambios guardados!"))
                      .then(setModalEditVisible(false))
                      .catch((error) => alert("error!"));
                  }}
                >
                  <Text style={globalStyles.texts}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={{
        backgroundColor: "red",
        width: "100%",
        height: "5%"
      }}>

      </View>

      {/* MODAL DE ADMINISTRAR RESERVAS */}
      <TouchableOpacity
        onPress={() => setModalAdminReservasVisible(!modalAdminReservasVisible)}
        style={globalStyles.btnProfileResto}
      >
        <Icon
          name="clipboard-list"
          type="font-awesome-5"
          color="#392c28"
          size={24}
        />
        <Text style={{ fontSize: 25, color: "#392c28", textAlign: "center" }}>
          Administrar Reservas
        </Text>

      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAdminReservasVisible}
        onRequestClose={() => {
          setModalAdminReservasVisible(!modalAdminReservasVisible);
        }}
      >
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalView}>
            <TouchableOpacity
              style={globalStyles.btnTodasComidas}
              onPress={() =>
                setModalAdminReservasVisible(!modalAdminReservasVisible)
              }
            >
              <Text style={globalStyles.texts}>X</Text>
            </TouchableOpacity>

            <Text style={globalStyles.modalText}>
              Administración de reserva
            </Text>

            <Text style={globalStyles.texts}>
              Horario para reservar(24hs)
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginVertical: 10,
              }}
            >
              <View style={{ flexDirection: "column", flex: 0.4 }}>
                <Text
                  style={{
                    alignSelf: "center",
                  }}
                >
                  Hora Inicio:
                </Text>
                <InputSpinner
                  style={{
                    maxWidth: "100%",
                    width: "100%",
                    marginVertical: 10,
                    alignSelf: "center",
                  }}
                  value={timeReservaInicio}
                  max={24}
                  min={1}
                  buttonFontSize={25}
                  onChange={(value) => setTimeReservaInicio(value)}
                  skin="clean"
                  colorPress="#eccdaa"
                  background="#f2f2f2"
                  colorAsBackground={true}
                  fontSize={20}
                />
              </View>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginHorizontal: 10,
                }}
              >
                {" "}
                A{" "}
              </Text>
              <View style={{ flexDirection: "column", flex: 0.4 }}>
                <Text
                  style={{
                    alignSelf: "center",
                  }}
                >
                  Hora Fin:
                </Text>
                <InputSpinner
                  style={{
                    maxWidth: "100%",
                    width: "100%",
                    marginVertical: 10,
                    alignSelf: "center",
                  }}
                  value={timeReservaFin}
                  max={24}
                  min={1}
                  buttonFontSize={25}
                  onChange={(value) => setTimeReservaFin(value)}
                  skin="clean"
                  colorPress="#eccdaa"
                  background="#f2f2f2"
                  colorAsBackground={true}
                  fontSize={20}
                />
              </View>
            </View>

            <Text style={globalStyles.texts}> Precio por Lugar:</Text>
            <InputSpinner
              style={{
                maxWidth: "100%",
                width: "65%",
                marginVertical: 10,
                alignSelf: "center",
              }}
              value={precioXLugar}
              max={1000}
              min={0}
              buttonFontSize={25}
              step={50}
              onChange={(value) => setPrecioXLugar(value)}
              skin="clean"
              colorPress="#eccdaa"
              background="#f2f2f2"
              colorAsBackground={true}
              fontSize={20}
            />

            <Text style={globalStyles.texts}>
              {" "}
              Cantidad de lugares disponibles:
            </Text>
            <InputSpinner
              style={{
                maxWidth: "100%",
                width: "65%",
                marginVertical: 10,
              }}
              value={places}
              max={50}
              min={1}
              buttonFontSize={25}
              onChange={(num) => setPlaces(num)}
              skin="clean"
              colorPress="#eccdaa"
              background="#f2f2f2"
              colorAsBackground={true}
              fontSize={20}
            />


            <Text style={globalStyles.texts}>Resumen:</Text>

            <View
              style={{
                borderWidth: 2,
                borderColor: "#eccdaa",
                borderRadius: 35,
                maxWidth: "100%",
                width: "90%",
                // height: "35%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  marginVertical: 5,
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                Hora de Reserva: {timesReserva}
              </Text>
              <Text
                style={{
                  marginVertical: 5,
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                Lugares Disponibles: {places}
              </Text>
              <Text
                style={{
                  marginVertical: 5,
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                Precio Por Lugar: ${precioXLugar}
              </Text>

            </View>

            <TouchableOpacity
              style={globalStyles.btnTodasComidas}
              onPress={() => handleGuardarAdmReservas()}
            >
              <Text style={globalStyles.texts}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL DE ADMINISTRAR HORARIO COMERCIAL */}

      < TouchableOpacity
        onPress={() => setModalAdminHorarioVisible(!modalAdminHorarioVisible)}
        style={globalStyles.btnProfileResto}
      >
        <Icon name="clock" type="font-awesome-5" color="#392c28" size={24} />
        <Text style={{ fontSize: 25, color: "#392c28", textAlign: "center" }}>
          Editar Horario Comercial
          {/* clock */}
        </Text>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAdminHorarioVisible}
          onRequestClose={() => {
            setModalAdminHorarioVisible(!modalAdminHorarioVisible);
          }}
        >
          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <TouchableOpacity
                style={globalStyles.btnTodasComidas}
                onPress={() =>
                  setModalAdminHorarioVisible(!modalAdminHorarioVisible)
                }
              >
                <Text style={globalStyles.texts}>X</Text>
              </TouchableOpacity>

              <Text style={globalStyles.modalText}>
                Administración Horario Comercial(24hs)
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginVertical: 10,
                }}
              >
                <View style={{ flexDirection: "column", flex: 0.4 }}>
                  <Text
                    style={{
                      alignSelf: "center",
                    }}
                  >
                    Hora Inicio:
                  </Text>
                  <InputSpinner
                    style={{
                      maxWidth: "100%",
                      width: "100%",
                      marginVertical: 10,
                      alignSelf: "center",
                    }}
                    value={timeHorarioComInicio}
                    max={24}
                    min={1}
                    buttonFontSize={25}
                    onChange={(value) => setTimeHorarioComInicio(value)}
                    skin="clean"
                    colorPress="#eccdaa"
                    background="#f2f2f2"
                    colorAsBackground={true}
                    fontSize={20}
                  />
                </View>
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                    marginHorizontal: 10,
                  }}
                >
                  {" "}
                  A{" "}
                </Text>
                <View style={{ flexDirection: "column", flex: 0.4 }}>
                  <Text
                    style={{
                      alignSelf: "center",
                    }}
                  >
                    Hora Fin:
                  </Text>
                  <InputSpinner
                    style={{
                      maxWidth: "100%",
                      width: "100%",
                      marginVertical: 10,
                      alignSelf: "center",
                    }}
                    value={timeHorarioComFin}
                    max={24}
                    min={1}
                    buttonFontSize={25}
                    onChange={(value) => setTimeHorarioComFin(value)}
                    skin="clean"
                    colorPress="#eccdaa"
                    background="#f2f2f2"
                    colorAsBackground={true}
                    fontSize={20}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={globalStyles.btnTodasComidas}
              onPress={() => handleGuardarAdmHorarios()}
            >
              <Text style={globalStyles.texts}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </Modal >
      </TouchableOpacity >
    </View >
  );
};

export default ProfileResto;
