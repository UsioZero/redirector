let sitesConfig = [];

let defaultSitesConfig = [
  { url: "m.youtube.com", time: "always" },
  { url: "youtube.com/shortsdddddddddddddddddddddddd", time: "always" },
  { url: "youtube.com", time: "22:30-05:00" },
  { domain: "porn", time: "always" },
  { domain: "hentai", time: "always" },
];

async function loadSites() {
  let result = await browser.storage.local.get("sites");
  sitesConfig = result.sites || [];

  if (sitesConfig.length === 0) {
    sitesConfig = defaultSitesConfig;
    await browser.storage.local.set({ sites: sitesConfig });
  }

  const siteList = document.getElementById("site-list");
  siteList.innerHTML = "";

  sitesConfig.forEach((site, index) => {
    const listItem = document.createElement("li");
    listItem.className = "site-item";

    const siteElement = document.createElement("div");
    siteElement.className = "site-name-container";

    if (site.domain) {
      const symbolBefore = document.createElement("strong");
      symbolBefore.textContent = ">";
      symbolBefore.className = "domain-symbol";

      const domainText = document.createElement("span");
      domainText.textContent = site.domain.substring(0, 27);
      domainText.className = "domain-text";

      siteElement.appendChild(symbolBefore);
      siteElement.appendChild(domainText);
    } else {
      const symbolBefore = document.createElement("strong");
      symbolBefore.textContent = ">";
      symbolBefore.className = "url-symbol";

      const urlText = document.createElement("span");
      urlText.textContent =
        site.url.length > 24 ? site.url.substring(0, 24) + "..." : site.url;
      urlText.className = "domain-text";

      siteElement.appendChild(symbolBefore);
      siteElement.appendChild(urlText);
    }

    // Кнопка видалення
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";

    const crossSymbol = document.createElement("span");
    crossSymbol.innerHTML = "&times;";
    deleteBtn.appendChild(crossSymbol);

    // Додаємо подію для відкриття поля зміни часу
    siteElement.addEventListener("click", () =>
      editSiteTime(listItem, site, index)
    );

    // Додаємо подію для видалення
    deleteBtn.addEventListener("click", () => deleteSite(index));

    listItem.appendChild(siteElement);
    listItem.appendChild(deleteBtn);
    siteList.appendChild(listItem);
  });
}

function editSiteTime(listItem, site, index) {
  listItem.innerHTML = "";

  const timeInput = document.createElement("input");
  timeInput.type = "text";
  timeInput.placeholder = "Enter new time";
  timeInput.value = site.time;
  timeInput.className = "time-input";

  const submitBtn = document.createElement("button");
  submitBtn.className = "submit-btn";
  submitBtn.innerHTML = "&#10003;";

  submitBtn.addEventListener("click", async () => {
    const newTime = timeInput.value.trim();
    if (newTime) {
      site.time = newTime;
      sitesConfig[index] = site;
      await browser.storage.local.set({ sites: sitesConfig });
      loadSites();
    }
  });

  // Додаємо елементи в listItem
  listItem.appendChild(timeInput);
  listItem.appendChild(submitBtn);
}

async function addSite(url, time, isDomain) {
  const site = isDomain
    ? { domain: url, time: time }
    : { url: url, time: time };

  sitesConfig.push(site);
  await browser.storage.local.set({ sites: sitesConfig });

  // Оновлюємо відображення списку
  loadSites(); // Після додавання сайту, знову завантажуємо список
}

async function deleteSite(index) {
  sitesConfig.splice(index, 1);
  await browser.storage.local.set({ sites: sitesConfig });
  loadSites();
}

const addSiteBtn = document.getElementById("add-site-btn");
const backBtn = document.getElementById("back-btn");
const mainPage = document.getElementById("main-page");
const addSitePage = document.getElementById("add-site-page");

addSiteBtn.addEventListener("click", () => {
  mainPage.style.display = "none";
  addSitePage.style.display = "block";
});

backBtn.addEventListener("click", () => {
  mainPage.style.display = "block";
  addSitePage.style.display = "none";
});

const checkbox = document.getElementById("is-domain-checkbox");
const urlLabel = document.getElementById("url-label");
const urlInput = document.getElementById("new-url");
const timeLabel = document.getElementById("time-label");
const timeInput = document.getElementById("new-time");

checkbox.addEventListener("change", function () {
  if (this.checked) {
    urlLabel.textContent = "Domain:";
    urlInput.placeholder = "*exm*: all domains, subdomains with *exm*";
  } else {
    urlLabel.textContent = "URL:";
    urlInput.placeholder = "https://example.com";
  }
});

const addSiteForm = document.getElementById("add-site-form");
addSiteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = document.getElementById("new-url").value;
  const time = document.getElementById("new-time").value;
  const isDomain = document.getElementById("is-domain-checkbox").checked;

  addSite(url, time, isDomain);

  mainPage.style.display = "block";
  addSitePage.style.display = "none";

  addSiteForm.reset();
});

document.addEventListener("DOMContentLoaded", loadSites);
