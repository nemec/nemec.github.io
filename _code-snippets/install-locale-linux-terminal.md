---
layout: snippet
title: Install a new locale/language on the Linux terminal
description: Some description
tags:
  - bash
  - linux
language: bash
variables:
---

Source: <https://www.thomas-krenn.com/en/wiki/Configure_Locales_in_Ubuntu>

```bash
locale-gen en_US.UTF-8
update-locale LANG=en_US.UTF-8
```