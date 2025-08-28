// Quest-related functionality
function loadQuests() {
    const quests = getQuests();
    const container = document.getElementById('quests-list');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    quests.forEach(quest => {
        const questCard = document.createElement('div');
        questCard.className = 'quest-card';
        questCard.innerHTML = `
            <div class="quest-image" style="background-image: url('${quest.image || 'https://images.unsplash.com/photo-1580739824572-f54c2763b2f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}')"></div>
            <div class="quest-content">
                <h3 class="quest-title">${quest.name}</h3>
                <p class="quest-description">${quest.description}</p>
                <div class="quest-meta">
                    <span class="quest-reward"><i class="fas fa-coins"></i> ${quest.reward} points</span>
                    <span>${quest.destinations.length} destinations</span>
                </div>
                <button class="btn btn-primary" onclick="viewQuest(${quest.id})">View Details</button>
            </div>
        `;
        
        container.appendChild(questCard);
    });
}

function viewQuest(questId) {
    const quest = getQuests().find(q => q.id === questId);
    if (!quest) return;
    
    const currentUser = getCurrentUser();
    const destinations = getDestinations();
    
    // Create modal with quest details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${quest.name}</h2>
            <p>${quest.description}</p>
            <div class="quest-destinations">
                <h3>Destinations</h3>
                ${quest.destinations.map(destId => {
                    const destination = destinations.find(d => d.id === destId);
                    const isVisited = currentUser.visitedDestinations.includes(destId);
                    return `
                        <div class="destination-item ${isVisited ? 'visited' : ''}">
                            <div class="destination-image-modal" style="background-image: url('${destination.image}')"></div>
                            <div class="destination-info">
                                <h4>${destination.name}</h4>
                                <p>${destination.description}</p>
                                <div class="destination-status">
                                    ${isVisited ? 
                                        '<span class="status-visited"><i class="fas fa-check-circle"></i> Visited</span>' : 
                                        '<span class="status-not-visited"><i class="fas fa-map-marker-alt"></i> Not Visited</span>'
                                    }
                                    <span class="destination-reward"><i class="fas fa-coins"></i> ${destination.reward} points</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="checkInToDestination()">Check In to Destination</button>
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

function checkInToDestination() {
    // For the hackathon, we'll simulate checking in to a random destination
    const currentUser = getCurrentUser();
    const destinations = getDestinations();
    const quests = getQuests();
    const keralaQuest = quests.find(q => q.name === "Kerala Exploration");
    
    if (!keralaQuest) return;
    
    const unvisitedDestinations = keralaQuest.destinations.filter(dest => 
        !currentUser.visitedDestinations.includes(dest)
    );
    
    if (unvisitedDestinations.length === 0) {
        alert('You have visited all destinations in the Kerala Exploration quest!');
        return;
    }
    
    // Select a random unvisited destination
    const randomDestinationId = unvisitedDestinations[Math.floor(Math.random() * unvisitedDestinations.length)];
    const destination = destinations.find(d => d.id === randomDestinationId);
    
    if (!destination) return;
    
    // Update user data
    currentUser.visitedDestinations.push(randomDestinationId);
    currentUser.points += destination.reward;
    
    // Level up logic (every 500 points)
    const newLevel = Math.floor(currentUser.points / 500) + 1;
    if (newLevel > currentUser.level) {
        currentUser.level = newLevel;
        alert(`Level up! You are now a Level ${newLevel} traveler!`);
    }
    
    updateUser(currentUser);
    
    // Add activity
    addActivity({
        userId: currentUser.id,
        type: 'destination',
        message: `Visited ${destination.name}`,
        time: 'Just now',
        points: destination.reward
    });
    
    // Check if any quests are completed
    checkQuestCompletion();
    
    // Reload app data
    loadAppData();
    
    // Close any open modals
    const modal = document.querySelector('.modal');
    if (modal) document.body.removeChild(modal);
    
    alert(`Checked in to ${destination.name}! You earned ${destination.reward} points.`);
}

function checkQuestCompletion() {
    const currentUser = getCurrentUser();
    const quests = getQuests();
    
    quests.forEach(quest => {
        // Check if all destinations in the quest are visited
        const isCompleted = quest.destinations.every(dest => 
            currentUser.visitedDestinations.includes(dest)
        );
        
        // Check if this quest was already completed
        const activities = getActivities();
        const alreadyCompleted = activities.some(a => 
            a.userId === currentUser.id && 
            a.type === 'quest' && 
            a.message.includes(quest.name)
        );
        
        if (isCompleted && !alreadyCompleted) {
            // Award quest reward
            currentUser.points += quest.reward;
            updateUser(currentUser);
            
            // Add activity
            addActivity({
                userId: currentUser.id,
                type: 'quest',
                message: `Completed ${quest.name} quest`,
                time: 'Just now',
                points: quest.reward
            });
            
            alert(`Congratulations! You completed the ${quest.name} quest and earned ${quest.reward} points.`);
        }
    });
}