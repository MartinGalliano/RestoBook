import {
  ADD_EMPRESA,
  EMPRESA_DETAIL,
  ADD_MENU,
  CURRENT_USER,
  CURRENT_ID,
  SET_COMMERCE,
  USER_FAVOURITES,
  GET_COMMERCE_INFO,
  SET_USER_LOCATION,
} from "./Actions/Constants.js";

let initialState = {
  empresas: [],
  menus: [],
  commerce: 0,
  currentId: null,
  currentUser: {},
  empresaDetail: [],
  commerceInfo: null,
  userCoordinates: {},
  favourites: [],
  categoriesResto: [
    "Pizzas/Empanadas",
    "Rotiseria",
    "Pastas",
    "Parrilla",
    "Sushi",
    "Hamburguesas",
    "Fingerfood",
    "Drinks",
    "Otros",
  ],
  categoriesMenu: [
    "Pizzas",
    "Pastas",
    "Bebidas",
    "Guarniciones",
    "Postres",
    "Plato Principales",
  ],
  sectoresResto: ["Terraza", "Salón Principal", "Patio", "Vereda"],
};

const RootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MENU:
      const menu = action.payload;
      return {
        ...state,
        menus: [...state.menus, menu],
      };
    case EMPRESA_DETAIL:
      const empresaDetail = action.payload;

      return {
        ...state,
        empresaDetail: empresaDetail,
      };
    case ADD_EMPRESA:
      return {
        ...state,
        empresas: [...state.empresas, action.payload],
      };
    case CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case CURRENT_ID:
      return {
        ...state,
        currentId: action.payload,
      };
    case SET_COMMERCE:
      return {
        ...state,
        commerce: commerce + action.payload,
      };
    case USER_FAVOURITES:
      return {
        ...state,
        favourites: action.payload,
      };
    case GET_COMMERCE_INFO:
      return {
        ...state,
        commerceInfo: action.payload,
      };
    case SET_USER_LOCATION:
      return {
        ...state,
        userCoordinates: action.payload,
      };
    default:
      return state;
  }
};

export default RootReducer;
