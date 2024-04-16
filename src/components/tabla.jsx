import React, { useState } from 'react';
import styles from '../assets/css/Tabla.module.css';

const Tabla = ({ nombreTabla, columnas }) => {
    const [editandoHeaders, setEditandoHeaders] = useState(false);
    const [nuevosHeaders, setNuevosHeaders] = useState(['id', ...columnas]);
    const [filas, setFilas] = useState([
        { datos: ['data1', 'data2', 'data3'] }
    ]);
    const [inputHabilitado, setInputHabilitado] = useState(false); // New state to controll if an input is enable or not
    const [resultadoSQL, setResultadoSQL] = useState(''); // New state ti save the result of the SQL sentence
    const [sql, setSQL] = useState('');
    const [opcionSeleccionada, setOpcionSeleccionada] = useState(''); // New state to save the selected option
    const [columnaSeleccionada, setColumnaSeleccionada] = useState(''); // New state to save the selected column

    const opcionesSelect = ['Everything on table', 'Max value of column', 'Min value of column', 'Sum of column', 'Average of column', 'Count of column'];

    const handleEditarHeaders = () => {
        setEditandoHeaders(true);
        setInputHabilitado(true); // Enable input when editing headers
    };

    const handleGuardarHeaders = () => {
        setEditandoHeaders(false);
        setInputHabilitado(false); // Disable input when saving headers
    };

    const handleChangeHeader = (index, e) => {
        const nuevosHeadersTemp = [...nuevosHeaders];
        nuevosHeadersTemp[index] = e.target.value;
        setNuevosHeaders(nuevosHeadersTemp);
    };

    const handleAgregarColumna = () => {
        if (nuevosHeaders.length < 5) {
            const nuevaColumna = `Column ${nuevosHeaders.length + 1}`;
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

    const handleAgregarFila = () => {
        if (filas.length < 5) {
            const nuevaFila = {
                datos: nuevosHeaders.map(() => '')
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

    const handleGenerarSQL = () => {
        if (!allValuesFilled()) {
            alert('Please update every row and column with data to generate a SQL sentence.');
            return;
        }
    
        let nuevaSentenciaSQL = '';
    
        switch (opcionSeleccionada.toLowerCase()) {
            case 'everything on table':
                nuevaSentenciaSQL = `SELECT * FROM ${nombreTabla}`;
                setResultadoSQL(nuevaSentenciaSQL); 
                const tablaDict = {};
                nuevosHeaders.forEach((header, index) => {
                    tablaDict[header] = filas.map(fila => fila.datos[index]);
                });
                const jsonString = JSON.stringify(tablaDict, null, 2);
                const sqlString = jsonString
                    .replace(/[{}]/g, '') 
                    .replace(/\n/g, ''); 
                setSQL(sqlString);
                break;
            case 'max value of column':
            case 'min value of column':
            case 'sum of column':
            case 'average of column':
            case 'count of column':
                if(!columnaSeleccionada){
                    alert('Please select a column to apply the operation.');
                    return;
                }
                const columnaIndex = nuevosHeaders.indexOf(columnaSeleccionada);
                if (columnaIndex === -1) {
                    alert('Column not found.');
                    return;
                }
                const columnData = getColumnData(columnaSeleccionada);
                const maxVal = Math.max(...columnData);
                nuevaSentenciaSQL = `SELECT MAX (${columnaSeleccionada}) FROM ${nombreTabla}`;
                setResultadoSQL(nuevaSentenciaSQL);
                setSQL(`MAX value of ${columnaSeleccionada} is: ${maxVal}`);
                break;
            default:
                // Default case
                alert('Please select a valid option.');
                return;
        }
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
                                    <button className={styles.button} style={{color:'red'}} onClick={() => handleEliminarColumna(index)} disabled={nuevosHeaders.length <= 1}>Delete</button>
                                </th>
                            ))
                        ) : (
                            nuevosHeaders.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))
                        )}
                        <th>
                            {editandoHeaders ? (<>
                                <button className={styles.button} style={{color:'green'}} onClick={handleGuardarHeaders}>Save</button>
                                <button className={styles.button} style={{color:'mediumseagreen'}} onClick={handleAgregarColumna} disabled={nuevosHeaders.length >= 5}>Add Column</button>
                                </>
                            ) : (
                                <button className={styles.button} style={{color:'green'}} onClick={handleEditarHeaders}>Edit</button>
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
                                    <button className={styles.button} style={{color:'red'}} onClick={() => handleEliminarFila(filaIndex)} disabled={filas.length <= 1}>Delete Row</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                {editandoHeaders && (
                    <button className={styles.button} style={{color:'mediumseagreen'}} onClick={handleAgregarFila} disabled={filas.length >= 5}>Add Row</button>
                )}
            </div>
            <div style={{margin:'2rem'}}>
                <select value={opcionSeleccionada} type="text" placeholder="SQL sentence" onChange={(e) => setOpcionSeleccionada(e.target.value)} >
                    <option value="" disabled defaultValue>Select an option</option>
                    {opcionesSelect.map((opcion, index) => (
                        <option key={index} value={opcion}>{opcion}</option>
                    ))}
                </select>
                {opcionSeleccionada.toLowerCase().includes('column') && (
                    <input type='text' placeholder='Enter column name' value={columnaSeleccionada} onChange={(e) => setColumnaSeleccionada(e.target.value)} style={{marginRight:'1rem', marginLeft:'1rem'}}/>
                )}
                <button className={styles.button} style={{color:'blue'}} onClick={handleGenerarSQL}>Generate SQL</button>
            </div>
            <div style={{margin:'2rem'}}>
                <h3 className={styles.tableContainer}>SQL sentence</h3>
                <textarea value={resultadoSQL} readOnly placeholder="SQL result" style={{ width: '20rem', height: '3rem', resize: 'none', display:'flex', textAlign:'center', justifyContent:'center'}}></textarea>
            </div>
            <div style={{margin:'2rem'}}>
                <h3 className={styles.tableContainer}>SQL result</h3>
                <textarea value={sql} readOnly placeholder="SQL sentence" style={{ width: '20rem', height: '8rem', resize: 'none', display:'flex', textAlign:'center' }}></textarea>
            </div>
        </div>
    );
};

export default Tabla;
