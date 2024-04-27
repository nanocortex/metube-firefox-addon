function saveOptions(e) {
  e.preventDefault();
  
  let showContextMenu = document.querySelector("#showContextMenu").checked;
  
  browser.storage.sync.set({
    url: document.querySelector("#url").value,
    defaultQuality: document.querySelector("#defaultQuality").value,
    defaultFormat: document.querySelector("#defaultFormat").value,
    openInNewTab: document.querySelector("#openInNewTab").checked,
    showContextMenu,
    sendCustomHeaders: document.querySelector("#sendCustomHeaders").checked,
    customHeaders: Array.from(document.querySelectorAll('.header-pair')).map(el => ({ name: el.dataset.name, value: el.dataset.value })),
  });
  
  browser.menus.update("send-to-metube", {
    visible: showContextMenu,
  });
}

function restoreOptions() {
  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getUrl = browser.storage.sync.get("url");
  getUrl.then(function(result) {
    document.querySelector("#url").value = result.url || "";
  }, onError);

  let getDefaultQuality = browser.storage.sync.get("defaultQuality");
  getDefaultQuality.then(function(result) {
    document.querySelector("#defaultQuality").value = result.defaultQuality || "best";
  }, onError);

  let getDefaultFormat = browser.storage.sync.get("defaultFormat");
  getDefaultFormat.then(function(result) {
    document.querySelector("#defaultFormat").value = result.defaultFormat || "any";
  }, onError);

  let getOpenInNewTab = browser.storage.sync.get("openInNewTab");
  getOpenInNewTab.then(function(result) {
    document.querySelector("#openInNewTab").checked = result.openInNewTab || false;
  }, onError);
  
  let showContextMenu = browser.storage.sync.get("showContextMenu");
  showContextMenu.then(function(result) {
    document.querySelector("#showContextMenu").checked = result.showContextMenu || false;
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
  headersList.querySelector(`[data-name="${header.name}"]`)?.remove();
}

function addCustomHeader(header) {
  const headersList = document.getElementById('headersList');

  const listItem = document.createElement('li');
  listItem.classList.add('header-pair');
  listItem.dataset.name = header.name;
  listItem.dataset.value = header.value;
  listItem.innerHTML = `
    <code>${header.name}</code><code>${header.value}</code>
  `;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.setAttribute('aria-label', 'Remove custom header');
  removeBtn.innerText = '➖';
  removeBtn.addEventListener('click', () => removeCustomHeader(header));
  listItem.appendChild(removeBtn);

  headersList.appendChild(listItem);
}

document.addEventListener("DOMContentLoaded", setupCustomHeadersSection);
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
