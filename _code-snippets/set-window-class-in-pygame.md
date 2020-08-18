---
layout: snippet
title: Set window class in a PyGame program
tags:
  - bash
  - linux
  - pygame
language: python
variables:
  $FILENAME:
    #type: date # https://www.w3schools.com/html/html_form_input_types.asp
    replace: $FILENAME
    #attrs:
    #  min: '2020-08-01'
---

Place this at the very top of your main script file.

via <https://github.com/pygame/pygame/issues/71>

```bash
import os
os.environ['SDL_VIDEO_X11_WMCLASS'] = 'my_class'
```