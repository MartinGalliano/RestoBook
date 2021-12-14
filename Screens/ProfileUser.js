import React, { useState, useRef, useEffect } from "react";
import { CLOUDINARY_URL, CLOUDINARY_CONSTANT } from "@env";
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
import Carousel from 'react-native-snap-carousel';

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
import StarFilled from "react-native-vector-icons/AntDesign";
import TagOutlined from "react-native-vector-icons/AntDesign";
//--------------------------------
//---------STYLES-----------------
import globalStyles from "./GlobalStyles";
//--------------------------------
//-------COMPONENTS---------------
import CardReservation from "../components/CardReservation";
import CardFavourite from "../components/CardFavourite";

//---------------------------------

const auth = getAuth();


const ProfileUser = ({ navigation }) => {
  const loggedId = useSelector((state) => state.currentId);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [newUserInfo, setNewUserInfo] = useState({});
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");
  const [myFavourites, setMyFavourites] = useState();
  const [reservas, setReservas] = useState()
  // useEffect(() => {
  //   const getFavs = async () => {
  //     const docRef = doc(firebase.db, "Users", loggedId);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists) {
  //       let obj = docSnap.data().favourites;
  //       setMyFavourites(obj);
  //     }
  //     console.log("DOC PROFILE 98");
  //   };

  //   getFavs();
  // }, []);

  useEffect(() => {
    const getInfo = async () => {
      const docRef = doc(firebase.db, "Users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let obj = docSnap.data();
        setImage(obj.profileImage);
        setCurrentUser(obj);
        setNewUserInfo(obj);
        setMyFavourites(obj.favourites);
        setReservas(obj.reservations)
      } else {
        alert("NO HAY INFO");
      }
    };
    getInfo();
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
        firebase.db.collection("Users").doc(loggedId).update({
          profileImage: str,
        });
        setUploading(false);
      })
      .catch((err) => console.log(err));
  };

  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={globalStyles.cardsFavouriteContainer}
        key={item.idResto}
      >
        <CardFavourite
          key={index}
          resto={item}
          navigation={navigation}
          setMyFavourites={setMyFavourites}
          myFavourites={myFavourites}
        >
        </CardFavourite>
      </View>
    )
  }

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
              textTransform: "capitalize"
            }}
          >
            {currentUser?.name}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#161616",
              paddingVertical: 15,
            }}
          >
            {currentUser?.email}
          </Text>
          <TouchableOpacity
            style={globalStyles.btnLogin}
            onPress={() => setModalVisible(true)}
          >
            <Text style={globalStyles.texts}>Editar</Text>
          </TouchableOpacity>
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
                  <Text style={globalStyles.texts}>X</Text>
                </TouchableOpacity>
                <Text style={globalStyles.modalText}>
                  Edita tu informacion
                </Text>
                <Text style={globalStyles.texts}>Nombre:</Text>
                <TextInput
                  style={globalStyles.inputComponent}
                  placeholder={currentUser?.name}
                  placeholderTextColor="#666"
                  textAlign="center"
                  onChangeText={(value) =>
                    setNewUserInfo({
                      ...newUserInfo,
                      name: value,
                    })
                  }
                />
                <Text style={globalStyles.texts}>Apellido:</Text>
                <TextInput
                  style={globalStyles.inputComponent}
                  placeholder={currentUser?.lastName}
                  placeholderTextColor="#666"
                  textAlign="center"
                  onChangeText={(value) =>
                    setNewUserInfo({
                      ...newUserInfo,
                      lastName: value,
                    })
                  }
                />
                <Text style={globalStyles.texts}>Celular:</Text>
                <TextInput
                  style={globalStyles.inputComponent}
                  placeholder={currentUser?.cel}
                  placeholderTextColor="#666"
                  textAlign="center"
                  onChangeText={(value) =>
                    setNewUserInfo({
                      ...newUserInfo,
                      cel: value,
                    })
                  }
                />
                <TouchableOpacity
                  style={globalStyles.btnLogin}
                  onPress={() => {
                    Alert.alert(
                      "¿Seguro que quieres cambiar tu contraseña?",
                      "Cerraremos tu sesión y te enviaremos un email para reestablecerla.",
                      [
                        {
                          style: "cancel",
                          text: "Cancelar",
                        },
                        {
                          text: "Ok",
                          onPress: () => {
                            sendPasswordResetEmail(auth, currentUser?.email)
                              .then(signOut(auth))
                              .then(setModalVisible(false))
                              .then(navigation.navigate("RestoBook"));
                          },
                        },
                      ],
                      {
                        cancelable: true,
                      }
                    );
                  }}
                >
                  <Text style={globalStyles.texts}>Cambiar contraseña</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={globalStyles.btnLogin}
                  onPress={() => {
                    firebase.db
                      .collection("Users")
                      .doc(currentUser.id)
                      .update({
                        name: newUserInfo.name,
                        lastName: newUserInfo.lastName,
                        cel: newUserInfo.cel,
                      })
                      .then(alert("cambios guardados!"))
                      .then(setModalVisible(false))
                      .catch((error) => alert("error!"));
                  }}
                >
                  <Text style={globalStyles.texts}>Guardar cambios</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
     
        <Text
          style={{
            fontSize: 25,
            color: "#161616",
            textAlign: "center",
            marginTop: 5,
          }}
        >
          {" "}
          <StarFilled name="star" color="#161616" size={25} /> Mis Favoritos
        </Text>
        <Divider
          orientation="horizontal"
          width={2}
          inset={true}
          insetType={"middle"}
          color={"rgba(00, 00, 00, .5)"}
          style={{ marginVertical: 5 }}
        />

        {!myFavourites?.length ? <View style={globalStyles.FavouriteContainer}>
          <Text style={{ textAlign: "center", color: "grey", textAlignVertical: 'center', fontWeight: "bold" }}>Aún no tienes favoritos! Cuando los agregues aparecerán aqui
          </Text>
        </View>
          :
          (<View style={globalStyles.FavouriteContainer} >
            <Carousel
              data={myFavourites}
              renderItem={renderItem}
              itemWidth={305}
              sliderWidth={400}
              inactiveSlideShift={1}
              useScrollView={true}
              layout={'default'}
            />
          </View>)
        }

        <View style={{
          flex: 1,
          maxHeight: "100%",
          height: '20%',
          backgroundColor: "#fdfdfd",

        }}>
          <View>
            <Text
              style={{
                fontSize: 25,
                color: "#161616",
                textAlign: "center",
                marginTop: 5,
              }}
            >
              <TagOutlined name="tag" color="#161616" size={25} /> Mis Reservas
            </Text>
            <Divider
              orientation="horizontal"
              width={2}
              inset={true}
              insetType={"middle"}
              color={"rgba(00, 00, 00, .5)"}
              style={{ marginVertical: 5 }}
            />
          </View>
          <ScrollView style={{ padding: 10 }}>
            {reservas?.map((reserva, index) => {
              // console.log(reserva)
              return (
                <CardReservation
                  key={index}
                  date={reserva.date.date}
                  cantCupos={reserva.cantCupos}
                  nameResto={reserva.nameResto}
                  statusReserva={reserva.statusReserva}
                  idReserva={reserva.idReserva}
                  address={reserva.address}
                  navigation={navigation}
                  idResto={reserva.idResto}
                />
              );
            })}
          </ScrollView>
        </View>
      </View>
  );
};

export default ProfileUser;
