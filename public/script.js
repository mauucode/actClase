const API_URL = '/api/libros';
const bookForm = document.getElementById('bookForm');
const bookList = document.getElementById('bookList');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Cargar libros al iniciar
document.addEventListener('DOMContentLoaded', fetchBooks);

async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        const libros = await response.json();
        renderBooks(libros);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        bookList.innerHTML = `<p class="error-msg">⚠️ No se pudieron cargar los libros. Revisa si tu servidor (node server.js) está corriendo.</p>`;
    }
}

function renderBooks(libros) {
    bookList.innerHTML = '';
    if (libros.length === 0) {
        bookList.innerHTML = '<p class="empty-msg">No hay libros registrados aún.</p>';
        return;
    }

    libros.forEach(libro => {
        const li = document.createElement('li');
        li.classList.add('book-card');
        li.innerHTML = `
            <div class="book-info">
                <h3>${libro.titulo}</h3>
                <p>👤 ${libro.autor}</p>
            </div>
            <div class="book-actions">
                <button class="btn-edit" onclick="editBook(${libro.id}, '${libro.titulo.replace(/'/g, "\\'")}', '${libro.autor.replace(/'/g, "\\'")}')">✏️ Editar</button>
                <button class="btn-delete" onclick="deleteBook(${libro.id})">🗑️ Borrar</button>
            </div>
        `;
        bookList.appendChild(li);
    });
}

bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('bookId').value;
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, autor })
        });

        if (!response.ok) throw new Error('Error al guardar');
        
        resetForm();
        fetchBooks();
    } catch (error) {
        alert('Hubo un error al guardar. Revisa la consola (F12).');
    }
});

async function deleteBook(id) {
    if(confirm('¿Seguro que quieres borrar este libro?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchBooks();
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    }
}

// Función súper importante: Pasa los datos de la lista al formulario
window.editBook = function(id, titulo, autor) {
    document.getElementById('bookId').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('autor').value = autor;
    
    // Cambiamos el estilo del botón para que se note que estamos editando
    submitBtn.innerHTML = '🔄 Actualizar Libro';
    submitBtn.classList.add('btn-update');
    cancelBtn.classList.remove('hidden');
}

// Botón cancelar edición
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    bookForm.reset();
    document.getElementById('bookId').value = ''; 
    submitBtn.innerHTML = '✨ Guardar Libro';
    submitBtn.classList.remove('btn-update');
    cancelBtn.classList.add('hidden');
}