// AliDigitalSolution

 Admin Extension - Background Service Worker
// Handles cookie extraction, management, and session handling for admins

/**
 * Get all cookies for a domain
 */
async function getAllCookiesForDomain(url) {
  try {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL');
    }

    // Ensure URL has protocol
    let validUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      validUrl = 'https://' + url;
    }

    const cookies = await chrome.cookies.getAll({ url: validUrl });
    return cookies.map(cookie => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path || '/',
      secure: cookie.secure || false,
      httpOnly: cookie.httpOnly || false,
      sameSite: cookie.sameSite || 'lax',
      expirationDate: cookie.expirationDate || null,
      session: !cookie.expirationDate || cookie.expirationDate === 0
    }));
  } catch (error) {
    console.error('Error getting cookies:', error);
    return [];
  }
}

/**
 * Extract cookies from current active tab
 */
async function extractCookiesFromCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      throw new Error('No active tab found');
    }

    const url = new URL(tab.url);
    const cookies = await getAllCookiesForDomain(tab.url);
    
    return {
      success: true,
      url: tab.url,
      domain: url.hostname,
      cookies: cookies,
      count: cookies.length
    };
  } catch (error) {
    console.error('Error extracting cookies:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Export cookies in the format needed for the admin panel
 */
function formatCookiesForExport(cookies) {
  return cookies.map(cookie => ({
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path || '/',
    secure: cookie.secure !== false,
    httpOnly: cookie.httpOnly || false,
    sameSite: cookie.sameSite || 'lax',
    expirationDate: cookie.expirationDate && cookie.expirationDate > 0 
      ? cookie.expirationDate 
      : undefined
  }));
}

/**
 * Clear all cookies for a domain
 */
async function clearAllCookiesForDomain(url) {
  try {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL');
    }

    let validUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      validUrl = 'https://' + url;
    }

    const cookies = await chrome.cookies.getAll({ url: validUrl });
    const urlObj = new URL(validUrl);
    
    let clearedCount = 0;
    for (const cookie of cookies) {
      try {
        const cookieDomain = cookie.domain || urlObj.hostname;
        const cleanDomain = cookieDomain.startsWith('.') 
          ? cookieDomain.substring(1) 
          : cookieDomain;
        const cookieUrl = urlObj.protocol + '//' + cleanDomain + (cookie.path || '/');
        
        await chrome.cookies.remove({
          url: cookieUrl,
          name: cookie.name
        });
        clearedCount++;
      } catch (error) {
        console.warn('Error removing cookie:', cookie.name, error);
      }
    }
    
    return {
      success: true,
      cleared: clearedCount,
      total: cookies.length
    };
  } catch (error) {
    console.error('Error clearing cookies:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test cookie injection by setting a test cookie
 */
async function testCookieInjection(url, testCookie) {
  try {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL');
    }

    let validUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      validUrl = 'https://' + url;
    }

    const urlObj = new URL(validUrl);
    const cookieData = {
      name: testCookie.name || 'test_cookie',
      value: testCookie.value || 'test_value',
      url: validUrl,
      domain: testCookie.domain && testCookie.domain.startsWith('.') ? testCookie.domain : undefined,
      path: testCookie.path || '/',
      secure: testCookie.secure !== false,
      httpOnly: testCookie.httpOnly || false,
      sameSite: testCookie.sameSite || 'lax',
      expirationDate: testCookie.expirationDate || undefined
    };

    const setCookie = await chrome.cookies.set(cookieData);
    
    return {
      success: !!setCookie,
      cookie: setCookie
    };
  } catch (error) {
    console.error('Error testing cookie injection:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get current session info from active tab
 */
async function getSessionInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      throw new Error('No active tab found');
    }

    const url = new URL(tab.url);
    const cookies = await getAllCookiesForDomain(tab.url);
    
    // Get localStorage and sessionStorage info (via content script)
    const results = await chrome.tabs.sendMessage(tab.id, {
      type: 'GET_SESSION_INFO'
    });

    return {
      success: true,
      url: tab.url,
      domain: url.hostname,
      cookies: {
        total: cookies.length,
        session: cookies.filter(c => c.session).length,
        persistent: cookies.filter(c => !c.session).length
      },
      storage: results || {}
    };
  } catch (error) {
    console.error('Error getting session info:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Upload cookies to admin API
 */
async function uploadCookiesToAdmin(toolId, cookies, expiryDate) {
  try {
    // Get admin API URL from storage or use default
    const data = await chrome.storage.local.get(['adminApiUrl']);
    const apiUrl = data.adminApiUrl || 'http://localhost:3000';
    
    const response = await fetch(`${apiUrl}/api/admin/tools/${toolId}/cookies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({
        cookies: cookies,
        expiryDate: expiryDate || null
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload cookies');
    }

    return {
      success: true,
      message: 'Cookies uploaded successfully'
    };
  } catch (error) {
    console.error('Error uploading cookies:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case 'EXTRACT_COOKIES':
          const extractResult = await extractCookiesFromCurrentTab();
          sendResponse(extractResult);
          break;

        case 'GET_COOKIES_FOR_DOMAIN':
          const cookies = await getAllCookiesForDomain(message.url);
          sendResponse({ success: true, cookies: cookies });
          break;

        case 'CLEAR_COOKIES':
          const clearResult = await clearAllCookiesForDomain(message.url);
          sendResponse(clearResult);
          break;

        case 'TEST_COOKIE_INJECTION':
          const testResult = await testCookieInjection(message.url, message.cookie);
          sendResponse(testResult);
          break;

        case 'GET_SESSION_INFO':
          const sessionInfo = await getSessionInfo();
          sendResponse(sessionInfo);
          break;

        case 'UPLOAD_COOKIES':
          const uploadResult = await uploadCookiesToAdmin(
            message.toolId,
            message.cookies,
            message.expiryDate
          );
          sendResponse(uploadResult);
          break;

        case 'FORMAT_COOKIES':
          const formatted = formatCookiesForExport(message.cookies);
          sendResponse({ success: true, cookies: formatted });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  })();
  
  return true; // Keep channel open for async response
});

// Listen for tab updates to refresh cookie info
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Notify popup if it's open
    chrome.runtime.sendMessage({
      type: 'TAB_UPDATED',
      url: tab.url
    }).catch(() => {
      // Popup might not be open, ignore error
    });
  }
});

console.log('AliDigitalSolution

 Admin Extension loaded');
