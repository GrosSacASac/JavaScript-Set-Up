# npm 6

latest is the default tag for the latest version of a package on npm.

## `npm i`

installs everything from package-lock or package if not found, package.json has priority if in conflict with lock file (in that case package-lock will be updated as well)

   --ignore-scripts disables running scripts like postinstall defined in the target package.json, download only
   
   -D as devDependency
   
   -g run command globally


## `npm i pac`

installs or updates"pac" at highest compatible version according to package.json defined range or latest if it is not there yet and will be saved in package.json package-lock

## `npm update pac`

updates "pac" at highest compatible version according to package.json defined range, will be saved in package.json package-lock

## `npm update`

Avoid using it, prefer updating 1 by 1 for stability.
updates all packages to versions according to package.json defined range. Will be saved in package.json and package-lock

## `npm i pac@latest`

forces install or update "pac" to latest version and will be saved in package.json and package-lock. Some package have custom tags as well like `@preview` or `@next` for example

## `npm outdated`

overview of outdated packages

## `npm view pac`

Get an overwiew of the package "pac", latest versions, published dates, tags, etc

## update npm or other global package to the latest version

`npm i npm@latest -g` or `npm i other@latest -g`

## `npm uninstall`

`npm uninstall pac` removes pac from node_modules and package.json and packagelock. Alternatively remove a package from package.json manually and `npm prune` to remove it from node_modules after.
