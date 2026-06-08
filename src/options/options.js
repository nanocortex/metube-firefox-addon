let connectionTested = false;

async function saveOptions(e) {
  e.preventDefault();

  let showContextMenu = document.querySelector("#showContextMenu").checked;
  let showPageContextMenu = document.querySelector("#showPageContextMenu").checked;
  let url = document.querySelector("#url").value.trim();
  let urlValidationMessageEl = document.getElementById("urlValidationMessage");

  if (!url) {
    urlValidationMessageEl.innerText = 'MeTube URL is required';
    return;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    urlValidationMessageEl.innerText = 'URL must start with http:// or https://';
    return;
  }

  try {
    new URL(url);
  } catch (error) {
    urlValidationMessageEl.innerText = 'Invalid URL format';
    return;
  }
  urlValidationMessageEl.innerText = '';

  let useCookieAuth = document.querySelector("#useCookieAuth").checked;

  const granted = await requestPermissionsForUrl(url, useCookieAuth);
  if (!granted) {
    urlValidationMessageEl.innerText = useCookieAuth
      ? 'Permission denied. Cannot enable SSO without permissions.'
      : 'Permission denied. The extension needs access to your MeTube instance to send requests.';
    return;
  }

  browser.storage.sync.set({
    url: url,
    defaultDownloadType: document.querySelector("#defaultDownloadType").value,
    defaultCodec: document.querySelector("#defaultCodec").value,
    defaultFormat: document.querySelector("#defaultFormat").value,
    defaultQuality: document.querySelector("#defaultQuality").value,
    defaultSubtitleLanguage: document.querySelector("#defaultSubtitleLanguage").value.trim() || 'en',
    defaultSubtitleMode: document.querySelector("#defaultSubtitleMode").value,
    openInNewTab: document.querySelector("#openInNewTab").checked,
    showContextMenu,
    showPageContextMenu,
    useCookieAuth: document.querySelector("#useCookieAuth").checked,
    sendCustomHeaders: document.querySelector("#sendCustomHeaders").checked,
    customHeaders: Array.from(document.querySelectorAll('.header-pair')).map(el => ({ name: el.dataset.name, value: el.dataset.value })),
    defaultFolder: document.querySelector("#defaultFolder").value,
    defaultCustomNamePrefix: document.querySelector("#defaultCustomNamePrefix").value,
    defaultAutoStart: document.querySelector("#defaultAutoStart").checked,
    oneClickMode: document.querySelector("#oneClickMode").checked,
    strictPlaylistMode: document.querySelector("#strictPlaylistMode").checked,
  });

  browser.menus.update("send-to-metube", {
    visible: showContextMenu,
  });

  browser.menus.update("send-to-metube-page", {
    visible: showPageContextMenu,
  });

  browser.runtime.sendMessage({ command: 'settingsUpdated' });

  const saveSuccessMessageEl = document.getElementById("saveSuccessMessage");
  saveSuccessMessageEl.innerText = '✓ Settings saved!';
  saveSuccessMessageEl.className = 'text-success';
  saveSuccessMessageEl.classList.remove("hidden");

  setTimeout(() => {
    saveSuccessMessageEl.classList.add("hidden");
  }, 3000);
}

function restoreOptions() {
  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getUrl = browser.storage.sync.get("url");
  getUrl.then(function(result) {
    document.querySelector("#url").value = result.url || "";
  }, onError);

  restoreDownloadOptions().catch(onError);

  let getOpenInNewTab = browser.storage.sync.get("openInNewTab");
  getOpenInNewTab.then(function(result) {
    document.querySelector("#openInNewTab").checked = result.openInNewTab || false;
  }, onError);

  let showContextMenu = browser.storage.sync.get("showContextMenu");
  showContextMenu.then(function(result) {
    document.querySelector("#showContextMenu").checked = result.showContextMenu ?? true;
  }, onError);

  let showPageContextMenu = browser.storage.sync.get("showPageContextMenu");
  showPageContextMenu.then(function(result) {
    document.querySelector("#showPageContextMenu").checked = result.showPageContextMenu ?? true;
  }, onError);

  let sendCustomHeaders = browser.storage.sync.get("sendCustomHeaders");
  sendCustomHeaders.then(function(result) {
    document.querySelector("#sendCustomHeaders").checked = result.sendCustomHeaders;
    result.sendCustomHeaders ? showCustomHeadersSection() : hideCustomHeadersSection();
  });

  let customHeaders = browser.storage.sync.get("customHeaders");
  customHeaders.then(function(result) {
    result.customHeaders?.forEach(header => addCustomHeader(header));
  }, onError);

  let getDefaultFolder = browser.storage.sync.get("defaultFolder");
  getDefaultFolder.then(function(result) {
    document.querySelector("#defaultFolder").value = result.defaultFolder || "";
  }, onError);

  let getDefaultCustomNamePrefix = browser.storage.sync.get("defaultCustomNamePrefix");
  getDefaultCustomNamePrefix.then(function(result) {
    document.querySelector("#defaultCustomNamePrefix").value = result.defaultCustomNamePrefix || "";
  }, onError);

  let getDefaultAutoStart = browser.storage.sync.get("defaultAutoStart");
  getDefaultAutoStart.then(function(result) {
    document.querySelector("#defaultAutoStart").checked = result.defaultAutoStart ?? true;
  }, onError);

  let getOneClickMode = browser.storage.sync.get("oneClickMode");
  getOneClickMode.then(function(result) {
    document.querySelector("#oneClickMode").checked = result.oneClickMode || false;
  }, onError);

  let getStrictPlaylistMode = browser.storage.sync.get("strictPlaylistMode");
  getStrictPlaylistMode.then(function(result) {
    document.querySelector("#strictPlaylistMode").checked = result.strictPlaylistMode || false;
  }, onError);

  let getUseCookieAuth = browser.storage.sync.get("useCookieAuth");
  getUseCookieAuth.then(function(result) {
    const useCookieAuth = result.useCookieAuth || false;
    document.querySelector("#useCookieAuth").checked = useCookieAuth;
    // Show warning if SSO is already enabled
    if (useCookieAuth) {
      document.getElementById("ssoWarning").classList.remove("hidden");
    }
  }, onError);
}

function getDownloadOptionSelects() {
  return {
    type: document.querySelector("#defaultDownloadType"),
    codec: document.querySelector("#defaultCodec"),
    format: document.querySelector("#defaultFormat"),
    quality: document.querySelector("#defaultQuality"),
    subtitleLanguage: document.querySelector("#defaultSubtitleLanguage"),
    subtitleMode: document.querySelector("#defaultSubtitleMode"),
  };
}

function setupDownloadOptionSelects() {
  const selects = getDownloadOptionSelects();
  populateSelect(selects.type, DOWNLOAD_TYPES);
  populateSelect(selects.codec, VIDEO_CODECS);
  populateSelect(selects.subtitleMode, SUBTITLE_MODES);
  populateDatalist(document.getElementById('subtitleLanguageOptions'), SUBTITLE_LANGUAGES);
  refreshDependentSelects(selects);
  bindDependentSelects(selects);
}

function migrateLegacyDefaults(stored) {
  const type = stored.defaultDownloadType;
  let format = stored.defaultFormat;
  let quality = stored.defaultQuality;

  if (type) {
    return { type, codec: stored.defaultCodec ?? 'auto', format: format ?? 'any', quality: quality ?? 'best' };
  }

  const AUDIO_FORMAT_IDS = AUDIO_FORMATS.map((f) => f.id);
  let migratedType = 'video';

  if (quality === 'audio' || AUDIO_FORMAT_IDS.includes(format)) {
    migratedType = 'audio';
    if (quality === 'audio') quality = 'best';
    if (!AUDIO_FORMAT_IDS.includes(format)) format = 'm4a';
  } else if (format === 'thumbnail') {
    migratedType = 'thumbnail';
    format = 'jpg';
    quality = 'best';
  }

  return {
    type: migratedType,
    codec: 'auto',
    format: format ?? (migratedType === 'video' ? 'any' : undefined),
    quality: quality ?? 'best',
  };
}

async function restoreDownloadOptions() {
  const stored = await browser.storage.sync.get([
    "defaultDownloadType",
    "defaultCodec",
    "defaultFormat",
    "defaultQuality",
    "defaultSubtitleLanguage",
    "defaultSubtitleMode",
  ]);

  const resolved = migrateLegacyDefaults(stored);
  const selects = getDownloadOptionSelects();

  populateSelect(selects.type, DOWNLOAD_TYPES, resolved.type);
  populateSelect(selects.codec, VIDEO_CODECS, resolved.codec);
  selects.subtitleLanguage.value = stored.defaultSubtitleLanguage ?? 'en';
  refreshDependentSelects(selects, {
    format: resolved.format,
    quality: resolved.quality,
    subtitleMode: stored.defaultSubtitleMode ?? 'prefer_manual',
  });
}

function showCustomHeadersSection() {
  document.getElementById("customHeadersSection")?.classList.remove("hidden");
}

function hideCustomHeadersSection() {
  document.getElementById("customHeadersSection")?.classList.add("hidden");
}

function setupCustomHeadersSection() {
  const headerNameInput = document.getElementById("headerNameInput");
  const headerValueInput = document.getElementById("headerValueInput");
  const addHeaderButton = document.getElementById("addHeaderButton");
  const headerValidationMessageEl = document.getElementById("headerValidationMessage");

  document.getElementById("sendCustomHeaders").addEventListener("change", (event) => {
    event.target.checked ? showCustomHeadersSection() : hideCustomHeadersSection();
  });

  addHeaderButton.addEventListener("click", () => {
    const name = headerNameInput.value;
    const value = headerValueInput.value;

    let validationError = '';
    if (!name || !value) {
      validationError = 'Enter a header name and value';
    }

    headerValidationMessageEl.innerText = validationError;
    if (validationError) {
      return;
    }

    addCustomHeader({ name, value });

    headerNameInput.value = '';
    headerValueInput.value = '';
  });
}

function removeCustomHeader(header) {
  const headersList = document.getElementById('headersList');
  headersList.querySelector(`[data-name="${header.name}"]`)?.remove();
}

function addCustomHeader(header) {
  const headersList = document.getElementById('headersList');

  const listItem = document.createElement('li');
  listItem.classList.add('header-pair');
  listItem.dataset.name = header.name;
  listItem.dataset.value = header.value;

  const codeName = document.createElement('code');
  const codeValue = document.createElement('code');
  codeName.textContent = header.name;
  codeValue.textContent = header.value;

  listItem.append(codeName, codeValue);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.setAttribute('aria-label', 'Remove custom header');
  removeBtn.innerText = '➖';
  removeBtn.addEventListener('click', () => removeCustomHeader(header));
  listItem.appendChild(removeBtn);

  headersList.appendChild(listItem);
}

document.addEventListener("DOMContentLoaded", setupDownloadOptionSelects);
document.addEventListener("DOMContentLoaded", setupCustomHeadersSection);
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

document.getElementById("url").addEventListener("input", () => {
  connectionTested = false;
  document.getElementById("testConnectionMessage").innerText = '';
});

// Show/hide SSO warning
document.getElementById("useCookieAuth").addEventListener("change", (event) => {
  const ssoWarning = document.getElementById("ssoWarning");
  if (event.target.checked) {
    ssoWarning.classList.remove("hidden");
  } else {
    ssoWarning.classList.add("hidden");
  }
});
