let isRequestInProgress = false;

function onMenuCreated() {
  if (browser.runtime.lastError) {
    console.log("error creating item:" + browser.runtime.lastError);
  }

  syncContextMenu().then(() => {
    console.log("Context menu synced");
  });
}

async function syncContextMenu() {
  let showContextMenu = await shouldShowContextMenu();
  browser.menus.update("send-to-metube", {
    visible: showContextMenu,
  });
}

browser.browserAction.onClicked.addListener(async () => {
  const oneClickMode = await getOneClickMode();

  if (oneClickMode) {
    const url = await getCurrentUrl();
    const options = await getDefaultSendOptions();
    await sendToMeTube(url, options.quality, options.format, options.folder,
                       options.customNamePrefix, options.autoStart);
  }
});

browser.menus.create({
  id: "send-to-metube",
  title: "Send to MeTube",
  contexts: ["link"]
}, onMenuCreated);

async function showError(errorMessage) {
  console.error(`Error occurred: ${errorMessage}`)
  try {
    await browser.runtime.sendMessage({ command: 'errorOccurred', errorMessage: errorMessage });
  } catch (e) {
    console.log(`Popup closed, cannot display error message`);
  }
}

async function showSuccess() {
  console.log('Successfully sent to MeTube');
  try {
    await browser.runtime.sendMessage({ command: 'success' });
  } catch (e) {
    console.log('Popup closed, cannot display success message');
  }
}

async function getMeTubeUrl() {
  let item = await browser.storage.sync.get("url");
  return item.url;
}

async function shouldOpenInNewTab() {
  let item = await browser.storage.sync.get("openInNewTab");
  return item.openInNewTab;
}

async function shouldShowContextMenu() {
  let item = await browser.storage.sync.get("showContextMenu");
  return 'showContextMenu' in item ? item.showContextMenu : true;
}

async function shouldSendCustomHeaders() {
  let item = await browser.storage.sync.get("sendCustomHeaders");
  return item.sendCustomHeaders ?? false;
}

async function customHeaders() {
  let item = await browser.storage.sync.get("customHeaders");
  return item.customHeaders ?? [];
}

async function getOneClickMode() {
  let item = await browser.storage.sync.get("oneClickMode");
  return item.oneClickMode ?? false;
}

async function shouldUseCookieAuth() {
  let item = await browser.storage.sync.get("useCookieAuth");
  return item.useCookieAuth ?? false;
}

async function updateBrowserActionPopup() {
  const oneClickMode = await getOneClickMode();

  if (oneClickMode) {
    browser.browserAction.setPopup({ popup: "" });
  } else {
    browser.browserAction.setPopup({ popup: "popup/popup.html" });
  }
}

async function getDefaultSendOptions() {
  return {
    quality: await getDefaultQuality(),
    format: await getDefaultFormat(),
    folder: await getDefaultFolder(),
    customNamePrefix: await getDefaultCustomNamePrefix(),
    autoStart: await getDefaultAutoStart()
  };
}

async function sendToMeTube(itemUrl, quality, format, folder, customNamePrefix, autoStart) {
  if (isRequestInProgress) {
    console.log("Request already in progress, ignoring duplicate request");
    return;
  }

  isRequestInProgress = true;

  try {
    itemUrl = itemUrl || await getCurrentUrl();
    console.log(`Send to MeTube. Url: ${itemUrl}, quality: ${quality}, format: ${format}, folder: ${folder}, customNamePrefix: ${customNamePrefix}, autoStart: ${autoStart}`);
    let meTubeUrl = await getMeTubeUrl();
    if (!meTubeUrl) {
      await showError('MeTube instance url not configured. Go to about:addons to configure.');
      return;
    }

    let url = new URL("add", meTubeUrl);

    const headers = {
      "Content-Type": "application/json"
    };

    const useCustomHeaders = await shouldSendCustomHeaders();
    if (useCustomHeaders) {
      const customHeadersList = await customHeaders();
      customHeadersList.forEach(header => {
        headers[header.name] = header.value;
      });
    }

    const useCookieAuth = await shouldUseCookieAuth();

    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        credentials: useCookieAuth ? "include" : "omit",
        headers: headers,
        body: JSON.stringify({
          "url": itemUrl,
          "quality": quality,
          "format": format,
          "folder": folder,
          "custom_name_prefix": customNamePrefix,
          "auto_start": autoStart
        })
      });

      if (response.ok) {
        await showSuccess();
        if (await shouldOpenInNewTab()) {
          await browser.tabs.create({ 'active': true, 'url': meTubeUrl });
        }
      } else {
        const contentType = response.headers.get('content-type');
        let errorMessage;

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage = await response.text();
        }

        if (errorMessage) {
          await showError(`MeTube error: ${errorMessage}`);
        } else {
          await showError(`MeTube error (HTTP ${response.status}): ${response.statusText}`);
        }
        console.error("Send to MeTube failed. MeTube url: " + url.toString() + ", itemUrl: " + itemUrl + ", status: " + response.status);
      }
    } catch (error) {
      // Check if it's a CORS/NetworkError - likely authentication required
      if (error.message.includes('NetworkError') || error.message.includes('CORS')) {
        const useCookieAuthEnabled = await shouldUseCookieAuth();
        if (!useCookieAuthEnabled) {
          await showError('Connection failed - your MeTube instance appears to require authentication. Please enable "Send cookies for authentication (SSO)" in extension settings (about:addons) and save.');
        } else {
          await showError('Authentication failed. Your MeTube instance is redirecting to authentication. This may mean: 1) You need to log in to your MeTube instance in a regular tab first, or 2) Firefox is isolating cookies. Try visiting your MeTube URL in a normal tab while logged in, then use the extension from that same tab.');
        }
      } else {
        await showError(`Network error: ${error.message}. Check that MeTube URL is correct: ${meTubeUrl}`);
      }
      console.error("Network error:", error);
    }
  } finally {
    isRequestInProgress = false;
  }
}

function triggerSendWithLoading(url) {
  setTimeout(async () => {
    try {
      await browser.runtime.sendMessage({ command: 'showLoading' });
    } catch (error) {
      console.error("Failed to send showLoading message:", error);
    }

    const options = await getDefaultSendOptions();
    await sendToMeTube(url, options.quality, options.format, options.folder,
                       options.customNamePrefix, options.autoStart);
  }, 100);
}

async function sendWithLoadingIndicator(url) {
  browser.browserAction.setPopup({ popup: "popup/popup.html" });
  browser.browserAction.openPopup();
  triggerSendWithLoading(url);
}

browser.menus.onClicked.addListener(async function(info, tab) {
  if (info.menuItemId === "send-to-metube" && info.linkUrl) {
    await sendWithLoadingIndicator(info.linkUrl);
  }
});

browser.runtime.onMessage.addListener(async (message) => {
  if (message.command === "sendToMeTube") {
    let url = message.url || await getCurrentUrl();
    let quality = message.quality || 'best';
    let format = message.format || 'any';
    let folder = message.folder || await getDefaultFolder();
    let customNamePrefix = message.customNamePrefix || await getDefaultCustomNamePrefix();
    let autoStart = message.autoStart || await getDefaultAutoStart();
    await sendToMeTube(url, quality, format, folder, customNamePrefix, autoStart);
  } else if (message.command === "settingsUpdated") {
    await updateBrowserActionPopup();
  }

});


updateBrowserActionPopup();

browser.commands.onCommand.addListener(async (command) => {
  if (command === "send-to-metube") {
    browser.browserAction.setPopup({ popup: "popup/popup.html" });
    browser.browserAction.openPopup();

    const url = await getCurrentUrl();
    triggerSendWithLoading(url);
  }
});

// Listen for storage changes to update browser action popup
browser.storage.onChanged.addListener(async (changes) => {
  if ('oneClickMode' in changes) {
    await updateBrowserActionPopup();
  }
});
