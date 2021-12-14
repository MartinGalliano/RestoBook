//----------REACT UTILS-----------
import React, { useState } from "react";
//
//----------REDUX UTILS-----------
import { useSelector } from "react-redux";
//
//----------REACT-NATIVE UTILS-----------
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Switch,
} from "react-native";
import { BottomSheet, ListItem } from "react-native-elements";
//
//----------FIREBASE UTILS-----------
import firebase from "../database/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
//
//---------SCREENS & COMPONENTS---------------

//
//-------STYLES-------
import globalStyles from "./GlobalStyles";
//
//-------INITIALIZATIONS-------
import { DEFAULT_FOOD_IMAGE, CLOUDINARY_URL, CLOUDINARY_CONSTANT } from "@env";
//
//-------FORMIK------------
import { Formik } from "formik";
//
//-------IMAGE PICKER----------
import * as ImagePicker from "expo-image-picker";
//
//-------YUP(Validacion)------
import * as yup from "yup";
//
//---------------------------------------------------------------------------------------//
//

const MenuRestoSchema = yup.object({
  foodName: yup.string().required().min(3).max(25),
  description: yup.string().required().min(5).max(60),
  price: yup.number().required().positive().integer().max(2000),
});

const AddMenuResto = ({ navigation }) => {
  const empresaDetail = useSelector((state) => state.empresaDetail);
  const [spinner, setSpinner] = useState(false);
  const idResto = empresaDetail.idResto;
  const [isVisible, setIsVisible] = useState(false);
  const [category, setCategory] = useState();
  const categories = useSelector((state) => state.categoriesMenu);
  const [selectedImage, setSelectedImage] = useState(DEFAULT_FOOD_IMAGE);
  const [uploading, setUploading] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
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
        setSelectedImage(str);

        setUploading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={globalStyles.Home}>
      <View style={globalStyles.inputComponent}>
        <Pressable onPress={() => setIsVisible(true)}>
          <TextInput
            style={globalStyles.texts}
            editable={false}
            placeholder="Seleccionar Categoria"
            value={category}
            onPressIn={() => setIsVisible(true)}
          />
        </Pressable>
        <BottomSheet
          isVisible={isVisible}
          containerStyle={{ backgroundColor: "#333a" }}
        >
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
                setCategory(categoria);
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
      <View style={globalStyles.switchComponent}>
        <Text style={globalStyles.textsSwitch}>Vegano? </Text>
        <Switch
          color="green"
          onValueChange={() => setVegan(!vegan)}
          value={vegan}
        />
      </View>
      <View style={globalStyles.switchComponent}>
        <Text style={globalStyles.textsSwitch}>Libre de gluten? </Text>
        <Switch
          color="green"
          onValueChange={() => setGlutenFree(!glutenFree)}
          value={glutenFree}
        />
      </View>

      <Formik
        initialValues={{
          foodName: "",
          description: "",
          price: "",
          category: "",
          img: selectedImage,
        }}
        validationSchema={MenuRestoSchema}
        onSubmit={async (values) => {
          const newValues = {
            foodName: values.foodName.toLowerCase(),
            description: values.description.toLowerCase(),
            price: values.price,
            category: category.toLowerCase(),
            img: selectedImage,
            vegan: vegan,
            glutenFree: glutenFree,
          };
          try {
            let restoRef = doc(firebase.db, "Restos", idResto);
            setSpinner(true);
            await updateDoc(restoRef, {
              menu: arrayUnion(newValues),
            });
            setSpinner(false);
            navigation.navigate("DetailsResto");
          } catch (err) {
            console.log(err);
          }
        }}
      >
        {(props) => (
          <View style={globalStyles.inputContainer}>
            <View style={globalStyles.inputComponent}>
              <TextInput
                style={globalStyles.texts}
                placeholder="Titulo"
                onChangeText={props.handleChange("foodName")}
                value={props.values.foodName}
                onBlur={props.handleBlur("foodName")}
              />
            </View>
            {props.touched.foodName && props.errors.foodName ? (
              <Text style={globalStyles.errorText}>
                {props.errors.foodName}
              </Text>
            ) : null}
            <View style={globalStyles.inputComponent}>
              <TextInput
                multiline
                style={globalStyles.texts}
                placeholder="Descripción"
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
                placeholder="Precio"
                onChangeText={props.handleChange("price")}
                value={props.values.price}
                keyboardType="numeric"
                onBlur={props.handleBlur("price")}
              />
            </View>
            <View style={globalStyles.inputComponent}>
              {/* <TextInput
                style={globalStyles.texts}
                placeholder="vegan"
                onChangeText={props.handleChange("price")}
                value={props.values.price}
                keyboardType="numeric"
                onBlur={props.handleBlur("price")}
              /> */}
            </View>
            {console.log("holis")}
            {props.touched.price && props.errors.price ? (
              <Text style={globalStyles.errorText}>{props.errors.price}</Text>
            ) : null}
            {uploading ? (
              <ActivityIndicator size="large" color="#5555" />
            ) : (
              <TouchableOpacity
                style={globalStyles.btnTodasComidas}
                onPress={openImagePickerAsync}
              >
                <Text style={globalStyles.texts}>
                  {props.values.img && props.values.img.length > 0
                    ? "Cambiar Imagen"
                    : "Seleccionar Imagen"}
                </Text>
              </TouchableOpacity>
            )}

            <Image
              source={{ uri: CLOUDINARY_CONSTANT + selectedImage }}
              style={{ width: 200, height: 200, borderRadius: 15 }}
            />

            <View style={globalStyles.btnTodasComidas}>
              <TouchableOpacity onPress={() => props.handleSubmit()}>
                <Text style={globalStyles.texts}>Agregar!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default AddMenuResto;
