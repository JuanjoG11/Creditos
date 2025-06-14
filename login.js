import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

window.login = async function() {
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Por favor ingrese todos los campos.");
            return;
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const role = docSnap.data().role;
            if (role === "administrador") {
                window.location.href = "admin_dash.html";
            } else if (role === "tecnico") {
                window.location.href = "tecn_dash.html";
            } else {
                alert("Rol no válido.");
            }
        } else {
            alert("No se encontró la información del usuario.");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
};

document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    login();
});