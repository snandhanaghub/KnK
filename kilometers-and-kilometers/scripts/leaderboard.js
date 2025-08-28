// Leaderboard functionality
function loadLeaderboard() {
    loadGlobalLeaderboard();
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab content
            const tabName = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            document.getElementById(`${tabName}-leaderboard`).classList.add('active');
            
            // Load the appropriate leaderboard
            if (tabName === 'global') {
                loadGlobalLeaderboard();
            } else {
                loadFriendsLeaderboard();
            }
        });
    });
}

function loadGlobalLeaderboard() {
    const users = getUsers();
    const currentUser = getCurrentUser();
    const container = document.getElementById('global-leaderboard-body');
    
    if (!container) return;
    
    // Sort users by points (descending)
    const sortedUsers = [...users].sort((a, b) => b.points - a.points);
    
    container.innerHTML = '';
    
    sortedUsers.forEach((user, index) => {
        const rank = index + 1;
        const isCurrentUser = user.id === currentUser.id;
        
        const row = document.createElement('tr');
        if (isCurrentUser) row.classList.add('highlight');
        
        row.innerHTML = `
            <td>${rank}</td>
            <td>${user.name} ${isCurrentUser ? '(You)' : ''}</td>
            <td>${user.points}</td>
            <td>${user.visitedDestinations.length}</td>
        `;
        
        container.appendChild(row);
    });
}

function loadFriendsLeaderboard() {
    const users = getUsers();
    const currentUser = getCurrentUser();
    const container = document.getElementById('friends-leaderboard-body');
    
    if (!container) return;
    
    // Get friends including current user
    const friendIds = [...currentUser.friends, currentUser.id];
    const friends = users.filter(user => friendIds.includes(user.id));
    
    // Sort friends by points (descending)
    const sortedFriends = friends.sort((a, b) => b.points - a.points);
    
    container.innerHTML = '';
    
    if (sortedFriends.length === 0) {
        container.innerHTML = '<tr><td colspan="4" class="text-center">No friends yet. Add some friends to see their progress!</td></tr>';
        return;
    }
    
    sortedFriends.forEach((user, index) => {
        const rank = index + 1;
        const isCurrentUser = user.id === currentUser.id;
        
        const row = document.createElement('tr');
        if (isCurrentUser) row.classList.add('highlight');
        
        row.innerHTML = `
            <td>${rank}</td>
            <td>${user.name} ${isCurrentUser ? '(You)' : ''}</td>
            <td>${user.points}</td>
            <td>${user.visitedDestinations.length}</td>
        `;
        
        container.appendChild(row);
    });
}