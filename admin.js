// STEP 1: Update this URL after you deploy to Render (e.g., https://your-site.onrender.com)
const API_URL = "grievance-portal-production-ba82.up.railway.app";

async function loadData() {
    try {
        const response = await fetch(`${API_URL}/all-feedback`);
        const data = await response.json();
        const tbody = document.querySelector('#feedbackTable tbody');
        tbody.innerHTML = "";

        if (data.length === 0) {
            tbody.innerHTML = "<tr><td colspan='6' style='text-align:center'>No records found.</td></tr>";
            return;
        }

        data.reverse().forEach(item => {
            const row = document.createElement('tr');
            if (item.isMisconduct) row.classList.add('alert-row');

            row.innerHTML = `
                <td>${item.timestamp}</td>
                <td>${item.staff}</td>
                <td>${item.rating}/5</td>
                <td>${item.isMisconduct ? "🚨 MISCONDUCT" : "Normal"}</td>
                <td>${item.comments}</td>
                <td><button class="del-btn" onclick="deleteItem(${item.id})">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

async function deleteItem(id) {
    if (confirm("Delete this record permanently?")) {
        try {
            const response = await fetch(`${API_URL}/delete-feedback/${id}`, { 
                method: 'DELETE' 
            });
            if (response.ok) {
                loadData(); // Refresh table
            }
        } catch (err) {
            alert("Delete failed.");
        }
    }
}

// Load data when page opens
document.addEventListener('DOMContentLoaded', loadData);