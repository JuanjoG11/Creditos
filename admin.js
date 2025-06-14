import { auth, db } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔁 Cargar créditos desde Firestore
async function cargarCreditos() {
    const creditosRef = collection(db, "creditos");
    const querySnapshot = await getDocs(creditosRef);
    const creditosList = document.getElementById("creditos-list");
    let totalGeneral = 0;
    
    creditosList.innerHTML = ""; // Limpia la tabla antes de llenar
    
    querySnapshot.forEach((docItem) => {
        const credito = docItem.data();
        const totalOriginal = credito.monto;
        const abonos = credito.abonos || 0;
        const totalRestante = totalOriginal - abonos;
        const interes = totalOriginal * 0.20;
        const gananciaAcumulada = interes;
        totalGeneral += gananciaAcumulada;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${credito.cliente}</td>
            <td>${formatearMoneda(totalOriginal)}</td>
            <td>${formatearMoneda(abonos)}</td>
            <td>${formatearMoneda(totalRestante)}</td>
            <td>${formatearMoneda(interes)}</td>
            <td>${formatearMoneda(gananciaAcumulada)}</td>
            <td>
                <input type="number" id="abono-${docItem.id}" placeholder="Monto Abono" style="width: 100px;">
                <button onclick="realizarAbono('${docItem.id}')">Abonar</button>
            </td>
        `;
        creditosList.appendChild(row);
    });

    // Actualiza el total general
    const totalElement = document.getElementById("total-general");
    totalElement.textContent = formatearMoneda(totalGeneral);
}

// 💰 Realizar abono
window.realizarAbono = async function (idCredito) {
    const abonoInput = document.getElementById(`abono-${idCredito}`);
    const montoAbono = parseFloat(abonoInput.value);
    
    if (isNaN(montoAbono) || montoAbono <= 0) {
        alert("Por favor ingrese un monto válido.");
        return;
    }

    const creditoRef = doc(db, "creditos", idCredito);
    const creditoDoc = await getDoc(creditoRef);

    if (creditoDoc.exists()) {
        const creditoData = creditoDoc.data();
        const nuevoAbono = (creditoData.abonos || 0) + montoAbono;
        await updateDoc(creditoRef, {
            abonos: nuevoAbono
        });
        alert("¡Abono realizado exitosamente!");
        cargarCreditos();
    } else {
        alert("Crédito no encontrado.");
    }
};

// ➕ Crear nuevo crédito
document.getElementById("form-crear-credito").addEventListener("submit", async function (e) {
    e.preventDefault();
    const cliente = document.getElementById("cliente-nombre").value;
    const monto = parseFloat(document.getElementById("cliente-monto").value);

    if (!cliente || isNaN(monto) || monto <= 0) {
        alert("Por favor ingresa un nombre válido y un monto mayor a cero.");
        return;
    }

    try {
        await addDoc(collection(db, "creditos"), {
            cliente: cliente,
            monto: monto,
            abonos: 0
        });
        alert("Crédito creado exitosamente.");
        document.getElementById("form-crear-credito").reset();
        cargarCreditos();
    } catch (error) {
        alert("Error al crear el crédito: " + error.message);
    }
});

// 🧾 Formatear a COP
function formatearMoneda(cantidad) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(cantidad);
}

// 🔒 Cerrar sesión
window.logout = function () {
    signOut(auth)
        .then(() => {
            alert("Has cerrado sesión correctamente.");
            window.location.href = "/login.html";
        })
        .catch((error) => {
            alert("Error al cerrar sesión: " + error.message);
        });
};

// 🚀 Iniciar
window.onload = cargarCreditos;