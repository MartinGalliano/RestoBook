import React from "react";
import { Provider } from "react-redux";
import { store } from "./Redux/Store.js";
import "react-native-gesture-handler";
import Navigator from "./routes/Navigator.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
]);
LogBox.ignoreLogs([
  "Can't perform a React state update on an unmounted component.",
]);
LogBox.ignoreLogs([
  "Animated.event now requires a second argument for options",
]);
LogBox.ignoreLogs([
  "Can't open url: about:srcdoc",
]);
export default function App() {
  // const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}
