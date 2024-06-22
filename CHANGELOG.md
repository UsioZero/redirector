# Changelog

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
