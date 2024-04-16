// App.js
import React, { useState, useEffect } from 'react';
import InputTabla from './components/inputTabla';
import Tabla from './components/tabla';
import ChatBot from 'react-simple-chatbot';
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

    return (
    <>
        <div className="scroll-watcher"></div>
        <div className="App">
            <InputTabla onCrearTabla={handleCrearTabla} />
            {mostrarTabla && <Tabla nombreTabla={nombreTabla} columnas={columnas} />}
        </div>
        <ChatBot
            steps={[
                {
                    id: '1',
                    message: 'Hello there! What´s your name?',
                    trigger: '2',
                },
                {
                    id: '2',
                    user: true,
                    trigger: '3',
                },
                {
                    id: '3',
                    message: 'Hello {previousValue}, Nice to meet you!',
                    trigger: 'faq',
                },
                {
                    id: 'faq',
                    message: 'How can i help you today?',
                    trigger: 'menu',
                },
                {
                    id: 'menu',
                    options: [
                        { value: 1, label: 'How can I select all data from a table in SQL using this tool?', trigger: 'select' },
                        { value: 2, label: 'What should I do if I want to find the maximum or minimum value of a specific column in a table using this tool?', trigger: 'max-min' },
                        { value: 3, label: 'How can I calculate the sum, average, or count of values in a column using this tool?', trigger: 'sum...' },
                        { value: 4, label: "What should I do if I don't find the column I'm looking for in the dropdown list?", trigger: 'column' },
                        { value: 5, label: 'How can I ensure that the generated SQL query is valid and produces accurate results?', trigger: 'valid' }
                    ],
                },
                {
                    id: 'select',
                    message: 'You can select all data from a table by simply choosing the "Everything on table" option from the dropdown menu and clicking on "Generate SQL"',
                    trigger: 'menu',
                },
                {
                    id: 'max-min',
                    message: 'To find the maximum value of a column, select the "Max value of column" option and choose the corresponding column. Similarly, to find the minimum value, choose the "Min value of column" option.',
                    trigger: 'menu',
                },
                {
                    id: 'sum...',
                    message: 'To calculate the sum of a column, choose "Sum of column". For the average, select "Average of column", and for counting values, choose "Count of column". In each case, make sure to select the relevant column.',
                    trigger: 'menu',
                },
                {
                    id: 'column',
                    message: "If you can't find the column you need, make sure it's present in the source table and that you're using the correct name. If you still can't find it, there might be an issue with the table structure or the database connection.",
                    trigger: 'menu',
                },
                {
                    id: 'valid',
                    message: 'Before clicking on '+'"Generate SQL"'+", make sure you've selected all necessary options and that the data in the table is correct and complete. Additionally, verify that the column and table names are spelled correctly.",
                    trigger: 'menu',
                }
            ]}
            floating={true}
            botAvatar="https://raw.githubusercontent.com/Damanger/Portfolio/main/public/Ardilla.webp"
            userAvatar="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Blank_user.svg/1707px-Blank_user.svg.png"
            floatingIcon={<div className="custom-floating-icon" />}
        />
    </>
    );
}

export default App;
