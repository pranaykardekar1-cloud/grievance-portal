const API_URL = "https://your-vercel-link.vercel.app";
// This should match the ADMIN_SECRET in server.js
const ADMIN_SECRET = "exam-controller-secure-key-2026"; 

async function loadData() {
    try {
        const response = await fetch(`${API_URL}/all-feedback`);
        const data = await response.json();
        const tbody = document.querySelector('#feedbackTable tbody');
        tbody.innerHTML = "";

        data.reverse().forEach(item => {
            const row = document.createElement('tr');
            if (item.isMisconduct) row.classList.add('alert-row');

            row.innerHTML = `
                <td>${item.timestamp}</td>
                <td>${item.staff}</td>
                <td>${item.rating}/5</td>
                <td>${item.isMisconduct ? "🚨 MISCONDUCT" : "Normal"}</td>
                <td>${item.comments}</td>
                <td><button class="del-btn" onclick="deleteItem('${item.id}')">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

async function deleteItem(id) {
    const confirmDelete = confirm("Are you sure you want to delete this specific record?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/delete-feedback/${id}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': ADMIN_SECRET // Send the validation key
            }
        });

        if (response.ok) {
            alert("Record deleted.");
            loadData();
        } else {
            const err = await response.json();
            alert(`Error: ${err.message}`);
        }
    } catch (err) {
        alert("Server communication error.");
    }
}

document.addEventListener('DOMContentLoaded', loadData);