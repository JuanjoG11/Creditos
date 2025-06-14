import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDyMLvnqZ0Mw94pSe63SLYz6IdlUIBdz_Y",
  authDomain: "invercredito-5d3d5.firebaseapp.com",
  projectId: "invercredito-5d3d5",
  storageBucket: "invercredito-5d3d5.appspot.com",
  messagingSenderId: "18920429698",
  appId: "1:18920429698:web:9897945450ebb1fe38fc9b"
};

// Inicialización
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
