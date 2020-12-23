---
layout: snippet
published: false # REMOVE ME
title: grep files with long lines and extract N characters of context around the match
tags:
  - bash
  - linux
  - grep
language: bash
variables:
  search_str:
    replace: $search_str
  num_lines:
    replace: '10'
---

```bash
N=10; grep -nroP ".{0,$N}$search_str.{0,$N}" file.sql
```