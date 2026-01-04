# GrowTools Extension - Testing Guide

## Prerequisites

1. **GrowTools Platform Running:**
   ```bash
   cd client
   npm run dev
   # Should be running on http://localhost:3000
   ```

2. **Database Setup:**
   - Database should have seed data (tools and users)
   - At least one user account registered
   - At least one tool with cookies configured

3. **Extension Installed:**
   - Extension loaded in Chrome (chrome://extensions/)
   - Developer mode enabled
   - Extension showing "Active" status

## Test Scenarios

### Test 1: Extension Installation Check

**Goal:** Verify extension loads correctly

**Steps:**
1. Open `chrome://extensions/`
2. Verify "GrowTools Access" appears
3. Click extension icon in toolbar
4. Popup should open with:
   - ✅ "Active" status with green dot
   - ✅ Version number displayed
   - ✅ "Connected" status
   - ✅ Working buttons

**Expected Result:** ✅ Extension loads without errors

---

### Test 2: Content Script Communication

**Goal:** Verify content script loads on dashboard

**Steps:**
1. Open http://localhost:3000/dashboard
2. Open browser console (F12)
3. Look for message: "GrowTools Extension: Content script loaded"
4. Check for: "GrowTools Extension: Ready to receive messages"

**Expected Result:** ✅ Content script loads and logs appear

---

### Test 3: Extension Detection from Dashboard

**Goal:** Verify dashboard can detect extension

**Steps:**
1. Login to dashboard (http://localhost:3000/dashboard)
2. Open browser console
3. Run this code:
   ```javascript
   window.postMessage({ type: 'GROWTOOLS_CHECK_EXTENSION' }, '*');
   ```
4. Listen for response:
   ```javascript
   window.addEventListener('message', (e) => {
     if (e.data.type === 'GROWTOOLS_EXTENSION_RESPONSE') {
       console.log('Extension response:', e.data);
     }
   });
   ```

**Expected Result:** ✅ Receives `{ installed: true, active: true }`

---

### Test 4: Cookie Injection (Mock)

**Goal:** Verify cookie injection works with test data

**Steps:**
1. Open dashboard: http://localhost:3000/dashboard
2. Open browser console
3. Send test message:
   ```javascript
   window.postMessage({
     type: 'GROWTOOLS_ACCESS_TOOL',
     data: {
       toolUrl: 'https://example.com',
       cookies: [
         {
           name: 'test_cookie',
           value: 'test_value',
           domain: 'example.com',
           path: '/',
           secure: false,
           httpOnly: false
         }
       ]
     }
   }, '*');
   ```
4. Check extension console (chrome://extensions/ → service worker)
5. New tab should open to https://example.com

**Expected Result:**
- ✅ Console shows "Injecting 1 cookies for https://example.com"
- ✅ New tab opens
- ✅ Cookie injected (check in DevTools → Application → Cookies)

---

### Test 5: Access Tool Button (Full Flow)

**Goal:** Test complete user flow from dashboard

**Steps:**
1. **Setup Admin Panel:**
   - Login as admin
   - Go to /admin/tools
   - Edit a tool (e.g., ChatGPT Plus)
   - Paste test cookies (JSON format):
     ```json
     {
       "cookies": [
         {
           "name": "session_token",
           "value": "fake_token_for_testing",
           "domain": "example.com",
           "path": "/",
           "secure": true,
           "httpOnly": true
         }
       ]
     }
     ```
   - Save cookies

2. **Create Test Subscription:**
   - Using Prisma Studio or directly in database
   - Create ToolSubscription for your user + tool
   - Set status = "ACTIVE"

3. **Test Access:**
   - Logout from admin
   - Login as regular user
   - Go to /dashboard
   - Find tool with active subscription
   - Click "Access Tool" button

4. **Verify:**
   - Check for loading state
   - Extension should receive message
   - New tab opens to tool URL
   - Cookies injected

**Expected Result:**
- ✅ Button shows loading state
- ✅ Extension injects cookies
- ✅ Opens tool in new tab
- ✅ Success message appears

---

### Test 6: Error Handling

**Goal:** Test error scenarios

**Test 6A: No Extension Installed**
1. Disable extension in chrome://extensions/
2. Go to dashboard
3. Click "Access Tool"
4. Should show modal: "Extension Required"

**Test 6B: No Active Subscription**
1. Delete user's subscription from database
2. Try to access tool
3. Should show error: "No active subscription"

**Test 6C: Tool Without Cookies**
1. Admin deletes cookies from tool
2. User tries to access
3. Should show error: "Cookies not configured"

**Expected Results:** ✅ All errors handled gracefully with user-friendly messages

---

### Test 7: Real Tool Access (Optional)

**Goal:** Test with actual tool cookies

**⚠️ Warning:** This uses real cookies from actual accounts

**Steps:**
1. **Get Real Cookies:**
   - Login to ChatGPT (or any tool)
   - Open DevTools → Application → Cookies
   - Export all cookies for the domain
   - Format as JSON array

2. **Configure in Admin:**
   - Go to /admin/tools
   - Edit tool
   - Paste real cookies
   - Set expiry date
   - Save

3. **Test Access:**
   - Go to /dashboard as user
   - Click "Access Tool" for that tool
   - New tab should open
   - Should be logged in automatically

**Expected Result:**
- ✅ Opens tool website
- ✅ User is logged in (cookies worked)
- ✅ Can use tool immediately

---

## Console Debugging

### Extension Background Console
```
chrome://extensions/
→ GrowTools Access
→ "service worker" link
→ DevTools opens
```

**Look for:**
- "GrowTools Extension: Background service worker loaded"
- "Background: Received message INJECT_COOKIES_AND_OPEN"
- "Injecting X cookies for [URL]"
- "✓ Injected cookie: [name]"
- "Opened tool in tab [id]"

### Dashboard Console
```
F12 on dashboard page
```

**Look for:**
- "GrowTools Extension: Content script loaded"
- "Content: Received GROWTOOLS_ACCESS_TOOL message"
- "Content: Background script response"

### Network Tab
```
F12 → Network tab
```

**Look for:**
- POST /api/cookies/[toolId] (when fetching cookies)
- Should return 200 with cookies array

---

## Common Issues & Solutions

### Issue: Extension Not Loading
**Solution:**
- Check manifest.json for syntax errors
- Reload extension in chrome://extensions/
- Check service worker for errors

### Issue: Content Script Not Injecting
**Solution:**
- Verify URL matches content_scripts.matches in manifest
- Reload the dashboard page
- Check for JavaScript errors on page

### Issue: Cookies Not Injecting
**Solution:**
- Check host_permissions in manifest includes the tool domain
- Verify cookie format is correct
- Check cookie domain matches tool URL
- Look for errors in extension console

### Issue: "Access Tool" Button Not Working
**Solution:**
- Verify user has active subscription
- Check API route /api/cookies/[toolId] returns 200
- Verify cookies are decrypted correctly
- Check extension is installed and active

### Issue: Tool Opens But Not Logged In
**Solution:**
- Cookies might be expired
- Cookie domain might not match
- Check httpOnly and secure flags
- Verify all required cookies are present

---

## Testing Checklist

Before marking extension as complete:

- [ ] Extension loads without errors
- [ ] Popup displays correctly with all info
- [ ] Content script loads on dashboard
- [ ] Extension detection works
- [ ] Cookie injection works (test data)
- [ ] Access Tool button shows proper states
- [ ] Error handling works for all scenarios
- [ ] Real cookie injection works (optional)
- [ ] Multiple tools can be accessed
- [ ] Extension works after browser restart
- [ ] No console errors in any component

---

## Performance Testing

### Memory Leaks
```bash
# Open chrome://extensions/
# Click "Inspect views: service worker"
# Go to Memory tab
# Take heap snapshot
# Use extension multiple times
# Take another snapshot
# Compare - should not grow significantly
```

### Background Script Lifecycle
```bash
# The service worker should:
# - Start when needed
# - Process messages
# - Go idle after 30 seconds
# - Wake up on next message
```

---

## Security Testing

### Test 1: Verify Encrypted Cookie Storage
- Cookies in database should be encrypted (not readable)
- API should decrypt before sending to extension
- Extension receives plain cookies (for injection)

### Test 2: Verify Auth Protection
- Unauthenticated users can't access /api/cookies/[id]
- Users without subscription can't get cookies
- Admin-only endpoints protected

### Test 3: Verify Cookie Isolation
- User A's subscription doesn't give access to User B's cookies
- Each tool's cookies are separate

---

## Next Steps After Testing

Once all tests pass:

1. **Document any issues found**
2. **Fix critical bugs**
3. **Optimize performance**
4. **Prepare for production:**
   - Update manifest URLs to production domain
   - Create proper icons
   - Test with real tools
   - Get user feedback

5. **Prepare for Chrome Web Store:**
   - Create store listing screenshots
   - Write store description
   - Set up developer account
   - Submit for review

---

## Support

If you encounter issues during testing:
1. Check console errors first
2. Review this testing guide
3. Check extension README.md
4. Review background.js and content.js code
5. Test with simplified cookie data first

Happy Testing! 🚀
