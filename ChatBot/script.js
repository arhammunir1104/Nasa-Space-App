let messages = [
    { sender: 'bot', text: 'Hi there! How can I help you today?' },
];

const API_KEY = 'AIzaSyCBM0bqC5T9_TByzh_GlIhyLDdxZMK_f7c';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const toggleChatbot = () => {
    const chatbot = document.getElementById('chatbot');
    chatbot.style.display = chatbot.style.display === 'none' ? 'flex' : 'none';
    if (chatbot.style.display === 'flex') {
        updateChatbox(); // Ensure the initial bot message is displayed when opened
    }
};

const handleSend = async () => {
    const userInput = document.getElementById('userInput');
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    messages.push({ sender: 'user', text: userMessage });
    userInput.value = '';
    updateChatbox();

    const thinkingMessage = { sender: 'bot', text: 'Thinking...' };
    messages.push(thinkingMessage);
    updateChatbox();

    // Fetch response from the API
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: userMessage }],
                    },
                ],
            }),
        });
        const data = await response.json();
        const botResponse = data?.candidates[0]?.content?.parts[0]?.text || "Sorry, I didn't understand that.";
        
        messages[messages.length - 1] = { sender: 'bot', text: botResponse };
        updateChatbox();
    } catch (error) {
        messages[messages.length - 1] = { sender: 'bot', text: 'Oops! Something went wrong, try again!' };
        updateChatbox();
    }
};

const updateChatbox = () => {
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML = '';
    messages.forEach((msg) => {
        const li = document.createElement('li');
        li.className = `chat ${msg.sender === 'user' ? 'outgoing' : 'incoming'}`; // Adjust class based on sender
        li.innerHTML = `<p>${msg.text}</p>`;
        chatbox.appendChild(li);
    });
};
