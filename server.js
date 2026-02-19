const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = '/tmp/feedback.json';
// In a real app, this would be an environment variable
const ADMIN_SECRET = "exam-controller-secure-key-2026"; 

const initFile = () => {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
};

app.post('/submit-feedback', (req, res) => {
    initFile();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const newEntry = { 
        id: crypto.randomUUID(), // Use secure unique IDs
        timestamp: new Date().toLocaleString(), 
        ...req.body 
    };
    data.push(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(200).send({ message: "Success" });
});

app.get('/all-feedback', (req, res) => {
    initFile();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.status(200).send(data);
});

// SECURE DELETE: Requires Authorization Header
app.delete('/delete-feedback/:id', (req, res) => {
    const authHeader = req.headers['authorization'];

    if (authHeader !== ADMIN_SECRET) {
        return res.status(403).send({ message: "Unauthorized: Invalid Admin Key" });
    }

    initFile();
    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const initialLength = data.length;
    data = data.filter(item => item.id !== req.params.id);

    if (data.length === initialLength) {
        return res.status(404).send({ message: "Record not found" });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(200).send({ message: "Deleted successfully" });
});

module.exports = app;