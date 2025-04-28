// MAU Chat Widget - External Script
// Use deferred loading but open the chat right after initialization
function initMauChatWidget() {
  // List of URLs where the chat widget should appear
  const validURLs = [
    'https://mauvegas.com/why-attend',
    'https://mauvegas.com/marketers-executives',
    'https://mauvegas.com/founders-startup-investors',
    'https://mauvegas.com/technical-professionals',
    'https://mauvegas.com/agencies'
  ];
  
  // Check if current URL is in the list of valid URLs
  const currentURL = window.location.href.split('?')[0]; // Remove query parameters
  // const shouldShowWidget = validURLs.some(url => currentURL === url || currentURL === url + '/');
  const shouldShowWidget = true; // For testing purposes
  
  // Only proceed if we're on a valid URL
  if (shouldShowWidget) {
    // Create all the elements
    createChatWidgetElements();
    
    // Initialize chat widget functionality
    initializeChatWidget();
  }
  
  // Function to create all chat widget elements
  function createChatWidgetElements() {
    // Create container to hold all our chat elements
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'mau-chat-widget-container';
    
    // 1. Chat Button HTML
    widgetContainer.innerHTML = `
      <!-- Floating Chat Button -->
      <button id="chat-bubble-button" aria-label="Open Chat" style="
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background-color: white;
          border: 2px solid black;
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          cursor: pointer;
          z-index: 99999;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 0;
        ">
        <!-- Using a proper fallback approach for Font Awesome -->
        <span style="font-size: 24px; color: black;" class="chat-icon">
          <i class="fas fa-comments"></i>
        </span>
      </button>

      <!-- Welcome Message Popover -->
      <div id="welcome-popover" style="
          position: fixed;
          bottom: 30px;
          right: 95px;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 16px;
          padding: 10px 15px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          z-index: 99998;
          display: none;
          max-width: 200px;
          font-family: Arial, sans-serif;
          font-size: 14px;
        ">
        <p style="margin: 0; padding: 0;">Why is MAU right for me?</p>
        <!-- Triangle pointer on the right side -->
        <div style="
            position: absolute;
            top: 50%;
            right: -10px;
            width: 0;
            height: 0;
            transform: translateY(-50%);
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-left: 10px solid white;
          "></div>
      </div>

      <!-- Chat Popover Container - Now Responsive -->
      <div id="chat-popover-widget" style="
          position: fixed;
          bottom: 40px;
          right: 10px;
          width: calc(100% - 20px);
          max-width: 500px;
          height: 500px;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          z-index: 100000;
          display: none; /* Initially hidden, will be shown after initialization */
          overflow: hidden;
          padding-top: 5px;
          box-sizing: border-box;
          margin: 0 auto;
        ">
        <!-- Close Button -->
        <button id="close-chat-widget-button" aria-label="Close Chat" style="
            position: absolute;
            top: 8px;
            right: 8px;
            background-color: white;
            color: black;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            z-index: 100001;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            line-height: 1;
            font-family: Arial, sans-serif;
          ">
          X
        </button>

        <!-- Lazy load the iframe container -->
        <div id="chat-iframe-container" style="width: 100%; height: calc(100% - 20px);"></div>
      </div>
    `;
    
    // Append all elements to the body
    document.body.appendChild(widgetContainer);
    
    // Check if Font Awesome is loaded properly and apply fallback if needed
    setTimeout(function() {
      const iconElement = document.querySelector('.chat-icon i');
      if (iconElement && (
          window.getComputedStyle(iconElement, ':before').content === 'none' || 
          window.getComputedStyle(iconElement, ':before').content === '' ||
          window.getComputedStyle(iconElement).display === 'inline'
         )) {
        // Font Awesome isn't working, use emoji instead
        document.querySelector('.chat-icon').innerHTML = '💬';
      }
    }, 300); // Small delay to ensure Font Awesome has time to load
    
    // Make sure the welcome message is properly positioned on small screens
    function adjustWelcomeMessagePosition() {
      const welcomePopover = document.getElementById('welcome-popover');
      const chatBubble = document.getElementById('chat-bubble-button');
      
      if (welcomePopover && chatBubble) {
        const windowWidth = window.innerWidth;
        
        if (windowWidth < 350) {
          // Move welcome message above the chat bubble on very small screens
          welcomePopover.style.bottom = '90px';
          welcomePopover.style.right = '20px';
          
          // Change the triangle position
          const triangle = welcomePopover.querySelector('div');
          if (triangle) {
            triangle.style.top = 'auto';
            triangle.style.right = '20px';
            triangle.style.bottom = '-10px';
            triangle.style.transform = 'none';
            triangle.style.borderLeft = '10px solid transparent';
            triangle.style.borderRight = '10px solid transparent';
            triangle.style.borderTop = '10px solid white';
            triangle.style.borderBottom = 'none';
          }
        } else {
          // Default position
          welcomePopover.style.bottom = '30px';
          welcomePopover.style.right = '95px';
          
          // Reset triangle to default
          const triangle = welcomePopover.querySelector('div');
          if (triangle) {
            triangle.style.top = '50%';
            triangle.style.right = '-10px';
            triangle.style.bottom = 'auto';
            triangle.style.transform = 'translateY(-50%)';
            triangle.style.borderTop = '10px solid transparent';
            triangle.style.borderBottom = '10px solid transparent';
            triangle.style.borderLeft = '10px solid white';
            triangle.style.borderRight = 'none';
          }
        }
      }
    }
    
    // Run once on load and add event listener for window resize
    adjustWelcomeMessagePosition();
    window.addEventListener('resize', adjustWelcomeMessagePosition);
  }
  
  // Function to initialize chat widget functionality
  function initializeChatWidget() {
    const chatBubbleButton = document.getElementById('chat-bubble-button');
    const chatPopoverWidget = document.getElementById('chat-popover-widget');
    const closeChatButton = document.getElementById('close-chat-widget-button');
    const welcomePopover = document.getElementById('welcome-popover');
    const chatIframeContainer = document.getElementById('chat-iframe-container');
    
    let chatOpened = false; // Start with chat closed
    let welcomeMessageTimer = null;
    let wheelEventHandler = null;
    let iframeLoaded = false;
    
    // Function to load the iframe
    function loadIframe() {
      if (!iframeLoaded) {
        const iframe = document.createElement('iframe');
        iframe.id = 'chat-iframe';
        iframe.src = 'https://clarion-mau-assistant.visualhive.co';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.title = 'Clarion MAU Assistant Chat';
        
        chatIframeContainer.appendChild(iframe);
        iframeLoaded = true;
      }
    }
    
    // Function to show welcome message
    function showWelcomeMessage() {
      if (!chatOpened && chatBubbleButton.style.display !== 'none') {
        welcomePopover.style.display = 'block';
      }
    }
    
    // Function to start welcome message timer
    function startWelcomeMessageTimer() {
      // Clear any existing timer first
      if (welcomeMessageTimer) {
        clearTimeout(welcomeMessageTimer);
      }
      
      // Set new timer
      welcomeMessageTimer = setTimeout(showWelcomeMessage, 10000); // 10 seconds
    }
    
    // Function to open chat
    function openChat() {
      chatPopoverWidget.style.display = 'block';
      chatBubbleButton.style.display = 'none';
      welcomePopover.style.display = 'none';
      chatOpened = true;
      
      // Load iframe when chat is opened
      loadIframe();
      
      // Clear welcome message timer when chat is opened
      if (welcomeMessageTimer) {
        clearTimeout(welcomeMessageTimer);
        welcomeMessageTimer = null;
      }
    }

    // Function to close chat
    function closeChat() {
      chatPopoverWidget.style.display = 'none';
      chatBubbleButton.style.display = 'flex';
      chatOpened = false;
      
      // Start welcome message timer when chat is closed
      startWelcomeMessageTimer();
    }

    // Event listener for chat bubble button
    chatBubbleButton.addEventListener('click', openChat);

    // Event listener for close button
    closeChatButton.addEventListener('click', closeChat);
    
    // Make welcome message clickable to open chat
    welcomePopover.addEventListener('click', openChat);
    
    // Better approach for preventing scroll events from the iframe affecting the page
    // without causing page jiggling
    
    // 1. Create wheel event handler function
    wheelEventHandler = function(e) {
      // Only prevent default behavior when chat widget is visible
      if (chatPopoverWidget.style.display !== 'none') {
        e.preventDefault();
      }
      
      // Always stop propagation
      e.stopPropagation();
      return false;
    };
    
    // 2. Add wheel event listener directly to the chat widget
    chatPopoverWidget.addEventListener('wheel', function(e) {
      e.stopPropagation();
    }, true);
    
    // 3. Add mouseenter/mouseleave events with a better approach
    chatPopoverWidget.addEventListener('mouseenter', function() {
      if (chatPopoverWidget.style.display !== 'none') {
        // Instead of changing overflow (which causes the jiggling),
        // we'll capture wheel events on the window
        window.addEventListener('wheel', wheelEventHandler, { passive: false });
      }
    });
    
    // 4. Remove event handler when mouse leaves
    chatPopoverWidget.addEventListener('mouseleave', function() {
      // Remove the wheel event handler
      window.removeEventListener('wheel', wheelEventHandler, { passive: false });
    });
    
    // Auto-open based on window width (900px or larger)
    // and consider the mauChatAutoOpen flag if it exists
    if ((window.mauChatAutoOpen || window.mauChatAutoOpen === undefined) && window.innerWidth >= 900) {
      // Slight delay to ensure everything is ready
      setTimeout(openChat, 500);
    } else {
      // Default to the bubble if not auto-opening
      closeChat();
    }
  }
}

// Use a deferred loading approach instead of DOMContentLoaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  // If the page is already loaded, run the function with a slight delay
  setTimeout(initMauChatWidget, 1000); // 1 second delay for better page speed
} else {
  // Else wait for the page to load and then run with a delay
  window.addEventListener('load', function() {
    setTimeout(initMauChatWidget, 1000); // 1 second delay after load
  });
}
