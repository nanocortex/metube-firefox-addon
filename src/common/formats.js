// Shared format/codec/quality definitions mirroring MeTube's UI options.
// Source: https://github.com/alexta69/metube/blob/master/ui/src/app/interfaces/formats.ts
// Keep in sync when MeTube changes its options.

const DOWNLOAD_TYPES = [
  { id: "video", text: "Video" },
  { id: "audio", text: "Audio" },
  { id: "captions", text: "Captions" },
  { id: "thumbnail", text: "Thumbnail" },
];

const VIDEO_CODECS = [
  { id: "auto", text: "Auto" },
  { id: "h264", text: "H.264" },
  { id: "h265", text: "H.265 (HEVC)" },
  { id: "av1", text: "AV1" },
  { id: "vp9", text: "VP9" },
];

const VIDEO_FORMATS = [
  { id: "any", text: "Auto" },
  { id: "mp4", text: "MP4" },
  { id: "ios", text: "iOS Compatible" },
];

const VIDEO_QUALITIES = [
  { id: "best", text: "Best" },
  { id: "2160", text: "2160p" },
  { id: "1440", text: "1440p" },
  { id: "1080", text: "1080p" },
  { id: "720", text: "720p" },
  { id: "480", text: "480p" },
  { id: "360", text: "360p" },
  { id: "240", text: "240p" },
  { id: "worst", text: "Worst" },
];

const AUDIO_FORMATS = [
  {
    id: "m4a",
    text: "M4A",
    qualities: [
      { id: "best", text: "Best" },
      { id: "192", text: "192 kbps" },
      { id: "128", text: "128 kbps" },
    ],
  },
  {
    id: "mp3",
    text: "MP3",
    qualities: [
      { id: "best", text: "Best" },
      { id: "320", text: "320 kbps" },
      { id: "192", text: "192 kbps" },
      { id: "128", text: "128 kbps" },
    ],
  },
  { id: "opus", text: "OPUS", qualities: [{ id: "best", text: "Best" }] },
  { id: "wav", text: "WAV", qualities: [{ id: "best", text: "Best" }] },
  { id: "flac", text: "FLAC", qualities: [{ id: "best", text: "Best" }] },
];

const CAPTION_FORMATS = [
  { id: "srt", text: "SRT" },
  { id: "txt", text: "TXT (Text only)" },
  { id: "vtt", text: "VTT" },
  { id: "ttml", text: "TTML" },
];

const THUMBNAIL_FORMATS = [{ id: "jpg", text: "JPG" }];

const SUBTITLE_MODES = [
  { id: "prefer_manual", text: "Prefer manual" },
  { id: "manual_only", text: "Manual only" },
  { id: "auto_only", text: "Auto only" },
  { id: "prefer_auto", text: "Prefer auto" },
];

const SUBTITLE_LANGUAGES = [
  { id: "en", text: "English" },
  { id: "ar", text: "Arabic" },
  { id: "bn", text: "Bengali" },
  { id: "bg", text: "Bulgarian" },
  { id: "ca", text: "Catalan" },
  { id: "cs", text: "Czech" },
  { id: "da", text: "Danish" },
  { id: "nl", text: "Dutch" },
  { id: "et", text: "Estonian" },
  { id: "fi", text: "Finnish" },
  { id: "fr", text: "French" },
  { id: "de", text: "German" },
  { id: "el", text: "Greek" },
  { id: "he", text: "Hebrew" },
  { id: "hi", text: "Hindi" },
  { id: "hu", text: "Hungarian" },
  { id: "id", text: "Indonesian" },
  { id: "it", text: "Italian" },
  { id: "ja", text: "Japanese" },
  { id: "ko", text: "Korean" },
  { id: "lv", text: "Latvian" },
  { id: "lt", text: "Lithuanian" },
  { id: "ms", text: "Malay" },
  { id: "no", text: "Norwegian" },
  { id: "pl", text: "Polish" },
  { id: "pt", text: "Portuguese" },
  { id: "pt-BR", text: "Portuguese (Brazil)" },
  { id: "ro", text: "Romanian" },
  { id: "ru", text: "Russian" },
  { id: "sr", text: "Serbian" },
  { id: "sk", text: "Slovak" },
  { id: "sl", text: "Slovenian" },
  { id: "es", text: "Spanish" },
  { id: "sv", text: "Swedish" },
  { id: "ta", text: "Tamil" },
  { id: "te", text: "Telugu" },
  { id: "th", text: "Thai" },
  { id: "tr", text: "Turkish" },
  { id: "uk", text: "Ukrainian" },
  { id: "ur", text: "Urdu" },
  { id: "vi", text: "Vietnamese" },
  { id: "zh-Hans", text: "Chinese (Simplified)" },
  { id: "zh-Hant", text: "Chinese (Traditional)" },
];

function populateDatalist(datalistEl, options) {
  if (!datalistEl) return;
  datalistEl.innerHTML = "";
  for (const opt of options) {
    const optionEl = document.createElement("option");
    optionEl.value = opt.id;
    optionEl.textContent = opt.text;
    datalistEl.appendChild(optionEl);
  }
}

const FIELD_VISIBILITY = {
  video:     { codec: true,  format: true,  quality: true,  subtitleLanguage: false, subtitleMode: false },
  audio:     { codec: false, format: true,  quality: true,  subtitleLanguage: false, subtitleMode: false },
  captions:  { codec: false, format: true,  quality: false, subtitleLanguage: true,  subtitleMode: true  },
  thumbnail: { codec: false, format: true,  quality: false, subtitleLanguage: false, subtitleMode: false },
};

function visibleFieldsForType(downloadType) {
  return FIELD_VISIBILITY[downloadType] ?? FIELD_VISIBILITY.video;
}

function populateSelect(selectEl, options, preferredValue) {
  if (!selectEl) return;
  const previous = preferredValue ?? selectEl.value;
  selectEl.innerHTML = "";
  for (const opt of options) {
    const optionEl = document.createElement("option");
    optionEl.value = opt.id;
    optionEl.textContent = opt.text;
    selectEl.appendChild(optionEl);
  }
  const hasPrevious = options.some((o) => o.id === previous);
  selectEl.value = hasPrevious ? previous : options[0].id;
}

function formatsForType(downloadType) {
  switch (downloadType) {
    case "audio":
      return AUDIO_FORMATS.map(({ id, text }) => ({ id, text }));
    case "captions":
      return CAPTION_FORMATS;
    case "thumbnail":
      return THUMBNAIL_FORMATS;
    case "video":
    default:
      return VIDEO_FORMATS;
  }
}

function qualitiesForTypeAndFormat(downloadType, format) {
  if (downloadType === "audio") {
    const audioFormat = AUDIO_FORMATS.find((f) => f.id === format);
    return audioFormat ? audioFormat.qualities : [{ id: "best", text: "Best" }];
  }
  if (downloadType === "captions" || downloadType === "thumbnail") {
    return [{ id: "best", text: "Best" }];
  }
  return VIDEO_QUALITIES;
}

function setContainerVisibility(el, visible) {
  if (!el) return;
  const container = el.closest('[data-field-container]') ?? el;
  container.classList.toggle('hidden', !visible);
}

function hideEmptyOptionRows(rootEl = document) {
  rootEl.querySelectorAll('.options-row').forEach((row) => {
    const cols = row.querySelectorAll('[data-field-container]');
    if (cols.length === 0) return;
    const allHidden = [...cols].every((col) => col.classList.contains('hidden'));
    row.classList.toggle('hidden', allHidden);
  });
}

function rememberSelection(type, format, quality) {
  const downloadType = type.value;
  type.dataset[`fmt_${downloadType}`] = format.value;
  type.dataset[`qty_${downloadType}_${format.value}`] = quality.value;
}

function recallFormat(type, preferred) {
  return preferred ?? type.dataset[`fmt_${type.value}`];
}

function recallQuality(type, format, preferred) {
  return preferred ?? type.dataset[`qty_${type.value}_${format.value}`];
}

function refreshDependentSelects(selects, preferred = {}) {
  const { type, codec, format, quality, subtitleMode } = selects;
  const downloadType = type.value;
  const visibility = visibleFieldsForType(downloadType);

  populateSelect(format, formatsForType(downloadType), recallFormat(type, preferred.format));
  populateSelect(
    quality,
    qualitiesForTypeAndFormat(downloadType, format.value),
    recallQuality(type, format, preferred.quality)
  );
  if (subtitleMode) {
    populateSelect(subtitleMode, SUBTITLE_MODES, preferred.subtitleMode);
  }

  setContainerVisibility(codec, visibility.codec);
  setContainerVisibility(quality, visibility.quality);
  setContainerVisibility(selects.subtitleLanguage, visibility.subtitleLanguage);
  setContainerVisibility(subtitleMode, visibility.subtitleMode);

  format.disabled = downloadType === 'thumbnail';

  hideEmptyOptionRows();
  rememberSelection(type, format, quality);
}

function bindDependentSelects(selects) {
  const { type, format, quality } = selects;
  type.addEventListener("change", () => refreshDependentSelects(selects));
  format.addEventListener("change", () => {
    populateSelect(
      quality,
      qualitiesForTypeAndFormat(type.value, format.value),
      type.dataset[`qty_${type.value}_${format.value}`]
    );
    rememberSelection(type, format, quality);
  });
  quality.addEventListener("change", () => {
    rememberSelection(type, format, quality);
  });
}
