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
  document.getElementById('extract-btn').addEventListener('click', extractCookies);
  document.getElementById('refresh-btn').addEventListener('click', loadCurrentTabInfo);
  document.getElementById('get-cookies-btn').addEventListener('click', getCookiesForDomain);
  document.getElementById('clear-cookies-btn').addEventListener('click', clearCookies);
  document.getElementById('test-injection-btn').addEventListener('click', testCookieInjection);
  document.getElementById('upload-btn').addEventListener('click', uploadCookies);
  document.getElementById('format-btn').addEventListener('click', formatAndCopy);
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
    
    if (response.success) {
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
  document.getElementById('cookie-count').textContent = cookies.length;
  document.getElementById('session-count').textContent = cookies.filter(c => c.session).length;
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
    
    if (response.success) {
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
    const domain = document.getElementById('domain-input').value.trim();
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
    
    if (response.success) {
      showStatus('success', `Cleared ${response.cleared} of ${response.total} cookies`);
      document.getElementById('cookie-list').innerHTML = '';
      document.getElementById('cookie-count').textContent = '0';
      document.getElementById('session-count').textContent = '0';
    } else {
      showStatus('error', `Error: ${response.error}`);
    }
  } catch (error) {
    showStatus('error', `Error: ${error.message}`);
  }
}

// Test cookie injection
async function testCookieInjection() {
  try {
    const domain = document.getElementById('domain-input').value.trim();
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
    
    if (response.success) {
      showStatus('success', 'Test cookie injected successfully!');
    } else {
      showStatus('error', `Error: ${response.error}`);
    }
  } catch (error) {
    showStatus('error', `Error: ${error.message}`);
  }
}

// Upload cookies
async function uploadCookies() {
  try {
    const toolId = document.getElementById('tool-id-input').value.trim();
    const cookiesJson = document.getElementById('cookies-json-input').value.trim();
    const expiryDate = document.getElementById('expiry-date-input').value;
    
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
    const response = await chrome.runtime.sendMessage({
      type: 'UPLOAD_COOKIES',
      toolId: toolId,
      cookies: cookies,
      expiryDate: expiryDate || null
    });
    
    if (response.success) {
      showStatus('success', response.message || 'Cookies uploaded successfully!');
    } else {
      showStatus('error', `Error: ${response.error}`);
    }
  } catch (error) {
    showStatus('error', `Error: ${error.message}`);
  }
}

// Format and copy
async function formatAndCopy() {
  try {
    const cookiesJson = document.getElementById('cookies-json-input').value.trim();
    
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
    
    document.getElementById('cookies-json-input').value = formattedJson;
    
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
