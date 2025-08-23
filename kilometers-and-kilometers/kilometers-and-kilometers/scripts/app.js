// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Load initial data if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        loadAppData();
    }
});

function loadAppData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update user info in UI
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-points').innerHTML = `${currentUser.points} <i class="fas fa-coins"></i>`;
    
    // Update profile page
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('join-date').textContent = currentUser.joined;
    document.getElementById('profile-points').textContent = currentUser.points;
    document.getElementById('profile-destinations').textContent = currentUser.visitedDestinations.length;
    
    // Load dashboard data
    loadDashboard();
    
    // Load quests
    loadQuests();
    
    // Load leaderboard
    loadLeaderboard();
    
    // Load friends
    loadFriends();
    
    // Load profile
    loadProfile();
}

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`.nav-link[data-page="${pageId}"]`).classList.add('active');
}

function loadDashboard() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update stats
    document.getElementById('visited-count').textContent = currentUser.visitedDestinations.length;
    
    // Calculate completed quests
    const quests = getQuests();
    const completedQuests = quests.filter(quest => 
        quest.destinations.every(dest => currentUser.visitedDestinations.includes(dest))
    ).length;
    
    document.getElementById('quests-completed').textContent = completedQuests;
    
    // Calculate rank
    const users = getUsers();
    const sortedUsers = [...users].sort((a, b) => b.points - a.points);
    const rank = sortedUsers.findIndex(u => u.id === currentUser.id) + 1;
    document.getElementById('user-rank').textContent = `#${rank}`;
    
    // Load active quests
    loadActiveQuests();
    
    // Load recent activity
    loadRecentActivity();
}

function loadActiveQuests() {
    const currentUser = getCurrentUser();
    const quests = getQuests();
    const destinations = getDestinations();
    const container = document.getElementById('active-quests');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    quests.forEach(quest => {
        // Calculate progress
        const visitedCount = quest.destinations.filter(dest => 
            currentUser.visitedDestinations.includes(dest)
        ).length;
        
        const progress = (visitedCount / quest.destinations.length) * 100;
        
        // Create quest card
        const questCard = document.createElement('div');
        questCard.className = 'quest-card';
        questCard.innerHTML = `
            <div class="quest-image" style="background-image: url('${quest.image || 'images/placeholder-quest.jpg'}')"></div>
            <div class="quest-content">
                <h3 class="quest-title">${quest.name}</h3>
                <p class="quest-description">${quest.description}</p>
                <div class="quest-meta">
                    <span class="quest-reward"><i class="fas fa-coins"></i> ${quest.reward} points</span>
                    <span>${quest.destinations.length} destinations</span>
                </div>
                <div class="quest-progress">
                    <div class="progress-bar">
                        <div class="progress-value" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">${visitedCount}/${quest.destinations.length} visited</div>
                </div>
                <button class="btn btn-primary" onclick="viewQuest(${quest.id})">View Quest</button>
            </div>
        `;
        
        container.appendChild(questCard);
    });
}

function loadRecentActivity() {
    const currentUser = getCurrentUser();
    const activities = getActivities();
    const userActivities = activities.filter(a => a.userId === currentUser.id);
    const container = document.getElementById('recent-activity');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    // Show only recent 5 activities
    const recentActivities = userActivities.slice(0, 5);
    
    if (recentActivities.length === 0) {
        container.innerHTML = '<p class="text-center">No activity yet. Start exploring!</p>';
        return;
    }
    
    recentActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        let icon = 'fas fa-star';
        if (activity.type === 'destination') icon = 'fas fa-map-marker-alt';
        if (activity.type === 'friend') icon = 'fas fa-user-plus';
        if (activity.type === 'quest') icon = 'fas fa-trophy';
        if (activity.type === 'system') icon = 'fas fa-info-circle';
        
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="${icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.message}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
            ${activity.points > 0 ? `<span class="points-earned">+${activity.points}</span>` : ''}
        `;
        
        container.appendChild(activityItem);
    });
}