# Firefox MeTube addon

Addon for queueing videos to [MeTube](https://github.com/alexta69/metube) instance.

![example](https://github.com/nanocortex/metube-firefox-addon/blob/master/assets/scr_context_menu.png?raw=true)
![example](https://github.com/nanocortex/metube-firefox-addon/blob/master/assets/scr_button.png?raw=true)

## Installation from store

- Install from [Firefox Addons](https://addons.mozilla.org/en-US/firefox/addon/metube-downloader)

## Usage

Before use you should configure MeTube instance url in addon preferences`about:addons`.

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
