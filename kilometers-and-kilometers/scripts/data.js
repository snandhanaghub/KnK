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
            name: "Kerala Cultural Trail",
            description: "Experience the soul of Kerala through culture, art, and food",
            reward: 500,
            destinations: [1, 2, 3, 4, 5],
            image: "images/quest.jpg"   // 👈 cultural quest cover
        }
    ],
    destinations: [
        {
            id: 1,
            name: "Jew Street Walk, Kochi",
            description: "Stroll through Mattancherry’s historic Jew Street filled with spices, antiques, and stories.",
            reward: 100,
            image: "images/jewstreet.jpg",
            coordinates: { lat: 9.9636, lng: 76.2424 }
        },
        {
            id: 2,
            name: "Kaithari Experience, Chendamangalam",
            description: "Watch traditional handloom weaving in action and try it yourself.",
            reward: 100,
            image: "images/kaithari.jpg",
            coordinates: { lat: 10.1552, lng: 76.2125 }
        },
        {
            id: 3,
            name: "Kathakali at Kalamandalam, Cheruthuruthy",
            description: "Witness a mesmerizing Kathakali performance in Kerala’s cultural heartland.",
            reward: 100,
            image: "images/kathakali.jpg",
            coordinates: { lat: 10.7471, lng: 76.2725 }
        },
        {
            id: 4,
            name: "Ambalappuzha Palpayasam",
            description: "Taste the legendary sweet milk pudding offered at Ambalappuzha Sree Krishna Temple.",
            reward: 100,
            image: "images/palpayasam.jpg",
            coordinates: { lat: 9.3773, lng: 76.3354 }
        },
        {
            id: 5,
            name: "Spice Raid in Mittayi Theruvu, Kozhikode",
            description: "Explore Kozhikode’s Sweet Street, famous for halwas and spices.",
            reward: 100,
            image: "images/mittayi.jpg",
            coordinates: { lat: 11.2588, lng: 75.7804 }
        }
    ],
    activities: [
        {
            id: 1,
            userId: 1,
            type: "destination",
            message: "Explored Jew Street Walk, Kochi",
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
            message: "Completed Kerala Cultural Trail",
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