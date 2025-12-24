<<<<<<< HEAD
// DOM Elements
const voiceBtn = document.getElementById('voice-btn');
const voiceResponseText = document.getElementById('voice-response-text');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const quickQuestionBtns = document.querySelectorAll('.quick-question');
const uploadBtn = document.getElementById('upload-btn');
const imageUpload = document.getElementById('image-upload');
const uploadArea = document.getElementById('upload-area');
const imagePreview = document.getElementById('image-preview');
const getRecommendationBtn = document.getElementById('get-recommendation');
const cropCardsContainer = document.querySelector('.crop-cards');
const languageSelect = document.getElementById('language-select');
const currentLanguage = document.getElementById('current-language');
const weatherToggleBtns = document.querySelectorAll('.toggle-btn');

// Market data
const marketData = [
    { crop: "Wheat", min: 2100, max: 2350, avg: 2225, trend: "up" },
    { crop: "Rice", min: 2800, max: 3100, avg: 2950, trend: "stable" },
    { crop: "Maize", min: 1800, max: 2050, avg: 1925, trend: "up" },
    { crop: "Soybean", min: 4200, max: 4550, avg: 4375, trend: "up" },
    { crop: "Cotton", min: 5800, max: 6200, avg: 6000, trend: "down" },
    { crop: "Sugarcane", min: 3200, max: 3500, avg: 3350, trend: "stable" }
];

// Crop recommendations data
const cropData = {
    loamy: {
        kharif: ["Rice", "Maize", "Cotton", "Soybean"],
        rabi: ["Wheat", "Mustard", "Gram", "Barley"],
        zaid: ["Watermelon", "Cucumber", "Bitter Gourd"]
    },
    clay: {
        kharif: ["Rice", "Sugarcane", "Jute"],
        rabi: ["Wheat", "Mustard", "Potato"],
        zaid: ["Pumpkin", "Ridge Gourd"]
    },
    sandy: {
        kharif: ["Groundnut", "Millet", "Watermelon"],
        rabi: ["Barley", "Gram", "Mustard"],
        zaid: ["Muskmelon", "Cucumber"]
    },
    silt: {
        kharif: ["Rice", "Maize", "Soybean"],
        rabi: ["Wheat", "Barley", "Peas"],
        zaid: ["Bottle Gourd", "Sponge Gourd"]
    }
};

// Chatbot responses
const botResponses = {
    "greeting": "Hello! I'm AgriAI assistant. I can help with crop advice, disease diagnosis, market prices, and farming techniques. What would you like to know?",
    "crops for soil": "Based on your soil type (loamy) and current season (kharif), I recommend planting Rice, Maize, or Cotton. Rice would be most profitable given current market prices.",
    "wheat disease": "Yellow leaves on wheat could indicate several issues: 1) Nitrogen deficiency - apply urea fertilizer, 2) Leaf rust - apply fungicide containing propiconazole, 3) Overwatering - reduce irrigation frequency. Can you upload a photo for more accurate diagnosis?",
    "rice prices": "Current rice prices are ₹2,800-₹3,100 per quintal with an average of ₹2,950. Prices have stabilized this week and are expected to remain steady for the next 2 weeks.",
    "irrigation schedule": "For wheat in the current growth stage, irrigate every 7-10 days. For rice, maintain 2-3 inches of standing water. Adjust based on soil moisture and weather forecasts.",
    "fertilizer recommendation": "Based on your soil test showing low potassium, apply 50kg of MOP (Muriate of Potash) per acre. Also consider adding organic compost to improve soil structure.",
    "pest control": "For common pests in your area, I recommend neem oil spray (5ml per liter of water) every 10 days as a preventive measure. For severe infestations, use recommended insecticides sparingly.",
    "default": "I understand you're asking about farming. For more specific advice, please provide details like your crop type, observed symptoms, or upload a photo for disease diagnosis."
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize market data table
    populateMarketData();
    
    // Initialize weather chart
    initializeWeatherChart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set initial language
    updateLanguage();
});

// Set up all event listeners
function setupEventListeners() {
    // Voice assistant button
    voiceBtn.addEventListener('click', toggleVoiceAssistant);
    
    // Send chat message
    sendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendChatMessage();
    });
    
    // Quick question buttons
    quickQuestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.textContent;
            askQuickQuestion(question);
        });
    });
    
    // Image upload
    uploadBtn.addEventListener('click', () => imageUpload.click());
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Drag and drop for image upload
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#2E7D32';
        uploadArea.style.backgroundColor = 'rgba(46, 125, 50, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#E0E0E0';
        uploadArea.style.backgroundColor = 'white';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#E0E0E0';
        uploadArea.style.backgroundColor = 'white';
        
        if (e.dataTransfer.files.length) {
            imageUpload.files = e.dataTransfer.files;
            handleImageUpload();
        }
    });
    
    // Crop recommendation button
    getRecommendationBtn.addEventListener('click', getCropRecommendations);
    
    // Language selector
    languageSelect.addEventListener('change', updateLanguage);
    
    // Weather toggle buttons
    weatherToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            weatherToggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            toggleTemperatureUnit(this.dataset.unit);
        });
    });
    
    // Quick question button in chatbot
    document.getElementById('quick-question-btn').addEventListener('click', function() {
        document.querySelector('.quick-questions').classList.toggle('show');
    });
}

// Voice Assistant Functionality
let isListening = false;
function toggleVoiceAssistant() {
    const voiceIcon = voiceBtn.querySelector('i');
    const voiceText = voiceBtn.querySelector('span');
    
    if (!isListening) {
        // Start listening
        isListening = true;
        voiceIcon.className = 'fas fa-stop';
        voiceText.textContent = 'Listening...';
        voiceBtn.style.background = 'linear-gradient(135deg, #F44336, #FF9800)';
        
        // Simulate voice recognition
        setTimeout(() => {
            const randomQuestions = [
                "What crops should I plant this season?",
                "How to treat yellow leaves on my wheat?",
                "What's the current market price for rice?",
                "When should I irrigate my fields?"
            ];
            const randomQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
            
            processVoiceCommand(randomQuestion);
            
            // Stop listening after processing
            isListening = false;
            voiceIcon.className = 'fas fa-microphone';
            voiceText.textContent = 'Tap to Speak';
            voiceBtn.style.background = 'linear-gradient(135deg, #2E7D32, #4CAF50)';
        }, 2000);
    } else {
        // Stop listening
        isListening = false;
        voiceIcon.className = 'fas fa-microphone';
        voiceText.textContent = 'Tap to Speak';
        voiceBtn.style.background = 'linear-gradient(135deg, #2E7D32, #4CAF50)';
    }
}

function processVoiceCommand(command) {
    let response = "I heard: \"" + command + "\". ";
    
    if (command.includes("crop") && (command.includes("plant") || command.includes("season"))) {
        response += botResponses["crops for soil"];
    } else if (command.includes("yellow") || command.includes("disease")) {
        response += botResponses["wheat disease"];
    } else if (command.includes("price") || command.includes("market")) {
        response += botResponses["rice prices"];
    } else if (command.includes("irrigat") || command.includes("water")) {
        response += botResponses["irrigation schedule"];
    } else {
        response += "I can help with crop selection, disease diagnosis, irrigation scheduling, and market information. Could you please be more specific?";
    }
    
    voiceResponseText.textContent = response;
    
    // Speak the response
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(response);
        speech.lang = languageSelect.value === 'en' ? 'en-IN' : languageSelect.value + '-IN';
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);
    }
}

// Chatbot Functionality
function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessageToChat(message, 'user');
    chatInput.value = '';
    
    // Simulate typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message';
    typingIndicator.innerHTML = '<div class="message-content"><p><i>AgriAI is typing...</i></p></div>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Get bot response after delay
    setTimeout(() => {
        chatMessages.removeChild(typingIndicator);
        const botResponse = getBotResponse(message);
        addMessageToChat(botResponse, 'bot');
    }, 1000);
}

function addMessageToChat(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
        <div class="message-time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return botResponses.greeting;
    } else if (msg.includes('crop') && (msg.includes('soil') || msg.includes('plant'))) {
        return botResponses["crops for soil"];
    } else if (msg.includes('wheat') && (msg.includes('disease') || msg.includes('yellow'))) {
        return botResponses["wheat disease"];
    } else if (msg.includes('rice') && msg.includes('price')) {
        return botResponses["rice prices"];
    } else if (msg.includes('irrigation') || msg.includes('water') || msg.includes('irrigate')) {
        return botResponses["irrigation schedule"];
    } else if (msg.includes('fertilizer') || msg.includes('nutrient')) {
        return botResponses["fertilizer recommendation"];
    } else if (msg.includes('pest') || msg.includes('insect')) {
        return botResponses["pest control"];
    } else {
        return botResponses.default;
    }
}

function askQuickQuestion(question) {
    chatInput.value = question;
    sendChatMessage();
}

// Image Upload and Analysis
function handleImageUpload() {
    const file = imageUpload.files[0];
    if (!file) return;
    
    // Update upload area
    uploadArea.innerHTML = `
        <div class="upload-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3>Image Uploaded</h3>
        <p>${file.name}</p>
        <p class="upload-note">Analyzing image for crop diseases...</p>
    `;
    uploadArea.style.borderColor = '#2E7D32';
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded crop image" style="width:100%; height:auto; border-radius:8px;">`;
        
        // Simulate analysis
        simulateImageAnalysis();
    };
    reader.readAsDataURL(file);
}

function simulateImageAnalysis() {
    const status = document.getElementById('result-status');
    const cropType = document.getElementById('crop-type');
    const condition = document.getElementById('condition');
    const confidence = document.getElementById('confidence');
    const recommendedAction = document.getElementById('recommended-action');
    const treatmentDetails = document.getElementById('treatment-details');
    
    // Show analysis in progress
    status.textContent = "Analyzing...";
    status.className = "result-status pending";
    
    setTimeout(() => {
        // Simulate analysis results (randomized for demo)
        const crops = ["Wheat", "Rice", "Maize", "Cotton", "Soybean"];
        const conditions = ["Healthy", "Leaf Rust", "Powdery Mildew", "Nutrient Deficiency", "Bacterial Blight"];
        const treatments = [
            "Apply fungicide containing tebuconazole at recommended dosage.",
            "Increase potassium fertilization and reduce irrigation frequency.",
            "Remove infected leaves and apply neem oil spray every 7 days.",
            "Apply balanced NPK fertilizer and ensure proper drainage.",
            "No treatment needed. Maintain current crop management practices."
        ];
        
        const randomCrop = crops[Math.floor(Math.random() * crops.length)];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-100%
        const randomTreatment = treatments[Math.floor(Math.random() * treatments.length)];
        
        cropType.textContent = randomCrop;
        condition.textContent = randomCondition;
        confidence.textContent = `${randomConfidence}%`;
        recommendedAction.textContent = randomCondition === "Healthy" ? "No action needed" : "Apply treatment";
        treatmentDetails.textContent = randomTreatment;
        
        // Update status
        if (randomCondition === "Healthy") {
            status.textContent = "Healthy";
            status.className = "result-status good";
        } else {
            status.textContent = "Disease Detected";
            status.className = "result-status poor";
        }
    }, 3000);
}

// Crop Recommendations
function getCropRecommendations() {
    const soilType = document.getElementById('soil-type').value;
    const season = document.getElementById('season').value;
    const waterAvailability = document.getElementById('water-availability').value;
    const region = document.getElementById('region').value;
    
    // Get crops for selected soil and season
    const crops = cropData[soilType][season];
    
    // Clear previous results
    cropCardsContainer.innerHTML = '';
    
    // Create crop cards
    crops.forEach((crop, index) => {
        const profit = [12500, 18500, 15200, 21000, 17500, 14200, 16300, 19200];
        const yieldPerAcre = [18, 25, 22, 28, 20, 16, 19, 24];
        const sustainability = [8, 7, 9, 6, 8, 9, 7, 8];
        
        const card = document.createElement('div');
        card.className = 'crop-card';
        card.innerHTML = `
            <div class="crop-card-header">
                <span class="crop-name">${crop}</span>
                <span class="crop-profit">₹${profit[index % profit.length].toLocaleString()}/acre</span>
            </div>
            <div class="crop-details">
                <p><i class="fas fa-weight-hanging"></i> Yield: ${yieldPerAcre[index % yieldPerAcre.length]} quintals/acre</p>
                <p><i class="fas fa-leaf"></i> Sustainability: ${sustainability[index % sustainability.length]}/10</p>
                <p><i class="fas fa-tint"></i> Water needs: ${waterAvailability === 'low' ? 'Low' : waterAvailability === 'medium' ? 'Medium' : 'High'}</p>
                <p><i class="fas fa-calendar-alt"></i> Season: ${season.charAt(0).toUpperCase() + season.slice(1)}</p>
            </div>
        `;
        cropCardsContainer.appendChild(card);
    });
}

// Market Data
function populateMarketData() {
    const tableBody = document.getElementById('market-data');
    tableBody.innerHTML = '';
    
    marketData.forEach(item => {
        const row = document.createElement('tr');
        const trendIcon = item.trend === 'up' ? '<i class="fas fa-arrow-up trend-up"></i>' : 
                         item.trend === 'down' ? '<i class="fas fa-arrow-down trend-down"></i>' : 
                         '<i class="fas fa-minus" style="color:#757575"></i>';
        
        row.innerHTML = `
            <td>${item.crop}</td>
            <td>₹${item.min.toLocaleString()}</td>
            <td>₹${item.max.toLocaleString()}</td>
            <td>₹${item.avg.toLocaleString()}</td>
            <td>${trendIcon}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Weather Chart
function initializeWeatherChart() {
    const ctx = document.getElementById('weather-chart').getContext('2d');
    
    // Sample data for 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const highTemps = [32, 34, 31, 33, 35, 30, 32];
    const lowTemps = [22, 24, 21, 23, 25, 20, 22];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'High Temperature',
                    data: highTemps,
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Low Temperature',
                    data: lowTemps,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

function toggleTemperatureUnit(unit) {
    const windSpeed = document.getElementById('wind-speed');
    const temperatureElements = document.querySelectorAll('.temperature, .temp, .metric-value');
    
    if (unit === 'fahrenheit') {
        // Convert to Fahrenheit
        windSpeed.textContent = '7.5 mph';
    }
}
=======
// DOM Elements
const voiceBtn = document.getElementById('voice-btn');
const voiceResponseText = document.getElementById('voice-response-text');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const quickQuestionBtns = document.querySelectorAll('.quick-question');
const uploadBtn = document.getElementById('upload-btn');
const imageUpload = document.getElementById('image-upload');
const uploadArea = document.getElementById('upload-area');
const imagePreview = document.getElementById('image-preview');
const getRecommendationBtn = document.getElementById('get-recommendation');
const cropCardsContainer = document.querySelector('.crop-cards');
const languageSelect = document.getElementById('language-select');
const currentLanguage = document.getElementById('current-language');
const weatherToggleBtns = document.querySelectorAll('.toggle-btn');

// Market data
const marketData = [
    { crop: "Wheat", min: 2100, max: 2350, avg: 2225, trend: "up" },
    { crop: "Rice", min: 2800, max: 3100, avg: 2950, trend: "stable" },
    { crop: "Maize", min: 1800, max: 2050, avg: 1925, trend: "up" },
    { crop: "Soybean", min: 4200, max: 4550, avg: 4375, trend: "up" },
    { crop: "Cotton", min: 5800, max: 6200, avg: 6000, trend: "down" },
    { crop: "Sugarcane", min: 3200, max: 3500, avg: 3350, trend: "stable" }
];

// Crop recommendations data
const cropData = {
    loamy: {
        kharif: ["Rice", "Maize", "Cotton", "Soybean"],
        rabi: ["Wheat", "Mustard", "Gram", "Barley"],
        zaid: ["Watermelon", "Cucumber", "Bitter Gourd"]
    },
    clay: {
        kharif: ["Rice", "Sugarcane", "Jute"],
        rabi: ["Wheat", "Mustard", "Potato"],
        zaid: ["Pumpkin", "Ridge Gourd"]
    },
    sandy: {
        kharif: ["Groundnut", "Millet", "Watermelon"],
        rabi: ["Barley", "Gram", "Mustard"],
        zaid: ["Muskmelon", "Cucumber"]
    },
    silt: {
        kharif: ["Rice", "Maize", "Soybean"],
        rabi: ["Wheat", "Barley", "Peas"],
        zaid: ["Bottle Gourd", "Sponge Gourd"]
    }
};

// Chatbot responses
const botResponses = {
    "greeting": "Hello! I'm AgriAI assistant. I can help with crop advice, disease diagnosis, market prices, and farming techniques. What would you like to know?",
    "crops for soil": "Based on your soil type (loamy) and current season (kharif), I recommend planting Rice, Maize, or Cotton. Rice would be most profitable given current market prices.",
    "wheat disease": "Yellow leaves on wheat could indicate several issues: 1) Nitrogen deficiency - apply urea fertilizer, 2) Leaf rust - apply fungicide containing propiconazole, 3) Overwatering - reduce irrigation frequency. Can you upload a photo for more accurate diagnosis?",
    "rice prices": "Current rice prices are ₹2,800-₹3,100 per quintal with an average of ₹2,950. Prices have stabilized this week and are expected to remain steady for the next 2 weeks.",
    "irrigation schedule": "For wheat in the current growth stage, irrigate every 7-10 days. For rice, maintain 2-3 inches of standing water. Adjust based on soil moisture and weather forecasts.",
    "fertilizer recommendation": "Based on your soil test showing low potassium, apply 50kg of MOP (Muriate of Potash) per acre. Also consider adding organic compost to improve soil structure.",
    "pest control": "For common pests in your area, I recommend neem oil spray (5ml per liter of water) every 10 days as a preventive measure. For severe infestations, use recommended insecticides sparingly.",
    "default": "I understand you're asking about farming. For more specific advice, please provide details like your crop type, observed symptoms, or upload a photo for disease diagnosis."
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize market data table
    populateMarketData();
    
    // Initialize weather chart
    initializeWeatherChart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set initial language
    updateLanguage();
});

// Set up all event listeners
function setupEventListeners() {
    // Voice assistant button
    voiceBtn.addEventListener('click', toggleVoiceAssistant);
    
    // Send chat message
    sendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendChatMessage();
    });
    
    // Quick question buttons
    quickQuestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.textContent;
            askQuickQuestion(question);
        });
    });
    
    // Image upload
    uploadBtn.addEventListener('click', () => imageUpload.click());
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Drag and drop for image upload
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#2E7D32';
        uploadArea.style.backgroundColor = 'rgba(46, 125, 50, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#E0E0E0';
        uploadArea.style.backgroundColor = 'white';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#E0E0E0';
        uploadArea.style.backgroundColor = 'white';
        
        if (e.dataTransfer.files.length) {
            imageUpload.files = e.dataTransfer.files;
            handleImageUpload();
        }
    });
    
    // Crop recommendation button
    getRecommendationBtn.addEventListener('click', getCropRecommendations);
    
    // Language selector
    languageSelect.addEventListener('change', updateLanguage);
    
    // Weather toggle buttons
    weatherToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            weatherToggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            toggleTemperatureUnit(this.dataset.unit);
        });
    });
    
    // Quick question button in chatbot
    document.getElementById('quick-question-btn').addEventListener('click', function() {
        document.querySelector('.quick-questions').classList.toggle('show');
    });
}

// Voice Assistant Functionality
let isListening = false;
function toggleVoiceAssistant() {
    const voiceIcon = voiceBtn.querySelector('i');
    const voiceText = voiceBtn.querySelector('span');
    
    if (!isListening) {
        // Start listening
        isListening = true;
        voiceIcon.className = 'fas fa-stop';
        voiceText.textContent = 'Listening...';
        voiceBtn.style.background = 'linear-gradient(135deg, #F44336, #FF9800)';
        
        // Simulate voice recognition
        setTimeout(() => {
            const randomQuestions = [
                "What crops should I plant this season?",
                "How to treat yellow leaves on my wheat?",
                "What's the current market price for rice?",
                "When should I irrigate my fields?"
            ];
            const randomQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
            
            processVoiceCommand(randomQuestion);
            
            // Stop listening after processing
            isListening = false;
            voiceIcon.className = 'fas fa-microphone';
            voiceText.textContent = 'Tap to Speak';
            voiceBtn.style.background = 'linear-gradient(135deg, #2E7D32, #4CAF50)';
        }, 2000);
    } else {
        // Stop listening
        isListening = false;
        voiceIcon.className = 'fas fa-microphone';
        voiceText.textContent = 'Tap to Speak';
        voiceBtn.style.background = 'linear-gradient(135deg, #2E7D32, #4CAF50)';
    }
}

function processVoiceCommand(command) {
    let response = "I heard: \"" + command + "\". ";
    
    if (command.includes("crop") && (command.includes("plant") || command.includes("season"))) {
        response += botResponses["crops for soil"];
    } else if (command.includes("yellow") || command.includes("disease")) {
        response += botResponses["wheat disease"];
    } else if (command.includes("price") || command.includes("market")) {
        response += botResponses["rice prices"];
    } else if (command.includes("irrigat") || command.includes("water")) {
        response += botResponses["irrigation schedule"];
    } else {
        response += "I can help with crop selection, disease diagnosis, irrigation scheduling, and market information. Could you please be more specific?";
    }
    
    voiceResponseText.textContent = response;
    
    // Speak the response
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(response);
        speech.lang = languageSelect.value === 'en' ? 'en-IN' : languageSelect.value + '-IN';
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);
    }
}

// Chatbot Functionality
function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessageToChat(message, 'user');
    chatInput.value = '';
    
    // Simulate typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message';
    typingIndicator.innerHTML = '<div class="message-content"><p><i>AgriAI is typing...</i></p></div>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Get bot response after delay
    setTimeout(() => {
        chatMessages.removeChild(typingIndicator);
        const botResponse = getBotResponse(message);
        addMessageToChat(botResponse, 'bot');
    }, 1000);
}

function addMessageToChat(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
        <div class="message-time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return botResponses.greeting;
    } else if (msg.includes('crop') && (msg.includes('soil') || msg.includes('plant'))) {
        return botResponses["crops for soil"];
    } else if (msg.includes('wheat') && (msg.includes('disease') || msg.includes('yellow'))) {
        return botResponses["wheat disease"];
    } else if (msg.includes('rice') && msg.includes('price')) {
        return botResponses["rice prices"];
    } else if (msg.includes('irrigation') || msg.includes('water') || msg.includes('irrigate')) {
        return botResponses["irrigation schedule"];
    } else if (msg.includes('fertilizer') || msg.includes('nutrient')) {
        return botResponses["fertilizer recommendation"];
    } else if (msg.includes('pest') || msg.includes('insect')) {
        return botResponses["pest control"];
    } else {
        return botResponses.default;
    }
}

function askQuickQuestion(question) {
    chatInput.value = question;
    sendChatMessage();
}

// Image Upload and Analysis
function handleImageUpload() {
    const file = imageUpload.files[0];
    if (!file) return;
    
    // Update upload area
    uploadArea.innerHTML = `
        <div class="upload-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3>Image Uploaded</h3>
        <p>${file.name}</p>
        <p class="upload-note">Analyzing image for crop diseases...</p>
    `;
    uploadArea.style.borderColor = '#2E7D32';
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded crop image" style="width:100%; height:auto; border-radius:8px;">`;
        
        // Simulate analysis
        simulateImageAnalysis();
    };
    reader.readAsDataURL(file);
}

function simulateImageAnalysis() {
    const status = document.getElementById('result-status');
    const cropType = document.getElementById('crop-type');
    const condition = document.getElementById('condition');
    const confidence = document.getElementById('confidence');
    const recommendedAction = document.getElementById('recommended-action');
    const treatmentDetails = document.getElementById('treatment-details');
    
    // Show analysis in progress
    status.textContent = "Analyzing...";
    status.className = "result-status pending";
    
    setTimeout(() => {
        // Simulate analysis results (randomized for demo)
        const crops = ["Wheat", "Rice", "Maize", "Cotton", "Soybean"];
        const conditions = ["Healthy", "Leaf Rust", "Powdery Mildew", "Nutrient Deficiency", "Bacterial Blight"];
        const treatments = [
            "Apply fungicide containing tebuconazole at recommended dosage.",
            "Increase potassium fertilization and reduce irrigation frequency.",
            "Remove infected leaves and apply neem oil spray every 7 days.",
            "Apply balanced NPK fertilizer and ensure proper drainage.",
            "No treatment needed. Maintain current crop management practices."
        ];
        
        const randomCrop = crops[Math.floor(Math.random() * crops.length)];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-100%
        const randomTreatment = treatments[Math.floor(Math.random() * treatments.length)];
        
        cropType.textContent = randomCrop;
        condition.textContent = randomCondition;
        confidence.textContent = `${randomConfidence}%`;
        recommendedAction.textContent = randomCondition === "Healthy" ? "No action needed" : "Apply treatment";
        treatmentDetails.textContent = randomTreatment;
        
        // Update status
        if (randomCondition === "Healthy") {
            status.textContent = "Healthy";
            status.className = "result-status good";
        } else {
            status.textContent = "Disease Detected";
            status.className = "result-status poor";
        }
    }, 3000);
}

// Crop Recommendations
function getCropRecommendations() {
    const soilType = document.getElementById('soil-type').value;
    const season = document.getElementById('season').value;
    const waterAvailability = document.getElementById('water-availability').value;
    const region = document.getElementById('region').value;
    
    // Get crops for selected soil and season
    const crops = cropData[soilType][season];
    
    // Clear previous results
    cropCardsContainer.innerHTML = '';
    
    // Create crop cards
    crops.forEach((crop, index) => {
        const profit = [12500, 18500, 15200, 21000, 17500, 14200, 16300, 19200];
        const yieldPerAcre = [18, 25, 22, 28, 20, 16, 19, 24];
        const sustainability = [8, 7, 9, 6, 8, 9, 7, 8];
        
        const card = document.createElement('div');
        card.className = 'crop-card';
        card.innerHTML = `
            <div class="crop-card-header">
                <span class="crop-name">${crop}</span>
                <span class="crop-profit">₹${profit[index % profit.length].toLocaleString()}/acre</span>
            </div>
            <div class="crop-details">
                <p><i class="fas fa-weight-hanging"></i> Yield: ${yieldPerAcre[index % yieldPerAcre.length]} quintals/acre</p>
                <p><i class="fas fa-leaf"></i> Sustainability: ${sustainability[index % sustainability.length]}/10</p>
                <p><i class="fas fa-tint"></i> Water needs: ${waterAvailability === 'low' ? 'Low' : waterAvailability === 'medium' ? 'Medium' : 'High'}</p>
                <p><i class="fas fa-calendar-alt"></i> Season: ${season.charAt(0).toUpperCase() + season.slice(1)}</p>
            </div>
        `;
        cropCardsContainer.appendChild(card);
    });
}

// Market Data
function populateMarketData() {
    const tableBody = document.getElementById('market-data');
    tableBody.innerHTML = '';
    
    marketData.forEach(item => {
        const row = document.createElement('tr');
        const trendIcon = item.trend === 'up' ? '<i class="fas fa-arrow-up trend-up"></i>' : 
                         item.trend === 'down' ? '<i class="fas fa-arrow-down trend-down"></i>' : 
                         '<i class="fas fa-minus" style="color:#757575"></i>';
        
        row.innerHTML = `
            <td>${item.crop}</td>
            <td>₹${item.min.toLocaleString()}</td>
            <td>₹${item.max.toLocaleString()}</td>
            <td>₹${item.avg.toLocaleString()}</td>
            <td>${trendIcon}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Weather Chart
function initializeWeatherChart() {
    const ctx = document.getElementById('weather-chart').getContext('2d');
    
    // Sample data for 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const highTemps = [32, 34, 31, 33, 35, 30, 32];
    const lowTemps = [22, 24, 21, 23, 25, 20, 22];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'High Temperature',
                    data: highTemps,
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Low Temperature',
                    data: lowTemps,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

function toggleTemperatureUnit(unit) {
    const windSpeed = document.getElementById('wind-speed');
    const temperatureElements = document.querySelectorAll('.temperature, .temp, .metric-value');
    
    if (unit === 'fahrenheit') {
        // Convert to Fahrenheit
        windSpeed.textContent = '7.5 mph';
    }
}
>>>>>>> 0934c35eb2de48e72fa3eef8a986f7a53a77e884
    