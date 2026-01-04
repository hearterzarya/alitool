# GrowTools Browser Extension

## Overview

The GrowTools browser extension enables seamless access to your subscribed AI tools through automated cookie injection. This extension is the core component that allows users to access shared tool accounts without manual login.

## Features

- 🍪 **Cookie Injection**: Automatically injects authentication cookies for subscribed tools
- 🔒 **Secure**: All cookies are encrypted in transit and storage
- ⚡ **Instant Access**: One-click access to any subscribed tool
- 🎨 **Clean UI**: Beautiful popup interface showing extension status
- 📊 **Status Monitoring**: Real-time connection status and version info

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for cookie injection
├── content.js            # Bridge between webpage and extension
├── popup/
│   ├── popup.html        # Extension popup UI
│   ├── popup.css         # Popup styles
│   └── popup.js          # Popup logic
├── icons/
│   ├── icon16.png        # 16x16 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
└── README.md             # This file
```

## How It Works

### 1. User Flow
1. User logs into GrowTools dashboard
2. Clicks "Access Tool" button on a subscribed tool
3. Dashboard sends message to extension with cookies
4. Extension injects cookies and opens tool in new tab
5. User is automatically logged into the tool

### 2. Technical Flow
```
Dashboard Page
    ↓
Posts Message (GROWTOOLS_ACCESS_TOOL)
    ↓
Content Script (content.js)
    ↓
Background Service Worker (background.js)
    ↓
Chrome Cookies API
    ↓
Opens Tool in New Tab
```

### 3. Message Protocol

**From Dashboard to Extension:**
```javascript
window.postMessage({
  type: 'GROWTOOLS_ACCESS_TOOL',
  data: {
    toolUrl: 'https://chat.openai.com',
    cookies: [
      {
        name: '__Secure-next-auth.session-token',
        value: 'encrypted_value',
        domain: '.openai.com',
        path: '/',
        secure: true,
        httpOnly: true
      }
    ]
  }
}, '*');
```

**From Extension to Dashboard:**
```javascript
window.postMessage({
  type: 'GROWTOOLS_ACCESS_RESPONSE',
  success: true,
  data: {
    tabId: 12345,
    injectedCount: 3,
    totalCookies: 3
  }
}, '*');
```

## Installation

### Development Mode (Local Testing)

1. **Open Chrome Extensions:**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

2. **Load Extension:**
   - Click "Load unpacked"
   - Select the `/extension` folder
   - Extension should now appear in your extensions list

3. **Verify Installation:**
   - Click the extension icon in toolbar
   - Should see "GrowTools" popup with "Active" status
   - Green status dot indicates extension is working

### Testing with GrowTools Dashboard

1. **Start GrowTools Development Server:**
   ```bash
   cd client
   npm run dev
   ```

2. **Navigate to Dashboard:**
   - Go to `http://localhost:3000/dashboard`
   - Make sure you're logged in
   - Find a tool with active subscription

3. **Test Access Tool Button:**
   - Click "Access Tool" button
   - Extension should receive message
   - New tab should open with cookies injected
   - Check browser console for logs

### Debugging

1. **View Extension Logs:**
   - Go to `chrome://extensions/`
   - Click "service worker" under GrowTools
   - Opens DevTools for background script
   - Check console for logs

2. **View Content Script Logs:**
   - Open GrowTools dashboard page
   - Open DevTools (F12)
   - Check console for "GrowTools Extension: Content script loaded"

3. **Common Issues:**
   - **Extension not loading**: Check manifest.json for syntax errors
   - **Messages not received**: Verify content_scripts matches URL in manifest.json
   - **Cookies not injecting**: Check host_permissions in manifest.json
   - **Tab not opening**: Check background.js for errors

## Icon Generation

Currently using placeholder icons. To add custom icons:

1. **Create Icons:**
   - Use a tool like [Figma](https://figma.com) or [Canva](https://canva.com)
   - Create 3 sizes: 16x16, 48x48, 128x128
   - Save as PNG with transparent background

2. **Add to Extension:**
   ```bash
   cp icon16.png extension/icons/
   cp icon48.png extension/icons/
   cp icon128.png extension/icons/
   ```

3. **Reload Extension:**
   - Go to `chrome://extensions/`
   - Click reload icon on GrowTools extension

## Publishing to Chrome Web Store

1. **Prepare for Production:**
   ```bash
   # Update manifest.json
   # Change localhost URLs to production domain
   # Update version number
   # Test thoroughly
   ```

2. **Create ZIP:**
   ```bash
   cd extension
   zip -r growtools-extension.zip . -x "*.git*" -x "README.md"
   ```

3. **Submit to Chrome Web Store:**
   - Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Create developer account ($5 one-time fee)
   - Click "New Item"
   - Upload ZIP file
   - Fill in store listing details
   - Submit for review (typically 1-3 days)

4. **Update Links:**
   - Once published, update dashboard to show Chrome Web Store link
   - Update extension to point to production domain

## Security Considerations

### ✅ What's Secure:
- Cookies are encrypted before transmission
- Only works on approved domains (manifest.json)
- Requires active subscription to access cookies
- Uses Chrome's secure storage APIs

### ⚠️ Potential Risks:
- **Account Sharing Violations**: Most platforms prohibit account sharing in ToS
- **Account Bans**: Shared accounts may get banned if detected
- **Cookie Expiry**: Cookies expire and need regular updates
- **Rate Limiting**: Too many users on one account may trigger alerts

### 🔒 Best Practices:
- Rotate cookies regularly
- Monitor for expired cookies
- Limit concurrent users per account
- Add rate limiting on dashboard
- Clear cookies after use (optional)

## API Permissions

The extension requires these permissions:

- **cookies**: To inject authentication cookies
- **storage**: To store extension settings
- **tabs**: To open tools in new tabs
- **host_permissions**: To access all websites where tools are hosted

## Browser Compatibility

- ✅ **Chrome**: Fully supported (Manifest V3)
- ✅ **Edge**: Fully supported (Chromium-based)
- 🔄 **Firefox**: Requires adaptation (different API)
- ❌ **Safari**: Not supported (different extension system)

## Development Roadmap

- [x] Basic cookie injection
- [x] Message passing system
- [x] Popup UI
- [ ] Offline support
- [ ] Firefox version
- [ ] Automatic cookie refresh
- [ ] Usage analytics
- [ ] Multi-account switching

## Support

For issues or questions:
- Check browser console for errors
- Review this README
- Contact support at support@growtools.com

## License

Proprietary - GrowTools Platform
