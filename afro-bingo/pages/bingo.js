// ==================== BINGO GAME FUNCTIONS ====================

// Game state
let bingoGame = {
    cardGrid: [],
    markedState: [],
    calledNumbers: [],
    autoInterval: null,
    isAutoPlaying: false,
    isGameActive: false,
    currentNumbers: [],
    gameTimer: 0,
    timerInterval: null
};

// Initialize bingo page
function showBingoPage() {
    const pageContainer = document.getElementById('pageContainer');
    
    // Set game screen based on deposit status
    const isWaiting = userData.pendingDeposit && !userData.pendingDeposit.confirmed;
    
    pageContainer.innerHTML = `
        <div id="bingoPage" class="page">
            <!-- Waiting for Confirmation Screen -->
            <div id="waitingScreen" class="waiting-screen" style="${isWaiting ? 'display: block;' : 'display: none;'}">
                <!-- ... waiting screen content ... -->
            </div>
            
            <!-- Actual Game Screen -->
            <div id="gameScreen" style="${isWaiting ? 'display: none;' : 'display: block;'}">
                <!-- ... game screen content ... -->
            </div>
        </div>
    `;
    
    // Initialize game if not waiting
    if (!isWaiting) {
        initializeBingoGame();
    }
}

// Initialize the bingo game
function initializeBingoGame() {
    // Update UI with current data
    document.getElementById('currentRoom').textContent = userData.selectedRoom;
    document.getElementById('prizePool').textContent = userData.selectedRoom * 2;
    document.getElementById('gameBalance').textContent = userData.balance;
    document.getElementById('totalWins').textContent = userData.totalWins;
    
    // Start new game
    startNewBingoGame();
}

// Start a new bingo game
function startNewBingoGame() {
    // Reset game state
    bingoGame.isGameActive = true;
    bingoGame.isAutoPlaying = false;
    bingoGame.calledNumbers = [];
    bingoGame.currentNumbers = [];
    bingoGame.cardGrid = [];
    bingoGame.markedState = [];
    bingoGame.gameTimer = 0;
    
    // Stop any running intervals
    if (bingoGame.autoInterval) {
        clearInterval(bingoGame.autoInterval);
        bingoGame.autoInterval = null;
    }
    if (bingoGame.timerInterval) {
        clearInterval(bingoGame.timerInterval);
        bingoGame.timerInterval = null;
    }
    
    // Update UI
    document.getElementById('callCount').textContent = "0";
    document.getElementById('currentNumberDisplay').textContent = "Ready";
    document.getElementById('matchesCount').textContent = "0";
    document.getElementById('numbersCalled').textContent = "0/75";
    document.getElementById('totalNumbersCalled').textContent = "0";
    document.getElementById('gameTimer').textContent = "00:00";
    document.getElementById('btnMain').textContent = "▶ Start Game";
    document.getElementById('btnMain').className = "btn btn-green";
    
    // Generate bingo card
    generateBingoCard();
    
    // Start game timer
    startGameTimer();
    
    // Update history display
    updateNumbersHistory();
}

// Generate bingo card
function generateBingoCard() {
    // Initialize arrays
    bingoGame.cardGrid = [];
    bingoGame.markedState = [];
    
    for(let r = 0; r < 5; r++) { 
        bingoGame.cardGrid[r] = []; 
        bingoGame.markedState[r] = []; 
    }
    
    // Generate numbers for each column (B, I, N, G, O)
    for(let col = 0; col < 5; col++) {
        const min = col * 15 + 1;
        let nums = [];
        
        // Generate 5 unique numbers for this column
        while(nums.length < 5) {
            let n = Math.floor(Math.random() * 15) + min;
            if(!nums.includes(n)) nums.push(n);
        }
        
        // Sort numbers
        nums.sort((a,b) => a - b);
        
        // Assign to rows
        for(let r = 0; r < 5; r++) {
            bingoGame.cardGrid[r][col] = nums[r];
            bingoGame.markedState[r][col] = false;
        }
    }
    
    // FREE space in the center
    bingoGame.markedState[2][2] = true;
    
    // Render the card
    renderBingoCard();
}

// Render bingo card to table
function renderBingoCard() {
    const table = document.getElementById('bingoCard');
    if (!table) return;
    
    table.innerHTML = '';
    
    // Create header row (B I N G O)
    const headerRow = table.insertRow();
    ['B','I','N','G','O'].forEach(letter => {
        const th = document.createElement('th');
        th.textContent = letter; 
        headerRow.appendChild(th);
    });
    
    // Create 5x5 grid
    for(let row = 0; row < 5; row++) {
        const tableRow = table.insertRow();
        
        for(let col = 0; col < 5; col++) {
            const cell = tableRow.insertCell();
            
            // Center cell is FREE
            if(row === 2 && col === 2) {
                cell.textContent = "FREE";
                cell.className = "free marked";
            } else {
                const num = bingoGame.cardGrid[row][col];
                cell.textContent = num;
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.dataset.num = num;
                
                // Check if this number has already been called
                if (bingoGame.calledNumbers.includes(num)) {
                    cell.classList.add('marked');
                    cell.classList.add('new-mark');
                    bingoGame.markedState[row][col] = true;
                    
                    // Remove animation class after animation
                    setTimeout(() => {
                        cell.classList.remove('new-mark');
                    }, 1000);
                }
                
                // Add click handler
                cell.onclick = function() {
                    if (!bingoGame.isGameActive) {
                        showToast("Start the game first!", "error");
                        return;
                    }
                    const r = parseInt(this.dataset.row);
                    const c = parseInt(this.dataset.col);
                    const num = parseInt(this.dataset.num);
                    
                    if(bingoGame.calledNumbers.includes(num)) {
                        Sound.click();
                        this.classList.toggle('marked');
                        bingoGame.markedState[r][c] = this.classList.contains('marked');
                        updateMatchesCount();
                    } else {
                        showToast("Number not called yet!", "error");
                    }
                };
            }
        }
    }
    
    // Update matches count
    updateMatchesCount();
}

// Update matches count
function updateMatchesCount() {
    let count = 0;
    for(let r = 0; r < 5; r++) {
        for(let c = 0; c < 5; c++) {
            if(bingoGame.markedState[r][c]) count++;
        }
    }
    // Subtract 1 for FREE space
    document.getElementById('matchesCount').textContent = Math.max(0, count - 1);
}

// Update numbers history display
function updateNumbersHistory() {
    const historyDiv = document.getElementById('numbersHistory');
    if (!historyDiv) return;
    
    historyDiv.innerHTML = '';
    
    if (bingoGame.currentNumbers.length === 0) {
        historyDiv.innerHTML = '<div style="color: #666; text-align: center; padding: 10px;">No numbers called yet</div>';
        return;
    }
    
    // Show all numbers called (most recent first)
    const allNumbers = [...bingoGame.currentNumbers].reverse();
    
    allNumbers.forEach((num, index) => {
        const badge = document.createElement('div');
        badge.className = 'number-badge';
        
        // Most recent number gets special styling
        if(index === 0) badge.classList.add('recent');
        
        // Check if this number is on the player's card
        if (isNumberOnCard(num)) {
            badge.classList.add('on-card');
        }
        
        const letter = ['B','I','N','G','O'][Math.floor((num-1)/15)];
        badge.textContent = `${letter}-${num}`;
        historyDiv.appendChild(badge);
    });
    
    // Update total numbers count
    document.getElementById('totalNumbersCalled').textContent = bingoGame.currentNumbers.length;
}

// Check if number is on card
function isNumberOnCard(num) {
    for(let r = 0; r < 5; r++) {
        for(let c = 0; c < 5; c++) {
            if (bingoGame.cardGrid[r][c] === num) {
                return true;
            }
        }
    }
    return false;
}

// Game timer functions
function startGameTimer() {
    if (bingoGame.timerInterval) {
        clearInterval(bingoGame.timerInterval);
    }
    
    bingoGame.timerInterval = setInterval(() => {
        bingoGame.gameTimer++;
        const minutes = Math.floor(bingoGame.gameTimer / 60);
        const seconds = bingoGame.gameTimer % 60;
        document.getElementById('gameTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Call a new number
function callBingoNumber() {
    if (!bingoGame.isGameActive) {
        showToast("Game not active!", "error");
        return;
    }
    
    if(bingoGame.calledNumbers.length >= 75) { 
        stopAutoPlay(); 
        showToast("All 75 numbers have been called!", "info");
        
        // Auto-create new card after 3 seconds
        setTimeout(() => {
            showToast("Generating new card...", "info");
            startNewBingoGame();
        }, 3000);
        return; 
    }
    
    let num;
    do { 
        num = Math.floor(Math.random() * 75) + 1; 
    } while(bingoGame.calledNumbers.includes(num));
    
    bingoGame.calledNumbers.push(num);
    bingoGame.currentNumbers.push(num);
    
    // Play sound
    Sound.number();
    
    // Update display
    const letter = ['B','I','N','G','O'][Math.floor((num-1)/15)];
    document.getElementById('currentNumberDisplay').textContent = `${letter}-${num}`;
    document.getElementById('callCount').textContent = bingoGame.calledNumbers.length;
    document.getElementById('numbersCalled').textContent = `${bingoGame.calledNumbers.length}/75`;
    
    // Automatically mark this number on the card if present
    const cells = document.querySelectorAll(`#bingoCard td[data-num="${num}"]`);
    cells.forEach(cell => {
        if (!cell.classList.contains('marked')) {
            cell.classList.add('marked');
            cell.classList.add('new-mark');
            
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            bingoGame.markedState[r][c] = true;
            
            // Remove animation class
            setTimeout(() => {
                cell.classList.remove('new-mark');
            }, 1000);
            
            updateMatchesCount();
        }
    });
    
    // Update history
    updateNumbersHistory();
}

// Auto-play functions
function toggleAutoPlay() {
    if (!bingoGame.isGameActive) {
        showToast("Game not active!", "error");
        return;
    }
    
    if(bingoGame.isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    bingoGame.isAutoPlaying = true;
    document.getElementById('btnMain').textContent = "⏹ Pause";
    document.getElementById('btnMain').className = "btn btn-red";
    
    // Call first number immediately
    callBingoNumber();
    
    // Set interval for calling numbers
    bingoGame.autoInterval = setInterval(callBingoNumber, 3500);
}

function stopAutoPlay() {
    bingoGame.isAutoPlaying = false;
    clearInterval(bingoGame.autoInterval);
    bingoGame.autoInterval = null;
    document.getElementById('btnMain').textContent = "▶ Resume";
    document.getElementById('btnMain').className = "btn btn-green";
}

// Verify BINGO
function verifyBingo() {
    if (!bingoGame.isGameActive) {
        showToast("Game not active!", "error");
        return;
    }
    
    let won = false;
    
    // Check rows
    for(let i = 0; i < 5; i++) {
        if(bingoGame.markedState[i].every(v => v)) won = true;
    }
    
    // Check columns
    for(let i = 0; i < 5; i++) {
        let colComplete = true;
        for(let j = 0; j < 5; j++) { 
            if(!bingoGame.markedState[j][i]) colComplete = false; 
        }
        if(colComplete) won = true;
    }
    
    // Check diagonals
    let d1 = true, d2 = true;
    for(let i = 0; i < 5; i++) {
        if(!bingoGame.markedState[i][i]) d1 = false;
        if(!bingoGame.markedState[i][4-i]) d2 = false;
    }
    if(d1 || d2) won = true;

    if(won) {
        // Play win sound
        Sound.win();
        
        // Show confetti
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        
        // Calculate prize
        const prize = userData.selectedRoom * 2;
        
        // Update user data
        userData.balance += prize;
        userData.totalWins++;
        userData.totalWinnings += prize;
        
        // Save data
        saveData();
        
        // Show win message
        showToast(`🎉 BINGO! You won ${prize} ETB!`, "success");
        
        // Stop game
        stopAutoPlay();
        clearInterval(bingoGame.timerInterval);
        bingoGame.timerInterval = null;
        
        // Update UI
        document.getElementById('gameBalance').textContent = userData.balance;
        document.getElementById('totalWins').textContent = userData.totalWins;
        
        // Create new card after 3 seconds
        setTimeout(() => {
            showToast("Generating new card...", "info");
            startNewBingoGame();
        }, 3000);
    } else {
        Sound.error();
        showToast("Not a Bingo yet. Keep playing!", "error");
    }
}

// Generate new card
function generateNewCard() {
    if (!bingoGame.isGameActive) {
        showToast("Start the game first!", "error");
        return;
    }
    
    if (confirm("Generate a new bingo card? Your current progress will be lost.")) {
        showToast("Generating new card...", "info");
        startNewBingoGame();
    }
}

// Exit game
function exitGame() {
    stopAutoPlay();
    
    if (bingoGame.timerInterval) {
        clearInterval(bingoGame.timerInterval);
        bingoGame.timerInterval = null;
    }
    
    bingoGame.isGameActive = false;
    
    if (confirm("Exit to lobby? Your current game progress will be lost.")) {
        showPage('lobby');
    } else {
        // Continue playing
        bingoGame.isGameActive = true;
    }
}

// Make functions available globally
window.toggleAutoPlay = toggleAutoPlay;
window.verifyBingo = verifyBingo;
window.generateNewCard = generateNewCard;
window.exitGame = exitGame;

// For waiting screen
function checkConfirmation() {
    const confirmed = confirm("Has the admin (@rasenok) confirmed your payment?");
    
    if (confirmed) {
        userData.balance += userData.selectedRoom;
        userData.pendingDeposit = null;
        saveData();
        
        // Hide waiting screen, show game
        document.getElementById('waitingScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        
        // Initialize game
        initializeBingoGame();
        
        showToast("Payment confirmed! Game activated.", "success");
    } else {
        showToast("Please wait for admin confirmation", "error");
    }
}

function exitWaiting() {
    userData.pendingDeposit = null;
    saveData();
    showPage('lobby');
}