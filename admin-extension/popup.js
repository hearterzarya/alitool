// AliDigitalSolution Admin Extension - Popup Script

let currentCookies = [];
let currentTabUrl = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupEventListeners();
  loadCurrentTabInfo();
});

// Tab switching
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Update active states
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
  });
}

// Event listeners
function setupEventListeners() {
  const extractBtn = document.getElementById('extract-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  const getCookiesBtn = document.getElementById('get-cookies-btn');
  const clearCookiesBtn = document.getElementById('clear-cookies-btn');
  const testInjectionBtn = document.getElementById('test-injection-btn');
  const uploadBtn = document.getElementById('upload-btn');
  const formatBtn = document.getElementById('format-btn');
  
  if (extractBtn) extractBtn.addEventListener('click', extractCookies);
  if (refreshBtn) refreshBtn.addEventListener('click', loadCurrentTabInfo);
  if (getCookiesBtn) getCookiesBtn.addEventListener('click', getCookiesForDomain);
  if (clearCookiesBtn) clearCookiesBtn.addEventListener('click', clearCookies);
  if (testInjectionBtn) testInjectionBtn.addEventListener('click', testCookieInjection);
  if (uploadBtn) uploadBtn.addEventListener('click', uploadCookies);
  if (formatBtn) formatBtn.addEventListener('click', formatAndCopy);
}

// Load current tab info
async function loadCurrentTabInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      currentTabUrl = tab.url;
      showStatus('info', `Current tab: ${new URL(tab.url).hostname}`);
    }
  } catch (error) {
    showStatus('error', `Error: ${error.message}`);
  }
}

// Extract cookies from current tab
async function extractCookies() {
  try {
    showStatus('info', 'Extracting cookies...');
    const response = await chrome.runtime.sendMessage({ type: 'EXTRACT_COOKIES' });
    
    if (response && response.success) {
      currentCookies = response.cookies;
      displayCookies(response.cookies);
      updateStats(response.cookies);
      showStatus('success', `Extracted ${response.cookies.length} cookies from ${response.domain}`);
      
      // Auto-populate upload tab
      document.getElementById('cookies-json-input').value = JSON.stringify(
        formatCookiesForExport(response.cookies),
        null, 2
      );
    } else {
      showStatus('error', `Error: ${response.error}`);
    }
  } catch (error) {
    showStatus('error', `Error: ${error.message}`);
  }
}

// Display cookies
function displayCookies(cookies) {
  const cookieList = document.getElementById('cookie-list');
  cookieList.style.display = 'block';
  cookieList.innerHTML = '';
  
  if (cookies.length === 0) {
    cookieList.innerHTML = '<div class="cookie-item">No cookies found</div>';
    return;
  }
  
  cookies.forEach(cookie => {
    const item = document.createElement('div');
    item.className = 'cookie-item';
    item.innerHTML = `
      <span class="cookie-name">${cookie.name}</span>: ${cookie.value.substring(0, 50)}${cookie.value.length > 50 ? '...' : ''}
      <br><small>Domain: ${cookie.domain} | Path: ${cookie.path} | ${cookie.session ? 'Session' : 'Persistent'}</small>
    `;
    cookieList.appendChild(item);
  });
}

// Update stats
function updateStats(cookies) {
  const cookieCount = document.getElementById('cookie-count');
  const sessionCount = document.getElementById('session-count');
  if (cookieCount) cookieCount.textContent = cookies.length;
  if (sessionCount) sessionCount.textContent = cookies.filter(c => c.session).length;
}

// Format cookies for export
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

// Get cookies for domain
async function getCookiesForDomain() {
  try {
    const domain = document.getElementById('domain-input').value.trim();
    if (!domain) {
      showStatus('error', 'Please enter a domain or URL');
      return;
    }
    
    showStatus('info', 'Fetching cookies...');
    const response = await chrome.runtime.sendMessage({
      type: 'GET_COOKIES_FOR_DOMAIN',
      url: domain
    });
    
    if (response && response.success) {
      currentCookies = response.cookies;
      displayCookies(response.cookies);
      updateStats(response.cookies);
      showStatus('success', `Found ${response.cookies.length} cookies`);
      
      // Auto-populate upload tab
      document.getElementById('cookies-json-input').value = JSON.stringify(
        formatCookiesForExport(response.cookies),
        null, 2
      );
    } else {
      showStatus('error', `Error: ${response.error}`);
    }
  } catch (error) {
    showStatus('error', `Error: ${error.message}`);
  }
}

// Clear cookies
async function clearCookies() {
  try {
    const domainInput = document.getElementById('domain-input');
    if (!domainInput) {
      showStatus('error', 'Domain input not found');
      return;
    }
    
    const domain = domainInput.value.trim();
    if (!domain) {
      showStatus('error', 'Please enter a domain or URL');
      return;
    }
    
    if (!confirm(`Are you sure you want to clear ALL cookies for ${domain}?`)) {
      return;
    }
    
    showStatus('info', 'Clearing cookies...');
    const response = await chrome.runtime.sendMessage({
      type: 'CLEAR_COOKIES',
      url: domain
    });
    
    if (response && response.success) {
      showStatus('success', `Cleared ${response.cleared} of ${response.total} cookies`);
      const cookieList = document.getElementById('cookie-list');
      const cookieCount = document.getElementById('cookie-count');
      const sessionCount = document.getElementById('session-count');
      if (cookieList) cookieList.innerHTML = '';
      if (cookieCount) cookieCount.textContent = '0';
      if (sessionCount) sessionCount.textContent = '0';
    } else {
      showStatus('error', `Error: ${response?.error || 'Failed to clear cookies'}`);
    }
  } catch (error) {
    showStatus('error', `Error: ${error.message}`);
  }
}

// Test cookie injection
async function testCookieInjection() {
  try {
    const domainInput = document.getElementById('domain-input');
    if (!domainInput) {
      showStatus('error', 'Domain input not found');
      return;
    }
    
    const domain = domainInput.value.trim();
    if (!domain) {
      showStatus('error', 'Please enter a domain or URL');
      return;
    }
    
    showStatus('info', 'Testing cookie injection...');
    const response = await chrome.runtime.sendMessage({
      type: 'TEST_COOKIE_INJECTION',
      url: domain,
      cookie: {
        name: 'test_cookie_' + Date.now(),
        value: 'test_value',
        path: '/',
        secure: true
      }
    });
    
    if (response && response.success) {
      showStatus('success', 'Test cookie injected successfully!');
    } else {
      showStatus('error', `Error: ${response?.error || 'Failed to inject test cookie'}`);
    }
  } catch (error) {
    showStatus('error', `Error: ${error.message}`);
  }
}

// Upload cookies
async function uploadCookies() {
  try {
    const toolIdInput = document.getElementById('tool-id-input');
    const cookiesInput = document.getElementById('cookies-json-input');
    const expiryInput = document.getElementById('expiry-date-input');
    
    if (!toolIdInput || !cookiesInput) {
      showStatus('error', 'Required inputs not found');
      return;
    }
    
    const toolId = toolIdInput.value.trim();
    const cookiesJson = cookiesInput.value.trim();
    const expiryDate = expiryInput ? expiryInput.value : null;
    
    if (!toolId) {
      showStatus('error', 'Please enter a Tool ID');
      return;
    }
    
    if (!cookiesJson) {
      showStatus('error', 'Please enter cookies JSON');
      return;
    }
    
    let cookies;
    try {
      cookies = JSON.parse(cookiesJson);
      if (!Array.isArray(cookies)) {
        throw new Error('Cookies must be an array');
      }
    } catch (error) {
      showStatus('error', 'Invalid JSON format: ' + error.message);
      return;
    }
    
    showStatus('info', 'Uploading cookies...');
    
    // Get current tab URL to determine API base URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let apiBaseUrl = 'http://localhost:3000';
    
    if (tab && tab.url) {
      try {
        const url = new URL(tab.url);
        apiBaseUrl = `${url.protocol}//${url.host}`;
      } catch (e) {
        // Use default if URL parsing fails
      }
    }
    
    // Try to get from storage first
    const storage = await chrome.storage.local.get(['adminApiUrl']);
    if (storage.adminApiUrl) {
      apiBaseUrl = storage.adminApiUrl;
    }
    
    // Upload directly via fetch (bypassing background script for better error handling)
    try {
      const uploadResponse = await fetch(`${apiBaseUrl}/api/admin/tools/${toolId}/cookies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cookies: cookies,
          expiryDate: expiryDate || null
        })
      });

      const result = await uploadResponse.json();
      
      if (uploadResponse.ok) {
        showStatus('success', result.message || 'Cookies uploaded successfully!');
        // Clear form
        if (cookiesInput) cookiesInput.value = '';
        if (toolIdInput) toolIdInput.value = '';
        if (expiryInput) expiryInput.value = '';
      } else {
        showStatus('error', `Error: ${result.error || 'Failed to upload cookies'}`);
      }
    } catch (error) {
      showStatus('error', `Error: ${error.message || 'Failed to upload cookies. Make sure you are logged into the admin panel.'}`);
    }
  } catch (error) {
    showStatus('error', `Error: ${error.message}`);
  }
}

// Format and copy
async function formatAndCopy() {
  try {
    const cookiesInput = document.getElementById('cookies-json-input');
    if (!cookiesInput) {
      showStatus('error', 'Cookies input not found');
      return;
    }
    
    const cookiesJson = cookiesInput.value.trim();
    
    if (!cookiesJson) {
      showStatus('error', 'No cookies to format');
      return;
    }
    
    let cookies;
    try {
      cookies = JSON.parse(cookiesJson);
    } catch (error) {
      showStatus('error', 'Invalid JSON: ' + error.message);
      return;
    }
    
    const formatted = formatCookiesForExport(cookies);
    const formattedJson = JSON.stringify(formatted, null, 2);
    
    cookiesInput.value = formattedJson;
    
    await navigator.clipboard.writeText(formattedJson);
    showStatus('success', 'Formatted and copied to clipboard!');
  } catch (error) {
    showStatus('error', `Error: ${error.message}`);
  }
}

// Show status message
function showStatus(type, message) {
  const statusEl = document.getElementById('status');
  statusEl.className = `status ${type}`;
  statusEl.textContent = message;
  
  if (type === 'success' || type === 'error') {
    setTimeout(() => {
      statusEl.className = 'status';
      statusEl.textContent = '';
    }, 5000);
  }
}

// Listen for tab updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TAB_UPDATED') {
    loadCurrentTabInfo();
  }
});
