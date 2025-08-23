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
            visitedDestinations: [3],
            friends: [],
            friendRequests: []
        }
    ],
    quests: [
        {
            id: 1,
            name: "Kerala Exploration",
            description: "Discover the beautiful destinations of Kerala",
            reward: 500,
            destinations: [1, 2, 3, 4, 5],
            image: "images/kerala-quest.jpg"
        }
    ],
    destinations: [
        {
            id: 1,
            name: "Munnar Tea Gardens",
            description: "Explore the beautiful tea plantations of Munnar",
            reward: 100,
            image: "images/destinations/munnar.jpg",
            coordinates: { lat: 10.0889, lng: 77.0595 }
        },
        {
            id: 2,
            name: "Backwaters of Alleppey",
            description: "Experience the serene backwaters on a houseboat",
            reward: 100,
            image: "images/destinations/alleppey.jpg",
            coordinates: { lat: 9.4981, lng: 76.3388 }
        },
        {
            id: 3,
            name: "Fort Kochi",
            description: "Discover the historic colonial architecture",
            reward: 100,
            image: "images/destinations/kochi.jpg",
            coordinates: { lat: 9.9312, lng: 76.2673 }
        },
        {
            id: 4,
            name: "Kovalam Beach",
            description: "Relax on the beautiful beaches of Kovalam",
            reward: 100,
            image: "images/destinations/kovalam.jpg",
            coordinates: { lat: 8.3666, lng: 76.9969 }
        },
        {
            id: 5,
            name: "Periyar Wildlife Sanctuary",
            description: "Spot exotic wildlife in their natural habitat",
            reward: 100,
            image: "images/destinations/periyar.jpg",
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