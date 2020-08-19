---
layout: snippet
title: Loop through lines in a file
tags:
  - bash
  - linux
language: bash
variables:
---

```bash
while read line; do
    echo "Line data: $line";
done < data.txt
```