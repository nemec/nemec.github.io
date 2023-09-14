---
layout: snippet
title: Scrape a list of URLs and print the status code returned
tags:
  - bash
  - linux
  - curl
language: bash
variables:
---

```bash
for x in {10..12}; do
  page="https://example.com/$x";
  echo -n "$page ";
  curl -Is "$page" 2>/dev/null | head -n 1|cut -d$' ' -f2;
done
```