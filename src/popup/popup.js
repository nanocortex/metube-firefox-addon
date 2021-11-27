document.getElementById("sendToMeTube").addEventListener("click", async function () {
    let quality = document.getElementById('quality').value;
    let format = document.getElementById('format').value;
    await browser.runtime.sendMessage({command: 'sendToMeTube', quality: quality, format: format});
});

function showError(errorMessage) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#success-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    document.querySelector("#error-content p").innerHTML = errorMessage;
    console.error(`Failed to execute MeTube script: ${errorMessage}`);
}

function showSuccess() {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.add("hidden");
    document.querySelector("#success-content").classList.remove("hidden");
}

browser.runtime.onMessage.addListener(async (message) => {
    if (message.command === "errorOccurred") {
        showError(message.errorMessage);
    } else if (message.command === "success") {
        showSuccess();
        setTimeout(function () {
            window.close();
        }, 1500);
    }
});
