# Changelog

## v1.5.1

### Added

- Default sites to background check

## v1.5.0 (2024-11-08)

### Added

- Full popup UI:
  - List of all forbiden sites/domains
  - Can add and delete sites/domains from list

### Changed

- Move saved sites and domains from **/config/sites.json** to local storage
- Renamed from **Redirect Extension** to **Redirector**

### Removed

- **config** folder

## v1.4.2 (2024-07-06)

### Changed

- Refactored code in background.js
- Moved checking is in config file to a new function

### Fixed

- When on forbidden website and redirects back to another forbidden website, should redirect to about:blank instead

## v1.4.1 (2024-06-22)

### Added

- **.gitignore** file

### Removed

- **Release** folder

### Fixed

- Problem with redirection to sites from another tabs instead of about:blank [more info](#todo)

## v1.4 (2024-06-21)

### Added

- **CHANGELOG.md**
- popoup folder for popup that appears by clicking on extension
- added time support in sites list
- added domain name support in sites list
- added regex support in sites list
- **release-v1.4.zip**
- link to popup in **manifest.json**

### Changed

- moved site list to **config/sites.json**
- **README.md**
- description and version in **manifest.json**
- now redirects to previous tab or to about:blank if first tab

### TODO

- fix redirection: now if "blocked site" oppend in a new tab, we will be redireted to a previous visited site from another tab, but we shuuld be redirected to about:blank
