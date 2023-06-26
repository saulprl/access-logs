import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@emotion/react";

import theme from "./theme.ts";
import { GlobalStyles } from "./global.styles.tsx";
import { FirebaseAppProvider } from "reactfire";

const firebaseConfig = {
  apiKey: "AIzaSyA1_1__8WGAOfbO9hfVLsbH1BG-D-0MSTs",
  authDomain: "csi-door.firebaseapp.com",
  databaseURL: "https://csi-door-default-rtdb.firebaseio.com",
  projectId: "csi-door",
  storageBucket: "csi-door.appspot.com",
  messagingSenderId: "1050055617140",
  appId: "1:1050055617140:web:395906b756eea2c9347f21",
  measurementId: "G-00DZWQ6MVG",
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);
