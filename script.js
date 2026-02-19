document.getElementById('feedbackForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = {
        staff: document.getElementById('staffType').value,
        rating: document.querySelector('input[name="rate"]:checked').value,
        isMisconduct: document.getElementById('misconduct').checked,
        comments: document.getElementById('comments').value
    };

    try {
        const response = await fetch('/submit-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Quirky success message
            alert(`✅ Submission Successful!\n\nYour Ticket ID: ${result.ticketId}\n\nPlease save this ID to track your complaint status.`);
            this.reset();
        }
    } catch (err) {
        alert("Server error. Please try again.");
    }
});