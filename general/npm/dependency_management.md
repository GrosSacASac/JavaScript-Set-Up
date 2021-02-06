# Dependency Management

## Slides

Original slides in [./presentation/dm.html](https://github.com/GrosSacASac/JavaScript-Set-Up/blob/master/general/npm/presentation/dm.html)

## What

Dependency management is the natural evolution of copy pasting code.

First we write software, then we start a new project. We copy code from the first project. Ok now we fix a bug. we copy the fix back to the first project. Then we start a new project. It has some common parts of first and second project. We evolve those "internal dependencies". We manually copy paste. Be it with CLI or GUI it does not scale and is error prone.

To solve this solution we make a simple scripts that copies everything for us. Then we scale the team. Maybe someone uses Linux, another uses windows. The path are different. It does not scale across team members. And how does a team-mate copy updated dependency utils or http to your project 1, which they don't have access to.

Thus arises an industry standard tool to manage dependencies in a self contained, independently upgradable, versioned way. Enter npm, pip cargo area.

Individual projects have a manifest file (package.json) that declares dependency+version couples. Each dependency is a self contained project. Other project depend on a certain version or version range. It scales across teams, only business logic agnostic dependencies are shared.

## About npm

Using npm as an example, but almost everything is the same with others.

### What is npm 

### npm cli

The software that comes installed with Node.js, it allows to run commands to install, uninstall, update dependencies against a given registry.

### npm registry

A giant database available at https://registry.npmjs.org/ , that stores all public packages

### npm website https://www.npmjs.com/

Create account to publish, search packages, documentation and blog

### npm inc

A private company that attracts investors

## How to publish a package

 * Have an account
 * Have something to publish
 * type npm publish

### Minimal requirements

 * package.json with name (lux-yo-2019)
 * version (1.0.0)
 * at least one file

## Use a package as a dependency

 * Have a project with a package.json
 * npm i lux-yo-2019
 * Use it in your code
 * const luxYo2019 = require("lux-yo-2019");
 * optional (-D -g)

## Evolve a package locally

 * Install from file (it creates sys-link)
 * npm i ../lux-yo-2019
 * Make a change
 * Changes are reflected instantly because it is a fs shortcut
 * Test
 * Publish as new version
 * Document it
 * Use new version npm update
 
### when urgent use patch-package

This allows to patch dependencies, those patches themselves can be shared. It does not work on transformed or compiled code.

## Security

These tools makes us so productive that we can forget that with one command we can install thousands of packages. But it still is only glorified copy paste. And pasted code should be reviewed.

A lockfile describes the exact versions we have. The manifest file describes version ranges that we want. A lockfile prevents to accidently install a new version without manually doing so. Especially useful in teams. Updating a dependency should be reviewed with the same scrutiny than an install. There are tools to show the diff between two versions. To install a package safely for inspection purposes use the --ignore-scripts flag.

Once a package is reviewed consider using https://github.com/dpc/crev to mark it as safe for your trusted network.

### Avoid uploading too much

Use a files array in package.json to have a explicit whitelist. Use npm pack to have a preview before doing npm publish.

### Locking the dependencies of the dependencies

To fully lock dependencies inside a package use shrinkwrap.json instead of package-lock.json.

## Private packages

 * npm enterprise
 * nexus (Does it still work ?)
 

## Alternatives

### yarn
    additional features (workspaces), healthy competition, more emojis, faster ?
    
### yarn PnP (v2 ?), npm tink
    Dev-tools only , break things and move fast
    
### pnpm
    Stores node_modules better for computer storage
    
### deno
    Alternative to NodeJs, uses direct URLs inside imports, default TS support
    
### entropic
    Federated registry, file based, not ready yet
    
###  Bit https://bit.dev/components
    Opinionated and goal focused

