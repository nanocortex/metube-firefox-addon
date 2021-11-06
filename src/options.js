function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    url: document.querySelector("#url").value,
    openInNewTab: document.querySelector("#openInNewTab").checked,
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

  let getOpenInNewTab = browser.storage.sync.get("openInNewTab");
  getOpenInNewTab.then(function(result) {
    document.querySelector("#openInNewTab").checked = result.openInNewTab || false;
  }, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

