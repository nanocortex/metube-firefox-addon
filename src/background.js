function onMenuCreated() {
  if (browser.runtime.lastError) {
    console.log("error creating item:" + browser.runtime.lastError);
  }

  syncContextMenu();
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
    // If one-click mode is enabled, send to MeTube with default values
    const url = await getCurrentUrl();
    const quality = await getDefaultQuality();
    const format = await getDefaultFormat();
    const folder = await getDefaultFolder();
    const customNamePrefix = await getDefaultCustomNamePrefix();
    const autoStart = await getDefaultAutoStart();

    await sendToMeTube(url, quality, format, folder, customNamePrefix, autoStart);
  }

  // If one-click mode is disabled, the default popup will be shown automatically
});

browser.menus.create({
  id: "send-to-metube",
  title: "Send to MeTube",
  contexts: ["link"]
}, onMenuCreated);

async function showError(errorMessage) {
  console.error(`Error occured: ${errorMessage}`)
  await browser.runtime.sendMessage({ command: 'errorOccurred', errorMessage: errorMessage });
}

function showSuccess() {
  console.log(`Successfuly sent to MeTube`);
  browser.runtime.sendMessage({ command: 'success' }).then(function() {
  }, function(e) {
    console.error(`Error sending success message: ${e}`);
  });
}

async function getCurrentUrl() {
  let tabs = await browser.tabs.query({ currentWindow: true, active: true });
  return tabs[0].url;
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

async function getDefaultQuality() {
  let item = await browser.storage.sync.get("defaultQuality");
  return item.defaultQuality ?? 'best';
}

async function getDefaultFormat() {
  let item = await browser.storage.sync.get("defaultFormat");
  return item.defaultFormat ?? 'any';
}

async function getDefaultFolder() {
  let item = await browser.storage.sync.get("defaultFolder");
  return item.defaultFolder ?? '';
}

async function getDefaultCustomNamePrefix() {
  let item = await browser.storage.sync.get("customNamePrefix");
  return item.customNamePrefix ?? '';
}

async function getDefaultAutoStart() {
  let item = await browser.storage.sync.get("defaultAutoStart");
  return item.defaultAutoStart ?? true;
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

async function updateBrowserActionPopup() {
  const oneClickMode = await getOneClickMode();

  if (oneClickMode) {
    browser.browserAction.setPopup({ popup: "" });
  } else {
    browser.browserAction.setPopup({ popup: "popup/popup.html" });
  }
}

async function sendToMeTube(itemUrl, quality, format, folder, customNamePrefix, autoStart) {
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

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      credentials: "include", // This includes cookies from the browser
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
      showSuccess();
      if (await shouldOpenInNewTab()) {
        await browser.tabs.create({ 'active': true, 'url': meTubeUrl });
      }
    } else {
      const errorText = await response.text();
      await showError('Error occurred: ' + errorText);
      console.error("Send to MeTube failed. MeTube url: " + url.toString() + ", itemUrl: " + itemUrl + ", status: " + response.status);
    }
  } catch (error) {
    await showError(`Error occurred: ${error.message}. Check logs for more details. Instance url: ${meTubeUrl}`);
    console.error("Network error:", error);
  }
}

browser.menus.onClicked.addListener(async function(info, tab) {
  if (info.menuItemId == "send-to-metube") {
    if (info.linkUrl) {
      let quality = await getDefaultQuality();
      let format = await getDefaultFormat();
      let folder = await getDefaultFolder();
      let customNamePrefix = await getDefaultCustomNamePrefix();
      let autoStart = await getDefaultAutoStart();
      await sendToMeTube(info.linkUrl, quality, format, folder, customNamePrefix, autoStart);
    }
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

// Listen for storage changes to update browser action popup
browser.storage.onChanged.addListener(async (changes) => {
  if ('oneClickMode' in changes) {
    await updateBrowserActionPopup();
  }
});
