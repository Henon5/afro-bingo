// ==================== ADMIN SECURITY ====================
function isAdmin() {
    // Check if current user is @rasenok (you)
    try {
        const tg = window.Telegram?.WebApp;
        if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const currentUsername = tg.initDataUnsafe.user.username;
            // Only @rasenok is admin
            return currentUsername === 'rasenok';
        }
    } catch (e) {
        console.log("Telegram not available");
    }
    return false;
}

function showAdminButton() {
    const adminButtonContainer = document.getElementById('adminButtonContainer');
    if (!adminButtonContainer) return;
    
    // Only show if user is @rasenok
    if (isAdmin()) {
        adminButtonContainer.innerHTML = `
            <button class="btn btn-purple" onclick="showAdminPage()" style="margin-top: 10px; width: 100%;">
                🔧 Admin Panel
            </button>
        `;
    } else {
        adminButtonContainer.innerHTML = ''; // Hide for other users
    }
}

function showAdminPage() {
    // Double-check security
    if (!isAdmin()) {
        showToast("Access Denied! Admin only.", "error");
        return;
    }
    
    loadPage('admin.html', 'adminPage');
    loadAdminPanel();
}