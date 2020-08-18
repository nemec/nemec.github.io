---
layout: snippet
title: Find a process by keyword and display the owner, process ID, and command
tags:
  - bash
  - linux
  - ps
language: bash
variables:
  $KEYWORD:
---

```bash
ps aux | grep $KEYWORD
```