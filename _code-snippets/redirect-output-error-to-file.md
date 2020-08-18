---
layout: snippet
title: Redirect standard and error output from a command to a file
description: Some description
tags:
  - bash
  - linux
language: bash
variables:
  $CMD:
  $FILENAME:
---

<https://www.brianstorti.com/understanding-shell-script-idiom-redirect/>

```bash
$CMD > $FILENAME 2>&1
```