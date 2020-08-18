---
layout: snippet
title: Extract a match from grep and remove extra information from the line output
tags:
  - bash
  - linux
  - grep
language: bash
variables:
---

The 'STATIC' variable must contain the exacct text that you want to search for.
That same text will be removed from the output of grep.

```bash
STATIC='subreddit_subscribers": '
curl -s -H 'User-Agent: custom' https://www.reddit.com/r/askreddit.json | \
  grep -o -E "${STATIC}[0-9]+" | sed "s/${STATIC}//" | head -n 1
```