import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

window.register = async function() {
    try {
        const email = document.getElementById("newEmail").value;
        const password = document.getElementById("newPassword").value;
        const role = document.querySelector('input[name="role"]:checked').value;

        if (!email || !password || !role) {
            alert("Por favor ingrese todos los campos.");
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        await setDoc(doc(db, "users", uid), {
            email: email,
            role: role
        });

        alert("¡Usuario registrado correctamente!");
        window.location.href = "index.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
};

document.getElementById("register-form").addEventListener("submit", function(e) {
    e.preventDefault();
    register();
});