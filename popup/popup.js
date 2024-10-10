let sitesConfig = [];

let defaultSitesConfig = [
  { url: "m.youtube.com", time: "always" },
  { url: "youtube.com/shorts", time: "always" },
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
      symbolBefore.textContent = ">_";
      symbolBefore.className = "star-symbol";

      const domainText = document.createElement("span");
      domainText.textContent = site.domain;
      domainText.className = "domain-text";

      const symbolAfter = document.createElement("strong");
      symbolAfter.textContent = "_<";
      symbolAfter.className = "star-symbol";

      siteElement.appendChild(symbolBefore);
      siteElement.appendChild(domainText);
      siteElement.appendChild(symbolAfter);
    } else {
      siteElement.textContent = site.url;
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";

    const crossSymbol = document.createElement("span");
    crossSymbol.innerHTML = "&times;";
    deleteBtn.appendChild(crossSymbol);

    deleteBtn.addEventListener("click", () => deleteSite(index));

    listItem.appendChild(siteElement);
    listItem.appendChild(deleteBtn);

    siteList.appendChild(listItem);
  });
}

document.addEventListener("DOMContentLoaded", loadSites);

// Додаємо новий сайт до списку
async function addSite(url, time, isDomain) {
  const site = isDomain
    ? { domain: url, time: time }
    : { url: url, time: time };

  sitesConfig.push(site);
  await browser.storage.local.set({ sites: sitesConfig });

  // Оновлюємо відображення списку
  loadSites(); // Після додавання сайту, знову завантажуємо список
}

// Видаляємо сайт зі списку
async function deleteSite(index) {
  sitesConfig.splice(index, 1);
  await browser.storage.local.set({ sites: sitesConfig });
  loadSites();
}

// Обробка переходу між сторінками
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

// Зміна тексту етикетки та пояснення
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
  e.preventDefault(); // Зупиняємо стандартну поведінку
  const url = document.getElementById("new-url").value; // Отримуємо URL
  const time = document.getElementById("new-time").value; // Отримуємо діапазон часу
  const isDomain = document.getElementById("is-domain-checkbox").checked; // Перевіряємо чи це домен

  // Викликаємо функцію для додавання сайту
  addSite(url, time, isDomain);

  // Повертаємось на головну сторінку
  mainPage.style.display = "block";
  addSitePage.style.display = "none";

  // Очищаємо поля вводу
  addSiteForm.reset();
});
