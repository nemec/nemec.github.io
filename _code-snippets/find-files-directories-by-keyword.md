---
layout: snippet
title: Find files or directories containing keyword
tags:
  - bash
  - linux
  - find
language: bash
variables:
  $KEYWORD:
---

```bash
find . -iname "*$KEYWORD*"
```