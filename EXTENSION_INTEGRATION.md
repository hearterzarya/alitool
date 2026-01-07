# Extension Integration Guide

## Overview

The GrowTools browser extension has been fully integrated with the web application. This document explains how the integration works and how to use it.

## Architecture

### Communication Flow

```
Web App (React) 
    ↓ window.postMessage
Content Script (content.js)
    ↓ chrome.runtime.connect
Background Script (background.js)
    ↓ chrome.cookies.set + chrome.tabs.create
Browser (Cookie Injection + Tab Opening)
```

### Components

1. **Web App** (`src/components/dashboard/access-tool-button.tsx`)
   - Detects extension installation
   - Fetches cookies from API
   - Sends access requests to extension
   - Shows success/error feedback

2. **Content Script** (`extention/content.js`)
   - Listens for messages from web app
   - Forwards messages to background script
   - Returns responses to web app

3. **Background Script** (`extention/background.js`)
   - Handles cookie injection
   - Clears existing cookies
   - Opens tool URLs in new tabs
   - Manages extension state

4. **Popup** (`extention/popup.html` + `popup.js`)
   - Shows extension status
   - Quick access to dashboard
   - Version information

## Integration Points

### 1. Extension Detection

The web app checks if the extension is installed by sending a `GROWTOOLS_CHECK` message:

```typescript
window.postMessage({ type: "GROWTOOLS_CHECK" }, "*");
```

The extension responds with:
```javascript
{ type: "GROWTOOLS_INSTALLED" }
```

### 2. Tool Access Request

When user clicks "Access Tool", the app:

1. Fetches cookies from `/api/cookies/${toolId}`
2. Sends access request to extension:
```javascript
window.postMessage({
  type: "GROWTOOLS_ACCESS",
  toolId: tool.id,
  url: url,
  cookies: cookies  // Base64 encoded JSON
}, "*");
```

### 3. Cookie Injection

The extension:
1. Decodes base64 cookies
2. Clears existing cookies for the domain
3. Injects new cookies
4. Opens tool URL in new tab

### 4. Success/Error Feedback

Extension sends back:
- Success: `{ type: "GROWTOOLS_ACCESS_SUCCESS", toolId: "..." }`
- Error: `{ type: "GROWTOOLS_ACCESS_ERROR", error: "...", toolId: "..." }`

## Setup Instructions

### For Developers

1. **Load Extension in Chrome:**
   ```bash
   # Navigate to chrome://extensions/
   # Enable Developer mode
   # Click "Load unpacked"
   # Select the extention/ folder
   ```

2. **Start Web App:**
   ```bash
   npm run dev
   ```

3. **Test Integration:**
   - Login to the app
   - Go to dashboard
   - Click "Access Tool" on any tool
   - Verify tool opens with cookies injected

### For Production

1. **Package Extension:**
   - Zip the `extention/` folder
   - Or use Chrome Web Store publishing

2. **Update Web App:**
   - Set `NEXT_PUBLIC_EXTENSION_ID` if needed (optional)
   - Extension works without this (uses window.postMessage)

## Message Protocol

### Web App → Extension

| Type | Payload | Description |
|------|---------|-------------|
| `GROWTOOLS_CHECK` | `{}` | Check if extension is installed |
| `GROWTOOLS_ACCESS` | `{ toolId, url, cookies }` | Request tool access |

### Extension → Web App

| Type | Payload | Description |
|------|---------|-------------|
| `GROWTOOLS_INSTALLED` | `{}` | Extension is installed |
| `GROWTOOLS_ACCESS_SUCCESS` | `{ toolId }` | Tool access succeeded |
| `GROWTOOLS_ACCESS_ERROR` | `{ error, toolId }` | Tool access failed |

## Security Considerations

1. **Cookie Encryption**: Cookies are encrypted in the database
2. **Message Validation**: Content script validates message sources
3. **Domain Permissions**: Extension only works on configured domains
4. **No Storage**: Sensitive data is not stored in extension

## Troubleshooting

### Extension Not Detected

**Symptoms:** Modal shows "Extension Required"

**Solutions:**
1. Verify extension is loaded in `chrome://extensions/`
2. Check extension is enabled
3. Refresh the web page
4. Check browser console for errors

### Cookies Not Injecting

**Symptoms:** Tool opens but user is not logged in

**Solutions:**
1. Check background script logs (Inspect service worker)
2. Verify cookie format from API
3. Check domain permissions in manifest
4. Verify cookies API returns valid data

### Tool Not Opening

**Symptoms:** No new tab opens

**Solutions:**
1. Check background script for errors
2. Verify URL is valid
3. Check tab permissions in manifest
4. Review browser console logs

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Extension detected by web app
- [ ] Cookies API returns valid data
- [ ] Cookies inject successfully
- [ ] Tool opens in new tab
- [ ] User is logged in on tool site
- [ ] Success feedback shows in UI
- [ ] Error handling works correctly

## Future Enhancements

1. **Chrome Web Store**: Publish extension to store
2. **Firefox Support**: Create Firefox version
3. **Auto-refresh**: Auto-refresh cookies before expiry
4. **Multiple Tabs**: Support opening multiple tools
5. **Session Sync**: Sync sessions across devices

## Support

For issues or questions:
- Check extension logs in `chrome://extensions/`
- Review web app console
- Check API responses in Network tab
- Contact development team

