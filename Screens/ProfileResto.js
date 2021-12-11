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
//---------CHECKBOX----------------------
import Checkbox from 'expo-checkbox';
//
//-------ICONS-------
import { Icon } from "react-native-elements";
//
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

  const [modalAdminReservasVisible, setModalVisibleAdminReservas] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false)

  const [newCommerceInfo, setNewCommerceInfo] = useState({});
  const [uploading, setUploading] = useState(false);
  const [sectorState, setSectorState] = useState([])
  const [timeReservaInicio, setTimeReservaInicio] = useState(0)
  const [timeReservaFin, setTimeReservaFin] = useState(0)

  useEffect(() => {
    const getInfo = async () => {
      const docRef = doc(firebase.db, "Restos", commerceInfo);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let obj = docSnap.data();
        obj.id = docSnap.id;
        setAvailableCommerces(obj);
        setImage(obj.restoImage)
        setNewCommerceInfo(obj);
      } else {
        alert("NO HAY INFO");
      }
    };
    getInfo();
  }, [commerceInfo]);

  useEffect(() => {
    return () => {
      setAvailableCommerces({});
    };
  }, []);
  // useEffect(() => {
  //   const q = query(
  //     collection(firebase.db, "Restos"),
  //     where("idUser", "==", loggedId)
  //   );
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       let obj = doc.data();

  //       setImage(obj.restoImage);
  //       setAvailableCommerces(obj);
  //     });
  //   });
  // }, []);
  // console.log("available en resto", availableCommerces);

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

  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();


  const showTimepicker = () => {
    setMode('time');
    setShow(true)
  };


  const onChangeTimePicker = (event, selectedDate) => {
    console.log(event.nativeEvent)
    // const currentDate = selectedDate || date;
    // setShow(Platform.OS === 'ios');
    // setDate(currentDate);
  };

  const handleSectores = (sector) => {
    if (!sectorState.includes(sector)) {
      setSectorState([...sectorState, sector])
    } else {
      const eliminado = sectorState.filter((sectorS) => sectorS !== sector)
      setSectorState(eliminado)
      console.log(sectorState)
    }
  }

  // const handleGuardarModalAdmEmpresa = async () => {
  //   console.log("Aprete")
  //   const timesReserva = timeReservaInicio + "-" + timeReservaFin;
  //   try {
  //     let restoRef = doc(firebase.db, "Restos", idResto);
  //     setSpinner(true);
  //     await updateDoc(restoRef, {
  //       menu: arrayUnion(newValues),
  //     });
  //     setSpinner(false);
  //     navigation.navigate("DetailsResto");
  //   } catch (err) {
  //     console.log(err);
  //   }

  // }

  return (
    <View style={globalStyles.Perfilcontainer}>
      <ScrollView
        style={globalStyles.Perfilcontainer}
        contentContainerStyle={{ flex: 1 }}
      >
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
                Alert.alert("Modal has been closed.");
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
                        .then(setModalVisible(false))
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
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#161616",
            paddingVertical: 15,
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
          {currentUser?.description}
        </Text>

        <Text style={{ fontSize: 25, color: "#161616", textAlign: "center" }}>
          <Icon name="home" type="font-awesome-5" color="#161616" size={25} />{" "}
          Mis Comercios
        </Text>
        <Divider
          orientation="horizontal"
          width={2}
          inset={true}
          insetType={"middle"}
          color={"rgba(00, 00, 00, .5)"}
          style={{ marginVertical: 10 }}
        />
        <ScrollView
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={globalStyles.FavouriteContainer}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ])}
          scrollEventThrottle={1}
        >
          {availableCommerces.length ? (
            <View>
              {availableCommerces.map((element) => {
                return (
                  <View>
                    <Text>{element.title}</Text>
                    <Text>{element.Description}</Text>
                  </View>
                );
              })}
            </View>
          ) : null}
        </ScrollView>



        {/* MODAL DE ADMINISTRAR RESERVAS */}

        <TouchableOpacity onPress={() => setModalVisibleAdminReservas(true)} style={globalStyles.btnProfileResto}>
          <Icon name='clipboard-list' type='font-awesome-5' color='#392c28' size={24} />
          <Text style={{ fontSize: 25, color: "#392c28", textAlign: "center" }}>
            Administrar Reservas
          </Text>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalAdminReservasVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisibleAdminReservas(!modalVisibleAdminReservas);
            }}
          >

            <View style={globalStyles.centeredView}>
              <View style={globalStyles.modalView}>
                <TouchableOpacity
                  style={globalStyles.touchLog}
                  onPress={() => setModalVisibleAdminReservas(!modalAdminReservasVisible)}
                >
                  <Text
                    style={globalStyles.textStyle}
                  >
                    X
                  </Text>
                </TouchableOpacity>


                <Text style={globalStyles.modalText}>Administración de reserva</Text>


                <Text style={globalStyles.texts}>Horario para reservar(24hs):</Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <TextInput
                    style={{
                      alignSelf: "center",
                      marginVertical: 10,
                      borderRadius: 10,
                      backgroundColor: 'rgba(22, 22, 22, .2)',
                      maxWidth: '100%',
                      width: '30%',
                      marginHorizontal: 5,
                      paddingVertical: 5,
                    }}
                    placeholder="Hora Inicio"
                    placeholderTextColor="#666"
                    textAlign="center"
                    keyboardType="numeric"
                    value={timeReservaInicio}
                    onChangeText={(value) => setTimeReservaInicio(value)}
                  />
                  <Text style={{
                    alignSelf: "center",
                    fontSize: 14.5,
                    fontWeight: "bold",
                    paddingVertical: 1,
                  }}> A </Text>
                  <TextInput
                    style={{
                      alignSelf: "center",
                      marginVertical: 10,
                      borderRadius: 10,
                      backgroundColor: 'rgba(22, 22, 22, .2)',
                      maxWidth: '100%',
                      width: '30%',
                      marginHorizontal: 5,
                      paddingVertical: 5,

                    }}
                    placeholder="Hora Fin"
                    placeholderTextColor="#666"
                    textAlign="center"
                    keyboardType="numeric"
                    value={timeReservaFin}
                    onChangeText={(value) => setTimeReservaFin(value)}
                  />

                </View>


                <Text
                  style={globalStyles.texts}>
                  Cantidad de lugares disponibles:</Text>
                <TouchableOpacity
                />

                <Text
                  style={globalStyles.texts}
                >Sectores disponibles: </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {sectoresResto.map((sector) => (
                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                        borderRadius: 10,
                        marginHorizontal: 5,
                        backgroundColor: "#bd967e",
                      }}
                      onPress={() => handleSectores(sector)}
                    >
                      <Text style={{ padding: 7 }}>{sector}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text
                  style={globalStyles.texts}
                >Resumen:</Text>
                <View style={{ borderWidth: 2, borderColor: "red" }}>
                  {sectorState !== [] ? sectorState.map((sector) => {
                    let counter = 0
                    return (
                      <View style={{
                        borderWidth: 2,
                        borderColor: "green",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around"
                      }}>
                        <Text style={{ marginRight: 45 }}>▪️{sector}</Text>

                        <TouchableOpacity
                          onPress={() => counter + 1}
                        >
                          <Text>+</Text>
                        </TouchableOpacity>

                        <Text>{counter}</Text>

                        <TouchableOpacity
                          onPress={() => counter - 1}
                        >
                          <Text>-</Text>
                        </TouchableOpacity>

                      </View>
                    )
                  }) : null}

                </View>



                <TouchableOpacity
                  style={globalStyles.touchLog}
                  onPress={() => handleGuardarModalAdmEmpresa()}
                >
                  <Text>Guardar</Text>
                </TouchableOpacity>

              </View>
            </View>
          </Modal>


        </TouchableOpacity >

        <TouchableOpacity
          onPress={() => alert("abro modal")}
          style={globalStyles.btnProfileResto}
        >
          <Icon name="clock" type="font-awesome-5" color="#392c28" size={24} />
          <Text style={{ fontSize: 25, color: "#392c28", textAlign: "center" }}>
            Editar Horario Comercial
            {/* clock */}
          </Text>
        </TouchableOpacity>
      </ScrollView >
    </View >
  );
};

export default ProfileResto;
