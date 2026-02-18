const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
// Use the port provided by the hosting platform, or 3000 locally
const PORT = process.env.PORT || 3000;
const DATA_FILE = './feedback.json';

app.use(cors()); 
app.use(bodyParser.json());

// Initialize file
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// POST: Submit Feedback
app.post('/submit-feedback', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send({ message: "Error reading data" });

        const feedbackList = JSON.parse(data || "[]");
        const newEntry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            ...req.body
        };

        feedbackList.push(newEntry);

        fs.writeFile(DATA_FILE, JSON.stringify(feedbackList, null, 2), (err) => {
            if (err) return res.status(500).send({ message: "Error saving data" });
            res.status(200).send({ message: "Success" });
        });
    });
});

// GET: Fetch all data
app.get('/all-feedback', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send([]);
        res.status(200).send(JSON.parse(data || "[]"));
    });
});

// DELETE: Remove record
app.delete('/delete-feedback/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id);
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send({ message: "Error" });

        let feedbackList = JSON.parse(data || "[]");
        const updatedList = feedbackList.filter(item => item.id !== idToDelete);

        fs.writeFile(DATA_FILE, JSON.stringify(updatedList, null, 2), (err) => {
            if (err) return res.status(500).send({ message: "Error" });
            res.status(200).send({ message: "Deleted" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server live at port: ${PORT}`);
});