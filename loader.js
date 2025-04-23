// Create a script element to load the chat widget with defer attribute
const script = document.createElement('script');
script.src = 'https://visual-hive.github.io/mau-chat-widget/mau-chat-widget.js';
script.defer = true; // Use defer instead of async
document.head.appendChild(script);

// Add a flag to indicate we want to open the chat automatically after load
window.mauChatAutoOpen = true;
