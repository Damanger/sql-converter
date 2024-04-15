// App.js
import React, { useState, useEffect } from 'react';
import InputTabla from './components/inputTabla';
import Tabla from './components/tabla';
import './App.css'

function App() {
    const [nombreTabla, setNombreTabla] = useState('');
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [columnas, setColumnas] = useState([]);

    const handleCrearTabla = (nombre) => {
        setNombreTabla(nombre);
        setMostrarTabla(true);
        // Set default columns
        setColumnas(['Column 1', 'Column 2']);
    };

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY; // Obtain the scroll position
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight; // Get the total scroll height
            const scrolled = (scrollTop / scrollHeight) * 100; // Calculate the percentage of the scroll

            const scrollWatcher = document.querySelector('.scroll-watcher');
            scrollWatcher.style.width = scrolled + '%'; // Set the width of the scroll watcher
        });
    }, []);

    return (<>
        <div className="scroll-watcher"></div>
        <div className="App">
            <InputTabla onCrearTabla={handleCrearTabla} />
            {mostrarTabla && <Tabla nombreTabla={nombreTabla} columnas={columnas} />}
        </div>
        </>
    );
}

export default App;
