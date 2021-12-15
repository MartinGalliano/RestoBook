//----------REACT UTILS-----------
import React, { useState } from "react";
//
//
//----------REDUX UTILS-----------
//
//
//----------FORMIK UTILS-----------
import { Formik } from "formik";
//
//
//----------REACT-NATIVE UTILS-----------
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

import { BottomSheet } from "react-native-elements";

//----------FIREBASE UTILS-----------
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithCredential,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  TwitterAuthProvider,
} from "firebase/auth";

import firebase from "../database/firebase";
import * as firebaseAuth from "firebase/auth";
//
//
//---------MATERIAL ICONS---------------
import { MaterialIcons } from "@expo/vector-icons";

//
//
//----------ENV-----------
import {
  GOOGLE_0AUTH_ANDROID_ID,
  GOOGLE_0AUTH_IOS_ID,
  DEFAULT_PROFILE_IMAGE,
} from "@env";
//
//
//---------EXPO---------------
import * as Google from "expo-google-app-auth";
//
//
//-------ICONS-------
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons"; //SE BORRA?
//
//
//-------STYLES-------
import globalStyles from "./GlobalStyles";
//
//
//-------INITIALIZATIONS-------
const auth = getAuth();
const provider = new GoogleAuthProvider();

//const googleProvider = new GoogleAuthProvider();
//
//-------YUP(Validacion)------
import * as yup from "yup";
import Btn from "./Helpers/Btns";
//
//---------------------------------------------------------------------------------------//
//

const GlobalLoginSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6).max(12),
});

const GlobalRegisterSchema = yup.object({
  name: yup.string().required(),
  lastName: yup.string().required(),
  cel: yup.number().required(),
  email: yup.string().required().email(),
  password: yup.string().required().min(6).max(12),
  passwordConfirm: yup
    .string()
    .required()
    .test(
      "password-match",
      "passwords must match",
      async (value, testContext) => testContext.parent.password === value
    ),
});

const resetPasSchema = yup.object({
  email: yup.string().required().email(),
});

const GlobalLogin = ({ navigation }) => {
  const [visible, isVisible] = useState(false);
  const [forgottvisible, isforgottVisible] = useState(false);
  const [forgottedMail, setForgottedMail] = useState("");
  const [flagLoginOrRegister, setFlagLoginOrRegister] = useState(true);
  const [flagSecureText, setFlagSecureText] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const Glogin = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId: GOOGLE_0AUTH_IOS_ID,
        androidClientId: GOOGLE_0AUTH_ANDROID_ID,
      });

      if (result.type === "success") {
        const credential = firebaseAuth.GoogleAuthProvider.credential(
          result.idToken,
          result.accessToken
        );

        // const credential = (result.idToken, result.accessToken);
        signInWithCredential(auth, credential).catch((error) => {
          console.log(error);
          alert("error!");
        });

        navigation.navigate("RestoBook");
      }
    } catch ({ message }) {
      alert("login: Error" + message);
    }
  };

  if (flagLoginOrRegister) {
    return (
      //------------LOGIN---------------

      <View style={globalStyles.Home}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            paddingVertical: 5,
            color: "#161616",
            letterSpacing: 1,
          }}
        >
          Iniciar Sesión
        </Text>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={GlobalLoginSchema}
          onSubmit={async ({ email, password }) => {
            try {
              const newUser = await signInWithEmailAndPassword(
                auth,
                email,
                password
              );
              if (auth.currentUser.emailVerified) {
                //alert("Welcome");
                navigation.navigate("RestoBook");
              } else {
                navigation.navigate("AwaitEmail");
              }
            } catch (err) {
              alert(err);
            }
          }}
        >
          {(props) => (
            <View style={globalStyles.inputContainer}>
              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Email"
                  placeholderTextColor="#666"
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
                  placeholder="Password"
                  placeholderTextColor="#666"
                  onChangeText={props.handleChange("password")}
                  value={props.values.password}
                  secureTextEntry={flagSecureText}
                  onBlur={props.handleBlur("password")}
                />
              </View>
              {props.touched.password && props.errors.password ? (
                <Text style={globalStyles.errorText}>
                  {props.errors.password}
                </Text>
              ) : null}
              <TouchableOpacity
                style={globalStyles.eye}
                onPress={() =>
                  flagSecureText
                    ? setFlagSecureText(false)
                    : setFlagSecureText(true)
                }
              >
                <Icon
                  name={flagSecureText ? "eye-off" : "eye"}
                  size={20}
                  style={{ alignSelf: "center" }}
                />
              </TouchableOpacity>
              <View style={globalStyles.btnContainerLogin}>
                <TouchableOpacity
                  style={globalStyles.btnTodasComidas}
                  onPress={() => props.handleSubmit()}
                >
                  <Text style={globalStyles.fontLog}>Ingresar</Text>
                </TouchableOpacity>
                {googleLoading ? (
                  <ActivityIndicator size="large" color="#5555" />
                ) : (
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={() => {
                      setGoogleLoading(true);
                      Glogin();
                    }}
                  >
                    <Image
                      style={globalStyles.img}
                      source={require("../assets/googleIcon2.png")}
                    ></Image>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={globalStyles.btnLogin}
                  onPress={() => {
                    isforgottVisible(true);
                  }}
                >
                  <Text style={globalStyles.fontLog}>Olvidé mi contraseña</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={globalStyles.btnLogin}
                  onPress={() => setFlagLoginOrRegister(false)}
                >
                  <Text style={globalStyles.fontLog}>
                    No tengo una cuenta todavia
                  </Text>
                </TouchableOpacity>

                {/*----------------MODAL RESET PASS---------------------- */}

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={forgottvisible}
                  onRequestClose={() => {
                    isforgottVisible(!forgottvisible);
                  }}
                >
                  <Formik
                    initialValues={{
                      email: "",
                    }}
                    validationSchema={resetPasSchema}
                    onSubmit={({ email }) => {
                      sendPasswordResetEmail(auth, email)
                        .then(alert("Revisa tu casilla!"))
                        .then(isforgottVisible(!forgottvisible));
                    }}
                  >
                    {(props) => (
                      <View style={globalStyles.centeredView}>
                        <View style={globalStyles.modalView}>
                          <TouchableOpacity
                            style={globalStyles.btnCloseMenu}
                            onPress={() => isforgottVisible(!forgottvisible)}
                          >
                            <MaterialIcons
                              name="arrow-back-ios"
                              size={20}
                              color="#161616"
                            ></MaterialIcons>
                          </TouchableOpacity>
                          <Text
                            style={{
                              textAlign: "center",
                              fontSize: 30,
                              paddingVertical: 5,
                              color: "#161616",
                              letterSpacing: 1,
                            }}
                          >
                            Recuperar Contraseña
                          </Text>
                          <View style={globalStyles.inputComponent}>
                            <TextInput
                              style={globalStyles.texts}
                              placeholder="email"
                              placeholderTextColor="#666"
                              textAlign="center"
                              onChangeText={props.handleChange("email")}
                              value={props.values.email}
                              onBlur={props.handleBlur("email")}
                            />
                          </View>
                          {props.touched.email && props.errors.email ? (
                            <Text style={globalStyles.errorText}>
                              {props.errors.email}
                            </Text>
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

                <BottomSheet
                  isVisible={TwitterAuthProvider}
                  style={styles.forgottenPass}
                >
                  <View>
                    <TouchableOpacity onPress={() => isforgottVisible(false)}>
                      <Text>X</Text>
                    </TouchableOpacity>
                    <TextInput
                      placeholder="........"
                      style={styles.inputForgotten}
                      onChangeText={(value) => setForgottedMail(value)}
                    ></TextInput>
                    <TouchableOpacity
                      onPress={() => {
                        sendPasswordResetEmail(auth, forgottedMail)
                          .then(alert("Revisa tu casilla!"))
                          .then(isforgottVisible(false));
                      }}
                    >
                      <Text>Enviar</Text>
                    </TouchableOpacity>
                  </View>
                </BottomSheet>
              </View>
            </View>
          )}
        </Formik>
      </View>
    );
  } else {
    return (
      //-------------------REGISTER---------------------
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={globalStyles.modalInputContainer}
      >
        <View>
          <Modal animationType="slide" transparent={true}>
            <View View style={globalStyles.centeredView}>
              <View style={globalStyles.modalView}>
                <TouchableOpacity
                  style={globalStyles.btnTodasComidas}
                  onPress={() => setFlagLoginOrRegister(!flagLoginOrRegister)}
                >
                  <Text style={globalStyles.texts}> X </Text>
                </TouchableOpacity>
                <Formik
                  initialValues={{
                    name: "",
                    lastName: "",
                    cel: "",
                    email: "",
                    password: "",
                    passwordConfirm: "",
                  }}
                  validationSchema={GlobalRegisterSchema}
                  onSubmit={async (values) => {
                    //console.log(values);
                    try {
                      //-----AUTENTICA USER-----------
                      await createUserWithEmailAndPassword(
                        auth,
                        values.email,
                        values.password
                      );
                      onAuthStateChanged(auth, (usuarioFirebase) => {
                        if (usuarioFirebase) {
                          //-----AGREGA A COLECCION USER--------
                          firebase.db
                            .collection("Users")
                            .doc(auth.currentUser.uid)
                            .set({
                              id: auth.currentUser.uid,
                              name: values.name.toLowerCase(),
                              lastName: values.lastName.toLowerCase(),
                              cel: values.cel,
                              email: values.email.toLowerCase(),
                              commerce: false,
                              multiCommerce: false,
                              profileImage: DEFAULT_PROFILE_IMAGE,
                              reservations: [],
                              payments: [],
                              favourites: [],
                            })
                            .then(sendEmailVerification(auth.currentUser))
                            .then(setFlagLoginOrRegister(true))
                            .then(isVisible(false))
                            .then(navigation.navigate("AwaitEmail"));
                        }
                      });
                    } catch (err) {
                      alert(err);
                    }
                  }}
                >
                  {(props) => (
                    <ScrollView
                      contentContainerStyle={{ alignItems: "center" }}
                    >
                      <View style={globalStyles.modalInputContainer}>
                        <Text style={styles.modalText}>
                          Registrarse en RestoBook
                        </Text>
                        <View style={globalStyles.inputComponent}>
                          <TextInput
                            style={globalStyles.texts}
                            placeholder="Nombre"
                            placeholderTextColor="#666"
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
                            placeholder="Telephone"
                            placeholderTextColor="#666"
                            onChangeText={props.handleChange("cel")}
                            value={props.values.cel}
                            onBlur={props.handleBlur("cel")}
                            keyboardType="numeric"
                          />
                        </View>
                        {props.touched.cel && props.errors.cel ? (
                          <Text style={globalStyles.errorText}>
                            {props.errors.cel}
                          </Text>
                        ) : null}
                        <View style={globalStyles.inputComponent}>
                          <TextInput
                            style={globalStyles.texts}
                            placeholder="Email"
                            placeholderTextColor="#666"
                            onChangeText={props.handleChange("email")}
                            value={props.values.email}
                            onBlur={props.handleBlur("email")}
                          />
                        </View>
                        {props.touched.email && props.errors.email ? (
                          <Text style={globalStyles.errorText}>
                            {props.errors.email}
                          </Text>
                        ) : null}
                        <View style={globalStyles.inputComponent}>
                          <TextInput
                            style={globalStyles.texts}
                            placeholder="password"
                            placeholderTextColor="#666"
                            onChangeText={props.handleChange("password")}
                            value={props.values.password}
                            secureTextEntry={flagSecureText}
                            onBlur={props.handleBlur("password")}
                          />
                        </View>
                        {props.touched.password && props.errors.password ? (
                          <Text style={globalStyles.errorText}>
                            {props.errors.password}
                          </Text>
                        ) : null}
                        <View style={globalStyles.inputComponent}>
                          <TextInput
                            style={globalStyles.texts}
                            placeholder="Confirm password"
                            placeholderTextColor="#666"
                            onChangeText={props.handleChange("passwordConfirm")}
                            value={props.values.passwordConfirm}
                            secureTextEntry={flagSecureText}
                            onBlur={props.handleBlur("passwordConfirm")}
                          />
                        </View>
                        {props.touched.passwordConfirm &&
                        props.errors.passwordConfirm ? (
                          <Text style={globalStyles.errorText}>
                            {props.errors.passwordConfirm}
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          style={globalStyles.eye}
                          onPress={() =>
                            flagSecureText
                              ? setFlagSecureText(false)
                              : setFlagSecureText(true)
                          }
                        >
                          <Icon
                            name={flagSecureText ? "eye-off" : "eye"}
                            size={20}
                          />
                        </TouchableOpacity>

                        <View style={globalStyles.btnContainerLogin}>
                          <TouchableOpacity
                            style={globalStyles.btnLogin}
                            onPress={() => {
                              props.handleSubmit() &&
                                setFlagLoginOrRegister(true);
                            }}
                          >
                            <Text style={globalStyles.fontLog}>
                              Registrarse
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={globalStyles.btnLogin}
                            onPress={() => setFlagLoginOrRegister(true)}
                          >
                            <Text style={globalStyles.fontLog}>
                              Ya tengo una cuenta
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </ScrollView>
                  )}
                </Formik>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    );
  }
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
    //backgroundColor: "blur",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: "50%",
    height: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 30,
      height: 30,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  botton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    //float: "right",
  },
  bottonClose: {
    backgroundColor: "#2196F3",
  },
  googleButton: {
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
});

export default GlobalLogin;
