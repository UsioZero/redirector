function isTimeInRange() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return (
    (currentHour === 23 && currentMinute >= 59) ||
    (currentHour >= 0 && currentHour < 5)
  );
}

function redirectOnYouTube(tab) {
  if (
    (tab.url.startsWith("https://www.youtube.com") && isTimeInRange()) ||
    tab.url.startsWith("https://www.youtube.com/shorts") ||
    tab.url.startsWith("https://m.youtube.com")
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
