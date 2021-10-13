browser.menus.create({
  id: "send-to-metube",
  title: "Send to MeTube",
  contexts: ["link"]
});

async function getCurrentUrl(){
  let tabs = await browser.tabs.query({currentWindow: true, active: true});
  return tabs[0].url;
}

async function getMeTubeUrl() {
  let item = await browser.storage.sync.get("url");
  return item.url;
}

async function sendToMeTube(itemUrl) {
  itemUrl = itemUrl || await getCurrentUrl();
  let meTubeUrl = await getMeTubeUrl();
  let url = new URL("add", meTubeUrl);
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url.toString());
  xhr.send(JSON.stringify({ "url" : itemUrl, "quality" : "best" }));
  xhr.onload = async function() {
    if (xhr.status == 200) { 
      await browser.tabs.create({ 'active': true, 'url': meTubeUrl });
    } else {
      console.error("Send to MeTube failed. MeTube url: " + url.toString() + ", itemUrl: " + itemUrl);
    }
  }
}

browser.browserAction.onClicked.addListener(async () => await sendToMeTube());

browser.menus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId == "send-to-metube") {
    if (info.linkUrl) {
        await sendToMeTube(info.linkUrl, tab);
    }
  }
});
