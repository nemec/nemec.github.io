---
layout: snippet
title: Search for email domains in a set of text files and find the most popular
description: Some description
tags:
  - bash
  - linux
  - osint
language: bash
variables:
  Data folder:
    replace: '/home/me/leaks'
  Regex:
    replace: '@\w+\.com'
---

Requires ripgrep.

```bash
rg --no-filename -N -i "^.*?(@\w+\.com).*?$" '/home/me/leaks' -r '$1' > hosts.txt
grep -v WARNING hosts.txt | sort -f | uniq -ci | sort -rn > uniq_hosts.txt
```