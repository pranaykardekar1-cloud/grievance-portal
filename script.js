const API_URL = "https://your-vercel-link.vercel.app";

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
            alert("Feedback sent successfully.");
            this.reset();
        }
    } catch (err) {
        alert("Could not connect to the server.");
    }
});