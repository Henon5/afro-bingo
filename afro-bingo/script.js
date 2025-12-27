// ==================== INITIALIZATION ====================
const tg = window.Telegram?.WebApp;
if(tg) { 
    tg.expand(); 
    tg.enableClosingConfirmation(); 
}

// Sound Generator
const Sound = {
    play(freq, type = 'sine', duration = 0.1) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (error) {
            console.log("Audio not supported:", error);
        }
    },
    click() { this.play(600, 'sine', 0.1); },
    number() { this.play(440, 'triangle', 0.2); },
    win() { 
        this.play(523, 'square', 0.3);
        setTimeout(() => this.play(659, 'square', 0.3), 150);
        setTimeout(() => this.play(783, 'square', 0.5), 300);
    },
    error() { this.play(150, 'sawtooth', 0.3); }
};

// ==================== STATE MANAGEMENT ====================
let userData = JSON.parse(localStorage.getItem('afroBingoUser')) || {
    name: tg?.initDataUnsafe?.user?.first_name || "New Player",
    phone: "",
    balance: 0,
    selectedRoom: 20,
    pendingDeposit: null,
    telegramId: tg?.initDataUnsafe?.user?.id || null,
    username: tg?.initDataUnsafe?.user?.username || null,
    totalWins: 0,
    totalWinnings: 0,
    gamesPlayed: 0
};

// ==================== PAGE MANAGEMENT ====================
let currentPage = 'lobby';

// Page HTML content storage
const pages = {
    lobby: '',
    deposit: '',
    bingo: ''
};

// Modal HTML content
let modalsHTML = '';

// Load all pages at once
async function loadAllPages() {
    try {
        // Load all page HTML (we'll embed them directly instead of fetch)
        // For now, we'll define them inline since fetch won't work without server
        showPage('lobby');
    } catch (error) {
        console.error('Error loading pages:', error);
        showErrorPage();
    }
}

function showPage(pageId) {
    currentPage = pageId;
    
    // Clear current page
    const pageContainer = document.getElementById('pageContainer');
    pageContainer.innerHTML = '';
    
    // Show the page
    if (pageId === 'lobby') {
        showLobbyPage();
    } else if (pageId === 'deposit') {
        showDepositPage();
    } else if (pageId === 'bingo') {
        showBingoPage();
    }
}

function showLobbyPage() {
    const pageContainer = document.getElementById('pageContainer');
    pageContainer.innerHTML = `
        <div id="lobbyPage" class="page">
            <div class="header">
                <h1>🎮 AFRO-BINGO 🇪🇹</h1>
                <p>Win Big with Every Number</p>
            </div>

            <div class="profile-mini">
                <div>
                    <div style="font-size: 0.9rem; font-weight: bold;" id="displayName">${userData.name}</div>
                    <div style="font-size: 0.75rem; color: #666;" id="displayPhone">${userData.phone || "No Phone Added"}</div>
                </div>
                <button class="btn btn-outline" style="width: auto; padding: 5px 15px;" onclick="showModal('profilePage')">Edit Profile</button>
            </div>

            <div class="balance-box" style="background: #009b3a; color: white; padding: 15px; border-radius: 12px; margin-bottom: 15px; text-align: center;">
                <div style="font-size: 0.8rem; opacity: 0.9;">Your Balance</div>
                <div style="font-size: 1.8rem; font-weight: bold;"><span class="userBalance">${userData.balance}</span> ETB</div>
            </div>

            <div class="room-card" onclick="selectRoom(100)">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.2rem; font-weight: bold; color: #009b3a;">100 ETB Room</span>
                    <span style="background: #ef3340; color: white; padding: 2px 8px; border-radius: 5px; font-size: 0.8rem;">Win 200!</span>
                </div>
            </div>
            
            <div class="room-card" onclick="selectRoom(50)">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.2rem; font-weight: bold; color: #333;">50 ETB Room</span>
                    <span style="background: #0039a6; color: white; padding: 2px 8px; border-radius: 5px; font-size: 0.8rem;">Win 100!</span>
                </div>
            </div>

            <div class="room-card" onclick="selectRoom(20)">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.2rem; font-weight: bold; color: #333;">20 ETB Room</span>
                    <span style="background: #666; color: white; padding: 2px 8px; border-radius: 5px; font-size: 0.8rem;">Win 40!</span>
                </div>
            </div>
            
            <!-- Support Team Button -->
            <button class="btn support-btn" onclick="showSupportTeam()">
                👥 Support Team
            </button>
        </div>
    `;
}

function showDepositPage() {
    const pageContainer = document.getElementById('pageContainer');
    pageContainer.innerHTML = `
        <div id="depositPage" class="page">
            <div class="header">
                <button onclick="showPage('lobby')" style="background:none;border:none;color:white;position:absolute;left:15px;top:20px;font-size:1.2rem;cursor:pointer;">←</button>
                <h2>💰 Deposit</h2>
                <p>Room: <span id="selectedRoomPrice">${userData.selectedRoom}</span> ETB</p>
            </div>
            
            <div style="background:#fff7e6; padding:15px; border-radius:12px; border:1px solid #ffd591; margin-bottom:15px;">
                <p style="font-size:0.85rem; color:#874d00; text-align:center;">Send <b><span id="depositAmount">${userData.selectedRoom}</span> ETB</b> to one of the accounts below and click SUMMIT.</p>
            </div>

            <!-- TeleBirr Payment Box -->
            <div class="payment-box">
                <div style="font-weight: bold; color: #009b3a; margin-bottom: 5px;">📱 TeleBirr</div>
                <div style="font-size: 1.3rem; letter-spacing: 1px; margin: 10px 0; color: #333;">0921302111</div>
                <button class="btn btn-blue" style="width: auto; padding: 8px 20px; font-size: 0.8rem;" onclick="copyText('0921302111')">📋 Copy Number</button>
            </div>

            <!-- CBE Payment Box -->
            <div class="payment-box" style="border-color: #009b3a; background: #f0fdf4;">
                <div style="font-weight: bold; color: #009b3a; margin-bottom: 5px;">🏦 CBE Bank</div>
                <div style="font-size: 1.3rem; letter-spacing: 1px; margin: 10px 0; color: #333;">1000318833625</div>
                <button class="btn btn-green" style="width: auto; padding: 8px 20px; font-size: 0.8rem;" onclick="copyText('1000318833625')">📋 Copy Account</button>
            </div>

            <!-- Changed button text to SUMMIT -->
            <button class="btn btn-green" onclick="confirmDeposit()">✅ SUMMIT</button>
        </div>
    `;
}

function showBingoPage() {
    const pageContainer = document.getElementById('pageContainer');
    pageContainer.innerHTML = `
        <div id="bingoPage" class="page">
            <!-- Waiting for Confirmation Screen -->
            <div id="waitingScreen" class="waiting-screen" style="${userData.pendingDeposit && !userData.pendingDeposit.confirmed ? 'display: block;' : 'display: none;'}">
                <div class="header">
                    <h3>⏳ Waiting for Confirmation</h3>
                    <p style="font-size: 0.9rem; opacity: 0.8;">Your payment is being verified</p>
                </div>
                
                <div class="spinner"></div>
                
                <p style="margin: 20px 0 10px; font-weight: bold;">Room: <span id="waitingRoomAmount">${userData.selectedRoom}</span> ETB</p>
                
                <div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 15px 0;">
                    <p style="font-size: 0.9rem; margin-bottom: 10px;">
                        <strong>IMPORTANT:</strong> Send your payment proof to:
                    </p>
                    <div style="background: #ffffff; padding: 10px; border-radius: 8px; border: 2px dashed #009b3a;">
                        <p style="font-weight: bold; color: #0088cc; font-size: 1.1rem;">@rasenok</p>
                    </div>
                    <p style="font-size: 0.8rem; color: #666; margin-top: 10px;">
                        Send the transfer link or screenshot to Telegram
                    </p>
                </div>
                
                <button class="btn btn-blue" onclick="openTelegram()" style="margin-bottom: 10px;">
                    📱 Open Telegram Now
                </button>
                
                <button class="btn btn-green" onclick="checkConfirmation()" id="playButton" style="${(userData.pendingDeposit && Date.now() - userData.pendingDeposit.timestamp > 3000) ? 'display: block;' : 'display: none;'}">
                    🎮 Play Game
                </button>
                
                <button class="btn btn-outline" onclick="exitWaiting()">
                    ← Back to Lobby
                </button>
            </div>
            
            <!-- Actual Game Screen (Initially Hidden) -->
            <div id="gameScreen" style="${userData.pendingDeposit && !userData.pendingDeposit.confirmed ? 'display: none;' : 'display: block;'}">
                <div class="header" style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="text-align:left;">
                        <h3 style="font-size: 1rem;">AFRO-BINGO</h3>
                        <span style="font-size: 0.7rem; opacity:0.8;">Room: <span id="currentRoom">${userData.selectedRoom}</span> ETB</span>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size: 1.1rem; font-weight:bold;"><span class="userBalance">${userData.balance}</span> ETB</div>
                    </div>
                </div>
                
                <!-- Statistics Boxes -->
                <div class="stats-container">
                    <div class="stat-box">
                        <h4>🎯 Matches</h4>
                        <div class="stat-value" id="matchesCount">0</div>
                    </div>
                    <div class="stat-box">
                        <h4>🏆 Total Wins</h4>
                        <div class="stat-value" id="totalWins">${userData.totalWins}</div>
                    </div>
                </div>
                
                <!-- Number History Box -->
                <div class="history-box">
                    <div class="history-title">📜 Called Numbers</div>
                    <div class="numbers-list" id="numbersHistory"></div>
                </div>
                
                <!-- Game Info Row -->
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <div style="flex: 1; background: #e3f2fd; padding: 10px; border-radius: 10px; text-align: center;">
                        <small>Prize</small><br><b><span id="prizePool">${userData.selectedRoom * 2}</span> ETB</b>
                    </div>
                    <div style="flex: 1; background: #f0fdf4; padding: 10px; border-radius: 10px; text-align: center;">
                        <small>Calls</small><br><b><span id="callCount">0</span>/75</b>
                    </div>
                </div>

                <div class="big-display" id="currentNumberDisplay">Ready</div>
                
                <table class="bingo-table" id="bingoCard"></table>
                
                <div style="display:grid; grid-template-columns: 2fr 1.2fr; gap:10px; margin-top: 10px;">
                    <button class="btn btn-green" id="btnMain" onclick="toggleAutoPlay()">▶ Start Game</button>
                    <button class="btn btn-red" onclick="verifyBingo()">BINGO!</button>
                </div>
                <button class="btn btn-outline" style="margin-top: 10px;" onclick="exitGame()">🚪 Exit Lobby</button>
            </div>
        </div>
    `;
    
    // Initialize bingo game if not in waiting screen
    if (!(userData.pendingDeposit && !userData.pendingDeposit.confirmed)) {
        startNewGame();
    }
}

function showErrorPage() {
    const pageContainer = document.getElementById('pageContainer');
    pageContainer.innerHTML = `
        <div class="header">
            <h2>Error Loading Game</h2>
            <p>Please check console for details or reload the page.</p>
            <button class="btn btn-green" onclick="window.location.reload()">Reload Page</button>
        </div>
    `;
}

// ==================== LOAD MODALS ====================
function loadModals() {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <!-- Telegram Instructions Modal -->
        <div id="telegramModal" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <h3 style="color: #009b3a; margin-bottom: 15px;">📤 Payment Verification</h3>
                <p style="margin-bottom: 10px; color: #333;">
                    <strong>SEND THE TRANSFER LINK OR SCREENSHOT TO:</strong>
                </p>
                <p style="font-size: 1.5rem; color: #0088cc; font-weight: bold; margin: 15px 0;">
                    @rasenok
                </p>
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 20px;">
                    Click the button below to open Telegram and send your payment proof
                </p>
                <a href="https://t.me/rasenok" target="_blank" class="telegram-btn" onclick="closeModal('telegramModal')">
                    📱 Open Telegram @rasenok
                </a>
                <button class="btn btn-outline" style="margin-top: 15px;" onclick="closeModal('telegramModal')">
                    Continue
                </button>
            </div>
        </div>

        <!-- Support Team Modal -->
        <div id="supportModal" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <h3 style="color: #009b3a; margin-bottom: 15px;">👥 Support Team</h3>
                <p style="margin-bottom: 15px; color: #666; text-align: center;">
                    Contact us for any questions or issues
                </p>
                
                <div class="contact-info">
                    <div class="contact-item">
                        <div class="contact-icon">📱</div>
                        <div class="contact-details">
                            <div class="contact-label">Phone Number</div>
                            <div class="contact-value">+251921302111</div>
                        </div>
                        <button class="btn btn-outline" style="width: auto; padding: 5px 10px; font-size: 0.8rem;" onclick="copyText('+251921302111')">
                            📋
                        </button>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">📨</div>
                        <div class="contact-details">
                            <div class="contact-label">Telegram Account</div>
                            <div class="contact-value">@rasenok</div>
                        </div>
                        <button class="btn btn-outline" style="width: auto; padding: 5px 10px; font-size: 0.8rem;" onclick="copyText('@rasenok')">
                            📋
                        </button>
                    </div>
                </div>
                
                <p style="font-size: 0.9rem; color: #666; margin: 15px 0;">
                    We're available 24/7 to assist you with any questions about the game, deposits, or withdrawals.
                </p>
                
                <button class="btn btn-green" onclick="closeModal('supportModal')">
                    👍 Got it
                </button>
                
                <a href="https://t.me/rasenok" target="_blank" style="display: block; margin-top: 10px;">
                    <button class="btn btn-blue">
                        📱 Open Telegram Now
                    </button>
                </a>
            </div>
        </div>

        <!-- Profile Page Modal -->
        <div id="profilePage" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <div class="header">
                    <button onclick="closeModal('profilePage')" style="background:none;border:none;color:white;position:absolute;left:15px;top:20px;font-size:1.2rem;cursor:pointer;">←</button>
                    <h2>👤 My Profile</h2>
                </div>

                <div class="input-group">
                    <label>Full Name (for Payouts)</label>
                    <input type="text" id="editName" placeholder="Enter your name" value="${userData.name}">
                </div>

                <div class="input-group">
                    <label>Phone Number (TeleBirr)</label>
                    <input type="tel" id="editPhone" placeholder="09... or 07..." value="${userData.phone}">
                </div>

                <button class="btn btn-green" onclick="saveProfile()">💾 Save Profile Info</button>
                <button class="btn btn-outline" onclick="closeModal('profilePage')">Cancel</button>
            </div>
        </div>
    `;
}

// ==================== MODAL MANAGEMENT ====================
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// ==================== UTILITY FUNCTIONS ====================
function saveData() {
    localStorage.setItem('afroBingoUser', JSON.stringify(userData));
}

function showToast(msg, type) {
    const n = document.getElementById('notification');
    if (!n) return;
    
    n.textContent = msg;
    n.style.background = type === 'success' ? '#009b3a' : '#333';
    n.classList.add('show');
    setTimeout(() => {
        n.classList.remove('show');
    }, 3000);
}

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(() => {
        showToast("Copied to clipboard!", "success");
    }).catch(err => {
        console.error("Copy failed:", err);
        showToast("Copy failed. Please select and copy manually.", "error");
    });
}

function openTelegram() {
    window.open('https://t.me/rasenok', '_blank');
}

// ==================== GAME FUNCTIONS ====================
let game = {
    cardGrid: [],
    markedState: [],
    calledNumbers: [],
    autoInterval: null,
    isAutoPlaying: false,
    isGameActive: false,
    currentNumbers: []
};

function selectRoom(price) {
    userData.selectedRoom = price;
    saveData();
    showPage('deposit');
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

function checkConfirmation() {
    const confirmed = confirm("Has the admin (@rasenok) confirmed your payment?");
    
    if (confirmed) {
        userData.balance += userData.selectedRoom;
        userData.pendingDeposit = null;
        saveData();
        
        // Hide waiting screen, show game
        document.getElementById('waitingScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        startNewGame();
        
        showToast("Payment confirmed! Game activated.", "success");
    } else {
        showToast("Please wait for admin confirmation from @rasenok", "error");
    }
}

function exitWaiting() {
    userData.pendingDeposit = null;
    saveData();
    showPage('lobby');
}

function startNewGame() {
    game.isGameActive = true;
    stopAutoPlay();
    
    game.calledNumbers = [];
    game.currentNumbers = [];
    game.cardGrid = [];
    game.markedState = [];
    
    document.getElementById('callCount').textContent = "0";
    document.getElementById('currentNumberDisplay').textContent = "Ready";
    document.getElementById('matchesCount').textContent = "0";
    updateNumbersHistory();
    
    for(let r = 0; r < 5; r++) { 
        game.cardGrid[r] = []; 
        game.markedState[r] = []; 
    }
    
    ['B','I','N','G','O'].forEach((_, col) => {
        const min = col * 15 + 1;
        let nums = [];
        while(nums.length < 5) {
            let n = Math.floor(Math.random() * 15) + min;
            if(!nums.includes(n)) nums.push(n);
        }
        nums.sort((a,b) => a - b);
        for(let r = 0; r < 5; r++) {
            game.cardGrid[r][col] = nums[r];
            game.markedState[r][col] = false;
        }
    });
    
    game.markedState[2][2] = true;
    renderCard();
}

function renderCard() {
    const table = document.getElementById('bingoCard');
    if (!table) return;
    
    table.innerHTML = '';
    
    const thr = table.insertRow();
    ['B','I','N','G','O'].forEach(l => {
        const th = document.createElement('th');
        th.textContent = l; 
        thr.appendChild(th);
    });
    
    for(let r = 0; r < 5; r++) {
        const row = table.insertRow();
        for(let c = 0; c < 5; c++) {
            const cell = row.insertCell();
            if(r === 2 && c === 2) {
                cell.textContent = "FREE";
                cell.className = "free marked";
            } else {
                cell.textContent = game.cardGrid[r][c];
                cell.dataset.num = game.cardGrid[r][c];
                cell.onclick = () => manualMark(cell, r, c);
            }
        }
    }
}

function manualMark(cell, r, c) {
    if (!game.isGameActive) {
        showToast("Game not active yet. Wait for confirmation.", "error");
        return;
    }
    
    const num = parseInt(cell.dataset.num);
    if(game.calledNumbers.includes(num)) {
        Sound.click();
        cell.classList.toggle('marked');
        game.markedState[r][c] = cell.classList.contains('marked');
        updateMatchesCount();
    } else {
        showToast("Number not called yet!", "error");
    }
}

function updateMatchesCount() {
    let count = 0;
    for(let r = 0; r < 5; r++) {
        for(let c = 0; c < 5; c++) {
            if(game.markedState[r][c]) count++;
        }
    }
    document.getElementById('matchesCount').textContent = Math.max(0, count - 1);
}

function updateNumbersHistory() {
    const historyDiv = document.getElementById('numbersHistory');
    if (!historyDiv) return;
    
    historyDiv.innerHTML = '';
    
    const recentNumbers = [...game.currentNumbers].reverse().slice(0, 10);
    
    if (recentNumbers.length === 0) {
        historyDiv.innerHTML = '<div style="color: #666; text-align: center; padding: 10px;">No numbers called yet</div>';
        return;
    }
    
    recentNumbers.forEach((num, index) => {
        const badge = document.createElement('div');
        badge.className = 'number-badge';
        if(index === 0) badge.classList.add('recent');
        
        const letter = ['B','I','N','G','O'][Math.floor((num-1)/15)];
        badge.textContent = `${letter}-${num}`;
        historyDiv.appendChild(badge);
    });
}

function toggleAutoPlay() {
    if (!game.isGameActive) {
        showToast("Game not active yet. Wait for confirmation.", "error");
        return;
    }
    
    if(game.isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    game.isAutoPlaying = true;
    document.getElementById('btnMain').textContent = "⏹ Pause";
    document.getElementById('btnMain').className = "btn btn-red";
    
    callNumber();
    game.autoInterval = setInterval(callNumber, 3500);
}

function stopAutoPlay() {
    game.isAutoPlaying = false;
    clearInterval(game.autoInterval);
    document.getElementById('btnMain').textContent = "▶ Resume";
    document.getElementById('btnMain').className = "btn btn-green";
}

function callNumber() {
    if(game.calledNumbers.length >= 75) { 
        stopAutoPlay(); 
        return; 
    }
    
    let num;
    do { 
        num = Math.floor(Math.random() * 75) + 1; 
    } while(game.calledNumbers.includes(num));
    
    game.calledNumbers.push(num);
    game.currentNumbers.push(num);
    Sound.number();
    
    const letter = ['B','I','N','G','O'][Math.floor((num-1)/15)];
    document.getElementById('currentNumberDisplay').textContent = `${letter}-${num}`;
    document.getElementById('callCount').textContent = game.calledNumbers.length;
    
    const cell = document.querySelector(`td[data-num="${num}"]`);
    if(cell) {
        cell.style.boxShadow = "inset 0 0 10px #009b3a";
        setTimeout(() => { 
            if(cell) cell.style.boxShadow = ""; 
        }, 1000);
    }
    
    updateNumbersHistory();
}

function verifyBingo() {
    if (!game.isGameActive) {
        showToast("Game not active yet. Wait for confirmation.", "error");
        return;
    }
    
    let won = false;
    
    // Check rows
    for(let i = 0; i < 5; i++) {
        if(game.markedState[i].every(v => v)) won = true;
    }
    
    // Check columns
    for(let i = 0; i < 5; i++) {
        let colComplete = true;
        for(let j = 0; j < 5; j++) { 
            if(!game.markedState[j][i]) colComplete = false; 
        }
        if(colComplete) won = true;
    }
    
    // Check diagonals
    let d1 = true, d2 = true;
    for(let i = 0; i < 5; i++) {
        if(!game.markedState[i][i]) d1 = false;
        if(!game.markedState[i][4-i]) d2 = false;
    }
    if(d1 || d2) won = true;

    if(won) {
        Sound.win();
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        const prize = userData.selectedRoom * 2;
        userData.balance += prize;
        userData.totalWins++;
        userData.totalWinnings += prize;
        
        saveData();
        showToast(`🎉 BINGO! You won ${prize} ETB!`, "success");
        stopAutoPlay();
        setTimeout(startNewGame, 4000);
    } else {
        Sound.error();
        showToast("Not a Bingo yet. Keep playing!", "error");
    }
}

function exitGame() {
    stopAutoPlay();
    game.isGameActive = false;
    showPage('lobby');
}

// ==================== GLOBAL FUNCTIONS ====================
window.showPage = showPage;
window.showModal = showModal;
window.closeModal = closeModal;
window.copyText = copyText;
window.openTelegram = openTelegram;
window.selectRoom = selectRoom;
window.confirmDeposit = confirmDeposit;
window.checkConfirmation = checkConfirmation;
window.exitWaiting = exitWaiting;
window.toggleAutoPlay = toggleAutoPlay;
window.verifyBingo = verifyBingo;
window.exitGame = exitGame;

// Profile functions
window.saveProfile = function() {
    const nameInput = document.getElementById('editName');
    const phoneInput = document.getElementById('editPhone');
    
    if (nameInput && phoneInput) {
        userData.name = nameInput.value.trim() || "Player";
        userData.phone = phoneInput.value.trim();
        saveData();
        showToast("Profile Updated!", "success");
        closeModal('profilePage');
        showPage('lobby'); // Refresh lobby to show updated name
    }
};

window.showSupportTeam = function() {
    showModal('supportModal');
};

// ==================== INITIALIZATION ====================
window.onload = function() {
    // Load modals first
    loadModals();
    
    // Show lobby page
    showPage('lobby');
};