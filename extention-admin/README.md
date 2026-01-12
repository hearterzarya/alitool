# AliDigitalSolution Admin Extension

Admin browser extension for managing cookies and sessions for tools.

## Features

- **Extract Cookies**: Extract all cookies from any website with one click
- **Upload to Admin Panel**: Directly upload cookies to tools in the admin panel
- **Clear Cookies**: Clear all cookies for a domain to test fresh sessions
- **Test Injection**: Test cookie injection before uploading
- **Session Management**: View and manage localStorage and sessionStorage
- **Cookie Formatting**: Automatically format cookies in the correct JSON structure

## Installation

1. Download the extension ZIP file from the admin panel (`/admin/extension`)
2. Extract the ZIP file to a folder on your computer
3. Open Chrome/Edge and navigate to `chrome://extensions/`
4. Enable "Developer mode" (toggle in the top right)
5. Click "Load unpacked" button
6. Select the extracted folder
7. The extension icon will appear in your browser toolbar

## Usage

### Extract Cookies

1. Navigate to the tool website (e.g., `https://chat.openai.com`)
2. Log in to the tool
3. Click the extension icon
4. Click "Extract from Current Tab"
5. Review the extracted cookies

### Upload Cookies

1. Extract cookies (see above) or paste cookies JSON
2. Go to the "Upload" tab in the extension
3. Enter the Tool ID from the admin panel
4. Optionally set an expiry date
5. Click "Upload Cookies"
6. Cookies will be encrypted and saved to the tool

### Clear Cookies

1. Enter the domain/URL in the "Manage" tab
2. Click "Clear All Cookies"
3. Confirm the action
4. All cookies for that domain will be removed

### Test Cookie Injection

1. Enter the domain/URL in the "Manage" tab
2. Click "Test Cookie Injection"
3. A test cookie will be injected to verify the extension works

## API Integration

The extension communicates with the admin API at:
- `POST /api/admin/tools/{toolId}/cookies` - Upload cookies

Make sure you're logged into the admin panel in the same browser for authentication.

## Permissions

The extension requires the following permissions:
- `cookies` - To read and set cookies
- `tabs` - To access current tab information
- `storage` - To store extension settings
- `activeTab` - To interact with the current tab
- `scripting` - To inject scripts
- `webRequest` - To monitor web requests (for advanced features)

## Security

- Cookies are encrypted before uploading to the server
- Authentication is handled via browser cookies (same session as admin panel)
- All cookie operations are logged in the admin panel

## Troubleshooting

**Extension not working?**
- Make sure Developer mode is enabled
- Check browser console for errors
- Verify you're logged into the admin panel

**Cookies not extracting?**
- Make sure you're on the correct website
- Check if the website uses cookies (some sites use localStorage only)
- Try refreshing the page and extracting again

**Upload failing?**
- Verify you're logged into the admin panel
- Check the Tool ID is correct
- Ensure cookies JSON is valid
- Check browser console for error messages

## Support

For issues or questions, contact the development team or check the admin panel documentation.
