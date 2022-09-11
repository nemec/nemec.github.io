---
layout: snippet
title: Running npm install on IPv4-only network and latest Node.js
description: The latest versions of Node.js prevent npm install from working on IPv4-only networks. Here is how to fix it.
tags:
  - nodejs
  - npm
language: bash
---

As of Node.js 17 or so, there have been internal changes to parameter defaults
intended to enable support for IPv6-only networks, but in the proccess it seems
like it's broken networks that are IPv4-only. This results in the following error
when trying to install npm packages from the public repo on node 17+:

{:.ignore}
```
npm ERR! errno ECONNREFUSED
npm ERR! FetchError: request to https://registry.npmjs.org/{package} failed,
  reason: connect ECONNREFUSED {ipv6-addr}:443
```

The exact change can be found in [this pull request](https://github.com/nodejs/node/pull/39987),
and we can revert back to the previous behavior by adding a new CLI argument.
Since npm does not offer a way to natively override its node parameters (afaik),
we can create an alias that starts node and then calls npm with the argument enabled.

There are two options you can follow. The first is to update your `.nmprc` file and
the second is to replace your `npm` command with an alias that includes the argument.
Note that both options override all uses of NPM. If you use NVM to manage multiple
versions of Node.js these commands will crash if you use a very old version of
Node (e.g. v12). With this particular issue you can just comment out the change
and NPM will work again, since it only occurs in recent versions of NPM.

### NPM rc

Run the following code snippet to install the override in your `.npmrc`.

```bash
echo "node-options=--max_old_space_size=4096" >> ~/.npmrc
```

### NPM Alias

Run the following code snippet to install the alias into your bashrc file. If
you aren't using Bash, change this to your zshrc or equivalent for your shell.

{:.ignore}
```bash
echo "alias npm='node --dns-result-order=ipv4first /usr/bin/npm'" >> ~/.bashrc
```
