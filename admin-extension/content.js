// AliDigitalSolution Admin Extension - Content Script
// Handles session storage access and page interaction

/**
 * Get localStorage and sessionStorage data
 */
function getStorageData() {
  try {
    const localStorage = {};
    const sessionStorage = {};

    // Get localStorage
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      localStorage[key] = window.localStorage.getItem(key);
    }

    // Get sessionStorage
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      sessionStorage[key] = window.sessionStorage.getItem(key);
    }

    return {
      localStorage: localStorage,
      sessionStorage: sessionStorage,
      localStorageCount: Object.keys(localStorage).length,
      sessionStorageCount: Object.keys(sessionStorage).length
    };
  } catch (error) {
    console.error('Error getting storage data:', error);
    return {
      localStorage: {},
      sessionStorage: {},
      localStorageCount: 0,
      sessionStorageCount: 0,
      error: error.message
    };
  }
}

/**
 * Get page session information
 */
function getPageSessionInfo() {
  try {
    return {
      url: window.location.href,
      domain: window.location.hostname,
      protocol: window.location.protocol,
      path: window.location.pathname,
      title: document.title,
      storage: getStorageData(),
      cookies: document.cookie ? document.cookie.split(';').length : 0
    };
  } catch (error) {
    console.error('Error getting page session info:', error);
    return {
      error: error.message
    };
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.type) {
      case 'GET_SESSION_INFO':
        const sessionInfo = getPageSessionInfo();
        sendResponse(sessionInfo);
        break;

      case 'GET_STORAGE':
        const storageData = getStorageData();
        sendResponse(storageData);
        break;

      case 'CLEAR_STORAGE':
        try {
          window.localStorage.clear();
          window.sessionStorage.clear();
          sendResponse({ success: true, message: 'Storage cleared' });
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
        break;

      default:
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
  
  return true; // Keep channel open for async response
});

// Notify background when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({
      type: 'PAGE_LOADED',
      url: window.location.href
    }).catch(() => {
      // Background might not be ready, ignore
    });
  });
} else {
  chrome.runtime.sendMessage({
    type: 'PAGE_LOADED',
    url: window.location.href
  }).catch(() => {
    // Background might not be ready, ignore
  });
}

console.log('AliDigitalSolution Admin Extension content script loaded');
