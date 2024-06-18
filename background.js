function redirectOnYouTube(tab) {
  if (
    tab.url.startsWith("https://www.youtube.com" || "https://m.youtube.com")
  ) {
    browser.tabs.update(tab.id, { url: "about:blank" });
  }
}

browser.tabs.onCreated.addListener(redirectOnYouTube);

browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    redirectOnYouTube(tab);
  }
});
