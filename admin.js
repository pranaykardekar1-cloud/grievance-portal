async function loadData() {
    const response = await fetch('/all-feedback');
    const data = await response.json();
    const tbody = document.querySelector('#feedbackTable tbody');
    tbody.innerHTML = "";

    data.reverse().forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><b>${item.id}</b></td>
            <td>${item.timestamp}</td>
            <td>${item.staff}</td>
            <td><span class="status-pill ${item.status.toLowerCase()}">${item.status}</span></td>
            <td>${item.comments}</td>
            <td>
                <button onclick="updateStatus('${item.id}', 'Resolved')">Resolve</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function updateStatus(id, newStatus) {
    await fetch(`/update-status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    loadData(); // Refresh the list
}

document.addEventListener('DOMContentLoaded', loadData);