---
layout: snippet
title: Send a keypress to a process by Window Class
tags:
  - bash
  - linux
language: bash
variables:
  $WINDOW_CLASS:
  $KEY:
---

Requires the application xdtool (can be installed on Ubuntu with 'sudo apt install xdotool').

You can find the window class [here]({{ site.url }}{% link _code-snippets/find-window-class-for-window.md %}).

There is a comprehensive list of keys that can be found [here](https://gitlab.com/cunidev/gestures/-/wikis/xdotool-list-of-key-codes) or [here](https://cgit.freedesktop.org/xorg/proto/x11proto/plain/keysymdef.h).

```bash
xdotool search --onlyvisible --class $WINDOW_CLASS key --clearmodifiers $KEY
```