const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Initialize the environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// MySQL Database Connection Configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database and check for connection success
db.connect((err) => {
    if (err) {
        console.log('Database connection failed: ', err);
    } else {
        console.log('Connected to the database');
    }
});

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving patients', error: err });
        } else {
            res.status(200).json(results)
        }
    });
});

// Question 2: Retrieve a providers
app.get('/providers', (req, res) => {
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving providers', error: err });
        } else {
            res.status(200).json(results);
        }
    });
});

// Question 3: Filter patients by First Name
app.get('/patients/filter', (req, res) => {
    const { first_name } = req.query;
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';

    db.query(sql, [first_name], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error filtering patients', error: err });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'No patients found with the given first name' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Question 4: Retrieve all providers by their speciality
app.get('/providers/filter', (req, res) => {
    const { provider_specialty } = req.query;
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';

    db.query(sql, [provider_specialty], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error filtering providers', error: err });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'No providers found with the given specialty' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});






