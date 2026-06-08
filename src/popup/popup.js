function showValidationError(message) {
  const urlValidationMessageEl = document.getElementById('urlValidationMessage');
  urlValidationMessageEl.innerText = message;
  urlValidationMessageEl.classList.remove('hidden');
}

function hideValidationError() {
  const urlValidationMessageEl = document.getElementById('urlValidationMessage');
  urlValidationMessageEl.classList.add('hidden');
}

document.getElementById("sendToMeTube").addEventListener("click", async function() {
  let url = document.getElementById('urlInput').value;

  if (!url || url.trim() === '') {
    showValidationError('Please enter a URL');
    return;
  }

  if (url.indexOf("://") === -1) {
    showValidationError('Invalid URL format');
    return;
  }

  hideValidationError();
  showLoadingState();

  let downloadType = document.getElementById('downloadType').value;
  let codec = document.getElementById('codec').value;
  let quality = document.getElementById('quality').value;
  let format = document.getElementById('format').value;
  let subtitleLanguage = document.getElementById('subtitleLanguage').value.trim() || 'en';
  let subtitleMode = document.getElementById('subtitleMode').value;
  let folder = document.getElementById('folder').value;
  let customNamePrefix = document.getElementById('customNamePrefix').value;
  let autoStart = document.getElementById('autoStart').checked;
  let strictPlaylistMode = document.getElementById('strictPlaylistMode').checked;
  await browser.runtime.sendMessage({
    command: 'sendToMeTube',
    url: url,
    downloadType: downloadType,
    codec: codec,
    quality: quality,
    format: format,
    subtitleLanguage: subtitleLanguage,
    subtitleMode: subtitleMode,
    folder: folder,
    customNamePrefix: customNamePrefix,
    autoStart: autoStart,
    strictPlaylistMode: strictPlaylistMode,
  });
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
  if (message.command === "showLoading") {
    showLoadingState();
    return;
  }

  hideLoadingState();

  if (message.command === "errorOccurred") {
    showError(message.errorMessage);
  } else if (message.command === "success") {
    showSuccess();
    setTimeout(function() {
      window.close();
    }, 1500);
  }
  else if (message.command === "history") {
    // TODO: display download history (maybe in some separate tab?)
    // let history = JSON.parse(message.data);
    // let historyContainer = document.getElementById('history');
    // historyContainer.innerHTML = '<ul></ul>';
    //
    // let ul = historyContainer.querySelector('ul');
    //
    // let doneItems = history.done;
    //
    // for (let i = 0; i < doneItems.length; i++) {
    //   let item = doneItems[i];
    //   let li = document.createElement('li');
    //   li.textContent = item.title;
    //   ul.appendChild(li);
    // }
    //
    // console.log(history);
  }
});

function getPopupSelects() {
  return {
    type: document.getElementById('downloadType'),
    codec: document.getElementById('codec'),
    format: document.getElementById('format'),
    quality: document.getElementById('quality'),
    subtitleLanguage: document.getElementById('subtitleLanguage'),
    subtitleMode: document.getElementById('subtitleMode'),
  };
}

addEventListener('DOMContentLoaded', async (event) => {
  let url = await getCurrentUrl();
  if (url && url.indexOf("://") === -1) url = "";
  document.getElementById('urlInput').value = url || "";

  const selects = getPopupSelects();
  const [defaultType, defaultCodec, defaultFormat, defaultQuality, defaultSubtitleLanguage, defaultSubtitleMode] = await Promise.all([
    getDefaultDownloadType(),
    getDefaultCodec(),
    getDefaultFormat(),
    getDefaultQuality(),
    getDefaultSubtitleLanguage(),
    getDefaultSubtitleMode(),
  ]);

  populateSelect(selects.type, DOWNLOAD_TYPES, defaultType);
  populateSelect(selects.codec, VIDEO_CODECS, defaultCodec);
  populateDatalist(document.getElementById('subtitleLanguageOptions'), SUBTITLE_LANGUAGES);
  selects.subtitleLanguage.value = defaultSubtitleLanguage;
  refreshDependentSelects(selects, {
    format: defaultFormat,
    quality: defaultQuality,
    subtitleMode: defaultSubtitleMode,
  });
  bindDependentSelects(selects);

  document.getElementById('folder').value = await getDefaultFolder() || "";
  document.getElementById('customNamePrefix').value = await getDefaultCustomNamePrefix() || "";
  document.getElementById('autoStart').checked = await getDefaultAutoStart() ?? true;
  document.getElementById('strictPlaylistMode').checked = await getDefaultStrictPlaylistMode() ?? false;
});

async function fetchHistory() {
  return await browser.runtime.sendMessage({ command: 'fetchHistory' });
}
