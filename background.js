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

function redirect(tabId) {
  tab2 = tab1;

  if (isInConfig(tab2)) {
    tab2 = "about:config";
  }

  browser.tabs.update(tabId, {
    url: tab2,
  });
}

function isInConfig(tabURL) {
  if (!sitesConfig) return false;

  for (site of sitesConfig) {
    if (site.regex) {
      const regex = new RegExp(site.url);

      if (regex.test(tabURL) && isTimeInRange(site.time)) {
        return true;
      }
    } else if (site.domain) {
      const tabDomain = getDomainFromUrl(tabURL);
      const domainRegex = new RegExp(site.domain);

      if (domainRegex.test(tabDomain) && isTimeInRange(site.time)) {
        return true;
      }
    } else {
      if (
        isTimeInRange(site.time) &&
        (tabURL.startsWith(site.url) ||
          tabURL.startsWith("https://" + site.url) ||
          tabURL.startsWith("http://" + site.url) ||
          tabURL.startsWith("https://www." + site.url) ||
          tabURL.startsWith("http://www." + site.url))
      ) {
        return true;
      }
    }
  }
  return false;
}

function checkSiteURL(tab) {
  if (isInConfig(tab.url)) {
    redirect(tab.id);
  }
}

browser.tabs.onCreated.addListener(checkSiteURL);

browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    tab1 = tab2;
    tab2 = tab.url;

    if (curTabId != tabId) {
      tab1 = "about:blank";
    }
    curTabId = tabId;

    checkSiteURL(tab);
  }
});

loadConfig();
