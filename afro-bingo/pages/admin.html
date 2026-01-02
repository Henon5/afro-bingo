<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AFRO-BINGO 🇪🇹</title>
    <style>
        /* --- GLOBAL STYLES --- */
        body { font-family: 'Segoe UI', sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
        .page { max-width: 500px; margin: 0 auto; min-height: 100vh; background: #fff; padding: 20px; box-sizing: border-box; display: none; }
        .header { background: linear-gradient(135deg, #009b3a, #0039a6); color: white; padding: 30px 20px; border-radius: 0 0 25px 25px; text-align: center; margin: -20px -20px 20px -20px; position: relative; }
        
        /* --- BUTTONS --- */
        .btn { width: 100%; padding: 12px; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; margin-bottom: 10px; font-size: 1rem; transition: transform 0.1s; }
        .btn-green { background: #009b3a; color: white; }
        .btn-red { background: #ef3340; color: white; }
        .btn-outline { background: #f8f9fa; border: 1px solid #ddd; color: #333; }

        /* --- UI COMPONENTS --- */
        .profile-mini { display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 12px; border-radius: 12px; margin-bottom: 15px; }
        .room-card { background: white; border-radius: 12px; padding: 15px; margin: 10px 0; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: 0.2s; border: 2px solid #ddd; }
        .room-card:hover { transform: translateY(-2px); border-color: #009b3a; }

        /* --- ADMIN STYLES --- */
        .admin-card { background: #fff; border-radius: 12px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #009b3a; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .player-item-admin { display: flex; justify-content: space-between; padding: 12px; background: #f9f9f9; margin: 8px 0; border-radius: 8px; border: 1px solid #eee; }
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 0.8rem; margin-bottom: 5px; font-weight: bold; }
        .input-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
        
        /* Loading Overlay */
        #waitingOverlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); color: white; display: none; flex-direction: column; justify-content: center; align-items: center; text-align: center; z-index: 1000; }
    </style>
</head>
<body>

    <div id="waitingOverlay">
        <div style="font-size: 3rem;">⏳</div>
        <h3>Request Sent to Admin</h3>
        <p>Please wait while we verify your deposit...</p>
        <button class="btn btn-red" style="width: auto;" onclick="cancelRequest()">Cancel Request</button>
    </div>

    <div id="lobbyPage" class="page" style="display: block;">
        <div class="header">
            <h1>🎮 AFRO-BINGO 🇪🇹</h1>
            <p>Win Big with Every Number</p>
        </div>

        <div class="profile-mini">
            <div>
                <div style="font-size: 0.9rem; font-weight: bold;" id="displayName">Loading...</div>
                <div style="font-size: 0.75rem; color: #666;" id="displayPhone">No Phone</div>
            </div>
            <button class="btn btn-outline" style="width: auto; padding: 5px 15px;" onclick="showPage('profilePage')">Edit Profile</button>
        </div>

        <div class="balance-box" style="background: #009b3a; color: white; padding: 15px; border-radius: 12px; margin-bottom: 15px; text-align: center;">
            <div style="font-size: 0.8rem; opacity: 0.9;">Your Balance</div>
            <div style="font-size: 1.8rem; font-weight: bold;"><span id="userBalanceLobby">0</span> ETB</div>
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

        <button class="btn btn-outline" style="margin-top: 30px;" onclick="adminLoginPrompt()">🔧 Admin Access</button>
    </div>

    <div id="profilePage" class="page">
        <div class="header" style="background: #333;">
            <button onclick="showPage('lobbyPage')" style="background:none;border:none;color:white;position:absolute;left:15px;top:25px;font-size:1.5rem;cursor:pointer;">←</button>
            <h2>👤 My Profile</h2>
        </div>
        <div class="input-group">
            <label>Full Name</label>
            <input type="text" id="editName">
        </div>
        <div class="input-group">
            <label>Phone Number (TeleBirr)</label>
            <input type="tel" id="editPhone">
        </div>
        <button class="btn btn-green" onclick="saveProfile()">💾 Save Profile Info</button>
    </div>

    <div id="gamePage" class="page">
        <div class="header" style="background: gold; color: #333;">
            <h2>🎰 BINGO ROOM</h2>
            <p id="activeRoomInfo">Room: 0 ETB</p>
        </div>
        <div style="text-align: center; padding: 50px 0;">
            <h3>Game Board Loading...</h3>
            <button class="btn btn-red" onclick="showPage('lobbyPage')">Exit Game</button>
        </div>
    </div>

    <div id="adminPage" class="page">
        <div class="header" style="background: #222;">
            <button onclick="showPage('lobbyPage')" style="background:none;border:none;color:white;position:absolute;left:15px;top:25px;font-size:1.5rem;cursor:pointer;">←</button>
            <h2>🔧 Admin Panel</h2>
        </div>

        <div class="admin-card">
            <h4>⏳ Player Requests (Click ✔ to let them in)</h4>
            <div id="pendingList"></div>
        </div>

        <div class="admin-card">
            <h4>💰 Manual Balance Adjustment</h4>
            <input type="tel" id="adminPhone" placeholder="Phone Number" style="width:100%; padding:10px; margin-bottom:10px; border-radius:5px; border:1px solid #ddd;">
            <input type="number" id="adminAmt" placeholder="Amount" style="width:100%; padding:10px; margin-bottom:10px; border-radius:5px; border:1px solid #ddd;">
            <button class="btn btn-green" onclick="manualAdjust(1)">Add Balance</button>
        </div>
    </div>

    <script>
        // --- DATA ---
        let userData = JSON.parse(localStorage.getItem('bingo_user')) || { name: "Player", phone: "", balance: 0, status: "idle", currentRoom: 0 };
        let players = JSON.parse(localStorage.getItem('bingo_players')) || [];
        let requests = JSON.parse(localStorage.getItem('bingo_requests')) || [];

        const ADMIN_PASSCODE = "1234"; // 🔒 Change your passcode here

        // --- NAVIGATION ---
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
            document.getElementById(pageId).style.display = 'block';
            updateUI();
        }

        function updateUI() {
            document.getElementById('displayName').innerText = userData.name;
            document.getElementById('displayPhone').innerText = userData.phone || "Set Phone in Profile";
            document.getElementById('userBalanceLobby').innerText = userData.balance;
            document.getElementById('editName').value = userData.name;
            document.getElementById('editPhone').value = userData.phone;

            // Check if user request was approved while they were waiting
            if (userData.status === "approved") {
                document.getElementById('waitingOverlay').style.display = 'none';
                userData.status = "playing";
                saveData();
                showPage('gamePage');
                document.getElementById('activeRoomInfo').innerText = "Room: " + userData.currentRoom + " ETB";
            } else if (userData.status === "pending") {
                document.getElementById('waitingOverlay').style.display = 'flex';
            }

            renderAdminRequests();
        }

        function saveData() {
            localStorage.setItem('bingo_user', JSON.stringify(userData));
            localStorage.setItem('bingo_players', JSON.stringify(players));
            localStorage.setItem('bingo_requests', JSON.stringify(requests));
        }

        // --- ROOM SELECTION & REQUEST ---
        function selectRoom(price) {
            if (!userData.phone || userData.phone.length < 9) {
                alert("Please complete your profile (Name and Phone) first!");
                showPage('profilePage');
                return;
            }

            // Create Request for Admin
            const req = {
                name: userData.name,
                phone: userData.phone,
                amount: price,
                id: Date.now()
            };

            requests.push(req);
            userData.status = "pending";
            userData.currentRoom = price;
            saveData();
            updateUI();
        }

        function cancelRequest() {
            userData.status = "idle";
            requests = requests.filter(r => r.phone !== userData.phone);
            document.getElementById('waitingOverlay').style.display = 'none';
            saveData();
        }

        // --- ADMIN FUNCTIONS ---
        function adminLoginPrompt() {
            let pass = prompt("Enter Admin Passcode:");
            if (pass === ADMIN_PASSCODE) {
                showPage('adminPage');
            } else {
                alert("Wrong Passcode!");
            }
        }

        function renderAdminRequests() {
            const list = document.getElementById('pendingList');
            if (!list) return;
            list.innerHTML = requests.length === 0 ? '<p>No requests</p>' : '';
            
            requests.forEach((req, idx) => {
                const div = document.createElement('div');
                div.className = 'player-item-admin';
                div.innerHTML = `
                    <div><b>${req.name}</b><br><small>${req.phone} - ${req.amount} ETB</small></div>
                    <div>
                        <button onclick="approvePlayer(${idx})" style="font-size:1.5rem; color:green; background:none; border:none; cursor:pointer;">✔</button>
                        <button onclick="rejectPlayer(${idx})" style="font-size:1.5rem; color:red; background:none; border:none; cursor:pointer;">✖</button>
                    </div>
                `;
                list.appendChild(div);
            });
        }

        function approvePlayer(idx) {
            const req = requests[idx];
            
            // If the approved player is the one currently using this browser
            if (req.phone === userData.phone) {
                userData.status = "approved";
            }

            // Logic to update the player in the global 'players' database
            let pIndex = players.findIndex(p => p.phone === req.phone);
            if (pIndex > -1) {
                players[pIndex].status = "approved";
            }

            requests.splice(idx, 1);
            saveData();
            updateUI();
            alert("Player Approved!");
        }

        function manualAdjust(mult) {
            const ph = document.getElementById('adminPhone').value;
            const amt = parseInt(document.getElementById('adminAmt').value);
            if(ph === userData.phone) {
                userData.balance += (amt * mult);
            }
            alert("Balance Adjusted Locally");
            saveData();
            updateUI();
        }

        function saveProfile() {
            userData.name = document.getElementById('editName').value;
            userData.phone = document.getElementById('editPhone').value;
            saveData();
            alert("Profile Saved!");
            showPage('lobbyPage');
        }

        // Auto-refresh simulation for the "Waiting" overlay
        setInterval(() => {
            if (userData.status === "pending") {
                // In a real app, this would fetch from a server.
                // Here we just check localStorage for changes made by "Admin"
                const savedUser = JSON.parse(localStorage.getItem('bingo_user'));
                if (savedUser.status === "approved") {
                    userData.status = "approved";
                    updateUI();
                }
            }
        }, 2000);

        updateUI();
    </script>
</body>
</html>
