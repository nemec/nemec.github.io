---
layout: snippet
title: Count file extensions in directory
description: This command will list all file extensions found in the current
  directory or subdirectories sorted by the count per extension.
tags:
  - bash
  - linux
  - find
language: bash
variables:
---

via <https://www.2daygeek.com/how-to-count-files-by-extension-in-linux/>

```bash
find . -type f | sed -n 's/..*\.//p' | sort | uniq -c
```