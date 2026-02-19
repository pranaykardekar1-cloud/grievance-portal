const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // Built-in for generating IDs

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = '/tmp/feedback.json';

const initFile = () => {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
};

app.post('/submit-feedback', (req, res) => {
    initFile();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    // Generate a quirky Ticket ID (e.g., EXAM-73A1)
    const ticketId = `EXAM-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    
    const newEntry = { 
        id: ticketId, 
        timestamp: new Date().toLocaleString(), 
        status: "Pending", // Default status
        ...req.body 
    };

    data.push(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    // Send the Ticket ID back to the student
    res.status(200).send({ message: "Success", ticketId: ticketId });
});

app.get('/all-feedback', (req, res) => {
    initFile();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.status(200).send(data);
});

// Admin can now update status (e.g., Resolved)
app.patch('/update-status/:id', (req, res) => {
    initFile();
    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const index = data.findIndex(item => item.id === req.params.id);
    if (index !== -1) {
        data[index].status = req.body.status;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.status(200).send({ message: "Status updated" });
    } else {
        res.status(404).send({ message: "Ticket not found" });
    }
});

module.exports = app;