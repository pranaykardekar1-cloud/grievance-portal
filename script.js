// STEP 1: Update this URL after you deploy to Render (e.g., https://your-site.onrender.com)
const API_URL = "https://grievance-portal-yourname.vercel.app";

document.getElementById('feedbackForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = {
        staff: document.getElementById('staffType').value,
        rating: document.querySelector('input[name="rate"]:checked').value,
        isMisconduct: document.getElementById('misconduct').checked,
        comments: document.getElementById('comments').value
    };

    try {
        const response = await fetch(`${API_URL}/submit-feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert(data.isMisconduct ? "🚨 Report Submitted. Administration notified." : "Feedback Submitted Successfully.");
            this.reset();
        } else {
            alert("Submission failed. Try again.");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Cannot connect to server. Make sure the backend is running.");
    }
});