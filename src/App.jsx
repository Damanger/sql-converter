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
        // Inicializar las columnas aquí si es necesario
        setColumnas(['Columna 1', 'Columna 2']);
    };

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY; // Obtener la posición de desplazamiento vertical
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight; // Calcular la altura total de la página
            const scrolled = (scrollTop / scrollHeight) * 100; // Calcular el porcentaje de desplazamiento

            const scrollWatcher = document.querySelector('.scroll-watcher');
            scrollWatcher.style.width = scrolled + '%'; // Establecer el ancho de la barra de desplazamiento según el porcentaje de desplazamiento
        });
    }, []);

    return (<>
        <div className="wrap">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div className="scroll-watcher"></div>
        <div className="App">
            <InputTabla onCrearTabla={handleCrearTabla} />
            {mostrarTabla && <Tabla nombreTabla={nombreTabla} columnas={columnas} />}
        </div>
        </>
    );
}

export default App;
