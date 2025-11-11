async function getCurrentUrl() {
  let tabs = await browser.tabs.query({ currentWindow: true, active: true });
  return tabs[0].url;
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
  let item = await browser.storage.sync.get("defaultCustomNamePrefix");
  return item.defaultCustomNamePrefix ?? '';
}

async function getDefaultAutoStart() {
  let item = await browser.storage.sync.get("defaultAutoStart");
  return item.defaultAutoStart ?? true;
}

async function requestPermissionsForUrl(url, useCookieAuth) {
  try {
    const permissionRequest = {};

    if (useCookieAuth) {
      // For SSO, request <all_urls> to handle authentication redirects
      permissionRequest.origins = ["<all_urls>"];
      permissionRequest.permissions = ["cookies"];
    } else {
      // Without SSO, only request specific domain
      const urlObj = new URL(url);
      const origin = `${urlObj.protocol}//${urlObj.host}/*`;
      permissionRequest.origins = [origin];
    }

    return await browser.permissions.request(permissionRequest);
  } catch (error) {
    console.error("Error requesting permission:", error);
    return false;
  }
}
