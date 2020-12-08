---
title: "NPM Tips and Tricks"
date: "2018-12-01"
---

https://youtu.be/eWc0bg9KMQQ

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

![](data:image/jpeg;base64,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)![npm install success](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1543984849/ajonp-ajonp-com/3-lesson-npm/npm-packages.png)

# NPM init defaults

If you start projects using npm often enough you will want to default some of the authoring items. The basic syntax is `npm config set init.*`

> Don't stress out if you are updating using npm config set while in a different directory this will still update in ~/.npmrc

```
npm config set init.author.name "Alex Patterson" npm config set init.author.email "developer@ajonp.com" npm config set init.author.url "https://ajonp.com/" npm config set init.license "MIT" npm config set init.version "0.0.1"
```

Now our full .npmrc will look like:

```
prefix=/Users/ajonp/.npm-packages init.author.name=Alex Patterson init.author.email=developer@ajonp.com init.author.url=https://ajonp.com/ init.license=MIT init.version=0.0.1
```

Executing npm init will produce the following just by hitting enter.

```
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

At work we have a VSTS (aka Visual Studio aka DevOps) private npm registry so it becomes important to use `npm config set registry`

```
https://<company>.pkgs.visualstudio.com/_packaging/<company>/npm/registry/
```

Which will result in updating .npmrc with

```
registry=https://<company>.pkgs.visualstudio.com/_packaging/<company>/npm/registry/
```

There is a great [medium article](https://medium.com/@shemseddine/private-npm-package-deployment-using-vsts-92e19668f7d3) on setting up VSTS npm.

# Setting NPM loglevel

Probably my favorite setting of all is `npm config set loglevel="warn"`, this allows me to see any output and only the warnings. There are several different levels in the [npm docs](https://docs.npmjs.com/misc/config), you execute any of them by running something like below:

```
npm i -g ionic -s --silent: --loglevel silent -q, --quiet: --loglevel warn -d: --loglevel info -dd, --verbose: --loglevel verbose -ddd: --loglevel silly
```
