const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = '/tmp/feedback.json';

const initFile = () => {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
};

// SUBMIT
app.post('/submit-feedback', (req, res) => {
    initFile();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const ticketId = `EXAM-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    
    const newEntry = { 
        id: ticketId, 
        timestamp: new Date().toLocaleString(), 
        status: "Pending", 
        ...req.body 
    };

    data.push(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(200).send({ message: "Success", ticketId });
});

// GET ALL
app.get('/all-feedback', (req, res) => {
    initFile();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.status(200).send(data);
});

// UPDATE STATUS
app.patch('/update-status/:id', (req, res) => {
    initFile();
    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const index = data.findIndex(item => item.id === req.params.id);
    
    if (index !== -1) {
        data[index].status = req.body.status;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.status(200).send({ message: "Status Updated" });
    } else {
        res.status(404).send({ message: "Not Found" });
    }
});

module.exports = app;