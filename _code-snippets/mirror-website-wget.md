---
layout: snippet
title: Make an offline mirror of a website with wget
tags:
  - bash
  - linux
  - wget
language: bash
variables:
  $FILENAME:
    #type: date # https://www.w3schools.com/html/html_form_input_types.asp
    replace: $WEBSITE
    #attrs:
    #  min: '2020-08-01'
---

This snippet comes from Guy Rutenberg's blog: <https://www.guyrutenberg.com/2014/05/02/make-offline-mirror-of-a-site-using-wget/>

```bash
wget --mirror --convert-links --adjust-extension --page-requisites "$WEBSITE"
```

