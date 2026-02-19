const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = '/tmp/feedback.json'; // Vercel allows writing to /tmp temporarily

// Helper to read/write (This is temporary until we do MongoDB)
const initFile = () => {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
};

app.post('/submit-feedback', (req, res) => {
    initFile();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const newEntry = { id: Date.now(), timestamp: new Date().toLocaleString(), ...req.body };
    data.push(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(200).send({ message: "Success" });
});

app.get('/all-feedback', (req, res) => {
    initFile();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.status(200).send(data);
});

app.delete('/delete-feedback/:id', (req, res) => {
    initFile();
    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data = data.filter(item => item.id !== parseInt(req.params.id));
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(200).send({ message: "Deleted" });
});

// IMPORTANT: Do NOT use app.listen() for Vercel. 
// Just export the app.
module.exports = app;