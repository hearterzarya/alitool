// GrowTools Extension - Background Service Worker
// Handles cookie injection and tab management

console.log('GrowTools Extension: Background service worker loaded');

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background: Received message', request.type);

  if (request.type === 'INJECT_COOKIES_AND_OPEN') {
    handleCookieInjection(request.data)
      .then((result) => {
        sendResponse({ success: true, ...result });
      })
      .catch((error) => {
        console.error('Cookie injection failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }

  if (request.type === 'PING') {
    sendResponse({ success: true, message: 'Extension is active' });
    return true;
  }
});

/**
 * Handle cookie injection and tab opening
 * @param {Object} data - Contains toolUrl and cookies array
 */
async function handleCookieInjection(data) {
  const { toolUrl, cookies } = data;

  if (!toolUrl || !cookies || !Array.isArray(cookies)) {
    throw new Error('Invalid data: toolUrl and cookies array required');
  }

  console.log(`Injecting ${cookies.length} cookies for ${toolUrl}`);

  // Extract domain from URL
  const url = new URL(toolUrl);
  const domain = url.hostname;

  // Step 1: Clear existing cookies for this domain (optional but recommended)
  try {
    const existingCookies = await chrome.cookies.getAll({ domain });
    console.log(`Found ${existingCookies.length} existing cookies for ${domain}`);

    // Clear relevant cookies (be selective to avoid breaking other sessions)
    for (const cookie of existingCookies) {
      // Only clear cookies that match names from our new cookies
      const shouldClear = cookies.some(c => c.name === cookie.name);
      if (shouldClear) {
        await chrome.cookies.remove({
          url: `https://${cookie.domain}${cookie.path}`,
          name: cookie.name
        });
      }
    }
  } catch (error) {
    console.warn('Error clearing cookies:', error);
  }

  // Step 2: Inject new cookies
  const injectionResults = [];
  for (const cookie of cookies) {
    try {
      const cookieToSet = {
        url: toolUrl,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain || domain,
        path: cookie.path || '/',
        secure: cookie.secure !== undefined ? cookie.secure : true,
        httpOnly: cookie.httpOnly !== undefined ? cookie.httpOnly : false,
        sameSite: cookie.sameSite || 'lax',
        expirationDate: cookie.expirationDate || Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year default
      };

      await chrome.cookies.set(cookieToSet);
      injectionResults.push({ name: cookie.name, success: true });
      console.log(`✓ Injected cookie: ${cookie.name}`);
    } catch (error) {
      console.error(`✗ Failed to inject cookie ${cookie.name}:`, error);
      injectionResults.push({ name: cookie.name, success: false, error: error.message });
    }
  }

  // Step 3: Open the tool in a new tab
  const tab = await chrome.tabs.create({
    url: toolUrl,
    active: true
  });

  console.log(`Opened tool in tab ${tab.id}`);

  return {
    tabId: tab.id,
    injectedCount: injectionResults.filter(r => r.success).length,
    totalCookies: cookies.length,
    results: injectionResults
  };
}

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('GrowTools Extension installed successfully');
    // Open welcome page (optional)
    // chrome.tabs.create({ url: 'http://localhost:3000/extension-installed' });
  } else if (details.reason === 'update') {
    console.log('GrowTools Extension updated');
  }
});

// Keep service worker alive (workaround for Manifest V3 limitations)
chrome.alarms.create('keep-alive', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keep-alive') {
    console.log('Service worker keepalive ping');
  }
});
