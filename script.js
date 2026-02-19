const API_URL = ""; // Relative URL for Vercel

// SUBMIT FEEDBACK
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

        const result = await response.json();

        if (response.ok) {
            alert(`✅ Submitted!\n\nYour Ticket ID: ${result.ticketId}\nSave this to track status.`);
            this.reset();
        }
    } catch (err) {
        alert("Submission failed. Check connection.");
    }
});

// TRACK STATUS
document.getElementById('trackBtn').addEventListener('click', async () => {
    const id = document.getElementById('trackInput').value.trim().toUpperCase();
    const resultDisplay = document.getElementById('statusResult');

    if (!id) return;

    try {
        const response = await fetch(`${API_URL}/all-feedback`);
        const data = await response.json();
        const ticket = data.find(t => t.id === id);

        resultDisplay.style.display = "block";
        if (ticket) {
            const color = ticket.status === 'Resolved' ? '#22c55e' : '#f59e0b';
            resultDisplay.innerHTML = `Ticket ${id}: <span style="color: ${color}">${ticket.status}</span>`;
        } else {
            resultDisplay.innerHTML = `<span style="color: #ef4444">ID not found.</span>`;
        }
    } catch (err) {
        console.error(err);
    }
});