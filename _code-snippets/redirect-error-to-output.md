---
layout: snippet
title: Redirect error text to standard output
tags:
  - bash
  - linux
language: bash
variables:
  $CMD:
---

<https://www.cyberciti.biz/faq/redirecting-stderr-to-stdout/>

```bash
$CMD 2>&1
```