const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Base de datos en memoria
let libros = [
    { id: 1, titulo: 'El Gran Gatsby', autor: 'F. Scott Fitzgerald' },
    { id: 2, titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez' },
    { id: 3, titulo: '1984', autor: 'George Orwell' }
];


//GET
app.get('/api/libros', (req, res) => {
    res.json(libros);
});

//post
app.post('/api/libros', (req, res) => {
    const { titulo, autor } = req.body;
    const nuevoLibro = {
        id: libros.length + 1,
        titulo,
        autor
    };
    libros.push(nuevoLibro);
    res.status(201).json(nuevoLibro);
});

//delete
app.delete('/api/libros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    libros = libros.filter(libro => libro.id !== id);
    res.status(204).send();
});

//put
app.put('/api/libros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, autor } = req.body;
    const libroIndex = libros.findIndex(libro => libro.id === id);

    if (libroIndex !== -1) {
        libros[libroIndex] = { id, titulo, autor };
        res.json(libros[libroIndex]);
    } else {
        res.status(404).json({ message: 'Libro no encontrado' });
    }
}   );


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});

