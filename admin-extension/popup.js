// Beautiful Cookie Copier Extension

document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copy-cookies-btn');
  const statusEl = document.getElementById('status');
  const domainText = document.getElementById('domain-text');
  
  copyBtn.addEventListener('click', copyCookies);
  
  // Load current tab info
  loadCurrentTabInfo();
});

async function loadCurrentTabInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const url = new URL(tab.url);
      const domainText = document.getElementById('domain-text');
      domainText.textContent = url.hostname;
    } else {
      document.getElementById('domain-text').textContent = 'No active tab';
    }
  } catch (error) {
    console.error('Error loading tab info:', error);
    document.getElementById('domain-text').textContent = 'Unable to load';
  }
}

async function copyCookies() {
  const copyBtn = document.getElementById('copy-cookies-btn');
  const statusEl = document.getElementById('status');
  
  try {
    copyBtn.disabled = true;
    const buttonText = copyBtn.querySelector('.button-text');
    const buttonIcon = copyBtn.querySelector('.button-icon');
    if (buttonText) buttonText.textContent = 'Extracting...';
    if (buttonIcon) buttonIcon.textContent = '⏳';
    showStatus('info', '🔍 Extracting cookies...');
    
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      throw new Error('No active tab found');
    }
    
    // Parse URL to get domain
    let urlObj;
    try {
      urlObj = new URL(tab.url);
    } catch (e) {
      throw new Error('Invalid URL');
    }
    
    // Try multiple methods to get cookies
    let cookies = [];
    const cookieSet = new Set(); // Use Set to avoid duplicates
    
    // Method 1: Get cookies for the exact URL
    try {
      const urlCookies = await chrome.cookies.getAll({ url: tab.url });
      urlCookies.forEach(cookie => {
        cookieSet.add(`${cookie.name}:${cookie.domain}:${cookie.path}`);
        cookies.push(cookie);
      });
    } catch (e) {
      console.warn('Error getting cookies for URL:', e);
    }
    
    // Method 2: Get cookies for the origin (protocol + host)
    try {
      const origin = `${urlObj.protocol}//${urlObj.host}`;
      const originCookies = await chrome.cookies.getAll({ url: origin });
      originCookies.forEach(cookie => {
        const key = `${cookie.name}:${cookie.domain}:${cookie.path}`;
        if (!cookieSet.has(key)) {
          cookieSet.add(key);
          cookies.push(cookie);
        }
      });
    } catch (e) {
      console.warn('Error getting cookies for origin:', e);
    }
    
    // Method 3: Get cookies for domain (with and without subdomain)
    try {
      const domain = urlObj.hostname;
      const domainCookies = await chrome.cookies.getAll({ domain: domain });
      domainCookies.forEach(cookie => {
        const key = `${cookie.name}:${cookie.domain}:${cookie.path}`;
        if (!cookieSet.has(key)) {
          cookieSet.add(key);
          cookies.push(cookie);
        }
      });
    } catch (e) {
      console.warn('Error getting cookies for domain:', e);
    }
    
    // Method 4: Get all cookies and filter by domain
    try {
      const allCookies = await chrome.cookies.getAll({});
      const domainParts = urlObj.hostname.split('.');
      const baseDomain = domainParts.length >= 2 
        ? domainParts.slice(-2).join('.') 
        : domainParts[0];
      
      allCookies.forEach(cookie => {
        const cookieDomain = cookie.domain.startsWith('.') 
          ? cookie.domain.substring(1) 
          : cookie.domain;
        
        // Check if cookie domain matches current domain or is a parent domain
        if (cookieDomain === urlObj.hostname || 
            cookieDomain === baseDomain ||
            urlObj.hostname.endsWith('.' + cookieDomain) ||
            cookieDomain.endsWith('.' + baseDomain)) {
          const key = `${cookie.name}:${cookie.domain}:${cookie.path}`;
          if (!cookieSet.has(key)) {
            cookieSet.add(key);
            cookies.push(cookie);
          }
        }
      });
    } catch (e) {
      console.warn('Error getting all cookies:', e);
    }
    
    if (cookies.length === 0) {
      showStatus('error', '❌ No cookies found. Make sure you are logged in.');
      resetButton();
      hideCookieCount();
      return;
    }
    
    // Format cookies for export
    const formattedCookies = cookies.map(cookie => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path || '/',
      secure: cookie.secure || false,
      httpOnly: cookie.httpOnly || false,
      sameSite: cookie.sameSite || 'lax',
      expirationDate: cookie.expirationDate && cookie.expirationDate > 0 
        ? cookie.expirationDate 
        : undefined
    }));
    
    // Convert to JSON string
    const cookiesJson = JSON.stringify(formattedCookies, null, 2);
    
    // Copy to clipboard
    await navigator.clipboard.writeText(cookiesJson);
    
    // Update button
    const buttonText = copyBtn.querySelector('.button-text');
    const buttonIcon = copyBtn.querySelector('.button-icon');
    if (buttonText) buttonText.textContent = 'Copied!';
    if (buttonIcon) buttonIcon.textContent = '✅';
    
    // Show cookie count
    showCookieCount(cookies.length);
    
    // Show success message
    showStatus('success', `✅ Successfully copied ${cookies.length} cookie${cookies.length !== 1 ? 's' : ''}!`);
    
    // Reset button after 2 seconds
    setTimeout(() => {
      resetButton();
      hideCookieCount();
    }, 2000);
    
    // Clear success message after 4 seconds
    setTimeout(() => {
      const statusEl = document.getElementById('status');
      statusEl.className = 'status';
      statusEl.textContent = '';
    }, 4000);
    
  } catch (error) {
    showStatus('error', `❌ Error: ${error.message}`);
    resetButton();
    hideCookieCount();
  }
}

function resetButton() {
  const copyBtn = document.getElementById('copy-cookies-btn');
  if (!copyBtn) return;
  
  const buttonText = copyBtn.querySelector('.button-text');
  const buttonIcon = copyBtn.querySelector('.button-icon');
  copyBtn.disabled = false;
  if (buttonText) buttonText.textContent = 'Copy Cookies to Clipboard';
  if (buttonIcon) buttonIcon.textContent = '📋';
}

function showCookieCount(count) {
  const cookieCount = document.getElementById('cookie-count');
  const cookieCountNumber = document.getElementById('cookie-count-number');
  if (!cookieCount || !cookieCountNumber) return;
  cookieCountNumber.textContent = count;
  cookieCount.classList.add('show');
}

function hideCookieCount() {
  const cookieCount = document.getElementById('cookie-count');
  if (!cookieCount) return;
  cookieCount.classList.remove('show');
}

function showStatus(type, message) {
  const statusEl = document.getElementById('status');
  if (!statusEl) return;
  
  statusEl.className = `status ${type}`;
  
  // Extract icon (first word/emoji) and rest of message
  const firstSpaceIndex = message.indexOf(' ');
  if (firstSpaceIndex > 0) {
    const icon = message.substring(0, firstSpaceIndex);
    const text = message.substring(firstSpaceIndex + 1);
    statusEl.innerHTML = `<span class="status-icon">${icon}</span><span>${text}</span>`;
  } else {
    // No space found, show message as-is
    statusEl.textContent = message;
  }
}
