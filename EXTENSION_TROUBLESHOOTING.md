# Extension Troubleshooting Guide

## Extension Not Detected

If you've installed the extension but the app still shows "Extension Required", follow these steps:

### Step 1: Verify Extension is Loaded

1. Open Chrome and go to `chrome://extensions/`
2. Make sure "Developer mode" is enabled (toggle in top right)
3. Check that "GrowTools - Premium Tools Access" extension is listed
4. Verify it's **enabled** (toggle should be blue/on)
5. Check for any error messages (red text)

### Step 2: Check Extension Files

Make sure all these files exist in your extension folder:
- ✅ `manifest.json`
- ✅ `background.js`
- ✅ `content.js`
- ✅ `popup.html`
- ✅ `popup.js`
- ✅ `logo.png`

### Step 3: Reload Extension

1. In `chrome://extensions/`, find your extension
2. Click the **reload icon** (circular arrow) on the extension card
3. Check for any errors in the console

### Step 4: Check Content Script Injection

1. Open your web app (e.g., `http://localhost:3000`)
2. Open browser DevTools (F12)
3. Go to Console tab
4. Type: `window.postMessage({ type: "GROWTOOLS_CHECK" }, "*")`
5. You should see the extension responding

### Step 5: Check Background Script

1. In `chrome://extensions/`, find your extension
2. Click "Inspect views: service worker" (or "background page")
3. Check for any errors in the console
4. The background script should be running without errors

### Step 6: Verify Content Script is Running

1. Open your web app
2. Open DevTools (F12)
3. Go to Console tab
4. Check if you see any extension-related errors
5. The content script should be injected automatically

### Step 7: Test Message Passing

1. Open your web app dashboard
2. Open DevTools Console
3. Run this command:
   ```javascript
   window.postMessage({ type: "GROWTOOLS_CHECK" }, "*");
   ```
4. You should see a response message in the console

### Step 8: Check Page Refresh

After installing/reloading the extension:
1. **Refresh the web page** (F5 or Ctrl+R)
2. Try clicking "Access Tool" again
3. The extension should now be detected

## Common Issues

### Issue: Extension shows but not detected

**Solution:**
- Refresh the web page after installing extension
- Clear browser cache
- Try in incognito mode (with extension enabled)

### Issue: Content script not injecting

**Solution:**
- Check `manifest.json` has correct `content_scripts` configuration
- Verify `matches: ["<all_urls>"]` is set
- Reload the extension
- Refresh the web page

### Issue: Background script errors

**Solution:**
- Check background script console for errors
- Verify all Chrome APIs are available
- Make sure manifest permissions are correct

### Issue: Message passing not working

**Solution:**
- Check browser console for errors
- Verify content script is loaded (check Sources tab in DevTools)
- Make sure you're on the same origin (not blocked by CORS)

## Debug Checklist

- [ ] Extension is loaded in `chrome://extensions/`
- [ ] Extension is enabled (toggle is on)
- [ ] No errors in extension console
- [ ] Content script is injected (check DevTools Sources)
- [ ] Background script is running (check service worker)
- [ ] Web page is refreshed after extension install
- [ ] Browser console shows no errors
- [ ] Message passing test works

## Still Not Working?

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for red error messages
   - Check Network tab for failed requests

2. **Check Extension Console:**
   - Go to `chrome://extensions/`
   - Click "Inspect views: service worker"
   - Look for errors

3. **Verify File Paths:**
   - Make sure you loaded the correct folder
   - All files should be in the same directory
   - No nested folders (except `lib/`)

4. **Try Fresh Install:**
   - Remove the extension completely
   - Reload it from scratch
   - Refresh the web page

5. **Check Manifest:**
   - Open `manifest.json`
   - Verify all file paths are correct
   - Check version number

## Quick Test

Run this in your browser console on the web app:

```javascript
// Test 1: Check if content script is listening
window.postMessage({ type: "GROWTOOLS_CHECK" }, "*");

// Test 2: Listen for response
window.addEventListener('message', (e) => {
  if (e.data.type === 'GROWTOOLS_INSTALLED') {
    console.log('✅ Extension detected!');
  }
});
```

If you see "✅ Extension detected!" in the console, the extension is working!

