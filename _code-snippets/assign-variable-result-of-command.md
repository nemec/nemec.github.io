---
layout: snippet
title: Assign a variable to the result of a command
tags:
  - bash
  - linux
language: bash
variables:
---

```bash
NEW_IP=$(curl -4 -s -X GET "https://icanhazip.com");
```