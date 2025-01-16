document.getElementById("sendToMeTube").addEventListener("click", async function () {
    showLoadingState();

    let quality = document.getElementById('quality').value;
    let format = document.getElementById('format').value;
    let url = document.getElementById('urlInput').value;
    await browser.runtime.sendMessage({command: 'sendToMeTube', quality: quality, format: format, url: url});
});

function showError(errorMessage) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#success-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    document.querySelector("#error-content p").textContent = errorMessage;
    console.error(`Failed to execute MeTube script: ${errorMessage}`);
}

function showSuccess() {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.add("hidden");
    document.querySelector("#success-content").classList.remove("hidden");
}

function showLoadingState() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideLoadingState() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

browser.runtime.onMessage.addListener(async (message) => {
    hideLoadingState();

    if (message.command === "errorOccurred") {
        showError(message.errorMessage);
    } else if (message.command === "success") {
        showSuccess();
        setTimeout(function () {
            window.close();
        }, 1500);
    }
});


async function getCurrentUrl() {
    let tabs = await browser.tabs.query({currentWindow: true, active: true});
    return tabs[0].url;
}

async function getDefaultFormat() {
    let item = await browser.storage.sync.get("defaultFormat");
    return item.defaultFormat;
}

async function getDefaultQuality() {
    let item = await browser.storage.sync.get("defaultQuality");
    return item.defaultQuality;
}

async function getDefaultFolder() {
    let item = await browser.storage.sync.get("defaultFolder");
    return item.defaultFolder;
}

addEventListener('DOMContentLoaded', async (event) => {
    let url = await getCurrentUrl();
    if (url && url.indexOf("://") === -1) url = "";
    document.getElementById('urlInput').value = url || "";
    document.getElementById('format').value = await getDefaultFormat() || "any";
    document.getElementById('quality').value = await getDefaultQuality() || "best";
    document.getElementById('folder').value = await getDefaultFolder() || "";
});
