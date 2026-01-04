// GrowTools Extension - Content Script
// Bridges communication between the webpage and the extension background script

console.log('GrowTools Extension: Content script loaded');

// Listen for messages from the webpage
window.addEventListener('message', async (event) => {
  // Only accept messages from the same window
  if (event.source !== window) return;

  const message = event.data;

  // Check if this is a GrowTools message
  if (message && message.type === 'GROWTOOLS_ACCESS_TOOL') {
    console.log('Content: Received GROWTOOLS_ACCESS_TOOL message', message);

    try {
      const { toolUrl, cookies } = message.data;

      if (!toolUrl || !cookies) {
        throw new Error('Missing toolUrl or cookies in message');
      }

      // Forward to background script
      const response = await chrome.runtime.sendMessage({
        type: 'INJECT_COOKIES_AND_OPEN',
        data: { toolUrl, cookies }
      });

      console.log('Content: Background script response', response);

      // Send response back to webpage
      window.postMessage({
        type: 'GROWTOOLS_ACCESS_RESPONSE',
        success: response.success,
        data: response
      }, '*');

    } catch (error) {
      console.error('Content: Error processing message', error);

      window.postMessage({
        type: 'GROWTOOLS_ACCESS_RESPONSE',
        success: false,
        error: error.message
      }, '*');
    }
  }

  // Handle extension check ping
  if (message && message.type === 'GROWTOOLS_CHECK_EXTENSION') {
    console.log('Content: Extension check received');

    try {
      const response = await chrome.runtime.sendMessage({ type: 'PING' });

      window.postMessage({
        type: 'GROWTOOLS_EXTENSION_RESPONSE',
        installed: true,
        active: response.success
      }, '*');
    } catch (error) {
      window.postMessage({
        type: 'GROWTOOLS_EXTENSION_RESPONSE',
        installed: false,
        active: false
      }, '*');
    }
  }
});

// Notify webpage that extension is loaded
window.postMessage({
  type: 'GROWTOOLS_EXTENSION_LOADED',
  version: chrome.runtime.getManifest().version
}, '*');

console.log('GrowTools Extension: Ready to receive messages');
