# npm 6

## `npm i`

installs everything from packagelock or package if not found

   --ignore-scripts disables running scripts like postinstall defined in the target package.json, download only


## `npm i pac`

installs pac at latest version according to package.json defined range or latest if it is not there yet and will be saved in package.json (and lock)

## `npm update`

updates all packages to versions according to package.json defined range. Will be saved in package.json lock only

## `npm i pac@latest`

forces update pac to latest version and will be saved in package.json (and lock)

## `npm outdated`

overview of outdated packages

## update npm or other global package to the latest version

`npm i npm@latest -g` or `npm i other@latest -g`

## `npm uninstall`

`npm uninstall pac` removes pac from node_modules and package.json and packagelock. Alternatively remove a package from package.json manually and `npm prune` to remove it from node_modules after.
