const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- MONGODB CONNECTION ---
// Paste your string below and make sure to include your real password
const MONGO_URI = "mongodb+srv://pranaykardekar_db_user:JkcCBhEiifG8ENpF@cluster0.mbtwteg.mongodb.net/?appName=Cluster0"; 

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Database Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

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

// 1. Submit Feedback
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
        console.error(err);
        res.status(500).send({ message: "Error saving to database" });
    }
});

// 2. Get All Feedback (for Admin and Tracking)
app.get('/all-feedback', async (req, res) => {
    try {
        const data = await Feedback.find().sort({ _id: -1 });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 3. Update Status (Resolve Button)
app.patch('/update-status/:id', async (req, res) => {
    try {
        const result = await Feedback.findOneAndUpdate(
            { id: req.params.id }, 
            { status: req.body.status },
            { new: true }
        );
        if (result) {
            res.status(200).send({ message: "Status Updated" });
        } else {
            res.status(404).send({ message: "Ticket not found" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = app;