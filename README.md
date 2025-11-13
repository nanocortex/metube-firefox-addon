# Firefox MeTube addon

Addon for queueing videos to [MeTube](https://github.com/alexta69/metube) instance.

![example](https://github.com/nanocortex/metube-firefox-addon/blob/master/assets/scr_context_menu.png?raw=true)
![example](https://github.com/nanocortex/metube-firefox-addon/blob/master/assets/scr_button.png?raw=true)

## Installation from store

- Install from [Firefox Addons](https://addons.mozilla.org/en-US/firefox/addon/metube-downloader)

## Usage

Before use you should configure MeTube instance url in addon preferences`about:addons`.

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

- **MeTube Instance URL**: URL of your MeTube instance (e.g., `https://metube.example.com`).  
  **Default**: `""` (empty string)

- **Default Quality**: The quality setting for downloads.  
  **Default**: `best`

- **Default Format**: The format for downloads.  
  **Default**: `any`

- **Default Folder**: The folder where downloaded files will be saved.  
  **Default**: `""` (empty string)

- **Custom Name Prefix**: A prefix that will be added to the names of downloaded files.  
  **Default**: `""` (empty string)

- **Open in New Tab**: Option to open the MeTube instance in a new tab after adding to the queue.  
  **Default**: `false`

- **Show Context Menu**: Displays a context menu on supported sites (e.g., YouTube, Vimeo).  
  **Default**: `false`

- **Auto Start**: Automatically starts the download when the file is ready.  
  **Default**: `true`

- **One-Click Mode**: Sends the current page to the MeTube instance with one click.  
  **Default**: `false`

- **Send Custom Headers**: Enables the inclusion of custom headers when queueing to the MeTube instance.  
  **Default**: `false`

- **Custom Headers**: Specify the custom header name and value for authentication or other purposes.  
  **Default**: `[]` (empty array)

## Permissions

This extension requires the following permissions:

- **Access browser tabs** (`activeTab`) - To get the current tab's URL when you want to send it to MeTube.
- **Display context menu** (`menus`) - To show the right-click context menu option.
- **Store data** (`storage`) - To save your MeTube instance URL and preferences.

**Optional permissions (requested at runtime when SSO is enabled):**
- **Access all websites** (`<all_urls>`) - Only requested if you enable "Send cookies for authentication (SSO)" in settings. This permission is necessary because SSO authentication systems redirect to different domains (e.g., Authentik, Authelia, Keycloak) for login. The extension only uses this to follow authentication redirects and will only actually access your MeTube instance and authentication provider. If your MeTube instance doesn't require SSO authentication, you can leave this option disabled and no permission will be requested.
- **Access cookies** - Required for SSO mode to send authentication cookies to your MeTube instance.

## Planned features

- [x] keyboard shortcuts
- [ ] new tab in popup with download history
- [ ] option to customize the list of sites where the context menu will appear
- [ ] enhance the user interface for settings (maybe in separate tab)
- [ ] upgrade to Manifest V3
- [x] Github Actions for creating releases (maybe publish to Mozilla too?)

## Contributors

Thanks to the following contributors for their work on this project:

-  [Whale Mo](https://github.com/ncwhale)
-  [Elwyn](https://github.com/elwynelwyn)
-  [Ayush Chaurasia](https://github.com/ayushc137)

If you would like to contribute, please create an issue or make a pull request.
