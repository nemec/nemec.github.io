---
layout: snippet
title: Extract redirect destination from a shortlink
tags:
  - bash
  - linux
  - curl
language: bash
variables:
  $URL:
    replace: http://bit.ly/1sNZMwL
---

```bash
curl -s -v http://bit.ly/1sNZMwL 2>&1 \
  | grep -o -E 'Location: .+' \
  | sed 's/Location: //'
```