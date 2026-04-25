const API_URL = "http://localhost:8080/api";

// ===============================
// CARGAR PRODUCTOS (simulados)
// ===============================
async function cargarProductos() {
    const tabla = document.querySelector("table");

    // Aquí simulamos productos (porque tu API no tiene endpoint de productos)
    const productos = [
        { id: 1, nombre: "Producto 1", precio: 10, imagen: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSz8Pr1709RfC-9RYti5EAP-6fMaDmDqHSJk3L_07zvVUs_8NrRb4h3vskXoDFZ076mLadR0Do" },
        { id: 2, nombre: "Producto 2", precio: 20, imagen: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSnGJbo0adlal4u4Wu51apeYQAeClBOwkgKdP4j5G6jaInb2callBeH9IdZmQG9VysEEC7uHfQjRw" }
    ];

    productos.forEach(p => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${p.nombre}</td>
            <td>${p.precio}€</td>
            <td><img src="${p.imagen}" width="80"></td>
            <td><button onclick="añadirAlCarrito(${p.id}, ${p.precio})">Añadir</button></td>
        `;

        tabla.appendChild(fila);
    });
}

// ===============================
// AÑADIR AL CARRITO
// ===============================
async function añadirAlCarrito(idArticulo, precio) {
    try {
        const linea = {
            idArticulo: idArticulo,
            precioUnitario: precio,
            unidades: 1,
            costeLinea: precio
        };

        const response = await fetch(`${API_URL}/lineacarrito`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(linea)
        });

        if (!response.ok) throw new Error("Error al añadir");

        alert("Producto añadido al carrito");
    } catch (error) {
        console.error(error);
        alert("Error al añadir producto");
    }
}

// ===============================
// CARGAR CARRITOS
// ===============================
async function cargarCarritos() {
    try {
        const response = await fetch(`${API_URL}/carritos`);
        const carritos = await response.json();

        const main = document.querySelector("main");
        main.innerHTML = "<h2>Mis carritos</h2>";

        carritos.forEach(c => {
            const article = document.createElement("article");

            article.innerHTML = `
                <h3>Carrito ID: ${c.idCarrito}</h3>
                <p><strong>Email:</strong> ${c.email}</p>
                <p><strong>Total:</strong> ${c.totalPrecio}€</p>
                <button onclick="eliminarCarrito(${c.idCarrito})">Eliminar</button>
            `;

            main.appendChild(article);
        });

    } catch (error) {
        console.error(error);
    }
}

// ===============================
// ELIMINAR CARRITO
// ===============================
async function eliminarCarrito(id) {
    try {
        await fetch(`${API_URL}/carritos/${id}`, {
            method: "DELETE"
        });

        alert("Carrito eliminado");
        cargarCarritos();
    } catch (error) {
        console.error(error);
    }
}

// ===============================
// CREAR CARRITO (opcional)
// ===============================
async function crearCarrito() {
    const carrito = {
        idUsuario: Math.floor(Math.random() * 1000),
        email: "usuario@test.com",
        totalPrecio: 0
    };

    try {
        const response = await fetch(`${API_URL}/carritos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(carrito)
        });

        const data = await response.json();
        console.log("Carrito creado:", data);
        cargarCarritos();

    } catch (error) {
        console.error(error);
    }
}

// ===============================
// DETECTAR PÁGINA
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("productos.html")) {
        cargarProductos();
    }

    if (window.location.pathname.includes("carrito.html")) {
        cargarCarritos();
    }
});