# Changelog

## 1.6.3 - 2025-11-13
- Add keyboard shortcut (Ctrl+Shift+M / Cmd+Shift+M) to send current page to MeTube
- Show loading indicator in popup when using keyboard shortcuts or context menu
- Prevent duplicate requests when shortcut/context menu is triggered multiple times

## 1.6.2 - 2025-11-11
- Made SSO authentication opt-in with optional permissions (`<all_urls>`, `cookies`)
- Added privacy notice explaining why broad permissions are needed for SSO redirects
- Reduced default permissions to `activeTab`, `menus`, and `storage` only
- Improved error messages for authentication failures

## 1.6.1 - 2025-11-10
- Added customNamePrefix and autoStart fields to popup
- Added quality options 360p and 240p
- Added URL validation in options and popup
- Added test connection button in options page
- Added save success indicator in options page
- Improved error messages to show actual MeTube responses
- Fixed context menu default setting to be enabled on first install

## 1.6.0 - 2025-11-09
- Added support for authentication via browser cookies (fixes SSO/reverse proxy auth issues)
- Replaced XMLHttpRequest with modern fetch() API
- Improved error handling with better error messages
- Added permissions for cookies and all URLs (required for fetch with credentials)

## 1.5.0 - 2025-04-16
- Added One-click mode, which automatically send the current page to MeTube instance when you click the extension icon (no popup, default values)
- Changed Auto Start option to true by default
- Improved some options description

## 1.4.2 - 2025-04-15
- Fixed download folder not properly passed to MeTube when used from popup
- Improved options readability

## 1.4.1 - 2025-01-16
- Added missing formats and quality types
- Added options for folder, autoStart and customNamePrefix

## 1.4.0 - 2024-04-27
- Added loading spinner when queueing, thanks to [@elwynelwyn](https://github.com/elwynelwyn)
- Added ability to configure custom headers, thanks to [@elwynelwyn](https://github.com/elwynelwyn)

## 1.3.4 - 2023-03-19

- Added missing format types: WAV, Opus, M4A, Thumbnail
- Improved UI to be easier on the eyes

## 1.3.3 - 2022-02-07

- Added default quality and format option, thanks to [@aYUSHc137](https://github.com/ayushc137)
- Added url input field in popup, thanks to [@aYUSHc137](https://github.com/ayushc137)
- Fixed context menu action not working

## 1.3.2 - 2021-12-12

- Fixed shouldShowContextMenu() return BUG, thanks to [@ncwhale](https://github.com/ncwhale)

## 1.3.1 - 2021-12-01

- Added context menu switch, thanks to [@ncwhale](https://github.com/ncwhale)
 
## 1.3 - 2021-11-27

- Added popup when clicking toolbar button for better verbosity
- Added option to select quality and format

## 1.2 - 2021-11-06

- Added option in addon preferences to open MeTube instance in new tab

## 1.0-1.1 - 2021-10-13

- Initial version
