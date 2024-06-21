# Changelog

## v1.4 (2024-06-21)

### Added

- _CHANGELOG.md_
- popoup folder for popup that appears by clicking on extension
- added time support in sites list
- added domain name support in sites list
- added regex support in sites list
- _release-v1.4.zip_
- link to popup in _manifest.json_

### Changed

- moved site list to _config/sites.json_
- _README.md_
- description and version in manifest.json
- now redirects to previous tab or to about:blank if first tab

### TODO

- fix redirection: now if "blocked site" oppend in a new tab, we will be redireted to a previous visited site from another tab, but we shuuld be redirected to about:blank
