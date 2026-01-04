// GrowTools Extension - Popup Script
// Handles popup UI interactions and status display

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup loaded');

  // Get extension version
  const manifest = chrome.runtime.getManifest();
  const versionElement = document.getElementById('version');
  if (versionElement) {
    versionElement.textContent = manifest.version;
  }

  // Check extension status
  checkExtensionStatus();

  // Update domain URLs based on environment
  updateLinks();
});

/**
 * Check if the extension is working properly
 */
async function checkExtensionStatus() {
  const statusElement = document.getElementById('connection-status');
  const statusDot = document.querySelector('.status-dot');

  try {
    // Try to ping the background script
    const response = await chrome.runtime.sendMessage({ type: 'PING' });

    if (response && response.success) {
      statusElement.textContent = 'Connected';
      statusDot.classList.add('active');
    } else {
      throw new Error('Invalid response');
    }
  } catch (error) {
    console.error('Extension status check failed:', error);
    statusElement.textContent = 'Disconnected';
    statusDot.classList.remove('active');
  }
}

/**
 * Update links to use the correct domain
 * In production, this should point to the actual domain
 */
function updateLinks() {
  // Check if we're in production
  const isProduction = false; // TODO: Set to true in production build
  const domain = isProduction ? 'https://growtools.com' : 'http://localhost:3000';

  // Update all links
  const links = document.querySelectorAll('a[href^="http://localhost:3000"]');
  links.forEach(link => {
    const path = link.getAttribute('href').replace('http://localhost:3000', '');
    link.setAttribute('href', domain + path);
  });
}

/**
 * Handle button clicks
 */
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn, .btn *')) {
    // Links will handle navigation automatically
    console.log('Button clicked:', e.target.textContent);
  }
});
