---
layout: snippet
title: Display information about the currently active/focused window
description: This can be run from a background process to find the actively focused window
tags:
  - bash
  - linux
  - xdotool
language: bash
variables:
---

Requires the application xdtool (can be installed on Ubuntu with 'sudo apt install xdotool').

```bash
xdotool getactivewindow | xargs xprop -id
```