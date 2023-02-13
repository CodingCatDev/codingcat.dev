---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1616547566/main-codingcatdev-photo/wsuyn79owuntcukcwtkg.jpg
devto: https://dev.to/codingcatdev/npm-tips-and-tricks-2n18
excerpt: Adding NPM Globally, setting default values for packages, and stopping the dreaded sudo calls.
hashnode: https://hashnode.codingcat.dev/tutorial-npm-tips-and-tricks
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=npm-tips-and-tricks&_id=06b5369e5b7846a9ab2d0f4180e8d526
published: published
slug: npm-tips-and-tricks
start: May 17, 2022
title:  NPM Tips and Tricks
youtube: https://youtu.be/eWc0bg9KMQQ
---
## NPM Global install fail

Ever get the dreaded EACCES error after running npm install -g? You're not alone!

You will notice that npm is trying to install its packages to this path:

Missing write access to /usr/local/lib/node_modules

We need to change this to a better path that you have the rights to upate.

## .npmrc update

using vim or nano update your local .npmrc file

`vim ~/.npmrc`

Update this file with the below, this will tell npm to install packages locally to .npm-packages

```
prefix=${HOME}/.npm-packages
```

## NPM Global install success

Once you change the .npmrc file, you will begin to install packages to ~/.npm-packages. No more issues

![https://media.codingcat.dev/image/upload/v1657636635/main-codingcatdev-photo/85977596-b94f-4bce-b13e-4dda85cdc944.jpg](https://media.codingcat.dev/image/upload/v1657636635/main-codingcatdev-photo/85977596-b94f-4bce-b13e-4dda85cdc944.jpg)

# NPM init defaults

If you start projects using npm often enough you will want to default some of the authoring items. The basic syntax is `npm config set init.*`

> Don't stress out if you are updating using npm config set while in a different directory this will still update in ~/.npmrc
> 

```bash
npm config set init.author.name "Alex Patterson" 
npm config set init.author.email "developer@ajonp.com" 
npm config set init.author.url "https://ajonp.com/" 
npm config set init.license "MIT" 
npm config set init.version "0.0.1"
```

Now our full .npmrc will look like:

```
prefix=/Users/ajonp/.npm-packages init.author.name=Alex Patterson init.author.email=developer@ajonp.com init.author.url=https://ajonp.com/ init.license=MIT init.version=0.0.1

```

Executing npm init will produce the following just by hitting enter.

```json
{
    "name": "npm-sample",
    "version": "0.0.1",
    "description": "Sample NPM",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "Alex Patterson <developer@ajonp.com> (https://ajonp.com/)",
    "license": "MIT"
}

```

# Setting NPM registry

At work we have a VSTS (aka Visual Studio aka DevOps) private npm registry so it becomes important to use `npm config set registry`

```
https://<company>.pkgs.visualstudio.com/_packaging/<company>/npm/registry/

```

Which will result in updating .npmrc with

```
registry=https://<company>.pkgs.visualstudio.com/_packaging/<company>/npm/registry/

```

There is a great [medium article](https://medium.com/@shemseddine/private-npm-package-deployment-using-vsts-92e19668f7d3) on setting up VSTS npm.

# Setting NPM loglevel

Probably my favorite setting of all is `npm config set loglevel="warn"`, this allows me to see any output and only the warnings. There are several different levels in the [npm docs](https://docs.npmjs.com/misc/config), you execute any of them by running something like below:

```
npm i -g ionic -s --silent: --loglevel silent -q, --quiet: --loglevel warn -d: --loglevel info -dd, --verbose: --loglevel verbose -ddd: --loglevel silly

```