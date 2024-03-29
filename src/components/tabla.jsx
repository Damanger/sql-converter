import React, { useState } from 'react';
import styles from '../assets/css/Tabla.module.css';

const Tabla = ({ nombreTabla, columnas }) => {
    const [editandoHeaders, setEditandoHeaders] = useState(false);
    const [nuevosHeaders, setNuevosHeaders] = useState(['id', ...columnas]); // Modificación aquí
    const [filas, setFilas] = useState([
        // Aquí puedes inicializar las filas si lo deseas
        { datos: ['', '', ''] }
    ]);
    const [inputHabilitado, setInputHabilitado] = useState(false); // Nuevo estado para controlar si el input está habilitado o no
    const [sentenciaSQL, setSentenciaSQL] = useState(''); // Nuevo estado para almacenar la sentencia SQL
    const [resultadoSQL, setResultadoSQL] = useState(''); // Nuevo estado para almacenar el resultado de la sentencia SQL
    const [sql, setSQL] = useState('');

    const handleEditarHeaders = () => {
        setEditandoHeaders(true);
        setInputHabilitado(true); // Habilitar el input cuando se hace clic en editar
    };

    const handleGuardarHeaders = () => {
        setEditandoHeaders(false);
        setInputHabilitado(false); // Deshabilitar el input cuando se guarda
        // Aquí puedes enviar los nuevos headers a través de una función de callback si es necesario
    };

    const handleChangeHeader = (index, e) => {
        const nuevosHeadersTemp = [...nuevosHeaders];
        nuevosHeadersTemp[index] = e.target.value;
        setNuevosHeaders(nuevosHeadersTemp);
    };

    const handleAgregarColumna = () => {
        if (nuevosHeaders.length < 5) {
            const nuevaColumna = `Columna ${nuevosHeaders.length + 1}`;
            setNuevosHeaders([...nuevosHeaders, nuevaColumna]);
            const nuevasFilas = [...filas];
            nuevasFilas.forEach(fila => fila.datos.push(''));
            setFilas(nuevasFilas);
        }
    };

    const handleEliminarColumna = (index) => {
        if (nuevosHeaders.length > 1) {
            const nuevosHeadersTemp = [...nuevosHeaders];
            nuevosHeadersTemp.splice(index, 1);
            setNuevosHeaders(nuevosHeadersTemp);
            const nuevasFilas = filas.map(fila => {
                fila.datos.splice(index, 1);
                return { datos: fila.datos };
            });
            setFilas(nuevasFilas);
        }
    };

    let nuevaSentenciaSQL = '';
    const handleAgregarFila = () => {
        if (filas.length < 5) {
            const nuevaFila = {
                datos: nuevosHeaders.map(() => '') // Inicializa los datos con cadenas vacías
            };
            setFilas([...filas, nuevaFila]);
        }
    };

    const handleEliminarFila = (index) => {
        if (filas.length > 1) {
            const nuevasFilas = [...filas];
            nuevasFilas.splice(index, 1);
            setFilas(nuevasFilas);
        }
    };

    const handleChangeDato = (filaIndex, columnaIndex, e) => {
        const nuevasFilas = [...filas];
        nuevasFilas[filaIndex].datos[columnaIndex] = e.target.value;
        setFilas(nuevasFilas);
    };

    const allValuesFilled = () => {
        for (let fila of filas) {
            for (let dato of fila.datos) {
                if (dato.trim() === '') {
                    return false;
                }
            }
        }
        return true;
    };
    
    const handleSentenciaSQLChange = (e) => {
        setSentenciaSQL(e.target.value);
    };

    const handleGenerarSQL = () => {
        if (!allValuesFilled()) {
            alert('Por favor, rellene todos los valores en la tabla antes de generar una sentencia SQL.');
            return;
        }
        if (sentenciaSQL.toLowerCase().startsWith('everything')) {
            nuevaSentenciaSQL = `SELECT * FROM ${nombreTabla}`;
        }
        else if(sentenciaSQL.toLowerCase().startsWith('max')){
            // Obtener el nombre de la columna
            const columnName = sentenciaSQL.split(' ')[1];
            // Verificar si la columna existe en los headers
            if (nuevosHeaders.includes(columnName)) {
                nuevaSentenciaSQL = `SELECT MAX(${columnName}) FROM ${nombreTabla}`;
                const columnData = getColumnData(columnName);
                const maxValue = Math.max(...columnData);
                const exe = `El valor máximo de ${columnName} es: ${maxValue}`;
                setSQL(exe);
            } else {
                // Si la columna no existe, muestra un mensaje de error
                nuevaSentenciaSQL = 'Columna no encontrada';
            }
        }
        setResultadoSQL(nuevaSentenciaSQL); // Actualizar el estado con la sentencia SQL generada
    };

    const getColumnData = (columnName) => {
        const columnIndex = nuevosHeaders.indexOf(columnName);
        return filas.map(fila => parseInt(fila.datos[columnIndex]) || 0);
    };

    return (
        <div className={styles.tableContainer}>
            <h1>{nombreTabla}</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {editandoHeaders ? (
                            nuevosHeaders.map((header, index) => (
                                <th key={index}>
                                    <input type="text" value={header} style={{display:'flex', textAlign:'center'}} onChange={(e) => handleChangeHeader(index, e)} />
                                    <button className={styles.button} style={{color:'red'}} onClick={() => handleEliminarColumna(index)} disabled={nuevosHeaders.length <= 1}>Eliminar</button>
                                </th>
                            ))
                        ) : (
                            nuevosHeaders.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))
                        )}
                        <th>
                            {editandoHeaders ? (<>
                                <button className={styles.button} style={{color:'green'}} onClick={handleGuardarHeaders}>Guardar</button>
                                <button className={styles.button} style={{color:'mediumseagreen'}} onClick={handleAgregarColumna} disabled={nuevosHeaders.length >= 5}>Agregar Columna</button>
                                </>
                            ) : (
                                <button className={styles.button} style={{color:'green'}} onClick={handleEditarHeaders}>Editar</button>
                            )}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filas.map((fila, filaIndex) => (
                        <tr key={filaIndex}>
                            {fila.datos.map((dato, columnaIndex) => (
                                <td key={columnaIndex}>
                                    <input style={{display:'flex', textAlign:'center'}} type="text" value={dato} onChange={(e) => handleChangeDato(filaIndex, columnaIndex, e)} disabled={!inputHabilitado} />
                                </td>
                            ))}
                            <td>
                                {editandoHeaders && (
                                    <button className={styles.button} style={{color:'red'}} onClick={() => handleEliminarFila(filaIndex)} disabled={filas.length <= 1}>Eliminar Fila</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                {editandoHeaders && (
                    <button className={styles.button} style={{color:'mediumseagreen'}} onClick={handleAgregarFila} disabled={filas.length >= 5}>Agregar Fila</button>
                )}
            </div>
            <div style={{margin:'2rem'}}>
                <input type="text" placeholder="Sentencia SQL" onChange={handleSentenciaSQLChange} />
                <button className={styles.button} style={{color:'blue'}} onClick={handleGenerarSQL}>Generar SQL</button>
            </div>
            <div style={{margin:'2rem'}}>
                <h3 className={styles.tableContainer}>SQL sentence</h3>
                <textarea value={resultadoSQL} readOnly placeholder="Resultado SQL" style={{ width: '20rem', height: '10rem', resize: 'none', display:'flex', textAlign:'center', justifyContent:'center'}}></textarea>
            </div>
            <div style={{margin:'2rem'}}>
                <h3 className={styles.tableContainer}>SQL result</h3>
                <textarea value={sql} readOnly placeholder="Sentencia SQL" style={{ width: '20rem', height: '5rem', resize: 'none', display:'flex', textAlign:'center' }}></textarea>
            </div>
        </div>
    );
};

export default Tabla;
