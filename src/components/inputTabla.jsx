import React, { useState } from 'react';
import styles from '../assets/css/InputTabla.module.css';

const InputTabla = ({ onCrearTabla }) => {
    const [nombreTabla, setNombreTabla] = useState('');
    const [tablaCreada, setTablaCreada] = useState(false);

    const handleChange = (event) => {
        setNombreTabla(event.target.value);
    };

    const handleClick = () => {
        if (/^\d/.test(nombreTabla)) {
            alert('El nombre de la tabla no puede comenzar con un número.');
            return;
        }

        if (nombreTabla.includes(' ')) {
            alert('El nombre de la tabla no puede contener espacios.');
            return;
        }

        if (nombreTabla.trim() !== '') {
            onCrearTabla(nombreTabla);
            setTablaCreada(true); // Marcar la tabla como creada
        }
    };

    return (
        <>
            <h1 className={styles.container}>SQL converter</h1>
            <div className={styles.container}>
                <input type="text" placeholder="Nombre de la tabla" value={nombreTabla} onChange={handleChange} className={styles.input} />
                <button onClick={handleClick} className={styles.button} style={{color:'blue'}}>{tablaCreada ? 'Renombrar Tabla' : 'Crear Tabla'}</button>
            </div>
        </>
    );
};

export default InputTabla;
