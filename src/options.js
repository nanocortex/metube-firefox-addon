function saveOptions(e) {
  e.preventDefault();
  
  let showContextMenu = document.querySelector("#showContextMenu").checked;
  
  browser.storage.sync.set({
    url: document.querySelector("#url").value,
    defaultQuality: document.querySelector("#defaultQuality").value,
    defaultFormat: document.querySelector("#defaultFormat").value,
    defaultAutoStart: document.querySelector("#defaultAutoStart").value,
    openInNewTab: document.querySelector("#openInNewTab").checked,
    showContextMenu,
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

  let getDefaultAutoStart = browser.storage.sync.get("defaultAutoStart");
  getDefaultAutoStart.then(function(result) {
    document.querySelector("#defaultAutoStart").value = result.defaultAutoStart || "false";
  }, onError);

  let getOpenInNewTab = browser.storage.sync.get("openInNewTab");
  getOpenInNewTab.then(function(result) {
    document.querySelector("#openInNewTab").checked = result.openInNewTab || false;
  }, onError);
  
  let showContextMenu = browser.storage.sync.get("showContextMenu");
  showContextMenu.then(function(result) {
    document.querySelector("#showContextMenu").checked = result.showContextMenu || false;
  }, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

