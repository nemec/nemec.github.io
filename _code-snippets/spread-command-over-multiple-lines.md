---
layout: snippet
title: Spread a long shell command over multiple lines
tags:
  - bash
  - linux
language: bash
variables:
---

The backslash must be the final character on the line. No whitespace or
comments allowed after. You also cannot place commented lines in the middle
of a multi-line command.

```bash
curl \
    -s \
    -x \
    -H 'User-Agent: hello' \
    https://www.google.com
```