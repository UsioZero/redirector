let tab1 = "about:blank";
let tab2 = "about:blank";
let curTabId = -1;
let sitesConfig;

function isTimeInRange(time) {
  if (time == "always") return true;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  let [hour_from, min_from] = time.split("-")[0].split(":").map(Number);
  let [hour_to, min_to] = time.split("-")[1].split(":").map(Number);

  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const fromTimeInMinutes = hour_from * 60 + min_from;
  const toTimeInMinutes = hour_to * 60 + min_to;

  if (fromTimeInMinutes <= toTimeInMinutes) {
    // Time range is within the same day
    return (
      currentTimeInMinutes >= fromTimeInMinutes &&
      currentTimeInMinutes <= toTimeInMinutes
    );
  } else {
    // Time range spans across midnight
    return (
      currentTimeInMinutes >= fromTimeInMinutes ||
      currentTimeInMinutes <= toTimeInMinutes
    );
  }
}

async function loadConfig() {
  try {
    const response = await fetch(browser.runtime.getURL("config/sites.json"));
    sitesConfig = await response.json();
  } catch (error) {
    console.error("Error loading sites config:", error);
  }
}

function getDomainFromUrl(url) {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

function redirectOnYouTube(tab) {
  if (!sitesConfig) return;

  const tabDomain = getDomainFromUrl(tab.url);

  sitesConfig.forEach((site) => {
    if (site.regex) {
      const regex = new RegExp(site.url);
      if (regex.test(tab.url) && isTimeInRange(site.time)) {
        tab2 = tab1;
        browser.tabs.update(tab.id, { url: tab2 });
      }
    } else if (site.domain) {
      const domainRegex = new RegExp(site.domain);
      if (domainRegex.test(tabDomain) && isTimeInRange(site.time)) {
        tab2 = tab1;
        browser.tabs.update(tab.id, { url: tab2 });
      }
    } else {
      if (tab.url.startsWith(site.url) && isTimeInRange(site.time)) {
        tab2 = tab1;
        browser.tabs.update(tab.id, { url: tab2 });
      }
    }
  });
}

browser.tabs.onCreated.addListener(redirectOnYouTube);

browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    tab1 = tab2;
    tab2 = tab.url;

    if (curTabId != tabId) {
      tab1 = "about:blank";
    }
    curTabId = tabId;

    redirectOnYouTube(tab);
  }
});

loadConfig();
