// Sample data for the application
const sampleData = {
    users: [
        {
            id: 1,
            name: "John Traveler",
            email: "john@example.com",
            password: "password123",
            points: 1250,
            level: 3,
            joined: "Jan 15, 2023",
            location: "Kochi, Kerala",
            visitedDestinations: [1, 3],
            friends: [2, 3],
            friendRequests: [4]
        },
        {
            id: 2,
            name: "Sarah Explorer",
            email: "sarah@example.com",
            password: "password123",
            points: 980,
            level: 2,
            joined: "Feb 20, 2023",
            location: "Thiruvananthapuram, Kerala",
            visitedDestinations: [1, 2, 4],
            friends: [1],
            friendRequests: []
        },
        {
            id: 3,
            name: "Mike Adventurer",
            email: "mike@example.com",
            password: "password123",
            points: 750,
            level: 2,
            joined: "Mar 5, 2023",
            location: "Kozhikode, Kerala",
            visitedDestinations: [2, 5],
            friends: [1],
            friendRequests: []
        },
        {
            id: 4,
            name: "Emma Wanderer",
            email: "emma@example.com",
            password: "password123",
            points: 420,
            level: 1,
            joined: "Apr 12, 2023",
            location: "Munnar, Kerala",
            visitedDestinations: [3],
            friends: [],
            friendRequests: []
        }
    ],
    quests: [
        {
            id: 1,
            name: "Kerala Exploration",
            description: "Discover the beautiful destinations of Kerala, God's Own Country",
            reward: 500,
            destinations: [1, 2, 3, 4, 5],
            image: "https://i.pinimg.com/1200x/25/5b/db/255bdb84cc4f6222c83d8d381c8a8b0f.jpg"
        }
    ],
    destinations: [
        {
            id: 1,
            name: "Munnar Tea Gardens",
            description: "Explore the beautiful tea plantations of Munnar",
            reward: 100,
            image: "https://i.pinimg.com/736x/09/60/26/096026c4fec3d0e30b39fb3d565e8206.jpg",
            coordinates: { lat: 10.0889, lng: 77.0595 }
        },
        {
            id: 2,
            name: "Backwaters of Alleppey",
            description: "Experience the serene backwaters on a houseboat",
            reward: 100,
            image: "https://i.pinimg.com/736x/42/92/3d/42923d698e566f580b626b4a90a15df6.jpg",
            coordinates: { lat: 9.4981, lng: 76.3388 }
        },
        {
            id: 3,
            name: "Fort Kochi",
            description: "Discover the historic colonial architecture",
            reward: 100,
            image: "https://i.pinimg.com/736x/de/79/8e/de798e1328415006dd462c7ccbe82d8a.jpg",
            coordinates: { lat: 9.9312, lng: 76.2673 }
        },
        {
            id: 4,
            name: "Kovalam Beach",
            description: "Relax on the beautiful beaches of Kovalam",
            reward: 100,
            image: "https://i.pinimg.com/736x/c8/f0/78/c8f078bdd21a641c6bb62193c5d98f7f.jpg",
            coordinates: { lat: 8.3666, lng: 76.9969 }
        },
        {
            id: 5,
            name: "Periyar Wildlife Sanctuary",
            description: "Spot exotic wildlife in their natural habitat",
            reward: 100,
            image: "https://i.pinimg.com/1200x/5d/d2/f1/5dd2f10ea0ba20008775aa89b0da1126.jpg",
            coordinates: { lat: 9.4600, lng: 77.2100 }
        }
    ],
    activities: [
        {
            id: 1,
            userId: 1,
            type: "destination",
            message: "Visited Munnar Tea Gardens",
            time: "2 hours ago",
            points: 100
        },
        {
            id: 2,
            userId: 1,
            type: "friend",
            message: "Became friends with Sarah Explorer",
            time: "1 day ago",
            points: 50
        },
        {
            id: 3,
            userId: 1,
            type: "quest",
            message: "Completed Kerala Exploration quest",
            time: "3 days ago",
            points: 500
        },
        {
            id: 4,
            userId: 1,
            type: "system",
            message: "Joined Kilometers and Kilometers",
            time: "1 week ago",
            points: 0
        }
    ]
};

// Initialize localStorage with sample data if not already set
function initializeData() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(sampleData.users));
    }
    if (!localStorage.getItem('quests')) {
        localStorage.setItem('quests', JSON.stringify(sampleData.quests));
    }
    if (!localStorage.getItem('destinations')) {
        localStorage.setItem('destinations', JSON.stringify(sampleData.destinations));
    }
    if (!localStorage.getItem('activities')) {
        localStorage.setItem('activities', JSON.stringify(sampleData.activities));
    }
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(null));
    }
}

// Get data from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function getQuests() {
    return JSON.parse(localStorage.getItem('quests') || '[]');
}

function getDestinations() {
    return JSON.parse(localStorage.getItem('destinations') || '[]');
}

function getActivities() {
    return JSON.parse(localStorage.getItem('activities') || '[]');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

// Save data to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveQuests(quests) {
    localStorage.setItem('quests', JSON.stringify(quests));
}

function saveDestinations(destinations) {
    localStorage.setItem('destinations', JSON.stringify(destinations));
}

function saveActivities(activities) {
    localStorage.setItem('activities', JSON.stringify(activities));
}

function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Update user data
function updateUser(updatedUser) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
        
        // Update current user if it's the same user
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === updatedUser.id) {
            saveCurrentUser(updatedUser);
        }
    }
}

// Add a new activity
function addActivity(activity) {
    const activities = getActivities();
    activity.id = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
    activities.unshift(activity);
    saveActivities(activities);
    return activity;
}