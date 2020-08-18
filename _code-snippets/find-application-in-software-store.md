---
layout: snippet
title: Find an application to install from Ubuntu's software store (apt)
tags:
  - bash
  - linux
  - apt
language: bash
variables:
  $KEYWORD
---

The keyword can be a program name or a keyword that describes the software.

```bash
apt search $KEYWORD
```