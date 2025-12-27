// Deposit Page Functions

function updateDepositPage() {
    document.getElementById('selectedRoomPrice').textContent = userData.selectedRoom;
    document.getElementById('depositAmount').textContent = userData.selectedRoom;
}

function confirmDeposit() {
    userData.pendingDeposit = {
        amount: userData.selectedRoom,
        timestamp: Date.now(),
        confirmed: false
    };
    
    saveData();
    showModal('telegramModal');
}