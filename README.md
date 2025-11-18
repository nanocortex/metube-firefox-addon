# Firefox MeTube addon

[![Firefox Add-on](https://img.shields.io/amo/v/metube-downloader?label=Firefox%20Add-on)](https://addons.mozilla.org/en-US/firefox/addon/metube-downloader)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)
[![GitHub issues](https://img.shields.io/github/issues/nanocortex/metube-firefox-addon)](https://github.com/nanocortex/metube-firefox-addon/issues)

Browser extension for queueing videos to your [MeTube](https://github.com/alexta69/metube) instance.

### Context Menu Integration
![Context menu on video links](https://github.com/nanocortex/metube-firefox-addon/blob/master/assets/scr_context_menu.png?raw=true)

### Popup Interface
![Extension popup with options](https://github.com/nanocortex/metube-firefox-addon/blob/master/assets/scr_button.png?raw=true)

## Features

- **One-Click Sending** - Send current page to MeTube with a single click or keyboard shortcut
- **Context Menu Integration** - Right-click on links to send them directly to MeTube
- **Keyboard Shortcuts** - Customizable keyboard shortcut (default: Ctrl+Shift+M)
- **SSO Authentication Support** - Works with SSO systems like Authentik, Authelia, and Keycloak
- **Custom Headers** - Add custom HTTP headers for authentication or other purposes
- **Playlist Control** - Strict Playlist Mode prevents unwanted full playlist downloads
- **Flexible Configuration** - Control quality, format, folder, auto-start, and more

## Installation

Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/metube-downloader)

See the [CHANGELOG](CHANGELOG.md) for version history and release notes.

## Usage

> **Note**: This extension requires a running [MeTube](https://github.com/alexta69/metube) instance. MeTube is a self-hosted YouTube downloader with a web interface. If you don't have MeTube set up yet, visit the [MeTube project](https://github.com/alexta69/metube) for installation instructions.

### Basic Usage

1. Configure your MeTube instance URL in addon preferences (`about:addons` → MeTube Downloader → Options)
2. Navigate to any video page (YouTube, Vimeo, etc.)
3. Send to MeTube using one of these methods:
   - Click the extension icon in the toolbar
   - Use the keyboard shortcut `Ctrl+Shift+M` (or `Cmd+Shift+M` on Mac)
   - Right-click on a video link and select "Send to MeTube" (if context menu is enabled)

### Keyboard Shortcuts

The extension supports the following keyboard shortcut:

- **Ctrl+Shift+M** (Windows/Linux) or **Cmd+Shift+M** (Mac) - Send current page to MeTube

You can customize this shortcut in Firefox:
1. Navigate to `about:addons`
2. Click the gear icon ⚙️ at the top
3. Select "Manage Extension Shortcuts"
4. Find "MeTube Downloader" and customize the "Send current page to MeTube" shortcut

### Enabling SSO Support

If your MeTube instance is behind SSO authentication (e.g., Authentik, Authelia, Keycloak):

1. Open extension settings (`about:addons` → MeTube Downloader → Options)
2. Enter your MeTube instance URL
3. Check the **"Send cookies for authentication (SSO)"** checkbox
4. Read the privacy notice that appears explaining why `<all_urls>` permission is needed
5. Click **"Save Settings"** - Firefox will prompt you to allow access to all websites
6. Open your MeTube instance in a browser tab and log in through your SSO provider
7. The extension will now use your existing session cookies to authenticate requests

## Options

| Option | Description | Default |
|--------|-------------|---------|
| **MeTube Instance URL** | URL of your MeTube instance (e.g., `https://metube.example.com`) | `""` (empty) |
| **Default Quality** | Quality setting for downloads | `best` |
| **Default Format** | Format for downloads | `any` |
| **Default Folder** | Folder where downloaded files will be saved | `""` (empty) |
| **Custom Name Prefix** | Prefix added to downloaded file names | `""` (empty) |
| **Open in New Tab** | Open MeTube instance in new tab after adding to queue | `false` |
| **Show Context Menu** | Display context menu on supported sites | `true` |
| **Auto Start** | Automatically start downloads when ready | `true` |
| **One-Click Mode** | Send current page to MeTube with one click | `false` |
| **Strict Playlist Mode** | Only download playlists when URL explicitly points to one (prevents downloading YouTube Mixes when you only want the current video) | `false` |
| **Send Custom Headers** | Enable inclusion of custom headers when queueing | `false` |
| **Custom Headers** | Specify custom header names and values for authentication or other purposes | `[]` (empty) |

## Permissions

This extension requires the following permissions:

- **Access browser tabs** (`activeTab`) - To get the current tab's URL when you want to send it to MeTube.
- **Display context menu** (`menus`) - To show the right-click context menu option.
- **Store data** (`storage`) - To save your MeTube instance URL and preferences.

**Optional permissions (requested at runtime when SSO is enabled):**
- **Access all websites** (`<all_urls>`) - Only requested if you enable "Send cookies for authentication (SSO)" in settings. This permission is necessary because SSO authentication systems redirect to different domains (e.g., Authentik, Authelia, Keycloak) for login. The extension only uses this to follow authentication redirects and will only actually access your MeTube instance and authentication provider. If your MeTube instance doesn't require SSO authentication, you can leave this option disabled and no permission will be requested.
- **Access cookies** - Required for SSO mode to send authentication cookies to your MeTube instance.

## Troubleshooting

### Connection Issues

**Error: "MeTube instance url not configured"**
- Go to `about:addons` → MeTube Downloader → Options and enter your MeTube URL

**Error: "Connection failed" with HTTP URLs (e.g., `http://server:5510`)**
- Firefox HTTPS-Only Mode blocks HTTP requests from extensions ([Firefox bug #1685862](https://bugzilla.mozilla.org/show_bug.cgi?id=1685862))
- **Important**: Site exceptions do NOT work for extension requests - this is a known Firefox limitation
- **Workaround**: Use direct IP address instead of hostname (e.g., `http://192.168.1.100:5510` instead of `http://server.local:5510`)
  - Firefox has built-in HTTPS-Only Mode exemptions for local IP addresses
- **Solution 1**: Disable HTTPS-Only Mode entirely (Settings → Privacy & Security → HTTPS-Only Mode → "Don't enable")
- **Solution 2**: Use HTTPS with a reverse proxy

**Error: "Connection failed" with HTTPS URLs**
- **Self-signed certificate**: Visit your MeTube URL in a browser tab first and accept the security warning/certificate
- **CORS not configured**: MeTube needs proper CORS headers (usually configured via reverse proxy)
- **SSO/Authentication**: Enable "Send cookies for authentication (SSO)" in extension settings (see [Enabling SSO Support](#enabling-sso-support))

**Error: "Authentication failed. Your MeTube instance is redirecting to authentication"**
- You need to log in to your MeTube instance first
- Open your MeTube URL in a regular browser tab and log in through your SSO provider
- Then try using the extension again from that same tab

### Debugging and Viewing Logs

To view detailed error messages and logs:
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Find "MeTube Downloader" and click "Inspect"
3. Go to the Console tab
4. Try sending a video to MeTube and check the console for error details

### Other Issues

**Context menu not appearing**
- Go to extension settings and enable "Show Context Menu"

**One-click mode not working**
- Verify "One-Click Mode" is enabled in settings
- The extension popup will be disabled when one-click mode is active

For other issues, please [create an issue on GitHub](https://github.com/nanocortex/metube-firefox-addon/issues).

## Roadmap

- [x] keyboard shortcuts
- [ ] new tab in popup with download history
- [ ] option to customize the list of sites where the context menu will appear
- [ ] enhance the user interface for settings (maybe in separate tab)
- [ ] dark/light mode theme support for popup and options pages
- [ ] Chrome/Edge browser port (cross-browser compatibility)
- [ ] mobile Firefox support (optimize UI for Firefox on Android)
- [ ] upgrade to Manifest V3
- [x] Github Actions for creating releases (maybe publish to Mozilla too?)

## Development

### Loading for Development
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `src/manifest.json` from this repository

## Support

Having issues? Check the [Troubleshooting](#troubleshooting) section above or [create an issue on GitHub](https://github.com/nanocortex/metube-firefox-addon/issues).

## Contributing

If you would like to contribute, please [create an issue](https://github.com/nanocortex/metube-firefox-addon/issues) or make a pull request.

Thanks to the following contributors for their work on this project:

-  [Whale Mo](https://github.com/ncwhale)
-  [Elwyn](https://github.com/elwynelwyn)
-  [Ayush Chaurasia](https://github.com/ayushc137)
-  [gmpbigsun](https://github.com/gmpbigsun)

## License

This project is licensed under the [Mozilla Public License Version 2.0](LICENSE).
