---
layout: snippet
published: false # REMOVE ME
title: Making a file executable on Linux
description: Some description
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

{:.ignore}
```plaintext
Ignore this when copying scripts
```