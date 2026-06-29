const API = "http://localhost:8080";

async function obtenerLibros() {

    const response = await fetch(`${API}/libros`);
    const libros = await response.json();

    let html = "";

    libros.forEach(libro => {

        html += `
        <tr>
            <td>${libro.id}</td>
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.editorial}</td>
            <td>${libro.anio_publicacion}</td>
            <td>${libro.isbn}</td>
            <td>
                <button onclick="eliminarLibro(${libro.id})">
                    Eliminar
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("tablaLibros").innerHTML = html;
}

async function crearLibro() {

    const libro = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        editorial: document.getElementById("editorial").value,
        anio_publicacion: parseInt(
            document.getElementById("anio").value
        ),
        isbn: document.getElementById("isbn").value
    };

    const response = await fetch(`${API}/libros`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(libro)
    });

    if (response.ok) {
        alert("Libro guardado");
        obtenerLibros();
    }
}

async function eliminarLibro(id) {

    const response = await fetch(`${API}/libros/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        alert("Libro eliminado");
        obtenerLibros();
    }
}

async function obtenerLibro() {

    const id = document.getElementById("buscarId").value;

    const response = await fetch(`${API}/libros/${id}`);

    const libro = await response.json();

    document.getElementById("resultado").innerHTML = `
        <h3>Libro Encontrado</h3>
        ID: ${libro.id}<br>
        Titulo: ${libro.titulo}<br>
        Autor: ${libro.autor}<br>
    `;
}


async function actualizarLibro() {

    const id = document.getElementById("actualizarId").value;

    const libro = {
        titulo: document.getElementById("nuevoTitulo").value,
        autor: document.getElementById("nuevoAutor").value,
        editorial: document.getElementById("nuevaEditorial").value,
        anio_publicacion: parseInt(
            document.getElementById("nuevoAnio").value
        ),
        isbn: document.getElementById("nuevoISBN").value
    };

    await fetch(`${API}/libros/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(libro)
    });

    alert("Libro actualizado");
    obtenerLibros();
}

async function actualizarTitulo() {

    const id = document.getElementById("actualizarId").value;

    const datos = {
        titulo: document.getElementById("nuevoTitulo").value
    };

    await fetch(`${API}/libros/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    alert("Título actualizado");
    obtenerLibros();
}

async function buscarAutor() {

    const autor =
        document.getElementById("buscarAutor").value;

    const response =
        await fetch(`${API}/autor/${autor}`);

    const libros = await response.json();

    let html = "<h3>Resultados</h3>";

    libros.forEach(libro => {

        html += `
            <p>
                ${libro.id} -
                ${libro.titulo}
            </p>
        `;
    });

    document.getElementById("resultado").innerHTML =
        html;
}

async function contarLibros() {

    const response =
        await fetch(`${API}/contador`);

    const datos = await response.json();

    document.getElementById("resultado").innerHTML =
        `<h3>Total Libros: ${datos.total}</h3>`;
}