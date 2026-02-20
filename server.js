const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();

// --- 1. MIDDLEWARE (Order Matters!) ---
app.use(cors());
app.use(bodyParser.json());
// This line allows the browser to grab style.css, logo.png, and script.js automatically
app.use(express.static(path.join(__dirname, './')));

// --- 2. MONGODB CONNECTION ---
const MONGO_URI = "mongodb+srv://pranaykardekar_db_user:JkcCBhEiifG8ENpF@cluster0.mbtwteg.mongodb.net/?appName=Cluster0"; 

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.error("❌ Connection Error:", err));

// --- 3. DATA MODEL ---
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

// --- 4. HTML PAGE ROUTES ---

// Main User Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin Page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// --- 5. API ROUTES ---

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

// Get All Feedback (For Admin)
app.get('/all-feedback', async (req, res) => {
    try {
        const data = await Feedback.find().sort({ _id: -1 });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update Status (For Admin)
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

// --- 6. START SERVER (Required for Local Testing) ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;