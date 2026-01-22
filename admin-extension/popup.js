// Simple Cookie Copier Extension

document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copy-cookies-btn');
  const statusEl = document.getElementById('status');
  const infoText = document.getElementById('info-text');
  
  copyBtn.addEventListener('click', copyCookies);
  
  // Load current tab info
  loadCurrentTabInfo();
});

async function loadCurrentTabInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const url = new URL(tab.url);
      document.getElementById('info-text').textContent = `Current: ${url.hostname}`;
    }
  } catch (error) {
    console.error('Error loading tab info:', error);
  }
}

async function copyCookies() {
  const copyBtn = document.getElementById('copy-cookies-btn');
  const statusEl = document.getElementById('status');
  
  try {
    copyBtn.disabled = true;
    showStatus('info', 'Extracting cookies...');
    
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      throw new Error('No active tab found');
    }
    
    // Get all cookies for the current tab's URL
    const cookies = await chrome.cookies.getAll({ url: tab.url });
    
    if (cookies.length === 0) {
      showStatus('error', 'No cookies found for this website');
      copyBtn.disabled = false;
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
    
    showStatus('success', `✓ Copied ${cookies.length} cookies to clipboard!`);
    copyBtn.disabled = false;
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      statusEl.className = 'status';
      statusEl.textContent = '';
    }, 3000);
    
  } catch (error) {
    showStatus('error', `Error: ${error.message}`);
    copyBtn.disabled = false;
  }
}

function showStatus(type, message) {
  const statusEl = document.getElementById('status');
  statusEl.className = `status ${type}`;
  statusEl.textContent = message;
}
