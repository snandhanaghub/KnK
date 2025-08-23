// Friends functionality
function loadFriends() {
    const currentUser = getCurrentUser();
    const users = getUsers();
    
    // Load friends list
    loadFriendsList();
    
    // Load friend requests
    loadFriendRequests();
    
    // Search functionality
    const searchBtn = document.querySelector('.friends-section .btn-primary');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchFriends);
    }
    
    const searchInput = document.getElementById('friend-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchFriends();
            }
        });
    }
}

function loadFriendsList() {
    const currentUser = getCurrentUser();
    const users = getUsers();
    const container = document.getElementById('friends-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (currentUser.friends.length === 0) {
        container.innerHTML = '<p class="text-center">No friends yet. Search for friends to add them!</p>';
        return;
    }
    
    currentUser.friends.forEach(friendId => {
        const friend = users.find(u => u.id === friendId);
        if (!friend) return;
        
        const friendCard = document.createElement('div');
        friendCard.className = 'friend-card';
        friendCard.innerHTML = `
            <div class="friend-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="friend-info">
                <h4>${friend.name}</h4>
                <p>${friend.points} points • ${friend.visitedDestinations.length} destinations</p>
            </div>
            <button class="btn btn-outline" onclick="removeFriend(${friend.id})">Remove</button>
        `;
        
        container.appendChild(friendCard);
    });
}

function loadFriendRequests() {
    const currentUser = getCurrentUser();
    const users = getUsers();
    const container = document.getElementById('friend-requests-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (currentUser.friendRequests.length === 0) {
        container.innerHTML = '<p class="text-center">No pending friend requests.</p>';
        return;
    }
    
    currentUser.friendRequests.forEach(requestId => {
        const user = users.find(u => u.id === requestId);
        if (!user) return;
        
        const requestCard = document.createElement('div');
        requestCard.className = 'friend-card';
        requestCard.innerHTML = `
            <div class="friend-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="friend-info">
                <h4>${user.name}</h4>
                <p>Wants to be your friend</p>
            </div>
            <div>
                <button class="btn btn-success" onclick="acceptFriendRequest(${user.id})">Accept</button>
                <button class="btn btn-outline" onclick="declineFriendRequest(${user.id})">Decline</button>
            </div>
        `;
        
        container.appendChild(requestCard);
    });
}

function searchFriends() {
    const searchTerm = document.getElementById('friend-search').value.toLowerCase();
    if (!searchTerm) return;
    
    const users = getUsers();
    const currentUser = getCurrentUser();
    
    // Filter users by search term, excluding current user and existing friends
    const results = users.filter(user => 
        user.id !== currentUser.id && 
        !currentUser.friends.includes(user.id) &&
        (user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm))
    );
    
    if (results.length === 0) {
        alert('No users found matching your search.');
        return;
    }
    
    // Create modal with search results
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Search Results</h2>
            <div class="search-results">
                ${results.map(user => `
                    <div class="friend-card">
                        <div class="friend-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="friend-info">
                            <h4>${user.name}</h4>
                            <p>${user.points} points • ${user.visitedDestinations.length} destinations</p>
                        </div>
                        <button class="btn btn-primary" onclick="sendFriendRequest(${user.id})">Add Friend</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function sendFriendRequest(friendId) {
    const users = getUsers();
    const currentUser = getCurrentUser();
    const friend = users.find(u => u.id === friendId);
    
    if (!friend) return;
    
    // Check if request already sent
    if (friend.friendRequests.includes(currentUser.id)) {
        alert('Friend request already sent to this user.');
        return;
    }
    
    // Check if already friends
    if (currentUser.friends.includes(friendId)) {
        alert('You are already friends with this user.');
        return;
    }
    
    // Add friend request
    friend.friendRequests.push(currentUser.id);
    updateUser(friend);
    
    alert(`Friend request sent to ${friend.name}!`);
    
    // Close modal
    const modal = document.querySelector('.modal');
    if (modal) document.body.removeChild(modal);
}

function acceptFriendRequest(friendId) {
    const users = getUsers();
    const currentUser = getCurrentUser();
    const friend = users.find(u => u.id === friendId);
    
    if (!friend) return;
    
    // Remove from friend requests
    currentUser.friendRequests = currentUser.friendRequests.filter(id => id !== friendId);
    
    // Add to friends
    currentUser.friends.push(friendId);
    friend.friends.push(currentUser.id);
    
    // Update both users
    updateUser(currentUser);
    updateUser(friend);
    
    // Add activity
    addActivity({
        userId: currentUser.id,
        type: 'friend',
        message: `Became friends with ${friend.name}`,
        time: 'Just now',
        points: 50
    });
    
    addActivity({
        userId: friendId,
        type: 'friend',
        message: `Became friends with ${currentUser.name}`,
        time: 'Just now',
        points: 50
    });
    
    // Reload friends data
    loadFriendsList();
    loadFriendRequests();
    
    alert(`You are now friends with ${friend.name}!`);
}

function declineFriendRequest(friendId) {
    const currentUser = getCurrentUser();
    
    // Remove from friend requests
    currentUser.friendRequests = currentUser.friendRequests.filter(id => id !== friendId);
    updateUser(currentUser);
    
    // Reload friend requests
    loadFriendRequests();
}

function removeFriend(friendId) {
    const users = getUsers();
    const currentUser = getCurrentUser();
    const friend = users.find(u => u.id === friendId);
    
    if (!friend) return;
    
    // Remove from friends
    currentUser.friends = currentUser.friends.filter(id => id !== friendId);
    friend.friends = friend.friends.filter(id => id !== currentUser.id);
    
    // Update both users
    updateUser(currentUser);
    updateUser(friend);
    
    // Reload friends list
    loadFriendsList();
    
    alert(`Removed ${friend.name} from your friends.`);
}