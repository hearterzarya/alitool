// GrowTools Extension - Popup Script

// Get extension version from manifest
const manifest = chrome.runtime.getManifest();
document.getElementById('version').textContent = manifest.version;

// Open dashboard button
document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
});

// Refresh status button
document.getElementById('refresh').addEventListener('click', () => {
  // Check if extension is working
  chrome.runtime.sendMessage({ type: 'GROWTOOLS_CHECK' }, (response) => {
    if (response && response.installed) {
      document.getElementById('status').textContent = 'Active';
      document.getElementById('status').classList.add('active');
    } else {
      document.getElementById('status').textContent = 'Error';
      document.getElementById('status').classList.remove('active');
    }
  });
});

// Check status on load
chrome.runtime.sendMessage({ type: 'GROWTOOLS_CHECK' }, (response) => {
  if (response && response.installed) {
    document.getElementById('status').textContent = 'Active';
    document.getElementById('status').classList.add('active');
  }
});

