---
layout: snippet
title: Find largest directories in Bash
tags:
  - bash
  - linux
language: bash
variables:
  $DIRECTORY:
    #type: date # https://www.w3schools.com/html/html_form_input_types.asp
    replace: .
    #attrs:
    #  min: '2020-08-01'
---

Max depth of 1 level:

```bash
du --max-depth=1 .
```

Exclude directories:

```bash
du --exclude tmp .
```