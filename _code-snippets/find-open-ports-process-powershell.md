---
layout: snippet
title: Find open ports for a process
tags:
  - powershell
  - windows
language: powershell
variables:
  Process ID:
    replace: 5380
---

```bash
netstat -ano | Select-String 5380 
```