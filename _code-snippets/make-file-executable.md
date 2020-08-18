---
layout: snippet
title: Make a file or script executable on Linux
tags:
  - bash
  - linux
language: bash
variables:
  $FILENAME:
    #type: date # https://www.w3schools.com/html/html_form_input_types.asp
    replace: $FILENAME
    #attrs:
    #  min: '2020-08-01'
---

```bash
chmod +x $FILENAME
```