const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());
// This line tells Express to serve your CSS and JS files automatically
app.use(express.static(path.join(__dirname, './')));

// --- MONGODB CONNECTION ---
// IMPORTANT: Replace PASTE_YOUR_CONNECTION_STRING_HERE with your actual string
// Ensure you replace <db_password> with your real database user password
const MONGO_URI = "mongodb+srv://pranaykardekar_db_user:JkcCBhEiifG8ENpF@cluster0.mbtwteg.mongodb.net/?appName=Cluster0"; 

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ Connection Error:", err));

// --- DATA MODEL ---
const feedbackSchema = new mongoose.Schema({
    id: String,
    timestamp: String,
    staff: String,
    rating: Number,
    isMisconduct: Boolean,
    comments: String,
    status: { type: String, default: "Pending" }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// --- ROUTES ---

// serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Submit Feedback
app.post('/submit-feedback', async (req, res) => {
    try {
        const ticketId = `EXAM-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
        const newEntry = new Feedback({
            id: ticketId,
            timestamp: new Date().toLocaleString(),
            ...req.body
        });
        await newEntry.save();
        res.status(200).send({ message: "Success", ticketId });
    } catch (err) {
        res.status(500).send({ message: "Error saving feedback" });
    }
});

// Get All Feedback
app.get('/all-feedback', async (req, res) => {
    try {
        const data = await Feedback.find().sort({ _id: -1 });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update Status
app.patch('/update-status/:id', async (req, res) => {
    try {
        await Feedback.findOneAndUpdate(
            { id: req.params.id }, 
            { status: req.body.status }
        );
        res.status(200).send({ message: "Updated" });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = app;