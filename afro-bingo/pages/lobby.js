// Lobby Page Functions

function updateLobbyUI() {
    document.getElementById('displayName').textContent = userData.name;
    document.getElementById('displayPhone').textContent = userData.phone || "No Phone Added";
    document.querySelectorAll('.userBalance').forEach(el => el.textContent = userData.balance);
}

function selectRoom(price) {
    userData.selectedRoom = price;
    saveData();
    showPage('deposit');
}