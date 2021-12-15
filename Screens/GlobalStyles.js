import React from "react";
import { StyleSheet } from "react-native";
const globalStyles = StyleSheet.create({
  
  //------------------------------------------HOME---------------------------------------------
  Home: {
    flex: 1,
    backgroundColor: "#fdfdfd",
  },
  btnHome: {
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  btnText: {
    /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
    fontSize: 10,
    color: "#eccdaa",
    textAlign: "center",
  },
  btnTextFiltro: {
    // paddingTop: 2,
    fontSize: 14,
    color: "#161616",
    fontWeight: "bold",
  },
  btnContainer: {
  /*   fontFamily: "BeVietnamPro-Black", */
    fontFamily: "BeVietnamPro-Bold",
  /*   fontFamily: "BeVietnamPro-ExtraBold", */
   /*  fontFamily: "BeVietnamPro-Light",
    fontFamily: "BeVietnamPro-Medium",
    fontFamily: "BeVietnamPro-Regular",
    fontFamily: "BeVietnamPro-SemiBold", */
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "40%",
    // backgroundColor: 'red'
  },
  Container: {
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#161616",
    paddingVertical: 8,
    paddingHorizontal: 9,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#eccdaa",

    shadowColor: "#fdfdfd",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 60,
    shadowRadius: 4.84,
    elevation: 10,
  },
  btnFiltrosHome: {
     /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
    backgroundColor: "#fdfdfd",
    paddingVertical: 5,
    paddingHorizontal: 9,
    marginVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#eccdaa",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 6,
  },
  img: {
    height: 50,
    width: 640,
    resizeMode: "contain", // esta linea es para que se adapte al tam;o de la imagen
  },
  // --------------------------------------------CARD HOME --------------------------------------------
  cardsContainer: {
    flex: 1,
    alignSelf: "center",
    backgroundColor: "#f2f2f2",
    marginHorizontal: 10,
    marginVertical: 8,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 25,
    width: "95%",
    height: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.84,

    elevation: 5,
  },
  menuCardsContainer: {
    flex: 1,
    alignSelf: "center",
    width: "95%",
    height: 150,
    marginVertical: 5,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: "#f2f2f2",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.84,
    elevation: 5,
  },
  containerImgCard: {
    width: "31.6%",
    maxHeight: "5%",
    padding: 5,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  cardsHomeimg: {
    marginTop: 20,
    resizeMode: "contain",
    // backgroundColor: "red",
    width: 80,
    height: 80,
    borderRadius: 25,
  },
  cardsMenuimg: {
    width: 80,
    height: 80,
    borderRadius: 25,
  },
  cardsDescriptionContainer: {
    // backgroundColor: 'green',
    maxHeight: "120%",
    height: "90%",
    marginLeft: 20,
    width: "50%",
    alignSelf: "center",
    justifyContent: "space-around",
  },
  cardsDescriptionText: {
    //backgroundColor: 'lightblue',
    textAlign: "center",
    width: "100%",
    justifyContent: "space-around",
    fontSize: 12,
    height: 50,
    fontWeight: "bold",
    maxHeight: "120%",
  },
  cardsHomeTitle: {
    // backgroundColor: "#5555",
     /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
    fontSize: 25,
    textAlign: "center",
    width: "100%",
    color: "#161616",
    textTransform: "capitalize",
  },
  btnContainerCard: {
    // backgroundColor: 'violet',
    maxHeight: "120%",
    height: 120,
    width: "20.6%",
    alignSelf: "flex-end",
    alignItems: "center",
    marginTop: -120,
    justifyContent: "space-around",
  },
  wspImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  /// --------------------------------------------ACA TERMINAN  LOS ESTILOS DE LAS CARDS HOM -------
  //------------------------------CARDS MENU y DETAIL RESTO-----------------------------------------------------------------
  headerResto: {
    flexDirection: "row",
    backgroundColor: "#eccdaa",
    borderColor: "rgba(22, 22, 22, .2)",
    borderBottomWidth: 1,
    justifyContent: "center",
    shadowColor: "#161616",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 60,
    shadowRadius: 4.84,

    elevation: 5,
  },
  cardsMenuContainer: {
    flex: 1,
    alignSelf: "center",
    backgroundColor: "#f6efd3",
    marginVertical: 5,
    // paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 25,
    width: "100%",
    height: 150,
  },
  cardsMenuDescriptionContainer: {
    maxHeight: "120%",
    height: "100%",
    width: "75%",
    alignSelf: "flex-start",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  cardsMenuTitle: {
    textTransform: "capitalize",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
  },
  cardsMenuDescriptionText: {
    width: "90%",
    textAlign: "left",
    fontSize: 15,
    color: "grey",
    marginTop: -15,
  },
  containerImgCardMenu: {
    width: "25%",
    maxHeight: "5%",
    alignSelf: "flex-end",
    alignItems: "flex-end",
    marginTop: "-31.5%",
    marginRight: "3.5%",
  },
  cardsMenuimg: {
    // marginTop: 5,
    // backgroundColor: "red",
    width: 110,
    height: 120,
    borderRadius: 25,
    justifyContent: "center",
  },

  btnTodasComidas: {
    marginVertical: 7,
    width: "95%",
    height: 30,
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#eccdaa",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.84,

    elevation: 5,
  },
  categoriesViewDetail: {
    backgroundColor: "#4E4E4E",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(22, 22, 22, .2)",
    paddingVertical: 2,
    paddingHorizontal: 5,
    shadowColor: "#161616",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 60,
    shadowRadius: 4.84,

    elevation: 8,
  },
  descriptionRestoContainer : {
        borderRadius: 15,
        marginVertical: 15,
        width: "95%",
        height: "25%",
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        justifyContent: "space-around",
        paddingHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
  },
  textoDescription : {
            textAlign: "center",
            fontSize: 15,
            color: "#161616",
            fontWeight: 'bold',
            textTransform: "capitalize"
  },
  //------------------------------------------------------------------------------------------------------

  // --------------------------------------------CATEGORIAS LOCAL --------------------------------------------
  categoriesView: {
    backgroundColor: "#4E4E4E",
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderWidth: 1,
    // borderColor: "#161616",

    //backgroundColor: "red",
  },
  categoriesText: {
       /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
    fontSize: 13,
    padding: 1,
    textAlign: "center",
    color: "#ECCDAA",
    textTransform: "capitalize",
    
  },
  //----------------------------ACA TERMINA CATEGORIAS LOCALES --------------------------------------------

  // ---------------------------- PROFILE USER Y RESTO  Y CARD FAVOURITE ----------------------------------------------------
  Perfilcontainer: {
    flex: 1,
    backgroundColor: "#fdfdfd",
  },
  imgContainer: {
    flex: 2,
    flexDirection: "row",
    marginTop: 5,
    // backgroundColor: 'red',
    maxHeight: "25%",
    maxWidth: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  imgProfile: {
    height: 150,
    width: 150,
    borderRadius: 200,
    // resizeMode: 'contain' // esta linea es para que se adapte al tam;o de la imagen
  },
  nombreContainer: {
    flex: 2,
    // backgroundColor: 'grey',
    // marginHorizontal: 5,
    maxWidth: "60%",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  FavouriteContainer: {
    overflow: "scroll",
    backgroundColor: "#fdfdfd",
    maxHeight: "25%",
    height: "100%",
  },

  btnProfileResto: {
    color: "transparent",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 3,
    marginVertical: 4,
    height: "9%",
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
  },
  cardsFavouriteContainer: {
    justifyContent: 'center',
    backgroundColor: "#f2f2f2",
    // marginHorizontal: -5,
    // marginVertical: 5,
    // paddingHorizontal: 5,
    // paddingVertical: 5,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(22, 22, 22, .2)",
    width: "100%",
    height: "100%",
    shadowColor: "#161616",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.84,

    elevation: 5,
  },
  // ------------------------------------------------------------------------------------------------------
  //------------------------------MODAL PROFILES-----------------------------------------------------------
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    //backgroundColor: "blur",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    height: "90%",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 30,
      height: 30,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  centeredMenuView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    // backgroundColor: "blue",
  },

  modalMenuView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: "100%",
    height: "95%",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 30,
      height: 30,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalMenuText: {
    marginVertical: 5,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  btnCloseMenu: {
    marginVertical: 7,
    width: "25%",
    height: 30,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#eccdaa",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.84,

    elevation: 5,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginVertical: 10,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  //------------------------------------------------------------------------------------------------------
  //-------------------------------MODAL LOGIN Y DETAIL RESTO---------------------------------------------
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
  btnDetail: {
    backgroundColor: "#fdfdfd",
    paddingVertical: 5,
    paddingHorizontal: 9,
    marginVertical: 7,
    borderRadius: 15,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 2,
    width: "95%",
    borderColor: "#eccdaa",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 6,
  },
  //------------------------------------------------------------------------------------------------------
  title: {
     /*   fontFamily: "BeVietnamPro-Black", */
 fontFamily: "BeVietnamPro-Bold",
 /*   fontFamily: "BeVietnamPro-ExtraBold", */
  /*  fontFamily: "BeVietnamPro-Light",
   fontFamily: "BeVietnamPro-Medium",
   fontFamily: "BeVietnamPro-Regular",
   fontFamily: "BeVietnamPro-SemiBold", */
    fontSize: 25,  
    paddingVertical: 10,
    paddingHorizontal: 5,
    color: "#ECCDAA",
  },
  componentTitle: {
    alignSelf: "center",
    marginTop: 10,
    fontSize: 30,
  },
  containerTitle: {
    flexDirection: "row",
  },
  navHome: {
    flexDirection: "row",
    width: "100%",
    // backgroundColor: "#161616",
  },
  touchLog: {
    marginTop: 10,
    maxWidth: "100%",
    width: "50%",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#bd967e",
    padding: 10,
  },
  touchFlag: {
    marginTop: 10,
    maxWidth: "100%",
    width: "50%",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ffdfcb",
    borderWidth: 2,
    borderColor: "#bd967e",
    padding: 10,
  },
  fontLog: {
    color: "#392c28",
    fontWeight: "bold",
    textAlign: "center",
  },
  btnContainerLogin: {
    flex: 6,
    alignItems: "center",
    maxWidth: "80%",
    width: "100%",
    maxHeight: "70%",
    height: "100%",
  },
  btnLogin: {
    marginVertical: 7,
    width: "95%",
    height: 30,
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#161616",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.84,

    elevation: 5,
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    width: "100%",
  },
  texts: {
    color: "#000",
    textAlign: "center",
    width: "100%",
    fontSize: 15,
    fontWeight: "bold",
    // marginBottom: -10,
    paddingVertical: 1,
  },

  textsSwitch: {
    color: "#858383",
    textAlign: "center",
    width: "50%",
    fontSize: 15,
    fontWeight: "bold",
    // marginBottom: -10,
    paddingVertical: 1,
  },
  textDownButton: {
    textAlign: "center",

    width: "100%",
    fontSize: 13,
    marginTop: 5,
  },
  errorText: {
    textAlign: "center",
    width: "100%",
    fontSize: 12,
  },
  textContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    width: "70%",
  },
  inputContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  inputComponent: {
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(22, 22, 22, .2)",
    maxWidth: "100%",
    width: "60%",
  },
  switchComponent: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(22, 22, 22, .2)",
    maxWidth: "100%",
    width: "60%",
  },

  modalInputContainer: {
    flex: 2,
    alignItems: "center",
    maxWidth: "100%",
    width: "80%",
  },
});

export default globalStyles;
