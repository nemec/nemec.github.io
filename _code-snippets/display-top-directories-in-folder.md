---
layout: snippet
title: Display the top 20 directories in the current folder sorted by file count
tags:
  - bash
  - linux
  - find
language: bash
variables:
---

https://askubuntu.com/a/316194/80308

```bash
find . -maxdepth 1 -type d -print0 2>/dev/null | while IFS= read -r -d '' file; do 
    echo -e `ls -A "$file" 2>/dev/null | wc -l` "files in:\t $file"
done | sort -nr | head -n20 | awk '{print NR".", "\t", $0}'
```