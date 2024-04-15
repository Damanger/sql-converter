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
            alert('Table´s name cannot start with a number.');
            return;
        }

        if (nombreTabla.includes(' ')) {
            alert('Table´s name cannot contain whitespaces.');
            return;
        }

        if (nombreTabla.trim() !== '') {
            onCrearTabla(nombreTabla);
            setTablaCreada(true); // Set table as created
        }
    };

    return (
        <>
            <h1 className={styles.container}>SQL Converter</h1>
            <div className={styles.container}>
                <input type="text" placeholder="Table name" value={nombreTabla} onChange={handleChange} className={styles.input} />
                <button onClick={handleClick} className={styles.button} style={{color:'blue'}}>{tablaCreada ? 'Rename table' : 'Create Table'}</button>
            </div>
        </>
    );
};

export default InputTabla;
