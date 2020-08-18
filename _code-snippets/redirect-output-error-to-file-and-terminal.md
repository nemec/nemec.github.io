---
layout: snippet
title: Redirect standard and error output from a command to a file and show it in the terminal
tags:
  - bash
  - linux
language: bash
variables:
  $CMD:
  $FILENAME:
---

<https://www.cyberciti.biz/faq/redirecting-stderr-to-stdout/>

```bash
$CMD 2>&1 | tee $FILENAME
```