import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function cargarCreditos() {
  const lista = document.getElementById("listaCreditos");
  lista.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "creditos"));
  querySnapshot.forEach(docSnap => {
    const c = docSnap.data();
    const li = document.createElement("li");
    li.textContent = `${c.cliente} - $${c.monto} - ${c.estado}`;
    lista.appendChild(li);
  });
}

cargarCreditos();
