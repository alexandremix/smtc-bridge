const widgetContainer = document.getElementById('widgetContainer');

const currentURL = window.location.href;
let baseURL = currentURL;

if (baseURL.endsWith("index.html"))
    baseURL = baseURL.replace("index.html", "");
if (!baseURL.endsWith("/"))
    baseURL += "/";

const settingsPageURL = new URL("../.common/core/settings-core/", baseURL).href;
const settingsJSON = "?settingsJson=" + baseURL + "settings.json";
const widgetURL = "&widgetURL=" + baseURL.replace(/\/settings\/?$/, "/");
const usesStreamerBot = "&usesStreamerBot=false";

console.debug("Window Ref: " + window.location.href);
console.debug("Base URL: " + baseURL);
console.debug("Settings JSON: " + settingsJSON);
console.debug("Widget URL: " + widgetURL);
console.debug("Uses Streamer Bot: " + usesStreamerBot);

widgetContainer.src = settingsPageURL + settingsJSON + widgetURL + usesStreamerBot;